const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");

export const apiBaseUrl = configuredApiBaseUrl || "";

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}