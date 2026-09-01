# Bobal Stav — Netlify production checklist

## Production architecture

The website, API, PostgreSQL database, and gallery image storage run in one
Netlify project at `https://bobalstav.cz`. The frontend uses same-origin
`/api/*` routes served by Netlify Functions, Netlify Database, and Netlify
Blobs. No `api.bobalstav.cz` subdomain and no `VITE_API_BASE_URL` environment
variable are required.

## 1. Connect GitHub and configure Netlify

1. In Netlify, select **Add new project** and connect the GitHub repository.
2. Use the repository's `netlify.toml`; it defines the build command, publish
   directory, Functions directory, API routing before the SPA fallback, and
   security headers.
3. Enable **Netlify Database** for this project. Netlify Database requires a
   credit-based plan. Netlify automatically applies committed migrations in
   `netlify/database/migrations/` immediately before deploy publication; do
   not manually apply this migration or run it against any legacy database.
4. In **Project configuration → Environment variables**, add:

   ```text
   ADMIN_PASSWORD=<a long unique admin password>
   SESSION_SECRET=<a long random secret>
   ```

   Never commit these values. `SESSION_SECRET` signs the eight-hour,
   HttpOnly/Secure/SameSite=Lax admin session cookie.
5. Netlify Blobs requires no credentials or manual bucket setup. The deployed
   function automatically uses the project-scoped `bobal-stav-images` Blob
   store.

## 2. Deploy and verify

Deploy the project. Verify the public API endpoints:

- `https://bobalstav.cz/api/healthz`
- `https://bobalstav.cz/api/content`
- `https://bobalstav.cz/api/gallery`

Also check each direct SPA/SEO route:

- `/`
- `/sluzby`
- `/projekty`
- `/o-nas`
- `/kontakt`
- `/admin`

The admin gallery accepts raw JPG, PNG, and WebP uploads up to **5 MiB**. This
limit remains below Netlify Functions' documented 6 MB request payload limit.
Images are stored in Netlify Blobs and are publicly returned through
`/api/storage/objects/*`; image bytes are not stored in the database.

## 3. Connect the domain

In Netlify, add `bobalstav.cz` as the primary domain and `www.bobalstav.cz` as
an alias. Create the DNS records Netlify provides and wait for HTTPS
provisioning. The repository redirects `www` to the canonical non-`www`
domain. There is no DNS record to create for `api.bobalstav.cz`.

## 4. Post-launch SEO

Verify these production URLs return HTTP 200:

- `https://bobalstav.cz/robots.txt`
- `https://bobalstav.cz/sitemap.xml`

Add `https://bobalstav.cz` to Google Search Console and submit:

```text
https://bobalstav.cz/sitemap.xml
```

Also test the homepage with Google Rich Results Test and inspect the
`LocalBusiness` structured data.