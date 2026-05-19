import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "LiqueMix Admin",
    template: "%s · LiqueMix Admin",
  },
  description: "Internal admin panel for the LiqueMix construction-chemical catalog.",
  robots: { index: false, follow: false },
};

/**
 * Root admin layout — intentionally a passthrough so route groups
 * `(auth)` and `(dashboard)` can each install their own chrome
 * (login screen has no sidebar; everything under (dashboard) does).
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
