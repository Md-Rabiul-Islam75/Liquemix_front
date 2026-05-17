import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiArrowUpRight, FiPlay } from "react-icons/fi";
import { getProductBySlug } from "@/data/products";
import { getSegmentById } from "@/data/segments";

export default function Hero() {
  const hydroGuard = getProductBySlug("lique-hydro-guard-3x");
  const fixMt3 = getProductBySlug("lique-fix-mt-3");
  const hydroImage = hydroGuard?.images.find((i) => i.isPrimary) ?? hydroGuard?.images[0];
  const fixImage = fixMt3?.images.find((i) => i.isPrimary) ?? fixMt3?.images[0];
  const hydroSegment = hydroGuard ? getSegmentById(hydroGuard.segmentId) : null;
  const fixSegment = fixMt3 ? getSegmentById(fixMt3.segmentId) : null;
  const hydroHref =
    hydroGuard && hydroSegment
      ? `/products/${hydroSegment.slug}/${hydroGuard.slug}`
      : "/products";
  const fixHref =
    fixMt3 && fixSegment
      ? `/products/${fixSegment.slug}/${fixMt3.slug}`
      : "/products";

  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white-base">
      {/* Decorative brand swirl */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 85% 30%, rgba(245,124,0,0.55) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 10% 90%, rgba(255,179,0,0.35) 0%, transparent 55%), linear-gradient(120deg, #072454 0%, #0a3674 35%, #0d4690 75%, #1565c0 100%)",
        }}
      />

      {/* Subtle grid */}
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
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-semibold tracking-[0.18em] uppercase text-accent-300">
            <span className="block w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            Construction Chemicals · Engineered Systems
          </span>

          <h1 className="mt-5 sm:mt-6 text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-balance">
            Build on{" "}
            <span className="relative inline-block">
              <span className="brand-gradient-text">simple systems.</span>
            </span>
            <br />
            <span className="text-white/90">Engineered for the real world.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/75 max-w-2xl text-balance">
            From basement waterproofing to industrial flooring — LiqueMix
            delivers complete engineered systems with full technical
            documentation, applicator support, and a guaranteed service life.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/products" className="btn-accent text-base">
              Explore Products <FiArrowRight />
            </Link>
            <Link href="/solutions" className="btn-outline-light text-base">
              <FiPlay /> Watch Systems
            </Link>
          </div>

          <div className="mt-10 md:mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl">
            {[
              { kpi: "200+", label: "Products" },
              { kpi: "40+", label: "Countries served" },
              { kpi: "1500+", label: "Reference projects" },
            ].map((m) => (
              <div key={m.label} className="border-l-2 border-accent-400 pl-2 sm:pl-3">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold leading-none">{m.kpi}</p>
                <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-white/65 leading-tight">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual — Hydro-Guard card sits large and offset left; the
            smaller Fix MT-3 card overlaps from the bottom-right. Both
            cards are clickable. Soft brand-colored glows sit behind each
            card to lift them off the dark hero background. */}
        <div className="hidden sm:block lg:col-span-5 relative">
          <div className="relative aspect-square max-w-[600px] mx-auto">
            {/* Decorative rings — kept subtle behind the cards */}
            <div className="absolute inset-0 rounded-full border border-white/15 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-6 rounded-full border border-white/10 animate-[spin_90s_linear_infinite_reverse]" />

            {/* Soft brand glows — blurred radial blobs positioned behind
                each card so the white cards look like they're floating on
                a brand-tinted halo. */}
            <div
              aria-hidden
              className="absolute -left-8 top-4 w-[70%] aspect-square rounded-full blur-3xl opacity-50"
              style={{
                background:
                  "radial-gradient(circle, rgba(21,101,192,0.55) 0%, transparent 65%)",
              }}
            />
            <div
              aria-hidden
              className="absolute -right-6 bottom-0 w-[55%] aspect-square rounded-full blur-3xl opacity-55"
              style={{
                background:
                  "radial-gradient(circle, rgba(245,124,0,0.55) 0%, transparent 65%)",
              }}
            />

            {/* Product cards */}
            <div className="absolute inset-0">
              {/* ── Primary card — Hydro-Guard 3X ────────────────────── */}
              <Link
                href={hydroHref}
                aria-label="View Lique Hydro-Guard 3X"
                className="group absolute left-0 top-1/2 -translate-y-[55%] w-[82%] aspect-[3/4] rounded-3xl bg-white-base shadow-[0_30px_60px_-20px_rgba(7,36,84,0.55)] rotate-[-3deg] hover:rotate-[-1deg] hover:-translate-y-[58%] transition-all duration-500 overflow-hidden ring-1 ring-white/40"
              >
                {/* Brand stripe at top */}
                <span
                  aria-hidden
                  className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-primary-700 via-primary-500 to-secondary-500 z-10"
                />
                {/* Very soft brand wash */}
                <div className="absolute inset-0 brand-gradient opacity-[0.08]" />
                {/* Subtle pinstripe pattern in the upper-right corner */}
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 w-48 h-48 rounded-full border-2 border-primary-100"
                />

                <div className="relative p-7 h-full flex flex-col">
                  {/* Top row — NEW badge */}
                  <div className="flex items-start justify-between">
                    <span className="chip-new shadow-[0_8px_20px_-8px_rgba(245,124,0,0.6)]">
                      NEW
                    </span>
                  </div>

                  {/* Heading */}
                  <div className="mt-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary-700">
                      Waterproofing
                    </p>
                    <h3 className="mt-1.5 text-[1.75rem] leading-[1.05] font-bold text-neutral-900 tracking-tight">
                      Hydro-Guard 3X
                    </h3>
                  </div>

                  {/* Product image — large, dominant */}
                  <div className="relative mt-5 flex-1 rounded-2xl bg-gradient-to-br from-primary-50 via-white-base to-secondary-50/70 overflow-hidden ring-1 ring-primary-100/60">
                    {/* Subtle radial spot behind the bag */}
                    <div
                      aria-hidden
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(21,101,192,0.10) 0%, transparent 70%)",
                      }}
                    />
                    {hydroImage && (
                      <Image
                        src={encodeURI(hydroImage.url)}
                        alt={hydroImage.alt}
                        fill
                        sizes="(min-width: 1024px) 400px, 320px"
                        className="object-contain p-4 drop-shadow-[0_12px_18px_rgba(7,36,84,0.18)] transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    )}
                  </div>

                  {/* Footer row — spec chip + arrow */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold tracking-wider uppercase">
                      ≥ 7 bar pressure
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 group-hover:gap-2 transition-all">
                      View product <FiArrowUpRight className="text-base" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* ── Secondary card — Fix MT-3 ────────────────────────── */}
              <Link
                href={fixHref}
                aria-label="View Lique Fix MT-3"
                className="group absolute right-0 bottom-2 w-[48%] aspect-[3/4] rounded-2xl bg-white-base shadow-[0_24px_50px_-18px_rgba(245,124,0,0.55)] rotate-[6deg] hover:rotate-[3deg] hover:-translate-y-1 transition-all duration-500 overflow-hidden ring-1 ring-white/50"
              >
                {/* Brand stripe at top — orange family */}
                <span
                  aria-hidden
                  className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-secondary-700 via-secondary-500 to-accent-500 z-10"
                />
                {/* Soft tile-segment background wash */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-50 via-white-base to-accent-50/80" />

                {/* Product image — fills the card */}
                {fixImage && (
                  <Image
                    src={encodeURI(fixImage.url)}
                    alt={fixImage.alt}
                    fill
                    sizes="(min-width: 1024px) 240px, 200px"
                    className="object-contain p-4 drop-shadow-[0_12px_18px_rgba(245,124,0,0.18)] transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                )}

                {/* Top-right TOP chip + bottom title overlay */}
                <div className="relative p-4 h-full flex flex-col justify-between pointer-events-none">
                  <span className="chip-featured w-fit shadow-[0_8px_20px_-8px_rgba(255,179,0,0.7)]">
                    ★ TOP
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-secondary-700">
                      Tile
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-neutral-900 leading-tight">
                      Fix MT-3
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom segment band — Schomburg-inspired but modernized */}
      <div className="relative">
        <div className="container-page">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-t-2xl overflow-hidden -mb-px">
            {[
              { label: "Waterproofing & Restoration", color: "bg-primary-500" },
              { label: "Tile · Natural Stone · Screed", color: "bg-secondary-500" },
              { label: "Protective Flooring & Coatings", color: "bg-accent-500" },
              { label: "Concrete Technology", color: "bg-success-500" },
            ].map((s) => (
              <Link
                key={s.label}
                href="/products"
                className="group relative bg-neutral-900/80 backdrop-blur px-5 py-5 flex items-center justify-between hover:bg-neutral-900 transition-colors"
              >
                <span className={`absolute left-0 top-0 bottom-0 w-1 ${s.color}`} />
                <span className="text-sm font-semibold pl-2 leading-snug">
                  {s.label}
                </span>
                <FiArrowRight className="text-white/60 group-hover:text-accent-400 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
