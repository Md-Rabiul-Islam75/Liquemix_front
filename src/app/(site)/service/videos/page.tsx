import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import VideoCard from "@/components/video/VideoCard";
import VideoCategoryTabs from "@/components/service/VideoCategoryTabs";
import { fetchVideos, fetchProductVideos, VIDEO_CATEGORIES } from "@/data/videos";
import type { Video } from "@/types/Catalog";

export const metadata: Metadata = {
  title: "Videos — Product demos and application techniques",
  description:
    "Product demonstrations, application techniques, case studies, tutorials, and complete LiqueMix system walkthroughs.",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function VideosPage({ searchParams }: Props) {
  const sp = await searchParams;
  const category = sp.category as Video["category"] | undefined;

  // Two sources of videos surface on this page:
  //   1. Standalone library entries managed under /admin/videos
  //   2. Videos attached to products via the product editor
  // Both fetched in parallel; deduped by youtubeId so a single video
  // never appears twice if it lives in both places.
  const [standalone, fromProducts] = await Promise.all([
    fetchVideos(),
    fetchProductVideos(),
  ]);
  const seen = new Set<string>();
  const all = [...standalone, ...fromProducts].filter((v) => {
    if (seen.has(v.youtubeId)) return false;
    seen.add(v.youtubeId);
    return true;
  });

  const counts = VIDEO_CATEGORIES.reduce<Record<string, number>>((acc, c) => {
    acc[c] = all.filter((v) => v.category === c).length;
    return acc;
  }, {});

  const list = category
    ? all.filter((v) => v.category === category)
    : all;

  return (
    <>
      <PageHeader
        eyebrow="Service · Videos"
        title="See it before you spec it."
        description="Watch LiqueMix products applied on real jobsites — including coverage rates, application techniques, and side-by-side comparisons."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Service", href: "/service" },
          { label: "Videos" },
        ]}
      />

      <section className="section pt-10">
        <div className="container-page space-y-8">
          <VideoCategoryTabs
            categories={VIDEO_CATEGORIES as unknown as string[]}
            counts={counts}
          />

          {list.length === 0 ? (
            <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center">
              <p className="text-lg font-bold text-neutral-900">
                No videos in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
