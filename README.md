<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1kL97vQ5_b6k-T_JXhV8PO2TlO5jGTCnF

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Promise Sources Registry

- Canonical registry file: `PROMISE_SOURCES.md`
- Generated manifest: `public/data/promise-sources.json`
- Manual build command:
  `npm run build:promise-sources`

`npm run dev` and `npm run build` now regenerate promise sources automatically.

## Deputetet Analytics (Transkripte)

UI tani ka:
- `/deputetet` per listen e 120 deputeteve dhe Top 10 me aktivet
- `/deputet/:id` per profil individual me grafik spiderweb te temave
- kategorite e spiderweb-it jane te njejta me kategorite kryesore te premtimeve ne platforme

Per ta ushqyer me data reale nga transkriptet:

1. Pergatit `datasets/deputies.csv` dhe dosjen `datasets/transcripts/` sipas udhezimeve te `datasets/README.md`
2. Gjenero dataset-in:
   `npm run build:deputies`
3. Rifillo aplikacionin; UI ngarkon automatikisht:
   - `public/data/deputies-analytics.json`
   - `public/data/transcript-sources.json` (burimet e transkripteve ne `/methodology`)
