"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiEye,
  FiPlus,
  FiSave,
  FiTrash,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import ImagePicker from "@/components/admin/ImagePicker";
import FilePicker from "@/components/admin/FilePicker";
import {
  adminDelete,
  adminGet,
  adminPost,
  adminPut,
} from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";
import type { SystemSolutionDownloadKind } from "@/types/Catalog";

// ─── Local API shapes ─────────────────────────────────────────────────
// Pulled here (not from @/types/Catalog) because the admin form works in
// terms of the *request* shape — what the backend's
// SystemSolutionUpdateRequest expects — not the response shape.

type SegmentLite = { id: number; slug: string; name: string; color: string };
type ProductLite = { id: number; sku: string; slug: string; name: string };

type LayerDraft = {
  /** Stable id for React key — not sent to the API. */
  uid: string;
  /** Server id if this layer already existed. */
  id?: number;
  order: number;
  name: string;
  description: string;
  productId: number | null;
};

type DownloadDraft = {
  uid: string;
  id?: number;
  title: string;
  url: string;
  kind: SystemSolutionDownloadKind;
  displayOrder: number;
};

type SolutionResponse = {
  id: number;
  slug: string;
  name: string;
  description: string;
  segmentId: number;
  applicationAreas: string[];
  layers: Array<{
    id?: number;
    order: number;
    name: string;
    description?: string | null;
    productId?: number | null;
  }>;
  productIds: number[];
  downloads: Array<{
    id?: number;
    title: string;
    url: string;
    kind: SystemSolutionDownloadKind;
    displayOrder?: number;
  }>;
  heroImage?: string | null;
  technicalDrawingUrl?: string | null;
  displayOrder?: number;
  status: "draft" | "published" | "archived";
};

const STATUS_OPTIONS: Array<SolutionResponse["status"]> = [
  "draft",
  "published",
  "archived",
];

const DOWNLOAD_KINDS: SystemSolutionDownloadKind[] = [
  "tds",
  "installation",
  "warranty",
  "brochure",
  "document",
];

let uidCounter = 0;
const nextUid = () => `r${++uidCounter}`;

// ─── Component ────────────────────────────────────────────────────────

export type SolutionEditorProps =
  | { mode: "new" }
  | { mode: "edit"; id: number };

