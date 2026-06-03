"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiLayers,
  FiLogIn,
  FiPlus,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import { adminGet, getToken } from "@/lib/adminApi";
import { segments as fallbackSegments } from "@/data/segments";
import type { SystemSolution, Segment } from "@/types/Catalog";

/**
 * Admin landing for System Solutions. Live-only by design — admins
 * should always see what's actually in the DB, never stale mock data.
 * Mock segments are seeded for the chip lookup since segments rarely
 * change and we just need names; solution rows wait for the real list.
 */
export default function AdminSolutionsPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  const [solutions, setSolutions] = useState<SystemSolution[] | null>(null);
  const [segments, setSegments] = useState<Segment[]>(fallbackSegments);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (hasToken !== true) return;
    let cancelled = false;
    (async () => {
      try {
        const [sols, segs] = await Promise.all([
          adminGet<SystemSolution[]>("/api/v1/admin/catalog/solutions"),
          adminGet<Segment[]>("/api/v1/admin/catalog/segments"),
        ]);
        if (cancelled) return;
        setSolutions(Array.isArray(sols) ? sols : []);
        if (Array.isArray(segs) && segs.length > 0) setSegments(segs);
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "Failed to load solutions."
          );
          setSolutions([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasToken]);

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Catalog"
          title="System Solutions"
          description="Sign in to manage system solutions."
        />
        <Link
          href="/admin/login?next=/admin/solutions"
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
        >
          <FiLogIn /> Go to sign in
        </Link>
      </>
    );
  }

  const segById = new Map(segments.map((s) => [String(s.id), s]));
  const loading = hasToken === null || solutions === null;

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="System Solutions"
        description="Engineered multi-layer build-ups. Each solution maps an ordered list of products to a real construction challenge."
        actions={
          <Link
            href="/admin/solutions/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiPlus /> New solution
          </Link>
        }
      />

      {loadError && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-error-300 bg-error-50 p-3 text-sm text-error-500">
          <FiAlertCircle className="mt-0.5 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          Loading solutions…
        </div>
      )}

      {!loading && solutions && solutions.length === 0 && !loadError && (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white-base p-10 text-center">
          <p className="text-sm font-semibold text-neutral-900">
            No solutions yet.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Click <span className="font-semibold">New solution</span> to add the
            first one.
          </p>
        </div>
      )}

      {!loading && solutions && solutions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {solutions.map((s) => {
            const seg = segById.get(String(s.segmentId));
            const productsCount = s.productIds?.length ?? 0;
            return (
              <Link
                key={String(s.id)}
                href={`/admin/solutions/${s.id}`}
                className="group rounded-2xl bg-white-base border border-neutral-100 p-5 hover:border-primary-200 hover:shadow-soft transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
                    <FiLayers /> {s.layers.length} layers
                  </span>
                  <StatusPill status="Published" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 group-hover:text-primary-700">
                  {s.name}
                </h3>
                <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">
                  {s.description}
                </p>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span>
                    {seg?.name ?? s.segmentName ?? "Unknown segment"} ·{" "}
                    {productsCount} products
                  </span>
                  <FiArrowUpRight className="text-neutral-400 group-hover:text-primary-600" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
