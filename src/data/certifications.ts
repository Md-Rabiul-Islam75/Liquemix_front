import { apiGetOr } from "@/lib/api";

/**
 * Certifications — logo + name shown in the dynamic strip below the home-page
 * banner (replaces the old hardcoded TrustStrip). Sourced from
 * /api/v1/content/certifications (active only, in display order). Falls back to
 * an empty list so the strip hides when nothing has been added.
 */
export type Certification = {
  id: number;
  name: string;
  logo: string | null;
  displayOrder: number;
  isActive: boolean;
};

export async function fetchCertifications(): Promise<Certification[]> {
  const list = await apiGetOr<Certification[]>(
    "/api/v1/content/certifications",
    []
  );
  return Array.isArray(list) ? list : [];
}
