// API configuration
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Resolve API base URL in this order:
 * 1. `EXPO_PUBLIC_API_URL` environment variable (useful when running `expo start` with env)
 * 2. `expo` extra config (app.json / eas) — `expoConfig.extra.EXPO_PUBLIC_API_URL` or `expoConfig.extra.apiUrl`
 * 3. Fallback developer default (localhost)
 *
 * Behavior improvements:
 * - When the resolved host is `localhost`/`127.0.0.1` and running on Android,
 *   the host is rewritten to `10.0.2.2` so the Android emulator can reach the
 *   machine running the API.
 * - For physical devices, set `EXPO_PUBLIC_API_URL` to `http://<MACHINE_IP>:<PORT>`
 *   or call `setApiBaseUrl(...)` at startup.
 */
const envUrl =
  (process.env as any).EXPO_PUBLIC_API_URL ??
  Constants?.expoConfig?.extra?.EXPO_PUBLIC_API_URL ??
  Constants?.expoConfig?.extra?.apiUrl ??
  Constants?.manifest?.extra?.EXPO_PUBLIC_API_URL;

export const DEFAULT_API_BASE_URL = String(envUrl ?? "http://localhost:5170");

let API_BASE_URL = DEFAULT_API_BASE_URL;

export function getApiBaseUrl(): string {
  const candidateRaw = String(API_BASE_URL || DEFAULT_API_BASE_URL).trim();

  // Ensure protocol exists for URL parsing
  const withProto = /^https?:\/\//i.test(candidateRaw)
    ? candidateRaw
    : `http://${candidateRaw}`;

  try {
    const u = new URL(withProto);
    let hostname = u.hostname;
    const port = u.port;

    // If developer left localhost (default), map it for Android emulators.
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      if (Platform.OS === "android") {
        hostname = "10.0.2.2";
      }
    }

    let proto = u.protocol || "http:";
    const portSuffix = port ? `:${port}` : "";
    const path = u.pathname.replace(/\/+$/g, "");

    // Rewrite local hostnames to the Android emulator host and force HTTP
    if (Platform.OS === "android") {
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "10.0.2.2"
      ) {
        hostname = "10.0.2.2";
        proto = "http:";
      }
    }

    // Return without trailing slash
    return `${proto}//${hostname}${portSuffix}${path}`.replace(/\/+$/g, "");
  } catch {
    // If parsing fails, attempt simple replacement for localhost on Android
    if (
      Platform.OS === "android" &&
      /(localhost|127\.0\.0\.1|10\.0\.2\.2)/.test(candidateRaw)
    ) {
      return candidateRaw
        .replace(
          /https:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2)/i,
          "http://10.0.2.2",
        )
        .replace(/localhost|127\.0\.0\.1/g, "10.0.2.2")
        .replace(/\/+$/g, "");
    }
    return candidateRaw.replace(/\/+$/g, "");
  }
}

export function setApiBaseUrl(url: string) {
  API_BASE_URL = String(url).replace(/\/+$/g, "");
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
  let base = getApiBaseUrl().replace(/\/+$/g, "");
  // Allow base to already include /api
  if (!base.endsWith("/api")) base = `${base}/api`;
  if (!path.startsWith("/")) path = "/" + path;
  return `${base}${path}`;
}
