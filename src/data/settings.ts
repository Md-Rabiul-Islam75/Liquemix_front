import { apiGetOr } from "@/lib/api";

/**
 * Global site settings consumed by the public site — header, footer,
 * floating WhatsApp button, /contact, homepage hero copy, and product
 * enquiry deep-links. Sourced from /api/v1/site/settings; we ship a
 * static default that doubles as the dev/offline fallback so the public
 * site never blanks when the backend is unreachable.
 *
 * Field names match the backend SiteSettingResponse one-to-one.
 */
export type SiteSettings = {
  whatsappNumber: string;
  phoneDisplay: string;
  phoneTel: string;
  emailSales: string;
  emailTechnical: string;
  emailGeneral: string;
  linkedinUrl: string;
  facebookUrl: string;
  wechatHandle: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtitle: string;
  statProducts: string;
  statCountries: string;
  statReferences: string;
  heroPrimaryProductSlug: string;
  heroSecondaryProductSlug: string;
  officeAddress: string;
  replySla: string;
  businessDays: string;
  businessHours: string;
  mapLink: string;
};

/**
 * Last-resort defaults. Match what was historically hardcoded in
 * EnquireOptions / Hero / Footer so a backend-down dev experience is
 * visually identical to the seeded production state.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: "8801000000000",
  phoneDisplay: "+880 1000-000000",
  phoneTel: "+8801000000000",
  emailSales: "sales@liquemix.com",
  emailTechnical: "support@liquemix.com",
  emailGeneral: "info@liquemix.com",
  linkedinUrl: "https://linkedin.com/company/liquemix",
  facebookUrl: "https://facebook.com/liquemix",
  wechatHandle: "liquemix_bd",
  heroEyebrow: "Construction Chemicals · Engineered Systems",
  heroHeadline: "Build on simple systems.\nEngineered for the real world.",
  heroSubtitle:
    "From basement waterproofing to industrial flooring — LiqueMix delivers complete engineered systems with full technical documentation, applicator support, and a guaranteed service life.",
  statProducts: "200+",
  statCountries: "40+",
  statReferences: "1500+",
  heroPrimaryProductSlug: "lique-hydro-guard-3x",
  heroSecondaryProductSlug: "lique-fix-mt-3",
  officeAddress: "Plot 42, Dhaka EPZ\nSavar, Dhaka 1349\nBangladesh",
  replySla: "< 4 business hours",
  businessDays: "Sunday–Thursday",
  businessHours: "9:00–18:00 (GMT+6)",
  mapLink: "https://maps.google.com/?q=Dhaka+EPZ+Savar",
};

/**
 * Coerce any incoming nullable record into a complete SiteSettings by
 * filling missing/null fields from the defaults. The backend uses
 * @JsonInclude(NON_NULL) on some responses, and rows seeded long ago
 * may have nulls; this guarantees consumers always get a string.
 */
function fillDefaults(partial: Partial<SiteSettings> | null | undefined): SiteSettings {
  const out = { ...DEFAULT_SETTINGS };
  if (!partial) return out;
  for (const k of Object.keys(out) as (keyof SiteSettings)[]) {
    const v = partial[k];
    if (typeof v === "string" && v.length > 0) {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Live settings fetch. Always resolves with a complete SiteSettings,
 * falling back to DEFAULT_SETTINGS when the API is unreachable.
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const raw = await apiGetOr<Partial<SiteSettings> | null>(
    "/api/v1/site/settings",
    DEFAULT_SETTINGS
  );
  return fillDefaults(raw);
}
