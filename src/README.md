# `src/` — the React app

Country-agnostic UI consumed by every country deployment.

| File / dir         | Purpose                                                       |
|--------------------|---------------------------------------------------------------|
| `index.tsx`        | React entry. Wires `I18nProvider` and mounts `<App />` on `#root`. |
| `App.tsx`          | Top-level routes (home, methodology, deputies, government…). |
| `i18n.ts`          | Loads the active locale dictionary from `../locales/` based on the country config. |
| `styles.css`       | Tailwind entry and global CSS.                                |
| `vite-env.d.ts`    | Ambient Vite types (`import.meta.env`, `import.meta.glob`).  |
| `components/`      | Route + UI components, including the `/admin` editor.        |

The app loads per-country data via two channels:
- `@country/*` (build-time aliases — categories, config, deputies, government, pages, prerender meta)
- `/data/promises.json` (runtime fetch via `usePromises()` so the bundle doesn't scale with promise count)

See `docs/ARCHITECTURE.md` for the full layered diagram.
