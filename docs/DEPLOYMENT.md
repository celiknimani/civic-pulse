# Deployment

civic-pulse builds to a static `dist/` directory. There's no backend. Pick whichever host you prefer — examples below.

## Common settings

All hosts share these:

- **Node version**: 20.10+
- **Install**: `npm ci`
- **Build**: `COUNTRY=<your-code> SITE_URL=https://your-site.example npm run build`
- **Output directory**: `dist`
- **SPA fallback**: `/*` → `/index.html` (200) — handled by `public/_redirects` on Cloudflare/Netlify, and by `vercel.json` on Vercel
- **Required env vars at build time**: `COUNTRY`, `SITE_URL`

## Cloudflare Pages

Already configured (this is the original deployment target).

`wrangler.toml`:

```toml
name = "civic-pulse"
compatibility_date = "2024-03-25"
pages_build_output_dir = "dist"
```

Settings in the Cloudflare dashboard:
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: `COUNTRY=<your-code>`, `SITE_URL=https://your-site.example`

`public/_headers` ships strict CSP, HSTS, `X-Frame-Options: DENY`, etc. Cloudflare picks it up automatically.

## Vercel

Add `vercel.json` (already in the repo). In the Vercel dashboard:
- Framework preset: **Other** (don't let it auto-detect Vite — the prerender step matters)
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`
- Environment variables (Production scope): `COUNTRY`, `SITE_URL`

Vercel reads `vercel.json` for the SPA rewrite and the security headers. You don't need to also enable `_headers` / `_redirects`.

## Netlify

Add `netlify.toml` (already in the repo). In the Netlify dashboard:
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: `COUNTRY`, `SITE_URL`

`public/_headers` and `public/_redirects` work on Netlify identically to Cloudflare, so they're picked up automatically; `netlify.toml` only sets the build defaults.

## Self-host (nginx)

Build locally or in CI:

```bash
COUNTRY=<your-code> SITE_URL=https://your-site.example npm run build
rsync -avz --delete dist/ deploy@your-server:/var/www/civic-pulse/
```

`/etc/nginx/sites-enabled/civic-pulse.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name your-site.example;

    root /var/www/civic-pulse;
    index index.html;

    # Security headers (matching public/_headers)
    add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; connect-src 'self' https://www.google-analytics.com; frame-src 'none'; upgrade-insecure-requests" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Long-cache the hashed assets
    location /assets/ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    # Short cache for the route shells (they include prerendered meta)
    location / {
        try_files $uri $uri/index.html $uri/ /index.html;
        add_header Cache-Control "public, max-age=300, s-maxage=300";
    }

    ssl_certificate     /etc/letsencrypt/live/your-site.example/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-site.example/privkey.pem;
}

server {
    listen 80;
    server_name your-site.example;
    return 301 https://$host$request_uri;
}
```

## Self-host (Caddy)

```
your-site.example {
    root * /var/www/civic-pulse
    encode gzip zstd

    header {
        Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; connect-src 'self' https://www.google-analytics.com; frame-src 'none'; upgrade-insecure-requests"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
    }

    @assets path /assets/*
    header @assets Cache-Control "public, max-age=31536000, immutable"

    try_files {path} {path}/index.html /index.html
    file_server
}
```

## Continuous deployment

GitHub Actions sample is at `.github/workflows/deploy-cloudflare.yml`. For Vercel and Netlify, prefer their native git integrations — they're better at PR previews than running deploys via Actions.

For self-host with GitHub Actions, the simplest pattern is rsync over SSH from a runner with `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER` secrets.

## Custom domain checklist

- [ ] DNS A/AAAA or CNAME to your host
- [ ] HTTPS certificate active
- [ ] `SITE_URL` env var matches your final URL (without trailing slash)
- [ ] `public/robots.txt` and the generated `sitemap.xml` reference the right URL
- [ ] `index.html` `<link rel="canonical">` matches
- [ ] Open Graph image (`public/og-image.svg`) renders at 1200×630 on social previews
