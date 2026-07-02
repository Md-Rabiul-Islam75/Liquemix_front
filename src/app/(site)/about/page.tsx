import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  FiActivity,
  FiAward,
  FiCheckCircle,
  FiCompass,
  FiDroplet,
  FiGlobe,
  FiHeart,
  FiLayers,
  FiMail,
  FiPackage,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
  FiArrowUpRight,
  FiArrowRight,
} from "react-icons/fi";
import PageHeader from "@/components/common/PageHeader";
import { fetchAbout } from "@/data/about";

// Icon-key → component map. Admin stores a key string (see ABOUT_ICON_KEYS
// in data/about.ts); we resolve it here. Unknown keys fall back gracefully.
const ICONS: Record<string, ReactNode> = {
  target: <FiTarget />,
  shield: <FiShield />,
  heart: <FiHeart />,
  "trending-up": <FiTrendingUp />,
  zap: <FiZap />,
  droplet: <FiDroplet />,
  package: <FiPackage />,
  users: <FiUsers />,
  compass: <FiCompass />,
  layers: <FiLayers />,
  award: <FiAward />,
  "check-circle": <FiCheckCircle />,
  globe: <FiGlobe />,
  activity: <FiActivity />,
};
const icon = (key: string): ReactNode => ICONS[key] ?? <FiCheckCircle />;

export async function generateMetadata(): Promise<Metadata> {
  const about = await fetchAbout();
  return {
    title: about.metaTitle,
    description: about.metaDescription,
  };
}

