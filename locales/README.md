# `locales/` — UI string dictionaries

One JSON file per BCP-47 language code. Each country selects its UI language via the `locale` field in `countries/<code>/config.json`.

Shipped:
- `en.json` — English (default + fallback)
- `de.json` — German
- `sq.json` — Albanian

Keys are dot-namespaced by area (`nav.*`, `status.*`, `filter.*`, `stats.*`, `home.*`, `methodology.*`, …). Missing keys fall back to `en.json`; if a key is missing from both, the key itself renders (so regressions are visible).

## Adding a new locale

1. Copy `en.json` to `locales/<code>.json`.
2. Translate every value. Keep the keys identical.
3. Reference it from a country: `"locale": "<code>"` in its `config.json`.
4. Run `COUNTRY=<your-code> npm run build`.

See `docs/I18N.md` for the i18n design and the `{var}` interpolation pattern.
