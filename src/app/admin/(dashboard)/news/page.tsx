"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiCalendar,
  FiClock,
  FiLogIn,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import Highlight from "@/components/common/Highlight";
import { adminGet, getToken } from "@/lib/adminApi";

type NewsRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string | null;
  category: string;
  readMinutes?: number | null;
  publishedAt?: string | null;
  status: string;
};

const CATEGORY_TINT: Record<string, string> = {
  "Product Launch": "bg-secondary-50 text-secondary-700",
  "Company News": "bg-primary-50 text-primary-700",
  Industry: "bg-success-50 text-success-700",
  Project: "bg-accent-50 text-accent-800",
};

const CATEGORIES = ["Product Launch", "Company News", "Industry", "Project"];

function formatDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** News list — talks to /api/v1/admin/content/news (all statuses). */
export default function AdminNewsPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  // SWR: cached + instant on repeat navigation; keeps the previous list on
  // screen while a filter/search reloads.
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q.trim()) params.set("q", q.trim());
  const { data: rows = [], error: swrError, isLoading: loading } = useSWR<
    NewsRow[]
  >(
    hasToken
      ? `/api/v1/admin/content/news${params.toString() ? `?${params}` : ""}`
      : null,
    adminGet,
    { keepPreviousData: true }
  );
  const error = swrError
    ? swrError instanceof Error
      ? swrError.message
      : String(swrError)
    : null;

  const visible = rows.filter((r) =>
    statusFilter ? r.status === statusFilter : true
  );

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Content"
          title="News & Press"
          description="Sign in to manage news posts."
        />
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-10 text-center">
          <FiLogIn className="mx-auto text-3xl text-primary-500 mb-3" />
          <p className="text-base font-bold text-neutral-900 mb-1">
            Sign-in required
          </p>
          <p className="text-sm text-neutral-500 mb-5">
            The admin API rejects unauthenticated calls.
          </p>
          <Link
            href="/admin/login?next=/admin/news"
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiLogIn /> Go to sign in
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="News & Press"
        description="Editorial posts surfaced on the home page and the public /news section."
        actions={
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiPlus /> New post
          </Link>
        }
      />

      {/* Filters */}
      <div className="rounded-2xl bg-white-base border border-neutral-100 p-4 mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or excerpt..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-500 text-sm">
          <FiAlertCircle className="text-base mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs text-neutral-500">
          {loading ? (
            "Loading…"
          ) : (
            <>
              <span className="font-bold text-neutral-900">
                {visible.length}
              </span>{" "}
              {visible.length === 1 ? "post" : "posts"}
            </>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3 text-left">Post</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Published</th>
                <th className="px-4 py-3 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-neutral-500"
                  >
                    Loading posts…
                  </td>
                </tr>
              )}
              {!loading && visible.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-neutral-500"
                  >
                    {q || category || statusFilter
                      ? "No posts match your filters."
                      : "No posts yet — create one to get started."}
                  </td>
                </tr>
              )}
              {!loading &&
                visible.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 align-middle">
                      <Link
                        href={`/admin/news/${p.id}`}
                        className="group flex items-center gap-3 min-w-0"
                      >
                        <div className="relative w-12 h-10 shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                          {p.coverImage && (
                            <Image
                              src={encodeURI(p.coverImage)}
                              alt={p.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 truncate group-hover:text-primary-700 max-w-md">
                            <Highlight text={p.title} query={q} />
                          </p>
                          <p className="text-xs text-neutral-500 truncate max-w-md inline-flex items-center gap-2">
                            <FiClock className="shrink-0" />
                            {p.readMinutes ? `${p.readMinutes} min` : "—"}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          CATEGORY_TINT[p.category] ??
                          "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-4 py-3 align-middle text-xs text-neutral-500 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <FiCalendar /> {formatDate(p.publishedAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle text-right">
                      <Link
                        href={`/admin/news/${p.id}`}
                        aria-label="Edit"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                      >
                        <FiArrowUpRight />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
