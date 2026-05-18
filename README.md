# civic-pulse

> Open-source government accountability tracker. Monitor promises, parliamentary activity, and ministerial performance — for any country — fed by a Claude-powered ingestion agent that scans official sources and opens reviewable pull requests.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.10-brightgreen)](#prerequisites)

civic-pulse is the open-source platform behind [zotimi.com](https://zotimi.com), which has been tracking the Kosovo government since 2025. **This repository ships the framework only** — the production zotimi.com dataset (categories, promises, transcripts, editorial copy) is maintained separately by the zotimi.com team in a private repo. Any civic-tech team can fork this framework, configure a new country, and run.

## What you get

- **Promise tracker** — categorized promises with status (Completed / In Progress / Delayed / Pending), progress, sourced updates, dated history.
- **Parliament analytics** — per-member activity (speech count, words, sessions), topic distribution, radar charts aligned to the same categories used for the promise tracker.
- **Government org chart** — ministries with linked promises, performance scoring, and recent updates per minister.
- **Static + SEO-first** — prerenders every route to HTML, generates a sitemap, ships strict CSP. Deploys to Cloudflare Pages, Vercel, Netlify, or any static host.
- **Ingestion agent** — a Claude-backed process that reads your `sources.yaml`, scans official government sites + parliament transcripts + trusted news, extracts structured updates with confidence scores, and opens a pull request for human review. Runs headlessly via CLI/cron and is also spawnable as a subagent from Claude Code. Extraction logic lives in `.claude/skills/` as reusable, individually invocable skills.

## English first, every country welcome

The repo defaults to English. `npm run dev` boots `countries/example/` — a fully-English demo with illustrative data so contributors anywhere can read the UI immediately. Real-world deployments override the locale and content per country:

- **English UI chrome** (status labels, nav, buttons) lives in `locales/en.json` and is the fallback for every other locale.
- **Country-specific UI translations** drop into `locales/<code>.json` — currently shipped: `en` (default), `sq` (Albanian, for Kosovo), `de` (German starter).
- **Country-specific content** (promises, ministry names, methodology, about/privacy pages) stays in its source language under `countries/<code>/` — these are primary-source quotes from official documents; translating them would defeat the platform's accountability purpose.

To run civic-pulse with a different country/language, copy `countries/example/` to `countries/<your-code>/`, edit the JSON, and set `COUNTRY=<your-code>` in your environment. See [docs/ADDING_A_COUNTRY.md](docs/ADDING_A_COUNTRY.md).

## Quickstart

### Prerequisites

- Node.js 20.10 or newer
- For the agent: an Anthropic API key (`ANTHROPIC_API_KEY`)
- For automated PRs: a GitHub token with `repo` scope (`GITHUB_TOKEN`)

### Run the English demo

```bash
git clone https://github.com/your-org/civic-pulse.git
cd civic-pulse
npm install
npm run dev
```

Open `http://localhost:3000` — you'll see the English example with five illustrative promises and a mock cabinet.

### Look at the Germany empty starter

```bash
COUNTRY=germany npm run dev
```

`countries/germany/` ships as a documented empty template — the structure is there, the data isn't. Use it as a reference when you're about to copy `example/` into your own country code.

### Build for production

```bash
COUNTRY=<your-code> SITE_URL=https://your-site.example npm run build
# Output in dist/
```

### Run the ingestion agent

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export GITHUB_TOKEN=ghp_...
export GITHUB_REPOSITORY=your-org/your-fork
COUNTRY=<your-code> npm run agent:run
```

The agent scans every enabled source in `countries/<code>/sources.yaml`, writes proposed updates to `countries/<code>/pending/`, and opens a PR. Nothing is auto-merged.

## Adding your country

See [docs/ADDING_A_COUNTRY.md](docs/ADDING_A_COUNTRY.md) for the step-by-step guide. The short version:

1. Copy `countries/example/` to `countries/<your-code>/`.
2. Fill in `config.json`, `categories.json`, `government.json`, and `deputies.csv`.
3. Translate the static pages in `countries/<your-code>/pages/`.
4. List the official URLs you want monitored in `sources.yaml` and `sources/promises.md`.
5. If you want a non-English UI: drop `locales/<your-locale>.json` and set `locale` in your country config.
6. Run `COUNTRY=<your-code> npm run dev`.
7. Run `COUNTRY=<your-code> npm run agent:run` and review the first PR.

## Repo layout

```
civic-pulse/
├── src/                              # React app (country-agnostic): App.tsx, index.tsx, components/, i18n.ts, styles.css
├── countries/                        # per-country datasets
│   ├── _schema/                      # JSON schema for config.json
│   ├── example/                      # ← default — fully-populated English demo, copy this to start a new country
│   └── germany/                      # documented empty template (German UI)
├── locales/                          # UI string dictionaries (en, sq, de, …)
├── packages/core/                    # shared types + pure helpers + i18n
├── .claude/
│   ├── skills/                       # Markdown skills — extraction prompts (source of truth)
│   └── agents/                       # subagent definitions (Claude Code spawnable)
├── agent/                            # ingestion runtime (CLI + cron) — see docs/AGENT.md
├── scripts/                          # country-aware build scripts
├── docs/                             # all long-form documentation
├── public/                           # static assets + generated /data
└── .github/workflows/                # CI + scheduled agent
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — data model, build pipeline, app routing
- [Adding a country](docs/ADDING_A_COUNTRY.md) — end-to-end onboarding
- [The ingestion agent](docs/AGENT.md) — runtime, sources, prompts, PR workflow
- [Admin editor](docs/ADMIN.md) — `/admin` route for in-browser editing (dev-only by default, GitHub PR mode opt-in)
- [Accessibility](docs/ACCESSIBILITY.md) — automated + manual checklist; WCAG 2.2 AA target
- [Production readiness](docs/PRODUCTION_READINESS.md) — pre-launch checklist per country
- [Deployment](docs/DEPLOYMENT.md) — Cloudflare / Vercel / Netlify / self-hosted
- [Internationalization](docs/I18N.md) — adding locales and translating strings
- [Roadmap](docs/ROADMAP.md) — what's landed vs. what's planned
- [Security policy](SECURITY.md) — reporting vulnerabilities

## Project status

- **Framework**: 1.1 — country-agnostic structure, shared core, i18n framework, static pages per country, runtime-fetched promise data, performance budget < 100 KB main JS, WCAG 2.2 AA in CI.
- **Agent**: 1.1 — two focused subagents (Promises Tracker, Deputy Performance Tracker) plus an umbrella. HTML / RSS / PDF / web-search adapters, ETag/Last-Modified cache, long-document chunking, verdict scoring with per-source confidence calibration, deduplication against existing data.
- **Editor**: 0.5.1 — `/admin` route with dev-only file writes or production GitHub-PR mode (PAT, sessionStorage), diff preview, source citation autofill.
- **Reference deployment**: [zotimi.com](https://zotimi.com) (Kosovo). Maintained in a private repo by the zotimi.com team; only the framework is open-sourced here.
- **Locales shipped**: English (default), Albanian (`sq`), German (`de`).

See [docs/ROADMAP.md](docs/ROADMAP.md) for what's open. GitHub Releases will carry version notes going forward.

## License

[MIT](LICENSE). Use it commercially, fork it, redistribute it — please attribute and link back.

## Acknowledgements

The reference dataset is maintained by the [zotimi.com](https://zotimi.com) team. The platform structure was open-sourced to make it easier for civic-tech groups anywhere to stand up similar accountability tooling without rebuilding from scratch.

## Author

Created by **[Çelik Nimani](https://celiknimani.com)** — a tech CEO, AI consultant, and GTM strategist based in Kosovo. He partners with founders and leadership teams to apply AI with discipline, sharpen go-to-market execution, and install operating systems that make delivery more dependable. Çelik is founder & CEO of [38Shift](https://38shift.com), an AI-first engineering and technology consultancy, and previously co-founded Frakton (acquired through Kin + Carta into Valtech) and Zombie Soup. He writes about applied AI and GTM in the [*Signal*](https://digjitale.beehiiv.com/) newsletter, and is on [LinkedIn](https://linkedin.com/in/celiknimani), [X](https://x.com/celiknimani), and [GitHub](https://github.com/celiknimani).

If you fork civic-pulse to track another government, a note back is always welcome — happy to point to your deployment from this repo.
