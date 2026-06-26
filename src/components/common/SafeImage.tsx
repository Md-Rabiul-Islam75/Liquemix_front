"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type ReactNode } from "react";

/**
 * next/image wrapper that swaps to a fallback when the source fails to load.
 *
 * A product row can reference an image whose file isn't in storage yet (e.g.
 * the catalog was imported from a DB dump but the uploaded files weren't, or
 * the image is pending a fresh admin upload). Plain next/image renders the
 * browser's broken-image icon for those. This component catches the load
 * error and renders the same placeholder we already show for products with no
 * image at all — so a missing file looks intentional instead of broken.
 *
 * Pass the placeholder JSX as `fallback`; it must be absolutely positioned to
 * fill the same `relative` parent the `fill` image would have occupied.
 */
type SafeImageProps = ImageProps & { fallback?: ReactNode };

export default function SafeImage({
  fallback = null,
  onError,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    <Image
      {...props}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}
