import type { NewsPost } from "@/types/Catalog";

export const newsPosts: NewsPost[] = [
  {
    id: "news-hydroguard-launch",
    slug: "introducing-lique-hydro-guard-3x",
    title: "Introducing Lique Hydro-Guard 3X — Three actions in one slurry",
    excerpt:
      "Our R&D team has spent four years engineering a single-coat system that combines crystalline penetration, elastic crack-bridging, and surface sealing.",
    body: `
<p>For four years, our R&amp;D team has chased a single goal: a waterproofing slurry that doesn't ask the applicator to choose between flexibility and durability. <strong>Lique Hydro-Guard 3X</strong> is the result — a polymer-modified mineral slurry that combines three different waterproofing mechanisms into a single coat.</p>

<h2>What's new</h2>
<p>Most cementitious waterproofing systems offer one mode of action. Crystalline products grow into the capillary pores of the substrate. Elastic membranes bridge cracks. Surface sealers reduce permeability. Hydro-Guard 3X does all three:</p>
<ul>
  <li><strong>Crystalline penetration</strong> — proprietary catalysts grow into pores up to 25 mm deep, even on dampened substrates.</li>
  <li><strong>Elastic crack-bridging</strong> — verified to 2 mm dynamic crack movement at -10 °C.</li>
  <li><strong>Surface sealing</strong> — water absorption reduced to &lt; 0.05 kg/m²·h⁰·⁵.</li>
</ul>

<h2>How we tested it</h2>
<p>We ran 18 months of accelerated weathering at the Dhaka lab and parallel installations at four pilot sites — a basement raft, a swimming pool tank, a metro station diaphragm wall, and a rooftop terrace. All four pilots crossed the 12-month mark without intervention.</p>

<h2>Availability</h2>
<p>Hydro-Guard 3X is available now in 25 kg bags and 5 kg pails, grey only. The white variant ships from Q2 2026. Full TDS, MSDS, and the EN 1504-2 declaration of performance are on the product page.</p>
`,
    publishedAt: "2025-10-01",
    coverImage: "/dummy_products_images/AQUAFIN-2KM-PLUS_kombi.jpg",
    author: { name: "Dr. Fatima Hossain", role: "Head of R&D" },
    category: "Product Launch",
    readMinutes: 4,
    tags: ["waterproofing", "product launch", "R&D"],
    relatedProductIds: ["prod-hydro-guard-3x"],
  },
  {
    id: "news-iso-9001",
    slug: "liquemix-achieves-iso-9001-recertification",
    title: "LiqueMix achieves ISO 9001:2015 recertification",
    excerpt:
      "Following a three-day external audit covering manufacturing, R&D, and technical service, LiqueMix has been recertified for ISO 9001 quality management.",
    body: `
<p>Following a three-day external audit covering manufacturing, R&amp;D, quality assurance, and technical service, LiqueMix has been recertified to <strong>ISO 9001:2015</strong> for the next three-year cycle.</p>

<p>The audit team examined batch release procedures, raw-material traceability, customer-complaint resolution, and corrective-action workflows. Zero non-conformities were raised; two opportunities for improvement were noted and have already entered our 2026 quality plan.</p>

<h2>What it means for customers</h2>
<p>ISO 9001 is a process certification — it doesn't certify the product, it certifies that every product leaves the plant against a documented procedure. Practically, that means:</p>
<ul>
  <li>Every batch carries a Material Test Certificate (MTC) traceable to raw-material lots.</li>
  <li>Customer complaints are logged with a 24-hour acknowledgement SLA and a root-cause analysis within 10 business days.</li>
  <li>Specification changes are version-controlled and communicated to procurement partners 30 days before release.</li>
</ul>

<p>The recertification covers all four product segments — waterproofing, tile installation, protective flooring, and concrete technology.</p>
`,
    publishedAt: "2025-09-12",
    coverImage: "",
    author: { name: "Nusrat Akter", role: "Director, Operations" },
    category: "Company News",
    readMinutes: 3,
    tags: ["certification", "quality", "ISO 9001"],
  },
  {
    id: "news-padma",
    slug: "padma-bridge-bearing-grouting-case-study",
    title: "Case study: Padma Bridge bearing grouting",
    excerpt:
      "How Precision Grout PG70 met the ±2 mm levelling tolerance for 84 bridge bearings under tight tide windows.",
    body: `
<p>The Padma Bridge approach piers presented two compounding challenges: <strong>84 bearings needing ±2 mm levelling tolerance</strong>, and tidal windows that allowed only six hours of dry working time per bearing.</p>

<h2>The challenge</h2>
<p>Each bearing supports up to 1,200 t of dead load. Grouting tolerance for the bearing seat is governed by AASHTO LRFD §14.7 — exceed ±2 mm and bearing performance degrades, leading to early replacement cycles and accelerated pier-cap distress.</p>

<p>The site team had to grout, demould, and re-tension within a tidal window that varied between 5h 40m and 7h 10m. Conventional cementitious grouts wouldn't reach 30 N/mm² in that window without aggressive accelerators that compromise flow.</p>

<h2>The system</h2>
<p>We specified <strong>Lique Precision Grout PG70</strong> — a non-shrink, free-flowing cementitious grout reaching 35 N/mm² at 6 hours and 80 N/mm² at 28 days. The expansive system uses a three-stage mechanism (gas, hydration, crystalline) so the grout fills cavities while resisting bleed and segregation.</p>

<p>For the deeper jacket repairs on the approach piers, we layered <strong>Lique MicroCrete ME 55 D</strong> — flowable micro-concrete pumped into formwork at 0.4–0.6 m/min.</p>

<h2>The outcome</h2>
<ul>
  <li><strong>84 of 84 bearings</strong> grouted within the ±2 mm tolerance — verified by precision-survey post-installation.</li>
  <li><strong>Zero retunement cycles</strong> required during the first 18 months of bridge operation.</li>
  <li><strong>No tidal-window breaches</strong> — the QC team logged a worst-case turnaround of 5h 20m, comfortably within the available window.</li>
</ul>

<p>Full project documentation is available on request — including the QA logs, batch MTCs, and bearing-level survey data.</p>
`,
    publishedAt: "2025-08-22",
    coverImage: "/images/Padma Bridge — Bearing Grouting & Repair.png",
    author: { name: "Imran Karim", role: "Director, Technical Service" },
    category: "Project",
    readMinutes: 6,
    tags: ["bridge", "grouting", "case study", "infrastructure"],
    relatedProductIds: ["prod-precision-grout-pg70", "prod-microcrete-me55d"],
  },
  {
    id: "news-decarbonisation",
    slug: "low-carbon-binder-pathway-2030",
    title: "Our pathway to a 40% lower-carbon binder by 2030",
    excerpt:
      "LiqueMix joins a regional consortium to accelerate adoption of calcined-clay and LC3 cements across construction-chemistry products.",
    body: `
<p>LiqueMix has joined a regional consortium of construction-chemistry manufacturers, cement producers, and university research groups targeting a <strong>40% reduction in embodied carbon</strong> across product-grade binders by 2030.</p>

<h2>Why now</h2>
<p>Cementitious construction chemicals carry the embodied carbon of their binder, which is typically 80–95% Portland cement clinker. Clinker production is responsible for roughly 7% of global CO₂ emissions. A 40% reduction at the product level translates to material reductions in project-level embodied carbon — particularly on infrastructure where construction-chemistry tonnages run into hundreds of tonnes.</p>

<h2>What we're doing</h2>
<ul>
  <li><strong>LC3 binder pilots</strong> — limestone-calcined-clay-cement substitution in repair mortars and screeds. Trial runs at 30% and 45% clinker replacement at our Dhaka pilot line.</li>
  <li><strong>Calcined-clay sourcing</strong> — partnerships with two regional clay suppliers to ensure consistent reactivity and alumina content.</li>
  <li><strong>PCE chemistry adaptation</strong> — our admixture range is being reformulated to match the rheology of low-clinker binders, which behave differently in flow and set behaviour.</li>
  <li><strong>Embodied-carbon disclosure</strong> — every product family will publish an EPD (Environmental Product Declaration) by end-2026.</li>
</ul>

<h2>What it doesn't mean</h2>
<p>This is not a marketing initiative. We will publish absolute carbon numbers per product, audited against the 2020 baseline, and we'll publish the failures alongside the wins. If a low-carbon variant doesn't meet the strength or durability spec, we'll say so and continue iterating — not ship a compromised product to chase a green claim.</p>

<p>The first low-clinker product (a structural repair mortar) is on track for Q3 2026 release.</p>
`,
    publishedAt: "2025-07-30",
    coverImage: "",
    author: { name: "Tanvir Rahman", role: "Managing Director" },
    category: "Industry",
    readMinutes: 5,
    tags: ["sustainability", "decarbonisation", "LC3", "industry"],
  },
];

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((p) => p.slug === slug);
}

export function getRelatedNews(currentSlug: string, limit = 3): NewsPost[] {
  return newsPosts.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