export default function SolutionEditor(props: SolutionEditorProps) {
  const router = useRouter();
  const isEdit = props.mode === "edit";

  // Reference data
  const [segments, setSegments] = useState<SegmentLite[]>([]);
  const [products, setProducts] = useState<ProductLite[]>([]);
  const [refLoaded, setRefLoaded] = useState(false);

  // Loaded solution (edit mode only)
  const [loadedSolution, setLoadedSolution] = useState<SolutionResponse | null>(
    null
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form fields
  const [segmentId, setSegmentId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [applicationAreas, setApplicationAreas] = useState<string[]>([""]);
  const [heroImage, setHeroImage] = useState("");
  const [technicalDrawingUrl, setTechnicalDrawingUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [status, setStatus] = useState<SolutionResponse["status"]>("draft");
  const [layers, setLayers] = useState<LayerDraft[]>([]);
  const [downloads, setDownloads] = useState<DownloadDraft[]>([]);
  const [productIds, setProductIds] = useState<Set<number>>(new Set());

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ─── Load reference data once ─────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [segs, prods] = await Promise.all([
          adminGet<SegmentLite[]>("/api/v1/admin/catalog/segments"),
          adminGet<{ items: ProductLite[] }>(
            "/api/v1/admin/catalog/products?size=500&page=1"
          ),
        ]);
        setSegments(segs);
        setProducts(prods?.items ?? []);
      } catch (e) {
        ErrorToast(
          "Reference load failed",
          e instanceof Error ? e.message : "Could not load segments/products."
        );
      } finally {
        setRefLoaded(true);
      }
    })();
  }, []);

  // ─── On create, seed segment to the first available ───────────────
  useEffect(() => {
    if (props.mode === "new" && segmentId == null && segments.length > 0) {
      setSegmentId(segments[0].id);
    }
  }, [props.mode, segments, segmentId]);

  // ─── On edit, load the solution and seed all fields ───────────────
  useEffect(() => {
    if (props.mode !== "edit") return;
    (async () => {
      try {
        const s = await adminGet<SolutionResponse>(
          `/api/v1/admin/catalog/solutions/${props.id}`
        );
        setLoadedSolution(s);
        setSegmentId(s.segmentId);
        setSlug(s.slug);
        setName(s.name);
        setDescription(s.description);
        setApplicationAreas(
          s.applicationAreas?.length ? s.applicationAreas : [""]
        );
        setHeroImage(s.heroImage ?? "");
        setTechnicalDrawingUrl(s.technicalDrawingUrl ?? "");
        setDisplayOrder(s.displayOrder ?? 0);
        setStatus(s.status);
        setLayers(
          (s.layers ?? []).map((l) => ({
            uid: nextUid(),
            id: l.id,
            order: l.order,
            name: l.name,
            description: l.description ?? "",
            productId: l.productId ?? null,
          }))
        );
        setDownloads(
          (s.downloads ?? []).map((d, i) => ({
            uid: nextUid(),
            id: d.id,
            title: d.title,
            url: d.url,
            kind: d.kind,
            displayOrder: d.displayOrder ?? i,
          }))
        );
        setProductIds(new Set(s.productIds ?? []));
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : "Could not load solution."
        );
      }
    })();
  }, [props]);

  // ─── Helpers ──────────────────────────────────────────────────────
  function addLayer() {
    setLayers((prev) => [
      ...prev,
      {
        uid: nextUid(),
        order: prev.length + 1,
        name: "",
        description: "",
        productId: null,
      },
    ]);
  }
  function removeLayer(uid: string) {
    setLayers((prev) =>
      prev
        .filter((l) => l.uid !== uid)
        // Renumber to keep order contiguous.
        .map((l, i) => ({ ...l, order: i + 1 }))
    );
  }
  function updateLayer(uid: string, patch: Partial<LayerDraft>) {
    setLayers((prev) =>
      prev.map((l) => (l.uid === uid ? { ...l, ...patch } : l))
    );
  }

  function addDownload() {
    setDownloads((prev) => [
      ...prev,
      {
        uid: nextUid(),
        title: "",
        url: "",
        kind: "document",
        displayOrder: prev.length,
      },
    ]);
  }
  function removeDownload(uid: string) {
    setDownloads((prev) =>
      prev
        .filter((d) => d.uid !== uid)
        .map((d, i) => ({ ...d, displayOrder: i }))
    );
  }
  function updateDownload(uid: string, patch: Partial<DownloadDraft>) {
    setDownloads((prev) =>
      prev.map((d) => (d.uid === uid ? { ...d, ...patch } : d))
    );
  }

  function toggleProduct(id: number) {
    setProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // ─── Submission ───────────────────────────────────────────────────
  const canSubmit = useMemo(
    () =>
      !submitting &&
      segmentId != null &&
      name.trim().length > 0 &&
      description.trim().length > 0,
    [submitting, segmentId, name, description]
  );

  async function onSave() {
    if (!canSubmit || segmentId == null) return;
    setSubmitting(true);
    try {
      const payload = {
        segmentId,
        slug: slug.trim(),
        name: name.trim(),
        description: description.trim(),
        applicationAreas: applicationAreas
          .map((a) => a.trim())
          .filter((a) => a.length > 0),
        heroImage: heroImage.trim() || null,
        technicalDrawingUrl: technicalDrawingUrl.trim() || null,
        displayOrder,
        status,
        layers: layers.map((l, i) => ({
          id: l.id,
          order: i + 1,
          name: l.name.trim(),
          description: l.description.trim() || null,
          productId: l.productId,
        })),
        productIds: Array.from(productIds),
        downloads: downloads.map((d, i) => ({
          id: d.id,
          title: d.title.trim(),
          url: d.url.trim(),
          kind: d.kind,
          displayOrder: i,
        })),
      };

      if (props.mode === "new") {
        const created = await adminPost<{ id: number; name: string }>(
          "/api/v1/admin/catalog/solutions",
          payload
        );
        SuccessToast("Solution created", `${created.name} is now in the catalog.`);
        router.push(`/admin/solutions/${created.id}`);
      } else {
        const updated = await adminPut<{ name: string }>(
          `/api/v1/admin/catalog/solutions/${props.id}`,
          payload
        );
        SuccessToast(
          "Solution saved",
          `${updated.name} now reflects on the public site.`
        );
        router.refresh();
      }
    } catch (e) {
      ErrorToast(
        "Save failed",
        e instanceof Error ? e.message : "Unknown error."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (props.mode !== "edit") return;
    if (
      !window.confirm(
        "Delete this solution? It will be soft-deleted on the backend and hidden from the public site."
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      await adminDelete(`/api/v1/admin/catalog/solutions/${props.id}`);
      SuccessToast("Solution deleted", "Returning to the list.");
      router.push("/admin/solutions");
    } catch (e) {
      ErrorToast(
        "Delete failed",
        e instanceof Error ? e.message : "Unknown error."
      );
      setDeleting(false);
    }
  }

  // ─── Render gates ─────────────────────────────────────────────────
  if (isEdit && loadError) {
    return (
      <>
        <AdminPageHeader
          eyebrow="System Solution"
          title="Couldn't load this solution"
          description={loadError}
          actions={
            <Link
              href="/admin/solutions"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
            >
              <FiArrowLeft /> Back to list
            </Link>
          }
        />
      </>
    );
  }

  if (isEdit && !loadedSolution) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
        Loading solution…
      </div>
    );
  }

  if (!refLoaded) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
        Loading segments and products…
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <>
      <AdminPageHeader
        eyebrow={isEdit ? "Catalog · System Solution" : "System Solution"}
        title={isEdit ? name || "Untitled solution" : "Create new solution"}
        description={
          isEdit
            ? description || "Edit the engineered build-up below."
            : "Build a new engineered system. The layer ladder and product picks below are what customers see on the public detail page."
        }
        actions={
          <>
            {isEdit && loadedSolution && (
              <a
                href={`/solutions/${loadedSolution.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
              >
                <FiEye /> View on site
              </a>
            )}
            <Link
              href="/admin/solutions"
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
            >
              <FiArrowLeft /> Back
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-6">
          <Section
            title="Core copy"
            hint="The name, description, and application areas appear at the top of the public detail page."
          >
            <div className="grid grid-cols-1 gap-4">
              <Field label="Name" required>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-input"
                  maxLength={240}
                  placeholder="e.g. Basement Waterproofing — The Flexible System"
                />
              </Field>
              <Field
                label="Slug"
                hint="URL fragment. Leave blank to auto-derive from name."
              >
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="admin-input font-mono text-sm"
                  maxLength={180}
                  placeholder="basement-waterproofing-flexible-system"
                />
              </Field>
              <Field
                label="Description"
                required
                hint="2–3 sentences. Used as the public detail page subtitle and as the meta description."
              >
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="admin-input resize-y"
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Application areas"
            hint="Where this system is meant to be used. Shown as a checked bullet list next to the hero."
          >
            <RepeatableTextRows
              values={applicationAreas}
              setValues={setApplicationAreas}
              placeholder="e.g. Residential and commercial basements"
              addLabel="Add area"
            />
          </Section>

          <Section
            title="System build-up"
            hint="Ordered layers, top to bottom. Each layer can be a labelled step (substrate prep) or reference a specific product."
          >
            {layers.length === 0 ? (
              <Empty>No layers yet — click below to start the ladder.</Empty>
            ) : (
              <ol className="space-y-3">
                {layers.map((layer, i) => (
                  <li
                    key={layer.uid}
                    className="rounded-xl border border-neutral-100 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-primary-700 text-sm font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field label="Layer name" required>
                          <input
                            type="text"
                            value={layer.name}
                            onChange={(e) =>
                              updateLayer(layer.uid, { name: e.target.value })
                            }
                            className="admin-input"
                            placeholder="e.g. First slurry coat"
                            maxLength={240}
                          />
                        </Field>
                        <Field label="Linked product">
                          <select
                            value={layer.productId ?? ""}
                            onChange={(e) =>
                              updateLayer(layer.uid, {
                                productId: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              })
                            }
                            className="admin-input"
                          >
                            <option value="">— No product —</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} · {p.sku}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field
                          label="Notes / description"
                          className="md:col-span-2"
                          hint="Optional. Use for substrate-prep steps or anything not tied to a SKU."
                        >
                          <textarea
                            rows={2}
                            value={layer.description}
                            onChange={(e) =>
                              updateLayer(layer.uid, {
                                description: e.target.value,
                              })
                            }
                            className="admin-input resize-y"
                          />
                        </Field>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLayer(layer.uid)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-200 text-neutral-500 hover:border-error-300 hover:text-error-500"
                        aria-label="Remove layer"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <button
              type="button"
              onClick={addLayer}
              className="mt-4 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
            >
              <FiPlus /> Add layer
            </button>
          </Section>

          <Section
            title="Documents & downloads"
            hint="TDS, installation guide, warranty. Shown as a card grid below the build-up."
          >
            {downloads.length === 0 ? (
              <Empty>No downloads — add one to populate the public list.</Empty>
            ) : (
              <ul className="space-y-3">
                {downloads.map((d) => (
                  <li
                    key={d.uid}
                    className="rounded-xl border border-neutral-100 p-4 space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                      <Field
                        label="Title"
                        required
                        className="md:col-span-9"
                      >
                        <input
                          type="text"
                          value={d.title}
                          onChange={(e) =>
                            updateDownload(d.uid, { title: e.target.value })
                          }
                          className="admin-input"
                          maxLength={240}
                          placeholder="e.g. System TDS"
                        />
                      </Field>
                      <Field label="Kind" className="md:col-span-3">
                        <select
                          value={d.kind}
                          onChange={(e) =>
                            updateDownload(d.uid, {
                              kind: e.target
                                .value as SystemSolutionDownloadKind,
                            })
                          }
                          className="admin-input"
                        >
                          {DOWNLOAD_KINDS.map((k) => (
                            <option key={k} value={k}>
                              {k}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <Field label="File" required>
                      <FilePicker
                        value={d.url}
                        onChange={(next) =>
                          updateDownload(d.uid, { url: next })
                        }
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,application/pdf"
                        uploadLabel="Choose a file"
                        replaceLabel="Replace file"
                        helperText="PDF, DOC, XLS, PPT, TXT, ZIP up to 10 MB."
                      />
                    </Field>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeDownload(d.uid)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-error-500"
                      >
                        <FiX /> Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={addDownload}
              className="mt-4 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
            >
              <FiPlus /> Add download
            </button>
          </Section>

          <Section
            title="Products in this system"
            hint="The card grid on the detail page. Often overlaps with linked layer products — pick everything customers should be able to click through to."
          >
            {products.length === 0 ? (
              <Empty>
                No products in the catalog yet. Add some products first and
                they&apos;ll appear here.
              </Empty>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {products.map((p) => {
                  const checked = productIds.has(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        checked
                          ? "border-primary-300 bg-primary-50/40"
                          : "border-neutral-100 hover:border-neutral-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProduct(p.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 leading-tight truncate">
                          {p.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-mono text-neutral-500 truncate">
                          {p.sku}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </Section>

          <Section
            title="Hero image"
            hint="Used as the visual on the public detail page hero. JPG/PNG/WebP."
          >
            <ImagePicker
              value={heroImage}
              onChange={setHeroImage}
              aspectClass="aspect-[4/3]"
              uploadLabel="Choose a hero image"
              replaceLabel="Replace hero image"
              helperText="JPG, PNG, WebP up to 5 MB. 4:3 looks best."
            />
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-5">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Placement</h3>
            <div className="space-y-3">
              <Field label="Segment" required>
                <select
                  value={segmentId ?? ""}
                  onChange={(e) => setSegmentId(Number(e.target.value))}
                  className="admin-input"
                >
                  {segments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Status"
                hint="Only published rows appear on the public site."
              >
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as SolutionResponse["status"])
                  }
                  className="admin-input"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Display order"
                hint="Smaller first in the public catalog grid."
              >
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) =>
                    setDisplayOrder(Number(e.target.value) || 0)
                  }
                  className="admin-input font-mono"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">
              Technical drawing
            </h3>
            <p className="text-xs text-neutral-500 mb-3">
              Optional. If set, a download button appears in the Application
              areas panel on the public detail page.
            </p>
            <FilePicker
              value={technicalDrawingUrl}
              onChange={setTechnicalDrawingUrl}
              accept=".pdf,.dwg,.dxf,application/pdf"
              uploadLabel="Choose a drawing"
              replaceLabel="Replace drawing"
              helperText="PDF or CAD file (DWG, DXF) up to 10 MB."
            />
          </section>

          {isEdit && loadedSolution && (
            <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
              <h3 className="text-sm font-bold text-neutral-900 mb-3">
                Identity
              </h3>
              <dl className="space-y-3 text-xs">
                <DefRow label="ID">
                  <code className="font-mono text-[10px] text-neutral-700">
                    {loadedSolution.id}
                  </code>
                </DefRow>
                <DefRow label="Live slug">
                  <Link
                    href={`/solutions/${loadedSolution.slug}`}
                    target="_blank"
                    className="font-mono text-[11px] text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 break-all"
                  >
                    /{loadedSolution.slug} <FiArrowUpRight />
                  </Link>
                </DefRow>
              </dl>
            </section>
          )}

          {isEdit && (
            <section className="rounded-2xl bg-white-base border border-error-100 p-5">
              <h3 className="text-sm font-bold text-error-500 mb-2">
                Danger zone
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Soft-deletes the solution. Public pages and the homepage stop
                showing it; the row stays in the DB.
              </p>
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting || submitting}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-error-200 text-sm font-semibold text-error-500 hover:bg-error-50 disabled:opacity-60"
              >
                <FiTrash2 /> {deleting ? "Deleting…" : "Delete solution"}
              </button>
            </section>
          )}
        </aside>
      </div>

      {/* Floating save bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 hidden sm:inline">
            {submitting
              ? "Saving…"
              : isEdit
              ? "Changes save to the API when you click Save."
              : "Click Save to create the solution."}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onSave}
              disabled={!canSubmit}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSave /> {submitting ? "Saving…" : isEdit ? "Save changes" : "Create solution"}
            </button>
          </div>
        </div>
      </div>
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

function DefRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-neutral-500 italic px-1">{children}</p>
  );
}

function RepeatableTextRows({
  values,
  setValues,
  placeholder,
  addLabel,
}: {
  values: string[];
  setValues: (v: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={v}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              setValues(next);
            }}
            className="admin-input flex-1"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => setValues(values.filter((_, j) => j !== i))}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-200 text-neutral-500 hover:border-error-300 hover:text-error-500"
            aria-label="Remove"
          >
            <FiTrash />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setValues([...values, ""])}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
      >
        <FiPlus /> {addLabel}
      </button>
    </div>
  );
}
