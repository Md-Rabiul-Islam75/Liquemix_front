import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import { referenceProjects } from "@/data/references";

export default function ReferencesGrid() {
  const list = referenceProjects.slice(0, 6);

  return (
    <section className="section bg-secondary-600 text-white-base">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow !text-primary-500">
              <span className="block w-4 h-px bg-primary-500" /> Reference projects
            </span>
            <h2 className="section-title mt-3 !text-white-base">
              Trusted on landmark projects.
            </h2>
            <p className="section-subtitle !text-white/90">
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
          {list.map((ref) => (
            <Link
              key={ref.id}
              href={`/references/${ref.slug}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden flex flex-col justify-end bg-neutral-800"
            >
              <Image
                src={encodeURI(ref.heroImage)}
                alt={ref.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

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
          ))}
        </div>
      </div>
    </section>
  );
}
