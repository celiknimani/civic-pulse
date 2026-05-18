# The ingestion agents

civic-pulse ships **two focused tracking agents** plus an umbrella that runs both. Each consumes a different class of source, produces a different output, and runs on a different cadence.

| Agent | Domain | Sources | Skills | Output | Cadence | CLI |
|---|---|---|---|---|---|---|
| **Promises Tracker** | `promises` | Government press releases, official gazette, ministry pages, trusted news | `extract-promise-update`, `extract-minister-statement` | Pending JSON for promise status/progress changes and minister statements | Daily | `npm run agent:promises` |
| **Deputy Performance Tracker** | `deputies` | Parliament transcripts (PDF / HTML) | `extract-deputy-activity` | Pending JSON for per-speech citations **plus** committed transcript JSONs **plus** rebuilt `public/data/deputies-analytics.json` | Weekly / per-session | `npm run agent:deputies` |
| **Umbrella** | both | union of the above | all three | Combined PR | On demand | `npm run agent:run` |

All three share the same skills, tools, and code path — they differ only in which `extract.tracks` value(s) they consume from `sources.yaml`. **Nothing is auto-merged**: every run opens a PR for human review.

Each agent ships in two execution modes:

| Mode | Entry point | When to use |
|---|---|---|
| Headless / cron | `npm run agent:promises` / `agent:deputies` / `agent:run` → `agent/src/cli.mjs` → `agent/src/agents/ingestion.mjs` | CI, scheduled jobs, deterministic batch ingestion. Uses the base `@anthropic-ai/sdk` directly — no Claude Code dependency. |
| Interactive (Claude Code) | Spawn the `promises-tracker`, `deputy-performance-tracker`, or `civic-pulse-ingestion` subagent, or invoke a `/extract-*` skill directly | Adding a new source, debugging a failing extraction, exploratory updates. Uses the Claude Code SDK toolchain. |

Both paths read the same `.claude/skills/<name>/SKILL.md` files as the canonical source of truth for extraction prompts.

## Why an agent?

Government accountability data goes stale fast. Manually polling ten government portals, dozens of ministry pages, and weekly parliament transcripts is unsustainable for a volunteer team. The agent does the boring 80% — fetch, scan, extract candidate updates with source URLs — and hands a reviewable diff to a human for the judgment-call 20%.

## Directory layout

```
.claude/
├── skills/
│   ├── extract-promise-update/SKILL.md       # extraction prompt for promise updates
│   ├── extract-minister-statement/SKILL.md   # extraction prompt for ministerial statements
│   └── extract-deputy-activity/SKILL.md      # extraction prompt for deputy activity
└── agents/
    ├── promises-tracker.md                   # focused Promises Tracker subagent
    ├── deputy-performance-tracker.md         # focused Deputy Performance Tracker subagent
    └── civic-pulse-ingestion.md              # umbrella that runs both

agent/
└── src/
    ├── cli.mjs                               # CLI entry — parses args, dispatches commands
    ├── agents/
    │   ├── ingestion.mjs                     # cron orchestrator (deterministic loop)
    │   ├── extraction-schema.mjs             # JSON validator
    │   ├── changeset-summary.mjs             # PR body builder
    │   ├── chunk-document.mjs                # split long docs into overlapping windows + merge results
    │   ├── verdict.mjs                       # post-merge scoring → per-source confidence multiplier
    │   └── dedupe.mjs                        # skip entries already in committed data
    ├── config/
    │   ├── load.mjs                          # loads country config + sources.yaml + env
    │   └── skills.mjs                        # parses .claude/skills/<name>/SKILL.md
    ├── prompts/
    │   └── system.mjs                        # assembles the top-level system prompt
    └── tools/
        ├── fetch-cache.mjs                   # ETag/Last-Modified cache helpers
        ├── fetch-html.mjs                    # HTML → plain text, cache-aware
        ├── fetch-rss.mjs                     # RSS/Atom parser, cache-aware
        ├── fetch-pdf.mjs                     # PDF text extraction via pdf-parse, cache-aware
        ├── fetch-search.mjs                  # web search (Anthropic web_search / Brave) + result fetch
        ├── open-pull-request.mjs             # branch + commit + push + PR via GitHub API
        ├── write-changeset.mjs               # persist pending JSON
        └── index.mjs                         # createSdkMcpServer bundle for the autonomous path
```

