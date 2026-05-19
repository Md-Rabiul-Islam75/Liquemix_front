import Image from "next/image";
import Link from "next/link";
import {
  FiArrowUpRight,
  FiCalendar,
  FiMapPin,
  FiMoreVertical,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import { referenceProjects } from "@/data/references";

export const metadata = { title: "Reference Projects" };

export default function AdminReferencesPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Reference projects"
        description="Real installations of LiqueMix systems. The strongest social proof on the public site."
        actions={
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiPlus /> New reference
          </Link>
        }
      />

      <div className="rounded-2xl bg-white-base border border-neutral-100 p-4 mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Search by title, type, location..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          defaultValue=""
          className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
        >
          <option value="">All countries</option>
          <option>Bangladesh</option>
        </select>
        <select
          defaultValue=""
          className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
        >
          <option value="">All years</option>
          {Array.from(new Set(referenceProjects.map((r) => r.year)))
            .sort((a, b) => b - a)
            .map((y) => (
              <option key={y}>{y}</option>
            ))}
        </select>
      </div>

      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3 text-left">Project</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">Products</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {referenceProjects.map((r) => (
              <tr key={r.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/references/${r.id}`}
                    className="group flex items-center gap-3 min-w-0"
                  >
                    <div className="relative w-12 h-10 shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                      <Image
                        src={encodeURI(r.heroImage)}
                        alt={r.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <span className="font-semibold text-neutral-900 truncate group-hover:text-primary-700">
                      {r.title}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-700">{r.projectType}</td>
                <td className="px-4 py-3 text-neutral-700">
                  <span className="inline-flex items-center gap-1">
                    <FiMapPin className="text-neutral-400" />
                    {r.location.city}, {r.location.country}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  <span className="inline-flex items-center gap-1">
                    <FiCalendar className="text-neutral-400" /> {r.year}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center min-w-7 h-6 px-2 rounded-full bg-neutral-100 text-xs font-bold text-neutral-700">
                    {r.productsUsed.length}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status="Published" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      href={`/admin/references/${r.id}`}
                      aria-label="Edit"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <FiArrowUpRight />
                    </Link>
                    <button
                      type="button"
                      aria-label="Row menu"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-neutral-100"
                    >
                      <FiMoreVertical />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
