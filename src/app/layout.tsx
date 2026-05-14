import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/redux/store/StoreProvider";
import { Toaster } from "sonner";

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
  openGraph: {
    title: "LiqueMix — Construction Chemical & Industrial Solutions",
    description:
      "Engineered construction-chemical systems for waterproofing, tile, flooring, and concrete technology.",
    type: "website",
    siteName: "LiqueMix",
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
        <StoreProvider>
          {children}
          <Toaster position="top-right" expand={false} richColors closeButton />
        </StoreProvider>
      </body>
    </html>
  );
}
