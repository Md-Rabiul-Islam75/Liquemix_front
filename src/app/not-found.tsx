import type { Metadata } from "next";
import Link from "next/link";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCompass,
  FiDownload,
  FiHome,
  FiMessageCircle,
  FiSearch,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Page not found — LiqueMix",
  description:
    "The page you're looking for has moved, doesn't exist, or never did. Here's the way back.",
};

const QUICK_LINKS = [
  {
    href: "/products",
    icon: <FiCompass />,
    label: "Browse the catalog",
    hint: "All four product segments",
  },
  {
    href: "/solutions",
    icon: <FiArrowUpRight />,
    label: "System solutions",
    hint: "Engineered build-ups",
  },
  {
    href: "/references",
    icon: <FiArrowUpRight />,
    label: "Reference projects",
    hint: "Where LiqueMix is on the ground",
  },
  {
    href: "/service/downloads",
    icon: <FiDownload />,
    label: "Downloads",
    hint: "TDS, MSDS, brochures",
  },
];

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white-base min-h-[calc(100vh-9rem)]">
      {/* Brand wash backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 85% 30%, rgba(245,124,0,0.45) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 10% 90%, rgba(255,179,0,0.30) 0%, transparent 55%), linear-gradient(120deg, #072454 0%, #0a3674 35%, #0d4690 75%, #1565c0 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative container-page py-20 md:py-28 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left — the message */}
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-semibold tracking-[0.18em] uppercase text-accent-300">
            <span className="block w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            Error 404
          </span>

          {/* Big number — uses the brand gradient so it doesn't feel like
              a stock error page. */}
          <h1 className="mt-6 text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-bold leading-none tracking-tighter">
            <span className="brand-gradient-text">404</span>
          </h1>

          <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
            This page hasn&apos;t set yet.
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/75 max-w-xl text-balance">
            The URL you followed has moved, never existed, or is still being
            engineered in the lab. Pick a destination below — or talk to us
            directly.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/" className="btn-accent text-base">
              <FiHome /> Back to home
            </Link>
            <Link
              href="/products"
              className="btn-outline-light text-base"
            >
              <FiSearch /> Browse products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-12 px-5 rounded-[10px] text-white-base font-semibold hover:text-accent-300 transition-colors"
            >
              <FiMessageCircle /> Talk to an engineer
              <FiArrowRight className="text-sm" />
            </Link>
          </div>
        </div>

        {/* Right — quick-links card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/15 p-6 md:p-7 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
            {/* Brand stripe at top */}
            <span
              aria-hidden
              className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-primary-400 via-secondary-500 to-accent-500 rounded-t-2xl"
            />
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-accent-300">
              Most-visited
            </p>
            <h3 className="mt-1.5 text-xl font-bold leading-tight">
              Quick links to anywhere
            </h3>
            <ul className="mt-5 divide-y divide-white/10">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-4 py-3.5 hover:gap-5 transition-all"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-accent-300 text-lg shrink-0 group-hover:bg-white/20 transition-colors">
                      {item.icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold text-white-base group-hover:text-accent-300 transition-colors">
                        {item.label}
                      </span>
                      <span className="block text-xs text-white/60">
                        {item.hint}
                      </span>
                    </span>
                    <FiArrowUpRight className="text-white/40 group-hover:text-accent-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
