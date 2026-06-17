import type { Category } from "@/types/Catalog";

/**
 * Hierarchical categories. parentId === null means top-level under a segment.
 * Structure follows Schomburg's product taxonomy, adapted to LiqueMix's product line.
 */
export const categories: Category[] = [
  // ---------- Waterproofing & Restoration ----------
  {
    id: "cat-wp-mineral",
    slug: "waterproofing-materials-mineral-based",
    name: "Waterproofing Materials – Mineral-Based",
    parentId: null,
    segmentId: "seg-waterproofing",
    description:
      "Cementitious slurries for positive and negative side waterproofing.",
    menuOrder: 1,
    isActive: true,
  },
  {
    id: "cat-wp-bitumen",
    slug: "waterproofing-materials-bitumen",
    name: "Waterproofing Materials – Bitumen",
    parentId: null,
    segmentId: "seg-waterproofing",
    description: "PMBC and bituminous coatings for below-grade structures.",
    menuOrder: 2,
    isActive: true,
  },
  {
    id: "cat-wp-membrane",
    slug: "waterproofing-materials-sheet-membranes",
    name: "Waterproofing Materials – Sheet Membranes",
    parentId: null,
    segmentId: "seg-waterproofing",
    description: "Self-adhesive and torch-applied sheet membrane systems.",
    menuOrder: 3,
    isActive: true,
  },
  {
    id: "cat-wp-restoration",
    slug: "mortars-and-restoration-plasters",
    name: "Mortars & Restoration Plasters",
    parentId: null,
    segmentId: "seg-waterproofing",
    description: "Renovation plasters and salt-resistant mortars.",
    menuOrder: 4,
    isActive: true,
  },
  {
    id: "cat-wp-joint-tape",
    slug: "waterproof-joint-tapes",
    name: "Waterproof Joint Tapes",
    parentId: null,
    segmentId: "seg-waterproofing",
    description: "Crack-bridging tapes and corner pieces for joint detailing.",
    menuOrder: 5,
    isActive: true,
  },

  // ---------- Tile, Natural Stone & Screed ----------
  {
    id: "cat-tile-adhesive",
    slug: "tile-adhesives",
    name: "Tile Adhesives",
    parentId: null,
    segmentId: "seg-tile",
    description: "C2 and S2-classified adhesives for all tile types.",
    menuOrder: 1,
    isActive: true,
  },
  {
    id: "cat-tile-grout",
    slug: "tile-grouts",
    name: "Tile Grouts & Joint Fillers",
    parentId: null,
    segmentId: "seg-tile",
    description: "Cementitious and epoxy grouts for hygienic, durable joints.",
    menuOrder: 2,
    isActive: true,
  },
  {
    id: "cat-tile-screed",
    slug: "screed-mortars",
    name: "Screed Mortars",
    parentId: null,
    segmentId: "seg-tile",
    description: "Bonded and unbonded screed systems.",
    menuOrder: 3,
    isActive: true,
  },
  {
    id: "cat-tile-primer",
    slug: "primers-for-tile-systems",
    name: "Primers for Tile Systems",
    parentId: null,
    segmentId: "seg-tile",
    menuOrder: 4,
    isActive: true,
  },

  // ---------- Protective Flooring & Coatings ----------
  {
    id: "cat-floor-epoxy",
    slug: "epoxy-floor-systems",
    name: "Epoxy Floor Systems",
    parentId: null,
    segmentId: "seg-flooring",
    description: "Self-levelling, broadcast, and decorative epoxy coatings.",
    menuOrder: 1,
    isActive: true,
  },
  {
    id: "cat-floor-pu",
    slug: "polyurethane-floor-systems",
    name: "Polyurethane Floor Systems",
    parentId: null,
    segmentId: "seg-flooring",
    description: "PU hybrid systems for food, beverage, and chemical plants.",
    menuOrder: 2,
    isActive: true,
  },
  {
    id: "cat-floor-skim",
    slug: "skim-coats-and-self-levellers",
    name: "Skim Coats & Self-Levellers",
    parentId: null,
    segmentId: "seg-flooring",
    menuOrder: 3,
    isActive: true,
  },
  {
    id: "cat-floor-primer",
    slug: "primers-protective-coatings",
    name: "Primers & Protective Coatings",
    parentId: null,
    segmentId: "seg-flooring",
    menuOrder: 4,
    isActive: true,
  },

  // ---------- Concrete Technology ----------
  {
    id: "cat-conc-admix",
    slug: "concrete-admixtures",
    name: "Concrete Admixtures",
    parentId: null,
    segmentId: "seg-concrete",
    description:
      "Plasticisers, superplasticisers, retarders and accelerators for ready-mix.",
    menuOrder: 1,
    isActive: true,
  },
  {
    id: "cat-conc-repair",
    slug: "concrete-repair-mortars",
    name: "Concrete Repair Mortars",
    parentId: null,
    segmentId: "seg-concrete",
    description: "Structural and cosmetic repair mortars to EN 1504-3.",
    menuOrder: 2,
    isActive: true,
  },
  {
    id: "cat-conc-grout",
    slug: "precision-and-anchor-grouts",
    name: "Precision & Anchor Grouts",
    parentId: null,
    segmentId: "seg-concrete",
    menuOrder: 3,
    isActive: true,
  },
  {
    id: "cat-conc-curing",
    slug: "curing-compounds-bonding-agents",
    name: "Curing Compounds & Bonding Agents",
    parentId: null,
    segmentId: "seg-concrete",
    menuOrder: 4,
    isActive: true,
  },
  {
    id: "cat-conc-microcrete",
    slug: "micro-concrete-and-flowable-mortars",
    name: "Micro-Concrete & Flowable Mortars",
    parentId: null,
    segmentId: "seg-concrete",
    menuOrder: 5,
    isActive: true,
  },
  {
    id: "cat-conc-release",
    slug: "release-agents-and-shutter-oils",
    name: "Release Agents & Shutter Oils",
    parentId: null,
    segmentId: "seg-concrete",
    menuOrder: 6,
    isActive: true,
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoriesBySegment(segmentId: string): Category[] {
  return categories
    .filter((c) => c.segmentId === segmentId)
    .sort((a, b) => a.menuOrder - b.menuOrder);
}

export function getRootCategoriesBySegment(segmentId: string): Category[] {
  return categories
    .filter((c) => c.segmentId === segmentId && c.parentId === null)
    .sort((a, b) => a.menuOrder - b.menuOrder);
}

// ─── Live fetchers ────────────────────────────────────────────────────
import { apiGetOr, USE_MOCK_FALLBACK } from "@/lib/api";

/**
 * Live flat list of categories under a segment, ordered by menuOrder.
 * Falls back to the mock array filtered for the segment when the API is
 * unreachable so the public site keeps rendering during dev.
 */
export async function fetchCategoriesBySegment(
  segmentId: string | number
): Promise<Category[]> {
  return apiGetOr<Category[]>(
    `/api/v1/catalog/categories?segmentId=${encodeURIComponent(String(segmentId))}`,
    USE_MOCK_FALLBACK
      ? categories.filter((c) => String(c.segmentId) === String(segmentId))
      : []
  );
}

/**
 * Live nested tree of categories under a segment. Each node carries its
 * children inline so consumers can render arbitrary depth without a
 * second round trip. Mega-menu and the admin tree both use this.
 */
export async function fetchCategoryTree(
  segmentId: string | number
): Promise<Category[]> {
  return apiGetOr<Category[]>(
    `/api/v1/catalog/categories?segmentId=${encodeURIComponent(String(segmentId))}&tree=true`,
    USE_MOCK_FALLBACK ? buildMockTree(String(segmentId)) : []
  );
}

/**
 * Live single-category lookup by slug. Slugs are unique per segment but
 * not necessarily globally — callers that already know the segment
 * should prefer the flat list and lookup locally.
 */
export async function fetchCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  // No dedicated endpoint yet — fetch all segments' categories is too
  // expensive. v1 path: walk the mock to seed a default, and let any
  // page with a segment context use the segment-scoped helpers.
  return categories.find((c) => c.slug === slug);
}

/**
 * Convenience: live category list indexed by slug, scoped to a segment.
 * Lets consumers translate a `?category=adhesive` URL parameter into an
 * id without a per-slug round trip.
 */
export async function fetchCategoriesBySegmentMap(
  segmentId: string | number
): Promise<Map<string, Category>> {
  const list = await fetchCategoriesBySegment(segmentId);
  return new Map(list.map((c) => [c.slug, c]));
}

/** Build the nested mock tree for the fallback path. */
function buildMockTree(segmentId: string): Category[] {
  const inSegment = categories.filter(
    (c) => String(c.segmentId) === segmentId
  );
  const byParent = new Map<string | null, Category[]>();
  for (const c of inSegment) {
    const key = c.parentId != null ? String(c.parentId) : null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(c);
  }
  const attach = (parentKey: string | null): Category[] => {
    const kids = (byParent.get(parentKey) ?? []).sort(
      (a, b) => a.menuOrder - b.menuOrder
    );
    return kids.map((k) => ({ ...k, children: attach(String(k.id)) }));
  };
  return attach(null);
}