## Required environment

```bash
export ANTHROPIC_API_KEY=sk-ant-...    # from console.anthropic.com
export GITHUB_TOKEN=ghp_...            # PAT with 'repo' scope (or GITHUB_TOKEN in Actions)
export GITHUB_REPOSITORY=org/repo      # implicit in Actions, explicit locally
export COUNTRY=example                  # which country to ingest (default: example)
```

Optional:

```bash
export AGENT_MODEL=claude-sonnet-4-6           # default; can use claude-opus-4-7 for harder extractions
export AGENT_MAX_SOURCES=20                    # default: all enabled sources
export AGENT_DRY_RUN=true                      # don't open a PR, just write to pending/
export AGENT_CONFIDENCE_THRESHOLD=0.5          # below this, the entry is dropped
export AGENT_CACHE_DIR=./.agent-cache          # default: node_modules/.cache/civic-pulse
export AGENT_FORCE_REFRESH=true                # bypass cache and re-fetch everything
export AGENT_SEARCH_BACKEND=anthropic          # 'anthropic' | 'brave' | 'disabled' (auto-detected from API keys)
export BRAVE_SEARCH_API_KEY=...                # alternative to ANTHROPIC_API_KEY for fetch-search
```

## Fetch cache

Every fetcher (`fetch-html`, `fetch-rss`, `fetch-pdf`) writes the response's `ETag` and `Last-Modified` headers to `node_modules/.cache/civic-pulse/<country>/sources/<sha1>.json`. The next run sends `If-None-Match` / `If-Modified-Since`; on `304 Not Modified` the cached body is returned with `cached: true` and the orchestrator skips the Claude call for that source.

