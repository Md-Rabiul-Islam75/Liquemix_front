import type { Product } from "@/types/Catalog";

/**
 * Mock product catalog — uses real LiqueMix product names sourced from
 * public/document-sheet/*.pdf. Every product carries the full document set
 * shape (TDS/MSDS/MTC/COO) so detail-page components can be built once.
 *
 * Replace with API responses by keeping the same shape — components consume
 * Product[] directly.
 */
export const products: Product[] = [
  {
    id: "prod-hydro-guard-3x",
    sku: "LMX-WP-HG3X",
    slug: "lique-hydro-guard-3x",
    name: "Lique Hydro-Guard 3X",
    shortDescription: "Triple-action cementitious waterproofing slurry",
    longDescription:
      "Polymer-modified mineral slurry that combines crystalline penetration, elastic crack-bridging, and surface sealing in a single coat. Engineered for positive and negative side waterproofing on concrete substrates with up to 7 bar of hydrostatic pressure resistance.",
    segmentId: "seg-waterproofing",
    categoryIds: ["cat-wp-mineral"],
    applicationAreas: [
      "Basement walls and floors (positive and negative side)",
      "Water tanks, swimming pools, and reservoirs",
      "Lift pits, manholes, and concrete tunnels",
      "Bathrooms, balconies, and terraces beneath tiles",
    ],
    advantages: [
      "3-in-1 action: crystalline, elastic, sealing",
      "Crack-bridging up to 2 mm",
      "Resistant to chlorinated water and de-icing salts",
      "Suitable for potable water tanks (NSF 61 equivalent)",
      "Single-component — just add water",
    ],
    consumption: { value: "1.8 – 2.4", unit: "kg / m² per coat" },
    packaging: [
      { articleNumber: "204301-001", size: "25 kg, bag", color: "Grey", unitPerPallet: 48 },
      { articleNumber: "204301-002", size: "5 kg, pail", color: "Grey", unitPerPallet: 96 },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/Lique Hydro-Guard 3x.pdf", language: "EN", revision: "R03", uploadedAt: "2025-09-12" },
      { type: "MSDS", title: "Safety Data Sheet", url: "/document-sheet/Lique Hydro-Guard 3x.pdf", language: "EN", revision: "R02", uploadedAt: "2025-09-12" },
    ],
    images: [
      { url: "/dummy_products_images/AQUAFIN-2KM-PLUS_kombi.jpg", alt: "Lique Hydro-Guard 3X — 25 kg bag", isPrimary: true },
    ],
    videos: [
      { title: "Hydro-Guard application demo", youtubeId: "dQw4w9WgXcQ" },
    ],
    relatedProductIds: ["prod-crystal-flex-skim", "prod-restoration-gp40d"],
    isFeatured: true,
    isNew: true,
    publishedAt: "2025-10-01",
  },
  {
    id: "prod-crystal-flex-skim",
    sku: "LMX-WP-CFS",
    slug: "crystal-flex-skim",
    name: "Crystal Flex-Skim",
    shortDescription: "Flexible crack-bridging skim membrane",
    longDescription:
      "Two-component polymer-modified cementitious membrane offering exceptional elasticity at low temperatures. Forms a continuous, vapour-permeable barrier under tiles, screeds, and decorative finishes.",
    segmentId: "seg-waterproofing",
    categoryIds: ["cat-wp-mineral", "cat-tile-primer"],
    applicationAreas: [
      "Wet rooms under tiling",
      "Balconies and terraces",
      "Roof gardens (with separation membrane)",
      "Drinking water reservoirs",
    ],
    advantages: [
      "Crack-bridging up to 1.5 mm at -20 °C",
      "Vapour permeable — substrate breathes",
      "Apply by brush, roller, or spray",
      "Overcoatable in 4 hours",
    ],
    consumption: { value: "1.6", unit: "kg / m² per mm thickness" },
    packaging: [
      { articleNumber: "204302-001", size: "24 kg, combo (A+B)", color: "Light grey", unitPerPallet: 36 },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/CRYSTAL-Flex-Skim.pdf", language: "EN", revision: "R02", uploadedAt: "2025-08-04" },
      { type: "TDS", title: "Technical Data Sheet (Updated)", url: "/document-sheet/CRYSTAL-Flex-Skim Liquemix.pdf", language: "EN", revision: "R03", uploadedAt: "2025-11-20" },
    ],
    images: [
      { url: "/dummy_products_images/AQUAFIN-CJ1.jpg", alt: "Crystal Flex-Skim 24 kg combo", isPrimary: true },
    ],
    relatedProductIds: ["prod-hydro-guard-3x", "prod-fix-mt3"],
    isFeatured: true,
    publishedAt: "2024-12-10",
  },
  {
    id: "prod-restoration-gp40d",
    sku: "LMX-RM-GP40D",
    slug: "lique-restoration-gp40-d",
    name: "Lique Restoration GP40 D",
    shortDescription: "Structural concrete repair mortar — R4 class",
    longDescription:
      "Polymer-modified, fibre-reinforced cementitious mortar conforming to EN 1504-3 Class R4 for structural concrete repair. Sulphate resistant and shrinkage compensated.",
    segmentId: "seg-concrete",
    categoryIds: ["cat-conc-repair", "cat-wp-restoration"],
    applicationAreas: [
      "Structural beam, column, and slab repair",
      "Spalled concrete in marine environments",
      "Parking deck and balcony soffit repair",
      "Industrial floor patch repair",
    ],
    advantages: [
      "R4 structural class to EN 1504-3",
      "Sulphate-resistant binder",
      "Polypropylene fibres — controlled shrinkage",
      "Trowel applied 10 – 50 mm in one pass",
    ],
    consumption: { value: "19", unit: "kg / m² per cm thickness" },
    packaging: [
      { articleNumber: "204303-001", size: "25 kg, bag", color: "Concrete grey", unitPerPallet: 48 },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/Ligue Restoration GP40 D.pdf", language: "EN", revision: "R01", uploadedAt: "2025-07-22" },
    ],
    images: [
      { url: "/dummy_products_images/ASOCRET-BIS-5-40.jpg", alt: "Lique Restoration GP40 D 25 kg bag", isPrimary: true },
    ],
    relatedProductIds: ["prod-microcrete-me55d", "prod-precision-grout-pg70"],
    isFeatured: true,
    publishedAt: "2025-03-15",
  },
  {
    id: "prod-cure-e25",
    sku: "LMX-CC-E25",
    slug: "lique-cure-e25",
    name: "Lique Cure-E25",
    shortDescription: "Wax-emulsion concrete curing compound",
    longDescription:
      "Spray-applied, wax-based curing membrane that reduces water loss from freshly poured concrete by up to 90%, preventing plastic shrinkage cracking and surface dusting.",
    segmentId: "seg-concrete",
    categoryIds: ["cat-conc-curing"],
    applicationAreas: [
      "Industrial floor slabs and pavements",
      "Bridge decks and highway slabs",
      "Walls and columns after stripping",
      "Pre-cast concrete elements",
    ],
    advantages: [
      "Up to 90% moisture retention efficiency",
      "Self-degrading — does not impair adhesion",
      "Ready to use — no dilution required",
      "ASTM C309 compliant",
    ],
    consumption: { value: "0.18 – 0.25", unit: "L / m²" },
    packaging: [
      { articleNumber: "204304-001", size: "20 L, drum", color: "Translucent white", unitPerPallet: 32 },
      { articleNumber: "204304-002", size: "200 L, barrel", color: "Translucent white", unitPerPallet: 4 },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet (current)", url: "/document-sheet/LIQUE CURE-E25.pdf", language: "EN", revision: "R02", uploadedAt: "2025-06-10" },
      { type: "TDS", title: "Technical Data Sheet (previous)", url: "/document-sheet/Lique Cure-E25 OLD.pdf", language: "EN", revision: "R01", uploadedAt: "2024-09-01" },
    ],
    images: [
      { url: "/dummy_products_images/BLANKOL-SUPER.jpg", alt: "Lique Cure-E25 20 L drum", isPrimary: true },
    ],
    publishedAt: "2024-09-01",
  },
  {
    id: "prod-fix-mt3",
    sku: "LMX-TL-MT3",
    slug: "lique-fix-mt-3",
    name: "Lique Fix MT-3",
    shortDescription: "High-performance flexible tile adhesive — C2TE S1",
    longDescription:
      "Polymer-modified, deformable, non-slip tile adhesive certified to EN 12004 Class C2TE S1 — suitable for porcelain, large-format ceramics, and natural stone on heated screeds and exterior facades.",
    segmentId: "seg-tile",
    categoryIds: ["cat-tile-adhesive"],
    applicationAreas: [
      "Large-format porcelain tiles up to 120×60 cm",
      "Natural stone on heated screeds",
      "Exterior facade tiling",
      "Swimming pool tiling (combined with Hydro-Guard 3X)",
    ],
    advantages: [
      "C2TE S1 deformable classification",
      "Extended open time — 30 min",
      "Slump-free for vertical application",
      "Single-component — water-mix only",
    ],
    consumption: { value: "3.5 – 5.5", unit: "kg / m²" },
    packaging: [
      { articleNumber: "204305-001", size: "25 kg, bag", color: "Grey", unitPerPallet: 48 },
      { articleNumber: "204305-002", size: "25 kg, bag", color: "White", unitPerPallet: 48 },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/Lique FIX MT-3.pdf", language: "EN", revision: "R01", uploadedAt: "2025-05-18" },
    ],
    images: [
      { url: "/dummy_products_images/ASO-Unigrund-PLUS.jpg", alt: "Lique Fix MT-3 25 kg bag", isPrimary: true },
    ],
    relatedProductIds: ["prod-crystal-flex-skim"],
    isFeatured: true,
    publishedAt: "2025-05-18",
  },
  {
    id: "prod-latex-bond-sbr",
    sku: "LMX-CC-LBSBR",
    slug: "lique-latex-bond-sbr",
    name: "Lique Latex Bond – SBR",
    shortDescription: "Multi-purpose SBR latex bonding admixture",
    longDescription:
      "Styrene-butadiene rubber emulsion that improves adhesion, flexibility, water resistance, and abrasion resistance when added to cementitious slurries, screeds, and repair mortars.",
    segmentId: "seg-concrete",
    categoryIds: ["cat-conc-curing", "cat-conc-admix"],
    applicationAreas: [
      "Bonding slurries for screed-to-substrate",
      "Repair mortar gauging",
      "Waterproof rendering coats",
      "Anti-corrosion coating to rebar",
    ],
    advantages: [
      "Improves tensile and flexural strength",
      "Reduces water absorption by up to 80%",
      "Non re-emulsifiable after cure",
      "Alkali-stable — works in all cementitious systems",
    ],
    consumption: { value: "varies", unit: "see TDS for mix ratios" },
    packaging: [
      { articleNumber: "204306-001", size: "20 L, drum", unitPerPallet: 24 },
      { articleNumber: "204306-002", size: "200 L, barrel", unitPerPallet: 4 },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/Lique Latex Bond - SBR .pdf", language: "EN", revision: "R02", uploadedAt: "2025-04-08" },
    ],
    images: [
      { url: "/dummy_products_images/ASODUR-K4031.jpg", alt: "Lique Latex Bond SBR 20 L drum", isPrimary: true },
    ],
    publishedAt: "2024-04-08",
  },
  {
    id: "prod-plastorix-500",
    sku: "LMX-AD-P500",
    slug: "lique-plastorix-500",
    name: "Lique Plastorix-500",
    shortDescription: "High-range water-reducing superplasticiser",
    longDescription:
      "Polycarboxylate ether-based superplasticiser delivering up to 35% water reduction for high-strength and self-compacting concrete mixes.",
    segmentId: "seg-concrete",
    categoryIds: ["cat-conc-admix"],
    applicationAreas: [
      "Ready-mix concrete plants",
      "Pre-cast and pre-stressed concrete",
      "Self-compacting concrete (SCC)",
      "Mass concrete and infrastructure",
    ],
    advantages: [
      "Up to 35% water reduction",
      "Extended slump retention",
      "Chloride-free — suitable for reinforced concrete",
      "EN 934-2 Type 3.1 / 3.2 compliant",
    ],
    consumption: { value: "0.4 – 1.5", unit: "% by cement weight" },
    packaging: [
      { articleNumber: "204307-001", size: "230 kg, barrel", unitPerPallet: 4 },
      { articleNumber: "204307-002", size: "1100 kg, IBC" },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/Lique Plastorix -500.pdf", language: "EN", revision: "R01", uploadedAt: "2025-02-19" },
    ],
    images: [
      { url: "/dummy_products_images/ASODUR-SG2__1_.jpg", alt: "Lique Plastorix-500", isPrimary: true },
    ],
    publishedAt: "2025-02-19",
  },
  {
    id: "prod-microcrete-me55d",
    sku: "LMX-MC-ME55D",
    slug: "lique-microcrete-me-55-d",
    name: "Lique MicroCrete ME 55 D",
    shortDescription: "Flowable micro-concrete for structural applications",
    longDescription:
      "High-strength, expansive, free-flowing micro-concrete designed for structural strengthening, jacketing, and machine baseplate grouting where compressive strength above 60 N/mm² is required.",
    segmentId: "seg-concrete",
    categoryIds: ["cat-conc-microcrete", "cat-conc-repair"],
    applicationAreas: [
      "Column and beam jacketing",
      "Machinery and turbine baseplates",
      "Bridge bearing repair",
      "Heavy-duty anchor grouting",
    ],
    advantages: [
      "≥ 70 N/mm² @ 28 days",
      "Self-compacting — pumps and flows easily",
      "Controlled expansion — eliminates void formation",
      "Shrinkage-compensated",
    ],
    consumption: { value: "2200", unit: "kg / m³" },
    packaging: [
      { articleNumber: "204308-001", size: "25 kg, bag", color: "Grey", unitPerPallet: 48 },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/Lique MicroCrete me 55 D.pdf", language: "EN", revision: "R01", uploadedAt: "2025-08-30" },
    ],
    images: [
      { url: "/dummy_products_images/ASOCRET-BIS-5-40 (1).jpg", alt: "Lique MicroCrete ME 55 D", isPrimary: true },
    ],
    relatedProductIds: ["prod-precision-grout-pg70", "prod-restoration-gp40d"],
    isNew: true,
    publishedAt: "2025-08-30",
  },
  {
    id: "prod-precision-grout-pg70",
    sku: "LMX-PG-70",
    slug: "lique-precision-grout-pg70",
    name: "Lique Precision Grout PG70",
    shortDescription: "Non-shrink precision cementitious grout",
    longDescription:
      "High-strength, non-shrink, free-flowing grout for anchor bolts, machinery baseplates, and structural connections requiring full contact and load transfer.",
    segmentId: "seg-concrete",
    categoryIds: ["cat-conc-grout"],
    applicationAreas: [
      "Anchor bolt grouting",
      "Machinery and crane rail baseplates",
      "Pre-cast element jointing",
      "Wind turbine tower base grouting",
    ],
    advantages: [
      "≥ 80 N/mm² @ 28 days",
      "Three-stage expansion mechanism",
      "Pourable at 15 – 100 mm thickness",
      "Chloride-free formulation",
    ],
    consumption: { value: "2150", unit: "kg / m³" },
    packaging: [
      { articleNumber: "204309-001", size: "25 kg, bag", color: "Grey", unitPerPallet: 48 },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/Lique Precision grout PG70.pdf", language: "EN", revision: "R02", uploadedAt: "2025-09-05" },
    ],
    images: [
      { url: "/dummy_products_images/ASODUR-SG3.jpg", alt: "Lique Precision Grout PG70", isPrimary: true },
    ],
    relatedProductIds: ["prod-microcrete-me55d"],
    isFeatured: true,
    publishedAt: "2025-09-05",
  },
  {
    id: "prod-shutter-lube",
    sku: "LMX-RA-SL",
    slug: "lique-shutter-lube",
    name: "Lique ShutterLube",
    shortDescription: "Premium formwork release agent",
    longDescription:
      "Reactive emulsion-based release agent producing blemish-free, dust-free architectural concrete surfaces. Compatible with steel, timber, and composite formwork.",
    segmentId: "seg-concrete",
    categoryIds: ["cat-conc-release"],
    applicationAreas: [
      "Architectural exposed concrete",
      "High-rise core and column formwork",
      "Pre-cast yard production",
      "Slip-form and climbing form systems",
    ],
    advantages: [
      "Crystal-clean concrete surfaces",
      "Spray, roller, or brush application",
      "Biodegradable formulation",
      "Coverage up to 50 m² / L",
    ],
    consumption: { value: "20 – 50", unit: "m² / L (substrate dependent)" },
    packaging: [
      { articleNumber: "204310-001", size: "20 L, drum", unitPerPallet: 32 },
      { articleNumber: "204310-002", size: "200 L, barrel", unitPerPallet: 4 },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/Lique- ShutterLube.pdf", language: "EN", revision: "R01", uploadedAt: "2025-01-25" },
    ],
    images: [
      { url: "/dummy_products_images/ASO-Antislide.jpg", alt: "Lique ShutterLube 20 L drum", isPrimary: true },
    ],
    publishedAt: "2025-01-25",
  },
  {
    id: "prod-pump-primer",
    sku: "LMX-AD-PP",
    slug: "lique-pump-primer",
    name: "Lique Pump Primer",
    shortDescription: "Concrete pump line primer & lubricant",
    longDescription:
      "Pre-blended priming powder that replaces traditional cement slurry priming of concrete pump lines — eliminates waste, accelerates start-up, and reduces blockage risk.",
    segmentId: "seg-concrete",
    categoryIds: ["cat-conc-admix"],
    applicationAreas: [
      "Concrete pump line priming on tower/boom pumps",
      "High-rise pumping (above 100 m)",
      "Long-distance horizontal pumping",
      "Tunnel and shaft concreting",
    ],
    advantages: [
      "Eliminates 200+ L of slurry waste per pump",
      "Mix on-site — just add water",
      "Reduces pump blockages",
      "Single sachet primes up to 150 m of line",
    ],
    consumption: { value: "1 sachet / 150 m", unit: "of 125 mm pipeline" },
    packaging: [
      { articleNumber: "204311-001", size: "1 kg, sachet (per carton of 20)" },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/LIQUE Pump Primer.pdf", language: "EN", revision: "R01", uploadedAt: "2025-10-12" },
    ],
    images: [
      { url: "/dummy_products_images/INDUFLEX-PU.jpg", alt: "Lique Pump Primer sachet", isPrimary: true },
    ],
    isNew: true,
    publishedAt: "2025-10-12",
  },
  {
    id: "prod-retanta-ws50",
    sku: "LMX-AD-WS50",
    slug: "lique-retanta-ws-50",
    name: "Lique Retanta WS-50",
    shortDescription: "Set-retarding admixture for hot-weather concreting",
    longDescription:
      "Liquid retarding admixture that extends the workability window of concrete in hot climates, long-haul transit, and large-pour applications without strength loss.",
    segmentId: "seg-concrete",
    categoryIds: ["cat-conc-admix"],
    applicationAreas: [
      "Hot-weather ready-mix concreting",
      "Long-haul concrete transport",
      "Mass concrete pours (rafts, dams)",
      "Architectural exposed-aggregate surfaces",
    ],
    advantages: [
      "Controlled retardation 30 min – 6 h",
      "No long-term strength impact",
      "Compatible with all cements & PCEs",
      "Chloride-free — EN 934-2 Type 8",
    ],
    consumption: { value: "0.2 – 0.6", unit: "% by cement weight" },
    packaging: [
      { articleNumber: "204312-001", size: "230 kg, barrel", unitPerPallet: 4 },
      { articleNumber: "204312-002", size: "1100 kg, IBC" },
    ],
    documents: [
      { type: "TDS", title: "Technical Data Sheet", url: "/document-sheet/Lique_Retanta WS-50.pdf", language: "EN", revision: "R01", uploadedAt: "2025-07-04" },
    ],
    images: [
      { url: "/dummy_products_images/RD-SK50.jpg", alt: "Lique Retanta WS-50 barrel", isPrimary: true },
    ],
    publishedAt: "2025-07-04",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsBySegment(segmentId: string): Product[] {
  return products.filter((p) => p.segmentId === segmentId);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return products.filter((p) => p.isFeatured).slice(0, limit);
}

export function getNewProducts(limit = 4): Product[] {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export function getRelatedProducts(productId: string): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product?.relatedProductIds) return [];
  return product.relatedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
}
