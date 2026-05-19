import Link from "next/link";
import { FiArrowUpRight, FiLayers, FiPlus } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import { systemSolutions } from "@/data/solutions";
import { getSegmentById } from "@/data/segments";

export const metadata = { title: "System Solutions" };

export default function AdminSolutionsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="System Solutions"
        description="Engineered multi-layer build-ups. Each solution maps an ordered list of products to a real construction challenge."
        actions={
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiPlus /> New solution
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {systemSolutions.map((s) => {
          const seg = getSegmentById(s.segmentId);
          return (
            <Link
              key={s.id}
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
                  {seg?.name} · {s.productIds.length} products
                </span>
                <FiArrowUpRight className="text-neutral-400 group-hover:text-primary-600" />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
