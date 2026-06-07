"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiLogIn } from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import DownloadEditor from "@/components/admin/DownloadEditor";
import { getToken } from "@/lib/adminApi";

/**
 * Admin edit screen for one download document. The static /new route takes
 * precedence in Next routing, so this file only ever sees numeric ids.
 */
export default function AdminDownloadEditPage() {
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
          eyebrow="Downloads"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href={`/admin/login?next=/admin/downloads/${raw}`}
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
        eyebrow="Downloads"
        title="Invalid document URL"
        description={`"${raw}" is not a valid document id. Open one from the list.`}
        actions={
          <Link
            href="/admin/downloads"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
          >
            Back to list
          </Link>
        }
      />
    );
  }

  return <DownloadEditor mode="edit" id={idNum} />;
}
