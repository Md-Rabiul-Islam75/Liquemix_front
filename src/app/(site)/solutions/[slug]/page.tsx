import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowUpRight, FiMessageCircle, FiFile, FiCheck, FiMapPin } from "react-icons/fi";

import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/product/ProductCard";

import { systemSolutions, getSolutionBySlug } from "@/data/solutions";
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

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return systemSolutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sol = getSolutionBySlug(slug);
  if (!sol) return { title: "Not found" };
  return {
    title: sol.name,
    description: sol.description,
  };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) notFound();

  const segMap = await fetchSegmentsMap();
  const segment = segMap.get(String(solution.segmentId));
  const productList = solution.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const usedInProjects = referenceProjects.filter((r) =>
    solution.productIds.some((pid) => r.productsUsed.includes(pid))
  );

  const otherSolutions = systemSolutions
    .filter(
      (s) =>
        s.id !== solution.id &&
        String(s.segmentId) === String(solution.segmentId)
    )
    .slice(0, 3);

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
              <div
                aria-hidden
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 18px)",
                }}
              />
              <div className="absolute inset-x-10 bottom-10 space-y-3">
                {solution.layers.map((layer, li) => (
                  <div
                    key={layer.order}
                    className="flex items-center gap-3 text-white-base"
                    style={{ opacity: 1 - li * 0.12 }}
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 backdrop-blur text-xs font-bold">
                      {layer.order}
                    </span>
                    <span className="text-sm md:text-base font-semibold">
                      {layer.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              className={`${segment ? PANEL_VARIANT[segment.color] : "brand-panel"} p-6 md:p-7`}
            >
              <p className="brand-panel__eyebrow mb-3">Areas of application</p>
              <ul className="space-y-2.5">
                {solution.applicationAreas.map((a) => (
                  <li key={a} className="flex gap-2 text-sm text-neutral-800">
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
              const product = layer.productId
                ? getProductBySlug(
                    products.find((p) => p.id === layer.productId)?.slug ?? ""
                  )
                : null;
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
                  {product && (
                    <Link
                      href={`/products/${segment?.slug}/${product.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 shrink-0"
                    >
                      {product.name} <FiArrowUpRight />
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

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
