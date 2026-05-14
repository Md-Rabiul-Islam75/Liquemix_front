import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { getFeaturedProducts, getNewProducts } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function FeaturedProducts() {
  const featured = getFeaturedProducts(4);
  const fresh = getNewProducts(2);
  const list = [...featured, ...fresh].slice(0, 6);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
