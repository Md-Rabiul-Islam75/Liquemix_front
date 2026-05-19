import Link from "next/link";
import { FiArrowUpRight, FiEdit, FiLock } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import { segments } from "@/data/segments";
import { products } from "@/data/products";
import { systemSolutions } from "@/data/solutions";

export const metadata = { title: "Segments" };

const COLOR_DOT: Record<string, string> = {
  blue: "bg-primary-500",
  orange: "bg-secondary-500",
  yellow: "bg-accent-500",
  green: "bg-success-500",
};

const COLOR_BAR: Record<string, string> = {
  blue: "from-primary-500 to-primary-700",
  orange: "from-secondary-500 to-secondary-700",
  yellow: "from-accent-500 to-accent-700",
  green: "from-success-500 to-success-700",
};

/**
 * Segments — the 4 brand pillars. Mostly read-only at the structural
 * level (renaming or adding a 5th segment is a design decision, not an
 * admin action), but editors can still update copy, hero image, icon.
 */
export default function AdminSegmentsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Segments"
        description="The four brand pillars. Structurally fixed — copy and hero imagery are editable."
        actions={
          <span className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-600">
            <FiLock /> Locked — 4 segments
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {segments.map((s) => {
          const productCount = products.filter(
            (p) => p.segmentId === s.id
          ).length;
          const solutionCount = systemSolutions.filter(
            (sol) => sol.segmentId === s.id
          ).length;
          return (
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
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-neutral-100 text-neutral-700`}
                  >
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
                  <Stat label="Products" value={productCount} />
                  <Stat label="Solutions" value={solutionCount} />
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
                    href={`/admin/categories#${s.id}`}
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
          );
        })}
      </div>
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
