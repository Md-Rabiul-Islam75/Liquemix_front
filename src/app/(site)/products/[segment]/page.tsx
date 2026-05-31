import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import { segments, getSegmentBySlug } from "@/data/segments";
import { getRootCategoriesBySegment, getCategoryBySlug } from "@/data/categories";
import { getProductsBySegment } from "@/data/products";

type Props = {
  params: Promise<{ segment: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
};

export async function generateStaticParams() {
  return segments.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segment: slug } = await params;
  const segment = getSegmentBySlug(slug);
  if (!segment) return { title: "Not found" };
  return {
    title: segment.name,
    description: segment.description,
  };
}

export default async function SegmentPage({ params, searchParams }: Props) {
  const { segment: slug } = await params;
  const sp = await searchParams;

  const segment = getSegmentBySlug(slug);
  if (!segment) notFound();

  const allInSegment = getProductsBySegment(String(segment.id));
  const categories = getRootCategoriesBySegment(String(segment.id));

  const categorySlug = sp.category;
  const q = (sp.q ?? "").trim().toLowerCase();

  let filtered = allInSegment;
  if (categorySlug) {
    const cat = getCategoryBySlug(categorySlug);
    if (cat) filtered = filtered.filter((p) => p.categoryIds.includes(cat.id));
  }
  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={segment.name}
        description={segment.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: segment.name },
        ]}
      />

      <section className="section pt-10">
        <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <ProductFilters
              categories={categories}
              total={allInSegment.length}
              filtered={filtered.length}
            />
          </div>
          <div className="lg:col-span-9">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center">
                <p className="text-lg font-bold text-neutral-900">
                  No products match your filters.
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                  Try clearing the search or selecting a different category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
