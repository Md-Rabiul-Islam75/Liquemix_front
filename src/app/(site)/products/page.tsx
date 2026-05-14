import Link from "next/link";
import type { Metadata } from "next";
import { FiArrowUpRight } from "react-icons/fi";
import PageHeader from "@/components/common/PageHeader";
import { segments } from "@/data/segments";
import { getRootCategoriesBySegment } from "@/data/categories";
import { getProductsBySegment } from "@/data/products";
import type { SegmentColor } from "@/types/Catalog";

export const metadata: Metadata = {
  title: "Products — Construction-chemical catalogue",
  description:
    "Browse the complete LiqueMix product catalogue across four engineered segments: waterproofing, tile installation, protective flooring, and concrete technology.",
};

const SEGMENT_BG: Record<SegmentColor, string> = {
  blue: "from-primary-700 to-primary-500",
  orange: "from-secondary-700 to-secondary-500",
  yellow: "from-accent-600 to-accent-400",
  green: "from-success-700 to-success-500",
};

const PANEL_VARIANT: Record<SegmentColor, string> = {
  blue: "brand-panel-blue",
  orange: "brand-panel-orange",
  yellow: "brand-panel-yellow",
  green: "brand-panel-green",
};

const SEGMENT_SHADOW: Record<SegmentColor, string> = {
  blue: "shadow-[var(--shadow-segment-blue)]",
  orange: "shadow-[var(--shadow-segment-orange)]",
  yellow: "shadow-[var(--shadow-segment-yellow)]",
  green: "shadow-[var(--shadow-segment-green)]",
};

export default function ProductsHomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Engineered for every layer of the build."
        description="Four segments, hundreds of products, complete technical documentation. Every product carries a TDS, MSDS, and a clear application area."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        variant="default"
      />

      <section className="section">
        <div className="container-page">
          <div className="space-y-8">
            {segments.map((seg, i) => {
              const cats = getRootCategoriesBySegment(seg.id);
              const products = getProductsBySegment(seg.id);
              const isLight = seg.color === "yellow";
              return (
                <div
                  key={seg.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                >
                  <Link
                    href={`/products/${seg.slug}`}
                    className={`lg:col-span-4 relative rounded-2xl overflow-hidden p-8 flex flex-col justify-between min-h-[260px] bg-gradient-to-br ${SEGMENT_BG[seg.color]} ${SEGMENT_SHADOW[seg.color]} ${
                      isLight ? "text-neutral-900" : "text-white-base"
                    }`}
                  >
                    <div
                      aria-hidden
                      className="absolute -right-12 -top-12 w-48 h-48 rounded-full border opacity-20"
                      style={{
                        borderColor: isLight
                          ? "rgba(0,0,0,0.4)"
                          : "rgba(255,255,255,0.6)",
                      }}
                    />
                    <div className="relative">
                      <span
                        className={`text-xs font-bold tracking-[0.18em] uppercase ${
                          isLight ? "text-neutral-700" : "text-white/80"
                        }`}
                      >
                        Segment 0{i + 1}
                      </span>
                      <h2 className="mt-2 text-3xl font-bold leading-tight">
                        {seg.name}
                      </h2>
                      <p
                        className={`mt-3 text-sm ${
                          isLight ? "text-neutral-800" : "text-white/85"
                        }`}
                      >
                        {seg.description}
                      </p>
                    </div>
                    <div className="relative flex items-center justify-between mt-6">
                      <span className="text-sm font-semibold">
                        {products.length} products · {seg.solutionCount} systems
                      </span>
                      <FiArrowUpRight className="text-2xl" />
                    </div>
                  </Link>

                  <div className={`lg:col-span-8 ${PANEL_VARIANT[seg.color]}`}>
                    <div className="p-6 md:p-7">
                      <div className="flex items-baseline justify-between mb-4">
                        <p className="brand-panel__eyebrow">Categories</p>
                        <span className="text-[11px] text-neutral-400">
                          {cats.length} categories
                        </span>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1">
                        {cats.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              href={`/products/${seg.slug}?category=${cat.slug}`}
                              className="group/cat brand-panel-item"
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <span className="brand-panel-dot" />
                                <span className="truncate">{cat.name}</span>
                              </span>
                              <FiArrowUpRight className="text-neutral-400 group-hover/cat:translate-x-0.5 group-hover/cat:-translate-y-0.5 transition-transform shrink-0" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
