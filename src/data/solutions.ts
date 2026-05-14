import type { SystemSolution } from "@/types/Catalog";

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
