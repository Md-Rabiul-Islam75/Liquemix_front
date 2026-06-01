"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiFile,
  FiDownload,
  FiShield,
  FiClipboard,
} from "react-icons/fi";
import type { ProductDocument, DocumentType } from "@/types/Catalog";

const TYPE_META: Record<
  DocumentType,
  { label: string; icon: React.ReactNode }
> = {
  TDS: { label: "Technical Data Sheet", icon: <FiFile /> },
  MSDS: { label: "Safety Data Sheet (SDS)", icon: <FiShield /> },
  MTC: { label: "Material Test Certificate", icon: <FiClipboard /> },
  COO: { label: "Certificate of Origin", icon: <FiClipboard /> },
  BROCHURE: { label: "Brochures", icon: <FiFile /> },
  EPD: { label: "Environmental Product Declaration (EPD)", icon: <FiFile /> },
  DRAWING_DWG: { label: "Technical Drawings (DWG)", icon: <FiFile /> },
  DRAWING_PDF: { label: "Technical Drawings (PDF)", icon: <FiFile /> },
  TEST_REPORT: { label: "Test Reports", icon: <FiClipboard /> },
  OTHER: { label: "Additional Technical Information", icon: <FiFile /> },
};

// Stable display order matching Schomburg's accordion
const ORDER: DocumentType[] = [
  "OTHER",
  "BROCHURE",
  "EPD",
  "MSDS",
  "TDS",
  "DRAWING_DWG",
  "DRAWING_PDF",
  "TEST_REPORT",
  "MTC",
  "COO",
];

/**
 * Browser fallback when a download link has no explicit filename is
 * usually "download.pdf" — especially for data URLs (admin uploads
 * land as base64 data URLs in v1) and cross-origin assets. Convert the
 * editor-friendly title into a safe filename so the saved file is
 * recognisable: strip filesystem-hostile characters, keep spaces, and
 * always end in .pdf.
 */
function safeFilename(title: string, fallback = "document"): string {
  const base = (title || fallback)
    .trim()
    .replace(/\.pdf$/i, "")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 120);
  return `${base || fallback}.pdf`;
}

export default function DocumentAccordion({
  documents,
}: {
  documents: ProductDocument[];
}) {
  // Group by type
  const grouped = ORDER.reduce<Record<DocumentType, ProductDocument[]>>(
    (acc, type) => {
      const items = documents.filter((d) => d.type === type);
      if (items.length) acc[type] = items;
      return acc;
    },
    {} as Record<DocumentType, ProductDocument[]>
  );

  return (
    <section className="rounded-2xl overflow-hidden bg-neutral-900 text-white-base">
      <div className="px-6 md:px-8 py-6 md:py-7 border-b border-white/10">
        <h2 className="text-xl md:text-2xl font-bold">Downloads</h2>
        <p className="mt-1 text-sm text-white/65">
          Technical documents in English. Click a category to expand.
        </p>
      </div>

      <div className="divide-y divide-white/10">
        {ORDER.map((type) => {
          const items = grouped[type];
          if (!items?.length) return null;
          return (
            <AccordionRow
              key={type}
              type={type}
              label={TYPE_META[type].label}
              icon={TYPE_META[type].icon}
              items={items}
            />
          );
        })}
      </div>
    </section>
  );
}

function AccordionRow({
  type,
  label,
  icon,
  items,
}: {
  type: DocumentType;
  label: string;
  icon: React.ReactNode;
  items: ProductDocument[];
}) {
  const [open, setOpen] = useState(type === "TDS");

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 md:px-8 py-4 md:py-5 text-left hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-3 text-sm md:text-base font-semibold">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/10 text-accent-400">
            {icon}
          </span>
          {label}
          <span className="text-xs font-normal text-white/55">
            ({items.length})
          </span>
        </span>
        <FiChevronDown
          className={`text-xl transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <ul className="px-6 md:px-8 pb-5 space-y-2">
          {items.map((doc, idx) => (
            <li key={`${doc.url}-${idx}`}>
              <a
                href={doc.url}
                download={safeFilename(doc.title)}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <FiFile className="text-accent-400 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold truncate">
                      {doc.title}
                    </span>
                    <span className="block text-[11px] text-white/55 mt-0.5">
                      {doc.language}
                      {doc.revision && ` · ${doc.revision}`}
                      {doc.fileSizeKb && ` · ${doc.fileSizeKb} KB`}
                    </span>
                  </span>
                </span>
                <FiDownload className="text-white/70 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
