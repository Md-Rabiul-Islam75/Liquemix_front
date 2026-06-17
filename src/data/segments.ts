import type { Segment } from "@/types/Catalog";

/**
 * Top-level industry segments — the four pillars shown on the homepage
 * and used to color-code the entire catalog.
 */
export const segments: Segment[] = [
  {
    id: "seg-waterproofing",
    slug: "waterproofing-and-restoration",
    name: "Waterproofing & Restoration",
    tagline: "Build on watertight foundations.",
    description:
      "Mineral and bitumen-based waterproofing systems, restoration mortars, and crack-bridging membranes for basements, podiums, water tanks, and facades.",
    color: "blue",
    heroImage: "/images/segments/waterproofing.jpg",
    icon: "droplet",
    productCount: 38,
    solutionCount: 12,
  },
  {
    id: "seg-tile",
    slug: "tile-natural-stone-screed",
    name: "Tile, Natural Stone & Screed",
    tagline: "Bonded for a lifetime.",
    description:
      "Flexible tile adhesives, screed mortars, and grouts engineered for ceramic, porcelain, and natural stone in wet and dry environments.",
    color: "orange",
    heroImage: "/images/segments/tile.jpg",
    icon: "grid",
    productCount: 24,
    solutionCount: 8,
  },
  {
    id: "seg-flooring",
    slug: "protective-flooring-coatings",
    name: "Protective Flooring & Coatings",
    tagline: "Surfaces that outlast traffic.",
    description:
      "Industrial epoxy and PU floor systems, decorative coatings, and primers for warehouses, parking decks, food plants, and clean rooms.",
    color: "yellow",
    heroImage: "/images/segments/flooring.jpg",
    icon: "square",
    productCount: 19,
    solutionCount: 7,
  },
  {
    id: "seg-concrete",
    slug: "concrete-technology",
    name: "Concrete Technology",
    tagline: "Stronger from the first pour.",
    description:
      "Admixtures, repair mortars, precision grouts, curing compounds, and concrete protection — from batching plant to lifetime maintenance.",
    color: "green",
    heroImage: "/images/segments/concrete.jpg",
    icon: "layers",
    productCount: 31,
    solutionCount: 10,
  },
];

import { apiGetOr, USE_MOCK_FALLBACK } from "@/lib/api";

export function getSegmentById(id: string | number): Segment | undefined {
  return segments.find((s) => String(s.id) === String(id));
}

export function getSegmentBySlug(slug: string): Segment | undefined {
  return segments.find((s) => s.slug === slug);
}

/**
 * Live segments from the backend. Falls back to the seeded mock array if
 * the API is unreachable so the public site keeps rendering during dev.
 */
export async function fetchSegments(): Promise<Segment[]> {
  // Mock fallback is gated OFF by default: the mock segments have string ids
  // ("seg-concrete") that don't match the real DB's numeric ids. If they leak
  // in (e.g. a timeout), every downstream call breaks — categories?segmentId=
  // seg-concrete 400s, and product detail pages 404 on the segment-id guard.
  // Empty is the honest fallback; real data shows once the API responds.
  return apiGetOr<Segment[]>(
    "/api/v1/catalog/segments",
    USE_MOCK_FALLBACK ? segments : []
  );
}

export async function fetchSegmentBySlug(slug: string): Promise<Segment | undefined> {
  return apiGetOr<Segment | undefined>(
    `/api/v1/catalog/segments/${encodeURIComponent(slug)}`,
    USE_MOCK_FALLBACK ? segments.find((s) => s.slug === slug) : undefined
  );
}

/**
 * Convenience: live segments indexed by stringified id, for pages that
 * need to do many `getSegmentById`-style lookups (e.g. a list of products
 * each linking to its segment landing page). One fetch + O(1) lookups.
 *
 * Mock IDs are strings ("seg-waterproofing"), backend IDs are numbers —
 * the map key is always stringified so both sources interoperate.
 */
export async function fetchSegmentsMap(): Promise<Map<string, Segment>> {
  const list = await fetchSegments();
  return new Map(list.map((s) => [String(s.id), s]));
}
