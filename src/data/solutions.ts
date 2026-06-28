import { apiGetOr, ApiNotFoundError, apiGet, USE_MOCK_FALLBACK } from "@/lib/api";
import type {
  SystemSolution,
  SystemSolutionDownload,
} from "@/types/Catalog";

/**
 * Engineered multi-product build-ups — the "System Solutions" nav item.
 * The mock array is the static fallback used when the backend is
 * unreachable or returns nothing; the V7 migration seeds the same four
 * systems server-side so live ⇔ mock content matches.
 */
export const systemSolutions: SystemSolution[] = [
  {
    id: "sol-basement-flexible",
    slug: "basement-waterproofing-flexible-system",
    name: "Basement Waterproofing — The Flexible System",
    description:
      "A four-layer mineral system for basements exposed to water under pressure on the positive side. Combines a crystalline slurry, a flexible membrane, joint detailing, and a protection layer.",
    segmentId: "seg-waterproofing",
    applicationAreas: [
      "Residential and commercial basements",
      "Lift pits and utility shafts",
      "Underground parking structures",
    ],
    layers: [
      { order: 1, name: "Substrate preparation & primer", description: "Mechanically clean and pre-wet the concrete to SSD." },
      { order: 2, name: "First slurry coat", productId: "prod-hydro-guard-3x" },
      { order: 3, name: "Flexible crack-bridging membrane", productId: "prod-crystal-flex-skim" },
      { order: 4, name: "Protection screed", description: "Cementitious protection board or 30 mm screed." },
    ],
    productIds: ["prod-hydro-guard-3x", "prod-crystal-flex-skim"],
    heroImage: "/images/solutions/basement-flexible.jpg",
  },
  {
    id: "sol-swimming-pool",
    slug: "swimming-pool-waterproofing-system",
    name: "Swimming Pool Waterproofing System",
    description:
      "Complete watertight build-up for indoor and outdoor pools — substrate levelling, waterproof slurry, joint tapes, and chemical-resistant tile adhesive certified for chlorinated water.",
    segmentId: "seg-waterproofing",
    applicationAreas: [
      "Public and commercial pools",
      "Hotel and residential pools",
      "Wellness, spa, and thermal facilities",
    ],
    layers: [
      { order: 1, name: "Pool tank levelling mortar", productId: "prod-restoration-gp40d" },
      { order: 2, name: "Mineral waterproofing slurry", productId: "prod-hydro-guard-3x" },
      { order: 3, name: "Crack-bridging membrane", productId: "prod-crystal-flex-skim" },
      { order: 4, name: "Tile adhesive (chlorine-resistant)", productId: "prod-fix-mt3" },
    ],
    productIds: [
      "prod-restoration-gp40d",
      "prod-hydro-guard-3x",
      "prod-crystal-flex-skim",
      "prod-fix-mt3",
    ],
    heroImage: "/images/solutions/swimming-pool.jpg",
  },
  {
    id: "sol-parking-deck",
    slug: "parking-deck-protection-system",
    name: "Parking Deck Protection System",
    description:
      "Multi-layer surface protection for elevated and below-grade parking. Resists de-icing salts, hydraulic fluids, and the abrasion of daily traffic.",
    segmentId: "seg-flooring",
    applicationAreas: [
      "Multi-storey car parks",
      "Underground residential parking",
      "Service deck slabs",
    ],
    layers: [
      { order: 1, name: "Structural repair", productId: "prod-restoration-gp40d" },
      { order: 2, name: "Bonding agent", productId: "prod-latex-bond-sbr" },
      { order: 3, name: "Surface curing", productId: "prod-cure-e25" },
    ],
    productIds: ["prod-restoration-gp40d", "prod-latex-bond-sbr", "prod-cure-e25"],
    heroImage: "/images/solutions/parking-deck.jpg",
  },
  {
    id: "sol-industrial-floor",
    slug: "industrial-floor-renovation",
    name: "Industrial Floor Renovation",
    description:
      "Restore worn warehouse and production floors with structural repair, levelling, and a hard-wearing protective coat.",
    segmentId: "seg-flooring",
    applicationAreas: [
      "Warehousing and logistics centres",
      "Food and beverage plants",
      "Light engineering workshops",
    ],
    layers: [
      { order: 1, name: "Concrete repair", productId: "prod-restoration-gp40d" },
      { order: 2, name: "Self-levelling skim", productId: "prod-crystal-flex-skim" },
      { order: 3, name: "Curing & dust-sealing", productId: "prod-cure-e25" },
    ],
    productIds: ["prod-restoration-gp40d", "prod-crystal-flex-skim", "prod-cure-e25"],
    heroImage: "/images/solutions/industrial-floor.jpg",
  },
];

