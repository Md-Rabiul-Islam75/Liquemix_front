"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiEdit,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiPlus,
  FiSearch,
  FiShield,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  adminGet,
  adminPost,
  adminPut,
  adminDelete,
  getToken,
  getAdminRole,
  type AdminRoleName,
} from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";

type AdminUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRoleName;
  isActive: boolean;
  createdAt?: string | null;
};

const ROLES: AdminRoleName[] = ["SUPER_ADMIN", "EDITOR", "VIEWER"];

const ROLE_PILL: Record<AdminRoleName, string> = {
  SUPER_ADMIN: "bg-primary-50 text-primary-700 ring-1 ring-primary-200",
  EDITOR: "bg-success-50 text-success-700 ring-1 ring-success-200",
  VIEWER: "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200",
};

const ROLE_DESC: Record<AdminRoleName, string> = {
  SUPER_ADMIN: "All permissions, including managing users.",
  EDITOR: "Full CRUD on catalog and content. Cannot manage users.",
  VIEWER: "Read-only across all admin screens.",
};

function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type EditTarget = { mode: "create" } | { mode: "edit"; user: AdminUser };

export default function AdminUsersPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [role, setRole] = useState<AdminRoleName | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const [editing, setEditing] = useState<EditTarget | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setHasToken(getToken() != null);
    setRole(getAdminRole());
  }, []);

  const isSuperAdmin = role === "SUPER_ADMIN";

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await adminGet<AdminUser[]>("/api/v1/admin/users");
      setUsers(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasToken !== true || !isSuperAdmin) {
      setLoading(false);
      return;
    }
    reload();
  }, [hasToken, isSuperAdmin]);

  const visible = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return users;
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(ql) ||
        u.email.toLowerCase().includes(ql)
    );
  }, [users, q]);

  async function onDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminDelete(`/api/v1/admin/users/${pendingDelete.id}`);
      SuccessToast("Removed", `${pendingDelete.email} no longer has access.`);
      setUsers((prev) => prev.filter((u) => u.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (e) {
      ErrorToast(
        "Couldn't remove user",
        e instanceof Error ? e.message : "Unknown error."
      );
    } finally {
      setDeleting(false);
    }
  }

  // ─── Gates ────────────────────────────────────────────────────────
  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Settings"
          title="Users & roles"
          description="Sign in to manage admin users."
        />
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-10 text-center">
          <FiLogIn className="mx-auto text-3xl text-primary-500 mb-3" />
          <p className="text-base font-bold text-neutral-900 mb-1">
            Sign-in required
          </p>
          <Link
            href="/admin/login?next=/admin/users"
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
          title="Users & roles"
          description="Manage who has access to the admin and what they can do."
        />
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-10 text-center">
          <FiShield className="mx-auto text-3xl text-neutral-400 mb-3" />
          <p className="text-base font-bold text-neutral-900 mb-1">
            Super Admins only
          </p>
          <p className="text-sm text-neutral-500">
            User management is restricted to Super Admins. Your role is{" "}
            <span className="font-semibold">{role ?? "unknown"}</span>.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Settings"
        title="Users & roles"
        description="Invite admins and control what each role can do."
        actions={
          <button
            type="button"
            onClick={() => setEditing({ mode: "create" })}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiPlus /> Invite user
          </button>
        }
      />

      {/* Role legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {ROLES.map((r) => (
          <div
            key={r}
            className="rounded-xl bg-white-base border border-neutral-100 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${ROLE_PILL[r]}`}
              >
                <FiShield className="text-xs" /> {r.replace("_", " ")}
              </span>
              <span className="text-xs text-neutral-500">
                {users.filter((u) => u.role === r).length} users
              </span>
            </div>
            <p className="text-xs text-neutral-600">{ROLE_DESC[r]}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="rounded-2xl bg-white-base border border-neutral-100 p-4 mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-500 text-sm">
          <FiAlertCircle className="text-base mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Added</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-neutral-500">
                    Loading users…
                  </td>
                </tr>
              )}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-neutral-500">
                    {q ? "No users match your search." : "No admin users yet."}
                  </td>
                </tr>
              )}
              {!loading &&
                visible.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-700 text-sm font-bold">
                          {`${u.firstName} ${u.lastName}`
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 truncate">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${ROLE_PILL[u.role]}`}
                      >
                        <FiShield className="text-xs" />
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">
                      {fmtDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          u.isActive
                            ? "bg-success-50 text-success-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        <span className="block w-1.5 h-1.5 rounded-full bg-current" />
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Edit"
                          onClick={() => setEditing({ mode: "edit", user: u })}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                        >
                          <FiEdit />
                        </button>
                        <button
                          type="button"
                          aria-label="Remove"
                          onClick={() => setPendingDelete(u)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:bg-error-50 hover:text-error-500"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <UserFormModal
          target={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}

      <ConfirmDialog
        open={pendingDelete != null}
        danger
        title={
          pendingDelete
            ? `Remove ${pendingDelete.firstName} ${pendingDelete.lastName}?`
            : "Remove user?"
        }
        message="They will lose admin access immediately. This can't be undone."
        confirmLabel="Remove user"
        busy={deleting}
        onConfirm={onDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

// ─── Create / edit modal ──────────────────────────────────────────────
function UserFormModal({
  target,
  onClose,
  onSaved,
}: {
  target: EditTarget;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = target.mode === "edit";
  const existing = isEdit ? target.user : null;

  const [firstName, setFirstName] = useState(existing?.firstName ?? "");
  const [lastName, setLastName] = useState(existing?.lastName ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [role, setRole] = useState<AdminRoleName>(existing?.role ?? "EDITOR");
  const [isActive, setIsActive] = useState(existing?.isActive ?? true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, submitting]);

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    (isEdit || password.length >= 8) &&
    (!password || password.length >= 8) &&
    !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      if (isEdit && existing) {
        await adminPut(`/api/v1/admin/users/${existing.id}`, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role,
          isActive,
        });
        if (password) {
          await adminPut(`/api/v1/admin/users/${existing.id}/password`, {
            password,
          });
        }
        SuccessToast("Saved", `${email} updated.`);
      } else {
        await adminPost("/api/v1/admin/users", {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          role,
        });
        SuccessToast(
          "User invited",
          `${email} can now sign in with the password you set.`
        );
      }
      onSaved();
    } catch (err) {
      ErrorToast(
        isEdit ? "Couldn't save user" : "Couldn't invite user",
        err instanceof Error ? err.message : "Unknown error."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm lqm-fade-in"
        onClick={() => !submitting && onClose()}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white-base shadow-2xl border border-neutral-100 overflow-hidden lqm-pop-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">
            {isEdit ? "Edit user" : "Invite a new user"}
          </h2>
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            aria-label="Close"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name">
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="admin-input"
                maxLength={100}
              />
            </Field>
            <Field label="Last name">
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="admin-input"
                maxLength={100}
              />
            </Field>
          </div>

          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEdit}
              className="admin-input disabled:bg-neutral-50 disabled:text-neutral-500"
              maxLength={256}
            />
            {isEdit && (
              <span className="mt-1 block text-[11px] text-neutral-400">
                Email is the login identity and can&apos;t be changed here.
              </span>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Role">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRoleName)}
                className="admin-input"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            {isEdit && (
              <Field label="Status">
                <select
                  value={isActive ? "active" : "suspended"}
                  onChange={(e) => setIsActive(e.target.value === "active")}
                  className="admin-input"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </Field>
            )}
          </div>

          <Field
            label={
              isEdit ? "Set a new password (optional)" : "Initial password"
            }
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEdit ? "Leave blank to keep current" : "Min 8 characters"}
                className="admin-input pr-10 font-mono"
                maxLength={100}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <span className="mt-1 block text-[11px] text-neutral-400">
              {isEdit
                ? "Only fill this to reset their password. Share it with them directly."
                : "Share these credentials with the user — no email is sent."}
            </span>
          </Field>
        </form>

        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-neutral-50 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            className="inline-flex items-center h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-neutral-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Saving…"
              : isEdit
              ? "Save changes"
              : "Invite user"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
