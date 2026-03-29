/**
 * Vercel serverless function for /api/slack-messages
 * Mirrors server/slack.js logic for production deployment.
 */

const CACHE_TTL_MS = 15 * 60 * 1000;

let messagesCache = { messages: null, fetchedAt: 0, channelName: null };

async function fetchChannelInfo(token, channelId) {
  const resp = await fetch(`https://slack.com/api/conversations.info?channel=${channelId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await resp.json();
  if (!data.ok) throw new Error(`Slack conversations.info: ${data.error}`);
  return data.channel?.name || channelId;
}

async function fetchMessages(token, channelId) {
  const resp = await fetch(`https://slack.com/api/conversations.history?channel=${channelId}&limit=10`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await resp.json();
  if (!data.ok) throw new Error(`Slack conversations.history: ${data.error}`);

  return (data.messages || []).map(msg => ({
    ts: msg.ts,
    text: msg.text || "",
    user: msg.user || "unknown",
    time: new Date(parseFloat(msg.ts) * 1000).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    }),
  }));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const botToken = process.env.SLACK_BOT_TOKEN || "";
    const channelId = process.env.SLACK_CHANNEL_ID || "";

    if (!botToken || !channelId) {
      return res.status(200).json({ messages: [], channelName: null, cached: false, fetchedAt: 0, error: "Slack not configured" });
    }

    const forceRefresh = req.method === "POST";
    const now = Date.now();

    if (!forceRefresh && messagesCache.messages && (now - messagesCache.fetchedAt) < CACHE_TTL_MS) {
      return res.status(200).json({ messages: messagesCache.messages, channelName: messagesCache.channelName, cached: true, fetchedAt: messagesCache.fetchedAt, error: null });
    }

    const [messages, channelName] = await Promise.all([
      fetchMessages(botToken, channelId),
      messagesCache.channelName || fetchChannelInfo(botToken, channelId),
    ]);
    messagesCache = { messages, fetchedAt: now, channelName };

    res.status(200).json({ messages, channelName, cached: false, fetchedAt: now, error: null });
  } catch (err) {
    if (messagesCache.messages) {
      return res.status(200).json({ messages: messagesCache.messages, channelName: messagesCache.channelName, cached: true, fetchedAt: messagesCache.fetchedAt, error: err.message });
    }
    res.status(500).json({ messages: [], channelName: null, cached: false, fetchedAt: 0, error: err.message });
  }
}
