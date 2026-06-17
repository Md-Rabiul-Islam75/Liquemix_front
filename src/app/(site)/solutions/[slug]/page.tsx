import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowUpRight, FiMessageCircle, FiFile, FiCheck, FiMapPin } from "react-icons/fi";

import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/product/ProductCard";

import {
  systemSolutions,
  fetchSystemSolutions,
  fetchSolutionBySlug,
} from "@/data/solutions";
import { fetchSegmentsMap } from "@/data/segments";
import { products, getProductBySlug } from "@/data/products";
import { referenceProjects } from "@/data/references";
import type { SegmentColor } from "@/types/Catalog";

const PANEL_VARIANT: Record<SegmentColor, string> = {
  blue: "brand-panel-blue",
  orange: "brand-panel-orange",
  yellow: "brand-panel-yellow",
  green: "brand-panel-green",
};

/**
 * Per-segment styling for the hero layer ladder. Replaces generic white
 * with brand-tinted badges + text so each system instantly reads as
 * belonging to its segment. Tints are saturated enough to survive on top
 * of a product photo when a hero image is set.
 */
const LADDER_STYLE: Record<
  SegmentColor,
  { badgeBg: string; badgeText: string; nameText: string; gradient: string }
> = {
  blue: {
    badgeBg: "bg-primary-500",
    badgeText: "text-white-base",
    nameText: "text-primary-100",
    gradient:
      "linear-gradient(to top, rgba(7,36,84,0.92) 0%, rgba(7,36,84,0.55) 55%, transparent 100%)",
  },
  orange: {
    badgeBg: "bg-secondary-500",
    badgeText: "text-white-base",
    nameText: "text-secondary-100",
    gradient:
      "linear-gradient(to top, rgba(92,46,0,0.92) 0%, rgba(92,46,0,0.55) 55%, transparent 100%)",
  },
  yellow: {
    badgeBg: "bg-accent-500",
    badgeText: "text-neutral-900",
    nameText: "text-accent-100",
    gradient:
      "linear-gradient(to top, rgba(92,62,0,0.92) 0%, rgba(92,62,0,0.55) 55%, transparent 100%)",
  },
  green: {
    badgeBg: "bg-success-500",
    badgeText: "text-white-base",
    nameText: "text-success-50",
    gradient:
      "linear-gradient(to top, rgba(14,61,26,0.92) 0%, rgba(14,61,26,0.55) 55%, transparent 100%)",
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Build-time static params come from the seeded mock; live-only slugs
  // still work at request time because dynamicParams defaults to true.
  return systemSolutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sol = await fetchSolutionBySlug(slug);
  if (!sol) return { title: "Not found" };
  return {
    title: sol.name,
    description: sol.description,
  };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const [solution, segMap, allSolutions] = await Promise.all([
    fetchSolutionBySlug(slug),
    fetchSegmentsMap(),
    fetchSystemSolutions(),
  ]);
  if (!solution) notFound();

  const segment = segMap.get(String(solution.segmentId));
  const productList = solution.productIds
    .map((id) => products.find((p) => String(p.id) === String(id)))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const usedInProjects = referenceProjects.filter((r) =>
    solution.productIds.some((pid) =>
      r.productsUsed.some((rpid) => String(rpid) === String(pid))
    )
  );

  const otherSolutions = allSolutions
    .filter(
      (s) =>
        String(s.id) !== String(solution.id) &&
        String(s.segmentId) === String(solution.segmentId)
    )
    .slice(0, 3);

  const downloads = solution.downloads ?? [];

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "System Solutions", href: "/solutions" },
          ...(segment
            ? [{ label: segment.name, href: `/products/${segment.slug}` }]
            : []),
          { label: solution.name },
        ]}
        eyebrow={`System Solution · ${segment?.name ?? ""}`}
        title={solution.name}
        description={solution.description}
      >
        <Link
          href={`/contact?solution=${encodeURIComponent(solution.slug)}`}
          className="btn-accent"
        >
          <FiMessageCircle /> Get this system specified
        </Link>
      </PageHeader>

      {/* Hero band: visual + applications */}
      <section className="bg-white-base">
        <div className="container-page py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/3]"
              style={{
                background:
                  segment?.color === "blue"
                    ? "linear-gradient(135deg, #072454 0%, #1565c0 100%)"
                    : segment?.color === "orange"
                    ? "linear-gradient(135deg, #5c2e00 0%, #f57c00 100%)"
                    : segment?.color === "yellow"
                    ? "linear-gradient(135deg, #5c3e00 0%, #ffb300 100%)"
                    : "linear-gradient(135deg, #0e3d1a 0%, #2fa84f 100%)",
              }}
            >
              {/* If a hero image is set, paint it across the whole panel
                  (the gradient stays underneath as a fallback while the
                  image loads, and shows through if the image fails). */}
              {solution.heroImage && (
                <img
                  src={solution.heroImage}
                  alt={solution.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              {/* Diagonal hatch overlay — only when there is no photo,
                  so the brand pattern isn't distracting on top of a real
                  product shot. */}
              {!solution.heroImage && (
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 18px)",
                  }}
                />
              )}

              {/* Bottom-anchored brand-toned gradient — gives the layer
                  ladder legibility against either the brand background
                  OR a busy product photo. Only applied when there's a
                  hero image; without one, the existing brand gradient
                  already provides the contrast. */}
              {solution.heroImage && segment && (
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/3"
                  style={{ background: LADDER_STYLE[segment.color].gradient }}
                />
              )}

              <div className="absolute inset-x-10 bottom-10 space-y-3">
                {solution.layers.map((layer, li) => {
                  const tone = segment
                    ? LADDER_STYLE[segment.color]
                    : LADDER_STYLE.blue;
                  return (
                    <div
                      key={layer.order}
                      className="flex items-center gap-3"
                      style={{ opacity: 1 - li * 0.1 }}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shadow-[0_4px_12px_-4px_rgba(0,0,0,0.4)] ${tone.badgeBg} ${tone.badgeText}`}
                      >
                        {layer.order}
                      </span>
                      <span
                        className={`text-sm md:text-base font-semibold ${tone.nameText}`}
                      >
                        {layer.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              className={`${segment ? PANEL_VARIANT[segment.color] : "brand-panel"} p-6 md:p-7`}
            >
              <p className="brand-panel__eyebrow mb-3">Areas of application</p>
              <ul className="space-y-2.5">
                {solution.applicationAreas.map((a, i) => (
                  <li key={`${a}-${i}`} className="flex gap-2 text-sm text-neutral-800">
                    <FiCheck className="mt-0.5 text-primary-500 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              {solution.technicalDrawingUrl && (
                <a
                  href={solution.technicalDrawingUrl}
                  download
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  <FiFile /> Download technical cross-section (PDF)
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Layer-by-layer build-up */}
      <section className="section pt-6 bg-neutral-50">
        <div className="container-page">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
            System build-up
          </h2>
          <ol className="space-y-4">
            {solution.layers.map((layer) => {
              // Live API pre-resolves productSlug/productName/segmentSlug;
              // mock fallback only has productId — look it up locally.
              const liveLinked =
                layer.productSlug && layer.productName
                  ? {
                      slug: layer.productSlug,
                      name: layer.productName,
                      segmentSlug:
                        layer.productSegmentSlug ?? segment?.slug ?? "",
                    }
                  : null;
              const mockLinked =
                !liveLinked && layer.productId
                  ? (() => {
                      const found = products.find(
                        (p) => String(p.id) === String(layer.productId)
                      );
                      if (!found) return null;
                      const resolved = getProductBySlug(found.slug);
                      return resolved
                        ? {
                            slug: resolved.slug,
                            name: resolved.name,
                            segmentSlug: segment?.slug ?? "",
                          }
                        : null;
                    })()
                  : null;
              const linked = liveLinked ?? mockLinked;
              return (
                <li
                  key={layer.order}
                  className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6 flex flex-col md:flex-row gap-4 md:items-center"
                >
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl brand-gradient text-white-base text-lg font-bold shrink-0">
                    {layer.order}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-900">
                      {layer.name}
                    </p>
                    {layer.description && (
                      <p className="mt-1 text-xs text-neutral-500">
                        {layer.description}
                      </p>
                    )}
                  </div>
                  {linked && (
                    <Link
                      href={`/products/${linked.segmentSlug}/${linked.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 shrink-0"
                    >
                      {linked.name} <FiArrowUpRight />
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* System downloads — TDS, installation guide, warranty, etc. */}
      {downloads.length > 0 && (
        <section className="section pt-0 bg-neutral-50">
          <div className="container-page">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
              Documents & downloads
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {downloads.map((d) => (
                <li key={`${d.kind}-${d.title}-${d.url}`}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center gap-3 rounded-xl bg-white-base border border-neutral-100 p-4 hover:border-primary-200 hover:shadow-soft transition-all"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600">
                      <FiFile />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 leading-tight group-hover:text-primary-700">
                        {d.title}
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold tracking-wider uppercase text-neutral-500">
                        {d.kind}
                      </p>
                    </div>
                    <FiArrowUpRight className="text-neutral-400 group-hover:text-primary-600" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Products in this system */}
      {productList.length > 0 && (
        <section className="section pt-0">
          <div className="container-page">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
              Products in this system
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productList.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reference projects */}
      {usedInProjects.length > 0 && (
        <section className="section pt-0 bg-neutral-900 text-white-base">
          <div className="container-page">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold">
                Built with this system
              </h2>
              <Link
                href="/references"
                className="text-sm font-semibold text-accent-400 hover:text-accent-300"
              >
                All references →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {usedInProjects.slice(0, 6).map((p) => (
                <Link
                  key={p.id}
                  href={`/references/${p.slug}`}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden flex flex-col justify-end bg-neutral-800"
                >
                  <Image
                    src={encodeURI(p.heroImage)}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                  <div className="relative p-5">
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-300">
                      <FiMapPin /> {p.location.city}, {p.location.country}
                    </p>
                    <h3 className="mt-2 text-base font-bold leading-tight text-white-base">
                      {p.title}
                    </h3>
                    <FiArrowUpRight className="mt-3 text-lg text-accent-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other systems in segment */}
      {otherSolutions.length > 0 && (
        <section className="section pt-12">
          <div className="container-page">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
              More systems in {segment?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {otherSolutions.map((s) => (
                <Link
                  key={s.id}
                  href={`/solutions/${s.slug}`}
                  className="group block p-6 rounded-2xl border border-neutral-100 bg-white-base hover:border-primary-200 hover:shadow-soft transition-all"
                >
                  <p className="text-xs font-bold tracking-wider uppercase text-neutral-500">
                    {s.layers.length} layers
                  </p>
                  <h3 className="mt-2 text-base font-bold text-neutral-900 group-hover:text-primary-600">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                    {s.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
