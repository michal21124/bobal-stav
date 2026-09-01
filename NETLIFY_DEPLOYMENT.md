# Bobal Stav — Netlify production checklist

## Production architecture

- Frontend: `https://bobalstav.cz` on Netlify.
- API: `https://api.bobalstav.cz` on a Replit Deployment.
- Database: the existing PostgreSQL database, reachable by the API.
- Gallery photos: Replit App Storage, served publicly through the API.

The frontend depends on the API for public content, gallery data, and the protected admin area. Do not launch the frontend without a working production API.

## 1. Deploy the API

Publish `artifacts/api-server` as a Replit Deployment before the Netlify launch. App Storage uses Replit's storage sidecar, so this API must run on Replit. Configure these production secrets and variables:

- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `FRONTEND_URLS=https://bobalstav.cz,https://www.bobalstav.cz`
- `PUBLIC_API_URL=https://api.bobalstav.cz`

The App Storage variables below are provisioned and managed by Replit. Keep them available to the API deployment:

- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`
- `PUBLIC_OBJECT_SEARCH_PATHS`
- `PRIVATE_OBJECT_DIR`

Point the DNS record for `api.bobalstav.cz` to the API host and verify:

- `https://api.bobalstav.cz/api/healthz`
- `https://api.bobalstav.cz/api/content`
- `https://api.bobalstav.cz/api/gallery`

The admin page uploads JPG, PNG, and WebP images up to 10 MB directly to App Storage using a short-lived signed URL. PostgreSQL stores only the returned object path.

Never commit the secret values to the repository.

## 2. Import the repository into Netlify

The root `netlify.toml` contains the build command, publish directory, SPA fallback, canonical `www` redirect, cache policy, and security headers.

Add this Netlify environment variable:

```text
VITE_API_BASE_URL=https://api.bobalstav.cz
```

Deploy and verify that every direct route loads:

- `/`
- `/sluzby`
- `/projekty`
- `/o-nas`
- `/kontakt`
- `/admin`

## 3. Connect the domain

In Netlify, add `bobalstav.cz` as the primary domain and `www.bobalstav.cz` as an alias. Follow the DNS records provided by Netlify and wait for HTTPS provisioning. The repository redirects `www` to the canonical non-`www` domain.

## 4. Post-launch SEO

Verify these production URLs return HTTP 200:

- `https://bobalstav.cz/robots.txt`
- `https://bobalstav.cz/sitemap.xml`

Add `https://bobalstav.cz` to Google Search Console and submit:

```text
https://bobalstav.cz/sitemap.xml
```

Also test the homepage with Google Rich Results Test and inspect the `LocalBusiness` structured data.