# In-browser admin editor

The `/admin` route is a **dev-only** editor that lets maintainers edit a country's `promises.json`, `government.json`, `deputies.csv`, and `sources.yaml` from the browser without leaving `npm run dev`. Edits write directly to disk; review them with `git diff` and commit normally — there's no GitHub PR step in this mode.

## When to use it

- You're maintaining a country dataset locally and want a click-through editor instead of hand-editing JSON.
- You're triaging an agent PR and want to make additional edits before merging.
- You're onboarding a new country and want to seed promises / ministries quickly.

## When *not* to use it

- For non-technical contributors. They should open issues / suggest PRs the normal way.
- In production. The route is removed from production bundles and the API refuses to run when `NODE_ENV=production` (defense in depth).
- For batch imports. Use the JSON files directly or write a one-shot script.

## Running it

```bash
COUNTRY=example npm run dev
# Open http://localhost:3000/admin
```

Tabs:

- **Promises** — list + edit form. Status select, progress slider, dated update appender with source autofill.
- **Government** — head of government + per-ministry portfolio / minister / promise-id mapping.
- **Deputies** — raw `deputies.csv` textarea with row counter.
- **Sources** — raw `sources.yaml` textarea, plus a "Probe a source URL" form that calls the cached HTML fetcher so you can confirm a new source resolves before enabling it.

Every tab shows a **diff preview** below the form. Nothing is written until you click **Save to disk**.

## Security model

- The Vite plugin registers the admin middleware only in `configureServer`, which Vite skips entirely for `vite build`. Production HTML never includes `/admin-api/*` handlers.
- The admin React route is gated by `import.meta.env.DEV`, so the lazy-loaded `AdminDashboard` chunk is dead code in production and tree-shakes out (verified: production bundle has no `AdminDashboard` / `admin-api` strings).
- The middleware refuses requests when `NODE_ENV === 'production'` as a final safety net.
- All write paths are resolved via `path.resolve` and checked to be inside `countries/<COUNTRY>/`. Symlink escapes and `..` traversal are rejected.
- Writes are atomic (`writeFile` to `<file>.tmp.<pid>.<ts>` then `rename`).
- There is no authentication. **Do not expose your dev server to the public internet while the admin is active.** Bind to `localhost` only (the default) or shut the server down when you're not editing.

## Source citation autofill

In the promise editor, after pasting a URL into a dated update's `sourceUrl` field, click **Autofill**. The dev server calls `agent/src/tools/fetch-html.mjs` to fetch the page (reusing `node_modules/.cache/civic-pulse` so repeat clicks are free) and populates:

- The `source` label with the page's `<title>` (if your label was empty)
- `recordedAt` with the fetched-at timestamp

You can override either field manually. The autofill never touches the URL or description fields.

## API reference

| Method | Path | Body | Purpose |
|---|---|---|---|
| GET | `/admin-api/country-info` | — | Active country + config snapshot |
| GET | `/admin-api/promises` | — | Current `promises.json` |
| POST | `/admin-api/promises` | JSON array | Replace `promises.json` |
| GET | `/admin-api/government` | — | Current `government.json` |
| POST | `/admin-api/government` | `{ primeMinister, ministries[] }` | Replace `government.json` |
| GET | `/admin-api/deputies` | — | Current `deputies.csv` (plain text) |
| POST | `/admin-api/deputies` | CSV body (plain text) | Replace `deputies.csv` |
| GET | `/admin-api/sources` | — | Current `sources.yaml` (plain text) |
| POST | `/admin-api/sources` | YAML body (plain text) | Replace `sources.yaml` (must contain a `sources:` key) |
| POST | `/admin-api/source-fetch` | `{ url: string }` | Fetch a URL via the cached HTML adapter; returns `{ title, fetchedAt, cached, excerpt }` |

All responses are JSON unless noted. Error responses are `{ "error": string }` with status 400.

## Limitations

- No undo. Use `git diff` / `git checkout -- <file>` to back out.
- No conflict detection. If you have a sibling `git pull` running and the file changed under you, your save will overwrite. The diff preview gives you a chance to spot this before committing.
- Promise list is loaded once on mount. Reload the page to pick up external changes.
- Validation is minimal (shape only, not schema). Use your IDE / TypeScript when in doubt about the exact field types.

## GitHub PR mode (v0.5.1, opt-in)

For non-technical maintainers, the same UI can run in production and commit edits via the GitHub REST API. To enable:

```bash
VITE_ADMIN_MODE=github-pr \
VITE_GITHUB_REPOSITORY=your-org/your-repo \
VITE_GITHUB_BRANCH_BASE=main \
npm run build
```

When the user visits `/admin`, the `AuthGate` component prompts for a GitHub fine-grained PAT (scope: `Contents: read & write`, `Pull requests: read & write` on this repo only). The token is stored in `sessionStorage` and disappears when the tab closes. Saving an edit:

1. Creates a fresh branch `admin/<country>/<entity>-<timestamp>`.
2. Commits the new file content via `PUT /repos/{owner}/{repo}/contents/{path}`.
3. Opens a PR against `main` (or `VITE_GITHUB_BRANCH_BASE`).

Differences from dev-only mode:

- No `/admin-api/*` middleware — all calls go directly to `api.github.com`.
- Source-citation autofill uses a direct browser fetch instead of the cached HTML adapter. Subject to CORS — pages that block cross-origin scripts won't autofill, but you can still paste the source label manually.
- The admin layout banner switches the dev-only orange notice for a "GitHub PR editor" label.

When `VITE_ADMIN_MODE` is unset, the production build tree-shakes the admin code entirely — verified by `grep AuthGate dist/assets/*.js` returning nothing.

## What this is not

This is *not* a CMS. It deliberately avoids:

- OAuth (PAT only; OAuth proxy planned for 1.2)
- Roles or audit logs (use GitHub's existing PR review for that)
- Database storage
- Concurrent editing / conflict detection (planned for 1.2)

If you need any of those, you've outgrown the editor — see `docs/ROADMAP.md` for the 1.2 work.
