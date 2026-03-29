/**
 * Vercel serverless function for /api/ai-news
 * Mirrors server/news.js logic for production deployment.
 */

const RSS_FEEDS = [
  { name: "MIT Tech Review", url: "https://www.technologyreview.com/feed/" },
  { name: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/" },
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { name: "Ars Technica AI", url: "https://feeds.arstechnica.com/arstechnica/technology-lab" },
];

const MAX_PER_FEED = 5;
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;

// Serverless functions can persist memory across warm invocations
let cache = { articles: [], fetchedAt: 0 };

function stripCdata(s) { return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"); }
function stripHtml(s) { return s.replace(/<[^>]+>/g, "").trim(); }

function parseRSSItems(xml, source) {
  const items = [];
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;

  let blocks = [...xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/g)];
  let isAtom = false;
  if (blocks.length === 0) {
    blocks = [...xml.matchAll(/<entry[\s>]([\s\S]*?)<\/entry>/g)];
    isAtom = true;
  }

  for (const block of blocks.slice(0, MAX_PER_FEED)) {
    const content = block[1];
    const titleM = content.match(/<title[^>]*>([\s\S]*?)<\/title>/);
    const title = titleM ? stripCdata(stripHtml(titleM[1])).trim() : "";
    if (!title) continue;

    let url = "";
    if (isAtom) {
      const linkM = content.match(/<link[^>]+href=["']([^"']+)["']/);
      url = linkM ? linkM[1] : "";
    } else {
      const linkM = content.match(/<link[^>]*>([\s\S]*?)<\/link>/);
      url = linkM ? stripCdata(linkM[1]).trim() : "";
    }

    const descM = content.match(/<description[^>]*>([\s\S]*?)<\/description>/)
      || content.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)
      || content.match(/<content[^>]*>([\s\S]*?)<\/content>/);
    let desc = descM ? stripHtml(stripCdata(descM[1])) : "";
    desc = desc.slice(0, 300);

    const dateM = content.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/)
      || content.match(/<updated[^>]*>([\s\S]*?)<\/updated>/)
      || content.match(/<published[^>]*>([\s\S]*?)<\/published>/);
    const dateStr = dateM ? stripCdata(dateM[1]).trim() : "";

    if (dateStr) {
      const parsed = new Date(dateStr).getTime();
      if (!isNaN(parsed) && parsed < cutoff) continue;
    }

    items.push({ title, url, source, description: desc, pubDate: dateStr });
  }
  return items;
}

async function fetchSingleFeed(name, url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "PerformanceLabs-NewsFeed/1.0" },
    });
    clearTimeout(timeout);
    if (!resp.ok) return [];
    const xml = await resp.text();
    return parseRSSItems(xml, name);
  } catch {
    return [];
  }
}

async function fetchAllFeeds() {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(f => fetchSingleFeed(f.name, f.url))
  );
  const articles = [];
  for (const r of results) {
    if (r.status === "fulfilled") articles.push(...r.value);
  }
  return articles;
}

function fallbackRank(articles) {
  return articles.slice(0, 10).map(a => ({
    title: a.title, url: a.url, source: a.source,
    summary: a.description.slice(0, 120),
    relevance: "medium", pubDate: a.pubDate,
  }));
}

async function rankWithClaude(articles, apiKey) {
  if (!articles.length) return [];

  const lines = articles.map((a, i) => {
    let line = `${i}. [${a.source}] ${a.title}`;
    if (a.description) line += `\n   ${a.description.slice(0, 200)}`;
    return line;
  });

  const prompt = `Rank these AI articles by relevance to an AI consulting business focused on:
- Enterprise AI adoption & AI agents for mid-market SaaS companies
- Fractional Data Engineering (FDE) services
- Sales/revenue intelligence and prospecting automation
- Claude/Anthropic ecosystem and LLM tooling

Articles:
${lines.join("\n")}

Return ONLY a JSON array of the top 10 most relevant articles. Format:
[{"index": 0, "summary": "One sentence on why this matters for AI consulting.", "relevance": "high"}]

Relevance levels: "high" = directly about enterprise AI adoption, AI agents, or consulting opportunities. "medium" = general AI industry news with indirect relevance. "low" = tangentially related.
Prefer "high" and "medium" — only use "low" if you must fill 10 slots.`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!resp.ok) return fallbackRank(articles);

    const data = await resp.json();
    const text = data.content?.[0]?.text || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return fallbackRank(articles);

    const ranked = JSON.parse(jsonMatch[0]);
    const result = [];
    for (const entry of ranked.slice(0, 10)) {
      const idx = entry.index;
      if (idx >= 0 && idx < articles.length) {
        result.push({
          title: articles[idx].title, url: articles[idx].url,
          source: articles[idx].source,
          summary: entry.summary || articles[idx].description.slice(0, 100),
          relevance: entry.relevance || "medium",
          pubDate: articles[idx].pubDate,
        });
      }
    }
    return result.length ? result : fallbackRank(articles);
  } catch {
    return fallbackRank(articles);
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const now = Date.now();
    const forceRefresh = req.method === "POST";
    const apiKey = process.env.ANTHROPIC_API_KEY || "";

    if (!forceRefresh && cache.fetchedAt > 0 && (now - cache.fetchedAt) < CACHE_TTL_MS) {
      return res.json({ articles: cache.articles, cached: true, fetchedAt: cache.fetchedAt });
    }

    const raw = await fetchAllFeeds();
    const ranked = apiKey ? await rankWithClaude(raw, apiKey) : fallbackRank(raw);

    cache.articles = ranked;
    cache.fetchedAt = now;

    res.json({ articles: ranked, cached: false, fetchedAt: now });
  } catch (err) {
    res.status(500).json({ articles: [], cached: false, fetchedAt: 0, error: err.message });
  }
}
