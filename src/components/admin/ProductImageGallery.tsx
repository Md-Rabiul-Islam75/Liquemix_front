"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  FiCheckCircle,
  FiImage,
  FiStar,
  FiTrash,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { adminUploadFile } from "@/lib/adminApi";

export type ProductImage = {
  url: string;
  alt: string;
  isPrimary?: boolean;
};

/**
 * Image gallery editor. Each picked file is uploaded to the backend
 * (POST /api/v1/admin/files) which stores it on disk and returns a short
 * /files/... URL — that URL is what goes into the product's images JSON.
 * The row stays tiny; no base64 bytes ever live in the database.
 *
 * Files over MAX_BYTES are rejected client-side before the upload.
 */

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB per image

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function ProductImageGallery({
  images,
  onChange,
}: {
  images: ProductImage[];
  onChange: (next: ProductImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function addFiles(files: FileList | File[]) {
    setError(null);
    const accepted: ProductImage[] = [];
    const list = Array.from(files);
    for (const file of list) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not an image.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(
          `"${file.name}" is ${fmtSize(file.size)} — max ${fmtSize(MAX_BYTES)} per image.`
        );
        continue;
      }
      try {
        setBusy(true);
        const url = await adminUploadFile(file, "products/images");
        accepted.push({
          url,
          alt: file.name.replace(/\.[^.]+$/, ""), // strip extension for default alt
          isPrimary: images.length === 0 && accepted.length === 0,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setBusy(false);
      }
    }
    if (accepted.length > 0) onChange([...images, ...accepted]);
  }

  function onPick() {
    inputRef.current?.click();
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files);
    // reset so picking the same file twice still triggers onChange
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function removeAt(idx: number) {
    const next = images.filter((_, i) => i !== idx);
    if (next.length > 0 && !next.some((i) => i.isPrimary)) {
      next[0] = { ...next[0], isPrimary: true };
    }
    onChange(next);
  }

  function setPrimary(idx: number) {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === idx })));
  }

  function updateAlt(idx: number, newAlt: string) {
    onChange(
      images.map((img, i) => (i === idx ? { ...img, alt: newAlt } : img))
    );
  }

  return (
    <div className="space-y-4">
      {/* Existing images */}
      {images.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {images.map((img, i) => (
            <li
              key={i}
              className={`relative rounded-xl border p-3 ${
                img.isPrimary
                  ? "border-primary-300 bg-primary-50/40 ring-1 ring-primary-200"
                  : "border-neutral-100 bg-white-base"
              }`}
            >
              <div className="relative w-full aspect-square rounded-lg bg-neutral-100 overflow-hidden mb-2">
                <Image
                  src={img.url}
                  alt={img.alt || "Product image"}
                  fill
                  sizes="240px"
                  className="object-contain p-2"
                  unoptimized // data URLs + arbitrary remote URLs both bypass the optimizer
                />
                {img.isPrimary && (
                  <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary-500 text-white-base text-[10px] font-bold uppercase tracking-wider">
                    <FiCheckCircle className="text-[10px]" /> Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label="Remove image"
                  className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-7 h-7 rounded-md bg-white-base/90 text-error-500 hover:bg-error-50"
                >
                  <FiTrash />
                </button>
              </div>
              <input
                type="text"
                value={img.alt}
                onChange={(e) => updateAlt(i, e.target.value)}
                placeholder="Alt text (for accessibility / SEO)"
                className="admin-input text-xs h-8"
              />
              {!img.isPrimary && (
                <button
                  type="button"
                  onClick={() => setPrimary(i)}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                >
                  <FiStar /> Set as primary
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Picker / drop zone */}
      <div
        onClick={onPick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPick();
          }
        }}
        className={`group relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-primary-500 bg-primary-50"
            : "border-neutral-300 bg-neutral-50/60 hover:border-primary-400 hover:bg-primary-50/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onInputChange}
          className="hidden"
        />
        <FiImage className="mx-auto text-3xl text-neutral-400 group-hover:text-primary-500 mb-3" />
        <p className="text-sm font-semibold text-neutral-800 mb-1">
          {busy
            ? "Uploading…"
            : images.length === 0
            ? "Choose images to upload"
            : "Add more images"}
        </p>
        <p className="text-xs text-neutral-500">
          Click to pick from your computer, or drag-drop here.
        </p>
        <span className="inline-flex items-center gap-1.5 mt-4 h-9 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold">
          <FiUpload /> Choose file
        </span>
        <p className="mt-3 text-[11px] text-neutral-400">
          JPG, PNG, WebP up to {fmtSize(MAX_BYTES)} each. You can select
          multiple files at once.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-500 text-sm">
          <FiX className="text-base mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
