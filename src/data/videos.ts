import type { Video } from "@/types/Catalog";

/**
 * Video library — placeholder content modelled after Schomburg's YouTube channel
 * (waterproofing demos, application techniques, system walkthroughs).
 *
 * IMPORTANT: youtubeId values are placeholders. Replace with real LiqueMix
 * YouTube IDs once the channel is producing content. Until then they fall
 * back to widely-available demo videos — the player will still render.
 */
export const videos: Video[] = [
  {
    id: "vid-airless-spray",
    title: "Airless spray sealing with Lique Hydro-Guard 3X",
    description:
      "Watch how a two-person crew waterproofs 600 m² of basement wall in a single shift using airless spray equipment.",
    youtubeId: "ScMzIvxBSi4",
    durationSeconds: 224,
    category: "Application Technique",
    segmentId: "seg-waterproofing",
    relatedProductIds: ["prod-hydro-guard-3x"],
    publishedAt: "2025-09-18",
  },
  {
    id: "vid-flex-mortar-c2te",
    title: "Lique Fix MT-3 — flexible C2TE tile adhesive",
    description:
      "How Lique Fix MT-3 handles large-format porcelain on a heated screed — open time, slump test, and 24-hour pull-off.",
    youtubeId: "aqz-KE-bpKQ",
    durationSeconds: 312,
    category: "Product Demo",
    segmentId: "seg-tile",
    relatedProductIds: ["prod-fix-mt3"],
    publishedAt: "2025-08-04",
  },
  {
    id: "vid-pool-system",
    title: "Swimming Pool Waterproofing System — start to finish",
    description:
      "Full installation walkthrough of the LiqueMix swimming pool system, from tank prep through tiling.",
    youtubeId: "L_LUpnjgPso",
    durationSeconds: 538,
    category: "System Solution",
    segmentId: "seg-waterproofing",
    relatedProductIds: ["prod-hydro-guard-3x", "prod-crystal-flex-skim", "prod-fix-mt3"],
    publishedAt: "2025-07-22",
  },
  {
    id: "vid-microcrete-jacketing",
    title: "Column jacketing with MicroCrete ME 55 D",
    description:
      "Structural strengthening case study — 70 N/mm² self-compacting micro-concrete pumped into a confined cage.",
    youtubeId: "kJQP7kiw5Fk",
    durationSeconds: 412,
    category: "Case Study",
    segmentId: "seg-concrete",
    relatedProductIds: ["prod-microcrete-me55d"],
    publishedAt: "2025-06-12",
  },
  {
    id: "vid-precision-grout-pour",
    title: "Precision Grout PG70 baseplate pouring",
    description:
      "How to mix and place PG70 for machinery baseplates — including head pressure and pour rate guidance.",
    youtubeId: "RgKAFK5djSk",
    durationSeconds: 287,
    category: "Application Technique",
    segmentId: "seg-concrete",
    relatedProductIds: ["prod-precision-grout-pg70"],
    publishedAt: "2025-05-30",
  },
  {
    id: "vid-cure-e25-coverage",
    title: "Cure-E25 — coverage rate and finish quality",
    description:
      "Side-by-side test of cured vs uncured slabs over 28 days. Surface dusting, plastic shrinkage, abrasion.",
    youtubeId: "9bZkp7q19f0",
    durationSeconds: 198,
    category: "Tutorial",
    segmentId: "seg-concrete",
    relatedProductIds: ["prod-cure-e25"],
    publishedAt: "2025-05-10",
  },
  {
    id: "vid-shutterlube-finish",
    title: "Architectural concrete with Lique ShutterLube",
    description:
      "Achieving blemish-free fair-face concrete on steel formwork — coverage, application, and stripping technique.",
    youtubeId: "M7lc1UVf-VE",
    durationSeconds: 256,
    category: "Application Technique",
    segmentId: "seg-concrete",
    relatedProductIds: ["prod-shutter-lube"],
    publishedAt: "2025-04-18",
  },
  {
    id: "vid-pump-priming",
    title: "Lique Pump Primer — saving 200 L of slurry per pump",
    description:
      "Comparison of traditional cement-slurry priming vs Lique Pump Primer on a 32-storey high-rise pour.",
    youtubeId: "tgbNymZ7vqY",
    durationSeconds: 178,
    category: "Product Demo",
    segmentId: "seg-concrete",
    relatedProductIds: ["prod-pump-primer"],
    publishedAt: "2025-10-12",
  },
  {
    id: "vid-restoration-gp40d",
    title: "Bridge soffit repair with Restoration GP40 D",
    description:
      "Structural repair of a 40-year-old highway bridge — substrate prep, trowel application, and curing.",
    youtubeId: "fJ9rUzIMcZQ",
    durationSeconds: 422,
    category: "Case Study",
    segmentId: "seg-waterproofing",
    relatedProductIds: ["prod-restoration-gp40d"],
    publishedAt: "2025-04-02",
  },
  {
    id: "vid-latex-bond-slurry",
    title: "Bonding slurry with Lique Latex Bond – SBR",
    description:
      "How to gauge a bonding slurry for screed-to-substrate adhesion. Tensile test results at 7 and 28 days.",
    youtubeId: "OPf0YbXqDm0",
    durationSeconds: 234,
    category: "Tutorial",
    segmentId: "seg-concrete",
    relatedProductIds: ["prod-latex-bond-sbr"],
    publishedAt: "2025-03-20",
  },
  {
    id: "vid-retanta-hot-weather",
    title: "Retanta WS-50 — hot-weather concreting in 40 °C",
    description:
      "Field test of Retanta WS-50 on a tropical jobsite — slump retention over 4 hours of haul.",
    youtubeId: "JGwWNGJdvx8",
    durationSeconds: 195,
    category: "Application Technique",
    segmentId: "seg-concrete",
    relatedProductIds: ["prod-retanta-ws50"],
    publishedAt: "2025-03-05",
  },
  {
    id: "vid-plastorix-scc",
    title: "Self-compacting concrete with Plastorix-500",
    description:
      "Mix design and L-box flow test demonstration. Achieving SF2 consistency for slender-section pours.",
    youtubeId: "y6120QOlsfU",
    durationSeconds: 268,
    category: "Tutorial",
    segmentId: "seg-concrete",
    relatedProductIds: ["prod-plastorix-500"],
    publishedAt: "2025-02-22",
  },
];

