import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { fetchSegments } from "@/data/segments";
import type { SegmentColor } from "@/types/Catalog";

const COLOR_CLASSES: Record<
  SegmentColor,
  { card: string; chipBar: string; accent: string }
> = {
  blue: {
    card: "from-primary-600 via-primary-500 to-primary-700",
    chipBar: "bg-accent-400",
    accent: "text-accent-300",
  },
  orange: {
    card: "from-secondary-600 via-secondary-500 to-secondary-700",
    chipBar: "bg-accent-400",
    accent: "text-accent-200",
  },
  yellow: {
    card: "from-accent-500 via-accent-400 to-accent-600",
    chipBar: "bg-primary-700",
    accent: "text-primary-900",
  },
  green: {
    card: "from-success-600 via-success-500 to-success-700",
    chipBar: "bg-accent-400",
    accent: "text-accent-200",
  },
};

export default async function SegmentsGrid() {
  const segments = await fetchSegments();
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow">
              <span className="block w-4 h-px bg-primary-500" /> Our segments
            </span>
            <h2 className="section-title mt-3">
              Four pillars of construction chemistry.
            </h2>
            <p className="section-subtitle">
              Every LiqueMix product belongs to one of four engineered families
              — color-coded across the catalog, the literature, and the
              packaging.
            </p>
          </div>
          <Link href="/products" className="btn-ghost shrink-0">
            View full catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {segments.map((seg, i) => {
            const c = COLOR_CLASSES[seg.color];
            const isLight = seg.color === "yellow";
            return (
              <Link
                key={seg.id}
                href={`/products/${seg.slug}`}
                className={`group card-segment bg-gradient-to-br ${c.card} ${
                  isLight ? "text-neutral-900" : "text-white-base"
                }`}
              >
                {/* Decorative ring */}
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 w-44 h-44 rounded-full border opacity-20"
                  style={{
                    borderColor: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute -right-20 -top-20 w-64 h-64 rounded-full border opacity-15"
                  style={{
                    borderColor: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)",
                  }}
                />

                <div className="relative">
                  <p
                    className={`text-xs font-bold tracking-[0.18em] uppercase ${
                      isLight ? "text-neutral-700" : "text-white/80"
                    }`}
                  >
                    0{i + 1} · Segment
                  </p>
                  <h3
                    className={`mt-3 text-2xl font-bold leading-tight ${
                      isLight ? "text-neutral-900" : "text-white-base"
                    }`}
                  >
                    {seg.name}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isLight ? "text-neutral-800" : "text-white/85"
                    }`}
                  >
                    {seg.tagline}
                  </p>
                </div>

                <div className="relative mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span>{seg.productCount} products</span>
                    <span className={`block w-1 h-1 rounded-full ${
                      isLight ? "bg-neutral-900/40" : "bg-white/40"
                    }`} />
                    <span>{seg.solutionCount} systems</span>
                  </div>
                  <span
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-transform group-hover:scale-110 ${
                      isLight ? "bg-neutral-900 text-white-base" : "bg-white-base text-neutral-900"
                    }`}
                  >
                    <FiArrowUpRight />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
