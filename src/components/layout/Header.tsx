"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiSearch, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { segments } from "@/data/segments";
import { getRootCategoriesBySegment } from "@/data/categories";
import { systemSolutions } from "@/data/solutions";
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
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(
    segments[0]?.id ?? null
  );

  // Hover-intent timer: lets the mouse cross the gap between a nav button
  // and its mega-menu without the menu closing the moment we leave the button.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
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
    setHoveredSegment(segments[0]?.id ?? null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white-base/95 backdrop-blur-md border-b border-neutral-100">
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
                        onMouseEnter={() => setHoveredSegment(seg.id)}
                        className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                          hoveredSegment === seg.id
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
                    const seg = segments.find((s) => s.id === hoveredSegment);
                    const cats = getRootCategoriesBySegment(hoveredSegment);
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
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                          {cats.map((cat) => (
                            <li key={cat.id}>
                              <Link
                                href={`/products/${seg?.slug}/${cat.slug}`}
                                onClick={closeAll}
                                className="block py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors"
                              >
                                {cat.name}
                              </Link>
                            </li>
                          ))}
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
                {systemSolutions.map((sol) => (
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
                { href: "/about", title: "Corporate Values", desc: "Our mission and principles." },
                { href: "/about/management", title: "Management", desc: "Meet the leadership team." },
                { href: "/about/quality", title: "Quality", desc: "Certifications and lab testing." },
                { href: "/about/history", title: "Our Story", desc: "From the lab to your site." },
                { href: "/about/sustainability", title: "Sustainability", desc: "Low-carbon pathway." },
                { href: "/about/careers", title: "Careers", desc: "Join the team." },
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
          <button
            type="button"
            aria-label="Search"
            className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
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

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-neutral-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-[88vw] max-w-sm bg-white-base shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <Image src="/logo/LiqueMix.png" alt="LiqueMix" width={140} height={40} className="h-8 w-auto" />
              <button onClick={() => setMobileOpen(false)} aria-label="Close" className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-neutral-50">
                <FiX className="text-2xl" />
              </button>
            </div>

            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 mb-3">
              Products
            </p>
            <ul className="space-y-1 mb-6">
              {segments.map((seg) => (
                <li key={seg.id}>
                  <Link
                    href={`/products/${seg.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2.5 text-sm font-semibold text-neutral-800"
                  >
                    <span className={`block w-1 h-5 rounded-full ${SEGMENT_BAR_COLOR[seg.color]}`} />
                    {seg.name}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 mb-3">
              Explore
            </p>
            <ul className="space-y-2 mb-8">
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
                    className="block py-2 text-sm font-semibold text-neutral-800"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="btn-accent w-full"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
