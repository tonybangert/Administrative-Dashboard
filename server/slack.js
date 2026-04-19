/**
 * Slack integration — fetch recent messages from the bot's DM with Tony.
 * Messages Tony sends in the "@Daily Ops Command" DM flow into the
 * dashboard's Notes card.
 *
 * Config (set in .env / Vercel env vars):
 *   SLACK_BOT_TOKEN   — bot token (xoxb-...) with im:history scope
 *   SLACK_DM_CHANNEL  — DM channel ID (starts with "D..."), e.g. D0ANB4F979U
 *   SLACK_USER_ID     — Tony's user ID (U...), used to filter OUT bot echoes
 *
 * Required Slack bot scopes: `im:history` (read DM messages).
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
    // In a 1:1 DM with the bot, everything that's NOT a bot message or a
    // system subtype (channel_join, etc.) is from the human user.
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

export async function fetchSlackMessages(botToken, dmChannelId, forceRefresh = false) {
  if (!botToken || !dmChannelId) {
    return {
      messages: [],
      channelName: null,
      cached: false,
      fetchedAt: 0,
      error: "Slack not configured (missing SLACK_BOT_TOKEN or SLACK_DM_CHANNEL)",
    };
  }

  const now = Date.now();
  if (
    !forceRefresh &&
    cache.messages &&
    now - cache.fetchedAt < CACHE_TTL_MS
  ) {
    return {
      messages: cache.messages,
      channelName: "DM",
      cached: true,
      fetchedAt: cache.fetchedAt,
      error: null,
    };
  }

  try {
    const messages = await fetchDmMessages(botToken, dmChannelId);
    cache = { messages, fetchedAt: now };
    return {
      messages,
      channelName: "DM",
      cached: false,
      fetchedAt: now,
      error: null,
    };
  } catch (err) {
    if (cache.messages) {
      return {
        messages: cache.messages,
        channelName: "DM",
        cached: true,
        fetchedAt: cache.fetchedAt,
        error: err.message,
      };
    }
    return {
      messages: [],
      channelName: null,
      cached: false,
      fetchedAt: 0,
      error: err.message,
    };
  }
}
