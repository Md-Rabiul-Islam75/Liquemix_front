"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FiImage, FiTrash, FiUpload, FiX } from "react-icons/fi";

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Single-image picker. Two flows in one component:
 *   1. Upload from disk — FileReader → base64 data URL. v1 strategy:
 *      the data URL goes straight into the parent row. When S3 lands,
 *      this branch swaps to a POST that returns a CDN URL; nothing else
 *      changes.
 *   2. Paste a URL — for assets already served from /public.
 *
 * Used by the segment hero editor and the category image field.
 * `aspectClass` lets each caller pick the preview ratio that matches
 * how the image is actually rendered on the public site.
 */
export default function ImagePicker({
  value,
  onChange,
  aspectClass = "aspect-[16/9]",
  maxBytes = DEFAULT_MAX_BYTES,
  uploadLabel = "Choose a hero image",
  replaceLabel = "Replace hero image",
  helperText,
  showUrlField = true,
}: {
  value: string;
  onChange: (next: string) => void;
  aspectClass?: string;
  maxBytes?: number;
  uploadLabel?: string;
  replaceLabel?: string;
  helperText?: string;
  showUrlField?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(`"${file.name}" is not an image.`);
      return;
    }
    if (file.size > maxBytes) {
      setError(
        `"${file.name}" is ${fmtSize(file.size)} — max ${fmtSize(maxBytes)}.`
      );
      return;
    }
    try {
      setBusy(true);
      const dataUrl = await readAsDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read file.");
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
    <div className="space-y-4">
      {value && (
        <div className="rounded-xl border border-neutral-100 bg-white-base p-3">
          <div
            className={`relative w-full ${aspectClass} rounded-lg bg-neutral-100 overflow-hidden mb-3`}
          >
            <Image
              src={value}
              alt="Selected"
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove image"
              className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-md bg-white-base/95 text-error-500 hover:bg-error-50 shadow-soft"
            >
              <FiTrash />
            </button>
          </div>
          <p
            className="text-[11px] font-mono text-neutral-500 truncate"
            title={value}
          >
            {value.startsWith("data:")
              ? `Uploaded image (${fmtSize(value.length)})`
              : value}
          </p>
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
        className="group rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/60 p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onPickFile}
          className="hidden"
        />
        <FiImage className="mx-auto text-2xl text-neutral-400 group-hover:text-primary-500 mb-2" />
        <p className="text-sm font-semibold text-neutral-800">
          {busy ? "Reading image…" : value ? replaceLabel : uploadLabel}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Click to pick from your computer.
        </p>
        <span className="inline-flex items-center gap-1.5 mt-3 h-9 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold">
          <FiUpload /> Choose image
        </span>
        <p className="mt-2 text-[11px] text-neutral-400">
          {helperText ?? `JPG, PNG, WebP up to ${fmtSize(maxBytes)}.`}
        </p>
      </div>

      {showUrlField && (
        <div
          className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="block text-[10px] font-bold tracking-wider uppercase text-neutral-600 mb-2">
            Or enter a URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="/images/categories/crystalline.jpg or https://…"
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
