/**
 * Public API client — fetches from the backend without auth (no Bearer).
 * Used by server components that render the public marketing site.
 *
 * Every backend response wraps payload in {status,data,message,meta}.
 * This helper unwraps `data` so callers see just the entity / entities.
 *
 * Cache policy: `no-store` on every request so the public site reflects
 * the latest admin edits immediately. Swap per-route to `next.revalidate`
 * once we settle on freshness windows (e.g. featured products = 60s).
 */

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type Envelope<T> = {
  status: "success" | "error";
  data: T;
  meta?: unknown;
  message?: string | null;
};

/** Distinct error type for HTTP 404 so callers can treat "no such row"
 *  as a normal outcome rather than a real failure. */
export class ApiNotFoundError extends Error {
  constructor(path: string) {
    super(`API ${path} → HTTP 404`);
    this.name = "ApiNotFoundError";
  }
}

/** Refuse to call URLs that contain literal "undefined" segments —
 *  almost always a frontend bug, never a real lookup. */
function isJunkPath(path: string): boolean {
  return /\/undefined(?=\/|$|\?)/.test(path);
}

export async function apiGet<T>(path: string): Promise<T> {
  if (isJunkPath(path)) {
    throw new ApiNotFoundError(path);
  }
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (res.status === 404) {
    throw new ApiNotFoundError(path);
  }
  if (!res.ok) {
    throw new Error(`API ${path} → HTTP ${res.status}`);
  }
  const json = (await res.json()) as Envelope<T>;
  if (json.status !== "success") {
    throw new Error(`API ${path} → ${json.message ?? "non-success"}`);
  }
  return json.data;
}

/**
 * Try the API; if it returns 404 or fails, fall back to the value
 * provided. 404s are silent (a "no such row" is normal for by-slug
 * lookups); other errors print a one-line warning in dev so backend
 * issues are still visible without a stack-trace flood.
 */
export async function apiGetOr<T>(path: string, fallback: T): Promise<T> {
  try {
    return await apiGet<T>(path);
  } catch (e) {
    const isNotFound = e instanceof ApiNotFoundError;
    if (!isNotFound && process.env.NODE_ENV !== "production") {
      console.warn(
        `[api] ${path} failed (${
          e instanceof Error ? e.message : String(e)
        }); using fallback.`
      );
    }
    return fallback;
  }
}
