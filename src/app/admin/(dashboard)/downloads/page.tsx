"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiBox,
  FiDownload,
  FiFile,
  FiLogIn,
  FiSearch,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import Highlight from "@/components/common/Highlight";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { adminDelete, adminGet, getToken } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";
import {
  mapEmbeddedDocument,
  type EmbeddedDocument,
  type EmbeddedDocumentRow,
} from "@/data/downloads";

type DocumentRow = {
  id: number;
  title: string;
  description?: string | null;
  category: string;
  language?: string | null;
  fileSizeKb?: number | null;
  url: string;
  uploadedAt?: string | null;
};

const CATEGORIES = [
  "Datasheets",
  "Brochures",
  "Interactive system visualizations",
  "Planning folder",
  "Checklist for Technical Support",
  "Product range",
  "Additional Technical Information",
  "Declaration of Performance",
  "Environmental Product Declaration",
  "Safety Data Sheets",
  "Test Reports",
];

function formatBytes(kb?: number | null) {
  if (!kb) return "—";
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * Downloads library. Two sources, shown together:
 *   - Standalone documents (/api/v1/admin/content/downloads) — editable here.
 *   - Documents attached to products — read-only, link to the owning product.
 */
export default function AdminDownloadsPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [standalone, setStandalone] = useState<DocumentRow[]>([]);
  const [productDocs, setProductDocs] = useState<EmbeddedDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const [pendingDelete, setPendingDelete] = useState<DocumentRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminDelete(`/api/v1/admin/content/downloads/${pendingDelete.id}`);
      setStandalone((prev) => prev.filter((d) => d.id !== pendingDelete.id));
      SuccessToast("Deleted", pendingDelete.title);
      setPendingDelete(null);
    } catch (e) {
      ErrorToast(
        "Delete failed",
        e instanceof Error ? e.message : "Unknown error."
      );
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (hasToken !== true) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (q.trim()) params.set("q", q.trim());
        const [std, prodRows] = await Promise.all([
          adminGet<DocumentRow[]>(
            `/api/v1/admin/content/downloads${
              params.toString() ? `?${params}` : ""
            }`
          ),
          adminGet<EmbeddedDocumentRow[]>(
            "/api/v1/admin/catalog/products/media/documents"
          ),
        ]);
        if (!cancelled) {
          setStandalone(std);
          setProductDocs(prodRows.map(mapEmbeddedDocument));
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load documents.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasToken, category, q]);

  // Product docs are filtered client-side (the admin endpoint returns all).
  const ql = q.trim().toLowerCase();
  const visibleProduct = productDocs.filter(
    (d) =>
      (category ? d.category === category : true) &&
      (ql ? d.title.toLowerCase().includes(ql) : true)
  );
  const total = standalone.length + visibleProduct.length;

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Content"
          title="Downloads"
          description="Sign in to manage documents."
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
            href="/admin/login?next=/admin/downloads"
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
        title="Downloads"
        description="Standalone documents plus every document attached to a product — all surfaced on /service/downloads."
        actions={
          <Link
            href="/admin/downloads/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiUpload /> Upload document
          </Link>
        }
      />

      <div className="rounded-2xl bg-white-base border border-neutral-100 p-4 mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documents..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
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
      </div>

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
                <th className="px-4 py-3 text-left">Document</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-neutral-500">
                    Loading documents…
                  </td>
                </tr>
              )}
              {!loading && total === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-neutral-500">
                    {q || category
                      ? "No documents match your filters."
                      : "No documents yet — upload one, or attach documents to a product."}
                  </td>
                </tr>
              )}

              {!loading &&
                standalone.map((d) => (
                  <tr key={`std-${d.id}`} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/downloads/${d.id}`}
                        className="group flex items-center gap-3"
                      >
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 text-base shrink-0">
                          <FiFile />
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 truncate group-hover:text-primary-700 max-w-md">
                            <Highlight text={d.title} query={q} />
                          </p>
                          {d.description && (
                            <p className="text-xs text-neutral-500 truncate max-w-md">
                              {d.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">
                      {d.category}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">Standalone</td>
                    <td className="px-4 py-3 text-neutral-700 font-mono text-xs">
                      {formatBytes(d.fileSizeKb)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open file"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                        >
                          <FiDownload />
                        </a>
                        <Link
                          href={`/admin/downloads/${d.id}`}
                          aria-label="Edit"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                        >
                          <FiArrowUpRight />
                        </Link>
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => setPendingDelete(d)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:bg-error-50 hover:text-error-500"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading &&
                visibleProduct.map((d, i) => (
                  <tr key={`prod-${d.productId}-${i}`} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 text-neutral-500 text-base shrink-0">
                          <FiFile />
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 truncate max-w-md">
                            <Highlight text={d.title} query={q} />
                          </p>
                          <p className="text-xs text-neutral-500 truncate max-w-md">
                            {d.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">
                      {d.category}
                    </td>
                    <td className="px-4 py-3">
                      {d.productId != null ? (
                        <Link
                          href={`/admin/products/${d.productId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                        >
                          <FiBox className="text-[11px]" /> {d.productName ?? "Product"}
                        </Link>
                      ) : (
                        <span className="text-neutral-500 text-xs">Product</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 font-mono text-xs">
                      {formatBytes(d.fileSizeKb)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open file"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                        >
                          <FiDownload />
                        </a>
                        {d.productId != null && (
                          <Link
                            href={`/admin/products/${d.productId}`}
                            aria-label="Edit on product"
                            title="Edit on the product"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                          >
                            <FiArrowUpRight />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={pendingDelete != null}
        danger
        title={
          pendingDelete ? `Delete "${pendingDelete.title}"?` : "Delete document?"
        }
        message="It will be removed from the public downloads library. This can't be undone from here."
        confirmLabel="Delete document"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
