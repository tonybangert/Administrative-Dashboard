/**
 * Aplora Sales proxy — forwards /api/aplora/* requests to the Render backend.
 * Handles GET, POST, PATCH, DELETE with body forwarding.
 */

export async function proxyAploraRequest(req, res, path) {
  const baseUrl = process.env.APLORA_API_URL;
  if (!baseUrl) {
    res.statusCode = 503;
    res.end(JSON.stringify({ error: "APLORA_API_URL not configured" }));
    return;
  }

  const targetUrl = `${baseUrl}${path}`;
  const headers = { "Content-Type": "application/json" };

  try {
    let body = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data || undefined));
      });
    }

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const data = await upstream.text();
    res.statusCode = upstream.status;
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.end(data);
  } catch (err) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: `Proxy error: ${err.message}` }));
  }
}
