import type { NextConfig } from "next";

// Allow next/image to load files served by the Spring Boot backend
// (http://localhost:8000/files/... in dev, the prod API host in prod).
// Derived from the same env var the data layer uses, so it tracks any
// environment without a second place to edit.
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const apiUrl = new URL(apiBase);
const apiImagePattern = {
  protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
  hostname: apiUrl.hostname,
  ...(apiUrl.port ? { port: apiUrl.port } : {}),
};

// Next 16's image optimizer refuses to fetch hosts that resolve to a
// private/loopback IP (an SSRF guard) — which blocks the dev backend on
// localhost. So in local dev we skip optimization and let the browser load
// files directly; in prod (a real public API host) optimization stays on.
const isLocalApi =
  apiUrl.hostname === "localhost" ||
  apiUrl.hostname === "127.0.0.1" ||
  apiUrl.hostname === "::1" ||
  apiUrl.hostname === "0.0.0.0";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: isLocalApi,
    remotePatterns: [
      { protocol: "https", hostname: "sandbox.sslcommerz.com" },
      { protocol: "https", hostname: "placehold.co" },
      // Backend file storage — product images/datasheets served at /files/**
      apiImagePattern,
    ],
  },
  async rewrites() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${baseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
