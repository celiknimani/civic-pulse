# Contributing to civic-pulse

Thanks for your interest. civic-pulse is the open-source framework behind [zotimi.com](https://zotimi.com) — and the goal of this repo is to make it easier for civic-tech teams anywhere to stand up a government-accountability tracker. Contributions that move the framework forward, harden the agent, improve accessibility, or onboard a new country are all welcome.

Before you start, please skim the [README](README.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) so we're working from the same mental model.

## Ways to contribute

- **Framework code** — `src/`, `packages/core/`, `scripts/`, build pipeline, i18n.
- **Agent runtime & skills** — `agent/` and `.claude/skills/`. See [docs/AGENT.md](docs/AGENT.md).
- **New country onboarding** — open a [country-onboarding issue](.github/ISSUE_TEMPLATE/country-onboarding.md) first so the work is visible; follow [docs/ADDING_A_COUNTRY.md](docs/ADDING_A_COUNTRY.md).
- **Translations** — add a new `locales/<code>.json`. See [docs/I18N.md](docs/I18N.md).
- **Documentation** — anything under `docs/` or per-directory READMEs.
- **Bug reports** — use the [bug template](.github/ISSUE_TEMPLATE/bug.md). Include the country code you saw it on.

If you're unsure whether something belongs, open an issue first — better than landing a PR that has to be reworked.

## What does *not* belong in this repo

This repo is the **framework only**. The production zotimi.com dataset — Kosovo promises, transcripts, editorial copy — is maintained in a separate private repo. So:

- **Don't** PR Kosovo-specific data (`countries/kosovo/`) here. The directory is present for reference but is fed from upstream.
- **Do** PR improvements that are country-agnostic, or that improve `countries/example/` and `countries/germany/` as reference deployments.
- **Do** PR your own country directory if you're onboarding one — that's the point.

## Getting set up

```bash
git clone https://github.com/<your-fork>/civic-pulse.git
cd civic-pulse
npm install
npm run dev          # boots countries/example/ in English
```

Requires Node 20.10+. Agent work additionally needs `ANTHROPIC_API_KEY` (and `GITHUB_TOKEN` if you want PR-mode runs).

## Branching & PRs

1. Fork the repo and create a topic branch off `main`: `git checkout -b fix/promise-card-overflow`.
2. Keep PRs focused — one concern per PR. If you find an unrelated cleanup, open a separate PR.
3. Push to your fork and open a PR against `main`. The [PR template](.github/PULL_REQUEST_TEMPLATE.md) checklist will appear — fill it in honestly.
4. CI runs build + type-check on every PR. A11y checks run on UI-affecting changes (see `.github/workflows/ci.yml`).
5. Maintainers review. For agent or data PRs, expect questions about source citations.

`main` is protected: no direct pushes, no force pushes. Squash-merge is the default.

## Commit messages

Loose conventional-commit style is preferred — it makes the changelog readable:

```
feat(agent): add RSS adapter with ETag caching
fix(admin): refuse writes when NODE_ENV=production
docs: clarify locale fallback chain
chore(deps): bump vite to 5.4
```

Prefixes we use: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `a11y`, `perf`. Scope is optional but helpful.

## Code conventions

- **TypeScript strict** — no `any` without a comment explaining why. `npx tsc --noEmit` must pass.
- **English in UI chrome** — all user-facing strings flow through `locales/en.json` and its translations. No hardcoded English in components.
- **Primary-source language in country content** — promise text, ministry names, methodology pages stay in the source language under `countries/<code>/`. Don't translate them; the platform's value is verbatim quoting.
- **No new top-level dependencies** without justification in the PR description — we keep the main JS bundle under 100 KB.
- **CSP-safe** — no inline event handlers, no `eval`, no remote scripts. See `public/_headers`.
- **A11y** — WCAG 2.2 AA. Run the a11y check locally before requesting review on UI changes.

## Data contributions (any country)

Every promise/deputy/ministry fact must cite a primary source — a government portal, gazette, parliament transcript, or trusted news outlet with a stable URL. The agent enforces this; manual contributions should match. A PR that adds a "Completed" promise without a source URL will be sent back.

For country onboarding PRs, work from the [country-onboarding template](.github/ISSUE_TEMPLATE/country-onboarding.md) as your checklist.

## Agent contributions

If you're touching `.claude/skills/` or `agent/`:

- Run `COUNTRY=example npm run agent:dry-run` and paste the output (or a relevant excerpt) into the PR.
- Skills are the source of truth for extraction prompts — don't duplicate logic into the runtime.
- New source adapters need a fixture under `agent/fixtures/` and a unit test.

## Tests

```bash
npx tsc --noEmit       # type-check
npm test               # unit tests
npm run build          # full production build for the configured country
```

There's no required coverage threshold, but new code should ship with tests where it's reasonable to write them (parsing, helpers, agent verdict logic).

## Security

Don't report security issues as GitHub issues. Use private vulnerability reporting — full process in [SECURITY.md](SECURITY.md).

## Licensing

civic-pulse is [MIT-licensed](LICENSE). By submitting a PR, you agree your contribution is offered under the MIT license and that you have the right to submit it. No CLA — the MIT license terms are enough.

## Conduct

Be respectful, assume good faith, focus on the work. Maintainers may close issues or PRs that turn into personal attacks, off-topic political arguments, or attempts to use the project as a soapbox against specific individuals not in their official capacity.

---

Questions? Open a [discussion](https://github.com/celiknimani/zotimi_opensource/discussions) or ping `@celiknimani` on an issue.
