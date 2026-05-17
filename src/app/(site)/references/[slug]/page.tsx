import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowUpRight,
  FiMapPin,
  FiCalendar,
  FiMaximize2,
  FiUser,
  FiHome,
  FiExternalLink,
  FiMail,
} from "react-icons/fi";

import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/product/ProductCard";

import { referenceProjects, getReferenceBySlug } from "@/data/references";
import { products } from "@/data/products";
import { getSegmentById } from "@/data/segments";
import type { SegmentColor } from "@/types/Catalog";

const PANEL_VARIANT: Record<SegmentColor, string> = {
  blue: "brand-panel-blue",
  orange: "brand-panel-orange",
  yellow: "brand-panel-yellow",
  green: "brand-panel-green",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return referenceProjects.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ref = getReferenceBySlug(slug);
  if (!ref) return { title: "Not found" };
  return {
    title: ref.title,
    description: `${ref.projectType} in ${ref.location.city}, ${ref.location.country} (${ref.year}). ${ref.challenge.slice(0, 120)}…`,
  };
}

export default async function ReferenceDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getReferenceBySlug(slug);
  if (!project) notFound();

  const usedProducts = project.productsUsed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // Pick a hero gradient based on the first product's segment
  const firstSegment = usedProducts[0]
    ? getSegmentById(usedProducts[0].segmentId)
    : null;
  const heroBg =
    firstSegment?.color === "orange"
      ? "linear-gradient(135deg, #5c2e00 0%, #f57c00 100%)"
      : firstSegment?.color === "yellow"
      ? "linear-gradient(135deg, #5c3e00 0%, #ffb300 100%)"
      : firstSegment?.color === "green"
      ? "linear-gradient(135deg, #0e3d1a 0%, #2fa84f 100%)"
      : "linear-gradient(135deg, #072454 0%, #1565c0 100%)";

  const otherReferences = referenceProjects
    .filter((r) => r.id !== project.id)
    .slice(0, 3);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "References", href: "/references" },
          { label: project.title },
        ]}
        eyebrow={project.projectType}
        title={project.title}
        description={`${project.location.city}, ${project.location.country} · ${project.year}`}
      />

      {/* Hero */}
      <section className="bg-white-base">
        <div className="container-page py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Key facts */}
          <aside className="lg:col-span-4">
            <div
              className={`${firstSegment ? PANEL_VARIANT[firstSegment.color] : "brand-panel"} p-6 md:p-7`}
            >
              <p className="brand-panel__eyebrow mb-4">Key facts</p>
              <h2 className="sr-only">Key facts</h2>
              <dl className="space-y-4 text-sm">
                <KeyFact
                  icon={<FiHome />}
                  label="Type of installation"
                  value={project.projectType}
                />
                <KeyFact
                  icon={<FiMapPin />}
                  label="Location"
                  value={`${project.location.city}, ${project.location.country}`}
                />
                <KeyFact
                  icon={<FiCalendar />}
                  label="Completion date"
                  value={String(project.year)}
                />
                {project.objectSize && (
                  <KeyFact
                    icon={<FiMaximize2 />}
                    label="Object size"
                    value={project.objectSize}
                  />
                )}
              </dl>

              {usedProducts.length > 0 && (
                <div className="mt-6 pt-6 border-t border-primary-100/50">
                  <p className="brand-panel__eyebrow mb-3">Products used</p>
                  <ul className="space-y-1.5">
                    {usedProducts.map((p) => {
                      const seg = getSegmentById(p.segmentId);
                      return (
                        <li key={p.id}>
                          <Link
                            href={`/products/${seg?.slug}/${p.slug}`}
                            className="flex items-center justify-between gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold"
                          >
                            <span>{p.name}</span>
                            <FiArrowUpRight />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {(project.applicator || project.architect) && (
                <div className="mt-6 pt-6 border-t border-primary-100/50 space-y-4">
                  {project.applicator && (
                    <PartyCard
                      label="Applicator"
                      name={project.applicator.name}
                      website={project.applicator.website}
                      email={project.applicator.email}
                    />
                  )}
                  {project.architect && (
                    <PartyCard
                      label="Architect"
                      name={project.architect.name}
                      website={project.architect.website}
                      email={project.architect.email}
                    />
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Hero image + narrative */}
          <div className="lg:col-span-8 space-y-6">
            <div
              className="relative aspect-[16/10] rounded-3xl overflow-hidden"
              style={{ background: heroBg }}
            >
              <Image
                src={encodeURI(project.heroImage)}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/85 via-neutral-900/30 to-transparent" />
              <div className="absolute inset-x-8 bottom-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] font-bold tracking-wider uppercase text-white-base">
                  {firstSegment?.name ?? "Project"}
                </span>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white-base max-w-2xl">
                  {project.title}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-neutral-500 mb-2">
                  Challenge
                </p>
                <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
                  {project.challenge}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-neutral-500 mb-2">
                  LiqueMix Solution
                </p>
                <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products used (cards) */}
      {usedProducts.length > 0 && (
        <section className="section pt-0">
          <div className="container-page">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
              Specified products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {usedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other references */}
      {otherReferences.length > 0 && (
        <section className="section pt-0 bg-neutral-50">
          <div className="container-page">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
                Other recent projects
              </h2>
              <Link
                href="/references"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                All references →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {otherReferences.map((r) => (
                <Link
                  key={r.id}
                  href={`/references/${r.slug}`}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden flex flex-col justify-end bg-neutral-800"
                >
                  <Image
                    src={encodeURI(r.heroImage)}
                    alt={r.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                  <div className="relative p-5">
                    <p className="text-[11px] uppercase tracking-wider text-accent-300">
                      {r.location.city}, {r.location.country}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-white-base leading-tight">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function KeyFact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
        <span className="text-primary-500">{icon}</span> {label}
      </dt>
      <dd className="text-sm font-semibold text-neutral-900">{value}</dd>
    </div>
  );
}

function PartyCard({
  label,
  name,
  website,
  email,
}: {
  label: string;
  name: string;
  website?: string;
  email?: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
        <FiUser className="text-primary-500" /> {label}
      </p>
      <p className="text-sm font-semibold text-neutral-900">{name}</p>
      <div className="mt-1 flex flex-col gap-1 text-xs">
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700"
          >
            <FiExternalLink className="text-[11px]" /> {website.replace(/^https?:\/\//, "")}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700"
          >
            <FiMail className="text-[11px]" /> {email}
          </a>
        )}
      </div>
    </div>
  );
}
