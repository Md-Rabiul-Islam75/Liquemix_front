import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCheck,
  FiMapPin,
  FiDroplet,
  FiMessageCircle,
} from "react-icons/fi";

import PageHeader from "@/components/common/PageHeader";
import DocumentAccordion from "@/components/product/DocumentAccordion";
import PackagingTable from "@/components/product/PackagingTable";
import PrintButton from "@/components/product/PrintButton";
import ProductCard from "@/components/product/ProductCard";
import VideoCard from "@/components/video/VideoCard";

import { products, getProductBySlug, getRelatedProducts } from "@/data/products";
import { getSegmentBySlug, getSegmentById } from "@/data/segments";
import { getCategoryById } from "@/data/categories";
import { referenceProjects } from "@/data/references";
import { getVideosByProduct } from "@/data/videos";
import type { SegmentColor } from "@/types/Catalog";

type Props = {
  params: Promise<{ segment: string; slug: string }>;
};

export async function generateStaticParams() {
  return products
    .map((p) => {
      const seg = getSegmentById(p.segmentId);
      if (!seg) return null;
      return { segment: seg.slug, slug: p.slug };
    })
    .filter((v): v is { segment: string; slug: string } => v !== null);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.name} — ${product.shortDescription}`,
    description: product.longDescription ?? product.shortDescription,
  };
}

const SEGMENT_HERO: Record<SegmentColor, string> = {
  blue: "from-primary-100 via-primary-50 to-white",
  orange: "from-secondary-100 via-secondary-50 to-white",
  yellow: "from-accent-100 via-accent-50 to-white",
  green: "from-success-50 via-white to-white",
};

const SEGMENT_BAR: Record<SegmentColor, string> = {
  blue: "from-primary-600 to-primary-400",
  orange: "from-secondary-600 to-secondary-400",
  yellow: "from-accent-500 to-accent-300",
  green: "from-success-600 to-success-500",
};

const PANEL_VARIANT: Record<SegmentColor, string> = {
  blue: "brand-panel-blue",
  orange: "brand-panel-orange",
  yellow: "brand-panel-yellow",
  green: "brand-panel-green",
};

export default async function ProductDetailPage({ params }: Props) {
  const { segment: segmentSlug, slug } = await params;
  const segment = getSegmentBySlug(segmentSlug);
  const product = getProductBySlug(slug);

  if (!segment || !product || product.segmentId !== segment.id) {
    notFound();
  }

  const segColor = segment.color;
  const heroTint = SEGMENT_HERO[segColor];
  const segBar = SEGMENT_BAR[segColor];

  const productCategories = product.categoryIds
    .map((id) => getCategoryById(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
  const primaryCategory = productCategories[0];

  const related = getRelatedProducts(product.id);
  const videos = getVideosByProduct(product.id);
  const usedInProjects = referenceProjects.filter((r) =>
    r.productsUsed.includes(product.id)
  );

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: segment.name, href: `/products/${segment.slug}` },
          ...(primaryCategory
            ? [
                {
                  label: primaryCategory.name,
                  href: `/products/${segment.slug}?category=${primaryCategory.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
        eyebrow={primaryCategory?.name ?? segment.name}
        title={product.name}
        description={product.shortDescription}
      >
        <div className="flex items-center gap-2">
          <Link
            href={`/products/${segment.slug}`}
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-primary-600"
          >
            <FiArrowLeft /> Back to {segment.name}
          </Link>
          <PrintButton />
        </div>
      </PageHeader>

      {/* Hero block: image + key info */}
      <section className="bg-white-base">
        <div className="container-page py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Image / chips */}
          <div className="lg:col-span-5">
            <div className={`relative aspect-square rounded-3xl bg-gradient-to-br ${heroTint} overflow-hidden`}>
              <span
                aria-hidden
                className={`absolute left-0 top-0 right-0 h-1.5 bg-gradient-to-r ${segBar}`}
              />
              <div className="absolute inset-0 grid place-items-center p-10">
                <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl bg-white-base shadow-xl flex flex-col justify-between p-6">
                  <div>
                    <span className={`block w-10 h-1 rounded-full bg-gradient-to-r ${segBar} mb-3`} />
                    <p className="text-xs text-neutral-500">{segment.name}</p>
                    <h3 className="mt-1 text-xl font-bold text-neutral-900 leading-tight">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-mono text-neutral-400">
                      {product.sku}
                    </p>
                  </div>
                  <div className={`h-24 rounded-lg bg-gradient-to-br ${segBar} opacity-90`} />
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isNew && <span className="chip-new">NEW</span>}
                {product.isFeatured && (
                  <span className="chip-featured">★ Featured</span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7">
            <div className={`${PANEL_VARIANT[segColor]} p-7 md:p-9`}>
              <p className="brand-panel__eyebrow mb-2">Product details</p>
              <h2 className="text-2xl font-bold text-neutral-900">
                {product.name}
              </h2>

              {product.longDescription && (
                <p className="mt-3 text-sm md:text-base text-neutral-700 leading-relaxed">
                  {product.longDescription}
                </p>
              )}

              <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="brand-panel__eyebrow mb-3">Areas of application</p>
                  <ul className="space-y-2">
                    {product.applicationAreas.map((a) => (
                      <li key={a} className="flex gap-2 text-sm text-neutral-800">
                        <FiMapPin className="mt-0.5 text-primary-500 shrink-0" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="brand-panel__eyebrow mb-3">Advantages</p>
                  <ul className="space-y-2">
                    {product.advantages.map((a) => (
                      <li key={a} className="flex gap-2 text-sm text-neutral-800">
                        <FiCheck className="mt-0.5 text-secondary-500 shrink-0" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {product.consumption && (
                <div className="mt-7 rounded-2xl bg-white-base border border-primary-100/60 p-5 flex items-center gap-4 shadow-[var(--shadow-soft)]">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500 text-white-base text-xl shadow-[0_6px_16px_-6px_rgba(21,101,192,0.5)]">
                    <FiDroplet />
                  </span>
                  <div>
                    <p className="brand-panel__eyebrow">Consumption</p>
                    <p className="text-lg font-bold text-neutral-900">
                      {product.consumption.value}{" "}
                      <span className="text-neutral-500 font-medium">
                        {product.consumption.unit}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/contact?product=${encodeURIComponent(product.sku)}`}
                  className="btn-accent"
                >
                  <FiMessageCircle /> Enquire for this product
                </Link>
                <a href="#downloads" className="btn-ghost">
                  Downloads & data sheets
                </a>
              </div>
            </div>

            {/* Packaging */}
            {product.packaging.length > 0 && (
              <div className="mt-8">
                <h3 className="text-base font-bold text-neutral-900 mb-3">
                  Packaging & article numbers
                </h3>
                <PackagingTable rows={product.packaging} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section id="downloads" className="section pt-0 bg-white-base">
        <div className="container-page">
          <DocumentAccordion documents={product.documents} />
        </div>
      </section>

      {/* Videos */}
      {videos.length > 0 && (
        <section className="section pt-0 bg-white-base">
          <div className="container-page">
            <div className="rounded-2xl bg-neutral-900 text-white-base p-6 md:p-10">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Videos</h2>
                <Link
                  href="/service/videos"
                  className="text-sm font-semibold text-accent-400 hover:text-accent-300"
                >
                  All videos →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videos.slice(0, 3).map((v) => (
                  <VideoCard key={v.id} video={v} compact />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Used in projects */}
      {usedInProjects.length > 0 && (
        <section className="section pt-0 bg-white-base">
          <div className="container-page">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
                Used in projects
              </h2>
              <Link
                href="/references"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                All references →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {usedInProjects.slice(0, 6).map((proj) => (
                <Link
                  key={proj.id}
                  href={`/references/${proj.slug}`}
                  className="group flex gap-4 p-4 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-soft transition-all"
                >
                  <div
                    className="w-24 h-20 shrink-0 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #072454 0%, #1565c0 100%)",
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                      {proj.location.city}, {proj.location.country}
                    </p>
                    <h4 className="mt-1 text-sm font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-primary-600">
                      {proj.title}
                    </h4>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      {proj.projectType} · {proj.year}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="section pt-0 bg-white-base">
          <div className="container-page">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
                Related products
              </h2>
              <Link
                href={`/products/${segment.slug}`}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                All in {segment.name} <FiArrowUpRight className="inline" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
