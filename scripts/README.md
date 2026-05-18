# `scripts/` — build, audit, and dev-server helpers

Node ESM scripts called by `package.json`. Each one accepts `--country <code>` or reads `COUNTRY` from env. See package.json `scripts` for orchestration.

| Script                                  | Run by                              | Purpose                                              |
|-----------------------------------------|-------------------------------------|------------------------------------------------------|
| `build-promises-data.mjs`               | `prebuild`                          | Copy `countries/<COUNTRY>/promises.json` → `public/data/promises.json` for runtime fetch. |
| `build-promise-sources.mjs`             | `prebuild`                          | Compile per-promise source registry into `public/data/promise-sources.json`. |
| `build-transcript-sources.mjs`          | `prebuild`                          | Compile transcript source registry into `public/data/transcript-sources.json`. |
| `build-deputy-analytics.mjs`            | `build:deputies`, agent             | Recompute `public/data/deputies-analytics.json` from transcripts. |
| `overlay-country-public.mjs`            | `build`                             | Copy `countries/<COUNTRY>/public/` over `dist/` (favicon, OG image, robots, logos). |
| `generate-prerender-pages.mjs`          | `build`                             | Emit per-route `dist/<route>/index.html` with route-specific meta + a no-JS fallback body. |
| `check-bundle-budget.mjs`               | `build`                             | Fail the build if gzipped main JS > 100 KB or CSS > 50 KB. |
| `check-accessibility-browser.mjs`       | `a11y` / CI                         | Serve `dist/` and run Playwright + axe-core against every sample route. |
| `admin-middleware.mjs`                  | Vite dev plugin                     | `/admin-api/*` endpoints for the in-browser editor (dev mode only). |
| `ingest-transcript-pdf.mjs`             | Manual / agent                      | One-shot PDF → transcript JSON helper.               |
| `lib/country.mjs`                       | shared helper                       | `resolveCountry(argv)`, `countryPath(country, …)`.  |

All scripts treat `node_modules/` and `dist/` as off-limits except where explicitly documented.
