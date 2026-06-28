"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiSave,
  FiTrash,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import ImagePicker from "@/components/admin/ImagePicker";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ProductVideosEditor, {
  type ProductVideo,
} from "@/components/admin/ProductVideosEditor";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { adminGet, adminPost, adminPut, adminDelete } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";

const CATEGORIES = [
  "Product Launch",
  "Company News",
  "Industry",
  "Project",
] as const;

type NewsPostDto = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body?: string | null;
  publishedAt?: string | null;
  coverImage?: string | null;
  author?: { name?: string | null; role?: string | null } | null;
  category: string;
  readMinutes?: number | null;
  tags?: string[] | null;
  relatedProductIds?: number[] | null;
  status: string;
  videos?: ProductVideo[] | null;
};

type Props = { mode: "new"; id?: undefined } | { mode: "edit"; id: number };

/**
 * Create / edit a news post. Talks to:
 *   GET    /api/v1/admin/content/news/{id}   (edit — load existing)
 *   POST   /api/v1/admin/content/news        (new — create)
 *   PUT    /api/v1/admin/content/news/{id}   (edit — save)
 *   DELETE /api/v1/admin/content/news/{id}   (edit — soft-delete)
 */
export default function NewsEditor(props: Props) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const editId = props.mode === "edit" ? props.id : undefined;

  // ─── Form state ───────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [readMinutes, setReadMinutes] = useState("");
  const [tags, setTags] = useState<string[]>([""]);
  const [publishedAt, setPublishedAt] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  // Carried through unchanged — no UI yet (products aren't routinely seeded).
  const [relatedProductIds, setRelatedProductIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ─── Load existing post on edit ───────────────────────────────────
  useEffect(() => {
    if (editId == null) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const n = await adminGet<NewsPostDto>(
          `/api/v1/admin/content/news/${editId}`
        );
        if (cancelled) return;
        setTitle(n.title ?? "");
        setSlug(n.slug ?? "");
        setExcerpt(n.excerpt ?? "");
        setBody(n.body ?? "");
        setCoverImage(n.coverImage ?? "");
        setAuthorName(n.author?.name ?? "");
        setAuthorRole(n.author?.role ?? "");
        setCategory(n.category ?? CATEGORIES[0]);
        setReadMinutes(n.readMinutes != null ? String(n.readMinutes) : "");
        setTags(n.tags && n.tags.length > 0 ? n.tags : [""]);
        setPublishedAt(n.publishedAt ?? "");
        setStatus(n.status === "published" ? "published" : "draft");
        setVideos(n.videos ?? []);
        setRelatedProductIds(n.relatedProductIds ?? []);
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "Failed to load the post."
          );
        }
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
      excerpt.trim().length > 0 &&
      category.length > 0,
    [submitting, title, excerpt, category]
  );

  function buildPayload() {
    return {
      title: title.trim(),
      slug: slug.trim() || null,
      excerpt: excerpt.trim(),
      body: body.trim() || null,
      coverImage: coverImage.trim() || null,
      author:
        authorName.trim() || authorRole.trim()
          ? { name: authorName.trim() || null, role: authorRole.trim() || null }
          : null,
      category,
      readMinutes: readMinutes.trim() ? Number(readMinutes) : null,
      tags: tags.map((t) => t.trim()).filter((t) => t.length > 0),
      relatedProductIds,
      publishedAt: publishedAt || null,
      status,
      videos,
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload = buildPayload();
      if (isEdit) {
        await adminPut<NewsPostDto>(
          `/api/v1/admin/content/news/${props.id}`,
          payload
        );
        SuccessToast(
          "Saved",
          status === "published" ? "Post is live." : "Draft saved."
        );
        setTimeout(() => router.refresh(), 400);
      } else {
        const created = await adminPost<NewsPostDto>(
          "/api/v1/admin/content/news",
          payload
        );
        SuccessToast(
          status === "published" ? "Published" : "Draft created",
          `"${created.title}" saved.`
        );
        setTimeout(() => {
          router.push(`/admin/news/${created.id}`);
          router.refresh();
        }, 600);
      }
    } catch (err) {
      ErrorToast(
        "Couldn't save post",
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
      await adminDelete(`/api/v1/admin/content/news/${editId}`);
      SuccessToast("Deleted", "The post has been removed.");
      setConfirmOpen(false);
      setTimeout(() => {
        router.push("/admin/news");
        router.refresh();
      }, 500);
    } catch (err) {
      ErrorToast(
        "Couldn't delete post",
        err instanceof Error ? err.message : "Unknown error."
      );
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
        Loading post…
      </div>
    );
  }

  if (loadError) {
    return (
      <>
        <AdminPageHeader
          eyebrow="News & Press"
          title="Couldn't load post"
          description={loadError}
          actions={
            <Link
              href="/admin/news"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
            >
              <FiArrowLeft /> Back to list
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="News & Press"
        title={isEdit ? "Edit post" : "New post"}
        description={
          isEdit
            ? "Update the post, or publish a draft to push it live."
            : "Save as draft to keep iterating, or publish to push immediately to the public site."
        }
        actions={
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
          >
            <FiArrowLeft /> Back to list
          </Link>
        }
      />

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24"
      >
        {/* Main column */}
        <div className="lg:col-span-8 space-y-6">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-4">
              Basic information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block sm:col-span-2">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Title <span className="text-error-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introducing Lique Hydro-Guard 3X"
                  className="admin-input"
                />
                <span className="mt-1 block text-[11px] text-neutral-400">
                  Slug is auto-generated from the title if left blank.
                </span>
              </label>

              <label className="block sm:col-span-2">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Slug
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="introducing-lique-hydro-guard-3x"
                  className="admin-input font-mono"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Excerpt <span className="text-error-500">*</span>
                </span>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="One- or two-line summary shown on the news cards."
                  className="admin-input resize-none"
                />
              </label>

              <div className="block sm:col-span-2">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Body
                </span>
                <RichTextEditor
                  value={body}
                  onChange={setBody}
                  placeholder="Write the full article here. Use the toolbar for headings, bold text, and lists."
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Cover image
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Shown as the hero on the article page and the lead card. Paste a
              path like{" "}
              <code className="font-mono">/images/my-cover.png</code> or upload.
            </p>
            <ImagePicker
              value={coverImage}
              onChange={setCoverImage}
              aspectClass="aspect-[16/9]"
              prefix="news"
              uploadLabel="Choose a cover image"
              replaceLabel="Replace cover image"
            />
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">Tags</h2>
            <p className="text-xs text-neutral-500 mb-4">
              Topic labels shown at the bottom of the article. Empty rows are
              ignored.
            </p>
            <ListEditor items={tags} setItems={setTags} placeholder="waterproofing" />
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">Videos</h2>
            <p className="text-xs text-neutral-500 mb-4">
              Paste a YouTube URL — the ID is extracted automatically. Shown as
              a video grid below the article on the public page.
            </p>
            <ProductVideosEditor videos={videos} onChange={setVideos} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Status</h3>
            <div className="space-y-2">
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
                Published
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">Publishing</h3>
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
                Published date
              </span>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="admin-input"
              />
              <span className="mt-1 block text-[11px] text-neutral-400">
                Defaults to today when first published.
              </span>
            </label>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Read time (minutes)
              </span>
              <input
                type="number"
                min={1}
                value={readMinutes}
                onChange={(e) => setReadMinutes(e.target.value)}
                placeholder="4"
                className="admin-input"
              />
            </label>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">Author</h3>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Name
              </span>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Dr. Fatima Hossain"
                className="admin-input"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Role
              </span>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Head of R&D"
                className="admin-input"
              />
            </label>
          </section>

          {isEdit && (
            <section className="rounded-2xl bg-white-base border border-error-200 p-5">
              <h3 className="text-sm font-bold text-error-600 mb-1">
                Danger zone
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Removes the post from the public site. This can be re-created
                but the URL changes.
              </p>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-error-300 bg-white-base text-sm font-semibold text-error-600 hover:bg-error-50 disabled:opacity-60"
              >
                <FiTrash2 /> {deleting ? "Deleting…" : "Delete post"}
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
                : "Fill title, excerpt, and category to enable Save."}
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <Link
                href="/admin/news"
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
                  : isEdit
                  ? "Save changes"
                  : status === "published"
                  ? "Create & publish"
                  : "Create draft"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        danger
        title="Delete this post?"
        message="It will be removed from the public site. This can't be undone from here."
        confirmLabel="Delete post"
        busy={deleting}
        onConfirm={onDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

/** Repeating-text-row editor (tags). */
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
        <FiPlus /> Add tag
      </button>
    </>
  );
}
