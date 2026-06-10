"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiClock,
  FiInbox,
  FiLogIn,
  FiMail,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import { adminGet, getToken } from "@/lib/adminApi";

type Enquiry = {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  createdAt?: string | null;
};

type PageOf<T> = { items: T[]; total: number; page: number; pages: number };

function timeAgo(d?: string | null) {
  if (!d) return "—";
  const s = Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminEnquiriesPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [data, setData] = useState<PageOf<Enquiry> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  useEffect(() => {
    if (hasToken !== true) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await adminGet<PageOf<Enquiry>>(
          `/api/v1/admin/enquiries?page=${page}&size=30`
        );
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load enquiries.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasToken, page]);

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader eyebrow="Content" title="Enquiries" />
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-10 text-center">
          <FiLogIn className="mx-auto text-3xl text-primary-500 mb-3" />
          <p className="text-base font-bold text-neutral-900 mb-1">
            Sign-in required
          </p>
          <Link
            href="/admin/login?next=/admin/enquiries"
            className="mt-3 inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiLogIn /> Go to sign in
          </Link>
        </div>
      </>
    );
  }

  const rows = data?.items ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Enquiries"
        description="People who signed in via the public Enquire button — your leads to follow up."
      />

      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-500 text-sm">
          <FiAlertCircle className="text-base mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3 text-left">Person</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Enquired</th>
                <th className="px-4 py-3 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-sm text-neutral-500">
                    Loading enquiries…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-sm text-neutral-500">
                    <FiInbox className="mx-auto text-2xl text-neutral-300 mb-2" />
                    No enquiries yet — they appear here when a visitor signs in
                    to enquire.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((u) => {
                  const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
                  return (
                    <tr key={u.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-700 text-sm font-bold">
                            {(name || u.email)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                          <p className="font-semibold text-neutral-900 truncate">
                            {name || "—"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${u.email}`}
                          className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <FiMail className="text-xs" /> {u.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <FiClock /> {timeAgo(u.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={`mailto:${u.email}`}
                          aria-label="Reply"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                        >
                          <FiMail />
                        </a>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {!loading && data && data.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 text-xs text-neutral-500">
            <span>
              Page <span className="font-bold text-neutral-900">{data.page}</span>{" "}
              of <span className="font-bold text-neutral-900">{data.pages}</span>{" "}
              · {data.total} total
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 px-3 rounded-md border border-neutral-200 font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => (data && p < data.pages ? p + 1 : p))}
                disabled={!data || page >= data.pages}
                className="h-8 px-3 rounded-md border border-neutral-200 font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
