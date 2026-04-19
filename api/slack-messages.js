/**
 * Vercel serverless — /api/slack-messages
 *
 * Fetches recent messages from the bot's 1:1 DM with Tony. Mirrors the
 * logic in server/slack.js (the Vite dev middleware).
 *
 * Env vars:
 *   SLACK_BOT_TOKEN    xoxb-... bot token with im:history scope
 *   SLACK_DM_CHANNEL   DM channel ID (starts with "D...")
 */

const CACHE_TTL_MS = 15 * 60 * 1000;

let cache = { messages: null, fetchedAt: 0 };

async function fetchDmMessages(token, dmChannelId) {
  const resp = await fetch(
    `https://slack.com/api/conversations.history?channel=${dmChannelId}&limit=25`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await resp.json();
  if (!data.ok) throw new Error(`conversations.history: ${data.error}`);

  return (data.messages || [])
    // In a 1:1 DM with the bot, everything that's not a bot/system message is
    // from the human user.
    .filter(
      (m) =>
        m.type === "message" &&
        !m.subtype &&
        !m.bot_id &&
        (m.text || "").trim().length > 0
    )
    .map((m) => ({
      ts: m.ts,
      text: m.text,
      user: m.user,
      time: new Date(parseFloat(m.ts) * 1000).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    }));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const botToken = process.env.SLACK_BOT_TOKEN || "";
  const dmChannelId = process.env.SLACK_DM_CHANNEL || "";

  if (!botToken || !dmChannelId) {
    return res.status(200).json({
      messages: [],
      channelName: null,
      cached: false,
      fetchedAt: 0,
      error: "Slack not configured (missing SLACK_BOT_TOKEN or SLACK_DM_CHANNEL)",
    });
  }

  const forceRefresh = req.method === "POST";
  const now = Date.now();

  if (!forceRefresh && cache.messages && now - cache.fetchedAt < CACHE_TTL_MS) {
    return res.status(200).json({
      messages: cache.messages,
      channelName: "DM",
      cached: true,
      fetchedAt: cache.fetchedAt,
      error: null,
    });
  }

  try {
    const messages = await fetchDmMessages(botToken, dmChannelId);
    cache = { messages, fetchedAt: now };
    res.status(200).json({
      messages,
      channelName: "DM",
      cached: false,
      fetchedAt: now,
      error: null,
    });
  } catch (err) {
    if (cache.messages) {
      return res.status(200).json({
        messages: cache.messages,
        channelName: "DM",
        cached: true,
        fetchedAt: cache.fetchedAt,
        error: err.message,
      });
    }
    res.status(500).json({
      messages: [],
      channelName: null,
      cached: false,
      fetchedAt: 0,
      error: err.message,
    });
  }
}
