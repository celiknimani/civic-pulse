# Roadmap

Current release: **1.1**. Everything below documented as ✅ has shipped; everything else is open for contribution. Version-by-version notes live on GitHub Releases.

Issues and PRs welcome on anything in the **Community-driven** section at the bottom.

## 0.1 (landed)

- ✅ Country-agnostic directory structure (`countries/`, `packages/core/`, `agent/`, `locales/`)
- ✅ Build pipeline reads `COUNTRY` env var; defaults to the English `example` country
- ✅ Path aliases (`@core`, `@country`) wired through tsconfig and vite
- ✅ Country config schema + JSON-driven categories
- ✅ Generic prerender metadata system (per-country `prerender-meta.json`)
- ✅ Multi-target deployment configs (Cloudflare, Vercel, Netlify, self-host)
- ✅ Documentation suite (README, architecture, country onboarding, agent, deployment, i18n)
- ✅ MIT license + contribution guidelines + code of conduct
- ✅ Two reference countries shipped in this repo: `example` (English demo) and `germany` (empty starter). The real-world Kosovo dataset that powers zotimi.com is maintained in a private companion repo on top of this framework.
- ✅ CI matrix builds every country shipped in this repo on every PR
- ✅ Pure deputy analytics extracted to `packages/core/src/deputyAnalytics.ts`, parameterized by country categories
- ✅ i18n framework (`packages/core/src/i18n.ts`) with `useT` / `useMonthNames` hooks, en/sq/de starter dictionaries
- ✅ App.tsx, DashboardStats, PromiseCard, PromiseDetail fully migrated to i18n
- ✅ Static page bodies (About/Contact/Privacy/Methodology) externalized to `countries/<code>/pages/*.json` for per-country authorship

## 0.2 — Full i18n extraction (landed)

Every UI surface now reads from `locales/<code>.json` and falls back to English. Country-specific content stays under `countries/<code>/`.

- [x] Add a tiny `useT(key)` hook in `packages/core/src/i18n.ts` (no library)
- [x] Ship `locales/en.json` (default) + `locales/sq.json` (Albanian, used by the private Kosovo deployment) + `locales/de.json` (Germany starter)
- [x] App reads locale from `countries/<code>/config.json.locale`
- [x] Status labels + month names extracted from `App.tsx`
- [x] Nav array, header, footer, 404 messages
- [x] `components/DashboardStats.tsx`, `PromiseCard.tsx`, `PromiseDetail.tsx`
- [x] `components/DeputiesDirectory.tsx`, `DeputyProfile.tsx`
- [x] `components/QeveriaOrgChart.tsx`, `QeveriaMinisterDetail.tsx`
- [x] `components/RadarSpiderChart.tsx`
- [x] Static page bodies (About, Contact, Privacy, Methodology) moved to `countries/<code>/pages/*.json`
- [x] Number/date formatting reads `dateLocale` from country config in every migrated component

## 0.3 — Data format migration (landed)

- [x] Migrate `countries/<code>/promises.ts` → `promises.json` (reference and starter countries shipped in this repo). Thin `.ts` shims re-export `CATEGORIES` and read promises from the JSON.
- [x] `scripts/generate-prerender-pages.mjs` now reads `promises.json` directly (no more regex-on-TS parsing).
- [x] PDF adapter wired up with `pdf-parse` (unlocks parliament transcript ingestion).
- [x] Same JSON migration for `government.ts` → `government.json`. Analytics helpers extracted to `packages/core/src/governmentAnalytics.ts`; country `government.ts` is now a thin shim.

## 0.4 — Agent v2 (landed)

- [x] **Cache fetched content with ETag/Last-Modified** so unchanged sources return `cached: true` and skip Claude calls. Cache lives at `node_modules/.cache/civic-pulse/<country>/sources/` (override via `AGENT_CACHE_DIR`, force-bust with `--force-refresh` or `AGENT_FORCE_REFRESH=true`).
- [x] **Subagent splitting for long parliament transcripts** — `agent/src/agents/chunk-document.mjs` splits documents > 55k chars into ~50k overlapping windows, runs the extraction skill per window, merges + dedupes by `sourceQuote`. Eliminates the 60k truncation cliff.
- [x] **Web search adapter** — new `fetch_mode: search`. `agent/src/tools/fetch-search.mjs` auto-detects Anthropic web_search or Brave Search backends, fetches the top results, concatenates as a single document for the extractor. `extract.searchQuery` in `sources.yaml` controls the query.
- [x] **Verdict scoring** — `agent/src/agents/verdict.mjs` records each run's proposed entries to `countries/<code>/.verdict-history.json`, scores them against the merged PR via `npm run agent:score-verdict`, and surfaces a confidence multiplier per source × skill (well-trusted sources can edge above `1.0`, heavily-rejected sources cap at `0.7`).
- [x] **Deduplication** — `agent/src/agents/dedupe.mjs` builds a signature index from existing `promises.json` updates and `transcripts/*.json` rows; the orchestrator partitions extracted entries into kept vs. skipped before writing pending changesets. Skipped count appears in the PR summary.

