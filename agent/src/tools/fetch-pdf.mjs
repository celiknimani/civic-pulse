import { PDFParse } from 'pdf-parse';
import { readCacheEntry, writeCacheEntry, buildConditionalHeaders } from './fetch-cache.mjs';

const USER_AGENT = 'civic-pulse-agent/0.1 (+https://github.com/your-org/civic-pulse)';

export const fetchPdf = async (url, { maxChars = 60000 } = {}) => {
  const cached = await readCacheEntry(url);
  const conditional = buildConditionalHeaders(cached);

  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/pdf',
      ...conditional,
    },
    redirect: 'follow',
  });

  if (response.status === 304 && cached) {
    return {
      url,
      title: cached.title || url.split('/').pop() || url,
      text: cached.text || '',
      originalLength: cached.originalLength || 0,
      pages: cached.pages || 0,
      fetchedAt: new Date().toISOString(),
      cached: true,
    };
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  let text = '';
  let pages = 0;
  try {
    const parser = new PDFParse({ data });
    const result = await parser.getText();
    text = (result?.text || '').replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    pages = result?.total || 0;
    await parser.destroy();
  } catch (error) {
    throw new Error(`Failed to parse PDF at ${url}: ${error.message}`);
  }

  const truncated = text.length > maxChars
    ? `${text.slice(0, maxChars)}\n\n[TRUNCATED — original was ${text.length} chars across ${pages} pages]`
    : text;
  const title = url.split('/').pop() || url;
  const fetchedAt = new Date().toISOString();

  await writeCacheEntry(url, {
    url,
    etag: response.headers.get('etag') || null,
    lastModified: response.headers.get('last-modified') || null,
    title,
    text: truncated,
    originalLength: text.length,
    pages,
    fetchedAt,
  });

  return {
    url,
    title,
    text: truncated,
    originalLength: text.length,
    pages,
    fetchedAt,
    cached: false,
  };
};
