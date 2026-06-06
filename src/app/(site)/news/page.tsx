import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiClock, FiArrowUpRight } from "react-icons/fi";
import PageHeader from "@/components/common/PageHeader";
import { fetchNews } from "@/data/news";

export const metadata: Metadata = {
  title: "News & Press",
  description:
    "Product launches, case studies, and the industry trends shaping construction chemistry. From the LiqueMix lab and the field.",
};

const CATEGORY_TINT: Record<string, string> = {
  "Product Launch": "bg-secondary-100 text-secondary-800",
  "Company News": "bg-primary-100 text-primary-800",
  Industry: "bg-success-50 text-success-700",
  Project: "bg-accent-100 text-accent-800",
};

const CATEGORY_GRADIENT: Record<string, string> = {
  "Product Launch": "linear-gradient(135deg, #5c2e00 0%, #f57c00 100%)",
  "Company News": "linear-gradient(135deg, #072454 0%, #1565c0 100%)",
  Industry: "linear-gradient(135deg, #0e3d1a 0%, #2fa84f 100%)",
  Project: "linear-gradient(135deg, #5c3e00 0%, #ffb300 100%)",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function NewsListPage({ searchParams }: Props) {
  const sp = await searchParams;
  const activeCategory = sp.category ?? "All";

  const allPosts = await fetchNews();

  const categories = [
    "All",
    ...Array.from(new Set(allPosts.map((p) => p.category))),
  ];

  const filtered =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  const [lead, ...rest] = filtered;

  return (
    <>
      <PageHeader
        eyebrow="News & Press"
        title="From the lab and the field."
        description="Product launches, case studies, and the industry trends shaping what we build next."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News" }]}
      />

      <section className="section pt-10">
        <div className="container-page">
          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
            {categories.map((c) => {
              const isActive = c === activeCategory;
              return (
                <Link
                  key={c}
                  href={c === "All" ? "/news" : `/news?category=${encodeURIComponent(c)}`}
                  scroll={false}
                  className={`shrink-0 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary-500 text-white-base shadow-[0_6px_18px_-6px_rgba(21,101,192,0.5)]"
                      : "bg-white-base border border-neutral-200 text-neutral-700 hover:border-primary-300 hover:text-primary-700"
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center">
              <p className="text-lg font-bold text-neutral-900">
                No posts in this category yet.
              </p>
              <Link
                href="/news"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-600"
              >
                View all news <FiArrowRight />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Lead post */}
              {lead && (
                <Link
                  href={`/news/${lead.slug}`}
                  className="lg:col-span-7 group relative aspect-[16/10] rounded-2xl overflow-hidden flex flex-col justify-end bg-neutral-800"
                  style={
                    lead.coverImage
                      ? undefined
                      : { background: CATEGORY_GRADIENT[lead.category] }
                  }
                >
                  {lead.coverImage && (
                    <Image
                      src={encodeURI(lead.coverImage)}
                      alt={lead.title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/30 to-transparent" />
                  <div className="relative p-7 md:p-10">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_TINT[lead.category]}`}
                    >
                      {lead.category}
                    </span>
                    <h2 className="mt-4 text-2xl md:text-3xl font-bold text-white-base leading-tight text-balance max-w-2xl">
                      {lead.title}
                    </h2>
                    <p className="mt-3 text-white/85 max-w-2xl text-sm md:text-base line-clamp-2">
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
              )}

              {/* Side column */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {rest.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="group flex gap-4 p-4 rounded-2xl border border-neutral-100 hover:shadow-soft hover:border-primary-200 transition-all bg-white-base"
                  >
                    <div
                      className="relative w-28 h-24 shrink-0 rounded-xl overflow-hidden bg-neutral-200"
                      style={
                        post.coverImage
                          ? undefined
                          : { background: CATEGORY_GRADIENT[post.category] }
                      }
                    >
                      {post.coverImage && (
                        <Image
                          src={encodeURI(post.coverImage)}
                          alt={post.title}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_TINT[post.category]}`}
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

              {/* Remaining posts */}
              {rest.length > 3 && (
                <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
                  {rest.slice(3).map((post) => (
                    <Link
                      key={post.id}
                      href={`/news/${post.slug}`}
                      className="group relative aspect-[4/5] rounded-2xl overflow-hidden flex flex-col justify-end bg-neutral-800 shadow-soft hover:shadow-primary hover:-translate-y-1 transition-all duration-300"
                      style={
                        post.coverImage
                          ? undefined
                          : { background: CATEGORY_GRADIENT[post.category] }
                      }
                    >
                      {post.coverImage && (
                        <Image
                          src={encodeURI(post.coverImage)}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/30 to-transparent" />
                      <div className="relative p-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_TINT[post.category]}`}
                        >
                          {post.category}
                        </span>
                        <h3 className="mt-3 text-lg font-bold text-white-base leading-tight">
                          {post.title}
                        </h3>
                        <div className="mt-3 flex items-center justify-between text-xs text-white/70">
                          <span className="inline-flex items-center gap-1.5">
                            <FiCalendar /> {formatDate(post.publishedAt)}
                          </span>
                          <FiArrowUpRight className="text-lg text-accent-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
