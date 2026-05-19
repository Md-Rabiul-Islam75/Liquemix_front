import {
  FiEdit,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiShield,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";

export const metadata = { title: "Users & roles" };

type Role = "SUPER_ADMIN" | "EDITOR" | "VIEWER";

const USERS: {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLogin: string;
  active: boolean;
}[] = [
  {
    id: "u-1",
    name: "Tanvir Rahman",
    email: "tanvir@liquemix.com",
    role: "SUPER_ADMIN",
    lastLogin: "2026-05-19 09:14",
    active: true,
  },
  {
    id: "u-2",
    name: "Fatima Hossain",
    email: "fatima@liquemix.com",
    role: "EDITOR",
    lastLogin: "2026-05-18 17:42",
    active: true,
  },
  {
    id: "u-3",
    name: "Imran Karim",
    email: "imran@liquemix.com",
    role: "EDITOR",
    lastLogin: "2026-05-15 11:08",
    active: true,
  },
  {
    id: "u-4",
    name: "Nusrat Akter",
    email: "nusrat@liquemix.com",
    role: "EDITOR",
    lastLogin: "2026-05-17 14:55",
    active: true,
  },
  {
    id: "u-5",
    name: "Rashid Khan",
    email: "rashid@liquemix.com",
    role: "VIEWER",
    lastLogin: "2026-05-12 08:33",
    active: true,
  },
];

const ROLE_PILL: Record<Role, string> = {
  SUPER_ADMIN: "bg-primary-50 text-primary-700 ring-1 ring-primary-200",
  EDITOR: "bg-success-50 text-success-700 ring-1 ring-success-200",
  VIEWER: "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200",
};

const ROLE_DESC: Record<Role, string> = {
  SUPER_ADMIN: "All permissions, can manage users and edit segments.",
  EDITOR: "Full CRUD on catalog and content. Cannot manage users.",
  VIEWER: "Read-only across all admin screens.",
};

export default function AdminUsersPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Settings"
        title="Users & roles"
        description="Manage who has access to the admin and what they can do."
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiPlus /> Invite user
          </button>
        }
      />

      {/* Role legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {(["SUPER_ADMIN", "EDITOR", "VIEWER"] as Role[]).map((r) => (
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
                {USERS.filter((u) => u.role === r).length} users
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
            placeholder="Search by name or email..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Last login</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {USERS.map((u) => (
              <tr key={u.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-700 text-sm font-bold">
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">
                        {u.name}
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
                <td className="px-4 py-3 text-xs text-neutral-500 font-mono whitespace-nowrap">
                  {u.lastLogin}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      u.active
                        ? "bg-success-50 text-success-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <span className="block w-1.5 h-1.5 rounded-full bg-current" />
                    {u.active ? "Active" : "Suspended"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <span
                      aria-label="Edit"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <FiEdit />
                    </span>
                    <span
                      aria-label="Row menu"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-neutral-100"
                    >
                      <FiMoreVertical />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
