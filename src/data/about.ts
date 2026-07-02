import { apiGetOr } from "@/lib/api";

// ─── Types (mirror the backend AboutPageResponse one-to-one) ───────────
// Icons are stored as a key string (e.g. "target") and mapped to a real
// icon component on the public page — see ABOUT_ICON_KEYS below.

export type AboutValue = { icon: string; title: string; body: string };
export type AboutTimelineItem = { year: string; title: string; body: string };
export type AboutLeader = {
  name: string;
  role: string;
  bio: string;
  /** Optional photo URL. Falls back to initials when empty. */
  image?: string;
};
export type AboutCert = { code: string; body: string };
export type AboutSustainability = {
  icon: string;
  metric: string;
  label: string;
  body: string;
};
export type AboutCareerRole = { title: string; location: string; type: string };
export type AboutCareerStat = { icon: string; kpi: string; label: string };

export type AboutPage = {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;

  valuesHeading: string;
  valuesSubtitle: string;
  values: AboutValue[];

  storyHeading: string;
  storySubtitle: string;
  timeline: AboutTimelineItem[];

  managementHeading: string;
  managementSubtitle: string;
  leaders: AboutLeader[];

  qualityHeading: string;
  qualitySubtitle: string;
  certs: AboutCert[];

  sustainabilityHeading: string;
  sustainabilityBody: string;
  sustainability: AboutSustainability[];

  careersHeading: string;
  careersSubtitle: string;
  careersEmail: string;
  careerRoles: AboutCareerRole[];
  careerStats: AboutCareerStat[];

  ctaHeading: string;
  ctaBody: string;
};

/**
 * Icon keys the admin can pick from (dropdown). The public page maps each
 * key to a react-icons/fi component. Keep this list and the page's map in
 * sync. `award` is used for certs (fixed), the rest are pickable.
 */
export const ABOUT_ICON_KEYS = [
  "target",
  "shield",
  "heart",
  "trending-up",
  "zap",
  "droplet",
  "package",
  "users",
  "compass",
  "layers",
  "award",
  "check-circle",
  "globe",
  "activity",
] as const;

