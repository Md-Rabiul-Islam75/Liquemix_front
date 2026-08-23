"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  adminGet,
  getToken,
  getCachedUser,
  isHrefLockedForEditor,
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
  FiInbox,
  FiFolder,
  FiGrid,
  FiHome,
  FiImage,
  FiInfo,
  FiLayers,
  FiLock,
  FiLogOut,
  FiMapPin,
  FiSettings,
  FiStar,
  FiUsers,
  FiVideo,
} from "react-icons/fi";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  /** Small "NEW" pill shown to the right of the label (e.g. "New"). */
  badge?: string;
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
  enquiries: number;
};

/**
 * Admin sidebar. Groups mirror the IA in ADMIN_PANEL_DESIGN.md §3.
 * Counts are fetched live from /api/v1/admin/dashboard/counts on mount; each
 * badge renders only once its real number arrives (no mock placeholders).
 */
export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
} = {}) {
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes (i.e. a nav link was
  // tapped). onClose is memoised by the shell, so this only fires on navigation.
  useEffect(() => {
    onClose?.();
  }, [pathname, onClose]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

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

  // Counts appear only once the live numbers load. We deliberately do NOT
  // seed mock placeholders — those would flash misleading counts (e.g.
  // "Products 12") during the brief fetch. Until `live` arrives, each badge
  // simply renders nothing (the count is undefined).
  const c: Partial<Counts> = live;

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
          href: "/admin/banner",
          label: "Banner",
          icon: <FiImage />,
          badge: "New",
        },
        {
          href: "/admin/top-clients",
          label: "Top Clients",
          icon: <FiStar />,
          badge: "New",
        },
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
        {
          href: "/admin/enquiries",
          label: "Enquiries",
          icon: <FiInbox />,
          count: c.enquiries,
        },
        {
          href: "/admin/about",
          label: "About",
          icon: <FiInfo />,
          badge: "New",
        },
      ],
    },
    {
      label: "Settings",
      items: [
        { href: "/admin/settings", label: "Site settings", icon: <FiSettings /> },
        {
          href: "/admin/offices",
          label: "Offices",
          icon: <FiMapPin />,
          badge: "New",
        },
        // User management + audit log are Super-Admin only.
        ...(isSuperAdmin
          ? [
              {
                href: "/admin/users",
                label: "Users & roles",
                icon: <FiUsers />,
              },
              {
                href: "/admin/audit",
                label: "Audit log",
                icon: <FiActivity />,
              },
            ]
          : []),
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile backdrop — tap to close */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 shrink-0 flex flex-col bg-primary-900 text-white-base transition-transform duration-200 ease-out lg:sticky lg:z-auto lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
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
                const locked = isHrefLockedForEditor(me, item.href);
                if (locked) {
                  return (
                    <li key={item.href}>
                      <div
                        aria-disabled="true"
                        title="You don't have access to this section"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/35 cursor-not-allowed select-none"
                      >
                        <span className="text-base text-white/25">{item.icon}</span>
                        <span className="flex-1 min-w-0">{item.label}</span>
                        <FiLock className="text-xs text-white/40" />
                      </div>
                    </li>
                  );
                }
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
                      {item.badge && (
                        <span className="inline-flex items-center px-1.5 h-4 rounded-full bg-secondary-500 text-white-base text-[9px] font-bold uppercase tracking-wide">
                          {item.badge}
                        </span>
                      )}
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
    </>
  );
}
