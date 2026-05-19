import Link from "next/link";
import {
  FiArrowUpRight,
  FiDownload,
  FiFile,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiUpload,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import { standaloneDocuments, DOWNLOAD_CATEGORIES } from "@/data/downloads";

export const metadata = { title: "Downloads" };

function formatBytes(kb?: number) {
  if (!kb) return "—";
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function AdminDownloadsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Downloads"
        description="Standalone technical documents — brochures, planning folders, ATIs, and SDS files surfaced on /service/downloads."
        actions={
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiUpload /> Upload document
          </Link>
        }
      />

      <div className="rounded-2xl bg-white-base border border-neutral-100 p-4 mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Search documents..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          defaultValue=""
          className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
        >
          <option value="">All categories</option>
          {DOWNLOAD_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3 text-left">Document</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Language</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Uploaded</th>
              <th className="px-4 py-3 text-right w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {standaloneDocuments.map((d) => (
              <tr key={d.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/downloads/${d.id}`}
                    className="group flex items-center gap-3"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 text-base shrink-0">
                      <FiFile />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 truncate group-hover:text-primary-700">
                        {d.title}
                      </p>
                      {d.description && (
                        <p className="text-xs text-neutral-500 truncate max-w-md">
                          {d.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">
                  {d.category}
                </td>
                <td className="px-4 py-3 text-neutral-700">{d.language}</td>
                <td className="px-4 py-3 text-neutral-700 font-mono text-xs">
                  {formatBytes(d.fileSizeKb)}
                </td>
                <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap">
                  {d.uploadedAt}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Download"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <FiDownload />
                    </a>
                    <Link
                      href={`/admin/downloads/${d.id}`}
                      aria-label="Edit"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <FiArrowUpRight />
                    </Link>
                    <span
                      aria-label="Row menu"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-neutral-100"
                    >
                      <FiMoreVertical />
                    </span>
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
