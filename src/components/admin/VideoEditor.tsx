"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiPlay, FiSave, FiTrash2 } from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { adminGet, adminPost, adminPut, adminDelete } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";

const CATEGORIES = [
  "Product Demo",
  "Application Technique",
  "Case Study",
  "Tutorial",
  "System Solution",
] as const;

type SegmentLite = { id: number; slug: string; name: string; color: string };

type VideoDto = {
  id: number;
  title: string;
  description?: string | null;
  youtubeId: string;
  durationSeconds?: number | null;
  category: string;
  segmentId?: number | null;
  relatedProductIds?: number[] | null;
  publishedAt?: string | null;
};

type Props = { mode: "new"; id?: undefined } | { mode: "edit"; id: number };

/** Pull the 11-char YouTube id out of a pasted URL (watch / youtu.be /
 *  embed / shorts) or accept a bare id. Returns "" if nothing matches. */
function extractYouTubeId(input: string): string {
  const s = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : "";
}

/**
 * Create / edit a standalone video. Talks to /api/v1/admin/content/videos.
 * Videos go live as soon as they're saved (no draft state).
 */
export default function VideoEditor(props: Props) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const editId = props.mode === "edit" ? props.id : undefined;

  const [segments, setSegments] = useState<SegmentLite[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeInput, setYoutubeInput] = useState(""); // raw URL or id
  const [durationSeconds, setDurationSeconds] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [segmentId, setSegmentId] = useState<string>(""); // "" = none
  const [publishedAt, setPublishedAt] = useState("");
  const [relatedProductIds, setRelatedProductIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Segments for the optional dropdown.
  useEffect(() => {
    (async () => {
      try {
        setSegments(await adminGet<SegmentLite[]>("/api/v1/catalog/segments"));
      } catch {
        /* dropdown just stays empty — segment is optional */
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
        const v = await adminGet<VideoDto>(
          `/api/v1/admin/content/videos/${editId}`
        );
        if (cancelled) return;
        setTitle(v.title ?? "");
        setDescription(v.description ?? "");
        setYoutubeInput(v.youtubeId ?? "");
        setDurationSeconds(
          v.durationSeconds != null ? String(v.durationSeconds) : ""
        );
        setCategory(v.category ?? CATEGORIES[0]);
        setSegmentId(v.segmentId != null ? String(v.segmentId) : "");
        setPublishedAt(v.publishedAt ?? "");
        setRelatedProductIds(v.relatedProductIds ?? []);
      } catch (e) {
        if (!cancelled)
          setLoadError(e instanceof Error ? e.message : "Failed to load video.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editId]);

  const youtubeId = useMemo(() => extractYouTubeId(youtubeInput), [youtubeInput]);
  const canSubmit = useMemo(
    () =>
      !submitting &&
      title.trim().length > 0 &&
      youtubeId.length === 11 &&
      category.length > 0,
    [submitting, title, youtubeId, category]
  );

  function buildPayload() {
    return {
      title: title.trim(),
      description: description.trim() || null,
      youtubeId,
      durationSeconds: durationSeconds.trim() ? Number(durationSeconds) : null,
      category,
      segmentId: segmentId ? Number(segmentId) : null,
      relatedProductIds,
      publishedAt: publishedAt || null,
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload = buildPayload();
      if (isEdit) {
        await adminPut<VideoDto>(`/api/v1/admin/content/videos/${editId}`, payload);
        SuccessToast("Saved", "Video updated.");
        setTimeout(() => router.refresh(), 400);
      } else {
        const created = await adminPost<VideoDto>(
          "/api/v1/admin/content/videos",
          payload
        );
        SuccessToast("Added", `"${created.title}" is live.`);
        setTimeout(() => {
          router.push(`/admin/videos/${created.id}`);
          router.refresh();
        }, 600);
      }
    } catch (err) {
      ErrorToast(
        "Couldn't save video",
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
      await adminDelete(`/api/v1/admin/content/videos/${editId}`);
      SuccessToast("Deleted", "The video has been removed.");
      setConfirmOpen(false);
      setTimeout(() => {
        router.push("/admin/videos");
        router.refresh();
      }, 500);
    } catch (err) {
      ErrorToast(
        "Couldn't delete video",
        err instanceof Error ? err.message : "Unknown error."
      );
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
        Loading video…
      </div>
    );
  }

  if (loadError) {
    return (
      <AdminPageHeader
        eyebrow="Videos"
        title="Couldn't load video"
        description={loadError}
        actions={
          <Link
            href="/admin/videos"
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
        eyebrow="Videos"
        title={isEdit ? "Edit video" : "Add video"}
        description="YouTube-hosted videos surfaced on /service/videos and related product pages."
        actions={
          <Link
            href="/admin/videos"
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
            <h2 className="text-base font-bold text-neutral-900">Video details</h2>

            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                YouTube URL or ID <span className="text-error-500">*</span>
              </span>
              <input
                type="text"
                required
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=ScMzIvxBSi4"
                className="admin-input font-mono"
              />
              <span className="mt-1 block text-[11px] text-neutral-400">
                {youtubeInput.trim().length === 0
                  ? "Paste any YouTube link — the 11-character ID is extracted automatically."
                  : youtubeId
                  ? `Detected ID: ${youtubeId}`
                  : "Couldn't find a valid 11-character YouTube ID in that input."}
              </span>
            </label>

            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Title <span className="text-error-500">*</span>
              </span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Airless spray sealing with Lique Hydro-Guard 3X"
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
                placeholder="Short summary shown under the video."
                className="admin-input resize-y"
              />
            </label>
          </section>

          {/* Preview */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-4">Preview</h2>
            {youtubeId ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 grid place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
                  alt={title || "Video thumbnail"}
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white-base/95 text-primary-700 text-xl shadow-lg">
                  <FiPlay />
                </span>
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-neutral-100 grid place-items-center text-sm text-neutral-400">
                Paste a YouTube link above to preview the thumbnail.
              </div>
            )}
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
                Duration (seconds)
              </span>
              <input
                type="number"
                min={1}
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(e.target.value)}
                placeholder="224"
                className="admin-input"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Published date
              </span>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="admin-input"
              />
            </label>
          </section>

          {isEdit && (
            <section className="rounded-2xl bg-white-base border border-error-200 p-5">
              <h3 className="text-sm font-bold text-error-600 mb-1">Danger zone</h3>
              <p className="text-xs text-neutral-500 mb-3">
                Removes the video from the public site.
              </p>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-error-300 bg-white-base text-sm font-semibold text-error-600 hover:bg-error-50 disabled:opacity-60"
              >
                <FiTrash2 /> {deleting ? "Deleting…" : "Delete video"}
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
                : "Add a valid YouTube link, a title, and a category to enable Save."}
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <Link
                href="/admin/videos"
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
                {submitting ? "Saving…" : isEdit ? "Save changes" : "Add video"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        danger
        title="Delete this video?"
        message="It will be removed from the public site. This can't be undone from here."
        confirmLabel="Delete video"
        busy={deleting}
        onConfirm={onDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
