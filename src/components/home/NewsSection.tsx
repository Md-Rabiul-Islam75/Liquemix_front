import Link from "next/link";
import { FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { newsPosts } from "@/data/news";

const CATEGORY_TINT: Record<string, string> = {
  "Product Launch": "bg-secondary-100 text-secondary-800",
  "Company News": "bg-primary-100 text-primary-800",
  Industry: "bg-success-50 text-success-700",
  Project: "bg-accent-100 text-accent-800",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NewsSection() {
  const [lead, ...rest] = newsPosts.slice(0, 4);

  return (
    <section className="section">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow">
              <span className="block w-4 h-px bg-primary-500" /> News & press
            </span>
            <h2 className="section-title mt-3">From the lab and the field.</h2>
            <p className="section-subtitle">
              Product launches, case studies, and the industry trends shaping
              what we build next.
            </p>
          </div>
          <Link href="/news" className="btn-ghost shrink-0">
            All articles <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lead post */}
          <Link
            href={`/news/${lead.slug}`}
            className="lg:col-span-7 group relative aspect-[16/10] rounded-2xl overflow-hidden flex flex-col justify-end"
            style={{
              background:
                "linear-gradient(135deg, #072454 0%, #1565c0 50%, #f57c00 100%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/85 via-neutral-900/30 to-transparent" />
            <div className="relative p-7 md:p-10">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  CATEGORY_TINT[lead.category]
                }`}
              >
                {lead.category}
              </span>
              <h3 className="mt-4 text-2xl md:text-3xl font-bold text-white-base leading-tight text-balance max-w-xl">
                {lead.title}
              </h3>
              <p className="mt-3 text-white/85 max-w-xl text-sm md:text-base line-clamp-2">
                {lead.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-4 text-xs text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <FiCalendar /> {formatDate(lead.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiClock /> {lead.readMinutes} min read
                </span>
              </div>
            </div>
          </Link>

          {/* Side column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group flex gap-4 p-4 rounded-2xl border border-neutral-100 hover:shadow-soft hover:border-primary-200 transition-all"
              >
                <div
                  className="w-28 h-24 shrink-0 rounded-xl"
                  style={{
                    background:
                      post.category === "Project"
                        ? "linear-gradient(135deg, #5c3e00 0%, #ffb300 100%)"
                        : post.category === "Industry"
                        ? "linear-gradient(135deg, #0e3d1a 0%, #2fa84f 100%)"
                        : "linear-gradient(135deg, #0a3674 0%, #3f88d6 100%)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      CATEGORY_TINT[post.category]
                    }`}
                  >
                    {post.category}
                  </span>
                  <h4 className="mt-2 text-sm font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {formatDate(post.publishedAt)} · {post.readMinutes} min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
