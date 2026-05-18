# Adding a country

End-to-end guide for standing up civic-pulse for a new country. Estimated time: 2–4 hours for a basic deployment, plus ongoing curation.

## Prerequisites

- A copy of the repo (fork on GitHub recommended so you can receive agent PRs).
- Node.js 20.10+.
- The list of categories you want to track (e.g. Justice, Economy, Health, Education).
- A roster of the parliament you want to monitor (CSV: at minimum `name,party`).
- The URLs of the official sources you trust (government portal, parliament site, ministry pages, official gazette).
- Optional but recommended: an Anthropic API key for the agent.

## Step 1 — Copy the example template

```bash
cp -R countries/example countries/<your-code>
```

`<your-code>` should be lowercase ASCII, like `germany`, `albania`, `peru`, `czech-republic`. The `example` country ships in English with illustrative data — replace everything inside as you fill in your real content. `germany` is a parallel partially-filled starter that's useful to peek at as well.

## Step 2 — Fill in `config.json`

Open `countries/<your-code>/config.json` and replace every field. The most important ones:

```jsonc
{
  "code": "your-code",
  "name": "Federal Republic of Germany",      // English name
  "nativeName": "Bundesrepublik Deutschland", // Native name
  "locale": "de",                             // BCP-47 UI language
  "dateLocale": "de-DE",                      // BCP-47 for date formatting
  "siteUrl": "https://your-site.example",
  "trackedParty": {                           // which party's manifesto you're tracking
    "code": "SPD",
    "name": "Sozialdemokratische Partei Deutschlands",
    "shortName": "SPD"
  },
  "governmentTerm": {
    "label": "20. Bundeskabinett (Merz I)",
    "startDate": "2025-05-06"
  },
  "parliament": {
    "label": "Deutscher Bundestag",
    "memberCount": 736,
    "memberLabel": "Abgeordnete:r"
  }
}
```

The full schema is at `countries/_schema/country-config.schema.json`.

## Step 3 — Define your categories

