import { apiGetOr } from "@/lib/api";
import { type SiteSettings } from "@/data/settings";

/**
 * Offices — the company's office locations. Rendered as address cards on the
 * public /contact page and as a lean HQ + "also in …" line in the footer.
 * Sourced from /api/v1/content/offices (active only, in display order). Falls
 * back to an empty list; callers synthesise a single HQ from site settings so
 * the pages never blank when nothing has been added yet.
 *
 * Field names match the backend OfficeResponse one-to-one.
 */
export type Office = {
  id: number;
  label: string;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  mapLink: string | null;
  isHeadquarters: boolean;
  displayOrder: number;
  isActive: boolean;
};

export async function fetchOffices(): Promise<Office[]> {
  const list = await apiGetOr<Office[]>("/api/v1/content/offices", []);
  return Array.isArray(list) ? list : [];
}

/**
 * The office list to actually render. Uses the live offices when present;
 * otherwise synthesises a single head office from site settings so /contact
 * and the footer always show a real address, even before any office is added.
 */
export function officesOrFallback(
  offices: Office[],
  settings: SiteSettings
): Office[] {
  if (offices.length > 0) return offices;
  return [
    {
      id: 0,
      label: "Bangladesh",
      city: "Dhaka",
      address: settings.officeAddress,
      phone: settings.phoneDisplay,
      email: settings.emailGeneral,
      mapLink: settings.mapLink,
      isHeadquarters: true,
      displayOrder: 0,
      isActive: true,
    },
  ];
}

/** The head office (flagged HQ, else the first) from a non-empty list. */
export function headquarters(offices: Office[]): Office | null {
  if (offices.length === 0) return null;
  return offices.find((o) => o.isHeadquarters) ?? offices[0];
}

/** A `tel:` value from a human-formatted phone (keeps digits and a leading +). */
export function telHref(phone: string | null | undefined): string {
  return `tel:${(phone ?? "").replace(/[^\d+]/g, "")}`;
}

// Country name → ISO-3166 alpha-2 code (lowercase), for the `flag-icons` SVG
// flags used in the UI (real flags render on every OS, unlike emoji flags
// which show as letters on Windows). Matched by substring against the label.
const CODES: Record<string, string> = {
  bangladesh: "bd",
  india: "in",
  "sri lanka": "lk",
  srilanka: "lk",
  "united arab emirates": "ae",
  uae: "ae",
  pakistan: "pk",
  nepal: "np",
  bhutan: "bt",
  maldives: "mv",
  qatar: "qa",
  "saudi arabia": "sa",
  singapore: "sg",
  malaysia: "my",
  china: "cn",
  "united kingdom": "gb",
  usa: "us",
  "united states": "us",
};

/** ISO alpha-2 code for an office label, or null when unknown. */
export function countryCode(label: string | null | undefined): string | null {
  if (!label) return null;
  const key = label.toLowerCase().trim();
  for (const [name, code] of Object.entries(CODES)) {
    if (key.includes(name)) return code;
  }
  return null;
}