- `--force-refresh` (or `AGENT_FORCE_REFRESH=true`) ignores the cache for one run.
- `AGENT_CACHE=off` disables both reads and writes for one run.
- Override the location with `AGENT_CACHE_DIR=...`.
- In CI, persist cache hits across runs with [`actions/cache`](https://github.com/actions/cache) keyed on `${{ runner.os }}-civic-pulse-${{ env.COUNTRY }}` against the cache path.
- The cache is **not committed** — `node_modules/` is gitignored by convention.

## CLI

```bash
npm run agent              # show help
npm run agent:promises     # Promises Tracker only (gov press, gazette, ministerials)
npm run agent:deputies     # Deputy Performance Tracker only (parliament transcripts + analytics rebuild)
npm run agent:run          # umbrella: both trackers in sequence
npm run agent:dry-run      # umbrella, write to pending/ but skip PR
npm run agent -- promises --source <id>     # focused tracker, one source
npm run agent -- deputies --dry-run         # focused tracker, no PR
npm run agent -- validate                   # lint sources.yaml without fetching
npm run agent -- skills                     # list available skills
```

## How a run works (cron path)

1. **Load context** — `agent/src/config/load.mjs` reads `countries/<COUNTRY>/config.json`, `categories.json`, `sources.yaml`. Validates schema. Filters by `--source` / `--max-sources`.
2. **Resolve active domains** — the CLI subcommand maps to a set of domains: `promises` → `[promises, ministerStatements]`, `deputies` → `[deputyActivity]`, `run` → both. The orchestrator filters source tracks against the active set.
3. **Iterate eligible sources** — for each source in `sources.yaml` whose tracks intersect the active domains:
   1. Fetch via the matching adapter (`fetch_mode: html | rss | pdf`).
   2. For each track:
      1. Load the matching skill from `.claude/skills/extract-*/SKILL.md`.
      2. Build a system prompt assembling country context + skill body (`agent/src/prompts/system.mjs`).
      3. Send the document + structured inputs to Claude. Parse the returned JSON.
      4. Validate against the schema (`agent/src/agents/extraction-schema.mjs`). Drop entries below the confidence threshold.
   3. Write accepted entries to `countries/<COUNTRY>/pending/<runId>-<sourceId>-<skill>.json`.
4. **Auto-rebuild deputy analytics** (deputies / umbrella only) — if any `deputy_activity` entries were extracted, spawn `node scripts/build-deputy-analytics.mjs --country <code>` so `public/data/deputies-analytics.json` reflects the new transcripts in the same PR.
5. **Open PR** — `agent/src/tools/open-pull-request.mjs` creates a branch `agent/<country>/<domains>/<runId>`, commits the pending files (plus the rebuilt analytics and any new transcripts when the deputies domain ran), opens a PR titled `agent(<domains>): <country> <runId>` with the summary table.

## How a run works (interactive / Claude Code path)

A maintainer in Claude Code can spawn either focused tracker via the `Agent` tool:

```
Agent promises-tracker: refresh the example country against its most recent government-news feed.
Agent deputy-performance-tracker: ingest the most recent plenary transcript for the example country.
```

Or the umbrella for a full refresh:

```
Agent civic-pulse-ingestion: refresh the example country end-to-end.
```

Each subagent loads its `.claude/agents/<name>.md` definition (allowed tools, preloaded skills, focused system prompt) and walks the matching workflow using Claude Code's native tools (Read, Bash) plus the skill invocation system. The SDK MCP server in `agent/src/tools/index.mjs` exposes `fetch_html`, `fetch_rss`, `fetch_pdf`, and `write_changeset` if you wire it into a custom `query()` setup.

Each skill is also directly invocable:

```
/extract-promise-update
/extract-minister-statement
/extract-deputy-activity
```

Useful when prototyping a new extraction rule against a known document.

## Skills

Skills are Markdown files with YAML frontmatter. Each one is a focused extraction job — one skill per output kind. The skills directory follows the [Anthropic Skills spec](https://code.claude.com/docs/en/skills): name, description, allowed tools, and the prompt body.

To add a new skill (e.g., extract-budget-allocation):

1. `mkdir -p .claude/skills/extract-budget-allocation/`
2. Write `SKILL.md` with the frontmatter (`name`, `description`, `allowed-tools`) and a body specifying inputs, output schema, and rules.
3. Add a track key in `agent/src/agents/ingestion.mjs` `SKILL_BY_TRACK` mapping.
4. Reference the new track in your country's `sources.yaml` under `extract.tracks`.

## Source registry (`sources.yaml`)

```yaml
country: example
defaults:
  trust_tier: 2
  enabled: true

sources:
  - id: government-news
    label: Office of the Prime Minister — News
    url: https://www.gov.example/news
    type: government_website
    fetch_mode: html
    trust_tier: 1
    extract:
      tracks: [promises, ministerStatements]
      languageHint: en
```

Fields:
- `id` — kebab-case, unique per country.
- `type` — one of `government_website`, `minister_social`, `trusted_news`, `parliament_transcript`, `official_gazette`.
- `fetch_mode` — one of `html`, `rss`, `pdf`, `search`, `manual` (manual = the agent prompts you to paste content).
- `trust_tier` — 1 (official primary), 2 (verified secondary), 3 (other). The agent caps confidence at 0.7 for tier 3.
- `extract.tracks` — which entity types the source can update: `promises`, `ministerStatements`, `deputyActivity`. Each maps to one skill.
- `extract.languageHint` — BCP-47 language; helps the model when content is mixed-language.

## Fetch adapters

In `agent/src/tools/`:

- **fetch-html.mjs** — uses native `fetch` + a lightweight HTML-to-text extractor. Strips `<script>`, `<style>`, `<nav>`, navigation chrome.
- **fetch-rss.mjs** — parses RSS/Atom feeds via an inline parser (no external deps). Treats each item as a candidate document.
- **fetch-pdf.mjs** — fetches the PDF and extracts text via `pdf-parse` (returns `{ text, pages, originalLength, fetchedAt, cached }`). Parliament transcripts now flow through this adapter end-to-end.
- **fetch-search.mjs** — runs a web search via Anthropic `web_search` (preferred) or Brave Search, then fetches the top result pages and concatenates them. Triggered by `fetch_mode: search` in `sources.yaml`; query comes from `extract.searchQuery` (falls back to the source `url`).

## Long-document chunking

Documents longer than ~55k chars (typical parliament transcripts) are split by `agent/src/agents/chunk-document.mjs` into ~50k-char overlapping windows. The extraction skill runs once per window; `mergeChunkResults()` then dedupes entries by `(kind, subject, sourceQuote)` and keeps the highest-confidence version. The orchestrator logs `splitting N chars into K chunks` so you can see when this happens.

## Verdict scoring

After the human reviewer merges an agent PR, run `npm run agent:score-verdict -- <countryRoot> <runId> <prNumber>` to reconstruct which proposed entries were accepted, modified, rejected, or left pending. Results land in `countries/<code>/.verdict-history.json` (committed for audit). On the next agent run, `getSourceConfidenceMultiplier()` reads aggregates and applies a per-source × skill multiplier (range `0.7` to `1.1`) to the raw confidence — so a source whose last 20 entries were all merged sees a bump, while a noisy source gets damped.

## Deduplication

Before writing pending changesets, `agent/src/agents/dedupe.mjs` builds signature indexes from existing committed data:

- `promise_update` / `minister_statement` entries match against existing `promises.json[].updates[].description` (truncated, case-normalized) and `sourceUrl` per promise id.
- `deputy_activity` entries match against `(speaker, text)` pairs from `countries/<code>/transcripts/*.json`.

Matches are skipped before the pending file is written and surfaced in the PR summary as `Duplicates skipped: N`.

You can add your own adapter by exporting `{ async fetch(url, options): Promise<{ text, title?, fetchedAt }> }` from a new file and wiring it into `agent/src/agents/ingestion.mjs` `FETCH_BY_MODE`.

## PR format

The opened PR includes a Markdown summary (built by `agent/src/agents/changeset-summary.mjs`) listing run id, sources scanned, accepted entries grouped by kind, file changes, and a review checklist:

```markdown
## Agent run — example — 2026-05-18

- Run id: `2026-05-18T07-30-12`
- Sources scanned: 4 of 4
- Accepted entries (confidence ≥ 0.5): 7
  - Promise updates: 3
  - Minister statements: 2
  - Deputy activity: 2

### promise update
| Promise | Status | Δ progress | Conf | Source |
| --- | --- | --- | --- | --- |
| Open-data law: publish budget by ministry | In Progress | 5 | 0.82 | `government-news` |
…

### Review checklist
- [ ] Each entry's sourceQuote matches the linked URL.
- [ ] Status changes reflect what the source actually says.
- [ ] No fabricated promise ids, deputy names, or dates.
- [ ] Approved entries moved from pending/ into the structured data files.
```

## Tuning

- **Too many low-quality entries** → raise `AGENT_CONFIDENCE_THRESHOLD`.
- **Missing obvious updates** → check `fetch_mode` was right. Use `npm run agent -- run --source <id>` to debug one source.
- **Hallucinated entries** → file a bug. The schema validator requires `sourceQuote` to literally appear in fetched text; if it doesn't, the agent has a validation gap.
- **Cost** — defaults to Sonnet 4.6 which is cheap. Set `AGENT_MODEL=claude-opus-4-7` only for hard reasoning over long documents.

## Limitations & roadmap

See [ROADMAP.md](ROADMAP.md). Tracked items still open:

- `government.ts` is still TypeScript — promises and pages migrated to JSON, ministries remain. Carryover from 0.3 → 0.4.
- Long parliament transcripts truncate at 60k chars per source; subagent splitting is planned for 0.4.
- No deduplication of agent entries vs. existing data — humans handle this at PR review time.
- Subagent path needs richer integration testing once the SDK MCP server is exercised in anger.

What landed this round:

- PDF adapter wired up against `pdf-parse` — verified extraction working.
- Fetch cache with ETag / Last-Modified — `cached: true` short-circuits the Claude call.
- `promises.ts` → `promises.json` migration across the reference and starter countries.
