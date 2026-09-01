// Netlify serves the API from this origin. A configured URL remains an explicit
// local-preview override for the existing Replit API artifact.
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");

export const apiBaseUrl = configuredApiBaseUrl || "";

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}