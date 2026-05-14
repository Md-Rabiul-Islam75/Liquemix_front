import type { Metadata } from "next";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import PageHeader from "@/components/common/PageHeader";

export const metadata: Metadata = {
  title: "Events — Trade fairs, training, and demos",
  description:
    "Find LiqueMix at upcoming trade fairs, applicator training sessions, on-site demos, and product launch events.",
};

const upcomingEvents = [
  {
    name: "Bauma Bangladesh 2026",
    type: "Trade Fair",
    location: "Dhaka International Convention City",
    date: "2026-08-12",
    description:
      "Visit LiqueMix at Hall B, Stand 22 — live demos of Hydro-Guard 3X and the new Pump Primer system.",
  },
  {
    name: "Applicator Training — Basement Waterproofing",
    type: "Training",
    location: "LiqueMix Technical Centre, Gazipur",
    date: "2026-06-22",
    description:
      "One-day hands-on training for waterproofing applicators. Substrate prep, mix design, spray application, and pull-off testing.",
  },
  {
    name: "Concrete Technology Roundtable",
    type: "Webinar",
    location: "Online",
    date: "2026-07-08",
    description:
      "Panel discussion with structural engineers on hot-weather concreting, retarder performance, and SCC mix design.",
  },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Service · Events"
        title="Where to find us next."
        description="Trade fairs, training sessions, on-site demos, and product-launch events. Subscribe to our newsletter to be notified first."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Service", href: "/service" },
          { label: "Events" },
        ]}
      />

      <section className="section pt-10">
        <div className="container-page">
          <div className="space-y-4">
            {upcomingEvents.map((ev) => (
              <article
                key={ev.name}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-7 rounded-2xl bg-white-base border border-neutral-100 hover:shadow-soft transition-shadow"
              >
                <div className="md:col-span-3 flex md:flex-col items-start md:items-start gap-3 md:gap-1">
                  <span className="chip-segment-blue">{ev.type}</span>
                  <p className="text-2xl md:text-3xl font-bold text-neutral-900 leading-tight">
                    {new Date(ev.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                    })}
                  </p>
                  <p className="text-sm font-semibold text-neutral-600">
                    {new Date(ev.date).toLocaleDateString("en-GB", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="md:col-span-9">
                  <h2 className="text-lg md:text-xl font-bold text-neutral-900">
                    {ev.name}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {ev.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1.5">
                      <FiCalendar /> {formatDate(ev.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FiMapPin /> {ev.location}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-neutral-900 text-white-base p-7 md:p-10 text-center">
            <p className="text-sm font-bold tracking-wider uppercase text-accent-400 mb-2">
              Stay informed
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              Be the first to know about LiqueMix events.
            </h2>
            <p className="mt-2 text-white/80 max-w-xl mx-auto text-sm">
              Get a monthly digest of upcoming trade fairs, training programmes,
              and new product launches.
            </p>
            <a
              href="/contact?subject=newsletter"
              className="btn-accent inline-flex mt-6"
            >
              Subscribe to the newsletter
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
