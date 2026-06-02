import type { Metadata } from "next";
import Image from "next/image";
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
import EnquireOptions from "@/components/contact/EnquireOptions";
import { whatsappUrl, buildEnquiryMessage } from "@/lib/enquiry";
import { FaWhatsapp } from "react-icons/fa";

import {
  products,
  fetchProductBySlug,
  getRelatedProducts,
} from "@/data/products";
import { fetchSegmentBySlug, getSegmentById } from "@/data/segments";
import { fetchCategoriesBySegment } from "@/data/categories";
import { referenceProjects } from "@/data/references";
import { getVideosByProduct } from "@/data/videos";
import type { ProductVideo, SegmentColor, Video } from "@/types/Catalog";

/**
 * Lift an admin-attached `ProductVideo` (lean: title + youtubeId) into
 * the full `Video` shape that VideoCard expects. Category defaults to
 * "Product Demo" because that's the most common case for a product-page
 * embed; the user can change it from the standalone Videos manager.
 */
function productVideoToVideo(v: ProductVideo, productId: string | number): Video {
  return {
    id: `prod-${productId}-${v.youtubeId}`,
    title: v.title,
    youtubeId: v.youtubeId,
    category: "Product Demo",
    relatedProductIds: [String(productId)],
    publishedAt: "",
  };
}

type Props = {
  params: Promise<{ segment: string; slug: string }>;
};

/**
 * Pre-build only the seed-mock paths. Anything created later via the
 * admin gets server-rendered on demand (dynamicParams default = true).
 */
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
  if (!slug || slug === "undefined") return { title: "Not found" };
  const product = await fetchProductBySlug(slug);
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

  // Fail fast on literal "undefined" or empty path params — almost
  // always a stale link in the calling code, never a real lookup. This
  // avoids spamming the backend with /api/v1/catalog/segments/undefined.
  if (
    !segmentSlug ||
    !slug ||
    segmentSlug === "undefined" ||
    slug === "undefined"
  ) {
    notFound();
  }

  const [segment, product] = await Promise.all([
    fetchSegmentBySlug(segmentSlug),
    fetchProductBySlug(slug),
  ]);

  if (!segment || !product) {
    notFound();
  }

  // Mock IDs are strings; backend IDs are numbers. Compare as strings.
  if (String(product.segmentId) !== String(segment.id)) {
    notFound();
  }

  const segColor = segment.color;
  const heroTint = SEGMENT_HERO[segColor];
  const segBar = SEGMENT_BAR[segColor];

  // Pull every category in this product's segment once, then resolve
  // categoryIds → Category objects. A product can have 1, 2, or 3
  // categories (root + sub + tertiary); they all live in the same flat
  // list and the lookup is O(1).
  const allCatsInSegment = await fetchCategoriesBySegment(segment.id);
  const catById = new Map(
    allCatsInSegment.map((c) => [String(c.id), c])
  );
  const productCategories = product.categoryIds
    .map((id) => catById.get(String(id)))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
  const primaryCategory = productCategories[0];

  const related = getRelatedProducts(String(product.id));
  // Two sources of videos:
  //  1. Admin-attached on the product itself (product.videos)
  //  2. Standalone videos in the library that reference this product
  // Merge both, then dedupe by youtubeId so a single video appears once.
  const attached = (product.videos ?? []).map((v) =>
    productVideoToVideo(v, product.id)
  );
  const standalone = getVideosByProduct(String(product.id));
  const seenYt = new Set<string>();
  const videos = [...attached, ...standalone].filter((v) => {
    if (seenYt.has(v.youtubeId)) return false;
    seenYt.add(v.youtubeId);
    return true;
  });
  const usedInProjects = referenceProjects.filter((r) =>
    r.productsUsed.includes(String(product.id))
  );

  return (
    <>
      <div className="print:hidden">
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
      </div>

      {/* Hero block: image + key info — also the ONLY section printed. */}
      <section className="bg-white-base product-print-area">
        <div className="container-page py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Image / chips */}
          <div className="lg:col-span-5">
            {(() => {
              const primaryImage =
                product.images.find((img) => img.isPrimary) ?? product.images[0];
              return (
                <div className={`relative aspect-square rounded-3xl bg-gradient-to-br ${heroTint} overflow-hidden`}>
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 right-0 h-1.5 bg-gradient-to-r ${segBar} z-10`}
                  />
                  {primaryImage ? (
                    <Image
                      src={encodeURI(primaryImage.url)}
                      alt={primaryImage.alt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-contain p-8 md:p-12"
                    />
                  ) : (
                    /* Fallback for products without an image yet. */
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
                  )}
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    {product.isNew && <span className="chip-new">NEW</span>}
                    {product.isFeatured && (
                      <span className="chip-featured">★ Featured</span>
                    )}
                  </div>
                </div>
              );
            })()}
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

              <div className="mt-7 flex flex-wrap gap-3 print:hidden">
                <a
                  href={whatsappUrl(
                    buildEnquiryMessage({
                      productName: product.name,
                      productSku: product.sku,
                    })
                  )}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[10px] bg-[#25D366] text-white-base font-semibold shadow-[0_8px_24px_-8px_rgba(37,211,102,0.45)] hover:bg-[#1ea355] transition-colors"
                >
                  <FaWhatsapp className="text-lg" /> Enquire on WhatsApp
                </a>
                <Link
                  href={`/contact?product=${encodeURIComponent(product.sku)}`}
                  className="btn-ghost"
                >
                  <FiMessageCircle /> More enquiry options
                </Link>
                <a href="#downloads" className="btn-ghost">
                  Downloads & data sheets
                </a>
              </div>
            </div>

            {/* Social enquiry — all channels, prefilled with this product's
                name + SKU. */}
            <div id="enquire" className="mt-8 rounded-2xl border border-neutral-100 bg-white-base p-6 md:p-7 shadow-soft print:hidden">
              <p className="brand-panel__eyebrow mb-1">Enquire about this product</p>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">
                Reach the right team in one tap.
              </h3>
              <p className="text-sm text-neutral-600 mb-5 max-w-2xl">
                Each option opens with your enquiry pre-filled — including
                product name and SKU — so we can answer with full context.
              </p>
              <EnquireOptions
                layout="list"
                context={{
                  productName: product.name,
                  productSku: product.sku,
                }}
              />
            </div>

            {/* Packaging */}
            {product.packaging.length > 0 && (
              <div className="mt-8 print:hidden">
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
      <section id="downloads" className="section pt-0 bg-white-base print:hidden">
        <div className="container-page">
          <DocumentAccordion documents={product.documents} />
        </div>
      </section>

      {/* Videos */}
      {videos.length > 0 && (
        <section className="section pt-0 bg-white-base print:hidden">
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
        <section className="section pt-0 bg-white-base print:hidden">
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
                  <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden bg-neutral-200">
                    <Image
                      src={encodeURI(proj.heroImage)}
                      alt={proj.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
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
        <section className="section pt-0 bg-white-base print:hidden">
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
