import type { Metadata } from "next";
import { FiFile, FiDownload } from "react-icons/fi";
import PageHeader from "@/components/common/PageHeader";
import DownloadCategoryTabs from "@/components/service/DownloadCategoryTabs";
import {
  standaloneDocuments,
  DOWNLOAD_CATEGORIES,
} from "@/data/downloads";
import { fetchSegmentsMap } from "@/data/segments";

export const metadata: Metadata = {
  title: "Downloads — Technical document library",
  description:
    "Every LiqueMix datasheet, brochure, planning folder, ATI, and checklist in one searchable library.",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function DownloadsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const category = sp.category;

  const segMap = await fetchSegmentsMap();

  const counts = DOWNLOAD_CATEGORIES.reduce<Record<string, number>>(
    (acc, c) => {
      acc[c] = standaloneDocuments.filter((d) => d.category === c).length;
      return acc;
    },
    {}
  );

  const list = category
    ? standaloneDocuments.filter((d) => d.category === category)
    : standaloneDocuments;

  // Group remaining list by category for nicer presentation
  const grouped = DOWNLOAD_CATEGORIES.map((c) => ({
    category: c,
    docs: list.filter((d) => d.category === c),
  })).filter((g) => g.docs.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Service · Downloads"
        title="Technical document library."
        description="Every LiqueMix datasheet, brochure, planning folder, ATI, checklist, and reference document — searchable and filterable in one place."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Service", href: "/service" },
          { label: "Downloads" },
        ]}
      />

      <section className="section pt-10">
        <div className="container-page space-y-8">
          <DownloadCategoryTabs
            categories={DOWNLOAD_CATEGORIES as unknown as string[]}
            counts={counts}
          />

          {grouped.length === 0 ? (
            <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center">
              <p className="text-lg font-bold text-neutral-900">
                No documents in this category yet.
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Documents are uploaded by Admin and appear here once approved.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {grouped.map((g) => (
                <div key={g.category}>
                  <div className="flex items-baseline justify-between mb-4">
                    <h2 className="text-lg font-bold text-neutral-900">
                      {g.category}
                    </h2>
                    <span className="text-xs text-neutral-500">
                      {g.docs.length} document{g.docs.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {g.docs.map((d) => {
                      const seg = d.segmentId
                        ? segMap.get(String(d.segmentId))
                        : null;
                      return (
                        <li key={d.id}>
                          <a
                            href={d.url}
                            download
                            className="group flex items-start gap-3 p-4 rounded-xl bg-white-base border border-neutral-100 hover:border-primary-200 hover:shadow-soft transition-all"
                          >
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                              <FiFile />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-primary-700">
                                {d.title}
                              </p>
                              {d.description && (
                                <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                                  {d.description}
                                </p>
                              )}
                              <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-400">
                                {seg && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-semibold">
                                    {seg.name.split(" ")[0]}
                                  </span>
                                )}
                                <span>{d.language}</span>
                                {d.fileSizeKb && <span>· {d.fileSizeKb} KB</span>}
                              </div>
                            </div>
                            <FiDownload className="text-neutral-400 group-hover:text-primary-600 shrink-0 mt-1" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
