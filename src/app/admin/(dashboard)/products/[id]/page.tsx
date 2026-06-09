"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiClock,
  FiEye,
  FiLogIn,
  FiPlus,
  FiSave,
  FiStar,
  FiTag,
  FiTrash,
  FiX,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import ProductImageGallery, {
  type ProductImage,
} from "@/components/admin/ProductImageGallery";
import ProductVideosEditor, {
  type ProductVideo,
} from "@/components/admin/ProductVideosEditor";
import ProductDocumentsEditor, {
  type ProductDocument,
} from "@/components/admin/ProductDocumentsEditor";
import CategoryPicker from "@/components/admin/CategoryPicker";
import ConsumptionUnitField from "@/components/admin/ConsumptionUnitField";
import {
  adminGet,
  adminPost,
  adminPut,
  adminDelete,
  getToken,
} from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";
import ConfirmDialog from "@/components/common/ConfirmDialog";

type SegmentLite = { id: number; slug: string; name: string };
type CategoryLite = {
  id: number;
  segmentId: number;
  slug: string;
  name: string;
  parentId: number | null;
  menuOrder: number;
  isActive?: boolean;
};

type ProductResponse = {
  id: number;
  sku: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription?: string | null;
  segmentId: number;
  categoryIds: number[];
  applicationAreas: string[];
  advantages: string[];
  consumption?: { value: string | null; unit: string | null } | null;
  images: ProductImage[];
  videos: ProductVideo[];
  documents: ProductDocument[];
  isNew?: boolean;
  isFeatured?: boolean;
  status: "draft" | "published" | "archived";
  publishedAt?: string | null;
};

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // ─── Auth gate ────────────────────────────────────────────────────
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  // ─── Product + reference data ─────────────────────────────────────
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [segments, setSegments] = useState<SegmentLite[]>([]);
  const [categories, setCategories] = useState<CategoryLite[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Local editable copies
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [segmentId, setSegmentId] = useState<number | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(new Set());
  const [applicationAreas, setApplicationAreas] = useState<string[]>([""]);
  const [advantages, setAdvantages] = useState<string[]>([""]);
  const [consumptionValue, setConsumptionValue] = useState("");
  const [consumptionUnit, setConsumptionUnit] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [docs, setDocs] = useState<ProductDocument[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");

  // Submission state — feedback goes to a toast.
  const [submitting, setSubmitting] = useState<null | "draft" | "publish">(null);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load product + segments
  useEffect(() => {
    if (hasToken !== true || !id) return;
    (async () => {
      try {
        const [p, segs] = await Promise.all([
          adminGet<ProductResponse>(`/api/v1/admin/catalog/products/${id}`),
          adminGet<SegmentLite[]>("/api/v1/catalog/segments"),
        ]);
        setProduct(p);
        setSegments(segs);
        // Hydrate form state
        setName(p.name);
        setSku(p.sku);
        setShortDescription(p.shortDescription);
        setLongDescription(p.longDescription ?? "");
        setSegmentId(p.segmentId);
        setSelectedCategoryIds(new Set(p.categoryIds ?? []));
        setApplicationAreas(p.applicationAreas?.length ? p.applicationAreas : [""]);
        setAdvantages(p.advantages?.length ? p.advantages : [""]);
        setConsumptionValue(p.consumption?.value ?? "");
        setConsumptionUnit(p.consumption?.unit ?? "");
        setImages(p.images ?? []);
        setVideos(p.videos ?? []);
        setDocs(p.documents ?? []);
        setIsNew(!!p.isNew);
        setIsFeatured(!!p.isFeatured);
        setStatus(p.status);
        setLoaded(true);
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Failed to load product.");
        setLoaded(true);
      }
    })();
  }, [hasToken, id]);

  // Load categories whenever segment changes
  useEffect(() => {
    if (segmentId == null) return;
    (async () => {
      try {
        const cats = await adminGet<CategoryLite[]>(
          `/api/v1/catalog/categories?segmentId=${segmentId}`
        );
        setCategories(cats);
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Failed to load categories.");
      }
    })();
  }, [segmentId]);

  const segment = useMemo(
    () => segments.find((s) => s.id === segmentId),
    [segments, segmentId]
  );

  const toggleCategory = (cid: number) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(cid)) next.delete(cid);
      else next.add(cid);
      return next;
    });
  };

  // ─── Save handlers ────────────────────────────────────────────────
  function buildPayload(targetStatus: "draft" | "published") {
    return {
      segmentId,
      sku: sku.trim(),
      name: name.trim(),
      shortDescription: shortDescription.trim(),
      longDescription: longDescription.trim() || null,
      categoryIds: Array.from(selectedCategoryIds),
      applicationAreas: applicationAreas.map((s) => s.trim()).filter(Boolean),
      advantages: advantages.map((s) => s.trim()).filter(Boolean),
      consumption:
        consumptionValue.trim() || consumptionUnit.trim()
          ? {
              value: consumptionValue.trim() || null,
              unit: consumptionUnit.trim() || null,
            }
          : null,
      images,
      packaging: [], // not edited in this form yet
      documents: docs,
      videos,
      isFeatured,
      isNew,
      status: targetStatus,
    };
  }

  async function save(target: "draft" | "publish") {
    if (!product) return;
    setSubmitting(target);
    try {
      const payload = buildPayload(target === "publish" ? "published" : "draft");
      const updated = await adminPut<ProductResponse>(
        `/api/v1/admin/catalog/products/${product.id}`,
        payload
      );
      if (target === "publish" && updated.status !== "published") {
        // Server keeps current status on PUT; explicit publish call ensures it.
        await adminPost(`/api/v1/admin/catalog/products/${product.id}/publish`, {});
        setStatus("published");
      } else {
        setStatus(updated.status);
      }
      if (target === "publish") {
        SuccessToast(
          "Saved & published",
          `${updated.name} is now live on the public site.`
        );
      } else {
        SuccessToast("Draft saved", `Updated ${updated.name}.`);
      }
      router.refresh();
    } catch (e) {
      ErrorToast(
        target === "publish" ? "Publish failed" : "Save failed",
        e instanceof Error ? e.message : "Unknown error."
      );
    } finally {
      setSubmitting(null);
    }
  }

  function onDiscard() {
    router.push("/admin/products");
  }

  async function onDelete() {
    if (!product) return;
    setDeleting(true);
    try {
      await adminDelete(`/api/v1/admin/catalog/products/${product.id}`);
      SuccessToast(`"${product.name}" deleted`);
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      ErrorToast(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  // ─── Render: gates ────────────────────────────────────────────────
  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Product"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href={`/admin/login?next=/admin/products/${id ?? ""}`}
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
        >
          <FiLogIn /> Go to sign in
        </Link>
      </>
    );
  }

  if (!loaded) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
        Loading product…
      </div>
    );
  }

  if (loadError || !product) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Product"
          title="Couldn't load this product"
          description={loadError ?? "Unknown error."}
          actions={
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
            >
              <FiArrowLeft /> Back to list
            </Link>
          }
        />
      </>
    );
  }

  // ─── Render: form ─────────────────────────────────────────────────
  return (
    <>
      <AdminPageHeader
        eyebrow={`Catalog · ${segment?.name ?? "Product"}`}
        title={name || product.name}
        description={shortDescription || product.shortDescription}
        actions={
          <>
            {segment?.slug && product.slug && (
              <a
                href={`/products/${segment.slug}/${product.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
              >
                <FiEye /> View on site
              </a>
            )}
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
            >
              <FiArrowLeft /> Back
            </Link>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              disabled={submitting !== null}
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-error-200 bg-white-base text-sm font-semibold text-error-500 hover:bg-error-50 hover:border-error-300 disabled:opacity-60"
            >
              <FiTrash /> Delete
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-6">
          <Section title="Basic information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name" required>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-input"
                />
              </Field>
              <Field label="SKU" required>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="admin-input font-mono"
                />
              </Field>
              <Field label="Slug" hint="Auto-regenerated if blanked on save.">
                <input
                  type="text"
                  value={product.slug}
                  disabled
                  className="admin-input font-mono text-xs"
                />
              </Field>
              <Field label="Segment" required>
                <select
                  value={segmentId ?? ""}
                  onChange={(e) => {
                    setSegmentId(Number(e.target.value));
                    setSelectedCategoryIds(new Set());
                  }}
                  className="admin-input"
                >
                  {segments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Short description" required className="sm:col-span-2">
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label="Long description" className="sm:col-span-2">
                <textarea
                  rows={5}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  className="admin-input resize-y"
                  placeholder="Full description shown on the product page."
                />
              </Field>
            </div>
          </Section>

          <Section title="Application areas" hint="Empty rows are ignored.">
            <ListEditor
              items={applicationAreas}
              setItems={setApplicationAreas}
              placeholder="e.g. Basement walls and floors"
            />
          </Section>

          <Section title="Advantages">
            <ListEditor
              items={advantages}
              setItems={setAdvantages}
              placeholder="e.g. Crack-bridging up to 2 mm"
            />
          </Section>

          <Section title="Consumption rate">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Value">
                <input
                  type="text"
                  value={consumptionValue}
                  onChange={(e) => setConsumptionValue(e.target.value)}
                  placeholder="1.8 – 2.4"
                  className="admin-input"
                />
              </Field>
              <Field label="Unit">
                <ConsumptionUnitField
                  value={consumptionUnit}
                  onChange={setConsumptionUnit}
                />
              </Field>
            </div>
          </Section>

          <Section title="Images" hint="The first image is shown as the primary on the public site.">
            <ProductImageGallery images={images} onChange={setImages} />
          </Section>

          <Section
            title="Videos"
            hint="Paste a YouTube URL — the ID is extracted automatically."
          >
            <ProductVideosEditor videos={videos} onChange={setVideos} />
          </Section>

          <Section
            title="Documents"
            hint="TDS, MSDS, MTC, brochures. Pick from the in-project library or upload a new PDF."
          >
            <ProductDocumentsEditor documents={docs} onChange={setDocs} />
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Status</h3>
            <div className="flex items-center gap-2 mb-4">
              <StatusPill status={status} />
              {product.publishedAt && (
                <span className="text-xs text-neutral-500">
                  · Published {fmtDate(product.publishedAt)}
                </span>
              )}
            </div>
            <label className="flex items-center gap-2 mb-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-500"
              />
              <FiStar className="text-accent-500" />
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
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Categories</h3>
            {categories.length === 0 ? (
              <p className="text-xs text-neutral-500">
                No categories in this segment yet — create one under{" "}
                <Link
                  href="/admin/categories"
                  className="text-primary-600 font-semibold hover:text-primary-700"
                >
                  /admin/categories
                </Link>
                .
              </p>
            ) : (
              <>
                <p className="text-[11px] text-neutral-500 mb-2">
                  Tick any combination — root, sub, or tertiary. A product
                  can belong to one, two, or three categories at any depth.
                </p>
                <CategoryPicker
                  categories={categories}
                  selectedIds={selectedCategoryIds}
                  onToggle={toggleCategory}
                />
              </>
            )}
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Audit</h3>
            <dl className="space-y-2 text-xs">
              <Audit
                icon={<FiClock />}
                label="Product ID"
                value={<code className="font-mono text-[10px]">{product.id}</code>}
              />
              <Audit
                icon={<FiClock />}
                label="Published at"
                value={fmtDate(product.publishedAt)}
              />
            </dl>
          </section>
        </aside>
      </div>

      {/* Floating save bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 hidden sm:inline">
            {submitting
              ? "Saving…"
              : "Changes save to the API when you click Save draft or Save & publish."}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setDiscardOpen(true)}
              disabled={submitting !== null}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-error-300 hover:text-error-500 disabled:opacity-60"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => save("draft")}
              disabled={submitting !== null}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 disabled:opacity-60"
            >
              <FiSave /> {submitting === "draft" ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={() => save("publish")}
              disabled={submitting !== null}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSave /> {submitting === "publish" ? "Publishing…" : "Save & publish"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={discardOpen}
        title="Discard changes?"
        message="You'll return to the products list and any unsaved edits will be lost."
        confirmLabel="Discard changes"
        onConfirm={onDiscard}
        onCancel={() => setDiscardOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        danger
        busy={deleting}
        title={`Delete "${product.name}"?`}
        message="This removes the product from the catalog and the public site. This action can be reversed by an administrator."
        confirmLabel="Delete product"
        onConfirm={onDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
      <h2 className="text-base font-bold text-neutral-900 mb-1">{title}</h2>
      {hint && <p className="text-xs text-neutral-500 mb-4">{hint}</p>}
      {!hint && <div className="mb-4" />}
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
        {label}
        {required && <span className="text-error-500 ml-0.5">*</span>}
      </span>
      {children}
      {hint && (
        <span className="block mt-1 text-[11px] text-neutral-400">{hint}</span>
      )}
    </label>
  );
}

function Audit({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded text-neutral-400 mt-0.5">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <dt className="text-neutral-500">{label}</dt>
        <dd className="font-semibold text-neutral-800">{value}</dd>
      </div>
    </div>
  );
}

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
