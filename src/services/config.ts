// API configuration
export const DEFAULT_API_BASE_URL = (process.env as any).EXPO_PUBLIC_API_URL ?? 'http://localhost:5170';

let API_BASE_URL = DEFAULT_API_BASE_URL;

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function setApiBaseUrl(url: string) {
  API_BASE_URL = String(url).replace(/\/+$/g, '');
  // Also set env var so devs can override at build time if needed
  (process.env as any).EXPO_PUBLIC_API_URL = API_BASE_URL;
}

/**
 * Builds a full URL for the backend `api` routes.
 * Pass a path like `"/AlertasAmbientais"` or `"AlertasAmbientais/pendentes"`.
 */
export function buildApiUrl(path: string) {
  const base = getApiBaseUrl().replace(/\/+$/g, '');
  if (!path.startsWith('/')) path = '/' + path;
  return `${base}/api${path}`;
}