export default async function AboutPage() {
  const about = await fetchAbout();

  return (
    <>
      <PageHeader
        eyebrow={about.heroEyebrow}
        title={about.heroTitle}
        description={about.heroDescription}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        variant="dark"
      />

      {/* In-page nav (anchor links to each section). */}
      <nav className="relative bg-primary-800 text-white-base border-t border-white/15">
        <span
          aria-hidden
          className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-primary-400 via-secondary-500 to-accent-500"
        />
        <div className="container-page flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 text-sm font-semibold">
          {[
            ["values", "Corporate Values"],
            ["story", "Our Story"],
            ["management", "Management"],
            ["quality", "Quality"],
            ["sustainability", "Sustainability"],
            ["careers", "Careers"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-white/80 hover:text-accent-300 hover:bg-white/10 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* Values */}
      <section id="values" className="section scroll-mt-24 md:scroll-mt-32">
        <div className="container-page">
          <div className="max-w-3xl">
            <span className="eyebrow">
              <span className="block w-4 h-px bg-primary-500" /> Corporate Values
            </span>
            <h2 className="section-title mt-3">{about.valuesHeading}</h2>
            <p className="section-subtitle">{about.valuesSubtitle}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {about.values.map((v, i) => (
              <div key={`${v.title}-${i}`} className="brand-panel p-6 md:p-7">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500 text-white-base text-xl mb-4 shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)]">
                  {icon(v.icon)}
                </span>
                <h3 className="text-xl font-bold text-neutral-900">{v.title}</h3>
                <p className="mt-2 text-sm md:text-base text-neutral-600 leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Timeline */}
      <section id="story" className="section pt-0 scroll-mt-24 md:scroll-mt-32">
        <div className="container-page">
          <div className="max-w-3xl">
            <span className="eyebrow !text-secondary-600">
              <span className="block w-4 h-px bg-secondary-500" /> Our Story
            </span>
            <h2 className="section-title mt-3">{about.storyHeading}</h2>
            <p className="section-subtitle">{about.storySubtitle}</p>
          </div>

          <ol className="mt-12">
            {about.timeline.map((t, i) => {
              const isLast = i === about.timeline.length - 1;
              return (
                <li
                  key={`${t.year}-${i}`}
                  className={`relative flex gap-5 md:gap-6 ${isLast ? "" : "pb-10"}`}
                >
                  <div className="relative shrink-0">
                    {!isLast && (
                      <span
                        aria-hidden
                        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-secondary-200"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-500 text-white-base text-xs font-bold shadow-[0_8px_24px_-8px_rgba(245,124,0,0.45)]">
                      {t.year}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-2.5">
                    <h3 className="text-lg md:text-xl font-bold text-neutral-900">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-sm md:text-base text-neutral-600 max-w-2xl leading-relaxed">
                      {t.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Management */}
      <section id="management" className="section pt-0 scroll-mt-24 md:scroll-mt-32">
        <div className="container-page">
          <div className="max-w-3xl">
            <span className="eyebrow !text-accent-700">
              <span className="block w-4 h-px bg-accent-500" /> Management
            </span>
            <h2 className="section-title mt-3">{about.managementHeading}</h2>
            <p className="section-subtitle">{about.managementSubtitle}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {about.leaders.map((p, i) => (
              <article
                key={`${p.name}-${i}`}
                className="rounded-2xl border border-neutral-100 bg-white-base p-5 shadow-soft hover:shadow-primary hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-accent-100 via-accent-50 to-white flex items-center justify-center mb-4 overflow-hidden">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-accent-700">
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-neutral-900 leading-tight">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
                  {p.role}
                </p>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {p.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Quality */}
      <section id="quality" className="section pt-0 scroll-mt-24 md:scroll-mt-32">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <span className="eyebrow">
                <span className="block w-4 h-px bg-primary-500" /> Quality
              </span>
              <h2 className="section-title mt-3">{about.qualityHeading}</h2>
              <p className="section-subtitle">{about.qualitySubtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/service/downloads" className="btn-primary">
                  Download datasheets <FiArrowRight />
                </Link>
                <Link href="/contact" className="btn-ghost">
                  Talk to QA
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {about.certs.map((c, i) => (
                  <div
                    key={`${c.code}-${i}`}
                    className="rounded-2xl border border-neutral-100 bg-white-base p-5 flex gap-4 shadow-soft"
                  >
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 text-xl shrink-0">
                      <FiAward />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{c.code}</p>
                      <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                        {c.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section id="sustainability" className="section pt-0 scroll-mt-24 md:scroll-mt-32">
        <div className="container-page">
          <div
            className="rounded-3xl overflow-hidden relative p-8 md:p-14 text-white-base"
            style={{
              background:
                "linear-gradient(135deg, #0e3d1a 0%, #1c6b31 50%, #2fa84f 100%)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                <span className="block w-4 h-px bg-accent-400" /> Sustainability
              </span>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-balance">
                {about.sustainabilityHeading}
              </h2>
              <p className="mt-4 text-base md:text-lg text-white/85 max-w-2xl">
                {about.sustainabilityBody}
              </p>
            </div>

            <div className="relative mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {about.sustainability.map((s, i) => (
                <div
                  key={`${s.label}-${i}`}
                  className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/15"
                >
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 text-accent-300 text-xl mb-4">
                    {icon(s.icon)}
                  </span>
                  <p className="text-4xl font-bold leading-none">{s.metric}</p>
                  <p className="mt-2 text-sm font-semibold text-accent-300 uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="section pt-0 scroll-mt-24 md:scroll-mt-32">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <span className="eyebrow !text-secondary-600">
                <span className="block w-4 h-px bg-secondary-500" /> Careers
              </span>
              <h2 className="section-title mt-3">{about.careersHeading}</h2>
              <p className="section-subtitle">{about.careersSubtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${about.careersEmail}`} className="btn-accent">
                  <FiMail /> {about.careersEmail}
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                {about.careerStats.map((m, i) => (
                  <div key={`${m.label}-${i}`}>
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-50 text-secondary-700 mb-2">
                      {icon(m.icon)}
                    </span>
                    <p className="text-2xl font-bold text-neutral-900">{m.kpi}</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="brand-panel-orange p-2">
                <ul className="divide-y divide-secondary-100/50">
                  {about.careerRoles.map((role, i) => (
                    <li key={`${role.title}-${i}`}>
                      <a
                        href={`mailto:${about.careersEmail}?subject=Application: ${encodeURIComponent(
                          role.title
                        )}`}
                        className="group flex items-center justify-between gap-4 p-5 hover:bg-secondary-50/40 rounded-xl transition-colors"
                      >
                        <div>
                          <p className="text-base font-bold text-neutral-900 group-hover:text-secondary-700">
                            {role.title}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500 uppercase tracking-wider">
                            {role.location} · {role.type}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary-700 group-hover:gap-2 transition-all">
                          Apply <FiArrowUpRight />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section pt-0">
        <div className="container-page">
          <div className="rounded-3xl brand-gradient text-white-base p-8 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                {about.ctaHeading}
              </h2>
              <p className="mt-3 text-white/85 max-w-xl">{about.ctaBody}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[10px] bg-white-base text-primary-700 font-semibold hover:bg-accent-50 transition-colors"
              >
                <FiCheckCircle /> Contact us
              </Link>
              <Link href="/products" className="btn-outline-light">
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
