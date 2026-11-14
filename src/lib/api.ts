import { Capacitor } from "@capacitor/core";

const RUNTIME_API_BASE_KEY = "cropguard_api_base_url";

/**
 * Resolves the backend API base URL:
 * - On Web browsers (AI Studio, Vercel, localhost): "" (same-origin relative `/api/...`)
 * - On Native Android APK (Capacitor `https://localhost`): uses `VITE_API_BASE_URL` or runtime override if configured.
 */
export function getApiBaseUrl(): string {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = String(metaEnv.VITE_API_BASE_URL || "").trim();
  const storedUrl =
    typeof window !== "undefined"
      ? String(window.localStorage?.getItem(RUNTIME_API_BASE_KEY) || "").trim()
      : "";

  const chosen = storedUrl || envUrl;
  if (!chosen) return "";
  return chosen.replace(/\/+$/, "");
}

/**
 * True when an Express/Vercel API backend is expected to exist:
 * - Always true on Web browsers (same-origin server or dev proxy)
 * - True on Native APK only if a remote `VITE_API_BASE_URL` is configured
 */
export function hasRemoteApiBackend(): boolean {
  if (!Capacitor.isNativePlatform()) {
    return true;
  }
  const base = getApiBaseUrl();
  return /^https?:\/\//i.test(base);
}

/**
 * Converts a relative `/api/...` path into an absolute URL when a remote base URL is configured.
 */
export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}

/**
 * Fetches an API route and verifies an actual JSON response (rejecting HTML SPA fallbacks or 302 login pages).
 */
export async function apiFetchJson<T = any>(
  path: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const { timeoutMs = 20000, ...fetchInit } = init || {};
  const url = apiUrl(path);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchInit,
      signal: controller.signal,
    });

    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (!response.ok) {
      let errMessage = `API request failed (${response.status})`;
      if (contentType.includes("application/json")) {
        try {
          const errJson = await response.json();
          errMessage = errJson?.error || errJson?.message || errMessage;
        } catch (_) {}
      }
      throw new Error(errMessage);
    }

    if (!contentType.includes("application/json")) {
      throw new Error(`Expected JSON response from ${path}, received "${contentType || "unknown"}"`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
