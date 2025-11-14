import { hc } from "hono/client";
import type { AppType } from "server";

const DEFAULT_API_ORIGIN = "http://localhost:3000";

function normalizeApiOrigin(rawUrl?: string) {
  if (!rawUrl) {
    return DEFAULT_API_ORIGIN;
  }

  try {
    const url = new URL(rawUrl);
    url.search = "";
    url.hash = "";

    const cleanedPath = url.pathname
      .replace(/\/+$/, "")
      .replace(/\/api\/auth$/, "")
      .replace(/\/api$/, "");

    url.pathname = cleanedPath;
    return url.toString().replace(/\/$/, "");
  } catch {
    return rawUrl.replace(/\/api\/auth\/?$/, "").replace(/\/api\/?$/, "").replace(/\/$/, "");
  }
}

export const apiOrigin = normalizeApiOrigin(import.meta.env.VITE_API_URL);

export const apiClient = hc<AppType>(apiOrigin, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, { ...init, credentials: "include" }),
});

export function getAuthBaseUrl() {
  return `${apiOrigin.replace(/\/$/, "")}/api/auth`;
}
