import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand cache purge. The admin client calls this after a successful
 * write (see lib/adminApi.ts → purgePublic) so public pages reflect the
 * edit within ~1s instead of waiting for the revalidate window.
 *
 * Auth: there's no shared secret to leak in client JS. Instead we verify
 * the caller's admin Bearer token against a protected backend endpoint —
 * if the backend accepts it, the caller is a real admin and may purge.
 */

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json(
      { status: "error", message: "Missing bearer token" },
      { status: 401 }
    );
  }

  // Verify the token by hitting a protected admin endpoint.
  let verify: Response;
  try {
    verify = await fetch(`${BACKEND}/api/v1/admin/dashboard/counts`, {
      headers: { Authorization: auth },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Could not verify token" },
      { status: 502 }
    );
  }
  if (!verify.ok) {
    return NextResponse.json(
      { status: "error", message: "Invalid token" },
      { status: 401 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as { tags?: unknown };
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === "string")
    : [];
  if (!tags.length) {
    return NextResponse.json(
      { status: "error", message: "No tags provided" },
      { status: 400 }
    );
  }

  // "max" = immediate on-demand purge (Next 16 requires the profile arg).
  for (const tag of tags) revalidateTag(tag, "max");
  return NextResponse.json({ status: "success", revalidated: tags });
}
