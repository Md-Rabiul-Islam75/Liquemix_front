import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { fetchFeaturedProducts, fetchNewProducts } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default async function FeaturedProducts() {
  // Pull plenty from both feeds; the slice below decides the final count.
  const [featured, fresh] = await Promise.all([
    fetchFeaturedProducts(8),
    fetchNewProducts(8),
  ]);
  // Featured first, then New fills the remaining slots — any mix, up to 8
  // total (no fixed featured/new split). Dedup by id across the two feeds.
  const seen = new Set<string>();
  const list = [...featured, ...fresh].filter((p) => {
    const key = String(p.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);

  return (
    <section className="section bg-neutral-50">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow">
              <span className="block w-4 h-px bg-secondary-500" /> Featured products
            </span>
            <h2 className="section-title mt-3">
              Engineered for the toughest jobsites.
            </h2>
            <p className="section-subtitle">
              From single-coat waterproofing to high-flow precision grouts —
              every product ships with TDS, MSDS, and on-site applicator
              support.
            </p>
          </div>
          <Link href="/products" className="btn-ghost shrink-0">
            All products <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
