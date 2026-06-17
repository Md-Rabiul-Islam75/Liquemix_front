"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiSearch, FiMenu, FiX, FiChevronDown, FiCheckCircle } from "react-icons/fi";
import { useEnquirer } from "@/lib/enquirer";
import {
  segments as fallbackSegments,
  fetchSegments,
} from "@/data/segments";
import { fetchCategoriesBySegment } from "@/data/categories";
import {
  systemSolutions as fallbackSolutions,
  fetchSystemSolutions,
} from "@/data/solutions";
import type { Category, Segment, SystemSolution } from "@/types/Catalog";
import ProductSearchModal from "@/components/search/ProductSearchModal";
import TopBar from "./TopBar";

type MenuKey = "products" | "solutions" | "service" | "about" | null;

const SEGMENT_BAR_COLOR: Record<string, string> = {
  blue: "bg-primary-500",
  orange: "bg-secondary-500",
  yellow: "bg-accent-500",
  green: "bg-success-500",
};

export default function Header() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // The public visitor's Google sign-in (set in the Enquire flow). Shown as
  // a "Signed in as …" chip to the left of the search icon.
  const enquirer = useEnquirer();

  // Live segments + categories. Seed with the mock list so the very
  // first paint has hover targets; the effect below replaces it with
  // backend data once mounted. Note: we store the full flat list per
  // segment (not just roots) so the mega-menu can render sub-categories
  // beneath their parents — the customer needs to see depth, not just
  // the top of the tree.
  const [segments, setSegments] = useState<Segment[]>(fallbackSegments);
  const [solutions, setSolutions] =
    useState<SystemSolution[]>(fallbackSolutions);
  const [allCatsBySegment, setAllCatsBySegment] = useState<
    Record<string, Category[]>
  >({});
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(
    fallbackSegments[0]?.id != null ? String(fallbackSegments[0].id) : null
  );

  // Hover-intent timer: lets the mouse cross the gap between a nav button
  // and its mega-menu without the menu closing the moment we leave the button.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Fetch live segments + every segment's flat category list once at
  // mount. Mega-menu only needs root categories (parentId === null) but
  // we cache the full list per segment for future sub-category panels.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [segs, sols] = await Promise.all([
          fetchSegments(),
          fetchSystemSolutions(),
        ]);
        if (cancelled) return;
        setSegments(segs);
        setSolutions(sols);
        if (segs[0]?.id != null) setHoveredSegment(String(segs[0].id));
        const allCats = await Promise.all(
          segs.map((s) => fetchCategoriesBySegment(s.id))
        );
        if (cancelled) return;
        const byId: Record<string, Category[]> = {};
        segs.forEach((s, i) => {
          // Keep the full flat list (active only) so the mega-menu can
          // build root + sub + tertiary panels. Sorting is per-sibling
          // and is done at render time once the tree is assembled.
          byId[String(s.id)] = allCats[i].filter((c) => c.isActive !== false);
        });
        setAllCatsBySegment(byId);
      } catch {
        // Fall back to mock arrays already seeded; mega-menu still renders.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Cmd/Ctrl+K to open product search from anywhere.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openWithIntent = (key: MenuKey) => {
    cancelClose();
    setOpenMenu(key);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null);
    }, 180);
  };

  const closeAll = () => {
    cancelClose();
    setOpenMenu(null);
    setHoveredSegment(segments[0]?.id != null ? String(segments[0].id) : null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white-base/95 backdrop-blur-md border-b border-neutral-100 print:hidden">
      <TopBar />

      <div className="container-page flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0" onClick={closeAll}>
          <Image
            src="/logo/LiqueMix.png"
            alt="LiqueMix"
            width={200}
            height={60}
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            type="button"
            className="nav-link"
            aria-expanded={openMenu === "products"}
            onMouseEnter={() => openWithIntent("products")}
            onMouseLeave={scheduleClose}
            onFocus={() => openWithIntent("products")}
            onBlur={scheduleClose}
          >
            Products <FiChevronDown className="text-base" />
          </button>

          <button
            type="button"
            className="nav-link"
            aria-expanded={openMenu === "solutions"}
            onMouseEnter={() => openWithIntent("solutions")}
            onMouseLeave={scheduleClose}
            onFocus={() => openWithIntent("solutions")}
            onBlur={scheduleClose}
          >
            System Solutions <FiChevronDown className="text-base" />
          </button>

          <Link
            href="/references"
            className="nav-link"
            onMouseEnter={closeAll}
          >
            References
          </Link>

          <button
            type="button"
            className="nav-link"
            aria-expanded={openMenu === "service"}
            onMouseEnter={() => openWithIntent("service")}
            onMouseLeave={scheduleClose}
            onFocus={() => openWithIntent("service")}
            onBlur={scheduleClose}
          >
            Service <FiChevronDown className="text-base" />
          </button>

          <button
            type="button"
            className="nav-link"
            aria-expanded={openMenu === "about"}
            onMouseEnter={() => openWithIntent("about")}
            onMouseLeave={scheduleClose}
            onFocus={() => openWithIntent("about")}
            onBlur={scheduleClose}
          >
            About <FiChevronDown className="text-base" />
          </button>

          <Link
            href="/news"
            className="nav-link"
            onMouseEnter={closeAll}
          >
            News
          </Link>

          {/* Products Mega-menu */}
          <div
            className="megamenu"
            data-open={openMenu === "products"}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="grid grid-cols-12 gap-0">
              {/* Segments column */}
              <div className="col-span-3 bg-neutral-50 rounded-l-2xl p-4">
                <p className="px-3 pt-2 pb-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500">
                  Segments
                </p>
                <ul className="space-y-1">
                  {segments.map((seg) => (
                    <li key={seg.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setHoveredSegment(String(seg.id))}
                        className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                          hoveredSegment === String(seg.id)
                            ? "bg-white-base text-primary-700 shadow-sm"
                            : "text-neutral-700 hover:text-primary-600"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`block w-1 h-5 rounded-full ${SEGMENT_BAR_COLOR[seg.color]}`}
                          />
                          {seg.name}
                        </span>
                        <FiChevronDown className="-rotate-90 text-neutral-400" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories panel */}
              <div className="col-span-6 p-6">
                {hoveredSegment &&
                  (() => {
                    const seg = segments.find((s) => String(s.id) === hoveredSegment);
                    const flat = allCatsBySegment[hoveredSegment] ?? [];
                    // Build the tree once per hover-target. Each root
                    // carries its children + grandchildren so the menu
                    // can show arbitrary depth without further fetches.
                    const childrenOf = new Map<number | string | null, Category[]>();
                    for (const c of flat) {
                      const key = c.parentId ?? null;
                      if (!childrenOf.has(key)) childrenOf.set(key, []);
                      childrenOf.get(key)!.push(c);
                    }
                    for (const list of childrenOf.values()) {
                      list.sort((a, b) => a.menuOrder - b.menuOrder);
                    }
                    const roots = childrenOf.get(null) ?? [];

                    return (
                      <div>
                        <div className="flex items-baseline justify-between mb-4">
                          <h3 className="text-lg font-bold text-neutral-900">
                            {seg?.name}
                          </h3>
                          <Link
                            href={`/products/${seg?.slug}`}
                            className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                            onClick={closeAll}
                          >
                            View all →
                          </Link>
                        </div>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                          {roots.map((root) => {
                            const subs = childrenOf.get(root.id) ?? [];
                            return (
                              <li key={root.id}>
                                <Link
                                  href={`/products/${seg?.slug}?category=${root.slug}`}
                                  onClick={closeAll}
                                  className="block text-sm font-bold text-neutral-900 hover:text-primary-600 transition-colors"
                                >
                                  {root.name}
                                </Link>
                                {subs.length > 0 && (
                                  <ul className="mt-1.5 space-y-0.5 border-l border-neutral-200 pl-3 ml-0.5">
                                    {subs.map((sub) => {
                                      const tertiaries =
                                        childrenOf.get(sub.id) ?? [];
                                      return (
                                        <li key={sub.id}>
                                          <Link
                                            href={`/products/${seg?.slug}?category=${sub.slug}`}
                                            onClick={closeAll}
                                            className="block py-1 text-[13px] text-neutral-600 hover:text-primary-600 transition-colors"
                                          >
                                            {sub.name}
                                          </Link>
                                          {tertiaries.length > 0 && (
                                            <ul className="space-y-0.5 border-l border-neutral-100 pl-3 ml-0.5">
                                              {tertiaries.map((t) => (
                                                <li key={t.id}>
                                                  <Link
                                                    href={`/products/${seg?.slug}?category=${t.slug}`}
                                                    onClick={closeAll}
                                                    className="block py-0.5 text-[12px] text-neutral-500 hover:text-primary-600 transition-colors"
                                                  >
                                                    {t.name}
                                                  </Link>
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })()}
              </div>

              {/* Promo panel */}
              <div className="col-span-3 m-2 rounded-xl overflow-hidden relative brand-gradient text-white-base p-6 flex flex-col justify-between min-h-[260px]">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/80">
                    Featured
                  </p>
                  <h4 className="mt-2 text-xl font-bold leading-snug">
                    Lique Hydro-Guard 3X
                  </h4>
                  <p className="mt-1 text-sm text-white/90">
                    Triple-action waterproofing in a single coat.
                  </p>
                </div>
                <Link
                  href="/products/waterproofing-and-restoration/lique-hydro-guard-3x"
                  onClick={closeAll}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-white-base hover:gap-2 transition-all"
                >
                  Discover →
                </Link>
              </div>
            </div>
          </div>

          {/* System Solutions Mega-menu */}
          <div
            className="megamenu"
            data-open={openMenu === "solutions"}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-900">
                  Engineered System Solutions
                </h3>
                <Link
                  href="/solutions"
                  onClick={closeAll}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {solutions.map((sol) => (
                  <Link
                    key={sol.id}
                    href={`/solutions/${sol.slug}`}
                    onClick={closeAll}
                    className="group block p-4 rounded-xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/40 transition-all"
                  >
                    <p className="text-sm font-bold text-neutral-900 group-hover:text-primary-700">
                      {sol.name}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                      {sol.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Service Mega-menu */}
          <div
            className="megamenu"
            data-open={openMenu === "service"}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="p-6 grid grid-cols-4 gap-3">
              {[
                {
                  href: "/service/downloads",
                  title: "Downloads",
                  desc: "Datasheets, brochures, planning folders, ATIs.",
                  accent: "bg-primary-50 text-primary-700",
                },
                {
                  href: "/service/videos",
                  title: "Videos",
                  desc: "Product demos and application techniques.",
                  accent: "bg-secondary-50 text-secondary-700",
                },
                {
                  href: "/service/events",
                  title: "Events",
                  desc: "Trade fairs, training, and webinars.",
                  accent: "bg-accent-50 text-accent-800",
                },
                {
                  href: "/service/links",
                  title: "Useful Links",
                  desc: "Standards, partners, and resources.",
                  accent: "bg-success-50 text-success-700",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeAll}
                  className="group block p-5 rounded-xl border border-neutral-100 hover:border-primary-200 hover:shadow-soft transition-all"
                >
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${item.accent}`}
                  >
                    {item.title}
                  </span>
                  <p className="mt-3 text-sm font-bold text-neutral-900 group-hover:text-primary-700">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* About Mega-menu */}
          <div
            className="megamenu"
            data-open={openMenu === "about"}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="p-6 grid grid-cols-3 gap-2">
              {[
                { href: "/about#values", title: "Corporate Values", desc: "Our mission and principles." },
                { href: "/about#management", title: "Management", desc: "Meet the leadership team." },
                { href: "/about#quality", title: "Quality", desc: "Certifications and lab testing." },
                { href: "/about#story", title: "Our Story", desc: "From the lab to your site." },
                { href: "/about#sustainability", title: "Sustainability", desc: "Low-carbon pathway." },
                { href: "/about#careers", title: "Careers", desc: "Join the team." },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeAll}
                  className="group block p-4 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <p className="text-sm font-bold text-neutral-900 group-hover:text-primary-700">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {mounted && enquirer && (
            <span
              title={`Signed in as ${enquirer.name || enquirer.email}`}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 max-w-[180px] pl-2.5 pr-3 rounded-full bg-success-50 border border-success-200 text-success-700 text-xs font-semibold"
            >
              <FiCheckCircle className="shrink-0 text-sm" />
              <span className="truncate">
                {enquirer.name || enquirer.email}
              </span>
            </span>
          )}

          <button
            type="button"
            aria-label="Search products"
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <FiSearch className="text-lg" />
          </button>

          <Link
            href="/contact"
            className="hidden lg:inline-flex btn-accent !h-10 !px-5 text-sm"
          >
            Enquire
          </Link>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-neutral-700 hover:bg-neutral-50"
          >
            <FiMenu className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (portaled to document.body to escape the header's
          backdrop-filter containing block, which would otherwise bound the
          fixed overlay to the header strip). */}
      {mounted && mobileOpen &&
        createPortal(
          <div
            className="lg:hidden fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute right-0 top-0 bottom-0 w-[88vw] max-w-sm sm:max-w-md bg-white-base shadow-2xl overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white-base z-10">
                <Image
                  src="/logo/LiqueMix.png"
                  alt="LiqueMix"
                  width={140}
                  height={40}
                  className="h-8 w-auto"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 inline-flex items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-50"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <div className="flex-1 px-5 sm:px-6 py-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 mb-3">
                  Products
                </p>
                <ul className="space-y-1 mb-6">
                  {segments.map((seg) => (
                    <li key={seg.id}>
                      <Link
                        href={`/products/${seg.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 py-2.5 text-sm font-semibold text-neutral-800 hover:text-primary-700"
                      >
                        <span
                          className={`block w-1 h-5 rounded-full ${SEGMENT_BAR_COLOR[seg.color]}`}
                        />
                        {seg.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 mb-3">
                  Explore
                </p>
                <ul className="space-y-1 mb-8">
                  {[
                    ["/solutions", "System Solutions"],
                    ["/references", "References"],
                    ["/service/downloads", "Downloads"],
                    ["/service/videos", "Videos"],
                    ["/service/events", "Events"],
                    ["/news", "News"],
                    ["/about", "About"],
                    ["/contact", "Contact"],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-sm font-semibold text-neutral-800 hover:text-primary-700"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-5 sm:px-6 py-4 border-t border-neutral-100 sticky bottom-0 bg-white-base">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="btn-accent w-full"
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Product search modal */}
      <ProductSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}
