# Architecture

A bird's-eye view of how civic-pulse is structured.

## Layers

```
┌──────────────────────────────────────────────────────────────┐
│ React app (src/: App.tsx, components/, i18n.ts, styles.css) │
│ Fetches /data/*.json at runtime, renders routes via wouter,  │
│ lazy-loads secondary routes (Methodology, Deputies, Qeveria) │
├──────────────────────────────────────────────────────────────┤
│ packages/core/  (shared, country-agnostic)                   │
│  - types.ts            data model                            │
│  - promiseDates.ts     date utilities                        │
│  - categories.ts       category view builders                │
│  - deputyAnalytics.ts  pure functions, parameterized         │
│  - governmentAnalytics.ts                                    │
│  - i18n.ts             useT / useMonthNames hooks            │
│  - usePromises.ts      runtime fetch of /data/promises.json  │
├──────────────────────────────────────────────────────────────┤
│ countries/<code>/  (per-country data + config)               │
│  - config.json         branding, locale, party, parliament   │
│  - categories.json     promise category taxonomy             │
│  - promises.json       manifesto promises + dated updates    │
│  - government.json     cabinet + ministry mappings           │
│  - deputies.csv        parliament roster                     │
│  - transcripts/        parliament session JSON (agent-input) │
│  - pages/*.json        About / Contact / Privacy / Methodology
│  - sources.yaml        agent source registry                 │
│  - sources/promises.md human-readable promise sources        │
│  - pending/            agent output awaiting review          │
│  - logos/              optional party / institution assets   │
│  - public/             optional public/ overlay              │
├──────────────────────────────────────────────────────────────┤
│ scripts/   (country-aware build pipeline)                    │
│  - lib/country.mjs                shared path + arg helpers  │
│  - build-promise-sources.mjs      → public/data/             │
│  - build-transcript-sources.mjs   → public/data/             │
│  - build-promises-data.mjs        → public/data/promises.json│
│  - build-deputy-analytics.mjs     → public/data/             │
│  - overlay-country-public.mjs     countries/<code>/public/   │
│  - generate-prerender-pages.mjs   dist/<route>/index.html    │
│  - check-bundle-budget.mjs        100 KB main JS / 50 KB CSS │
│  - check-accessibility-browser.mjs  Playwright + axe-core    │
│  - admin-middleware.mjs           Vite dev middleware        │
├──────────────────────────────────────────────────────────────┤
│ agent/  (cron + interactive ingestion)                       │
│  - src/cli.mjs                    run | promises | deputies  │
│  - src/agents/                                               │
│      ingestion.mjs                deterministic orchestrator │
│      chunk-document.mjs           overlapping windows + merge│
│      verdict.mjs                  confidence calibration     │
│      dedupe.mjs                   skip already-committed     │
│      extraction-schema.mjs        validate Claude JSON       │
│      changeset-summary.mjs        PR body                    │
│  - src/config/                    country + skills loaders   │
│  - src/prompts/system.mjs         skill body + country ctx   │
│  - src/tools/                     fetch HTML/RSS/PDF/search, │
│                                   cache, PR opener, MCP bundle
├──────────────────────────────────────────────────────────────┤
│ .claude/  (Claude Code surface)                              │
│  - skills/<name>/SKILL.md         extraction prompts         │
│  - agents/<name>.md               spawnable subagent defs    │
└──────────────────────────────────────────────────────────────┘
```

## Data model

Defined in `packages/core/src/types.ts`. Two main entities:

**Promise** — a manifesto commitment plus a dated history of status updates:

```ts
interface PartyPromise {
  id: string;
  category: string;       // matches one of countries/<code>/categories.json
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Delayed' | 'Pending';
  progress: number;       // 0..100
  startDate: string;
  dueDate: string;
  updates?: PromiseUpdate[];
}
```

**Deputy** — a member of parliament with activity metrics and topic distribution:

```ts
interface DeputyProfile {
  id: string;
  name: string;
  party: string;
  activity: { speechCount; wordCount; sessionCount };
  topics: DeputyTopicMetric[];
  activityHistory: DeputyActivityEntry[];
}
```

Categories provide the bridge: a promise's `category` and a deputy's `topic` both reference the same id, which is how the radar charts overlay party-platform topics onto parliament activity.

## Build pipeline

`npm run build` runs (in order):

1. **`prebuild`** — three sub-steps:
   - `build-promise-sources.mjs` → reads `countries/<code>/sources/promises.md`, validates, emits `public/data/promise-sources.json`.
   - `build-transcript-sources.mjs` → walks `countries/<code>/transcripts/`, groups by source URL, emits `public/data/transcript-sources.json`.
   - `build-promises-data.mjs` → copies `countries/<code>/promises.json` to `public/data/promises.json` for runtime fetch.
2. **`vite build`** → bundles the React app into `dist/`. Routes split into per-route chunks via `React.lazy()`.
3. **`overlay-country-public.mjs`** → copies `countries/<code>/public/` onto `dist/` (optional per-country favicon, OG image, robots.txt, logos).
4. **`generate-prerender-pages.mjs`** → reads promise / government / deputy lists, writes one prerendered `index.html` per route into `dist/<route>/`, plus a sitemap.
5. **`check-bundle-budget.mjs`** → fails the build if gzipped main JS > 100 KB or CSS > 50 KB.

All of these read `COUNTRY` (or `--country <code>`) to know which dataset to use.

A separate `npm run a11y` step runs Playwright + axe-core against `dist/` for WCAG 2.2 AA. CI runs it on every `example` build (the in-repo reference dataset).

## Path aliases

Configured in `tsconfig.json` and `vite.config.ts`:

| Alias        | Resolves to                                  |
|--------------|----------------------------------------------|
| `@core/*`    | `packages/core/src/*`                        |
| `@country/*` | `countries/<COUNTRY>/*` (env-driven)         |

The `@country` alias is the trick that makes the app country-agnostic. The React app imports its categories + government + deputies through `@country/*` (Vite resolves at build time), and reads promises through `usePromises()` at runtime so the bundle doesn't scale with promise count.

## Prerendered output

Every route gets a `<route>/index.html` containing:
- Correct `<title>`, `<meta description>`, canonical URL, OG/Twitter tags.
- A no-JS fallback `<main>` block with the route's primary content.
- A 4-second timer in the original `index.html` that swaps in the fallback if JS hasn't mounted.

This is what makes the site work for crawlers and screen readers without an SSR server.

## SDK choice

Two Anthropic SDK packages are installed and used for different paths:

- **`@anthropic-ai/sdk`** (base) — the cron / headless orchestrator (`agent/src/agents/ingestion.mjs`) calls the Messages API directly. Deterministic per-source loop, cheap, no Claude Code dependency.
- **`@anthropic-ai/claude-agent-sdk`** — `agent/src/tools/index.mjs` exports an MCP tool bundle (`fetch_html`, `fetch_rss`, `fetch_pdf`, `fetch_search`, `write_changeset`) for the autonomous Claude Code path. The subagents under `.claude/agents/` are spawnable via this SDK.

Both paths read the same `.claude/skills/<name>/SKILL.md` files as the canonical source of truth for extraction prompts.

## What's *not* in this layer

- **No database.** All data lives as files in `countries/<code>/`. Updates land via PR.
- **No backend at runtime.** The app is fully static. Analytics is the only outbound network call (Google Analytics, optional and CSP-scoped).
- **No user accounts.** The platform is read-only for visitors. Editorial control lives in git.
- **No server-side rendering.** Prerendered HTML + client-side hydration. The 7 base routes plus per-promise / per-deputy / per-ministry shells are all pre-emitted at build time.
