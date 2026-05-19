import Link from "next/link";
import {
  FiArrowUpRight,
  FiMoreVertical,
  FiPlay,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import { videos } from "@/data/videos";

export const metadata = { title: "Videos" };

const CATEGORY_TINT: Record<string, string> = {
  "Product Demo": "bg-primary-50 text-primary-700",
  "Application Technique": "bg-secondary-50 text-secondary-700",
  "Case Study": "bg-accent-50 text-accent-800",
  Tutorial: "bg-success-50 text-success-700",
  "System Solution": "bg-neutral-100 text-neutral-700",
};

export default function AdminVideosPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Videos"
        description="YouTube-hosted videos surfaced on /service/videos and on related product pages."
        actions={
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiPlus /> Add video
          </Link>
        }
      />

      <div className="rounded-2xl bg-white-base border border-neutral-100 p-4 mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Search videos..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          defaultValue=""
          className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
        >
          <option value="">All categories</option>
          {Object.keys(CATEGORY_TINT).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((v) => (
          <article
            key={v.id}
            className="group rounded-2xl bg-white-base border border-neutral-100 overflow-hidden hover:border-primary-200 hover:shadow-soft transition-all"
          >
            <div className="relative aspect-video bg-neutral-900 grid place-items-center">
              <img
                src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                alt={v.title}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
              <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white-base/95 text-primary-700 text-lg shadow-lg">
                <FiPlay />
              </span>
              {v.durationSeconds && (
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-neutral-900/80 text-white-base text-[10px] font-mono">
                  {Math.floor(v.durationSeconds / 60)}:
                  {String(v.durationSeconds % 60).padStart(2, "0")}
                </span>
              )}
            </div>
            <div className="p-4">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${CATEGORY_TINT[v.category]}`}
              >
                {v.category}
              </span>
              <h3 className="mt-2 text-sm font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-primary-700">
                {v.title}
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <code className="font-mono text-[10px] text-neutral-400">
                  {v.youtubeId}
                </code>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/videos/${v.id}`}
                    aria-label="Edit"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                  >
                    <FiArrowUpRight />
                  </Link>
                  <span
                    aria-label="Row menu"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md text-neutral-500 hover:bg-neutral-100"
                  >
                    <FiMoreVertical />
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
