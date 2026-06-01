"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiInfo, FiLogIn } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import CategoryTree from "@/components/admin/CategoryTree";
import { adminGet, getToken } from "@/lib/adminApi";

type SegmentLite = {
  id: number;
  slug: string;
  name: string;
  color: "blue" | "orange" | "yellow" | "green";
};

const COLOR_DOT: Record<SegmentLite["color"], string> = {
  blue: "bg-primary-500",
  orange: "bg-secondary-500",
  yellow: "bg-accent-500",
  green: "bg-success-500",
};

/**
 * Categories — central UX from ADMIN_PANEL_DESIGN.md §4. One live tree
 * per segment so editors stay focused on a single product family. Each
 * tree is self-contained (fetches its own data, handles its own CRUD)
 * so a save in one segment doesn't refetch the others.
 */
export default function AdminCategoriesPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  const [segments, setSegments] = useState<SegmentLite[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (hasToken !== true) return;
    (async () => {
      try {
        const list = await adminGet<SegmentLite[]>(
          "/api/v1/admin/catalog/segments"
        );
        setSegments(list);
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : "Failed to load segments."
        );
      } finally {
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
          href="/admin/login?next=/admin/categories"
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
        title="Categories"
        description="Hierarchical taxonomy that organises the entire product catalog. Move, rename, and reorder freely — products can attach to one, two, or three categories at any depth."
      />

      <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-primary-50 border border-primary-100 text-sm text-primary-900">
        <FiInfo className="text-base text-primary-600 shrink-0 mt-0.5" />
        <p>
          One tree per segment. Click any node to view or edit it; use the{" "}
          <strong>+</strong> icon on a row (or the side panel) to add a child.
          Move up/down reorders within siblings; changing the{" "}
          <strong>Parent</strong> in the edit form reparents the node — cycles
          are rejected server-side.
        </p>
      </div>

      {!loaded ? (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          Loading segments…
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-error-300 bg-error-50 p-6 text-sm text-error-500">
          {loadError}
        </div>
      ) : (
        segments.map((seg) => (
          <section key={seg.id} className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-900 tracking-wider uppercase">
                <span
                  className={`block w-2 h-2 rounded-full ${COLOR_DOT[seg.color]}`}
                />
                {seg.name}
              </h2>
              <Link
                href={`/admin/products?segment=${seg.id}`}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                View products in segment →
              </Link>
            </div>
            <CategoryTree segmentId={seg.id} segmentName={seg.name} />
          </section>
        ))
      )}
    </>
  );
}
