import { fetchObsidianTodos } from "../server/obsidian.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const forceRefresh = req.method === "POST";
    const result = await fetchObsidianTodos({ forceRefresh });
    res.status(200).end(JSON.stringify(result));
  } catch (err) {
    res.status(500).end(
      JSON.stringify({
        todos: [],
        lastFetched: null,
        cached: false,
        error: err.message,
      })
    );
  }
}
