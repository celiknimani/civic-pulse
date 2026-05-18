# `packages/` — shared, country-agnostic code

Consumed by the React app via the `@core/*` path alias (see `tsconfig.json` and `vite.config.ts`).

## `packages/core/src/`

| Module                  | What it provides                                          |
|-------------------------|-----------------------------------------------------------|
| `types.ts`              | Canonical data model (`PartyPromise`, `PromiseUpdate`, `DeputyProfile`, …). |
| `i18n.ts`               | `createTranslator`, `I18nProvider`, `useT`, `useMonthNames` hooks. |
| `promiseDates.ts`       | Date utilities for promise updates.                       |
| `categories.ts`         | Category view builders.                                   |
| `deputyAnalytics.ts`    | Pure topic / activity analytics (parameterized).          |
| `governmentAnalytics.ts`| Per-ministry score helpers.                               |
| `usePromises.ts`        | Runtime fetch hook for `/data/promises.json` (singleton-cached). |

Nothing here references a specific country. Adding a new country never needs changes inside `packages/`.
