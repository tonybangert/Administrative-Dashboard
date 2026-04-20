/**
 * Obsidian vault → Quick Actions "To Do" data source.
 *
 * Reads markdown files from the user's Obsidian GitHub repo via GitHub's
 * API, parses checkbox-style todos tagged with #status/follow-up, and
 * returns them in a shape the dashboard can render.
 *
 * Used in two places:
 *   - Vite dev middleware (registered in vite.config.js)
 *   - Vercel serverless handler (api/obsidian-vault.js wraps this)
 */

const TARGET_TAG = "status/follow-up";
const TAG_RE = /#([a-zA-Z0-9][a-zA-Z0-9_\-/]*)/g;
const CACHE_TTL_MS = 60 * 1000;

let cache = { data: null, fetchedAt: 0 };

/**
 * Parse one markdown line into a todo object, or null.
 *
 * A line qualifies as a todo iff:
 *   - It starts (after optional leading whitespace) with a markdown task
 *     checkbox: "- [ ]" (unchecked) or "- [x]" (checked, case-insensitive)
 *   - AND contains the tag "#status/follow-up"
 *
 * Reference inputs from the user's vault:
 *   "- [ ] Ron at Stringer #status/follow-up"
 *      → { text: "Ron at Stringer", completed: false,
 *          tags: ["status/follow-up"], source: { file, line } }
 *
 *   "- [x] Called Steve back #status/follow-up #client/rmt"
 *      → { text: "Called Steve back", completed: true,
 *          tags: ["status/follow-up", "client/rmt"], source: { file, line } }
 *
 *   "#client/ck-marketing #status/follow-up HubSpot Insights:"
 *      → null  (not a checkbox — it's a section header)
 */
export function parseLine({ line, filePath, lineNumber }) {
  const tags = [...line.matchAll(TAG_RE)].map((m) => m[1]);
  if (!tags.includes(TARGET_TAG)) return null;

  const checkboxMatch = line.match(/^\s*- \[( |x|X)\]\s+(.*)$/);
  const isCheckbox = !!checkboxMatch;
  const completed = isCheckbox && checkboxMatch[1].toLowerCase() === "x";

  const body = isCheckbox
    ? checkboxMatch[2]
    : line.replace(/^\s*(?:[-*+]|\d+\.)\s+/, "");

  let text = body.replace(TAG_RE, "").replace(/\s+/g, " ").trim();
  let isNoteHeader = false;

  // Tag-only line (no text after stripping tags): Obsidian convention for
  // marking the whole note with a status. Fall back to the filename.
  if (!text) {
    const fileName = filePath.split("/").pop().replace(/\.md$/, "");
    text = fileName;
    isNoteHeader = true;
  }

  return {
    text,
    completed,
    isCheckbox,
    isNoteHeader,
    tags,
    source: { file: filePath, line: lineNumber },
  };
}

async function githubFetch(url, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "admin-dashboard-obsidian",
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function githubFetchRaw(url, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.raw",
      "User-Agent": "admin-dashboard-obsidian",
    },
  });
  if (!res.ok) throw new Error(`GitHub raw ${res.status}`);
  return res.text();
}

/**
 * List EVERY markdown file in the vault via the git tree API.
 *
 * Why tree API instead of code search:
 *   - Code search has a ~minutes-long indexing lag after commits, which means
 *     recently-tagged items can go missing right when you need them.
 *   - Code search also only returns files containing the exact tag string —
 *     it skips files where the tag is present but formatted unusually.
 *   - Tree API gives us a complete, real-time snapshot. We scan every .md
 *     file's content ourselves, which is authoritative.
 *
 * One tree request (returns all 80ish files), plus N parallel content
 * fetches. With the 5-minute cache, this hits GitHub about 12 times/hour max.
 */
async function listAllMarkdownFiles({ owner, repo, token }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
  const data = await githubFetch(url, token);
  return (data.tree || [])
    .filter((t) => t.type === "blob" && t.path.endsWith(".md"))
    .map((t) => t.path);
}

async function fetchFileLines({ owner, repo, path, token }) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  const content = await githubFetchRaw(url, token);
  return content.split(/\r?\n/);
}

/**
 * Main entry — returns { todos, lastFetched, cached }.
 * Uses a 5-minute in-memory cache to limit GitHub API usage.
 */
export async function fetchObsidianTodos({ forceRefresh = false } = {}) {
  const owner = process.env.OBSIDIAN_VAULT_OWNER;
  const repo = process.env.OBSIDIAN_VAULT_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error(
      "Missing required env vars: GITHUB_TOKEN, OBSIDIAN_VAULT_OWNER, OBSIDIAN_VAULT_REPO"
    );
  }

  if (
    !forceRefresh &&
    cache.data &&
    Date.now() - cache.fetchedAt < CACHE_TTL_MS
  ) {
    return { ...cache.data, cached: true };
  }

  const paths = await listAllMarkdownFiles({ owner, repo, token });

  const todos = [];
  const fileResults = await Promise.all(
    paths.map(async (path) => {
      try {
        const lines = await fetchFileLines({ owner, repo, path, token });
        return { path, lines };
      } catch (err) {
        return { path, lines: [], error: err.message };
      }
    })
  );

  for (const { path, lines } of fileResults) {
    lines.forEach((line, idx) => {
      const parsed = parseLine({
        line,
        filePath: path,
        lineNumber: idx + 1,
      });
      if (parsed) todos.push(parsed);
    });
  }

  const data = {
    todos,
    lastFetched: new Date().toISOString(),
  };
  cache = { data, fetchedAt: Date.now() };
  return { ...data, cached: false };
}
