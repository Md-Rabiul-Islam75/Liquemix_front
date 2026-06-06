"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiLogIn } from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import NewsEditor from "@/components/admin/NewsEditor";
import { getToken } from "@/lib/adminApi";

export default function NewNewsPage() {
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
          href="/admin/login?next=/admin/news/new"
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
        >
          <FiLogIn /> Go to sign in
        </Link>
      </>
    );
  }

  return <NewsEditor mode="new" />;
}
