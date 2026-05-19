# `public/` — static assets served from the site root

Files here are copied as-is by Vite into `dist/`. Defaults are deliberately framework-neutral; per-country deployments can override individual assets via `countries/<code>/public/` (the build's `overlay-country-public.mjs` step copies a country's overlay onto `dist/` after the base copy).

| File                              | Purpose                                                 |
|-----------------------------------|---------------------------------------------------------|
| `favicon.svg`                     | Site favicon (overridable).                             |
| `og-image.png`                    | Open Graph / Twitter card image (1376×768 PNG, ~847 KB). Referenced from `index.html`. Most social platforms reject SVG OG images, so PNG is the default. |
| `og-image.svg`                    | Editable vector source of the OG image. Not referenced from `index.html`; kept here so a fork can re-export a PNG after edits. |
| `robots.txt`                      | Crawler directives. The default uses a relative sitemap path; deployments behind a public domain may override with absolute URLs. |
| `_redirects`, `_headers`          | Netlify / Cloudflare Pages SPA routing + headers.       |
| `data/`                           | **Generated** at build time by `scripts/build-*` (gitignored where appropriate). |

To override assets per country, drop replacements at `countries/<code>/public/<same-path>` and they'll win against the defaults here without touching the framework.
