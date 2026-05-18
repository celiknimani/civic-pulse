// MCP tool bundle exposing civic-pulse fetch + write primitives to the Claude Agent SDK.
// Used by the autonomous subagent path (when a human spawns civic-pulse-ingestion from
// Claude Code). The cron orchestrator at agent/src/agents/ingestion.mjs calls these
// helpers directly and does not need the MCP server.

import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { fetchHtml } from './fetch-html.mjs';
import { fetchRss } from './fetch-rss.mjs';
import { fetchPdf } from './fetch-pdf.mjs';
import { fetchSearch } from './fetch-search.mjs';
import { writeChangeset } from './write-changeset.mjs';

const wrap = (name, description, schema, handler) =>
  tool(name, description, schema, async (args) => {
    const result = await handler(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  });

export const civicPulseToolServer = createSdkMcpServer({
  name: 'civic-pulse-tools',
  version: '0.1.0',
  tools: [
    wrap(
      'fetch_html',
      'Fetch an HTML page and return its plain-text body, stripping nav/script/style.',
      { url: z.string().url(), maxChars: z.number().int().positive().optional() },
      async ({ url, maxChars }) => fetchHtml(url, { maxChars }),
    ),
    wrap(
      'fetch_rss',
      'Fetch an RSS or Atom feed and return its recent items as concatenated text.',
      {
        url: z.string().url(),
        maxItems: z.number().int().positive().optional(),
        maxChars: z.number().int().positive().optional(),
      },
      async ({ url, maxItems, maxChars }) => fetchRss(url, { maxItems, maxChars }),
    ),
    wrap(
      'fetch_pdf',
      'Fetch a PDF and return its extracted text via pdf-parse.',
      { url: z.string().url(), maxChars: z.number().int().positive().optional() },
      async ({ url, maxChars }) => fetchPdf(url, { maxChars }),
    ),
    wrap(
      'fetch_search',
      'Run a web search for a query (typically a promise title) via Anthropic web_search or Brave Search; fetch each result page and return the concatenated text.',
      {
        query: z.string(),
        maxChars: z.number().int().positive().optional(),
        maxResults: z.number().int().positive().optional(),
      },
      async ({ query, maxChars, maxResults }) => fetchSearch(query, { maxChars, maxResults }),
    ),
    wrap(
      'write_changeset',
      'Persist a validated extraction payload to countries/<COUNTRY>/pending/<runId>-<sourceId>-<skill>.json',
      {
        countryRoot: z.string(),
        runId: z.string(),
        sourceId: z.string(),
        skillName: z.string(),
        payload: z.record(z.any()),
      },
      async (args) => ({ writtenAt: await writeChangeset(args) }),
    ),
  ],
});
