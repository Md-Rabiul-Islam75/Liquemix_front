import { fetchSiteSettings } from "@/data/settings";
import JsonLd from "@/components/seo/JsonLd";

const BASE_URL = "https://liquemix.com";
const DESCRIPTION =
  "Engineered construction-chemical systems for waterproofing, tile installation, protective flooring, and concrete technology — with full technical documentation and applicator support.";

/**
 * Site-wide Organization + WebSite structured data, rendered once in the root
 * layout. The Organization schema is what tells Google that "LiqueMix" is a
 * real brand/entity (name, logo, socials, contact) — the key signal for the
 * brand to start resolving in search instead of being "corrected" to another
 * word. Social + contact details come from the admin-managed site settings.
 */
export default async function SiteJsonLd() {
  const s = await fetchSiteSettings();

  const sameAs = [s.linkedinUrl, s.facebookUrl].filter(
    (u): u is string => typeof u === "string" && u.trim().length > 0
  );

  const hasContact = Boolean(s.emailSales || s.phoneTel);

  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LiqueMix",
    url: BASE_URL,
    logo: `${BASE_URL}/logo/LiqueMix.png`,
    description: DESCRIPTION,
    ...(sameAs.length ? { sameAs } : {}),
    ...(s.officeAddress
      ? { address: { "@type": "PostalAddress", streetAddress: s.officeAddress } }
      : {}),
    ...(hasContact
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            ...(s.emailSales ? { email: s.emailSales } : {}),
            ...(s.phoneTel ? { telephone: s.phoneTel } : {}),
          },
        }
      : {}),
  };

  const website: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LiqueMix",
    url: BASE_URL,
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
    </>
  );
}
