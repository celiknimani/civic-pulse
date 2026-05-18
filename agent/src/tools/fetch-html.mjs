import { readCacheEntry, writeCacheEntry, buildConditionalHeaders } from './fetch-cache.mjs';

const USER_AGENT = 'civic-pulse-agent/0.1 (+https://github.com/your-org/civic-pulse)';

const htmlToText = (html) => {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr|section|article)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const extractTitle = (html) => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : '';
};

export const fetchHtml = async (url, { maxChars = 60000 } = {}) => {
  const cached = await readCacheEntry(url);
  const conditional = buildConditionalHeaders(cached);

  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml',
      ...conditional,
    },
    redirect: 'follow',
  });

  if (response.status === 304 && cached) {
    return {
      url,
      title: cached.title || '',
      text: cached.text || '',
      originalLength: cached.originalLength || 0,
      fetchedAt: new Date().toISOString(),
      cached: true,
    };
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const html = await response.text();
  const text = htmlToText(html);
  const truncated = text.length > maxChars ? `${text.slice(0, maxChars)}\n\n[TRUNCATED — original was ${text.length} chars]` : text;
  const title = extractTitle(html);
  const fetchedAt = new Date().toISOString();

  await writeCacheEntry(url, {
    url,
    etag: response.headers.get('etag') || null,
    lastModified: response.headers.get('last-modified') || null,
    title,
    text: truncated,
    originalLength: text.length,
    fetchedAt,
  });

  return {
    url,
    title,
    text: truncated,
    originalLength: text.length,
    fetchedAt,
    cached: false,
  };
};
