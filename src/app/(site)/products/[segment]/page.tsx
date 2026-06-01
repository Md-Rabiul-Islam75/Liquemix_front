import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import { segments, fetchSegmentBySlug } from "@/data/segments";
import { fetchCategoriesBySegment } from "@/data/categories";
import { fetchAllPublishedProducts } from "@/data/products";
import type { Category, EntityId } from "@/types/Catalog";

/**
 * Build the set of "allowed" category ids for a filter click: the
 * clicked category itself plus every descendant. Standard B2B catalog
 * UX — clicking a parent surfaces products attached to any sub or
 * tertiary category beneath it, so editors don't have to double-tag
 * every product. Leaf clicks naturally collapse to a one-element set
 * (just the leaf), preserving strict filtering for explicit picks.
 */
function descendantIdSet(allCats: Category[], rootId: EntityId): Set<string> {
  const childrenOf = new Map<string, Category[]>();
  for (const c of allCats) {
    const key = c.parentId != null ? String(c.parentId) : "__root__";
    if (!childrenOf.has(key)) childrenOf.set(key, []);
    childrenOf.get(key)!.push(c);
  }
  const out = new Set<string>([String(rootId)]);
  const stack: string[] = [String(rootId)];
  while (stack.length) {
    const id = stack.pop()!;
    for (const kid of childrenOf.get(id) ?? []) {
      const sid = String(kid.id);
      if (!out.has(sid)) {
        out.add(sid);
        stack.push(sid);
      }
    }
  }
  return out;
}

type Props = {
  params: Promise<{ segment: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
};

export async function generateStaticParams() {
  return segments.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segment: slug } = await params;
  const segment = await fetchSegmentBySlug(slug);
  if (!segment) return { title: "Not found" };
  return {
    title: segment.name,
    description: segment.description,
  };
}

export default async function SegmentPage({ params, searchParams }: Props) {
  const { segment: slug } = await params;
  const sp = await searchParams;

  const segment = await fetchSegmentBySlug(slug);
  if (!segment) notFound();

  // Live products. The old getProductsBySegment() only filtered the
  // local mock, so admin-created products were invisible here even
  // though the segment card already counted them via seg.productCount.
  // Fetch the live list and filter by segmentId (stringified for the
  // mock/string vs backend/number id drift).
  const allPublished = await fetchAllPublishedProducts();
  const allInSegment = allPublished.filter(
    (p) => String(p.segmentId) === String(segment.id)
  );

  // Full live list. The sidebar's ProductFilters now renders the whole
  // hierarchy with depth indentation, so a sub-category like "Tile
  // Grouts Subfield" is visible and filterable from this page even
  // though it isn't a root. Active-only is enforced here.
  const allCats = await fetchCategoriesBySegment(segment.id);
  const categories = allCats.filter((c) => c.isActive !== false);

  const categorySlug = sp.category;
  const q = (sp.q ?? "").trim().toLowerCase();

  let filtered = allInSegment;
  if (categorySlug) {
    const cat = allCats.find((c) => c.slug === categorySlug);
    if (cat) {
      // Descendant-inclusive: clicking "Tile Grouts & Joint Fillers"
      // also surfaces anything tagged into "Tile Grouts Subfield".
      // Clicking the subfield itself collapses to just its own id.
      const allowedIds = descendantIdSet(allCats, cat.id);
      filtered = filtered.filter((p) =>
        p.categoryIds.some((id) => allowedIds.has(String(id)))
      );
    }
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
