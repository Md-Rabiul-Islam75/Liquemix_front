"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { FiSearch, FiX, FiSliders, FiChevronDown } from "react-icons/fi";
import type { Category, EntityId } from "@/types/Catalog";

/** Walk the flat list into a depth-aware ordered array so each row in
 *  the sidebar knows how deeply to indent. */
type DepthRow = Category & { depth: number };
function flattenWithDepth(flat: Category[]): DepthRow[] {
  const byParent = new Map<EntityId | null, Category[]>();
  for (const c of flat) {
    const key = c.parentId ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(c);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.menuOrder - b.menuOrder);
  }
  const out: DepthRow[] = [];
  const walk = (parent: EntityId | null, depth: number) => {
    for (const c of byParent.get(parent) ?? []) {
      out.push({ ...c, depth });
      walk(c.id, depth + 1);
    }
  };
  walk(null, 0);
  return out;
}

export default function ProductFilters({
  categories,
  categoryCounts,
  total,
  filtered,
}: {
  categories: Category[];
  /** Product count per category id (descendant-inclusive). */
  categoryCounts?: Record<string, number>;
  total: number;
  filtered: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const currentCategory = params.get("category") ?? "";
  const currentQ = params.get("q") ?? "";
  const [q, setQ] = useState(currentQ);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Build a depth-aware ordered list so sub-categories show indented
  // under their parents. Active-only is handled by the page that hands
  // us the list.
  const rows = useMemo(() => flattenWithDepth(categories), [categories]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    });
  };

  const clear = () => {
    setQ("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  };

  const hasFilters = currentCategory || currentQ;

  return (
    <aside className="lg:sticky lg:top-28">
      {/* Mobile/tablet toggle — collapses the filter panel on small screens
          so the product grid is reachable without scrolling past every
          category. Always-open on lg+. */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
        className="lg:hidden w-full mb-3 flex items-center justify-between gap-3 px-4 h-12 rounded-xl bg-white-base border border-neutral-200 text-sm font-semibold text-neutral-800 shadow-soft"
      >
        <span className="inline-flex items-center gap-2">
          <FiSliders className="text-primary-600" />
          Filters
          <span className="text-xs font-normal text-neutral-500">
            ({filtered} of {total})
          </span>
        </span>
        <FiChevronDown
          className={`text-neutral-500 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`brand-panel p-4 sm:p-5 space-y-6 ${mobileOpen ? "block" : "hidden lg:block"}`}
      >
        <div>
          <label htmlFor="product-search" className="brand-panel__eyebrow block mb-2">
            Search
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateParam("q", q);
            }}
            className="relative"
          >
            <input
              id="product-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or SKU"
              className="w-full h-11 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          </form>
        </div>

        <div>
          <p className="brand-panel__eyebrow block mb-2">Category</p>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => updateParam("category", "")}
                className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !currentCategory
                    ? "bg-primary-500 text-white-base font-semibold shadow-[0_4px_12px_-4px_rgba(21,101,192,0.4)]"
                    : "text-neutral-700 hover:bg-primary-50 hover:text-primary-700"
                }`}
              >
                <span>All categories</span>
                <span className={`text-xs ${!currentCategory ? "text-white/75" : "text-neutral-400"}`}>{total}</span>
              </button>
            </li>
            {rows.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => updateParam("category", cat.slug)}
                  style={{
                    paddingLeft: `${0.75 + cat.depth * 0.85}rem`,
                  }}
                  className={`w-full text-left pr-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-1.5 ${
                    currentCategory === cat.slug
                      ? "bg-primary-500 text-white-base font-semibold shadow-[0_4px_12px_-4px_rgba(21,101,192,0.4)]"
                      : "text-neutral-700 hover:bg-primary-50 hover:text-primary-700"
                  } ${cat.depth > 0 ? "text-[13px]" : "font-semibold"}`}
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    {cat.depth > 0 && (
                      <span
                        className={`inline-block ${
                          currentCategory === cat.slug
                            ? "text-white/60"
                            : "text-neutral-400"
                        }`}
                        aria-hidden
                      >
                        ↳
                      </span>
                    )}
                    <span className="truncate">{cat.name}</span>
                  </span>
                  <span
                    className={`text-xs shrink-0 ${
                      currentCategory === cat.slug
                        ? "text-white/75"
                        : "text-neutral-400"
                    }`}
                  >
                    {categoryCounts?.[String(cat.id)] ?? 0}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-primary-100/60 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Showing <span className="font-bold text-neutral-900">{filtered}</span>{" "}
            of {total}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              <FiX /> Clear
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
