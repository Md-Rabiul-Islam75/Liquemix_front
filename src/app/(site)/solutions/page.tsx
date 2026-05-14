import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowUpRight, FiLayers } from "react-icons/fi";
import PageHeader from "@/components/common/PageHeader";
import { systemSolutions } from "@/data/solutions";
import { segments } from "@/data/segments";

export const metadata: Metadata = {
  title: "System Solutions",
  description:
    "Engineered multi-product systems for waterproofing, flooring, concrete repair, and tile installation. Each system maps real products to a real construction challenge.",
};

export default function SolutionsIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="System Solutions"
        title="Engineered systems — not isolated products."
        description="Every LiqueMix system pairs the right products in the right sequence, with technical cross-sections and applicator-grade documentation."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "System Solutions" },
        ]}
      />

      <section className="section pt-10">
        <div className="container-page">
          {/* Filter strip by segment */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <span className="text-xs font-bold tracking-wider uppercase text-neutral-500 mr-2">
              Browse by segment
            </span>
            {segments.map((seg) => (
              <Link
                key={seg.id}
                href={`#${seg.slug}`}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-white-base border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-600 transition-colors"
              >
                {seg.name}
              </Link>
            ))}
          </div>

          <div className="space-y-12">
            {segments.map((seg) => {
              const list = systemSolutions.filter(
                (s) => s.segmentId === seg.id
              );
              if (!list.length) return null;
              return (
                <div key={seg.id} id={seg.slug}>
                  <div className="flex items-baseline justify-between mb-5">
                    <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
                      {seg.name}
                    </h2>
                    <Link
                      href={`/products/${seg.slug}`}
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                    >
                      View products →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {list.map((sol, i) => (
                      <Link
                        key={sol.id}
                        href={`/solutions/${sol.slug}`}
                        className="group relative flex flex-col rounded-2xl border border-neutral-100 bg-white-base overflow-hidden shadow-soft hover:shadow-primary hover:-translate-y-1 transition-all duration-300"
                      >
                        <div
                          className="relative h-44 overflow-hidden"
                          style={{
                            background:
                              i % 3 === 0
                                ? "linear-gradient(135deg, #072454 0%, #1565c0 100%)"
                                : i % 3 === 1
                                ? "linear-gradient(135deg, #5c2e00 0%, #f57c00 100%)"
                                : "linear-gradient(135deg, #0e3d1a 0%, #2fa84f 100%)",
                          }}
                        >
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-[10px] font-semibold tracking-wider uppercase text-white-base">
                              <FiLayers /> {sol.layers.length} layers
                            </span>
                          </div>
                          <div className="absolute inset-x-6 bottom-4 space-y-1.5">
                            {sol.layers.slice(0, 3).map((layer, li) => (
                              <div
                                key={layer.order}
                                className="flex items-center gap-2 text-white-base text-[11px] font-semibold"
                                style={{ opacity: 1 - li * 0.2 }}
                              >
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/15 text-[9px]">
                                  {layer.order}
                                </span>
                                <span className="line-clamp-1">{layer.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-base font-bold text-neutral-900 leading-tight group-hover:text-primary-600">
                            {sol.name}
                          </h3>
                          <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">
                            {sol.description}
                          </p>
                          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                            <span>{sol.productIds.length} products</span>
                            <FiArrowUpRight className="text-base text-primary-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
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
