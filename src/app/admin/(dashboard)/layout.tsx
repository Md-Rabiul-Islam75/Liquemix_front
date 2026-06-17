import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { systemSolutions } from "@/data/solutions";
import { referenceProjects } from "@/data/references";
import { newsPosts } from "@/data/news";
import { videos } from "@/data/videos";
import { standaloneDocuments } from "@/data/downloads";
import { segments } from "@/data/segments";

/**
 * Dashboard layout (everything under /admin except /admin/login).
 *
 * The counts passed here are mock-derived and act only as an instant
 * placeholder for first paint. AdminSidebar then fetches live counts from
 * /api/v1/admin/dashboard/counts on mount and overrides these.
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const counts = {
    segments: segments.length,
    products: products.length,
    categories: categories.length,
    solutions: systemSolutions.length,
    references: referenceProjects.length,
    news: newsPosts.length,
    videos: videos.length,
    downloads: standaloneDocuments.length,
    // No mock enquiries — starts at 0, the live count fills in on mount.
    enquiries: 0,
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <AdminSidebar counts={counts} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
