/**
 * Vercel serverless proxy for /api/aplora/* requests.
 * Rewrites configured in vercel.json route the path parameter.
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const baseUrl = process.env.APLORA_API_URL;
  if (!baseUrl) {
    return res.status(503).json({ error: "APLORA_API_URL not configured" });
  }

  const aploraPath = req.query.path || "";
  const targetUrl = `${baseUrl}/${aploraPath}`;

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: ["POST", "PATCH", "PUT"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });

    const data = await upstream.text();
    res.status(upstream.status).setHeader("Content-Type", upstream.headers.get("content-type") || "application/json").end(data);
  } catch (err) {
    res.status(502).json({ error: `Proxy error: ${err.message}` });
  }
}