// ─── Defaults (seed content — matches the original hardcoded About page) ─
export const DEFAULT_ABOUT: AboutPage = {
  metaTitle: "About LiqueMix",
  metaDescription:
    "LiqueMix engineers construction-chemical systems for the toughest jobsites — from basement waterproofing to industrial flooring. Built in Bangladesh, trusted across Asia and the Middle East.",
  heroEyebrow: "About LiqueMix",
  heroTitle: "Construction chemistry, engineered for the real world.",
  heroDescription:
    "From a two-person lab in Dhaka to a regional construction-chemical brand — built around engineered systems, technical service, and a lower-carbon path.",

  valuesHeading: "Four principles that shape every product we ship.",
  valuesSubtitle:
    "These aren't slogans. They're the filters we use when we decide what to put on the truck, what to keep in the lab, and what to decline to sell.",
  values: [
    {
      icon: "target",
      title: "Engineered, never improvised.",
      body: "Every product ships with full TDS, MSDS, and an application protocol. If it can't be specified by an engineer, it doesn't leave the lab.",
    },
    {
      icon: "shield",
      title: "Systems over single products.",
      body: "We design complete build-ups — primer, membrane, finish — so layers work together by chemistry, not by chance.",
    },
    {
      icon: "heart",
      title: "Service is part of the product.",
      body: "On-site demonstrations, applicator training, and post-installation support — included with every project, not invoiced as extras.",
    },
    {
      icon: "trending-up",
      title: "Lower-carbon by design.",
      body: "Calcined-clay binders, PCE chemistry, and water-reduction admixtures cut embodied carbon at the batching plant — without trading off strength.",
    },
  ],

  storyHeading: "From a Dhaka lab to a regional brand.",
  storySubtitle:
    "Thirteen years of compounding incremental wins — better chemistry, better service, better packaging.",
  timeline: [
    {
      year: "2012",
      title: "Founded in Dhaka",
      body: "Started as a two-person technical lab serving a handful of waterproofing contractors in the capital.",
    },
    {
      year: "2016",
      title: "First manufacturing line",
      body: "Commissioned a dedicated cementitious-slurry line and launched the first Lique-branded waterproofing system.",
    },
    {
      year: "2019",
      title: "Concrete admixture division",
      body: "Added PCE-based superplasticisers and retarders for the ready-mix concrete market, supporting major bridge and metro projects.",
    },
    {
      year: "2022",
      title: "Regional expansion",
      body: "Opened distribution into the Middle East and South-East Asia. Now serving projects in 40+ countries.",
    },
    {
      year: "2025",
      title: "Decarbonisation roadmap",
      body: "Joined a regional consortium targeting a 40% reduction in product-level embodied carbon by 2030.",
    },
  ],

  managementHeading: "The people who set the agenda.",
  managementSubtitle:
    "A small leadership team — chemistry, engineering, and operations — that sits close to the lab and to the jobsite.",
  leaders: [
    {
      name: "Tanvir Rahman",
      role: "Managing Director",
      bio: "Chemical engineer with 18 years across construction chemistry. Founded LiqueMix in 2012.",
    },
    {
      name: "Dr. Fatima Hossain",
      role: "Head of R&D",
      bio: "PhD in cement chemistry from BUET. Leads the polymer-modified slurry and admixture platforms.",
    },
    {
      name: "Imran Karim",
      role: "Director, Technical Service",
      bio: "20-year veteran of large-scale waterproofing and grouting projects across South Asia.",
    },
    {
      name: "Nusrat Akter",
      role: "Director, Operations",
      bio: "Runs manufacturing, QA, and the supply chain. ISO 9001 lead auditor.",
    },
  ],

  qualityHeading: "Certified at every step, audited every year.",
  qualitySubtitle:
    "Every batch leaves the plant only after release by QA against an ISO 9001-aligned procedure. Standards aren't a marketing line — they're a release condition.",
  certs: [
    { code: "ISO 9001:2015", body: "Quality management — recertified 2025." },
    { code: "EN 1504-3", body: "Structural concrete repair, R4 class." },
    { code: "EN 12004", body: "Adhesives for ceramic tiles — C2TE S1 class." },
    { code: "EN 934-2", body: "Admixtures for concrete, mortar, and grout." },
    { code: "NSF 61 (eq.)", body: "Suitability for potable water contact." },
    { code: "ASTM C309", body: "Concrete curing compounds." },
  ],

  sustainabilityHeading: "Lower-carbon chemistry, measured in absolute terms.",
  sustainabilityBody:
    "We don't market sustainability — we report it. Every product family carries a published embodied-carbon number, audited against the 2020 baseline.",
  sustainability: [
    {
      icon: "zap",
      metric: "−18%",
      label: "Embodied CO₂ vs. 2020 baseline",
      body: "Lower-clinker binders and PCE-based water reduction across the concrete-technology range.",
    },
    {
      icon: "droplet",
      metric: "92%",
      label: "Process water recycled",
      body: "Closed-loop rinse and cooling system at the Dhaka plant.",
    },
    {
      icon: "package",
      metric: "100%",
      label: "Recyclable packaging",
      body: "Mono-material bags and pails — every container can re-enter the recycling stream.",
    },
  ],

  careersHeading: "Build construction chemistry with us.",
  careersSubtitle:
    "We hire chemists, engineers, applicators, and field-trainers who like solving real problems on real jobsites — not slides in conference rooms.",
  careersEmail: "careers@liquemix.com",
  careerRoles: [
    { title: "Senior R&D Chemist", location: "Dhaka", type: "Full-time" },
    { title: "Technical Service Engineer", location: "Chittagong", type: "Full-time" },
    { title: "Regional Sales Manager", location: "Dubai, UAE", type: "Full-time" },
    { title: "QA Lead", location: "Dhaka", type: "Full-time" },
  ],
  careerStats: [
    { icon: "users", kpi: "120+", label: "Team members" },
    { icon: "compass", kpi: "40+", label: "Countries served" },
    { icon: "layers", kpi: "13 yrs", label: "Operating" },
  ],

  ctaHeading: "Have a project? Talk to an engineer, not a sales rep.",
  ctaBody:
    "We respond within four business hours with a system recommendation, sample, or quotation.",
};

