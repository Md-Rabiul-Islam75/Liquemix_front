"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiLogIn,
  FiPlus,
  FiSave,
  FiTag,
  FiTrash,
  FiX,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import { adminGet, adminPost, getToken } from "@/lib/adminApi";

type SegmentLite = {
  id: number;
  slug: string;
  name: string;
  color: string;
};

type CategoryLite = {
  id: number;
  segmentId: number;
  parentId: number | null;
  slug: string;
  name: string;
};

type CreatedProduct = {
  id: number;
  slug: string;
  name: string;
};

/**
 * New product form. Talks to:
 *   GET  /api/v1/catalog/segments       (public — populates segment dropdown)
 *   GET  /api/v1/catalog/categories?…   (public — populates category checkboxes)
 *   POST /api/v1/admin/catalog/products (admin  — creates the product)
 *
 * Auth: requires a valid admin JWT in localStorage. If missing, we show
 * a login prompt rather than letting the user fill the form and lose
 * everything to a 401.
 */
export default function NewProductPage() {
  const router = useRouter();

  // ─── Auth gate ────────────────────────────────────────────────────
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  // ─── Reference data ───────────────────────────────────────────────
  const [segments, setSegments] = useState<SegmentLite[]>([]);
  const [categories, setCategories] = useState<CategoryLite[]>([]);
  const [refError, setRefError] = useState<string | null>(null);

  useEffect(() => {
    if (hasToken !== true) return;
    (async () => {
      try {
        const segs = await adminGet<SegmentLite[]>("/api/v1/catalog/segments");
        setSegments(segs);
        if (segs.length > 0) setSegmentId(segs[0].id);
      } catch (e) {
        setRefError(e instanceof Error ? e.message : "Failed to load segments.");
      }
    })();
  }, [hasToken]);

  // ─── Form state ───────────────────────────────────────────────────
  const [segmentId, setSegmentId] = useState<number | null>(null);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [applicationAreas, setApplicationAreas] = useState<string[]>([""]);
  const [advantages, setAdvantages] = useState<string[]>([""]);
  const [consumptionValue, setConsumptionValue] = useState("");
  const [consumptionUnit, setConsumptionUnit] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(
    new Set()
  );

  // ─── Submission feedback ──────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState<CreatedProduct | null>(null);

  // ─── Reload categories whenever segment changes ───────────────────
  useEffect(() => {
    if (segmentId == null) return;
    setSelectedCategoryIds(new Set());
    (async () => {
      try {
        const cats = await adminGet<CategoryLite[]>(
          `/api/v1/catalog/categories?segmentId=${segmentId}`
        );
        setCategories(cats);
      } catch (e) {
        setRefError(
          e instanceof Error ? e.message : "Failed to load categories."
        );
      }
    })();
  }, [segmentId]);

  // ─── Helpers ──────────────────────────────────────────────────────
  function updateList(
    list: string[],
    setList: (v: string[]) => void,
    idx: number,
    value: string
  ) {
    const next = [...list];
    next[idx] = value;
    setList(next);
  }
  function addRow(list: string[], setList: (v: string[]) => void) {
    setList([...list, ""]);
  }
  function removeRow(
    list: string[],
    setList: (v: string[]) => void,
    idx: number
  ) {
    setList(list.filter((_, i) => i !== idx));
  }

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canSubmit = useMemo(
    () =>
      !submitting &&
      segmentId != null &&
      sku.trim().length > 0 &&
      name.trim().length > 0 &&
      shortDescription.trim().length > 0,
    [submitting, segmentId, sku, name, shortDescription]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitError(null);
    setSubmitOk(null);
    setSubmitting(true);
    try {
      const created = await adminPost<CreatedProduct>(
        "/api/v1/admin/catalog/products",
        {
          segmentId,
          sku: sku.trim(),
          name: name.trim(),
          shortDescription: shortDescription.trim(),
          longDescription: longDescription.trim() || null,
          categoryIds: Array.from(selectedCategoryIds),
          applicationAreas: applicationAreas
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
          advantages: advantages
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
          consumption:
            consumptionValue.trim() || consumptionUnit.trim()
              ? {
                  value: consumptionValue.trim() || null,
                  unit: consumptionUnit.trim() || null,
                }
              : null,
          images: [],
          packaging: [],
          documents: [],
          videos: [],
          isFeatured,
          isNew,
          status,
        }
      );
      setSubmitOk(created);
      // Bounce to the edit page after a short delay so the user sees the toast.
      setTimeout(() => {
        router.push(`/admin/products/${created.id}`);
        router.refresh();
      }, 800);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create product."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Render: auth gate, ref error, or form ────────────────────────
  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Create"
          title="New product"
          description="You need to sign in before creating records."
        />
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-10 text-center">
          <FiLogIn className="mx-auto text-3xl text-primary-500 mb-3" />
          <p className="text-base font-bold text-neutral-900 mb-2">
            Sign in required
          </p>
          <p className="text-sm text-neutral-500 max-w-md mx-auto mb-5">
            The admin API rejects unauthenticated calls. Sign in with your
            LiqueMix admin credentials and you&apos;ll be brought back here.
          </p>
          <Link
            href="/admin/login?next=/admin/products/new"
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiLogIn /> Go to sign in
          </Link>
        </div>
      </>
    );
  }

  if (hasToken === null) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Create"
        title="New product"
        description="Save as draft to keep iterating, or publish to push immediately to the public site."
        actions={
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
          >
            <FiArrowLeft /> Back to list
          </Link>
        }
      />

      {refError && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-accent-50 border border-accent-300 text-accent-800 text-sm">
          <FiAlertCircle className="text-base mt-0.5 shrink-0" />
          <span>{refError}</span>
        </div>
      )}

      {submitError && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-500 text-sm">
          <FiAlertCircle className="text-base mt-0.5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {submitOk && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-success-50 border border-success-500 text-success-700 text-sm">
          <FiCheckCircle className="text-base mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">
              Product created — {submitOk.name}
            </p>
            <p className="text-xs text-success-700/80">
              ID {submitOk.id} · slug{" "}
              <code className="font-mono">{submitOk.slug}</code>. Redirecting…
            </p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-6">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-4">
              Basic information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Segment <span className="text-error-500">*</span>
                </span>
                <select
                  required
                  value={segmentId ?? ""}
                  onChange={(e) => setSegmentId(Number(e.target.value))}
                  className="admin-input"
                >
                  {segments.length === 0 && (
                    <option value="">Loading…</option>
                  )}
                  {segments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  SKU <span className="text-error-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="LMX-WP-NEW-001"
                  className="admin-input font-mono"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Product name <span className="text-error-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lique Hydro-Guard 3X"
                  className="admin-input"
                />
                <span className="mt-1 block text-[11px] text-neutral-400">
                  Slug is auto-generated from the name on save.
                </span>
              </label>

              <label className="block sm:col-span-2">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Short description <span className="text-error-500">*</span>
                </span>
                <textarea
                  required
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One-line tagline used on the catalog cards."
                  className="admin-input resize-none"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Long description
                </span>
                <textarea
                  rows={5}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Full description shown on the product detail page."
                  className="admin-input resize-y"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Application areas
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Where this product can be used. Empty rows are ignored.
            </p>
            <ListEditor
              items={applicationAreas}
              setItems={setApplicationAreas}
              placeholder="e.g. Basement walls and floors"
            />
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Advantages
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Selling points displayed on the product page.
            </p>
            <ListEditor
              items={advantages}
              setItems={setAdvantages}
              placeholder="e.g. Crack-bridging up to 2 mm"
            />
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-4">
              Consumption rate
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Value
                </span>
                <input
                  type="text"
                  value={consumptionValue}
                  onChange={(e) => setConsumptionValue(e.target.value)}
                  placeholder="1.8 – 2.4"
                  className="admin-input"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Unit
                </span>
                <input
                  type="text"
                  value={consumptionUnit}
                  onChange={(e) => setConsumptionUnit(e.target.value)}
                  placeholder="kg / m² per coat"
                  className="admin-input"
                />
              </label>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Status</h3>
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="status"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                />
                Save as draft
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="status"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                />
                Publish immediately
              </label>
            </div>
            <label className="flex items-center gap-2 mb-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-500"
              />
              Featured on home page
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-500"
              />
              <FiTag className="text-secondary-500" />
              Show NEW badge
            </label>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">
              Categories
            </h3>
            <p className="text-[11px] text-neutral-400 mb-3">
              Pick one or more categories from the selected segment. Products
              can attach to leaf <em>or</em> branch nodes.
            </p>
            {categories.length === 0 ? (
              <p className="text-xs text-neutral-500">
                {segmentId == null
                  ? "Choose a segment first."
                  : "No categories in this segment yet — create one under /admin/categories."}
              </p>
            ) : (
              <ul className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {categories.map((c) => (
                  <li key={c.id}>
                    <label className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 text-sm text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.has(c.id)}
                        onChange={() => toggleCategory(c.id)}
                        className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-500"
                      />
                      <span>
                        {c.name}
                        <span className="ml-1 text-[11px] text-neutral-400 font-mono">
                          {c.slug}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-2">
              Media
            </h3>
            <p className="text-xs text-neutral-500">
              Image upload lands in Phase 2 — for now, the product page will
              fall back to a brand-tinted placeholder card.
            </p>
          </section>
        </aside>

        {/* Floating bottom bar */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
            <p className="text-xs text-neutral-500 hidden sm:inline">
              {canSubmit
                ? "Ready to save."
                : "Fill segment, SKU, name, and short description to enable Save."}
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-error-300 hover:text-error-500"
              >
                Discard
              </Link>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiSave />
                {submitting
                  ? "Saving…"
                  : status === "published"
                  ? "Create & publish"
                  : "Create draft"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

/** Repeating-text-row editor (reused for applicationAreas + advantages). */
function ListEditor({
  items,
  setItems,
  placeholder,
}: {
  items: string[];
  setItems: (v: string[]) => void;
  placeholder: string;
}) {
  return (
    <>
      <ul className="space-y-2">
        {items.map((value, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                setItems(next);
              }}
              placeholder={placeholder}
              className="admin-input flex-1"
            />
            <button
              type="button"
              aria-label="Remove row"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md text-neutral-400 hover:bg-error-50 hover:text-error-500"
            >
              {items.length > 1 ? <FiX /> : <FiTrash />}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setItems([...items, ""])}
        className="mt-3 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-600 hover:border-primary-400 hover:text-primary-700"
      >
        <FiPlus /> Add row
      </button>
    </>
  );
}
