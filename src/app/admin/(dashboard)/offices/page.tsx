"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import OfficesManager from "@/components/admin/OfficesManager";
import { getToken } from "@/lib/adminApi";

export default function AdminOfficesPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Settings"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href="/admin/login?next=/admin/offices"
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
        >
          <FiLogIn /> Go to sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Settings"
        title="Offices"
        description="Your office locations. These appear as address cards on the public Contact page, and the headquarters (plus an “also in …” line) shows in the site footer. Flag exactly one office as the headquarters."
      />
      {hasToken === null ? (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          Loading…
        </div>
      ) : (
        <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
          <OfficesManager />
        </section>
      )}
    </>
  );
}
