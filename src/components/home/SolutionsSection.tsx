import Link from "next/link";
import { FiArrowUpRight, FiLayers } from "react-icons/fi";
import { systemSolutions } from "@/data/solutions";
import { getSegmentById } from "@/data/segments";

export default function SolutionsSection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow">
              <span className="block w-4 h-px bg-accent-500" /> System solutions
            </span>
            <h2 className="section-title mt-3">
              We sell complete systems — not isolated products.
            </h2>
            <p className="section-subtitle">
              Each engineered solution maps multiple products to a real
              construction challenge, with full build-up and technical
              cross-section.
            </p>
          </div>
          <Link href="/solutions" className="btn-ghost shrink-0">
            All systems
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systemSolutions.map((sol, i) => {
            const segment = getSegmentById(sol.segmentId);
            return (
              <Link
                key={sol.id}
                href={`/solutions/${sol.slug}`}
                className="group relative flex flex-col rounded-2xl border border-neutral-100 bg-white-base overflow-hidden shadow-soft hover:shadow-primary hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visual */}
                <div className="relative h-56 overflow-hidden bg-neutral-100">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        i % 2 === 0
                          ? "linear-gradient(135deg, #072454 0%, #1565c0 50%, #3f88d6 100%)"
                          : i === 1
                          ? "linear-gradient(135deg, #5c2e00 0%, #f57c00 60%, #ffb300 100%)"
                          : "linear-gradient(135deg, #0e3d1a 0%, #1c6b31 60%, #2fa84f 100%)",
                    }}
                  />
                  {/* Layered lines representing the system build-up */}
                  <div className="absolute inset-x-8 bottom-6 space-y-2">
                    {sol.layers.slice(0, 4).map((layer, li) => (
                      <div
                        key={layer.order}
                        className="flex items-center gap-3 text-white-base text-xs font-semibold opacity-90"
                        style={{ opacity: 1 - li * 0.18 }}
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/15 backdrop-blur text-[10px]">
                          {layer.order}
                        </span>
                        <span className="line-clamp-1">{layer.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-[10px] font-semibold tracking-wider uppercase text-white-base">
                      <FiLayers className="text-xs" /> {sol.layers.length} layers
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500">
                    {segment?.name}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-neutral-900 leading-tight group-hover:text-primary-600 transition-colors">
                    {sol.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                    {sol.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <p className="text-xs text-neutral-500">
                      {sol.productIds.length} products in this system
                    </p>
                    <FiArrowUpRight className="text-lg text-primary-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
