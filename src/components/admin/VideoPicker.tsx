"use client";

import { useRef, useState } from "react";
import { FiFilm, FiLink, FiTrash, FiUpload, FiX } from "react-icons/fi";
import { adminUploadFile } from "@/lib/adminApi";
import { isYouTube, youTubeId } from "@/lib/video";

const MAX_VIDEO_BYTES = 60 * 1024 * 1024; // matches backend cap

function fmtSize(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Video source picker: paste a YouTube URL OR upload an MP4/WebM. Both flows
 * store a single URL string (a youtube.com link, or a /files/... URL for an
 * upload). The public banner detects which and renders an <iframe> or <video>.
 */
export default function VideoPicker({
  value,
  onChange,
  prefix,
  label = "Video",
}: {
  value: string;
  onChange: (next: string) => void;
  prefix: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/^video\/(mp4|webm)$/.test(file.type)) {
      setError(`"${file.name}" must be an MP4 or WebM video.`);
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setError(`"${file.name}" is ${fmtSize(file.size)} — max 60 MB.`);
      return;
    }
    try {
      setBusy(true);
      const url = await adminUploadFile(file, prefix);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function applyUrl() {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setUrlDraft("");
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="rounded-xl border border-neutral-100 bg-white-base p-3">
          {isYouTube(value) ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${youTubeId(value)}`}
                title="Video preview"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              src={value}
              controls
              className="w-full aspect-video rounded-lg bg-black"
            />
          )}
          <div className="flex items-center justify-between gap-2 mt-2">
            <p className="text-[11px] font-mono text-neutral-500 truncate" title={value}>
              {value}
            </p>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 text-error-500 text-xs font-semibold shrink-0"
            >
              <FiTrash /> Remove
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* YouTube / URL */}
        <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3">
          <label className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-neutral-600 mb-2">
            <FiLink /> {label} — YouTube URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://youtube.com/watch?v=…"
              className="admin-input font-mono text-xs flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyUrl();
                }
              }}
            />
            <button
              type="button"
              onClick={applyUrl}
              disabled={!urlDraft.trim()}
              className="inline-flex items-center h-9 px-3 rounded-lg border border-neutral-200 bg-white-base text-xs font-semibold text-neutral-700 hover:border-primary-300 disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Upload */}
        <div
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className="rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/60 p-3 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30"
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm"
            onChange={onPick}
            className="hidden"
          />
          <FiFilm className="mx-auto text-xl text-neutral-400 mb-1" />
          <p className="text-xs font-semibold text-neutral-800">
            {busy ? "Uploading…" : "Upload MP4 / WebM"}
          </p>
          <span className="inline-flex items-center gap-1 mt-2 h-8 px-3 rounded-lg bg-primary-500 text-white-base text-xs font-semibold">
            <FiUpload /> Choose file
          </span>
          <p className="mt-1 text-[10px] text-neutral-400">Up to 60 MB.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-error-50 border border-error-300 text-error-500 text-xs">
          <FiX className="text-base mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
