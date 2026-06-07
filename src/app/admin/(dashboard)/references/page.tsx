"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiCalendar,
  FiLogIn,
  FiMapPin,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import Highlight from "@/components/common/Highlight";
import { adminGet, getToken } from "@/lib/adminApi";

type ReferenceRow = {
  id: number;
  slug: string;
  title: string;
  projectType: string;
  location?: { country?: string | null; city?: string | null } | null;
  year?: number | null;
  heroImage?: string | null;
  status: string;
};

/** References list — talks to /api/v1/admin/content/references (all statuses). */
export default function AdminReferencesPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [rows, setRows] = useState<ReferenceRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [projectType, setProjectType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
        const params = new URLSearchParams();
        if (projectType) params.set("projectType", projectType);
        if (q.trim()) params.set("q", q.trim());
        const result = await adminGet<ReferenceRow[]>(
          `/api/v1/admin/content/references${
            params.toString() ? `?${params}` : ""
          }`
        );
        if (!cancelled) setRows(result);
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "Failed to load references."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasToken, projectType, q]);

  // Distinct project types for the filter — derived from the loaded rows.
  const types = Array.from(new Set(rows.map((r) => r.projectType))).sort();
  const visible = rows.filter((r) =>
    statusFilter ? r.status === statusFilter : true
  );

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Content"
          title="Reference projects"
          description="Sign in to manage reference projects."
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
            href="/admin/login?next=/admin/references"
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
        title="Reference projects"
        description="Real installations of LiqueMix systems. The strongest social proof on the public site."
        actions={
          <Link
            href="/admin/references/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiPlus /> New reference
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
            placeholder="Search by title, city, or country..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
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
              {visible.length === 1 ? "reference" : "references"}
            </>
          )}
        </p>
      </div>

      {/* Grid of cards */}
      {loading ? (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          Loading references…
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          {q || projectType || statusFilter
            ? "No references match your filters."
            : "No references yet — create one to get started."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((r) => (
            <Link
              key={r.id}
              href={`/admin/references/${r.id}`}
              className="group rounded-2xl bg-white-base border border-neutral-100 overflow-hidden hover:border-primary-200 hover:shadow-soft transition-all"
            >
              <div className="relative aspect-[16/10] bg-neutral-800">
                {r.heroImage && (
                  <Image
                    src={encodeURI(r.heroImage)}
                    alt={r.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/10 to-transparent" />
                <div className="absolute top-3 left-3">
                  <StatusPill status={r.status} />
                </div>
                <span className="absolute bottom-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white-base/95 text-primary-700 shadow-lg group-hover:bg-primary-500 group-hover:text-white-base transition-colors">
                  <FiArrowUpRight />
                </span>
              </div>
              <div className="p-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-neutral-100 text-neutral-700">
                  {r.projectType}
                </span>
                <h3 className="mt-2 text-sm font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-primary-700">
                  <Highlight text={r.title} query={q} />
                </h3>
                <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <FiMapPin className="shrink-0" />
                    {[r.location?.city, r.location?.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 shrink-0">
                    <FiCalendar /> {r.year ?? "—"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
