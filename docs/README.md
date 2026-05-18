# `docs/` — architecture and operations

| File                          | What it covers                                                |
|-------------------------------|---------------------------------------------------------------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md)        | Layered system overview, build pipeline, path aliases, prerender output. |
| [`ADDING_A_COUNTRY.md`](ADDING_A_COUNTRY.md)| Step-by-step walkthrough for onboarding a new country.        |
| [`AGENT.md`](AGENT.md)                      | Ingestion agent runtime: two focused trackers, source registry, fetch cache, chunking, verdict scoring, dedupe, PR workflow. |
| [`ADMIN.md`](ADMIN.md)                      | The in-browser `/admin` editor (dev mode and opt-in GitHub PR mode). |
| [`ACCESSIBILITY.md`](ACCESSIBILITY.md)      | WCAG 2.2 AA target, Playwright + axe-core audit, manual checklist, known allowlisted violations. |
| [`I18N.md`](I18N.md)                        | i18n design, `useT()` / `useMonthNames()`, locale fallback, adding a new language. |
| [`DEPLOYMENT.md`](DEPLOYMENT.md)            | Cloudflare Pages / Vercel / Netlify / self-hosted recipes.    |
| [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md) | Per-country pre-launch checklist.                    |
| [`ROADMAP.md`](ROADMAP.md)                  | What's shipped vs. what's open for contribution.              |

Start at `ARCHITECTURE.md` for a tour; jump to `ADDING_A_COUNTRY.md` to onboard a fresh deployment.
