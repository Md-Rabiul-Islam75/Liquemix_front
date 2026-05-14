import type { Metadata } from "next";
import { FiExternalLink } from "react-icons/fi";
import PageHeader from "@/components/common/PageHeader";

export const metadata: Metadata = {
  title: "Useful Links — Standards, associations, partners",
  description:
    "Industry standards, partner associations, certification bodies, and external resources LiqueMix references in our technical work.",
};

const linkGroups: { title: string; description: string; links: { label: string; url: string; description?: string }[] }[] = [
  {
    title: "Standards & Certification Bodies",
    description: "European and international standards we reference and comply with.",
    links: [
      { label: "EN 1504-3 — Structural and non-structural repair of concrete", url: "https://standards.cencenelec.eu/", description: "European standard for concrete repair products." },
      { label: "EN 12004 — Adhesives for ceramic tiles", url: "https://standards.cencenelec.eu/", description: "Classification and requirements for tile adhesives." },
      { label: "EN 934-2 — Concrete admixtures", url: "https://standards.cencenelec.eu/", description: "Admixtures for concrete, mortar, and grout." },
      { label: "EN 13813 — Screed materials", url: "https://standards.cencenelec.eu/", description: "Screed material properties and requirements." },
      { label: "ISO 9001:2015 — Quality management", url: "https://www.iso.org/iso-9001-quality-management.html" },
    ],
  },
  {
    title: "Industry Associations",
    description: "Trade bodies and technical associations.",
    links: [
      { label: "Bangladesh Building Construction Materials Association", url: "https://example.com/bbcma" },
      { label: "Construction Chemicals Industry Association", url: "https://example.com/ccia" },
      { label: "Cement & Concrete Association", url: "https://example.com/cca" },
    ],
  },
  {
    title: "Technical Partners",
    description: "Laboratories, raw-material partners, and consulting firms we collaborate with.",
    links: [
      { label: "DPI Engineering Group", url: "https://example.com/dpi", description: "Structural engineering consultancy." },
      { label: "Acme Waterproofing Co.", url: "https://example.com/acme", description: "Certified LiqueMix applicator." },
      { label: "Urbana Studio", url: "https://example.com/urbana", description: "Architecture and infrastructure design." },
    ],
  },
];

export default function LinksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Service · Useful Links"
        title="Standards, associations, and partners."
        description="External resources we reference in our technical work — useful for engineers, specifiers, and applicators."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Service", href: "/service" },
          { label: "Useful Links" },
        ]}
      />

      <section className="section pt-10">
        <div className="container-page space-y-10">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <div className="mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
                  {group.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-600">{group.description}</p>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-start gap-3 p-4 rounded-xl bg-white-base border border-neutral-100 hover:border-primary-200 hover:shadow-soft transition-all"
                    >
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                        <FiExternalLink />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700 leading-snug">
                          {l.label}
                        </p>
                        {l.description && (
                          <p className="mt-1 text-xs text-neutral-500">
                            {l.description}
                          </p>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
