import type { StandaloneDocument } from "@/types/Catalog";

/**
 * Standalone documents for /service/downloads — covers cross-product
 * documents like Additional Technical Information (ATI), brochures,
 * planning folders, etc.
 *
 * Real product TDS/MSDS live on each Product in src/data/products.ts.
 * This file is for the BROADER document library Schomburg surfaces under
 * Service → Downloads.
 */
export const standaloneDocuments: StandaloneDocument[] = [
  // --- Datasheets (links to product TDS by SKU) ---
  {
    id: "doc-tds-index",
    title: "Datasheet Index — All Products A–Z",
    description: "Master index of every product TDS in the LiqueMix catalogue.",
    category: "Datasheets",
    language: "EN",
    fileSizeKb: 480,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-11-01",
  },

  // --- Brochures ---
  {
    id: "doc-corporate-brochure",
    title: "LiqueMix Corporate Brochure 2025",
    description: "Company profile, manufacturing capability, and product overview.",
    category: "Brochures",
    language: "EN",
    fileSizeKb: 2400,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-10-15",
  },
  {
    id: "doc-waterproofing-brochure",
    title: "Waterproofing & Restoration Systems",
    description: "Engineered waterproofing systems for basements, podiums, tanks, and facades.",
    category: "Brochures",
    segmentId: "seg-waterproofing",
    language: "EN",
    fileSizeKb: 3100,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-09-22",
  },
  {
    id: "doc-flooring-brochure",
    title: "Protective Flooring & Coating Systems",
    description: "Industrial, decorative, and clean-room floor solutions.",
    category: "Brochures",
    segmentId: "seg-flooring",
    language: "EN",
    fileSizeKb: 2890,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-08-30",
  },
  {
    id: "doc-concrete-brochure",
    title: "Concrete Technology Catalogue",
    description: "Admixtures, repair mortars, grouts, and curing compounds.",
    category: "Brochures",
    segmentId: "seg-concrete",
    language: "EN",
    fileSizeKb: 2640,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-09-05",
  },

  // --- Additional Technical Information (ATI) ---
  {
    id: "doc-ati-07",
    title: "ATI_07 — Priming prior to tile installation without waterproof membrane",
    category: "Additional Technical Information",
    language: "EN",
    fileSizeKb: 220,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-07-12",
  },
  {
    id: "doc-ati-12",
    title: "ATI_12 — Installation recommendation for electric thin-bed heating system",
    category: "Additional Technical Information",
    language: "EN",
    fileSizeKb: 340,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-07-12",
  },
  {
    id: "doc-ati-15",
    title: "ATI_15 — Installation instructions for thin-layer hot water floor heating",
    category: "Additional Technical Information",
    language: "EN",
    fileSizeKb: 280,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-06-28",
  },
  {
    id: "doc-ati-21",
    title: "ATI_21 — Recommendation for installation of large-format tiles",
    category: "Additional Technical Information",
    language: "EN",
    fileSizeKb: 390,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-06-15",
  },
  {
    id: "doc-ati-22",
    title: "ATI_22 — Cleaning recommendations for tiled finishes",
    category: "Additional Technical Information",
    language: "EN",
    fileSizeKb: 180,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-05-30",
  },
  {
    id: "doc-ati-37",
    title: "ATI_37 — Application table for release agents",
    category: "Additional Technical Information",
    language: "EN",
    fileSizeKb: 210,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-05-22",
  },
  {
    id: "doc-ati-48",
    title: "ATI_48 — Products for reliable substrate levelling",
    category: "Additional Technical Information",
    language: "EN",
    fileSizeKb: 260,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-05-12",
  },

  // --- Planning folders ---
  {
    id: "doc-planning-basement",
    title: "Planning Folder — Basement Waterproofing",
    description: "Specification template, system layers, detailing for designers.",
    category: "Planning folder",
    segmentId: "seg-waterproofing",
    language: "EN",
    fileSizeKb: 1800,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-09-18",
  },
  {
    id: "doc-planning-pool",
    title: "Planning Folder — Swimming Pool Systems",
    category: "Planning folder",
    segmentId: "seg-waterproofing",
    language: "EN",
    fileSizeKb: 2100,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-09-10",
  },
  {
    id: "doc-planning-parking",
    title: "Planning Folder — Parking Deck Protection",
    category: "Planning folder",
    segmentId: "seg-flooring",
    language: "EN",
    fileSizeKb: 1950,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-08-25",
  },

  // --- Interactive system visualizations ---
  {
    id: "doc-iv-basement",
    title: "Interactive System Visualization — Basement Waterproofing",
    description: "Layer-by-layer interactive PDF of the basement system.",
    category: "Interactive system visualizations",
    segmentId: "seg-waterproofing",
    language: "EN",
    fileSizeKb: 4200,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-10-08",
  },
  {
    id: "doc-iv-flooring",
    title: "Interactive System Visualization — Industrial Flooring",
    category: "Interactive system visualizations",
    segmentId: "seg-flooring",
    language: "EN",
    fileSizeKb: 3800,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-10-08",
  },

  // --- Checklist for Technical Support ---
  {
    id: "doc-check-waterproofing",
    title: "Checklist — Waterproofing Specification",
    description: "Pre-tender checklist for engineers and specifiers.",
    category: "Checklist for Technical Support",
    segmentId: "seg-waterproofing",
    language: "EN",
    fileSizeKb: 140,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-07-04",
  },
  {
    id: "doc-check-concrete",
    title: "Checklist — Concrete Repair Diagnostics",
    category: "Checklist for Technical Support",
    segmentId: "seg-concrete",
    language: "EN",
    fileSizeKb: 160,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-07-04",
  },

  // --- Product range ---
  {
    id: "doc-product-range",
    title: "LiqueMix Product Range — Complete Catalogue 2025",
    description: "Every product across all four segments — packaging sizes, certifications, applications.",
    category: "Product range",
    language: "EN",
    fileSizeKb: 5800,
    url: "/document-sheet/LiqueMix.pdf",
    uploadedAt: "2025-11-01",
  },
];

export const DOWNLOAD_CATEGORIES: StandaloneDocument["category"][] = [
  "Datasheets",
  "Brochures",
  "Interactive system visualizations",
  "Planning folder",
  "Checklist for Technical Support",
  "Product range",
  "Additional Technical Information",
];

export function getDocumentsByCategory(
  category: StandaloneDocument["category"]
): StandaloneDocument[] {
  return standaloneDocuments.filter((d) => d.category === category);
}
