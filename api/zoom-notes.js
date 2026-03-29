/**
 * Vercel serverless function for /api/zoom-notes
 * Mirrors server/zoom.js logic for production deployment.
 */

const TOKEN_TTL_MS = 55 * 60 * 1000;
const NOTES_TTL_MS = 2 * 60 * 60 * 1000;

let tokenCache = { token: null, expiresAt: 0 };
let notesCache = { notes: null, fetchedAt: 0 };

async function getZoomToken(accountId, clientId, clientSecret) {
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiresAt) return tokenCache.token;

  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const resp = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=account_credentials&account_id=${accountId}`,
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Zoom token error ${resp.status}: ${body}`);
  }

  const data = await resp.json();
  tokenCache.token = data.access_token;
  tokenCache.expiresAt = now + TOKEN_TTL_MS;
  return data.access_token;
}

async function fetchSummaryList(token) {
  const now = new Date();
  const from = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const to = now.toISOString().slice(0, 10);

  const resp = await fetch(
    `https://api.zoom.us/v2/meetings/meeting_summaries?from=${from}&to=${to}&page_size=5`,
    { headers: { "Authorization": `Bearer ${token}` } }
  );
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Zoom summaries error ${resp.status}: ${body}`);
  }
  const data = await resp.json();
  return data.summaries || [];
}

async function fetchSummaryDetail(token, meetingUuid) {
  const encoded = encodeURIComponent(encodeURIComponent(meetingUuid));
  const resp = await fetch(
    `https://api.zoom.us/v2/meetings/${encoded}/meeting_summary`,
    { headers: { "Authorization": `Bearer ${token}` } }
  );
  if (!resp.ok) return null;
  return resp.json();
}

function extractContext(text) {
  if (!text) return "";
  const sentences = text.trim().split(/(?<=[.!?])\s+(?=[A-Z])/);
  const result = sentences.slice(0, 2).map(s => s.replace(/\.$/, "")).join(". ") + ".";
  return result.slice(0, 200);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const accountId = process.env.ZOOM_ACCOUNT_ID || "";
  const clientId = process.env.ZOOM_CLIENT_ID || "";
  const clientSecret = process.env.ZOOM_CLIENT_SECRET || "";

  if (!accountId || !clientId || !clientSecret) {
    return res.json({ notes: [], cached: false, fetchedAt: 0, error: "Zoom not configured" });
  }

  try {
    const now = Date.now();
    const forceRefresh = req.method === "POST";

    if (!forceRefresh && notesCache.notes && (now - notesCache.fetchedAt) < NOTES_TTL_MS) {
      return res.json({ notes: notesCache.notes, cached: true, fetchedAt: notesCache.fetchedAt });
    }

    const token = await getZoomToken(accountId, clientId, clientSecret);
    const summaryList = await fetchSummaryList(token);

    const details = await Promise.allSettled(
      summaryList.map(s => fetchSummaryDetail(token, s.meeting_uuid))
    );

    const notes = [];
    for (const result of details) {
      if (result.status !== "fulfilled" || !result.value) continue;
      const d = result.value;

      const meetingId = String(d.meeting_id || "");
      const start = d.meeting_start_time || "";
      const end = d.meeting_end_time || "";

      let duration = 0;
      if (start && end) duration = Math.round((new Date(end) - new Date(start)) / 60000);

      let dateStr = "";
      if (start) dateStr = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric" });

      notes.push({
        topic: d.meeting_topic || "Untitled Meeting",
        date: dateStr,
        context: extractContext(d.summary_overview || ""),
        meetingId,
        duration,
        link: `https://zoom.us/meeting/${meetingId}/detail`,
      });
    }

    notesCache.notes = notes;
    notesCache.fetchedAt = now;

    res.json({ notes, cached: false, fetchedAt: now });
  } catch (err) {
    res.status(500).json({ notes: [], cached: false, fetchedAt: 0, error: err.message });
  }
}
