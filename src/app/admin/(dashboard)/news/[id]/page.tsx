"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiLogIn } from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import NewsEditor from "@/components/admin/NewsEditor";
import { getToken } from "@/lib/adminApi";

/**
 * Admin edit screen for one news post. The static /new route takes
 * precedence in Next routing, so this file only ever sees numeric ids —
 * but we still parse-check defensively.
 */
export default function AdminNewsEditPage() {
  const params = useParams<{ id: string }>();
  const raw = params?.id ?? "";
  const idNum = Number(raw);
  const isValidId = raw.length > 0 && Number.isFinite(idNum) && idNum > 0;

  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  if (hasToken === null) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
        Checking session…
      </div>
    );
  }

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="News & Press"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href={`/admin/login?next=/admin/news/${raw}`}
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
        >
          <FiLogIn /> Go to sign in
        </Link>
      </>
    );
  }

  if (!isValidId) {
    return (
      <AdminPageHeader
        eyebrow="News & Press"
        title="Invalid post URL"
        description={`"${raw}" is not a valid post id. Open one from the list.`}
        actions={
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
          >
            Back to list
          </Link>
        }
      />
    );
  }

  return <NewsEditor mode="edit" id={idNum} />;
}
