import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCalendar,
  FiClock,
  FiTag,
  FiUser,
} from "react-icons/fi";

import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/product/ProductCard";
import { newsPosts, getNewsBySlug, getRelatedNews } from "@/data/news";
import { products } from "@/data/products";
import { getSegmentById } from "@/data/segments";

type Props = { params: Promise<{ slug: string }> };

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
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  return newsPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) notFound();

  const related = getRelatedNews(post.slug, 3);
  const relatedProducts = (post.relatedProductIds ?? [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: post.title },
        ]}
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
      />

      {/* Cover image */}
      <section className="bg-white-base">
        <div className="container-page pt-6 md:pt-10">
          <div
            className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-neutral-800"
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
                priority
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* Body + sidebar */}
      <section className="section">
        <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Body */}
          <article className="lg:col-span-8 order-2 lg:order-1">
            <div
              className="prose-news"
              dangerouslySetInnerHTML={{ __html: post.body ?? `<p>${post.excerpt}</p>` }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-neutral-100">
                <p className="brand-panel__eyebrow mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700"
                    >
                      <FiTag className="text-neutral-400" /> {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="mt-10">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                <FiArrowLeft /> All news
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-28 self-start space-y-4">
            <div className="brand-panel p-6">
              <p className="brand-panel__eyebrow mb-4">Article info</p>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-0.5">
                    <FiCalendar className="text-primary-500" /> Published
                  </dt>
                  <dd className="font-semibold text-neutral-900">
                    {formatDate(post.publishedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-0.5">
                    <FiClock className="text-primary-500" /> Read time
                  </dt>
                  <dd className="font-semibold text-neutral-900">
                    {post.readMinutes} min
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-0.5">
                    <FiTag className="text-primary-500" /> Category
                  </dt>
                  <dd>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_TINT[post.category]}`}
                    >
                      {post.category}
                    </span>
                  </dd>
                </div>
                {post.author && (
                  <div>
                    <dt className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-0.5">
                      <FiUser className="text-primary-500" /> Author
                    </dt>
                    <dd className="font-semibold text-neutral-900">
                      {post.author.name}
                      {post.author.role && (
                        <span className="block text-xs text-neutral-500 font-normal">
                          {post.author.role}
                        </span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {relatedProducts.length > 0 && (
              <div className="brand-panel-blue p-6">
                <p className="brand-panel__eyebrow mb-4">
                  Products in this story
                </p>
                <ul className="space-y-2">
                  {relatedProducts.map((p) => {
                    const seg = getSegmentById(p.segmentId);
                    return (
                      <li key={p.id}>
                        <Link
                          href={`/products/${seg?.slug}/${p.slug}`}
                          className="flex items-center justify-between gap-2 text-sm font-semibold text-primary-700 hover:text-primary-600"
                        >
                          <span>{p.name}</span>
                          <FiArrowUpRight />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Related products as cards */}
      {relatedProducts.length > 0 && (
        <section className="section pt-0 bg-neutral-50">
          <div className="container-page">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
              Related products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related news */}
      {related.length > 0 && (
        <section className="section pt-0 bg-neutral-50">
          <div className="container-page">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
                Keep reading
              </h2>
              <Link
                href="/news"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                All news →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/news/${r.slug}`}
                  className="group rounded-2xl bg-white-base border border-neutral-100 overflow-hidden hover:shadow-soft hover:border-primary-200 transition-all"
                >
                  <div
                    className="relative aspect-[16/10] bg-neutral-200"
                    style={
                      r.coverImage
                        ? undefined
                        : { background: CATEGORY_GRADIENT[r.category] }
                    }
                  >
                    {r.coverImage && (
                      <Image
                        src={encodeURI(r.coverImage)}
                        alt={r.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_TINT[r.category]}`}
                    >
                      {r.category}
                    </span>
                    <h3 className="mt-3 text-base font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-primary-700">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-500">
                      {formatDate(r.publishedAt)} · {r.readMinutes} min
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
