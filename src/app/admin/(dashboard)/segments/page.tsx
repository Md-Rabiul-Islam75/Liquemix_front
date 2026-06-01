"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiEdit,
  FiLock,
  FiLogIn,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import { adminGet, getToken } from "@/lib/adminApi";

type SegmentResponse = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  color: "blue" | "orange" | "yellow" | "green";
  heroImage?: string | null;
  icon?: string | null;
  displayOrder?: number;
  productCount: number;
  solutionCount: number;
};

const COLOR_DOT: Record<SegmentResponse["color"], string> = {
  blue: "bg-primary-500",
  orange: "bg-secondary-500",
  yellow: "bg-accent-500",
  green: "bg-success-500",
};

const COLOR_BAR: Record<SegmentResponse["color"], string> = {
  blue: "from-primary-500 to-primary-700",
  orange: "from-secondary-500 to-secondary-700",
  yellow: "from-accent-500 to-accent-700",
  green: "from-success-500 to-success-700",
};

/**
 * Segments — the 4 brand pillars. Structurally fixed (no create/delete),
 * but editors can update copy, hero image, icon, and reorder. Counts come
 * from the backend so they reflect published reality, not mock data.
 */
export default function AdminSegmentsPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  const [segments, setSegments] = useState<SegmentResponse[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (hasToken !== true) return;
    (async () => {
      try {
        const list = await adminGet<SegmentResponse[]>(
          "/api/v1/admin/catalog/segments"
        );
        setSegments(list);
        setLoaded(true);
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : "Failed to load segments."
        );
        setLoaded(true);
      }
    })();
  }, [hasToken]);

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Catalog"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href="/admin/login?next=/admin/segments"
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
        >
          <FiLogIn /> Go to sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Segments"
        description="The four brand pillars. Structurally fixed — copy and hero imagery are editable. Counts reflect published rows."
        actions={
          <span className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-600">
            <FiLock /> Locked — {segments.length || 4} segments
          </span>
        }
      />

      {!loaded ? (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          Loading segments…
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-error-300 bg-error-50 p-6 text-sm text-error-500">
          {loadError}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {segments.map((s) => (
            <article
              key={s.id}
              className="relative rounded-2xl bg-white-base border border-neutral-100 overflow-hidden hover:border-primary-200 hover:shadow-soft transition-all"
            >
              <span
                aria-hidden
                className={`absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r ${COLOR_BAR[s.color]}`}
              />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-neutral-100 text-neutral-700">
                    <span
                      className={`block w-1.5 h-1.5 rounded-full ${COLOR_DOT[s.color]}`}
                    />
                    {s.color}
                  </span>
                  <Link
                    href={`/admin/segments/${s.id}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                    aria-label="Edit"
                  >
                    <FiEdit />
                  </Link>
                </div>
                <h2 className="mt-3 text-xl font-bold text-neutral-900 leading-tight">
                  {s.name}
                </h2>
                <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">
                  {s.description}
                </p>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <Stat label="Products" value={s.productCount} />
                  <Stat label="Solutions" value={s.solutionCount} />
                  <Stat
                    label="Slug"
                    value={
                      <code className="font-mono text-[10px] text-neutral-500 break-all">
                        {s.slug}
                      </code>
                    }
                  />
                </dl>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    href={`/admin/categories?segment=${s.id}`}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Manage categories →
                  </Link>
                  <Link
                    href={`/products/${s.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-primary-700"
                  >
                    View on site <FiArrowUpRight />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-0.5">
        {label}
      </dt>
      <dd className="text-sm font-bold text-neutral-900">{value}</dd>
    </div>
  );
}
