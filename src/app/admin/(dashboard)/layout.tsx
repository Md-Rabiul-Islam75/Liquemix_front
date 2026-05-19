import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { systemSolutions } from "@/data/solutions";
import { referenceProjects } from "@/data/references";
import { newsPosts } from "@/data/news";
import { videos } from "@/data/videos";
import { standaloneDocuments } from "@/data/downloads";

/**
 * Dashboard layout (everything under /admin except /admin/login).
 *
 * Sidebar counts are derived from the mock data at build-time. When the
 * backend lands, this layout becomes either:
 *   • a client-side wrapper that fetches counts via SWR / TanStack Query, or
 *   • a server component that fetches counts via the API on each render.
 * Either way the consumer components (AdminSidebar) keep their props
 * shape unchanged.
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const counts = {
    products: products.length,
    categories: categories.length,
    solutions: systemSolutions.length,
    references: referenceProjects.length,
    news: newsPosts.length,
    videos: videos.length,
    downloads: standaloneDocuments.length,
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
