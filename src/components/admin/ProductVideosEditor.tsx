"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiCheckCircle,
  FiPlay,
  FiTrash,
  FiVideo,
  FiX,
} from "react-icons/fi";
import { SuccessToast } from "@/helpers/ToastHelper";

export type ProductVideo = {
  title: string;
  youtubeId: string;
  thumbnail?: string;
};

/**
 * Extract a YouTube video ID from any common URL shape:
 *   - https://www.youtube.com/watch?v=ID(...&more=params)
 *   - https://youtu.be/ID(?si=…)
 *   - https://www.youtube.com/embed/ID
 *   - https://www.youtube.com/shorts/ID
 *   - https://m.youtube.com/...
 *   - just the 11-char ID itself
 * Returns null if no ID can be extracted.
 *
 * Defensive about leading/trailing whitespace and m./www. prefixes.
 */
export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Raw 11-char IDs
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");

    if (host === "youtu.be") {
      const segments = u.pathname.split("/").filter(Boolean);
      const candidate = segments[0] ?? "";
      return /^[A-Za-z0-9_-]{11}$/.test(candidate) ? candidate : null;
    }

    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const v = u.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;

      const m = u.pathname.match(
        /\/(embed|shorts|v|live)\/([A-Za-z0-9_-]{11})/
      );
      if (m) return m[2];
    }
  } catch {
    // fall through to null
  }
  return null;
}

export default function ProductVideosEditor({
  videos,
  onChange,
}: {
  videos: ProductVideo[];
  onChange: (next: ProductVideo[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  /** Most recently added YouTube ID — drives the green "just added" pill
   *  shown inside the paste zone for a few seconds. */
  const [justAdded, setJustAdded] = useState<string | null>(null);
  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(null), 4500);
    return () => clearTimeout(t);
  }, [justAdded]);

  const previewId = extractYoutubeId(draft);
  const isDuplicate =
    previewId != null && videos.some((v) => v.youtubeId === previewId);

  // Auto-add the moment a valid + non-duplicate ID is detected. Debounced
  // so a user typing/pasting a URL doesn't trigger mid-paste.
  useEffect(() => {
    if (!previewId || isDuplicate) return;
    const t = setTimeout(() => {
      const title = `YouTube video ${videos.length + 1}`;
      onChange([
        ...videos,
        {
          title,
          youtubeId: previewId,
          thumbnail: `https://i.ytimg.com/vi/${previewId}/hqdefault.jpg`,
        },
      ]);
      setDraft("");
      setError(null);
      setJustAdded(previewId);
      SuccessToast("Video added", `${title} — ID ${previewId}`);
      inputRef.current?.focus();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewId, isDuplicate]);

  // Surface "duplicate" as a soft inline error.
  useEffect(() => {
    if (previewId && isDuplicate) {
      setError("That video is already in the list.");
    } else {
      setError(null);
    }
  }, [previewId, isDuplicate]);

  function removeAt(idx: number) {
    onChange(videos.filter((_, i) => i !== idx));
  }

  function updateTitle(idx: number, newTitle: string) {
    onChange(
      videos.map((v, i) => (i === idx ? { ...v, title: newTitle } : v))
    );
  }

  return (
    <div className="space-y-4">
      {/* Existing videos */}
      {videos.length > 0 && (
        <ul className="space-y-2">
          {videos.map((v, i) => (
            <li
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 bg-white-base"
            >
              <a
                href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden bg-neutral-900 grid place-items-center"
                title="Open on YouTube"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt={v.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <FiPlay className="relative text-white-base text-lg" />
              </a>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={v.title}
                  onChange={(e) => updateTitle(i, e.target.value)}
                  placeholder="Video title"
                  className="admin-input h-8 text-sm"
                />
                <p className="mt-1 font-mono text-[10px] text-neutral-400">
                  ID: {v.youtubeId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove video"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:bg-error-50 hover:text-error-500"
              >
                <FiTrash />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Single big paste-and-go zone */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`group relative rounded-xl border-2 border-dashed p-6 cursor-text transition-colors ${
          previewId && !isDuplicate
            ? "border-success-500 bg-success-50/40"
            : "border-neutral-300 bg-neutral-50/60 hover:border-primary-400 hover:bg-primary-50/30"
        }`}
      >
        <div className="flex items-center gap-3">
          {previewId && !isDuplicate ? (
            <FiCheckCircle className="text-2xl text-success-500 shrink-0" />
          ) : (
            <FiVideo className="text-2xl text-neutral-400 group-hover:text-primary-500 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Paste a YouTube URL here…"
              className="w-full bg-transparent outline-none text-sm placeholder:text-neutral-400"
            />
            <p className="mt-1 text-[11px] text-neutral-500">
              {previewId && !isDuplicate ? (
                <span className="text-success-700 font-semibold">
                  Detected ID {previewId} — adding…
                </span>
              ) : isDuplicate ? (
                <span className="text-error-500">
                  Already added — paste a different URL.
                </span>
              ) : draft.trim() ? (
                <span className="text-neutral-500">
                  Waiting for a recognisable YouTube URL or 11-char ID…
                </span>
              ) : (
                <>
                  Accepts <code className="font-mono">watch?v=…</code>,{" "}
                  <code className="font-mono">youtu.be/…</code>,{" "}
                  <code className="font-mono">shorts/…</code>,{" "}
                  <code className="font-mono">embed/…</code>, or the raw
                  11-char ID. Just paste — the video adds itself.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Live thumbnail preview the moment a valid ID is detected */}
        {previewId && !isDuplicate && (
          <div className="mt-4 flex items-center gap-3">
            <div className="relative w-20 h-12 shrink-0 rounded-md overflow-hidden bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${previewId}/hqdefault.jpg`}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-success-700">Adding to the list…</p>
          </div>
        )}

        {/* Inline "just added" confirmation — clears after a few seconds.
            Hidden the moment a new draft is being typed so it doesn't
            fight with the live preview above. */}
        {justAdded && !draft && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-success-50 border border-success-200 text-success-700">
            <FiCheckCircle className="shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Added
            </span>
            <div className="relative w-16 h-10 shrink-0 rounded-md overflow-hidden bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${justAdded}/hqdefault.jpg`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <span className="font-mono text-[11px] font-semibold">
              {justAdded}
            </span>
          </div>
        )}
      </div>

      {error && !isDuplicate && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-500 text-sm">
          <FiX className="text-base mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
