import type { NewsPost } from "@/types/Catalog";

export const newsPosts: NewsPost[] = [
  {
    id: "news-hydroguard-launch",
    slug: "introducing-lique-hydro-guard-3x",
    title: "Introducing Lique Hydro-Guard 3X — Three actions in one slurry",
    excerpt:
      "Our R&D team has spent four years engineering a single-coat system that combines crystalline penetration, elastic crack-bridging, and surface sealing.",
    publishedAt: "2025-10-01",
    coverImage: "/images/news/hydroguard-launch.jpg",
    category: "Product Launch",
    readMinutes: 4,
  },
  {
    id: "news-iso-9001",
    slug: "liquemix-achieves-iso-9001-recertification",
    title: "LiqueMix achieves ISO 9001:2015 recertification",
    excerpt:
      "Following a three-day external audit covering manufacturing, R&D, and technical service, LiqueMix has been recertified for ISO 9001 quality management.",
    publishedAt: "2025-09-12",
    coverImage: "/images/news/iso-9001.jpg",
    category: "Company News",
    readMinutes: 3,
  },
  {
    id: "news-padma",
    slug: "padma-bridge-bearing-grouting-case-study",
    title: "Case study: Padma Bridge bearing grouting",
    excerpt:
      "How Precision Grout PG70 met the ±2 mm levelling tolerance for 84 bridge bearings under tight tide windows.",
    publishedAt: "2025-08-22",
    coverImage: "/images/news/padma-case-study.jpg",
    category: "Project",
    readMinutes: 6,
  },
  {
    id: "news-decarbonisation",
    slug: "low-carbon-binder-pathway-2030",
    title: "Our pathway to a 40% lower-carbon binder by 2030",
    excerpt:
      "LiqueMix joins a regional consortium to accelerate adoption of calcined-clay and LC3 cements across construction-chemistry products.",
    publishedAt: "2025-07-30",
    coverImage: "/images/news/low-carbon.jpg",
    category: "Industry",
    readMinutes: 5,
  },
];
