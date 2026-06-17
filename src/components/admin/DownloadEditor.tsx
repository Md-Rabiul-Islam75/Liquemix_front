"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiSave, FiTrash2 } from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import FilePicker from "@/components/admin/FilePicker";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { adminGet, adminPost, adminPut, adminDelete } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";

// Full library taxonomy (matches StandaloneDocument["category"]).
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
] as const;

type SegmentLite = { id: number; slug: string; name: string; color: string };

type DocumentDto = {
  id: number;
  title: string;
  description?: string | null;
  category: string;
  segmentId?: number | null;
  language?: string | null;
  fileSizeKb?: number | null;
  url: string;
  uploadedAt?: string | null;
};

type Props = { mode: "new"; id?: undefined } | { mode: "edit"; id: number };

/** Rough KB size of a base64 data URL's payload (uploads only). */
function dataUrlSizeKb(url: string): number | null {
  if (!url.startsWith("data:")) return null;
  const b64 = url.split(",")[1] ?? "";
  return Math.max(1, Math.round((b64.length * 3) / 4 / 1024));
}

/**
 * Create / edit a standalone download document. Talks to
 * /api/v1/admin/content/downloads. Documents go live as soon as saved.
 */
export default function DownloadEditor(props: Props) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const editId = props.mode === "edit" ? props.id : undefined;

  const [segments, setSegments] = useState<SegmentLite[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [segmentId, setSegmentId] = useState<string>("");
  const [language, setLanguage] = useState("EN");
  const [fileSizeKb, setFileSizeKb] = useState("");
  const [url, setUrl] = useState("");
  const [uploadedAt, setUploadedAt] = useState("");

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setSegments(await adminGet<SegmentLite[]>("/api/v1/catalog/segments"));
      } catch {
        /* segment is optional — leave dropdown empty on failure */
      }
    })();
  }, []);

  useEffect(() => {
    if (editId == null) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const d = await adminGet<DocumentDto>(
          `/api/v1/admin/content/downloads/${editId}`
        );
        if (cancelled) return;
        setTitle(d.title ?? "");
        setDescription(d.description ?? "");
        setCategory(d.category ?? CATEGORIES[0]);
        setSegmentId(d.segmentId != null ? String(d.segmentId) : "");
        setLanguage(d.language ?? "EN");
        setFileSizeKb(d.fileSizeKb != null ? String(d.fileSizeKb) : "");
        setUrl(d.url ?? "");
        setUploadedAt(d.uploadedAt ?? "");
      } catch (e) {
        if (!cancelled)
          setLoadError(
            e instanceof Error ? e.message : "Failed to load the document."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editId]);

  const canSubmit = useMemo(
    () =>
      !submitting &&
      title.trim().length > 0 &&
      category.length > 0 &&
      url.trim().length > 0,
    [submitting, title, category, url]
  );

  // When a file is uploaded (data URL), auto-fill the size if blank.
  function onFileChange(next: string) {
    setUrl(next);
    const kb = dataUrlSizeKb(next);
    if (kb != null) setFileSizeKb(String(kb));
  }

  function buildPayload() {
    return {
      title: title.trim(),
      description: description.trim() || null,
      category,
      segmentId: segmentId ? Number(segmentId) : null,
      language: language.trim() || "EN",
      fileSizeKb: fileSizeKb.trim() ? Number(fileSizeKb) : null,
      url: url.trim(),
      uploadedAt: uploadedAt || null,
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload = buildPayload();
      if (isEdit) {
        await adminPut<DocumentDto>(
          `/api/v1/admin/content/downloads/${editId}`,
          payload
        );
        SuccessToast("Saved", "Document updated.");
        setTimeout(() => router.refresh(), 400);
      } else {
        const created = await adminPost<DocumentDto>(
          "/api/v1/admin/content/downloads",
          payload
        );
        SuccessToast("Uploaded", `"${created.title}" is live.`);
        setTimeout(() => {
          router.push(`/admin/downloads/${created.id}`);
          router.refresh();
        }, 600);
      }
    } catch (err) {
      ErrorToast(
        "Couldn't save document",
        err instanceof Error ? err.message : "Unknown error."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (editId == null) return;
    setDeleting(true);
    try {
      await adminDelete(`/api/v1/admin/content/downloads/${editId}`);
      SuccessToast("Deleted", "The document has been removed.");
      setConfirmOpen(false);
      setTimeout(() => {
        router.push("/admin/downloads");
        router.refresh();
      }, 500);
    } catch (err) {
      ErrorToast(
        "Couldn't delete document",
        err instanceof Error ? err.message : "Unknown error."
      );
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
        Loading document…
      </div>
    );
  }

  if (loadError) {
    return (
      <AdminPageHeader
        eyebrow="Downloads"
        title="Couldn't load document"
        description={loadError}
        actions={
          <Link
            href="/admin/downloads"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
          >
            <FiArrowLeft /> Back to list
          </Link>
        }
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Downloads"
        title={isEdit ? "Edit document" : "Upload document"}
        description="Standalone technical documents surfaced on /service/downloads."
        actions={
          <Link
            href="/admin/downloads"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
          >
            <FiArrowLeft /> Back to list
          </Link>
        }
      />

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-6">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6 space-y-4">
            <h2 className="text-base font-bold text-neutral-900">Document details</h2>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Title <span className="text-error-500">*</span>
              </span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. LiqueMix Corporate Brochure 2025"
                className="admin-input"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Description
              </span>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="One- or two-line summary shown under the document."
                className="admin-input resize-y"
              />
            </label>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              File <span className="text-error-500">*</span>
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Upload a PDF, or paste a path already served from{" "}
              <code className="font-mono">/public</code> (e.g.{" "}
              <code className="font-mono">/document-sheet/LiqueMix.pdf</code>).
            </p>
            <FilePicker
              value={url}
              onChange={onFileChange}
              accept="application/pdf"
              prefix="downloads"
              uploadLabel="Choose a PDF"
              replaceLabel="Replace PDF"
            />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">Classification</h3>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Category <span className="text-error-500">*</span>
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="admin-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Segment
              </span>
              <select
                value={segmentId}
                onChange={(e) => setSegmentId(e.target.value)}
                className="admin-input"
              >
                <option value="">— None —</option>
                {segments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">Meta</h3>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Language
              </span>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="EN"
                className="admin-input"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                File size (KB)
              </span>
              <input
                type="number"
                min={1}
                value={fileSizeKb}
                onChange={(e) => setFileSizeKb(e.target.value)}
                placeholder="2400"
                className="admin-input"
              />
              <span className="mt-1 block text-[11px] text-neutral-400">
                Auto-filled when you upload a file.
              </span>
            </label>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Upload date
              </span>
              <input
                type="date"
                value={uploadedAt}
                onChange={(e) => setUploadedAt(e.target.value)}
                className="admin-input"
              />
            </label>
          </section>

          {isEdit && (
            <section className="rounded-2xl bg-white-base border border-error-200 p-5">
              <h3 className="text-sm font-bold text-error-600 mb-1">Danger zone</h3>
              <p className="text-xs text-neutral-500 mb-3">
                Removes the document from the public library.
              </p>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-error-300 bg-white-base text-sm font-semibold text-error-600 hover:bg-error-50 disabled:opacity-60"
              >
                <FiTrash2 /> {deleting ? "Deleting…" : "Delete document"}
              </button>
            </section>
          )}
        </aside>

        {/* Floating bottom bar */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
            <p className="text-xs text-neutral-500 hidden sm:inline">
              {canSubmit
                ? "Ready to save."
                : "Add a title, a category, and a file to enable Save."}
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <Link
                href="/admin/downloads"
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
                {submitting ? "Saving…" : isEdit ? "Save changes" : "Upload document"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        danger
        title="Delete this document?"
        message="It will be removed from the public library. This can't be undone from here."
        confirmLabel="Delete document"
        busy={deleting}
        onConfirm={onDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