`countries/<your-code>/categories.json` is a list of categories used for both the promise tracker and the parliament radar charts. Each category has an id, a localized label, a [Font Awesome](https://fontawesome.com/icons) icon, and a list of keywords (in your target language) the agent uses for topic classification.

```json
[
  {
    "id": "Justice",
    "label": "Justiz",
    "icon": "fa-scale-unbalanced",
    "keywords": ["gerichts", "richter", "staatsanwalt", "verfassung", "korruption", "rechtsstaat"]
  },
  {
    "id": "Economy",
    "label": "Wirtschaft",
    "icon": "fa-chart-line",
    "keywords": ["wirtschaft", "unternehmen", "investition", "markt", "steuer", "haushalt", "inflation"]
  }
]
```

Keep the `id` in a single, stable language (English is easiest) — it's used as a join key throughout the system. `label` is what users see.

## Step 4 — Add your parliament roster

`countries/<your-code>/deputies.csv` needs at minimum `name` and `party` columns. The CSV parser also recognizes `emri/partia` (Albanian) and `nombre/...` for other languages — extend `scripts/build-deputy-analytics.mjs` or `generate-prerender-pages.mjs` if you need additional language headers.

```csv
name,party,profile_url
Carmen Wegge,SPD,https://www.bundestag.de/abgeordnete/...
Friedrich Merz,CDU,https://www.bundestag.de/abgeordnete/...
```

## Step 5 — Map the cabinet

`countries/<your-code>/government.ts` defines:
- The prime minister / chancellor.
- The list of ministries (id, portfolio, minister, focus categories, list of promise ids the ministry owns).

Copy the structure from `countries/example/government.json` and adapt. Promise ids will start out empty — fill them in after Step 6.

## Step 6 — Seed initial promises

You have two options:

**Option A — Start empty, let the agent populate.** Create an empty `countries/<your-code>/promises.ts` exporting `LVV_PROMISES: PartyPromise[] = []` (rename the constant to suit your party — e.g. `SPD_PROMISES`). The agent will add structured promise entries as it ingests them from official sources you list.

**Option B — Seed from a manifesto document.** Copy the structure from `countries/example/promises.json`. Each promise has an id, category (matching one of your `categories.json` ids), title, description, status, progress, dates, and optional dated updates.

## Step 7 — Register your sources

Two source files, with different purposes:

**`countries/<your-code>/sources/promises.md`** — a human-readable markdown table of sources used to verify promise updates. Each row has source_id, type, trust_tier (1–3), promise_ids (or `*`), tags, enabled, fetch_mode, url. See `countries/example/sources/promises.md` for the schema.

**`countries/<your-code>/sources.yaml`** — the agent's source registry. Lighter format optimized for automated ingestion:

```yaml
country: germany
sources:
  - id: bundesregierung-news
    type: government_website
    fetch_mode: html
    url: https://www.bundesregierung.de/breg-de/aktuelles
    trust_tier: 1
    enabled: true
    extract:
      tracks: ['promises', 'ministerStatements']
      categories: '*'

  - id: bundestag-protokolle
    type: parliament_transcript
    fetch_mode: pdf
    url: https://www.bundestag.de/services/opendata
    trust_tier: 1
    enabled: true
    extract:
      tracks: ['deputyActivity']
```

## Step 8 — Localize the static pages

`countries/<your-code>/pages/` contains `about.json`, `contact.json`, `privacy.json`, and `methodology.json`. These hold the long-form copy for the About / Contact / Privacy / Methodology routes. Each file is structured (eyebrow, title, intro, sections, optional note) and rendered by the generic `StaticContentPage` and `Methodology` components — no React changes needed.

Edit the JSON in place. The schemas are:

- `about.json` / `contact.json` / `privacy.json`: `{ eyebrow, title, intro, sections: [{ title, paragraphs[] }], note? }`
- `methodology.json`: `{ back, title, intro, sections: {...}, steps[], metrics[], ai[], noteBody, policySources[], fallbackTranscriptSources[] }`

If you need extra static pages, add another `.json` file plus a route in `src/App.tsx` and an entry in `countries/<your-code>/pages/index.ts`.

## Step 9 — Per-country `public/` overlay (optional)

If you need a country-specific favicon, OG image, party logos, or `robots.txt`, drop them in `countries/<your-code>/public/`. The build step `scripts/overlay-country-public.mjs` copies that directory on top of `dist/` after Vite produces the default build, so the country's assets win where they exist while inheriting civic-pulse defaults for everything else.

Example:

```
countries/<your-code>/public/
├── favicon.svg          # overrides public/favicon.svg
├── og-image.svg         # overrides public/og-image.svg
├── robots.txt           # overrides public/robots.txt
└── logos/
    └── party-x.png      # available at /logos/party-x.png in production
```

The zotimi.com deployment uses this pattern in its private repo: each tracked party's logo lives under the country's `public/logos/`.

## Step 11 — Add prerender metadata

`countries/<your-code>/prerender-meta.json` controls the SEO meta tags and no-JS fallback HTML. Copy from `example` and translate. At minimum override: `brand`, `defaultTitle`, `defaultDescription`, the `routes` map, and the `templates`.

## Step 12 — Run it

```bash
COUNTRY=<your-code> SITE_URL=https://your-site.example npm run dev
```

The dev server starts at `http://localhost:3000`. If you have empty datasets, the dashboard will render with zero promises / zero deputies — fill them in incrementally.

```bash
COUNTRY=<your-code> SITE_URL=https://your-site.example npm run build
```

Produces `dist/` ready for deployment. See [DEPLOYMENT.md](DEPLOYMENT.md).

## Step 13 — Run the agent

Once you have at least one enabled source in `sources.yaml`:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export GITHUB_TOKEN=ghp_...
export GITHUB_REPOSITORY=your-org/your-fork
COUNTRY=<your-code> npm run agent:run
```

The agent:
1. Reads each enabled source.
2. Fetches the page / RSS feed / PDF.
3. Asks Claude to extract structured updates (new promise, status change, deputy statement) with citations and a confidence score.
4. Writes a JSON changeset to `countries/<your-code>/pending/<timestamp>-<source-id>.json`.
5. Opens a pull request titled `agent: <country> updates from <YYYY-MM-DD>` summarizing the findings.

You review, edit, and merge. The merge moves the validated entries into the structured data files. Nothing auto-merges.

See [AGENT.md](AGENT.md) for runtime details, custom prompts, and confidence tuning.

## Step 14 — Schedule it

Enable `.github/workflows/agent.yml` in your fork. It runs the agent on a cron (default: daily) and opens PRs you can review at your pace.

## Maintenance checklist

- **Weekly**: review pending agent PRs.
- **Monthly**: add new sources as you discover them, retire ones that stop publishing.
- **Per cabinet change**: update `government.ts` and `config.json.governmentTerm`.
- **Per election**: refresh `deputies.csv` and `trackedParty`.

## Translating the UI

The repo defaults to English. To add a new UI locale:

1. Copy `locales/en.json` to `locales/<your-locale>.json`.
2. Translate every value. Missing keys fall back to English.
3. Reference the new locale from your country config: `"locale": "<your-locale>"`.
4. Build — Vite picks it up automatically.

See [docs/I18N.md](I18N.md) for the full pattern and the current state of per-component string extraction. Some less-prominent components (DeputiesDirectory, DeputyProfile, the Qeveria org chart) still have hardcoded strings; PRs extracting them are welcome.

## Getting help

Open a discussion or issue with the `country-onboarding` label. Include your `config.json` and the specific step you're stuck on.
