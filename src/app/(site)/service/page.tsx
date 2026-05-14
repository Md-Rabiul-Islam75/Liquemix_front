import type { Metadata } from "next";
import Link from "next/link";
import { FiDownload, FiPlayCircle, FiCalendar, FiLink, FiArrowUpRight } from "react-icons/fi";
import PageHeader from "@/components/common/PageHeader";

export const metadata: Metadata = {
  title: "Service",
  description:
    "Technical resources for engineers, applicators, and specifiers. Datasheets, application videos, events, and useful links.",
};

const ITEMS = [
  {
    href: "/service/downloads",
    title: "Downloads",
    description:
      "Every technical document in one library — datasheets, brochures, planning folders, checklists, and additional technical information.",
    icon: <FiDownload />,
    accent: "from-primary-600 to-primary-400",
    stats: "24 documents",
  },
  {
    href: "/service/videos",
    title: "Videos",
    description:
      "Product demonstrations, application techniques, case studies, and complete system walkthroughs.",
    icon: <FiPlayCircle />,
    accent: "from-secondary-600 to-secondary-400",
    stats: "12 videos",
  },
  {
    href: "/service/events",
    title: "Events",
    description:
      "Trade fairs, training sessions, on-site demos, and product launch events near you.",
    icon: <FiCalendar />,
    accent: "from-accent-500 to-accent-300",
    stats: "Quarterly",
  },
  {
    href: "/service/links",
    title: "Useful Links",
    description:
      "Industry standards, partner associations, and external resources used in our technical work.",
    icon: <FiLink />,
    accent: "from-success-600 to-success-500",
    stats: "Curated",
  },
];

export default function ServiceHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Service"
        title="Built to support every stage of your project."
        description="From early design to on-site application — find the technical resource, demo, or contact you need."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Service" }]}
      />

      <section className="section">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative rounded-2xl overflow-hidden p-8 min-h-[260px] flex flex-col justify-between text-white-base bg-gradient-to-br ${item.accent} shadow-soft hover:shadow-primary hover:-translate-y-1 transition-all duration-300`}
              >
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 w-40 h-40 rounded-full border border-white/20"
                />
                <div className="relative">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur text-2xl">
                    {item.icon}
                  </span>
                  <h2 className="mt-5 text-2xl font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm text-white/85 max-w-md">
                    {item.description}
                  </p>
                </div>
                <div className="relative flex items-center justify-between mt-6">
                  <span className="text-xs font-bold tracking-wider uppercase text-white/80">
                    {item.stats}
                  </span>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white-base text-neutral-900 group-hover:scale-110 transition-transform">
                    <FiArrowUpRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
