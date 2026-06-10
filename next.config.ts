import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "sandbox.sslcommerz.com" },
      { protocol: "https", hostname: "placehold.co" },
      // Firebase Storage — product images/datasheets migrated off base64
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
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
