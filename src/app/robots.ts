import type { MetadataRoute } from "next";

const BASE_URL = "https://liquemix.com";

/**
 * /robots.txt — allow the public site, keep crawlers out of the admin panel
 * and API, and point them at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/login", "/registration"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
