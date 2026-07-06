"use client";

import { useCallback, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

/**
 * Client shell for the admin dashboard. Owns the mobile-nav open state and
 * shares it between the topbar hamburger (opens) and the sidebar drawer
 * (renders as an off-canvas drawer below lg, static column at lg+).
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  // Stable identities so the sidebar's close-on-navigation effect doesn't
  // re-fire on every render.
  const openNav = useCallback(() => setNavOpen(true), []);
  const closeNav = useCallback(() => setNavOpen(false), []);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <AdminSidebar mobileOpen={navOpen} onClose={closeNav} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar onMenuClick={openNav} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
