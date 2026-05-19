import Image from "next/image";
import Link from "next/link";
import {
  FiArrowUpRight,
  FiDownload,
  FiFilter,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiStar,
  FiTag,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import { products } from "@/data/products";
import { segments, getSegmentById } from "@/data/segments";

export const metadata = { title: "Products" };

const SEGMENT_DOT: Record<string, string> = {
  blue: "bg-primary-500",
  orange: "bg-secondary-500",
  yellow: "bg-accent-500",
  green: "bg-success-500",
};

/**
 * Products list — the main admin entry point for the catalog.
 *
 * Currently renders all products; pagination is left as a UI-only stub
 * until the backend exposes paged endpoints (cursor or page-based).
 */
export default function AdminProductsListPage() {
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
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
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
            placeholder="Search by name, SKU, or description..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            defaultValue=""
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
            defaultValue=""
            className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700"
          >
            <FiFilter /> More
          </button>
        </div>
      </div>

      {/* Bulk action bar (visible-on-select stub) */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs text-neutral-500">
          <span className="font-bold text-neutral-900">{products.length}</span>{" "}
          products · all visible
        </p>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>Bulk:</span>
          <button className="font-semibold text-neutral-700 hover:text-primary-700">
            Change status
          </button>
          <span className="text-neutral-300">·</span>
          <button className="font-semibold text-neutral-700 hover:text-primary-700">
            Move segment
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300 text-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Segment</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Flags</th>
                <th className="px-4 py-3 text-left">Updated</th>
                <th className="px-4 py-3 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((p) => {
                const seg = getSegmentById(p.segmentId);
                const primary =
                  p.images.find((i) => i.isPrimary) ?? p.images[0];
                const status = p.isNew ? "Draft" : "Published";
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3 align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-300 text-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="group flex items-center gap-3 min-w-0"
                      >
                        <div className="relative w-10 h-10 shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                          {primary && (
                            <Image
                              src={encodeURI(primary.url)}
                              alt={primary.alt}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
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
                        {seg?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <StatusPill status={status} />
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
                      {new Date(p.publishedAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
                        <button
                          type="button"
                          aria-label="Row menu"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-neutral-100"
                        >
                          <FiMoreVertical />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination stub */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 text-xs text-neutral-500">
          <span>
            Showing <span className="font-bold text-neutral-900">1</span>–
            <span className="font-bold text-neutral-900">
              {products.length}
            </span>{" "}
            of <span className="font-bold text-neutral-900">{products.length}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="h-8 px-3 rounded-md border border-neutral-200 font-semibold text-neutral-400 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled
              className="h-8 px-3 rounded-md border border-neutral-200 font-semibold text-neutral-400 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
