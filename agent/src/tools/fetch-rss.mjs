import { readCacheEntry, writeCacheEntry, buildConditionalHeaders } from './fetch-cache.mjs';

const USER_AGENT = 'civic-pulse-agent/0.1 (+https://github.com/your-org/civic-pulse)';

const decodeEntities = (value) =>
  String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

const extractTag = (xml, tag) => {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(re);
  if (!match) return '';
  let value = match[1].trim();
  const cdata = value.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) value = cdata[1];
  return decodeEntities(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

const parseItems = (xml) => {
  const items = [];
  const itemRegex = /<(item|entry)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const body = match[2];
    items.push({
      title: extractTag(body, 'title'),
      link: extractTag(body, 'link') || (body.match(/<link[^>]*href="([^"]+)"/i)?.[1] || ''),
      pubDate: extractTag(body, 'pubDate') || extractTag(body, 'updated') || extractTag(body, 'published'),
      summary: extractTag(body, 'description') || extractTag(body, 'summary') || extractTag(body, 'content'),
    });
  }
  return items;
};

export const fetchRss = async (url, { maxChars = 60000, maxItems = 30 } = {}) => {
  const cached = await readCacheEntry(url);
  const conditional = buildConditionalHeaders(cached);

  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/rss+xml,application/atom+xml,application/xml,text/xml',
      ...conditional,
    },
    redirect: 'follow',
  });

  if (response.status === 304 && cached) {
    return {
      url,
      title: cached.title || url,
      text: cached.text || '',
      itemCount: cached.itemCount || 0,
      originalLength: cached.originalLength || 0,
      fetchedAt: new Date().toISOString(),
      cached: true,
    };
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const xml = await response.text();
  const items = parseItems(xml).slice(0, maxItems);

  const text = items
    .map((item) => `${item.pubDate ? `[${item.pubDate}] ` : ''}${item.title}\n${item.link}\n${item.summary}`)
    .join('\n\n');

  const truncated = text.length > maxChars ? `${text.slice(0, maxChars)}\n\n[TRUNCATED]` : text;
  const title = extractTag(xml, 'title') || url;
  const fetchedAt = new Date().toISOString();

  await writeCacheEntry(url, {
    url,
    etag: response.headers.get('etag') || null,
    lastModified: response.headers.get('last-modified') || null,
    title,
    text: truncated,
    itemCount: items.length,
    originalLength: text.length,
    fetchedAt,
  });

  return {
    url,
    title,
    text: truncated,
    itemCount: items.length,
    originalLength: text.length,
    fetchedAt,
    cached: false,
  };
};
