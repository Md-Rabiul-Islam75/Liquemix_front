"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  adminGet,
  getToken,
  getCachedUser,
  type AdminRoleName,
  type AdminUser,
} from "@/lib/adminApi";
import {
  FiActivity,
  FiArchive,
  FiBarChart2,
  FiBookOpen,
  FiBox,
  FiClipboard,
  FiDownload,
  FiFolder,
  FiGrid,
  FiHome,
  FiLayers,
  FiLogOut,
  FiSettings,
  FiUsers,
  FiVideo,
} from "react-icons/fi";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

type Counts = {
  segments: number;
  products: number;
  categories: number;
  solutions: number;
  references: number;
  news: number;
  videos: number;
  downloads: number;
};

/**
 * Admin sidebar. Groups mirror the IA in ADMIN_PANEL_DESIGN.md §3.
 * The `counts` prop is a mock-derived placeholder for first paint; on mount
 * we fetch live counts from /api/v1/admin/dashboard/counts and override.
 */
export default function AdminSidebar({ counts }: { counts: Counts }) {
  const pathname = usePathname();

  const [live, setLive] = useState<Partial<Counts>>({});
  useEffect(() => {
    if (getToken() == null) return;
    let cancelled = false;
    adminGet<Counts>("/api/v1/admin/dashboard/counts")
      .then((c) => {
        if (!cancelled) setLive(c);
      })
      .catch(() => {
        /* keep the placeholder counts on failure */
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Live numbers win once loaded; placeholders show instantly meanwhile.
  const c: Counts = { ...counts, ...live };

  // Signed-in admin (for the footer + role-based nav gating).
  const [me, setMe] = useState<AdminUser | null>(null);
  useEffect(() => {
    setMe(getCachedUser());
  }, [pathname]);
  const myRole: AdminRoleName | null = me?.adminRole ?? null;
  const isSuperAdmin = myRole === "SUPER_ADMIN";
  const initials = me
    ? `${me.firstName ?? ""} ${me.lastName ?? ""}`
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "AD"
    : "AD";
  const fullName =
    me && (me.firstName || me.lastName)
      ? `${me.firstName ?? ""} ${me.lastName ?? ""}`.trim()
      : me?.email ?? "Admin";
  const roleLabel = myRole ? myRole.replace("_", " ").toLowerCase() : "admin";

  const groups: NavGroup[] = [
    {
      label: "Dashboard",
      items: [{ href: "/admin", label: "Overview", icon: <FiHome /> }],
    },
    {
      label: "Catalog",
      items: [
        {
          href: "/admin/segments",
          label: "Segments",
          icon: <FiGrid />,
          count: c.segments,
        },
        {
          href: "/admin/categories",
          label: "Categories",
          icon: <FiFolder />,
          count: c.categories,
        },
        {
          href: "/admin/products",
          label: "Products",
          icon: <FiBox />,
          count: c.products,
        },
        {
          href: "/admin/solutions",
          label: "System Solutions",
          icon: <FiLayers />,
          count: c.solutions,
        },
      ],
    },
    {
      label: "Content",
      items: [
        {
          href: "/admin/references",
          label: "References",
          icon: <FiBarChart2 />,
          count: c.references,
        },
        {
          href: "/admin/news",
          label: "News & Press",
          icon: <FiBookOpen />,
          count: c.news,
        },
        {
          href: "/admin/videos",
          label: "Videos",
          icon: <FiVideo />,
          count: c.videos,
        },
        {
          href: "/admin/downloads",
          label: "Downloads",
          icon: <FiDownload />,
          count: c.downloads,
        },
      ],
    },
    {
      label: "Settings",
      items: [
        { href: "/admin/settings", label: "Site settings", icon: <FiSettings /> },
        // User management is Super-Admin only.
        ...(isSuperAdmin
          ? [
              {
                href: "/admin/users",
                label: "Users & roles",
                icon: <FiUsers />,
              },
            ]
          : []),
        { href: "/admin/audit", label: "Audit log", icon: <FiActivity /> },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-primary-900 text-white-base h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/logo/LiqueMix.png"
            alt="LiqueMix"
            width={150}
            height={40}
            className="h-8 w-auto brightness-0 invert"
            priority
          />
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold tracking-wider uppercase text-accent-300">
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-bold tracking-[0.22em] uppercase text-white/40">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-white/10 text-white-base"
                          : "text-white/70 hover:bg-white/5 hover:text-white-base"
                      }`}
                    >
                      <span
                        className={`text-base ${active ? "text-accent-300" : "text-white/50"}`}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1 min-w-0">{item.label}</span>
                      {typeof item.count === "number" && (
                        <span
                          className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold ${
                            active ? "bg-accent-500 text-neutral-900" : "bg-white/10 text-white/70"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / user */}
      <div className="border-t border-white/10 px-3 py-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white-base transition-colors"
        >
          <FiClipboard className="text-base text-white/50" />
          <span>View public site</span>
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white-base transition-colors"
        >
          <FiArchive className="text-base text-white/50" />
          <span>Switch workspace</span>
        </Link>
        <div className="px-3 pt-3 mt-2 border-t border-white/10 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent-500 text-neutral-900 text-sm font-bold">
            {initials}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white-base truncate">
              {fullName}
            </p>
            <p className="text-[11px] text-white/60 truncate capitalize">
              {roleLabel}
            </p>
          </div>
          <Link
            href="/admin/login"
            aria-label="Sign out"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-white/60 hover:bg-white/10 hover:text-white-base"
          >
            <FiLogOut />
          </Link>
        </div>
      </div>
    </aside>
  );
}
