import { pluginMountPath } from "./mountPath";
import { normalizeOverview } from "./dashboard";
import type { Overview } from "./types";

let cachedToken = "";

export function captureTokenFromURL(): void {
  const params = new URLSearchParams(window.location.search);
  cachedToken = params.get("token") || "";
  const theme = params.get("theme") || sessionStorage.getItem("continuum-theme") || "";
  if (theme) {
    document.documentElement.dataset.theme = theme;
    try {
      sessionStorage.setItem("continuum-theme", theme);
    } catch {
      // Ignore storage failures in private browsing contexts.
    }
  }
  if (!params.has("token")) return;
  params.delete("token");
  const clean = window.location.pathname + (params.toString() ? `?${params.toString()}` : "") + window.location.hash;
  window.history.replaceState(null, "", clean);
}

function authHeaders(): Record<string, string> {
  return cachedToken ? { Authorization: `Bearer ${cachedToken}` } : {};
}

export async function fetchOverview(signal?: AbortSignal): Promise<Overview> {
  const base = pluginMountPath();
  const response = await fetch(`${base}/api/overview`, {
    signal,
    headers: { Accept: "application/json", ...authHeaders() },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with ${response.status}`);
  }
  const payload = (await response.json()) as Partial<Overview>;
  return normalizeOverview(payload);
}

export async function fetchConfig(): Promise<Record<string, unknown>> {
  const response = await fetch(`${pluginMountPath()}/api/config`, {
    headers: { Accept: "application/json", ...authHeaders() },
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as Record<string, unknown>;
}

export async function saveConfigJSON(raw: string): Promise<Record<string, unknown>> {
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const response = await fetch(`${pluginMountPath()}/api/config`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(parsed),
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as Record<string, unknown>;
}