export function getVideosBySegment(segmentId: string): Video[] {
  return videos.filter((v) => v.segmentId === segmentId);
}

export function getVideosByProduct(productId: string): Video[] {
  return videos.filter((v) => v.relatedProductIds?.includes(productId));
}

export const VIDEO_CATEGORIES: Video["category"][] = [
  "Product Demo",
  "Application Technique",
  "Case Study",
  "Tutorial",
  "System Solution",
];

// ─── Live fetcher ─────────────────────────────────────────────────────
import { apiGetOr } from "@/lib/api";

export async function fetchVideos(opts: {
  category?: string;
  segmentId?: string | number;
} = {}): Promise<Video[]> {
  const qs = new URLSearchParams();
  if (opts.category) qs.set("category", opts.category);
  if (opts.segmentId != null) qs.set("segmentId", String(opts.segmentId));
  const path = `/api/v1/content/videos${qs.toString() ? `?${qs}` : ""}`;
  return apiGetOr<Video[]>(path, videos);
}

/**
 * Public: videos embedded across published products, lifted into the Video
 * shape so they merge into the /service/videos library. The catalog list is
 * compact (no media) so this hits a dedicated flatten endpoint. The admin
 * Videos page reads the equivalent admin endpoint directly via adminGet.
 */
type EmbeddedVideo = {
  youtubeId: string;
  title: string;
  category: string;
  segmentId?: number | null;
  publishedAt?: string | null;
  productId?: number | null;
  productName?: string | null;
  productSlug?: string | null;
};

export async function fetchProductVideos(): Promise<Video[]> {
  const rows = await apiGetOr<EmbeddedVideo[]>(
    "/api/v1/catalog/products/media/videos",
    []
  );
  return rows.map((r) => ({
    id: `prod-${r.productId}-${r.youtubeId}`,
    title: r.title,
    description: r.productName ? `Featured on ${r.productName}.` : undefined,
    youtubeId: r.youtubeId,
    category: (r.category as Video["category"]) ?? "Product Demo",
    segmentId: r.segmentId != null ? String(r.segmentId) : undefined,
    relatedProductIds: r.productId != null ? [String(r.productId)] : undefined,
    publishedAt: r.publishedAt ?? "",
  }));
}
