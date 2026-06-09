// API configuration
import Constants from 'expo-constants';

/**
 * Resolve API base URL in this order:
 * 1. `EXPO_PUBLIC_API_URL` environment variable (useful when running `expo start` with env)
 * 2. `expo` extra config (app.json / eas) — `expoConfig.extra.EXPO_PUBLIC_API_URL` or `expoConfig.extra.apiUrl`
 * 3. Fallback developer default (localhost)
 */
const envUrl = (process.env as any).EXPO_PUBLIC_API_URL
  ?? (Constants?.expoConfig?.extra?.EXPO_PUBLIC_API_URL)
  ?? (Constants?.expoConfig?.extra?.apiUrl)
  ?? (Constants?.manifest?.extra?.EXPO_PUBLIC_API_URL);

export const DEFAULT_API_BASE_URL = String(envUrl ?? 'http://localhost:5170');

let API_BASE_URL = DEFAULT_API_BASE_URL;

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function setApiBaseUrl(url: string) {
  API_BASE_URL = String(url).replace(/\/+$/g, '');
  // Also set env var so devs can override at build time if needed. Best-effort only.
  try {
    (process.env as any).EXPO_PUBLIC_API_URL = API_BASE_URL;
  } catch {
    // ignore in environments that disallow writing to process.env
  }
}

/**
 * Builds a full URL for the backend `api` routes.
 * Pass a path like "/AlertasAmbientais" or "AlertasAmbientais/pendentes".
 */
export function buildApiUrl(path: string) {
  const base = getApiBaseUrl().replace(/\/+$/g, '');
  if (!path.startsWith('/')) path = '/' + path;
  return `${base}/api${path}`;
}
