"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import LogoListManager from "@/components/admin/LogoListManager";
import { getToken } from "@/lib/adminApi";

export default function AdminTopClientsPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Content"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href="/admin/login?next=/admin/top-clients"
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
        eyebrow="Content"
        title="Top Clients"
        description="Logos shown in the sliding carousel above the segments section on the home page. The whole section stays hidden on the public site until at least one active client exists."
      />
      {hasToken === null ? (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          Loading…
        </div>
      ) : (
        <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
          <LogoListManager
            endpoint="/api/v1/admin/content/top-clients"
            itemNoun="client"
            uploadPrefix="top-clients"
            addLabel="Add client"
          />
        </section>
      )}
    </>
  );
}
