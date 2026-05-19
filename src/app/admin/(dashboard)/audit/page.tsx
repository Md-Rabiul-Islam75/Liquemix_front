import {
  FiBox,
  FiCheckCircle,
  FiDownload,
  FiEdit,
  FiFileText,
  FiFolder,
  FiPlus,
  FiSearch,
  FiTrash,
  FiUserPlus,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";

export const metadata = { title: "Audit log" };

type Action = "create" | "update" | "delete" | "publish";

const ICON: Record<Action, React.ReactNode> = {
  create: <FiPlus />,
  update: <FiEdit />,
  delete: <FiTrash />,
  publish: <FiCheckCircle />,
};

const ACTION_TINT: Record<Action, string> = {
  create: "bg-success-50 text-success-700",
  update: "bg-primary-50 text-primary-600",
  delete: "bg-error-50 text-error-500",
  publish: "bg-accent-50 text-accent-800",
};

const ENTITY_ICON: Record<string, React.ReactNode> = {
  product: <FiBox />,
  category: <FiFolder />,
  news: <FiFileText />,
  user: <FiUserPlus />,
  download: <FiDownload />,
};

const ENTRIES = [
  {
    id: 1,
    when: "2026-05-19 09:24",
    actor: "Fatima Hossain",
    actorEmail: "fatima@liquemix.com",
    action: "update" as Action,
    entityType: "product",
    entityLabel: "Lique Hydro-Guard 3X",
    entityId: "prod-hydro-guard-3x",
    diff: 'changed "advantages" (added 1 row)',
  },
  {
    id: 2,
    when: "2026-05-18 17:42",
    actor: "Imran Karim",
    actorEmail: "imran@liquemix.com",
    action: "create" as Action,
    entityType: "category",
    entityLabel: "Two-component crystalline slurries",
    entityId: "cat-wp-2k-crystalline",
    diff: "new child of cat-wp-mineral",
  },
  {
    id: 3,
    when: "2026-05-18 14:08",
    actor: "Nusrat Akter",
    actorEmail: "nusrat@liquemix.com",
    action: "publish" as Action,
    entityType: "news",
    entityLabel: "ISO 9001 recertification",
    entityId: "news-iso-9001",
    diff: "draft → published",
  },
  {
    id: 4,
    when: "2026-05-17 11:33",
    actor: "Tanvir Rahman",
    actorEmail: "tanvir@liquemix.com",
    action: "create" as Action,
    entityType: "user",
    entityLabel: "rashid@liquemix.com",
    entityId: "u-5",
    diff: "role: VIEWER",
  },
  {
    id: 5,
    when: "2026-05-16 18:20",
    actor: "Fatima Hossain",
    actorEmail: "fatima@liquemix.com",
    action: "update" as Action,
    entityType: "product",
    entityLabel: "Crystal Flex-Skim",
    entityId: "prod-crystal-flex-skim",
    diff: "uploaded TDS R03",
  },
  {
    id: 6,
    when: "2026-05-14 10:11",
    actor: "Imran Karim",
    actorEmail: "imran@liquemix.com",
    action: "delete" as Action,
    entityType: "download",
    entityLabel: "Legacy 2019 brochure",
    entityId: "doc-old-brochure",
    diff: "soft-delete",
  },
];

export default function AdminAuditPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Settings"
        title="Audit log"
        description="Every write to the admin is recorded with actor, timestamp, entity, and a JSON diff. Read-only."
      />

      <div className="rounded-2xl bg-white-base border border-neutral-100 p-4 mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Search by user, entity, or action..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          defaultValue=""
          className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
        >
          <option value="">All actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="publish">Publish</option>
        </select>
        <select
          defaultValue=""
          className="h-10 px-3 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 bg-white-base"
        >
          <option value="">All entities</option>
          <option>Product</option>
          <option>Category</option>
          <option>News</option>
          <option>User</option>
        </select>
      </div>

      <div className="rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <ul className="divide-y divide-neutral-100">
          {ENTRIES.map((e) => (
            <li key={e.id} className="flex items-start gap-4 p-4 hover:bg-neutral-50">
              <span
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-base shrink-0 ${ACTION_TINT[e.action]}`}
              >
                {ICON[e.action]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-700">
                  <span className="font-semibold text-neutral-900">
                    {e.actor}
                  </span>{" "}
                  <span className="font-semibold text-neutral-600">
                    {e.action}d
                  </span>{" "}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-100 text-xs font-semibold text-neutral-700">
                    {ENTITY_ICON[e.entityType]} {e.entityType}
                  </span>{" "}
                  <span className="font-semibold text-primary-700">
                    {e.entityLabel}
                  </span>
                </p>
                <p className="mt-1 text-xs text-neutral-500">{e.diff}</p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-neutral-400">
                  <span className="font-mono">{e.when}</span>
                  <span>·</span>
                  <span>{e.actorEmail}</span>
                  <span>·</span>
                  <code className="font-mono text-[10px]">{e.entityId}</code>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 text-xs text-neutral-500">
          <span>
            Showing <span className="font-bold text-neutral-900">{ENTRIES.length}</span> entries
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="h-8 px-3 rounded-md border border-neutral-200 font-semibold text-neutral-400 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled
              className="h-8 px-3 rounded-md border border-neutral-200 font-semibold text-neutral-400 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
