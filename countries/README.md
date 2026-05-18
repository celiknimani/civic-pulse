# `countries/` — per-country data packs

Each subdirectory is a self-contained **country pack** that the build picks up via `COUNTRY=<code> npm run …`.

Shipped in this repo:
- **`example/`** — English demo with illustrative data. Copy this to start a new country.
- **`germany/`** — German starter; partially-filled scaffold.

A country pack contains:

| File / dir              | Purpose                                                      |
|-------------------------|--------------------------------------------------------------|
| `config.json`           | Country code, names, locale, party tracked, parliament, branding. |
| `categories.json`       | Promise category taxonomy used by the UI and the agent.      |
| `promises.json`         | Manifesto promises with dated updates and sources.           |
| `government.json`       | Cabinet structure: prime minister, ministries, portfolios.   |
| `deputies.csv`          | Parliament roster (minimum: `name`, `party`).                |
| `pages/*.json`          | Localized copy for static pages (Methodology, Contact, Privacy). |
| `sources.yaml`          | Agent source registry (URLs, fetch modes, trust tiers).      |
| `sources/promises.md`   | Human-readable source documentation.                         |
| `prerender-meta.json`   | Per-route SEO metadata used by the prerender pipeline.       |
| `transcripts/`          | Parliament session JSON ingested by the deputy tracker.      |
| `public/` *(optional)*  | Country-specific favicon/OG/logos that override `/public/`.  |

See `docs/ADDING_A_COUNTRY.md` for the step-by-step onboarding walkthrough and `countries/_schema/country-config.schema.json` for the config schema.
