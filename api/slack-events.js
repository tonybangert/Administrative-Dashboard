/**
 * Slack Events API endpoint.
 *
 * Purpose: satisfy Slack's "is someone listening?" check so DMs to the bot
 * are allowed. We poll the DM via conversations.history elsewhere, so this
 * endpoint doesn't need to DO anything with events — it just needs to
 * (a) pass Slack's URL verification handshake, and
 * (b) return 200 quickly for any event_callback.
 *
 * If we ever want to react to events in real time, this is where that logic
 * would go. For now, intentionally no-op on event delivery.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};

  // URL verification: Slack sends { type: "url_verification", challenge: "..." }
  // once when the Request URL is first saved. Echo the challenge back.
  if (body.type === "url_verification") {
    return res.status(200).json({ challenge: body.challenge });
  }

  // Event callback: acknowledge with 200 and move on. Slack retries on
  // non-200 responses, so keep this fast.
  return res.status(200).json({ ok: true });
}
