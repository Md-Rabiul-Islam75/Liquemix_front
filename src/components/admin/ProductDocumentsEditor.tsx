"use client";

import { useRef, useState } from "react";
import {
  FiBookOpen,
  FiCheckCircle,
  FiFile,
  FiPlus,
  FiTrash,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { DOCUMENT_LIBRARY, findInLibrary } from "@/data/documentLibrary";

export type DocumentType =
  | "TDS"
  | "MSDS"
  | "MTC"
  | "COO"
  | "BROCHURE"
  | "EPD"
  | "DRAWING_DWG"
  | "DRAWING_PDF"
  | "TEST_REPORT"
  | "OTHER";

export type ProductDocument = {
  type: DocumentType;
  title: string;
  url: string;
  language: string;
  revision?: string;
  fileSizeKb?: number;
  uploadedAt: string;
};

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: "TDS", label: "TDS — Technical Data Sheet" },
  { value: "MSDS", label: "MSDS — Safety Data Sheet" },
  { value: "MTC", label: "MTC — Material Test Certificate" },
  { value: "COO", label: "COO — Certificate of Origin" },
  { value: "BROCHURE", label: "Brochure" },
  { value: "EPD", label: "EPD — Environmental Product Declaration" },
  { value: "DRAWING_PDF", label: "Drawing (PDF)" },
  { value: "DRAWING_DWG", label: "Drawing (DWG)" },
  { value: "TEST_REPORT", label: "Test Report" },
  { value: "OTHER", label: "Other" },
];

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB cap for PDF uploads (matches backend AVATAR_MAX_SIZE × 5)

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
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
 * Product documents editor.
 *
 * Two add-flows:
 *   1. Pick from the in-project library (the PDFs under
 *      public/document-sheet/) — fastest path, no upload.
 *   2. Upload a new PDF — the browser reads it into a base64 data URL,
 *      same pragmatic v1 strategy as the image gallery. When Firebase /
 *      S3 lands, the data-URL becomes a CDN URL and nothing else changes.
 *
 * Each attached document carries: type (dropdown), title, language,
 * revision, optional file size, and the upload date. Editors can tweak
 * any of those inline on the card.
 */
