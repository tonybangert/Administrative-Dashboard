/**
 * Slack integration — fetch recent messages from a channel using Bot token.
 * Uses conversations.history to get last 10 messages, with 15-min cache.
 */

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

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

export async function fetchSlackMessages(botToken, channelId, forceRefresh = false) {
  if (!botToken || !channelId) {
    return { messages: [], channelName: null, cached: false, fetchedAt: 0, error: "Slack not configured" };
  }

  const now = Date.now();
  if (!forceRefresh && messagesCache.messages && (now - messagesCache.fetchedAt) < CACHE_TTL_MS) {
    return { messages: messagesCache.messages, channelName: messagesCache.channelName, cached: true, fetchedAt: messagesCache.fetchedAt, error: null };
  }

  try {
    const [messages, channelName] = await Promise.all([
      fetchMessages(botToken, channelId),
      messagesCache.channelName || fetchChannelInfo(botToken, channelId),
    ]);
    messagesCache = { messages, fetchedAt: now, channelName };
    return { messages, channelName, cached: false, fetchedAt: now, error: null };
  } catch (err) {
    if (messagesCache.messages) {
      return { messages: messagesCache.messages, channelName: messagesCache.channelName, cached: true, fetchedAt: messagesCache.fetchedAt, error: err.message };
    }
    return { messages: [], channelName: null, cached: false, fetchedAt: 0, error: err.message };
  }
}
