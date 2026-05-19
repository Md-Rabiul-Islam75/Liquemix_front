import Image from "next/image";
import Link from "next/link";
import {
  FiArrowUpRight,
  FiCalendar,
  FiClock,
  FiMoreVertical,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import { newsPosts } from "@/data/news";

export const metadata = { title: "News & Press" };

const CATEGORY_TINT: Record<string, string> = {
  "Product Launch": "bg-secondary-50 text-secondary-700",
  "Company News": "bg-primary-50 text-primary-700",
  Industry: "bg-success-50 text-success-700",
  Project: "bg-accent-50 text-accent-800",
};

const CATEGORY_GRADIENT: Record<string, string> = {
  "Product Launch": "linear-gradient(135deg, #5c2e00, #f57c00)",
  "Company News": "linear-gradient(135deg, #072454, #1565c0)",
  Industry: "linear-gradient(135deg, #0e3d1a, #2fa84f)",
  Project: "linear-gradient(135deg, #5c3e00, #ffb300)",
};

export default function AdminNewsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="News & Press"
        description="Editorial posts surfaced on the home page and the public /news section."
        actions={
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiPlus /> New post
          </Link>
        }
      />

      <div className="rounded-2xl bg-white-base border border-neutral-100 p-4 mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Search posts..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          defaultValue=""
          className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
        >
          <option value="">All categories</option>
          <option>Product Launch</option>
          <option>Company News</option>
          <option>Industry</option>
          <option>Project</option>
        </select>
      </div>

      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <ul className="divide-y divide-neutral-100">
          {newsPosts.map((n) => (
            <li key={n.id}>
              <Link
                href={`/admin/news/${n.id}`}
                className="group flex items-start gap-4 p-4 hover:bg-neutral-50 transition-colors"
              >
                <div
                  className="relative w-24 h-16 shrink-0 rounded-lg overflow-hidden bg-neutral-200"
                  style={
                    n.coverImage
                      ? undefined
                      : { background: CATEGORY_GRADIENT[n.category] }
                  }
                >
                  {n.coverImage && (
                    <Image
                      src={encodeURI(n.coverImage)}
                      alt={n.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${CATEGORY_TINT[n.category]}`}
                    >
                      {n.category}
                    </span>
                    <StatusPill status="Published" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 leading-snug group-hover:text-primary-700">
                    {n.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 line-clamp-1">
                    {n.excerpt}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <FiCalendar /> {n.publishedAt}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FiClock /> {n.readMinutes} min
                    </span>
                    {n.author && (
                      <span className="text-neutral-400">
                        by {n.author.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 group-hover:text-primary-600">
                    <FiArrowUpRight />
                  </span>
                  <span
                    aria-label="Row menu"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-neutral-100"
                  >
                    <FiMoreVertical />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
