# Germany — Promise Sources Registry

This file is the human-readable source registry for promise updates. The agent uses the YAML file at `countries/germany/sources.yaml` for automation; this markdown file is the canonical record cited in the UI's Methodology page.

Each row describes one source. The build script (`scripts/build-promise-sources.mjs`) parses the table and emits `public/data/promise-sources.json` for the app to consume.

| source_id | type | trust_tier | promise_ids | tags | enabled | fetch_mode | url |
|-----------|------|-----------:|-------------|------|---------|------------|-----|
| bundesregierung-news | government_website | 1 | * | regierung,news | false | html | https://www.bundesregierung.de/breg-de/aktuelles |
| bundestag-services | government_website | 1 | * | bundestag,opendata | false | html | https://www.bundestag.de/services |
| bundesgesetzblatt | official_gazette | 1 | * | gesetz,offiziell | false | html | https://www.recht.bund.de/ |

## Notes

- Set `enabled` to `true` for each source after you have verified the URL is correct and the agent can fetch it.
- `promise_ids` accepts either `*` (the source can update any promise) or a comma-separated list of promise ids.
- `trust_tier` is `1` for primary sources (the government or parliament itself), `2` for verified secondary sources, `3` for tertiary.
