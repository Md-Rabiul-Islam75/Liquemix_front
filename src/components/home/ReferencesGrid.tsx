import Link from "next/link";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import { referenceProjects } from "@/data/references";

export default function ReferencesGrid() {
  const list = referenceProjects.slice(0, 6);

  return (
    <section className="section bg-neutral-900 text-white-base">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow !text-accent-400">
              <span className="block w-4 h-px bg-accent-400" /> Reference projects
            </span>
            <h2 className="section-title mt-3 text-white-base">
              Trusted on landmark projects.
            </h2>
            <p className="section-subtitle text-neutral-400">
              From metro stations to high-rise residences — see how LiqueMix
              systems perform on the ground.
            </p>
          </div>
          <Link
            href="/references"
            className="btn-outline-light shrink-0 !border-white/30 !text-white-base hover:!bg-white/10"
          >
            All references
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((ref, i) => {
            const gradients = [
              "linear-gradient(135deg, #072454 0%, #1565c0 100%)",
              "linear-gradient(135deg, #5c2e00 0%, #f57c00 100%)",
              "linear-gradient(135deg, #5c3e00 0%, #ffb300 100%)",
              "linear-gradient(135deg, #0e3d1a 0%, #2fa84f 100%)",
              "linear-gradient(135deg, #0a3674 0%, #3f88d6 100%)",
              "linear-gradient(135deg, #8a4500 0%, #fb8c25 100%)",
            ];
            return (
              <Link
                key={ref.id}
                href={`/references/${ref.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden flex flex-col justify-end"
                style={{ background: gradients[i % gradients.length] }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
                {/* fake topography line decoration */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 14px)",
                  }}
                />

                <div className="relative p-5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent-300">
                    <FiMapPin className="text-sm" /> {ref.location.city},{" "}
                    {ref.location.country}
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white-base leading-tight">
                    {ref.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-white/70">
                      {ref.projectType} · {ref.year}
                    </p>
                    <FiArrowUpRight className="text-xl text-accent-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
