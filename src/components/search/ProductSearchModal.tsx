"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiCornerDownLeft, FiSearch, FiX } from "react-icons/fi";
import { products } from "@/data/products";
import { segments } from "@/data/segments";
import type { Product } from "@/types/Catalog";

const SEGMENT_DOT: Record<string, string> = {
  blue: "bg-primary-500",
  orange: "bg-secondary-500",
  yellow: "bg-accent-500",
  green: "bg-success-500",
};

function normalize(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

function scoreProduct(p: Product, q: string): number {
  const nq = normalize(q);
  if (!nq) return 0;
  const name = normalize(p.name);
  const sku = normalize(p.sku);
  const desc = normalize(p.shortDescription);
  const areas = normalize(p.applicationAreas.join(" "));
  const advantages = normalize(p.advantages.join(" "));

  // Higher score = better match. Order matters for the displayed list.
  if (name.startsWith(nq)) return 100;
  if (sku.startsWith(nq)) return 95;
  if (name.includes(nq)) return 80;
  if (sku.includes(nq)) return 70;
  if (desc.includes(nq)) return 50;
  if (areas.includes(nq)) return 30;
  if (advantages.includes(nq)) return 20;
  return 0;
}

export default function ProductSearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Autofocus and reset state when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      // small timeout so the modal mounts before focus
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape to close, arrows to navigate, enter to open
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      // Empty state: show featured products as a starting point.
      return products.filter((p) => p.isFeatured).slice(0, 6);
    }
    return products
      .map((p) => ({ p, score: scoreProduct(p, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((r) => r.p);
  }, [query]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLAnchorElement>("[data-result-item]");
    items[activeIdx]?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = listRef.current?.querySelectorAll<HTMLAnchorElement>("[data-result-item]")[activeIdx];
      target?.click();
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] bg-neutral-900/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Product search"
    >
      <div
        className="absolute left-1/2 top-16 md:top-24 -translate-x-1/2 w-[92vw] max-w-2xl rounded-2xl bg-white-base shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
          <FiSearch className="text-xl text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products by name, SKU, or application..."
            className="flex-1 bg-transparent outline-none text-base text-neutral-900 placeholder:text-neutral-400"
            aria-label="Search products"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear"
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-neutral-500 hover:bg-neutral-100"
            >
              <FiX />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-neutral-500 bg-neutral-100"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="flex-1 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-neutral-500">
                No products match{" "}
                <span className="font-semibold text-neutral-900">&quot;{query}&quot;</span>.
                Try a different keyword or browse{" "}
                <Link
                  href="/products"
                  onClick={onClose}
                  className="text-primary-600 font-semibold hover:underline"
                >
                  all products
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              {!query && (
                <p className="px-5 pt-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Featured products
                </p>
              )}
              {query && (
                <p className="px-5 pt-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {results.length} {results.length === 1 ? "match" : "matches"} for &quot;{query}&quot;
                </p>
              )}
              <ul className="pb-2">
                {results.map((p, i) => {
                  const segment = segments.find((s) => s.id === p.segmentId);
                  const primaryImage =
                    p.images.find((img) => img.isPrimary) ?? p.images[0];
                  const isActive = i === activeIdx;
                  return (
                    <li key={p.id}>
                      <Link
                        data-result-item
                        href={`/products/${segment?.slug}/${p.slug}`}
                        onClick={onClose}
                        onMouseEnter={() => setActiveIdx(i)}
                        className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                          isActive
                            ? "bg-primary-50/60"
                            : "hover:bg-neutral-50"
                        }`}
                      >
                        <div className="relative w-14 h-14 shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                          {primaryImage && (
                            <Image
                              src={encodeURI(primaryImage.url)}
                              alt={primaryImage.alt}
                              fill
                              sizes="56px"
                              className="object-contain p-1"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-neutral-900 truncate">
                            {highlightMatch(p.name, query)}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                className={`block w-1.5 h-1.5 rounded-full ${
                                  SEGMENT_DOT[segment?.color ?? "blue"]
                                }`}
                              />
                              {segment?.name}
                            </span>{" "}
                            · {p.sku}
                          </p>
                        </div>
                        {isActive && (
                          <FiCornerDownLeft className="text-neutral-400 shrink-0 hidden md:block" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="hidden md:flex items-center gap-4 px-5 py-2.5 border-t border-neutral-100 text-[11px] text-neutral-500 bg-neutral-50">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white-base border border-neutral-200 font-mono text-[10px]">
              ↑↓
            </kbd>{" "}
            Navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white-base border border-neutral-200 font-mono text-[10px]">
              ↵
            </kbd>{" "}
            Open
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white-base border border-neutral-200 font-mono text-[10px]">
              esc
            </kbd>{" "}
            Close
          </span>
          <span className="ml-auto">
            <Link
              href="/products"
              onClick={onClose}
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              Browse all products →
            </Link>
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Wraps every occurrence of `query` inside `text` with a <mark> tag so the
 * matched substring is visually highlighted. Case-insensitive.
 */
function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent-200 text-neutral-900 rounded px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}
