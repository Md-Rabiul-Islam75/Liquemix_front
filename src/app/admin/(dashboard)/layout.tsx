import AdminShell from "@/components/admin/AdminShell";

/**
 * Dashboard layout (everything under /admin except /admin/login).
 *
 * The interactive shell (mobile-nav drawer state) lives in AdminShell, a
 * client component. AdminSidebar fetches its own live counts from
 * /api/v1/admin/dashboard/counts on mount — no mock placeholders are seeded
 * here (those would flash misleading numbers during the fetch).
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
