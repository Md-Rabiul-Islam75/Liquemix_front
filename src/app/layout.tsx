import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { StoreProvider } from "@/redux/store/StoreProvider";
import { Toaster } from "sonner";
import RouteProgress from "@/components/common/RouteProgress";
import SiteJsonLd from "@/components/seo/SiteJsonLd";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LiqueMix — Construction Chemical & Industrial Solutions",
    template: "%s · LiqueMix",
  },
  description:
    "Engineered construction-chemical systems for waterproofing, tile installation, protective flooring, and concrete technology. Complete technical documentation, applicator support, and a guaranteed service life.",
  metadataBase: new URL("https://liquemix.com"),
  applicationName: "LiqueMix",
  keywords: [
    "LiqueMix",
    "construction chemicals",
    "waterproofing",
    "tile adhesive",
    "protective flooring",
    "concrete admixtures",
    "grouts",
    "building chemistry",
  ],
  authors: [{ name: "LiqueMix" }],
  openGraph: {
    title: "LiqueMix — Construction Chemical & Industrial Solutions",
    description:
      "Engineered construction-chemical systems for waterproofing, tile, flooring, and concrete technology.",
    type: "website",
    siteName: "LiqueMix",
    url: "https://liquemix.com",
    images: [{ url: "/logo/LiqueMix.png", alt: "LiqueMix" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LiqueMix — Construction Chemical & Industrial Solutions",
    description:
      "Engineered construction-chemical systems for waterproofing, tile, flooring, and concrete technology.",
    images: ["/logo/LiqueMix.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <SiteJsonLd />
        <StoreProvider>
          <RouteProgress />
          {children}
          <Toaster position="top-right" expand={false} richColors closeButton />
        </StoreProvider>
      </body>
    </html>
  );
}
