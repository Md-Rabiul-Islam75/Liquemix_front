import type { MetadataRoute } from "next";
import { fetchAllPublishedProducts } from "@/data/products";
import { fetchSegments, fetchSegmentsMap } from "@/data/segments";
import { fetchSystemSolutions } from "@/data/solutions";
import { fetchNews } from "@/data/news";
import { fetchReferences } from "@/data/references";

const BASE_URL = "https://liquemix.com";

// Regenerate hourly so newly-published products / news / references show up in
// the sitemap without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/solutions`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/references`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/news`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/service`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/service/downloads`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/service/videos`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/service/events`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/service/links`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic content — each fetch already falls back to [] if the API is
  // unreachable, so the sitemap degrades to static routes rather than failing.
  const [products, segments, segMap, solutions, news, references] = await Promise.all([
    fetchAllPublishedProducts(),
    fetchSegments(),
    fetchSegmentsMap(),
    fetchSystemSolutions(),
    fetchNews(),
    fetchReferences(),
  ]);

  const segmentRoutes: MetadataRoute.Sitemap = segments.map((s) => ({
    url: `${BASE_URL}/products/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Product detail URLs are /products/{segment-slug}/{product-slug} — resolve
  // each product's segment slug via the segment map; skip if it can't resolve.
  const productRoutes: MetadataRoute.Sitemap = products.flatMap((p) => {
    const seg = segMap.get(String(p.segmentId));
    if (!seg) return [];
    return [
      {
        url: `${BASE_URL}/products/${seg.slug}/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      },
    ];
  });

  const solutionRoutes: MetadataRoute.Sitemap = solutions.map((s) => ({
    url: `${BASE_URL}/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const newsRoutes: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${BASE_URL}/news/${n.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const referenceRoutes: MetadataRoute.Sitemap = references.map((r) => ({
    url: `${BASE_URL}/references/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...segmentRoutes,
    ...productRoutes,
    ...solutionRoutes,
    ...newsRoutes,
    ...referenceRoutes,
  ];
}
