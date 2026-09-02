---
name: Netlify SEO trailing slashes
description: Why client-rendered SEO routes must account for Netlify pretty-URL trailing slashes.
---

Normalize trailing slashes before looking up public routes in client-side SEO logic, and use the final slash-ending Netlify URLs consistently in canonical tags and sitemap entries.

**Why:** Netlify pretty URLs redirect directory-backed routes such as `/sluzby` to `/sluzby/`. If SEO route matching uses the raw pathname, the rendered page can be misclassified as unknown after JavaScript runs, replacing valid static metadata with `noindex` and a homepage canonical.

**How to apply:** Whenever public routes or SEO generation change, verify both the raw generated HTML and the rendered DOM at the final redirect destination. Canonical and sitemap URLs must match that final destination.