export function getSolutionBySlug(slug: string): SystemSolution | undefined {
  return systemSolutions.find((s) => s.slug === slug);
}

// ─── Live fetchers ────────────────────────────────────────────────────
// Pattern matches data/segments.ts and data/products.ts: try the backend
// first, fall back to the mock above when the API is down or the row
// doesn't exist. Server components and client components consume these
// identically — server through async/await, client through React's
// `use()` or via SettingsProvider-style hydration if ever needed.

/** Backend → frontend shape coercion. The API returns coverage fields
 *  like segmentSlug pre-resolved; mock falls back to bare ids. */
function normalize(raw: Partial<SystemSolution> & { id: SystemSolution["id"] }): SystemSolution {
  return {
    id: raw.id,
    slug: raw.slug ?? "",
    name: raw.name ?? "",
    description: raw.description ?? "",
    segmentId: raw.segmentId ?? "",
    segmentSlug: raw.segmentSlug,
    segmentName: raw.segmentName,
    segmentColor: raw.segmentColor,
    applicationAreas: raw.applicationAreas ?? [],
    layers: raw.layers ?? [],
    productIds: raw.productIds ?? [],
    downloads: (raw.downloads ?? []) as SystemSolutionDownload[],
    videos: raw.videos ?? [],
    technicalDrawingUrl: raw.technicalDrawingUrl,
    heroImage: raw.heroImage ?? "",
  };
}

export async function fetchSystemSolutions(): Promise<SystemSolution[]> {
  const raw = await apiGetOr<Partial<SystemSolution>[] | null>(
    "/api/v1/catalog/solutions",
    null
  );
  // No live data: show the mock only in offline-dev mode. Otherwise return
  // empty — a mock solution would 404 on its /solutions/{slug} detail page
  // (it doesn't exist in the real DB), the same phantom-card trap products
  // had. An empty list just hides the section.
  if (!raw || raw.length === 0) {
    return USE_MOCK_FALLBACK ? systemSolutions : [];
  }
  return raw.map((r) => normalize(r as never));
}

export async function fetchSolutionBySlug(
  slug: string
): Promise<SystemSolution | undefined> {
  try {
    const raw = await apiGet<Partial<SystemSolution>>(
      `/api/v1/catalog/solutions/${encodeURIComponent(slug)}`
    );
    return normalize(raw as never);
  } catch (e) {
    if (e instanceof ApiNotFoundError) {
      return USE_MOCK_FALLBACK ? getSolutionBySlug(slug) : undefined;
    }
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[api] /api/v1/catalog/solutions/${slug} failed (${
          e instanceof Error ? e.message : String(e)
        })${USE_MOCK_FALLBACK ? "; using mock." : "."}`
      );
    }
    return USE_MOCK_FALLBACK ? getSolutionBySlug(slug) : undefined;
  }
}

/** Convenience: only the systems in a given segment. */
export async function fetchSolutionsBySegment(
  segmentId: string | number
): Promise<SystemSolution[]> {
  const all = await fetchSystemSolutions();
  return all.filter((s) => String(s.segmentId) === String(segmentId));
}
