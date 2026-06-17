"use client";

import { useRef, useState } from "react";
import { FiFile, FiTrash, FiUpload, FiX } from "react-icons/fi";
import { adminUploadFile } from "@/lib/adminApi";

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024; // 10 MB — TDS PDFs run a few MB

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

/** Best-effort filename extraction from a URL. */
function filenameFromUrl(url: string): string | null {
  if (!url || url.startsWith("data:")) return null;
  try {
    const u = url.startsWith("http") ? new URL(url) : new URL(url, "http://x");
    const last = u.pathname.split("/").filter(Boolean).pop();
    return last ?? null;
  } catch {
    const last = url.split(/[\\/]/).filter(Boolean).pop();
    return last ?? null;
  }
}

/**
 * Single-file picker for documents — TDS, installation guides,
 * warranty PDFs, brochures, technical drawings, etc. Mirrors the
 * ImagePicker shape (data-URL on upload, or paste a URL) but is
 * file-type agnostic and renders an icon + filename + size instead of
 * an image preview.
 *
 * Uploads go to POST /api/v1/admin/files, which stores the file on disk
 * and returns a /files/... URL — that URL is stored on the parent row.
 * No base64. `prefix` is the storage folder (e.g. "solutions/drawings").
 */
export default function FilePicker({
  value,
  onChange,
  accept = "*/*",
  maxBytes = DEFAULT_MAX_BYTES,
  uploadLabel = "Choose a file",
  replaceLabel = "Replace file",
  helperText,
  showUrlField = true,
  prefix = "media/documents",
}: {
  value: string;
  onChange: (next: string) => void;
  accept?: string;
  maxBytes?: number;
  uploadLabel?: string;
  replaceLabel?: string;
  helperText?: string;
  showUrlField?: boolean;
  prefix?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [uploadName, setUploadName] = useState<string | null>(null);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > maxBytes) {
      setError(
        `"${file.name}" is ${fmtSize(file.size)} — max ${fmtSize(maxBytes)}.`
      );
      return;
    }
    try {
      setBusy(true);
      const url = await adminUploadFile(file, prefix);
      setUploadName(file.name);
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
    setUploadName(null);
    onChange(trimmed);
    setUrlDraft("");
  }

  function clear() {
    setUploadName(null);
    onChange("");
  }

  const isDataUrl = value.startsWith("data:");
  const displayName =
    uploadName ??
    (isDataUrl ? "Uploaded file" : filenameFromUrl(value) ?? value);
  const displaySize = isDataUrl ? fmtSize(value.length) : null;

  return (
    <div className="space-y-3">
      {value && (
        <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white-base p-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 shrink-0">
            <FiFile />
          </span>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold text-neutral-900 truncate"
              title={value}
            >
              {displayName}
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              {isDataUrl
                ? `Uploaded · ${displaySize}`
                : "External URL"}
            </p>
          </div>
          {!isDataUrl && (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              Open
            </a>
          )}
          <button
            type="button"
            onClick={clear}
            aria-label="Remove file"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-error-500 hover:bg-error-50"
          >
            <FiTrash />
          </button>
        </div>
      )}

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
        className="group rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/60 p-5 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onPickFile}
          className="hidden"
        />
        <FiFile className="mx-auto text-2xl text-neutral-400 group-hover:text-primary-500 mb-2" />
        <p className="text-sm font-semibold text-neutral-800">
          {busy ? "Uploading…" : value ? replaceLabel : uploadLabel}
        </p>
        <span className="inline-flex items-center gap-1.5 mt-3 h-9 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold">
          <FiUpload /> Choose file
        </span>
        <p className="mt-2 text-[11px] text-neutral-400">
          {helperText ?? `Any file up to ${fmtSize(maxBytes)}.`}
        </p>
      </div>

      {showUrlField && (
        <div
          className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="block text-[10px] font-bold tracking-wider uppercase text-neutral-600 mb-2">
            Or paste a URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://… or /uploads/tds.pdf"
              className="admin-input font-mono text-xs flex-1"
            />
            <button
              type="button"
              onClick={applyUrl}
              disabled={!urlDraft.trim()}
              className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-neutral-200 bg-white-base text-xs font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-500 text-sm">
          <FiX className="text-base mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
