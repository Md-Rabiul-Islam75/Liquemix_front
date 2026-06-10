"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronRight, FiMenu, FiPlus } from "react-icons/fi";

import AdminSearch from "@/components/admin/AdminSearch";

/**
 * Admin topbar — breadcrumbs derived from the URL, a global search, and a
 * "+ Create" shortcut.
 *
 * Breadcrumbs are computed client-side from `pathname` rather than
 * threaded through every page, because every admin page sits under a
 * predictable URL structure.
 */

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  products: "Products",
  categories: "Categories",
  segments: "Segments",
  solutions: "System Solutions",
  references: "References",
  news: "News & Press",
  videos: "Videos",
  downloads: "Downloads",
  settings: "Site settings",
  users: "Users & roles",
  audit: "Audit log",
  new: "New",
};

function humanise(slug: string) {
  if (SEGMENT_LABELS[slug]) return SEGMENT_LABELS[slug];
  return slug
    .split("-")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  // The first segment is always "admin" — keep it as the root crumb.
  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    return { label: humanise(seg), href };
  });

  return (
    <header className="sticky top-0 z-30 bg-white-base border-b border-neutral-200">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
        {/* Mobile hamburger — placeholder, sidebar toggle wiring optional */}
        <button
          type="button"
          aria-label="Open menu"
          className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-neutral-600 hover:bg-neutral-100"
        >
          <FiMenu />
        </button>

        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-1 text-sm min-w-0"
        >
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <span key={c.href} className="inline-flex items-center gap-1 min-w-0">
                {last ? (
                  <span className="font-semibold text-neutral-900 truncate">
                    {c.label}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    className="text-neutral-500 hover:text-primary-600 truncate"
                  >
                    {c.label}
                  </Link>
                )}
                {!last && (
                  <FiChevronRight className="text-neutral-300 shrink-0" />
                )}
              </span>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Global search */}
        <AdminSearch />

        {/* Create */}
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          <FiPlus /> <span className="hidden sm:inline">Create</span>
        </Link>
      </div>
    </header>
  );
}
