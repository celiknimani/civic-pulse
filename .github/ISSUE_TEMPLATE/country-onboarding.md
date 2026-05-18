---
name: Country onboarding
about: Track standing up a new country deployment
title: 'Onboard country: <Country Name>'
labels: country-onboarding
---

## Country

- Name (English):
- Native name:
- ISO code / slug:
- Locale (BCP-47):
- Tracked party:
- Government term being monitored:

## Pre-flight checklist

- [ ] Read [docs/ADDING_A_COUNTRY.md](../../docs/ADDING_A_COUNTRY.md)
- [ ] Identified primary sources (government portal, parliament site, gazette)
- [ ] Have the parliament roster as CSV
- [ ] Have a license/legal review of using these sources (where applicable)

## Onboarding steps

- [ ] Created `countries/<code>/` from the Germany template
- [ ] Filled in `config.json`
- [ ] Listed categories in `categories.json`
- [ ] Filled `deputies.csv` and `government.ts`
- [ ] Seeded promises in `promises.ts` (or chose to let the agent populate)
- [ ] Registered sources in `sources.yaml` and `sources/promises.md`
- [ ] Localized `prerender-meta.json`
- [ ] Verified `COUNTRY=<code> npm run dev` boots
- [ ] Verified `COUNTRY=<code> npm run build` succeeds
- [ ] Set up deployment (Cloudflare / Vercel / Netlify / self-host)
- [ ] First agent run reviewed and merged
