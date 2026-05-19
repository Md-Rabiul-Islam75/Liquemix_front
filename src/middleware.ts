import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Multi-domain routing middleware (opt-in).
 *
 * Default behaviour (no env var set): no-op. Admin is reachable at
 * `liquemix.com/admin/*` — handy during development and during the
 * pre-launch demo when no dedicated subdomain exists yet.
 *
 * Strict mode (`ADMIN_HOST_ENABLED=true` in the environment): the admin
 * is only served from the `admin.*` subdomain. Files don't move — the
 * middleware rewrites requests:
 *
 *   admin.liquemix.com/         → renders /admin/
 *   admin.liquemix.com/products → renders /admin/products
 *   admin.liquemix.com/login    → renders /admin/login
 *
 * And on the public domain, any direct hit to `/admin/*` is rewritten
 * to a 404 path so the admin URL never leaks into search results or
 * shared links.
 *
 * Set `ADMIN_HOST_ENABLED=true` in Vercel's environment when the
 * subdomain DNS lands. No code change required.
 */

const ADMIN_SUBDOMAIN_PREFIX = "admin.";

function isAdminHost(host: string): boolean {
  return host.startsWith(ADMIN_SUBDOMAIN_PREFIX) || host === "admin.localhost";
}

export function middleware(request: NextRequest) {
  if (process.env.ADMIN_HOST_ENABLED !== "true") {
    return NextResponse.next();
  }

  const host = (request.headers.get("host") ?? "").toLowerCase();
  const { pathname } = request.nextUrl;

  if (isAdminHost(host)) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin" + (pathname === "/" ? "" : pathname);
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/_admin-not-on-this-host";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on every page request, but skip Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo|images|dummy_products_images|document-sheet).*)"],
};
