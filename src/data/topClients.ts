import { apiGetOr } from "@/lib/api";

/**
 * Top clients — logo + name shown in the home-page logo carousel above the
 * segments section. Sourced from /api/v1/content/top-clients (active only,
 * in display order). Falls back to an empty list so the section simply hides
 * when the backend is unreachable or nothing has been added.
 */
export type TopClient = {
  id: number;
  name: string;
  logo: string | null;
  displayOrder: number;
  isActive: boolean;
};

export async function fetchTopClients(): Promise<TopClient[]> {
  const list = await apiGetOr<TopClient[]>("/api/v1/content/top-clients", []);
  return Array.isArray(list) ? list : [];
}
