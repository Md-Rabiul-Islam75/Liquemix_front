/**
 * Admin API client — separate from the public `lib/api.ts` because admin
 * endpoints require a bearer token. Token lives in localStorage for now
 * (simple, refresh-survives-tab-close); the backend also drops an HttpOnly
 * refresh-token cookie so we can rotate without touching localStorage.
 *
 * When the project moves to admin.liquemix.com later, this file is the
 * one to swap to an httpOnly-cookie-only model.
 */

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const TOKEN_KEY = "liquemix_admin_access_token";
const USER_KEY = "liquemix_admin_user";

export type AdminUser = {
  id: number | string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

type Envelope<T> = {
  status: "success" | "error";
  data: T;
  meta?: unknown;
  message?: string | null;
  errors?: unknown;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getCachedUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

function cacheUser(u: AdminUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(u));
}

/** Login. Returns the access token + user (and stores both). */
export async function adminLogin(
  email: string,
  password: string
): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch(`${BASE}/api/v1/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // refresh-token cookie
  });
  const json = (await res.json()) as Envelope<Record<string, unknown>>;
  if (!res.ok || json.status !== "success") {
    throw new Error(
      typeof json.message === "string"
        ? json.message
        : "Login failed — check email and password."
    );
  }
  const body = json.data ?? {};
  const token =
    (body.accessToken as string) ??
    (body.token as string) ??
    (body.access_token as string);
  if (!token) {
    throw new Error("Login succeeded but no access token in response.");
  }
  const user: AdminUser = {
    id: (body.id as number) ?? "",
    email: (body.email as string) ?? email,
    firstName: body.firstName as string | undefined,
    lastName: body.lastName as string | undefined,
    role: body.role as string | undefined,
  };
  setToken(token);
  cacheUser(user);
  return { token, user };
}

async function call<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
  const text = await res.text();
  const json = text ? (JSON.parse(text) as Envelope<T>) : ({} as Envelope<T>);
  if (!res.ok || json.status === "error") {
    throw new Error(
      typeof json.message === "string" && json.message
        ? json.message
        : `API ${path} failed (HTTP ${res.status})`
    );
  }
  return json.data;
}

export function adminGet<T>(path: string): Promise<T> {
  return call<T>(path, { method: "GET" });
}

export function adminPost<T>(path: string, body: unknown): Promise<T> {
  return call<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export function adminPut<T>(path: string, body: unknown): Promise<T> {
  return call<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

export function adminPatch<T>(path: string, body: unknown): Promise<T> {
  return call<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}

export function adminDelete<T>(path: string): Promise<T> {
  return call<T>(path, { method: "DELETE" });
}
