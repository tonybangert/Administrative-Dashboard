/**
 * Microsoft Outlook Calendar — OAuth refresh + Graph API calendar fetch.
 * Uses a stored refresh token to get access tokens, then fetches calendarview for next 7 days.
 */

const TOKEN_TTL_MS = 50 * 60 * 1000;   // 50 min (tokens last ~60)
const CACHE_TTL_MS = 30 * 60 * 1000;   // 30 min

let tokenCache = { token: null, expiresAt: 0 };
let eventsCache = { events: null, fetchedAt: 0 };

async function getAccessToken(tenantId, clientId, clientSecret, refreshToken) {
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiresAt) return tokenCache.token;

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
    scope: "https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/User.Read offline_access",
  });

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Outlook token error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  tokenCache = { token: data.access_token, expiresAt: now + TOKEN_TTL_MS };
  return data.access_token;
}

async function fetchCalendarEvents(token) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const startISO = start.toISOString();
  const endISO = end.toISOString();

  const url = `https://graph.microsoft.com/v1.0/me/calendarview?startDateTime=${startISO}&endDateTime=${endISO}&$orderby=start/dateTime&$top=50&$select=subject,start,end,categories,isAllDay,location,webLink`;

  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Graph API error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  return (data.value || []).map(ev => ({
    id: ev.id,
    title: ev.subject,
    start: ev.start.dateTime,
    end: ev.end.dateTime,
    timeZone: ev.start.timeZone,
    isAllDay: ev.isAllDay,
    location: ev.location?.displayName || null,
    categories: ev.categories || [],
    link: ev.webLink,
  }));
}

export async function fetchOutlookCalendar(credentials, forceRefresh = false) {
  const { tenantId, clientId, clientSecret, refreshToken } = credentials;
  if (!clientId || !refreshToken) {
    return { events: [], cached: false, fetchedAt: 0, error: "Outlook not configured" };
  }

  const now = Date.now();
  if (!forceRefresh && eventsCache.events && (now - eventsCache.fetchedAt) < CACHE_TTL_MS) {
    return { events: eventsCache.events, cached: true, fetchedAt: eventsCache.fetchedAt, error: null };
  }

  try {
    const token = await getAccessToken(tenantId, clientId, clientSecret, refreshToken);
    const events = await fetchCalendarEvents(token);
    eventsCache = { events, fetchedAt: now };
    return { events, cached: false, fetchedAt: now, error: null };
  } catch (err) {
    if (eventsCache.events) {
      return { events: eventsCache.events, cached: true, fetchedAt: eventsCache.fetchedAt, error: err.message };
    }
    return { events: [], cached: false, fetchedAt: 0, error: err.message };
  }
}
