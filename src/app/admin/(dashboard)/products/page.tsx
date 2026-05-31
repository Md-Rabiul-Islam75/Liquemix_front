"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiDownload,
  FiFilter,
  FiLogIn,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiStar,
  FiTag,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import { adminGet, getToken } from "@/lib/adminApi";

type SegmentLite = { id: number; slug: string; name: string; color: string };

type ProductRow = {
  id: number;
  sku: string;
  slug: string;
  name: string;
  shortDescription: string;
  segmentId: number;
  status: "draft" | "published" | "archived";
  isFeatured?: boolean;
  isNew?: boolean;
  publishedAt?: string | null;
  images: { url: string; alt: string; isPrimary?: boolean }[];
};

type PageOf<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};

const SEGMENT_DOT: Record<string, string> = {
  blue: "bg-primary-500",
  orange: "bg-secondary-500",
  yellow: "bg-accent-500",
  green: "bg-success-500",
};

/**
 * Products list — talks to /api/v1/admin/catalog/products (all statuses).
 * Pagination is server-side; segment / status filters re-fetch.
 */
export default function AdminProductsListPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [segments, setSegments] = useState<SegmentLite[]>([]);
  const [data, setData] = useState<PageOf<ProductRow> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [segmentId, setSegmentId] = useState<string>(""); // "" = all
  const [statusFilter, setStatusFilter] = useState<string>(""); // client-side
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  // Load segments once
  useEffect(() => {
    if (hasToken !== true) return;
    (async () => {
      try {
        const segs = await adminGet<SegmentLite[]>("/api/v1/catalog/segments");
        setSegments(segs);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load segments.");
      }
    })();
  }, [hasToken]);

  // Load products whenever filters change
  useEffect(() => {
    if (hasToken !== true) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (segmentId) params.set("segmentId", segmentId);
        if (q.trim()) params.set("q", q.trim());
        params.set("page", String(page));
        params.set("size", String(pageSize));
        const result = await adminGet<PageOf<ProductRow>>(
          `/api/v1/admin/catalog/products?${params.toString()}`
        );
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load products.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasToken, segmentId, q, page]);

  const segmentByid = (id: number) => segments.find((s) => s.id === id);

  // Apply status filter client-side
  const visible = (data?.items ?? []).filter((p) =>
    statusFilter ? p.status === statusFilter : true
  );

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Catalog"
          title="Products"
          description="Sign in to manage products."
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
            href="/admin/login?next=/admin/products"
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
        eyebrow="Catalog"
        title="Products"
        description="Every product the public site renders comes from this table."
        actions={
          <>
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-400 cursor-not-allowed"
            >
              <FiDownload /> Export CSV
            </button>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors"
            >
              <FiPlus /> New product
            </Link>
          </>
        }
      />

      {/* Filters */}
      <div className="rounded-2xl bg-white-base border border-neutral-100 p-4 mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Search by name, SKU, or description..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={segmentId}
            onChange={(e) => {
              setPage(1);
              setSegmentId(e.target.value);
            }}
            className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
          >
            <option value="">All segments</option>
            {segments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
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
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-400 cursor-not-allowed"
          >
            <FiFilter /> More
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-500 text-sm">
          <FiAlertCircle className="text-base mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Count strip */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs text-neutral-500">
          {loading ? (
            "Loading…"
          ) : (
            <>
              <span className="font-bold text-neutral-900">
                {visible.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-neutral-900">
                {data?.total ?? 0}
              </span>{" "}
              products
            </>
          )}
        </p>
        <p className="text-xs text-neutral-500">
          Page <span className="font-bold text-neutral-900">{page}</span> of{" "}
          <span className="font-bold text-neutral-900">{data?.pages ?? 1}</span>
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Segment</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Flags</th>
                <th className="px-4 py-3 text-left">Published</th>
                <th className="px-4 py-3 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-neutral-500"
                  >
                    Loading products…
                  </td>
                </tr>
              )}
              {!loading && visible.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-neutral-500"
                  >
                    {q || segmentId || statusFilter
                      ? "No products match your filters."
                      : "No products yet — create one to get started."}
                  </td>
                </tr>
              )}
              {!loading &&
                visible.map((p) => {
                  const seg = segmentByid(p.segmentId);
                  const primary =
                    p.images.find((i) => i.isPrimary) ?? p.images[0];
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-4 py-3 align-middle">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="group flex items-center gap-3 min-w-0"
                        >
                          <div className="relative w-10 h-10 shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                            {primary && (
                              <Image
                                src={primary.url}
                                alt={primary.alt}
                                fill
                                sizes="40px"
                                className="object-contain p-1"
                                unoptimized
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 truncate group-hover:text-primary-700">
                              {p.name}
                            </p>
                            <p className="text-xs text-neutral-500 truncate max-w-xs">
                              {p.shortDescription}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 align-middle font-mono text-xs text-neutral-600 whitespace-nowrap">
                        {p.sku}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
                          <span
                            className={`block w-1.5 h-1.5 rounded-full ${
                              SEGMENT_DOT[seg?.color ?? "blue"]
                            }`}
                          />
                          {seg?.name ?? `Segment ${p.segmentId}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <StatusPill status={p.status} />
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-1">
                          {p.isFeatured && (
                            <span
                              title="Featured"
                              className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-accent-50 text-accent-700"
                            >
                              <FiStar className="text-xs" />
                            </span>
                          )}
                          {p.isNew && (
                            <span
                              title="New"
                              className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-secondary-50 text-secondary-700"
                            >
                              <FiTag className="text-xs" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle text-xs text-neutral-500 whitespace-nowrap">
                        {p.publishedAt
                          ? new Date(p.publishedAt).toLocaleDateString("en-GB", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 align-middle text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/admin/products/${p.id}`}
                            aria-label="Edit"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                          >
                            <FiArrowUpRight />
                          </Link>
                          <span
                            aria-label="Row menu"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400"
                          >
                            <FiMoreVertical />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 text-xs text-neutral-500">
          <span>
            Showing <span className="font-bold text-neutral-900">{visible.length}</span>{" "}
            of <span className="font-bold text-neutral-900">{data?.total ?? 0}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="h-8 px-3 rounded-md border border-neutral-200 font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPage((p) =>
                  data && p < (data.pages ?? 1) ? p + 1 : p
                )
              }
              disabled={!data || page >= data.pages || loading}
              className="h-8 px-3 rounded-md border border-neutral-200 font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
