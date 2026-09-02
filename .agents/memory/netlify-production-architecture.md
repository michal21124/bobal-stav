---
name: Netlify production architecture
description: The chosen production topology for the Bobal Stav website and admin system.
---

Production should run as one Netlify project: the React frontend calls same-origin `/api/*` Netlify Functions, relational data uses Netlify Database, and gallery images use Netlify Blobs. Do not require `api.bobalstav.cz` or `VITE_API_BASE_URL` in production.

**Why:** The user explicitly chose a Netlify-only deployment to avoid maintaining a separate Replit API service and API subdomain.

**How to apply:** Preserve the same-origin API contract, Netlify-managed SQL migrations, Blob-backed image paths, and Netlify environment secrets when changing production behavior. The Replit API remains only for local preview compatibility.