/**
 * Fill missing/empty scalar fields and empty arrays from DEFAULT_ABOUT, so
 * the public page and admin editor are never blank before the singleton row
 * has been saved. Mirrors data/settings.ts#fillDefaults.
 */
export function fillDefaults(raw: Partial<AboutPage> | null | undefined): AboutPage {
  const r = raw ?? {};
  const scalar = (v: unknown, d: string) =>
    typeof v === "string" && v.trim().length > 0 ? v : d;
  const arr = <T>(v: unknown, d: T[]): T[] =>
    Array.isArray(v) && v.length > 0 ? (v as T[]) : d;

  return {
    metaTitle: scalar(r.metaTitle, DEFAULT_ABOUT.metaTitle),
    metaDescription: scalar(r.metaDescription, DEFAULT_ABOUT.metaDescription),
    heroEyebrow: scalar(r.heroEyebrow, DEFAULT_ABOUT.heroEyebrow),
    heroTitle: scalar(r.heroTitle, DEFAULT_ABOUT.heroTitle),
    heroDescription: scalar(r.heroDescription, DEFAULT_ABOUT.heroDescription),

    valuesHeading: scalar(r.valuesHeading, DEFAULT_ABOUT.valuesHeading),
    valuesSubtitle: scalar(r.valuesSubtitle, DEFAULT_ABOUT.valuesSubtitle),
    values: arr(r.values, DEFAULT_ABOUT.values),

    storyHeading: scalar(r.storyHeading, DEFAULT_ABOUT.storyHeading),
    storySubtitle: scalar(r.storySubtitle, DEFAULT_ABOUT.storySubtitle),
    timeline: arr(r.timeline, DEFAULT_ABOUT.timeline),

    managementHeading: scalar(r.managementHeading, DEFAULT_ABOUT.managementHeading),
    managementSubtitle: scalar(r.managementSubtitle, DEFAULT_ABOUT.managementSubtitle),
    leaders: arr(r.leaders, DEFAULT_ABOUT.leaders),

    qualityHeading: scalar(r.qualityHeading, DEFAULT_ABOUT.qualityHeading),
    qualitySubtitle: scalar(r.qualitySubtitle, DEFAULT_ABOUT.qualitySubtitle),
    certs: arr(r.certs, DEFAULT_ABOUT.certs),

    sustainabilityHeading: scalar(r.sustainabilityHeading, DEFAULT_ABOUT.sustainabilityHeading),
    sustainabilityBody: scalar(r.sustainabilityBody, DEFAULT_ABOUT.sustainabilityBody),
    sustainability: arr(r.sustainability, DEFAULT_ABOUT.sustainability),

    careersHeading: scalar(r.careersHeading, DEFAULT_ABOUT.careersHeading),
    careersSubtitle: scalar(r.careersSubtitle, DEFAULT_ABOUT.careersSubtitle),
    careersEmail: scalar(r.careersEmail, DEFAULT_ABOUT.careersEmail),
    careerRoles: arr(r.careerRoles, DEFAULT_ABOUT.careerRoles),
    careerStats: arr(r.careerStats, DEFAULT_ABOUT.careerStats),

    ctaHeading: scalar(r.ctaHeading, DEFAULT_ABOUT.ctaHeading),
    ctaBody: scalar(r.ctaBody, DEFAULT_ABOUT.ctaBody),
  };
}

/** Public fetch: live About content, falling back to defaults when the API
 *  is unreachable or the row hasn't been customised yet. */
export async function fetchAbout(): Promise<AboutPage> {
  const raw = await apiGetOr<Partial<AboutPage> | null>(
    "/api/v1/site/about",
    DEFAULT_ABOUT
  );
  return fillDefaults(raw);
}
