/**
 * Public API client — fetches from the backend without auth (no Bearer).
 * Used by server components that render the public marketing site.
 *
 * Every backend response wraps payload in {status,data,message,meta}.
 * This helper unwraps `data` so callers see just the entity / entities.
 *
 * Cache policy: responses are cached and tagged per resource. Pages serve
 * instantly from cache; an admin edit fires an on-demand purge (POST
 * /api/revalidate → revalidateTag) so the change shows within ~1s. The
 * `revalidate` window below is a safety net that heals the cache even if a
 * purge is ever missed.
 */

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/**
 * Whether public fetchers may fall back to the bundled mock catalog when
 * the backend is unreachable. OFF by default — and that default matters.
 *
 * The mock catalog is a *different* set of products/solutions than what
 * admin manages. If it leaks into the live site (e.g. a slow call trips
 * the request timeout), it renders phantom cards that:
 *   • don't match the admin catalog ("why is this product here?"), and
 *   • 404 on their detail page, because a mock product's string segmentId
 *     can never match a real numeric segment id.
 *
 * So in normal operation the public site shows ONLY real admin data; a
 * failed fetch yields empty/undefined (an honest "nothing here") instead
 * of a fake product. Set NEXT_PUBLIC_USE_MOCK_FALLBACK=true only for
 * offline dev or a backend-less demo, where seeing the mock is the point.
 */
export const USE_MOCK_FALLBACK =
  process.env.NEXT_PUBLIC_USE_MOCK_FALLBACK === "true";

/** Safety-net revalidation window (seconds). On-demand purges keep content
 *  fresh in real time; this just guarantees eventual freshness. */
const REVALIDATE_SECONDS = 600;

/**
 * Derive the cache tag(s) for a backend path so a public fetch can be
 * purged by resource. MUST stay in sync with the admin-side tag map in
 * lib/adminApi.ts (tagsForAdminPath) — same strings on both ends.
 */
export function tagsForPath(path: string): string[] {
  if (path.includes("/products")) return ["products"];
  if (path.includes("/categories")) return ["categories"];
  if (path.includes("/segments")) return ["segments"];
  if (path.includes("/solutions")) return ["solutions"];
  if (path.includes("/news")) return ["news"];
  if (path.includes("/references")) return ["references"];
  if (path.includes("/downloads")) return ["downloads"];
  if (path.includes("/videos")) return ["videos"];
  if (path.includes("/settings")) return ["settings"];
  return ["public"];
}

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

/**
 * Hard cap on how long any single backend call can hang. Node's default
 * fetch has no timeout — if the backend wedges (Hibernate stuck on a
 * locked row, GC pause, network partition), Next.js will keep awaiting
 * the request forever and a page render can wait minutes. 8s is well
 * above any healthy API call and well below "user thinks the site is
 * broken". apiGetOr will fall through to the mock fallback on timeout,
 * so a slow/overloaded backend degrades to mock content fast instead of
 * blocking the whole server render.
 */
const REQUEST_TIMEOUT_MS = 8_000;

export async function apiGet<T>(path: string): Promise<T> {
  if (isJunkPath(path)) {
    throw new ApiNotFoundError(path);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: tagsForPath(path) },
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error(`API ${path} → timed out after ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
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
