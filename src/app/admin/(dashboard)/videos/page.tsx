"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiBox,
  FiExternalLink,
  FiLogIn,
  FiPlay,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import Highlight from "@/components/common/Highlight";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { adminDelete, adminGet, getToken } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";

type StandaloneVideo = {
  id: number;
  title: string;
  youtubeId: string;
  durationSeconds?: number | null;
  category: string;
};

type ProductVideo = {
  youtubeId: string;
  title: string;
  category: string;
  productId?: number | null;
  productName?: string | null;
};

const CATEGORY_TINT: Record<string, string> = {
  "Product Demo": "bg-primary-50 text-primary-700",
  "Application Technique": "bg-secondary-50 text-secondary-700",
  "Case Study": "bg-accent-50 text-accent-800",
  Tutorial: "bg-success-50 text-success-700",
  "System Solution": "bg-neutral-100 text-neutral-700",
};

const CATEGORIES = Object.keys(CATEGORY_TINT);

/**
 * Videos library. Two sources, shown together:
 *   - Standalone videos (/api/v1/admin/content/videos) — fully editable here.
 *   - Videos attached to products — read-only, with a link to edit on the
 *     owning product. The library is the single place to see all of them.
 */
export default function AdminVideosPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const [pendingDelete, setPendingDelete] = useState<StandaloneVideo | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminDelete(`/api/v1/admin/content/videos/${pendingDelete.id}`);
      mutateStd((prev) => (prev ?? []).filter((v) => v.id !== pendingDelete.id), {
        revalidate: false,
      });
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

  // SWR: serves the cached list instantly on repeat navigation (no spinner)
  // and keeps the previous list on screen while a category filter reloads.
  const stdKey = hasToken
    ? `/api/v1/admin/content/videos${
        category ? `?category=${encodeURIComponent(category)}` : ""
      }`
    : null;
  const {
    data: standalone = [],
    error: stdError,
    isLoading: loading,
    mutate: mutateStd,
  } = useSWR<StandaloneVideo[]>(stdKey, adminGet, { keepPreviousData: true });
  const { data: productVideos = [] } = useSWR<ProductVideo[]>(
    hasToken ? "/api/v1/admin/catalog/products/media/videos" : null,
    adminGet
  );
  const error = stdError
    ? stdError instanceof Error
      ? stdError.message
      : String(stdError)
    : null;

  const ql = q.trim().toLowerCase();
  const matchesQ = (t: string) => (ql ? t.toLowerCase().includes(ql) : true);
  // Product videos are all "Product Demo"; honour the category filter client-side.
  const matchesCat = (c: string) => (category ? c === category : true);

  const visibleStandalone = standalone.filter((v) => matchesQ(v.title));
  const visibleProduct = productVideos.filter(
    (v) => matchesQ(v.title) && matchesCat(v.category)
  );
  const total = visibleStandalone.length + visibleProduct.length;

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Content"
          title="Videos"
          description="Sign in to manage videos."
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
            href="/admin/login?next=/admin/videos"
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
        title="Videos"
        description="Standalone videos plus every video attached to a product — all surfaced on /service/videos and related product pages."
        actions={
          <Link
            href="/admin/videos/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiPlus /> Add video
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
            placeholder="Search videos..."
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

      {loading ? (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          Loading videos…
        </div>
      ) : total === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          {q || category
            ? "No videos match your filters."
            : "No videos yet — add one, or attach videos to a product."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleStandalone.map((v) => (
            <VideoCard
              key={`std-${v.id}`}
              youtubeId={v.youtubeId}
              title={v.title}
              category={v.category}
              durationSeconds={v.durationSeconds}
              href={`/admin/videos/${v.id}`}
              query={q}
              onDelete={() => setPendingDelete(v)}
            />
          ))}
          {visibleProduct.map((v, i) => (
            <VideoCard
              key={`prod-${v.productId}-${v.youtubeId}-${i}`}
              youtubeId={v.youtubeId}
              title={v.title}
              category={v.category}
              href={
                v.productId != null ? `/admin/products/${v.productId}` : undefined
              }
              sourceLabel={v.productName ?? "Product"}
              query={q}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete != null}
        danger
        title={
          pendingDelete ? `Delete "${pendingDelete.title}"?` : "Delete video?"
        }
        message="It will be removed from the public Videos library. This can't be undone from here."
        confirmLabel="Delete video"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

function VideoCard({
  youtubeId,
  title,
  category,
  durationSeconds,
  href,
  sourceLabel,
  query = "",
  onDelete,
}: {
  youtubeId: string;
  title: string;
  category: string;
  durationSeconds?: number | null;
  href?: string;
  /** When set, this is a product-attached video (read-only here). */
  sourceLabel?: string;
  query?: string;
  /** Standalone videos only — deletes the library entry. */
  onDelete?: () => void;
}) {
  // Play the video inline (like the public page). The thumbnail is a play
  // button; the title + arrow still navigate to edit (standalone) or the
  // owning product (product video).
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group rounded-2xl bg-white-base border border-neutral-100 overflow-hidden hover:border-primary-200 hover:shadow-soft transition-all">
      <div className="relative aspect-video bg-neutral-900">
        {playing ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-900/85 hover:bg-neutral-900 text-white-base text-[10px] font-semibold"
              title="If the player shows an error, open it on YouTube"
            >
              <FiExternalLink className="text-[10px]" /> YouTube
            </a>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
            className="absolute inset-0 w-full h-full grid place-items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white-base/95 text-primary-700 text-lg shadow-lg group-hover:scale-110 transition-transform">
              <FiPlay className="ml-0.5" />
            </span>
            {sourceLabel && (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-900/80 text-white-base text-[10px] font-semibold">
                <FiBox className="text-[10px]" /> Product
              </span>
            )}
            {durationSeconds ? (
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-neutral-900/80 text-white-base text-[10px] font-mono">
                {Math.floor(durationSeconds / 60)}:
                {String(durationSeconds % 60).padStart(2, "0")}
              </span>
            ) : null}
          </button>
        )}
      </div>
      <div className="p-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
            CATEGORY_TINT[category] ?? "bg-neutral-100 text-neutral-700"
          }`}
        >
          {category}
        </span>
        <h3 className="mt-2 text-sm font-bold text-neutral-900 leading-snug line-clamp-2">
          {href ? (
            <Link href={href} className="hover:text-primary-700">
              <Highlight text={title} query={query} />
            </Link>
          ) : (
            <Highlight text={title} query={query} />
          )}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          {sourceLabel ? (
            <span className="text-[11px] text-neutral-500 truncate max-w-[70%]">
              {sourceLabel}
            </span>
          ) : (
            <code className="font-mono text-[10px] text-neutral-400">
              {youtubeId}
            </code>
          )}
          <div className="inline-flex items-center gap-1">
            {href && (
              <Link
                href={href}
                aria-label={sourceLabel ? "Edit on product" : "Edit video"}
                title={sourceLabel ? "Edit on the product" : "Edit video"}
                className="inline-flex items-center justify-center w-7 h-7 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
              >
                <FiArrowUpRight />
              </Link>
            )}
            {onDelete && (
              <button
                type="button"
                aria-label="Delete video"
                title="Delete video"
                onClick={onDelete}
                className="inline-flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:bg-error-50 hover:text-error-500"
              >
                <FiTrash2 />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
