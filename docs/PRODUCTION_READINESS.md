# Production readiness checklist

Run through this before deploying a country to its public URL. It's the v1.0 gate.

## 1. Data quality

- [ ] `countries/<code>/config.json` filled in — country name, locale, dateLocale, tracked party, parliament, government term.
- [ ] `countries/<code>/categories.json` has 8–14 categories with native-language labels and keyword arrays.
- [ ] `countries/<code>/promises.json` has at least the manifesto's headline promises with dates and an initial status / progress.
- [ ] `countries/<code>/government.json` has the current cabinet with portfolio + minister + at least one `promiseIds` entry per ministry.
- [ ] `countries/<code>/deputies.csv` has the full parliament roster.
- [ ] `countries/<code>/pages/{about,contact,privacy,methodology}.json` translated.
- [ ] `countries/<code>/prerender-meta.json` has localized titles + descriptions for the seven base routes.

## 2. Sources & agent

- [ ] `countries/<code>/sources.yaml` lists at least 3 enabled sources: 1 government press, 1 parliament transcript feed, 1 trusted news.
- [ ] Each source's `url` resolves (use the **Probe** form at `/admin` to confirm).
- [ ] `extract.tracks` matches the source type (`promises`/`ministerStatements` for press; `deputyActivity` for transcripts).
- [ ] `ANTHROPIC_API_KEY` and `GITHUB_TOKEN` exist as repo secrets for the agent workflow.
- [ ] `.github/workflows/agent.yml` has the country's code in the cron matrix.
- [ ] First agent run reviewed and merged (use `npm run agent:dry-run` locally before enabling the cron).

## 3. UI localization

- [ ] `locales/<your-locale>.json` covers every key present in `locales/en.json` (or accepts English fallbacks intentionally).
- [ ] `countries/<code>/config.json` sets `locale` to your locale code.
- [ ] Spot-check the home page, deputy directory, government org chart, and one promise detail page for any English strings that should be translated.

## 4. Performance budget

- [ ] `npm run build` succeeds end-to-end (it runs `scripts/check-bundle-budget.mjs` as part of the chain).
- [ ] Main JS gzipped < 110 KB (script enforces this).
- [ ] CSS gzipped < 50 KB.
- [ ] Largest Contentful Paint on the home page < 1.5 s on a throttled "Slow 4G" Lighthouse run.
- [ ] If above 110 KB JS: defer `promises.json` to runtime fetch (planned v1.1) or extract the largest country-specific bundle.

## 5. Accessibility

- [ ] `node scripts/check-accessibility.mjs` passes on the prerendered routes (CI enforces).
- [ ] Browser-level audit via Playwright + axe-core or Lighthouse run manually before tag.
- [ ] Manual checklist in `docs/ACCESSIBILITY.md` completed (keyboard, screen reader, focus, contrast).
- [ ] At least one user with assistive tech experience has walked through the site (recommended, not blocking).

## 6. Deployment

- [ ] DNS, HTTPS, and HSTS configured for the production domain.
- [ ] Strict CSP from `public/_headers` works on the chosen host (Cloudflare, Vercel, Netlify each pick this up differently — see `docs/DEPLOYMENT.md`).
- [ ] Open Graph image (`public/og-image.svg`) renders correctly on Twitter / Facebook / LinkedIn previews.
- [ ] `sitemap.xml` reachable at the production URL.
- [ ] `robots.txt` permits crawling, points at the sitemap.

## 7. Operations

- [ ] Agent's daily run completes in < 5 minutes per country (measure with `gh run list --workflow=agent.yml`).
- [ ] Verdict scoring registry committed (`countries/<code>/.verdict-history.json`).
- [ ] At least one human reviewer assigned to receive agent PR notifications.
- [ ] Issue templates in `.github/ISSUE_TEMPLATE/` configured.
- [ ] Email or other inbox for editorial corrections documented in `countries/<code>/pages/contact.json`.

## Three live deployments tracker

The 1.0 milestone targets three live country instances. Each row marks production readiness against the checklist above.

| Country | Status | Production URL | Notes |
|---|---|---|---|
| Kosovo | Live (private repo) | https://zotimi.com | The zotimi.com team maintains the editorial data and country config in a private repo on top of this framework. Nothing Kosovo-specific ships here. |
| Example | N/A | (demo data only) | Used for first-run testing — not production. |
| Germany | Planned | TBD | Starter template ships; needs cabinet + promise data + maintainer. |
| _Add your country here_ | | | |

## Beyond 1.0 (tracked separately)

See `docs/ROADMAP.md` for the post-1.0 items. The biggest:

- **1.1** — Move `promises.json` to runtime fetch so the main bundle no longer grows with the dataset size.
- **1.1** — Replace the JSDOM-static a11y audit with a Playwright + axe-core browser audit.
- **1.2** — `/admin` GitHub PR mode polish: OAuth instead of PAT, conflict detection.
- **1.2** — Editorial verdict scoring UI: read `.verdict-history.json` in the admin and surface "your last 30 days of agent runs" stats.

## Useful commands

```bash
npm run build                              # full build (includes budget guard)
node scripts/check-bundle-budget.mjs       # standalone budget check
node scripts/check-accessibility.mjs       # standalone a11y audit
COUNTRY=<code> npm run dev                 # local dev, admin available at /admin
VITE_ADMIN_MODE=github-pr VITE_GITHUB_REPOSITORY=org/repo npm run build  # admin in production
```
