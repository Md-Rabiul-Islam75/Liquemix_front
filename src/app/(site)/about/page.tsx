import type { Metadata } from "next";
import Link from "next/link";
import {
  FiAward,
  FiCheckCircle,
  FiCompass,
  FiDroplet,
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

export const metadata: Metadata = {
  title: "About LiqueMix",
  description:
    "LiqueMix engineers construction-chemical systems for the toughest jobsites — from basement waterproofing to industrial flooring. Built in Bangladesh, trusted across Asia and the Middle East.",
};

const VALUES = [
  {
    icon: <FiTarget />,
    title: "Engineered, never improvised.",
    body: "Every product ships with full TDS, MSDS, and an application protocol. If it can't be specified by an engineer, it doesn't leave the lab.",
  },
  {
    icon: <FiShield />,
    title: "Systems over single products.",
    body: "We design complete build-ups — primer, membrane, finish — so layers work together by chemistry, not by chance.",
  },
  {
    icon: <FiHeart />,
    title: "Service is part of the product.",
    body: "On-site demonstrations, applicator training, and post-installation support — included with every project, not invoiced as extras.",
  },
  {
    icon: <FiTrendingUp />,
    title: "Lower-carbon by design.",
    body: "Calcined-clay binders, PCE chemistry, and water-reduction admixtures cut embodied carbon at the batching plant — without trading off strength.",
  },
];

const TIMELINE = [
  {
    year: "2012",
    title: "Founded in Dhaka",
    body: "Started as a two-person technical lab serving a handful of waterproofing contractors in the capital.",
  },
  {
    year: "2016",
    title: "First manufacturing line",
    body: "Commissioned a dedicated cementitious-slurry line and launched the first Lique-branded waterproofing system.",
  },
  {
    year: "2019",
    title: "Concrete admixture division",
    body: "Added PCE-based superplasticisers and retarders for the ready-mix concrete market, supporting major bridge and metro projects.",
  },
  {
    year: "2022",
    title: "Regional expansion",
    body: "Opened distribution into the Middle East and South-East Asia. Now serving projects in 40+ countries.",
  },
  {
    year: "2025",
    title: "Decarbonisation roadmap",
    body: "Joined a regional consortium targeting a 40% reduction in product-level embodied carbon by 2030.",
  },
];

const LEADERS = [
  {
    name: "Tanvir Rahman",
    role: "Managing Director",
    bio: "Chemical engineer with 18 years across construction chemistry. Founded LiqueMix in 2012.",
  },
  {
    name: "Dr. Fatima Hossain",
    role: "Head of R&D",
    bio: "PhD in cement chemistry from BUET. Leads the polymer-modified slurry and admixture platforms.",
  },
  {
    name: "Imran Karim",
    role: "Director, Technical Service",
    bio: "20-year veteran of large-scale waterproofing and grouting projects across South Asia.",
  },
  {
    name: "Nusrat Akter",
    role: "Director, Operations",
    bio: "Runs manufacturing, QA, and the supply chain. ISO 9001 lead auditor.",
  },
];

const CERTS = [
  { code: "ISO 9001:2015", body: "Quality management — recertified 2025." },
  { code: "EN 1504-3", body: "Structural concrete repair, R4 class." },
  { code: "EN 12004", body: "Adhesives for ceramic tiles — C2TE S1 class." },
  { code: "EN 934-2", body: "Admixtures for concrete, mortar, and grout." },
  { code: "NSF 61 (eq.)", body: "Suitability for potable water contact." },
  { code: "ASTM C309", body: "Concrete curing compounds." },
];

const SUSTAINABILITY = [
  {
    icon: <FiZap />,
    metric: "−18%",
    label: "Embodied CO₂ vs. 2020 baseline",
    body: "Lower-clinker binders and PCE-based water reduction across the concrete-technology range.",
  },
  {
    icon: <FiDroplet />,
    metric: "92%",
    label: "Process water recycled",
    body: "Closed-loop rinse and cooling system at the Dhaka plant.",
  },
  {
    icon: <FiPackage />,
    metric: "100%",
    label: "Recyclable packaging",
    body: "Mono-material bags and pails — every container can re-enter the recycling stream.",
  },
];

const ROLES_OPEN = [
  { title: "Senior R&D Chemist", location: "Dhaka", type: "Full-time" },
  { title: "Technical Service Engineer", location: "Chittagong", type: "Full-time" },
  { title: "Regional Sales Manager", location: "Dubai, UAE", type: "Full-time" },
  { title: "QA Lead", location: "Dhaka", type: "Full-time" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About LiqueMix"
        title="Construction chemistry, engineered for the real world."
        description="From a two-person lab in Dhaka to a regional construction-chemical brand — built around engineered systems, technical service, and a lower-carbon path."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        variant="dark"
      />

      {/* In-page nav (anchor links to each section).
          Non-sticky and visually glued to the bottom of the dark hero —
          the chips travel with the banner so they don't obscure section
          titles during scroll. The main site header at the very top stays
          sticky on its own. */}
      <nav className="relative bg-primary-800 text-white-base border-t border-white/15">
        {/* Brand accent stripe — ties the nav to the LiqueMix color triad */}
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
            <h2 className="section-title mt-3">
              Four principles that shape every product we ship.
            </h2>
            <p className="section-subtitle">
              These aren&apos;t slogans. They&apos;re the filters we use when we decide
              what to put on the truck, what to keep in the lab, and what to
              decline to sell.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="brand-panel p-6 md:p-7"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500 text-white-base text-xl mb-4 shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)]">
                  {v.icon}
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
            <h2 className="section-title mt-3">
              From a Dhaka lab to a regional brand.
            </h2>
            <p className="section-subtitle">
              Thirteen years of compounding incremental wins — better chemistry,
              better service, better packaging.
            </p>
          </div>

          {/* Timeline — flex layout with a dedicated badge column. Each
              badge sits naturally inside the container's left padding (no
              negative offsets) and the vertical connector line passes
              cleanly through the centre of every circle. */}
          <ol className="mt-12">
            {TIMELINE.map((t, i) => {
              const isLast = i === TIMELINE.length - 1;
              return (
                <li
                  key={t.year}
                  className={`relative flex gap-5 md:gap-6 ${isLast ? "" : "pb-10"}`}
                >
                  {/* Badge + connecting line column */}
                  <div className="relative shrink-0">
                    {/* Line: spans the full height of the badge column;
                        the badge sits on top of it via z-index, so visually
                        the line appears to thread through each circle. */}
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

                  {/* Content column */}
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
            <h2 className="section-title mt-3">
              The people who set the agenda.
            </h2>
            <p className="section-subtitle">
              A small leadership team — chemistry, engineering, and operations
              — that sits close to the lab and to the jobsite.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LEADERS.map((p) => (
              <article
                key={p.name}
                className="rounded-2xl border border-neutral-100 bg-white-base p-5 shadow-soft hover:shadow-primary hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-accent-100 via-accent-50 to-white flex items-center justify-center mb-4 overflow-hidden">
                  <span className="text-4xl font-bold text-accent-700">
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
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
              <h2 className="section-title mt-3">
                Certified at every step, audited every year.
              </h2>
              <p className="section-subtitle">
                Every batch leaves the plant only after release by QA against
                an ISO 9001-aligned procedure. Standards aren&apos;t a marketing
                line — they&apos;re a release condition.
              </p>
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
                {CERTS.map((c) => (
                  <div
                    key={c.code}
                    className="rounded-2xl border border-neutral-100 bg-white-base p-5 flex gap-4 shadow-soft"
                  >
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 text-xl shrink-0">
                      <FiAward />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        {c.code}
                      </p>
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
          <div className="rounded-3xl overflow-hidden relative p-8 md:p-14 text-white-base"
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
                Lower-carbon chemistry, measured in absolute terms.
              </h2>
              <p className="mt-4 text-base md:text-lg text-white/85 max-w-2xl">
                We don&apos;t market sustainability — we report it. Every product
                family carries a published embodied-carbon number, audited
                against the 2020 baseline.
              </p>
            </div>

            <div className="relative mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUSTAINABILITY.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/15"
                >
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 text-accent-300 text-xl mb-4">
                    {s.icon}
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
              <h2 className="section-title mt-3">
                Build construction chemistry with us.
              </h2>
              <p className="section-subtitle">
                We hire chemists, engineers, applicators, and field-trainers
                who like solving real problems on real jobsites — not slides
                in conference rooms.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="mailto:careers@liquemix.com"
                  className="btn-accent"
                >
                  <FiMail /> careers@liquemix.com
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { icon: <FiUsers />, kpi: "120+", label: "Team members" },
                  { icon: <FiCompass />, kpi: "40+", label: "Countries served" },
                  { icon: <FiLayers />, kpi: "13 yrs", label: "Operating" },
                ].map((m) => (
                  <div key={m.label}>
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-50 text-secondary-700 mb-2">
                      {m.icon}
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
                  {ROLES_OPEN.map((role) => (
                    <li key={role.title}>
                      <a
                        href="mailto:careers@liquemix.com?subject=Application: "
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
                Have a project? Talk to an engineer, not a sales rep.
              </h2>
              <p className="mt-3 text-white/85 max-w-xl">
                We respond within four business hours with a system
                recommendation, sample, or quotation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[10px] bg-white-base text-primary-700 font-semibold hover:bg-accent-50 transition-colors"
              >
                <FiCheckCircle /> Contact us
              </Link>
              <Link
                href="/products"
                className="btn-outline-light"
              >
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
