# Example — Promise Sources Registry

This is the human-readable source registry for the example country. The build script (`scripts/build-promise-sources.mjs`) parses the table below into `public/data/promise-sources.json`.

Replace these rows with the official sources you trust for your country.

| source_id | type | trust_tier | promise_ids | tags | enabled | fetch_mode | url |
|-----------|------|-----------:|-------------|------|---------|------------|-----|
| government-press | government_website | 1 | * | press,official | false | html | https://example.gov/press |
| parliament-transcripts | parliament_transcript | 1 | * | parliament,transcripts | false | pdf | https://parliament.example.gov/transcripts |
