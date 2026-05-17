import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiDownload } from "react-icons/fi";
import type { Product } from "@/types/Catalog";
import { getSegmentById } from "@/data/segments";

const SEGMENT_ACCENT: Record<string, { bar: string; chip: string; tint: string }> = {
  blue: {
    bar: "from-primary-600 to-primary-400",
    chip: "chip-segment-blue",
    tint: "from-primary-50 to-white",
  },
  orange: {
    bar: "from-secondary-600 to-secondary-400",
    chip: "chip-segment-orange",
    tint: "from-secondary-50 to-white",
  },
  yellow: {
    bar: "from-accent-500 to-accent-300",
    chip: "chip-segment-yellow",
    tint: "from-accent-50 to-white",
  },
  green: {
    bar: "from-success-600 to-success-500",
    chip: "chip-segment-green",
    tint: "from-success-50 to-white",
  },
};

export default function ProductCard({ product }: { product: Product }) {
  const segment = getSegmentById(product.segmentId);
  const accent = SEGMENT_ACCENT[segment?.color ?? "blue"];
  const tds = product.documents.find((d) => d.type === "TDS");
  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];

  return (
    <article className="group card-product">
      {/* Top color bar */}
      <span
        aria-hidden
        className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${accent.bar}`}
      />

      {/* Image area */}
      <Link
        href={`/products/${segment?.slug}/${product.slug}`}
        className={`relative block aspect-[4/3] bg-gradient-to-br ${accent.tint} overflow-hidden`}
      >
        {primaryImage ? (
          <Image
            src={encodeURI(primaryImage.url)}
            alt={primaryImage.alt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Fallback for products without an image yet (admin-uploaded later). */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-3/4 rounded-lg bg-white-base shadow-lg flex flex-col items-center justify-center text-center p-3">
              <div className={`w-8 h-1 rounded-full mb-2 bg-gradient-to-r ${accent.bar}`} />
              <p className="text-xs font-bold text-neutral-900 leading-tight">
                {product.name}
              </p>
              <p className="mt-1 text-[10px] text-neutral-500">{product.sku}</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {product.isNew && <span className="chip-new">NEW</span>}
          {product.isFeatured && !product.isNew && (
            <span className="chip-featured">★ Featured</span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <span className={accent.chip + " w-fit"}>{segment?.name.split(" ")[0]}</span>
        <h3 className="mt-3 text-lg font-bold text-neutral-900 leading-snug">
          <Link
            href={`/products/${segment?.slug}/${product.slug}`}
            className="hover:text-primary-600 transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="mt-5 pt-4 flex items-center justify-between border-t border-neutral-100">
          <Link
            href={`/products/${segment?.slug}/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Details <FiArrowUpRight />
          </Link>
          {tds && (
            <a
              href={tds.url}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-secondary-600"
            >
              <FiDownload /> TDS
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
