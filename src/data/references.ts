import type { ReferenceProject } from "@/types/Catalog";

export const referenceProjects: ReferenceProject[] = [
  {
    id: "ref-marina-dhaka",
    slug: "marina-residences-dhaka",
    title: "Marina Residences — Watertight Basement & Pool",
    projectType: "Residential High-Rise",
    location: { country: "Bangladesh", city: "Dhaka" },
    year: 2024,
    objectSize: "42,000 m²",
    productsUsed: ["prod-hydro-guard-3x", "prod-crystal-flex-skim", "prod-fix-mt3"],
    challenge:
      "Three-level basement below the water table with rooftop infinity pool — both required guaranteed watertightness with a 15-year performance guarantee.",
    solution:
      "Two-coat positive-side waterproofing with Hydro-Guard 3X over the basement raft, flexible Crystal Flex-Skim on the pool tank, and chemical-resistant Fix MT-3 for the tiling layer.",
    heroImage: "/images/Marina Residences — Watertight Basement & Pool.png",
    gallery: [],
    applicator: { name: "Acme Waterproofing Co.", website: "https://example.com" },
    architect: { name: "Urbana Studio" },
  },
  {
    id: "ref-port-terminal",
    slug: "chittagong-port-container-terminal",
    title: "Chittagong Port — Container Terminal Floor",
    projectType: "Industrial Infrastructure",
    location: { country: "Bangladesh", city: "Chittagong" },
    year: 2024,
    objectSize: "18,500 m²",
    productsUsed: ["prod-plastorix-500", "prod-retanta-ws50", "prod-cure-e25"],
    challenge:
      "Continuous 24-hour concrete pours in tropical climate with stringent strength requirements (≥ 50 N/mm² @ 28 days) and abrasion resistance for reach-stacker traffic.",
    solution:
      "PCE-based Plastorix-500 superplasticiser for 35% water reduction, Retanta WS-50 for extended workability in 38 °C ambient, and Cure-E25 to prevent plastic shrinkage on freshly placed slabs.",
    heroImage: "/images/Chittagong Port — Container Terminal Floor.png",
    gallery: [],
    architect: { name: "DPI Engineering Group" },
  },
  {
    id: "ref-metro-station",
    slug: "metro-line-6-station-waterproofing",
    title: "MRT Line-6 — Underground Station Waterproofing",
    projectType: "Public Transport Infrastructure",
    location: { country: "Bangladesh", city: "Dhaka" },
    year: 2025,
    objectSize: "9,200 m²",
    productsUsed: ["prod-hydro-guard-3x", "prod-restoration-gp40d", "prod-microcrete-me55d"],
    challenge:
      "Negative-side waterproofing of cast-in-situ diaphragm walls with active water ingress at construction joints.",
    solution:
      "Crystalline Hydro-Guard 3X applied to dampened substrate after joint detailing with MicroCrete ME 55 D. Long-term performance verified under 4 bar hydrostatic head.",
    heroImage: "/images/MRT Line-6 — Underground Station Waterproofing.png",
    gallery: [],
  },
  {
    id: "ref-pharma-plant",
    slug: "novacare-pharma-facility",
    title: "NovaCare Pharma — Cleanroom Floor System",
    projectType: "Pharmaceutical Manufacturing",
    location: { country: "Bangladesh", city: "Gazipur" },
    year: 2024,
    objectSize: "6,400 m²",
    productsUsed: ["prod-restoration-gp40d", "prod-crystal-flex-skim"],
    challenge:
      "Production floor required ISO 7 cleanroom finish — seamless, chemical-resistant, and rated for 5 t/m² static loading from process equipment.",
    solution:
      "Structural repair with Restoration GP40 D, levelling with Crystal Flex-Skim, and a custom epoxy top coat applied during a 10-day plant shutdown.",
    heroImage: "/images/NovaCare Pharma — Cleanroom Floor System.png",
    gallery: [],
  },
  {
    id: "ref-bridge",
    slug: "padma-bridge-approach-grouting",
    title: "Padma Bridge — Bearing Grouting & Repair",
    projectType: "Bridge Infrastructure",
    location: { country: "Bangladesh", city: "Mawa" },
    year: 2023,
    productsUsed: ["prod-precision-grout-pg70", "prod-microcrete-me55d"],
    challenge:
      "Precision grouting of 84 bridge bearings with strict tolerances (±2 mm levelling), and structural reinforcement of approach piers exposed to riverine erosion.",
    solution:
      "PG70 precision grout achieving 80 N/mm² for the bearing seats; MicroCrete ME 55 D pumped into reinforced jackets for the approach piers.",
    heroImage: "/images/Padma Bridge — Bearing Grouting & Repair.png",
    gallery: [],
  },
  {
    id: "ref-hospital",
    slug: "central-hospital-renovation",
    title: "Central Hospital — Operating Theatre Renovation",
    projectType: "Healthcare Facility",
    location: { country: "Bangladesh", city: "Sylhet" },
    year: 2025,
    objectSize: "2,100 m²",
    productsUsed: ["prod-fix-mt3", "prod-crystal-flex-skim"],
    challenge:
      "Renovation of seven operating theatres within an active hospital — required low-VOC products, fast turnaround per room, and antimicrobial surfaces.",
    solution:
      "Crystal Flex-Skim as a vapour-permeable underlayer, Fix MT-3 for hygienic large-format porcelain installation. Room-by-room handover in 5-day cycles.",
    heroImage: "/images/Central Hospital — Operating Theatre Renovation.png",
    gallery: [],
  },
];

export function getReferenceBySlug(slug: string): ReferenceProject | undefined {
  return referenceProjects.find((r) => r.slug === slug);
}
