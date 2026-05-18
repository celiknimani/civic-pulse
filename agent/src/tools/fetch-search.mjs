// Web search adapter — given a query (typically a promise title), retrieves recent
// matching documents from a search backend and concatenates their text for the
// ingestion orchestrator.
//
// Supported backends (auto-detected by env var):
//
// 1. Anthropic web_search tool — preferred when ANTHROPIC_API_KEY is set. Issues
//    a single Claude API call with the web_search tool enabled and asks for
//    recent results with citations.
// 2. Brave Search API — when BRAVE_SEARCH_API_KEY is set. Standard REST search.
// 3. Manual override — when AGENT_SEARCH_BACKEND=disabled, the adapter throws
//    so the orchestrator can skip the source cleanly.

import Anthropic from '@anthropic-ai/sdk';
import { fetchHtml } from './fetch-html.mjs';

const USER_AGENT = 'civic-pulse-agent/0.1 (+https://github.com/your-org/civic-pulse)';

const detectBackend = () => {
  const forced = (process.env.AGENT_SEARCH_BACKEND || '').toLowerCase();
  if (forced === 'disabled') return 'disabled';
  if (forced === 'brave' || forced === 'anthropic') return forced;
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.BRAVE_SEARCH_API_KEY) return 'brave';
  return 'disabled';
};

const searchBrave = async (query, { count = 5 } = {}) => {
  const url = new URL('https://api.search.brave.com/res/v1/web/search');
  url.searchParams.set('q', query);
  url.searchParams.set('count', String(count));
  url.searchParams.set('freshness', 'pm');

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY,
      'User-Agent': USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error(`Brave search HTTP ${response.status} for "${query}"`);
  }
  const payload = await response.json();
  const results = payload?.web?.results || [];
  return results.slice(0, count).map((r) => ({
    title: r.title,
    url: r.url,
    snippet: r.description || '',
    publishedAt: r.age || r.page_age || null,
  }));
};

const searchAnthropic = async (query, { count = 5 } = {}) => {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: process.env.AGENT_SEARCH_MODEL || process.env.AGENT_MODEL || 'claude-sonnet-4-6',
    max_tokens: 1024,
    tools: [{ type: 'web_search_20250604', name: 'web_search', max_uses: 3 }],
    messages: [
      {
        role: 'user',
        content: `Find up to ${count} recent (last 90 days) news or official articles about: "${query}". Reply with JSON only: { "results": [{ "title", "url", "snippet", "publishedAt" }] }. No prose.`,
      },
    ],
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < 0) return [];
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    return (parsed.results || []).slice(0, count);
  } catch {
    return [];
  }
};

export const fetchSearch = async (queryOrUrl, { maxChars = 60000, maxResults = 5 } = {}) => {
  const backend = detectBackend();
  if (backend === 'disabled') {
    return {
      url: queryOrUrl,
      title: queryOrUrl,
      text: '[Search adapter disabled. Set ANTHROPIC_API_KEY or BRAVE_SEARCH_API_KEY to enable, or AGENT_SEARCH_BACKEND=disabled to acknowledge.]',
      originalLength: 0,
      fetchedAt: new Date().toISOString(),
      skipped: true,
    };
  }

  const query = queryOrUrl;
  const results = backend === 'anthropic'
    ? await searchAnthropic(query, { count: maxResults })
    : await searchBrave(query, { count: maxResults });

  const fetchedPages = [];
  for (const result of results) {
    if (!result?.url) continue;
    try {
      const page = await fetchHtml(result.url, { maxChars: Math.floor(maxChars / Math.max(results.length, 1)) });
      fetchedPages.push({ ...result, body: page.text, originalLength: page.originalLength });
    } catch (error) {
      fetchedPages.push({ ...result, body: `[fetch failed: ${error.message}]`, originalLength: 0 });
    }
  }

  const composed = fetchedPages
    .map((page) => {
      const header = [
        page.title || '(untitled)',
        page.url,
        page.publishedAt ? `published: ${page.publishedAt}` : null,
        page.snippet ? `snippet: ${page.snippet}` : null,
      ]
        .filter(Boolean)
        .join('\n');
      return `--- RESULT ---\n${header}\n\n${page.body}`;
    })
    .join('\n\n');

  const truncated = composed.length > maxChars ? `${composed.slice(0, maxChars)}\n\n[TRUNCATED]` : composed;

  return {
    url: `search:${query}`,
    title: `Search: ${query}`,
    text: truncated,
    originalLength: composed.length,
    resultCount: fetchedPages.length,
    fetchedAt: new Date().toISOString(),
    backend,
  };
};
