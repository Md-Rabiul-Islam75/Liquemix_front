import Link from "next/link";
import {
  FiActivity,
  FiArrowRight,
  FiArrowUpRight,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiEdit,
  FiFileText,
  FiFolder,
  FiLayers,
  FiPlus,
  FiTrendingUp,
  FiUserPlus,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import { products } from "@/data/products";
import { systemSolutions } from "@/data/solutions";
import { referenceProjects } from "@/data/references";
import { newsPosts } from "@/data/news";
import { categories } from "@/data/categories";
import { videos } from "@/data/videos";

/**
 * Today's date — switched to a stable constant rather than `new Date()` so
 * the static demo renders deterministic copy ("2 hours ago", etc.) and
 * doesn't require client hydration. Replace with live data once the
 * backend's `audit_log` endpoint is up.
 */
const ACTIVITY = [
  {
    icon: <FiEdit />,
    actor: "Fatima Hossain",
    verb: "updated",
    target: "Lique Hydro-Guard 3X",
    targetHref: "/admin/products/prod-hydro-guard-3x",
    when: "2 hours ago",
    accent: "bg-primary-50 text-primary-600",
  },
  {
    icon: <FiPlus />,
    actor: "Imran Karim",
    verb: "added reference",
    target: "Padma Bridge — Bearing Grouting",
    targetHref: "/admin/references/ref-bridge",
    when: "Yesterday",
    accent: "bg-secondary-50 text-secondary-600",
  },
  {
    icon: <FiCheckCircle />,
    actor: "Nusrat Akter",
    verb: "published news",
    target: "ISO 9001 recertification",
    targetHref: "/admin/news/news-iso-9001",
    when: "2 days ago",
    accent: "bg-success-50 text-success-700",
  },
  {
    icon: <FiUserPlus />,
    actor: "Tanvir Rahman",
    verb: "added user",
    target: "rashid@liquemix.com (Editor)",
    targetHref: "/admin/users",
    when: "3 days ago",
    accent: "bg-accent-50 text-accent-800",
  },
  {
    icon: <FiFileText />,
    actor: "Fatima Hossain",
    verb: "uploaded TDS revision",
    target: "Crystal Flex-Skim R03",
    targetHref: "/admin/products/prod-crystal-flex-skim",
    when: "4 days ago",
    accent: "bg-primary-50 text-primary-600",
  },
];

export default function AdminOverviewPage() {
  // No real status field exists yet — treat all current mock products as
  // published, surface "drafts" as those with `isNew` so the UI has
  // something to show. Backend will provide a real `status` field.
  const draftProducts = products.filter((p) => p.isNew).slice(0, 4);
  const recentNews = newsPosts.slice(0, 3);

  const stats = [
    {
      icon: <FiBox />,
      label: "Products",
      value: products.length,
      sub: `${products.filter((p) => p.isFeatured).length} featured · ${
        products.filter((p) => p.isNew).length
      } new`,
      href: "/admin/products",
      tint: "from-primary-500 to-primary-700",
    },
    {
      icon: <FiFolder />,
      label: "Categories",
      value: categories.length,
      sub: `${categories.filter((c) => c.parentId === null).length} top-level`,
      href: "/admin/categories",
      tint: "from-secondary-500 to-secondary-700",
    },
    {
      icon: <FiLayers />,
      label: "System Solutions",
      value: systemSolutions.length,
      sub: "Engineered build-ups",
      href: "/admin/solutions",
      tint: "from-accent-500 to-accent-700",
    },
    {
      icon: <FiTrendingUp />,
      label: "Reference projects",
      value: referenceProjects.length,
      sub: `${
        Array.from(new Set(referenceProjects.map((r) => r.location.country)))
          .length
      } countries`,
      href: "/admin/references",
      tint: "from-success-500 to-success-700",
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Welcome back, Tanvir."
        description="Here's what's happening across the LiqueMix catalog today."
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            <FiPlus /> New product
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group relative rounded-2xl bg-white-base border border-neutral-100 p-5 hover:border-primary-200 hover:shadow-soft transition-all"
          >
            <span
              aria-hidden
              className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${s.tint} rounded-t-2xl`}
            />
            <div className="flex items-start justify-between">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 text-lg">
                {s.icon}
              </span>
              <FiArrowUpRight className="text-neutral-300 group-hover:text-primary-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="mt-4 text-3xl font-bold text-neutral-900 tracking-tight">
              {s.value}
            </p>
            <p className="text-sm font-semibold text-neutral-800">{s.label}</p>
            <p className="mt-1 text-xs text-neutral-500">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity feed */}
        <section className="lg:col-span-8 rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Recent activity
              </h2>
              <p className="text-xs text-neutral-500">
                Every admin write is logged.
              </p>
            </div>
            <Link
              href="/admin/audit"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              View full audit log →
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="flex items-start gap-4 px-5 py-4">
                <span
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-base shrink-0 ${a.accent}`}
                >
                  {a.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-700">
                    <span className="font-semibold text-neutral-900">
                      {a.actor}
                    </span>{" "}
                    {a.verb}{" "}
                    <Link
                      href={a.targetHref}
                      className="font-semibold text-primary-700 hover:text-primary-600"
                    >
                      {a.target}
                    </Link>
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 inline-flex items-center gap-1">
                    <FiClock className="text-[10px]" /> {a.when}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Drafts */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Pending products
                </h2>
                <p className="text-xs text-neutral-500">
                  Marked NEW — review before publishing widely.
                </p>
              </div>
            </div>
            <ul className="divide-y divide-neutral-100">
              {draftProducts.length === 0 ? (
                <li className="px-5 py-6 text-center text-sm text-neutral-500">
                  Nothing to review. Catalog is up to date.
                </li>
              ) : (
                draftProducts.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="group flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-primary-600 text-base shrink-0">
                        <FiBox />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-primary-700">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {p.sku}
                        </p>
                      </div>
                      <FiArrowRight className="text-neutral-400 group-hover:text-primary-600" />
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* Quick actions */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h2 className="text-base font-bold text-neutral-900">
              Quick actions
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Common new-record shortcuts.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/admin/products/new", label: "Product", icon: <FiBox /> },
                {
                  href: "/admin/categories",
                  label: "Category",
                  icon: <FiFolder />,
                },
                {
                  href: "/admin/news/new",
                  label: "News post",
                  icon: <FiFileText />,
                },
                {
                  href: "/admin/downloads",
                  label: "Document",
                  icon: <FiDownload />,
                },
              ].map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className="group flex items-center gap-2 px-3 py-2.5 rounded-lg border border-neutral-100 text-sm font-semibold text-neutral-800 hover:border-primary-200 hover:text-primary-700 hover:bg-primary-50/40 transition-all"
                >
                  <span className="text-base text-primary-600">{q.icon}</span>
                  {q.label}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Recent news at bottom */}
      <section className="mt-6 rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Recent news posts
            </h2>
            <p className="text-xs text-neutral-500">
              What the public site is publishing this week.
            </p>
          </div>
          <Link
            href="/admin/news"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            Manage all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          {recentNews.map((n) => (
            <Link
              key={n.id}
              href={`/admin/news/${n.id}`}
              className="group p-5 hover:bg-neutral-50 transition-colors"
            >
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary-50 text-primary-700">
                {n.category}
              </span>
              <h3 className="mt-2 text-sm font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-primary-700">
                {n.title}
              </h3>
              <p className="mt-1 text-[11px] text-neutral-500">
                {new Date(n.publishedAt).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {n.readMinutes} min
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trace videos / unused — keeps the import alive and gives editors
          one more glance at content health. */}
      <p className="sr-only">{videos.length} videos in library.</p>

      <footer className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <FiActivity /> Backend not yet connected — all data shown is mock.
        </span>
        <Link
          href="/"
          className="font-semibold text-primary-600 hover:text-primary-700"
        >
          View public site →
        </Link>
      </footer>
    </>
  );
}