## 0.5 — Editor experience (landed)

- [x] `/admin` route (dev-only) for promise + government + deputies + sources editing without leaving the browser. See [ADMIN.md](ADMIN.md).
- [x] Diff preview before commit (deep-diff of the form state against the file on disk).
- [x] Source citation autofill from the agent's HTML cache — paste a URL, get the page title + fetched-at timestamp.
- [x] Production bundles tree-shake the admin code (`import.meta.env.DEV` gate + lazy import).
- [x] Vite dev middleware (`scripts/admin-middleware.mjs`) with path-restricted atomic writes and `NODE_ENV=production` refusal.

## 0.5.1 — Browser → GitHub PR editor (landed)

- [x] PAT-prompted auth via `AuthGate`, stored in `sessionStorage` only. http:// warning when not on localhost.
- [x] `components/admin/persistence.ts` abstracts `local` vs `github-pr` backends. Editors are persistence-agnostic.
- [x] GitHub backend commits each save to a fresh branch (`admin/<country>/<entity>-<runId>`) and opens a PR via REST.
- [x] Production deploy can flip on the admin route via `VITE_ADMIN_MODE=github-pr` + `VITE_GITHUB_REPOSITORY=org/repo`. Without the env var the admin code is tree-shaken from the production bundle.
- [ ] OAuth flow (avoids PAT-paste UX); deferred to 1.2.
- [ ] Conflict detection when the file changed on `main` between load and save; deferred to 1.2.

## 1.0 — Reference deployments

- [ ] At least three country instances running in production (zotimi.com is the live reference; need two more public deployments)
- [x] All ROADMAP 0.2–0.5 items shipped
- [x] Performance budget enforced: main JS gzipped < 110 KB, CSS gzipped < 50 KB. `scripts/check-bundle-budget.mjs` fails the build on violation.
- [x] Initial-route code-splitting: home page bundle alone is 78–80 KB gzipped; secondary routes lazy-loaded.
- [x] Accessibility audit baseline: `scripts/check-accessibility.mjs` runs axe-core (WCAG 2.2 AA) against the prerendered home + 4 templated routes in CI. Manual checklist in [ACCESSIBILITY.md](ACCESSIBILITY.md).
- [ ] Browser-level a11y audit (Playwright + axe-core) for dynamic state — manual today, automate in 1.1.
- [ ] Production readiness checklist completed per country — see [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md).

## 1.1 — Post-launch polish (landed)

- [x] **Promises deferred to runtime fetch** — `scripts/build-promises-data.mjs` copies `countries/<COUNTRY>/promises.json` to `public/data/promises.json`. App reads via `usePromises()` hook. Main bundle no longer scales with promise count. (At the time of the change, the largest reference build dropped from 99 KB → **81 KB gzipped**.)
- [x] **Browser a11y audit replaces JSDOM** — `scripts/check-accessibility-browser.mjs` runs Playwright + `@axe-core/playwright` against a real Chromium against every sample route. Catches `select-name`, real-color contrast, hydrated-state issues that JSDOM missed. Fixed all violations except two narrow allowlisted edge cases. CI installs Chromium and runs the audit on the `example` build.
- [x] Performance budget tightened back to the original 100 KB target now that promises are out of the bundle.
- [ ] Source citation autofill caches across editor sessions (currently per-session only).

## Community-driven (open for contribution)

- OAuth instead of PAT for `/admin` github-pr mode — paste-a-PAT works for now; OAuth wants a hosted client_secret proxy. Open a discussion if you want this.
- Conflict detection in github-pr saves.
- Verdict scoring UI inside `/admin`.
- Operations: stand up the second and third reference deployments (see `docs/PRODUCTION_READINESS.md`).


## Out of scope (for now)

- A backend / database. Civic-pulse's review-by-PR model is the safety mechanism — adding a CMS would dilute that.
- Real-time data. The agent runs on a daily cron; that's the cadence the platform is designed for.
- Authoring AI summaries of promise progress. The platform's value is sourced primary evidence, not editorial interpretation — that's a job for journalists building on this data, not for the platform itself.
