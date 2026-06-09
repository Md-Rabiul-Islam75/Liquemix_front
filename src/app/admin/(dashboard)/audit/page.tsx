"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEdit,
  FiLogIn,
  FiPlus,
  FiRotateCcw,
  FiShield,
  FiSlash,
  FiTrash,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import { adminGet, getToken, getAdminRole } from "@/lib/adminApi";

type AuditRow = {
  id: number;
  actorEmail?: string | null;
  actorName?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  summary: string;
  method: string;
  path: string;
  createdAt?: string | null;
};

type PageOf<T> = {
  items: T[];
  total: number;
  page: number;
  pages: number;
};

const ACTION_STYLE: Record<
  string,
  { icon: React.ReactNode; tint: string }
> = {
  Created: { icon: <FiPlus />, tint: "bg-success-50 text-success-700" },
  Updated: { icon: <FiEdit />, tint: "bg-primary-50 text-primary-600" },
  Deleted: { icon: <FiTrash />, tint: "bg-error-50 text-error-500" },
  Published: { icon: <FiCheckCircle />, tint: "bg-accent-50 text-accent-800" },
  Unpublished: { icon: <FiSlash />, tint: "bg-neutral-100 text-neutral-600" },
  "Reset password": {
    icon: <FiRotateCcw />,
    tint: "bg-secondary-50 text-secondary-700",
  },
};

function timeAgo(d?: string | null) {
  if (!d) return "";
  const then = new Date(d).getTime();
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AuditLogPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [data, setData] = useState<PageOf<AuditRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 30;

  useEffect(() => {
    setHasToken(getToken() != null);
    setRole(getAdminRole());
  }, []);

  const isSuperAdmin = role === "SUPER_ADMIN";

  useEffect(() => {
    if (hasToken !== true || !isSuperAdmin) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await adminGet<PageOf<AuditRow>>(
          `/api/v1/admin/audit?page=${page}&size=${pageSize}`
        );
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load the audit log.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasToken, isSuperAdmin, page]);

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader eyebrow="Settings" title="Audit log" />
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-10 text-center">
          <FiLogIn className="mx-auto text-3xl text-primary-500 mb-3" />
          <p className="text-base font-bold text-neutral-900 mb-1">
            Sign-in required
          </p>
          <Link
            href="/admin/login?next=/admin/audit"
            className="mt-3 inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiLogIn /> Go to sign in
          </Link>
        </div>
      </>
    );
  }

  if (hasToken === true && !isSuperAdmin) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Settings"
          title="Audit log"
          description="A complete history of who changed what."
        />
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-10 text-center">
          <FiShield className="mx-auto text-3xl text-neutral-400 mb-3" />
          <p className="text-base font-bold text-neutral-900 mb-1">
            Super Admins only
          </p>
          <p className="text-sm text-neutral-500">
            The audit log is restricted to Super Admins. Your role is{" "}
            <span className="font-semibold">{role ?? "unknown"}</span>.
          </p>
        </div>
      </>
    );
  }

  const rows = data?.items ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Settings"
        title="Audit log"
        description="Every create, update, delete, and publish across the admin — captured automatically."
      />

      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-500 text-sm">
          <FiAlertCircle className="text-base mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <ul className="divide-y divide-neutral-100">
          {loading && (
            <li className="px-5 py-12 text-center text-sm text-neutral-500">
              Loading…
            </li>
          )}
          {!loading && rows.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-neutral-500">
              No activity yet. As your team edits content, every change is logged
              here.
            </li>
          )}
          {!loading &&
            rows.map((a) => {
              const style =
                ACTION_STYLE[a.action] ?? {
                  icon: <FiEdit />,
                  tint: "bg-neutral-100 text-neutral-600",
                };
              const actor = a.actorName || a.actorEmail || "Someone";
              return (
                <li key={a.id} className="flex items-start gap-4 px-5 py-4">
                  <span
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-base shrink-0 ${style.tint}`}
                  >
                    {style.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700">
                      <span className="font-semibold text-neutral-900">
                        {actor}
                      </span>{" "}
                      {a.summary.charAt(0).toLowerCase() + a.summary.slice(1)}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500 inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1">
                        <FiClock className="text-[10px]" /> {timeAgo(a.createdAt)}
                      </span>
                      <span className="text-neutral-300">·</span>
                      <code className="font-mono text-[10px] text-neutral-400">
                        {a.method} {a.path}
                      </code>
                    </p>
                  </div>
                </li>
              );
            })}
        </ul>

        {!loading && data && data.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 text-xs text-neutral-500">
            <span>
              Page <span className="font-bold text-neutral-900">{data.page}</span>{" "}
              of <span className="font-bold text-neutral-900">{data.pages}</span>{" "}
              · {data.total} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 px-3 rounded-md border border-neutral-200 font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => (data && p < data.pages ? p + 1 : p))}
                disabled={!data || page >= data.pages}
                className="h-8 px-3 rounded-md border border-neutral-200 font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
