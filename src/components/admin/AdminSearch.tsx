"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiBarChart2, FiBox, FiFileText, FiLayers, FiSearch, FiX } from "react-icons/fi";

import { adminGet, getToken } from "@/lib/adminApi";

type Kind = "Product" | "News" | "Reference" | "Solution";

type Result = {
  key: string;
  title: string;
  subtitle?: string;
  href: string;
  kind: Kind;
};

const KIND_ICON: Record<Kind, React.ReactNode> = {
  Product: <FiBox />,
  News: <FiFileText />,
  Reference: <FiBarChart2 />,
  Solution: <FiLayers />,
};

const KIND_TINT: Record<Kind, string> = {
  Product: "bg-primary-50 text-primary-600",
  News: "bg-secondary-50 text-secondary-700",
  Reference: "bg-success-50 text-success-700",
  Solution: "bg-accent-50 text-accent-700",
};

/**
 * Global admin search. Queries products, news, and references (the admin
 * endpoints, all statuses) as you type and links straight to the edit screen.
 * ⌘K / Ctrl+K focuses it.
 */
export default function AdminSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // ⌘K / Ctrl+K focuses the search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Debounced search across products / news / references.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    if (getToken() == null) return;
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      const enc = encodeURIComponent(term);
      const lower = term.toLowerCase();
      const [p, n, r, s] = await Promise.all([
        adminGet<{ items: { id: number; name: string; sku: string }[] }>(
          `/api/v1/admin/catalog/products?q=${enc}&page=1&size=5`
        ).catch(() => ({ items: [] })),
        adminGet<{ id: number; title: string; category: string }[]>(
          `/api/v1/admin/content/news?q=${enc}`
        ).catch(() => []),
        adminGet<{ id: number; title: string; projectType: string }[]>(
          `/api/v1/admin/content/references?q=${enc}`
        ).catch(() => []),
        // Solutions have no server-side `q` filter; the list is tiny, so we
        // fetch all and match by name on the client.
        adminGet<
          { id: number; name: string; segmentName?: string; status?: string }[]
        >(`/api/v1/admin/catalog/solutions`).catch(() => []),
      ]);
      if (cancelled) return;
      setResults([
        ...(p.items ?? []).slice(0, 5).map((x) => ({
          key: `p-${x.id}`,
          title: x.name,
          subtitle: x.sku,
          href: `/admin/products/${x.id}`,
          kind: "Product" as const,
        })),
        ...(Array.isArray(s) ? s : [])
          .filter((x) => x.name?.toLowerCase().includes(lower))
          .slice(0, 5)
          .map((x) => ({
            key: `s-${x.id}`,
            title: x.name,
            subtitle: x.segmentName ?? x.status,
            href: `/admin/solutions/${x.id}`,
            kind: "Solution" as const,
          })),
        ...n.slice(0, 5).map((x) => ({
          key: `n-${x.id}`,
          title: x.title,
          subtitle: x.category,
          href: `/admin/news/${x.id}`,
          kind: "News" as const,
        })),
        ...r.slice(0, 5).map((x) => ({
          key: `r-${x.id}`,
          title: x.title,
          subtitle: x.projectType,
          href: `/admin/references/${x.id}`,
          kind: "Reference" as const,
        })),
      ]);
      setLoading(false);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [q]);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  const showPanel = open && q.trim().length >= 2;

  return (
    <div ref={boxRef} className="hidden md:block relative min-w-[300px]">
      <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-neutral-200 bg-neutral-50 focus-within:bg-white-base focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-colors">
        <FiSearch className="text-neutral-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
            if (e.key === "Enter" && results[0]) go(results[0].href);
          }}
          placeholder="Search products, solutions, references, news..."
          className="flex-1 min-w-0 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
        />
        {q ? (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              setQ("");
              inputRef.current?.focus();
            }}
            className="text-neutral-400 hover:text-neutral-700 shrink-0"
          >
            <FiX />
          </button>
        ) : (
          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-white-base border border-neutral-200 font-mono text-[10px] text-neutral-500 shrink-0">
            ⌘ K
          </kbd>
        )}
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl bg-white-base border border-neutral-100 shadow-lg overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {loading && results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-neutral-500">
              Searching…
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-neutral-500">
              No matches for{" "}
              <span className="font-semibold text-neutral-700">
                &ldquo;{q.trim()}&rdquo;
              </span>
            </p>
          ) : (
            <ul className="py-1.5">
              {results.map((res) => (
                <li key={res.key}>
                  <Link
                    href={res.href}
                    onClick={() => go(res.href)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50"
                  >
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm shrink-0 ${KIND_TINT[res.kind]}`}
                    >
                      {KIND_ICON[res.kind]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {res.title}
                      </p>
                      {res.subtitle && (
                        <p className="text-[11px] text-neutral-500 truncate">
                          {res.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 shrink-0">
                      {res.kind}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
