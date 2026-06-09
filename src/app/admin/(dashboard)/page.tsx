"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiArrowUpRight,
  FiBox,
  FiClock,
  FiDownload,
  FiFileText,
  FiFolder,
  FiLayers,
  FiLogIn,
  FiTrendingUp,
  FiPlus,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import { adminGet, getToken, getCachedUser, getAdminRole } from "@/lib/adminApi";

type Counts = {
  segments: number;
  categories: number;
  products: number;
  solutions: number;
  references: number;
  news: number;
  videos: number;
  downloads: number;
};

type NewsRow = {
  id: number;
  title: string;
  category: string;
  publishedAt?: string | null;
  readMinutes?: number | null;
  status: string;
};

type ProductRow = { id: number; name: string; sku: string };
type PageOf<T> = { items: T[] };

type AuditRow = {
  id: number;
  actorName?: string | null;
  actorEmail?: string | null;
  summary: string;
  createdAt?: string | null;
};

function timeAgo(d?: string | null) {
  if (!d) return "";
  const s = Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const days = Math.floor(h / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminOverviewPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [news, setNews] = useState<NewsRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [activity, setActivity] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string>("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    setHasToken(getToken() != null);
    setFirstName(getCachedUser()?.firstName ?? "");
    setIsSuperAdmin(getAdminRole() === "SUPER_ADMIN");
  }, []);

  useEffect(() => {
    if (hasToken !== true) {
      setLoading(false);
      return;
    }
    const superAdmin = getAdminRole() === "SUPER_ADMIN";
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [c, n, p, a] = await Promise.all([
        adminGet<Counts>("/api/v1/admin/dashboard/counts").catch(() => null),
        adminGet<NewsRow[]>("/api/v1/admin/content/news").catch(() => []),
        adminGet<PageOf<ProductRow>>(
          "/api/v1/admin/catalog/products?page=1&size=6"
        ).catch(() => ({ items: [] })),
        // Audit is Super-Admin only; skip the call otherwise.
        superAdmin
          ? adminGet<PageOf<AuditRow>>("/api/v1/admin/audit?page=1&size=6").catch(
              () => ({ items: [] }) as PageOf<AuditRow>
            )
          : Promise.resolve({ items: [] } as PageOf<AuditRow>),
      ]);
      if (cancelled) return;
      setCounts(c);
      setNews(n.slice(0, 6));
      setProducts((p.items ?? []).slice(0, 5));
      setActivity((a.items ?? []).slice(0, 6));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [hasToken]);

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader eyebrow="Dashboard" title="Overview" />
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-10 text-center">
          <FiLogIn className="mx-auto text-3xl text-primary-500 mb-3" />
          <p className="text-base font-bold text-neutral-900 mb-1">
            Sign-in required
          </p>
          <Link
            href="/admin/login?next=/admin"
            className="mt-3 inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiLogIn /> Go to sign in
          </Link>
        </div>
      </>
    );
  }

  const stats = [
    {
      icon: <FiBox />,
      label: "Products",
      value: counts?.products,
      sub: "Across all segments",
      href: "/admin/products",
      tint: "from-primary-500 to-primary-700",
    },
    {
      icon: <FiFolder />,
      label: "Categories",
      value: counts?.categories,
      sub: `${counts?.segments ?? "—"} segments`,
      href: "/admin/categories",
      tint: "from-secondary-500 to-secondary-700",
    },
    {
      icon: <FiLayers />,
      label: "System Solutions",
      value: counts?.solutions,
      sub: "Engineered build-ups",
      href: "/admin/solutions",
      tint: "from-accent-500 to-accent-700",
    },
    {
      icon: <FiTrendingUp />,
      label: "Reference projects",
      value: counts?.references,
      sub: "Customer case studies",
      href: "/admin/references",
      tint: "from-success-500 to-success-700",
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Dashboard"
        title={firstName ? `Welcome back, ${firstName}.` : "Overview"}
        description="A live snapshot of everything across the LiqueMix catalog and content."
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
              {loading || s.value == null ? (
                <span className="inline-block w-12 h-8 rounded bg-neutral-200/70 animate-pulse align-middle" />
              ) : (
                s.value
              )}
            </p>
            <p className="text-sm font-semibold text-neutral-800">{s.label}</p>
            <p className="mt-1 text-xs text-neutral-500">{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity — real audit feed, Super Admins only */}
      {isSuperAdmin && (
        <section className="mb-6 rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900 inline-flex items-center gap-2">
                <FiActivity className="text-primary-500" /> Recent activity
              </h2>
              <p className="text-xs text-neutral-500">
                Every admin change is logged automatically.
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
            {loading && (
              <li className="px-5 py-6 text-center text-sm text-neutral-500">
                Loading…
              </li>
            )}
            {!loading && activity.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-neutral-500">
                No activity yet — changes will show here as you and your team
                edit.
              </li>
            )}
            {!loading &&
              activity.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="inline-flex w-2 h-2 rounded-full bg-primary-400 shrink-0" />
                  <p className="flex-1 min-w-0 text-sm text-neutral-700 truncate">
                    <span className="font-semibold text-neutral-900">
                      {a.actorName || a.actorEmail || "Someone"}
                    </span>{" "}
                    {a.summary.charAt(0).toLowerCase() + a.summary.slice(1)}
                  </p>
                  <span className="text-[11px] text-neutral-500 inline-flex items-center gap-1 shrink-0">
                    <FiClock className="text-[10px]" /> {timeAgo(a.createdAt)}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent news (real) */}
        <section className="lg:col-span-8 rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Latest news &amp; press
              </h2>
              <p className="text-xs text-neutral-500">
                Most recent editorial posts.
              </p>
            </div>
            <Link
              href="/admin/news"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              Manage all →
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {loading && (
              <li className="px-5 py-8 text-center text-sm text-neutral-500">
                Loading…
              </li>
            )}
            {!loading && news.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-neutral-500">
                No news posts yet.{" "}
                <Link href="/admin/news/new" className="text-primary-600 font-semibold">
                  Write one →
                </Link>
              </li>
            )}
            {!loading &&
              news.map((n) => (
                <li key={n.id}>
                  <Link
                    href={`/admin/news/${n.id}`}
                    className="group flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors"
                  >
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary-50 text-primary-700 shrink-0">
                      {n.category}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-primary-700">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {fmtDate(n.publishedAt)}
                        {n.status !== "published" && (
                          <span className="ml-2 text-accent-700 font-semibold uppercase">
                            {n.status}
                          </span>
                        )}
                      </p>
                    </div>
                    <FiArrowRight className="text-neutral-400 group-hover:text-primary-600 shrink-0" />
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Recently added products (real) */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Recent products
                </h2>
                <p className="text-xs text-neutral-500">Newest in the catalog.</p>
              </div>
            </div>
            <ul className="divide-y divide-neutral-100">
              {loading && (
                <li className="px-5 py-6 text-center text-sm text-neutral-500">
                  Loading…
                </li>
              )}
              {!loading && products.length === 0 && (
                <li className="px-5 py-6 text-center text-sm text-neutral-500">
                  No products yet.
                </li>
              )}
              {!loading &&
                products.map((p) => (
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
                        <p className="text-[11px] text-neutral-500 truncate font-mono">
                          {p.sku}
                        </p>
                      </div>
                      <FiArrowRight className="text-neutral-400 group-hover:text-primary-600" />
                    </Link>
                  </li>
                ))}
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
                { href: "/admin/news/new", label: "News post", icon: <FiFileText /> },
                { href: "/admin/references/new", label: "Reference", icon: <FiTrendingUp /> },
                { href: "/admin/downloads/new", label: "Document", icon: <FiDownload /> },
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

      <footer className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-end text-xs text-neutral-500">
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
