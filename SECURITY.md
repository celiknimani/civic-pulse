# Security policy

civic-pulse is open-source civic infrastructure. We take security reports seriously because a vulnerability can:

- Expose a maintainer's GitHub PAT (in the admin editor's `github-pr` mode).
- Allow malicious extraction prompts to land in `countries/<code>/promises.json` via an agent PR.
- Let a forked deployment serve compromised JSON to readers.

## Reporting a vulnerability

**Do not open a public issue.** Use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) on this repo, or open a private security advisory. We aim to acknowledge receipt within 72 hours.

Include:

- A description of the issue and the affected file path or URL.
- Steps to reproduce, ideally with a minimal proof-of-concept.
- The country/locale you observed it on, if applicable.
- Whether you've shared the report elsewhere.

## What's in scope

- The React app (`src/`).
- The agent runtime (`agent/`).
- Build scripts (`scripts/`) that read country data.
- The admin editor (`src/components/admin/`) in either persistence mode.
- The Vite dev middleware (`scripts/admin-middleware.mjs`).

## What's out of scope

- Bugs that require the attacker to already have write access to the repo (use git history instead).
- Vulnerabilities in **upstream dependencies** — please report those to the upstream project. We'll bump the dependency once a fix is released.
- The fact that the dev-only admin editor has no auth — that's intentional and documented in `docs/ADMIN.md`. It is gated behind `npm run dev` and refuses requests when `NODE_ENV=production`.
- Issues in deployed country forks unless the bug originates upstream in this repo.

## Coordinated disclosure

We prefer coordinated disclosure: we agree on a fix and a public-release date before the report is published. The default window is **30 days from acknowledgement** to a patched release. If the vulnerability is being actively exploited, we'll work to a tighter window.

After release, we credit the reporter in the release notes unless they request otherwise.

## Hardening practices already in place

- Strict CSP in `public/_headers` (also in `vercel.json` / `netlify.toml`).
- Admin API refuses requests when `NODE_ENV=production`.
- All admin writes path-resolved and bounded inside `countries/<COUNTRY>/`.
- Agent skill schema requires verbatim `sourceQuote` matches; fabricated entries are dropped.
- GitHub PR-mode editor stores the PAT in `sessionStorage` only — never localStorage, never logged, never sent anywhere but `api.github.com`.
- Dependabot configured (`.github/dependabot.yml`) for weekly npm + monthly GitHub Actions updates.
