"use client";

import { useState } from "react";
import SafeImage from "@/components/common/SafeImage";
import type { SegmentColor } from "@/types/Catalog";

type GalleryImage = { url: string; alt: string; isPrimary?: boolean };

// Active-thumbnail ring, themed to the product's segment colour.
const RING: Record<SegmentColor, string> = {
  blue: "ring-primary-500",
  orange: "ring-secondary-500",
  yellow: "ring-accent-500",
  green: "ring-success-500",
};

/**
 * Product image gallery for the public product page: a large main image with a
 * thumbnail strip beneath it. Clicking a thumbnail swaps the main image. The
 * thumbnails are hidden in print, so the currently-selected image is exactly
 * what ends up on the printed sheet.
 */
export default function ProductGallery({
  images,
  heroTint,
  segBar,
  segColor,
  isNew,
  isFeatured,
  placeholder,
}: {
  images: GalleryImage[];
  heroTint: string;
  segBar: string;
  segColor: SegmentColor;
  isNew?: boolean;
  isFeatured?: boolean;
  placeholder: React.ReactNode;
}) {
  // Primary image first, then the rest in their stored order.
  const ordered = [...images].sort(
    (a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary))
  );
  const [selected, setSelected] = useState(0);
  const current = ordered[Math.min(selected, ordered.length - 1)];

  return (
    <div>
      {/* Main image */}
      <div
        className={`relative aspect-square rounded-3xl bg-gradient-to-br ${heroTint} overflow-hidden`}
      >
        <span
          aria-hidden
          className={`absolute left-0 top-0 right-0 h-1.5 bg-gradient-to-r ${segBar} z-10`}
        />
        {current ? (
          <SafeImage
            // Remount on change so the fallback state resets per image.
            key={current.url}
            src={encodeURI(current.url)}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-contain p-8 md:p-12"
            fallback={placeholder}
          />
        ) : (
          placeholder
        )}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {isNew && <span className="chip-new">NEW</span>}
          {isFeatured && <span className="chip-featured">★ Featured</span>}
        </div>
      </div>

      {/* Thumbnail strip — hidden in print (only the selected main image prints) */}
      {ordered.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2.5 print:hidden">
          {ordered.map((img, i) => {
            const active = i === selected;
            return (
              <button
                key={`${img.url}-${i}`}
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={active}
                className={`relative w-16 h-16 md:w-[72px] md:h-[72px] shrink-0 rounded-xl overflow-hidden bg-white-base transition-all duration-200 ${
                  active
                    ? `ring-2 ring-offset-2 ${RING[segColor]} scale-[1.04] shadow-soft`
                    : "border border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-300"
                }`}
              >
                <SafeImage
                  src={encodeURI(img.url)}
                  alt={img.alt}
                  fill
                  sizes="72px"
                  className="object-contain p-1.5"
                  fallback={
                    <span className="absolute inset-0 grid place-items-center text-[10px] text-neutral-400">
                      —
                    </span>
                  }
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
