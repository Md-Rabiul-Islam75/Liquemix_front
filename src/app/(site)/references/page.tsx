import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import PageHeader from "@/components/common/PageHeader";
import ReferenceFilters from "@/components/reference/ReferenceFilters";
import { referenceProjects } from "@/data/references";
import { segments } from "@/data/segments";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Reference Projects",
  description:
    "Discover how LiqueMix construction-chemical systems perform on the ground — from metro stations and bridges to swimming pools and pharmaceutical plants.",
};

type Props = {
  searchParams: Promise<{
    segment?: string;
    type?: string;
    country?: string;
    year?: string;
  }>;
};

export default async function ReferencesPage({ searchParams }: Props) {
  const sp = await searchParams;

  // Build filter option lists from data
  const segmentOptions = segments.map((s) => ({ value: s.id, label: s.name }));
  const projectTypes = Array.from(
    new Set(referenceProjects.map((r) => r.projectType))
  )
    .sort()
    .map((t) => ({ value: t, label: t }));
  const countries = Array.from(
    new Set(referenceProjects.map((r) => r.location.country))
  )
    .sort()
    .map((c) => ({ value: c, label: c }));
  const years = Array.from(new Set(referenceProjects.map((r) => r.year)))
    .sort((a, b) => b - a)
    .map((y) => ({ value: String(y), label: String(y) }));

  // Apply filters
  let filtered = [...referenceProjects];
  if (sp.segment) {
    const productIdsInSegment = products
      .filter((p) => p.segmentId === sp.segment)
      .map((p) => p.id);
    filtered = filtered.filter((r) =>
      r.productsUsed.some((pid) => productIdsInSegment.includes(pid))
    );
  }
  if (sp.type) filtered = filtered.filter((r) => r.projectType === sp.type);
  if (sp.country)
    filtered = filtered.filter((r) => r.location.country === sp.country);
  if (sp.year) filtered = filtered.filter((r) => String(r.year) === sp.year);

  return (
    <>
      <PageHeader
        eyebrow="References"
        title="Trusted on landmark projects."
        description="From three-level basements to bridge bearings — every reference project is documented with the LiqueMix system specified and the on-site outcome."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "References" },
        ]}
      />

      <section className="section pt-10">
        <div className="container-page space-y-8">
          <ReferenceFilters
            segments={segmentOptions}
            projectTypes={projectTypes}
            countries={countries}
            years={years}
            total={referenceProjects.length}
            filtered={filtered.length}
          />

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center">
              <p className="text-lg font-bold text-neutral-900">
                No references match your filters.
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Try resetting the filters to see all projects.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((ref, i) => {
                const gradients = [
                  "linear-gradient(135deg, #072454, #1565c0)",
                  "linear-gradient(135deg, #5c2e00, #f57c00)",
                  "linear-gradient(135deg, #5c3e00, #ffb300)",
                  "linear-gradient(135deg, #0e3d1a, #2fa84f)",
                  "linear-gradient(135deg, #0a3674, #3f88d6)",
                  "linear-gradient(135deg, #8a4500, #fb8c25)",
                ];
                return (
                  <Link
                    key={ref.id}
                    href={`/references/${ref.slug}`}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden flex flex-col justify-end shadow-soft hover:shadow-primary hover:-translate-y-1 transition-all duration-300"
                    style={{ background: gradients[i % gradients.length] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 14px)",
                      }}
                    />
                    <div className="relative p-5">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent-300">
                        <FiMapPin /> {ref.location.city}, {ref.location.country}
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-white-base leading-tight">
                        {ref.title}
                      </h3>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-white/70">
                          {ref.projectType} · {ref.year}
                        </p>
                        <FiArrowUpRight className="text-xl text-accent-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