export default function ProductDocumentsEditor({
  documents,
  onChange,
}: {
  documents: ProductDocument[];
  onChange: (next: ProductDocument[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Default doc-type applied to anything the user uploads or picks from
   *  the library next. Per-card dropdown still wins after the fact. */
  const [defaultType, setDefaultType] = useState<DocumentType>("TDS");

  // Which library entries are already on this product → grey them out
  const usedLibraryUrls = new Set(documents.map((d) => d.url));

  // ─── Upload flow ──────────────────────────────────────────────────
  async function onPick() {
    inputRef.current?.click();
  }

  async function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    e.target.value = "";
    if (!files || files.length === 0) return;
    await addFiles(files);
  }

  async function addFiles(files: FileList | File[]) {
    setError(null);
    const accepted: ProductDocument[] = [];
    for (const file of Array.from(files)) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError(`"${file.name}" is not a PDF.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(
          `"${file.name}" is ${fmtSize(file.size)} — max ${fmtSize(MAX_BYTES)} per file.`
        );
        continue;
      }
      try {
        setBusy(true);
        const dataUrl = await readAsDataUrl(file);
        const cleanName = file.name.replace(/\.pdf$/i, "");
        accepted.push({
          type: defaultType,
          title: cleanName,
          url: dataUrl,
          language: "EN",
          revision: "R01",
          fileSizeKb: Math.round(file.size / 1024),
          uploadedAt: todayIso(),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not read file.");
      } finally {
        setBusy(false);
      }
    }
    if (accepted.length > 0) onChange([...documents, ...accepted]);
  }

  // ─── Library pick flow ────────────────────────────────────────────
  function pickFromLibrary(url: string) {
    if (usedLibraryUrls.has(url)) return;
    const entry = findInLibrary(url);
    if (!entry) return;
    onChange([
      ...documents,
      {
        type: entry.suggestedType,
        title: entry.suggestedTitle,
        url: entry.url,
        language: "EN",
        revision: "R01",
        uploadedAt: todayIso(),
      },
    ]);
  }

  // ─── Card mutations ───────────────────────────────────────────────
  function updateDoc(idx: number, patch: Partial<ProductDocument>) {
    onChange(documents.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  }

  function removeAt(idx: number) {
    onChange(documents.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      {/* Existing documents */}
      {documents.length > 0 && (
        <ul className="space-y-3">
          {documents.map((d, i) => {
            const isDataUrl = d.url.startsWith("data:");
            return (
              <li
                key={i}
                className="rounded-xl border border-neutral-100 bg-white-base p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 text-base shrink-0 mt-0.5">
                    <FiFile />
                  </span>
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <label className="block sm:col-span-7">
                      <span className="block text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                        Title
                      </span>
                      <input
                        type="text"
                        value={d.title}
                        onChange={(e) => updateDoc(i, { title: e.target.value })}
                        className="admin-input h-9 text-sm"
                      />
                    </label>
                    <label className="block sm:col-span-5">
                      <span className="block text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                        Type
                      </span>
                      <select
                        value={d.type}
                        onChange={(e) =>
                          updateDoc(i, { type: e.target.value as DocumentType })
                        }
                        className="admin-input h-9 text-sm"
                      >
                        {DOCUMENT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block sm:col-span-3">
                      <span className="block text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                        Language
                      </span>
                      <input
                        type="text"
                        value={d.language}
                        onChange={(e) => updateDoc(i, { language: e.target.value })}
                        placeholder="EN"
                        className="admin-input h-9 text-sm font-mono"
                        maxLength={5}
                      />
                    </label>
                    <label className="block sm:col-span-3">
                      <span className="block text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                        Revision
                      </span>
                      <input
                        type="text"
                        value={d.revision ?? ""}
                        onChange={(e) => updateDoc(i, { revision: e.target.value })}
                        placeholder="R01"
                        className="admin-input h-9 text-sm font-mono"
                      />
                    </label>
                    <label className="block sm:col-span-3">
                      <span className="block text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                        Date
                      </span>
                      <input
                        type="date"
                        value={d.uploadedAt}
                        onChange={(e) =>
                          updateDoc(i, { uploadedAt: e.target.value })
                        }
                        className="admin-input h-9 text-sm"
                      />
                    </label>
                    <div className="sm:col-span-3 flex items-end">
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
                      >
                        Open PDF
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    aria-label="Remove document"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:bg-error-50 hover:text-error-500 shrink-0"
                  >
                    <FiTrash />
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-neutral-400 truncate" title={d.url}>
                  {isDataUrl
                    ? `Uploaded PDF (${d.fileSizeKb ? fmtSize(d.fileSizeKb * 1024) : "size unknown"})`
                    : d.url}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {/* Library picker */}
      <details className="group rounded-xl border border-neutral-100 bg-white-base">
        <summary className="cursor-pointer list-none p-4 flex items-center gap-3 hover:bg-neutral-50 rounded-xl">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-50 text-accent-800 text-base shrink-0">
            <FiBookOpen />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900">
              Pick from existing library
            </p>
            <p className="text-xs text-neutral-500">
              {DOCUMENT_LIBRARY.length} PDFs already under{" "}
              <code className="font-mono">public/document-sheet/</code> — fastest if a TDS is already in the project tree.
            </p>
          </div>
          <span className="text-xs font-semibold text-primary-600 group-open:hidden">
            Show
          </span>
          <span className="text-xs font-semibold text-primary-600 hidden group-open:inline">
            Hide
          </span>
        </summary>
        <ul className="border-t border-neutral-100 divide-y divide-neutral-50 max-h-72 overflow-y-auto">
          {DOCUMENT_LIBRARY.map((doc) => {
            const used = usedLibraryUrls.has(doc.url);
            return (
              <li key={doc.url}>
                <button
                  type="button"
                  onClick={() => pickFromLibrary(doc.url)}
                  disabled={used}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${
                    used
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-primary-50/40"
                  }`}
                >
                  <FiFile className="text-primary-600 shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-neutral-900 truncate">
                      {doc.suggestedTitle}
                    </span>
                    <span className="block text-[10px] text-neutral-500 font-mono truncate">
                      {doc.url}
                    </span>
                  </span>
                  {used ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success-700">
                      <FiCheckCircle /> Added
                    </span>
                  ) : (
                    <FiPlus className="text-primary-600" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </details>

      {/* Upload new PDF */}
      <div
        onClick={onPick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPick();
          }
        }}
        className="group rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/60 p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={onInputChange}
          className="hidden"
        />
        <FiUpload className="mx-auto text-2xl text-neutral-400 group-hover:text-primary-500 mb-2" />
        <p className="text-sm font-semibold text-neutral-800">
          {busy ? "Reading PDF…" : "Upload a new PDF"}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Click to pick a file from your computer.
        </p>

        {/* "Add as ..." type selector — defaults to TDS, can be changed
            to MSDS / MTC / COO / Brochure / EPD / Drawing / etc. before
            picking the file. The change persists for subsequent uploads
            too. Each card still has its own type dropdown so you can
            re-classify after the fact. */}
        <div
          className="inline-flex items-center gap-2 mt-3 mr-2"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="text-[11px] font-bold tracking-wider uppercase text-neutral-600">
            Add as
          </label>
          <select
            value={defaultType}
            onChange={(e) => setDefaultType(e.target.value as DocumentType)}
            className="h-9 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-800 cursor-pointer"
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <span className="inline-flex items-center gap-1.5 mt-3 h-9 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold">
          <FiUpload /> Choose PDF
        </span>
        <p className="mt-2 text-[11px] text-neutral-400">
          PDF only, up to {fmtSize(MAX_BYTES)} each. Multiple files OK. You
          can still change the type per-document afterwards using each
          card&apos;s dropdown.
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
