"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiChevronDown,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiFolder,
  FiFolderPlus,
  FiPlus,
  FiSave,
  FiSearch,
  FiTrash,
  FiX,
} from "react-icons/fi";
import {
  adminDelete,
  adminGet,
  adminPatch,
  adminPost,
  adminPut,
} from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Highlight from "@/components/common/Highlight";
import ImagePicker from "./ImagePicker";

/**
 * Live category tree for one segment. Self-contained: fetches its own
 * categories from the admin API, manages selection / expansion / edit
 * state, and posts CRUD calls back. Cycle prevention is enforced server
 * side; the tree just surfaces error responses.
 *
 * Move semantics are simplified for v1: instead of drag-and-drop we
 * expose "Move up", "Move down" within siblings, and a "Parent" select
 * in the edit form to reparent. Both translate to PATCH /move on the
 * backend. The design doc's drag-drop UX (§4.2) can layer on later.
 */

type CategoryNode = {
  id: number;
  slug: string;
  name: string;
  parentId: number | null;
  segmentId: number;
  description?: string | null;
  image?: string | null;
  menuOrder: number;
  isActive: boolean;
  productCount?: number; // direct (set on tree response)
  children?: CategoryNode[];
};

/** Node with aggregated descendant counts and tree pointers. */
type Node = CategoryNode & {
  depth: number;
  aggregatedCount: number;
  children: Node[];
};

type EditState =
  | { mode: "view" }
  | { mode: "edit"; id: number }
  | { mode: "createRoot" }
  | { mode: "createChild"; parentId: number };

export default function CategoryTree({
  segmentId,
  segmentName,
}: {
  segmentId: number;
  segmentName: string;
}) {
  const [nodes, setNodes] = useState<CategoryNode[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [editState, setEditState] = useState<EditState>({ mode: "view" });
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    node: Node;
    message: string;
  } | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await adminGet<CategoryNode[]>(
        `/api/v1/admin/catalog/categories?segmentId=${segmentId}&tree=true`
      );
      setNodes(data);
      setError(null);
      // Expand everything by default on first load
      setExpanded((prev) => {
        if (prev.size > 0) return prev;
        const all = new Set<number>();
        const walk = (list: CategoryNode[]) => {
          for (const n of list) {
            all.add(n.id);
            if (n.children?.length) walk(n.children);
          }
        };
        walk(data);
        return all;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load categories.");
    }
  }, [segmentId]);

  useEffect(() => {
    reload();
  }, [reload]);

  // ─── Tree assembly + flat lookups ─────────────────────────────────
  const { tree, flatById } = useMemo(() => {
    const flat = new Map<number, Node>();
    if (!nodes) return { tree: [] as Node[], flatById: flat };

    const make = (raw: CategoryNode, depth: number): Node => {
      const childRaws = raw.children ?? [];
      const children = childRaws
        .map((c) => make(c, depth + 1))
        .sort((a, b) => a.menuOrder - b.menuOrder);
      const aggregatedCount =
        (raw.productCount ?? 0) +
        children.reduce((s, c) => s + c.aggregatedCount, 0);
      const node: Node = {
        ...raw,
        depth,
        aggregatedCount,
        children,
      };
      flat.set(raw.id, node);
      return node;
    };

    const roots = nodes
      .map((r) => make(r, 0))
      .sort((a, b) => a.menuOrder - b.menuOrder);
    return { tree: roots, flatById: flat };
  }, [nodes]);

  const selected = selectedId ? flatById.get(selectedId) ?? null : null;
  const parentOf = (n: Node | null): Node | null =>
    n?.parentId != null ? flatById.get(n.parentId) ?? null : null;

  // ─── Search ───────────────────────────────────────────────────────
  const lowerQ = query.trim().toLowerCase();
  const matches = useCallback(
    (n: Node): boolean => {
      if (!lowerQ) return true;
      return (
        n.name.toLowerCase().includes(lowerQ) ||
        n.slug.toLowerCase().includes(lowerQ) ||
        n.children.some(matches)
      );
    },
    [lowerQ]
  );

  // ─── Toggle expand ────────────────────────────────────────────────
  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set<number>();
    flatById.forEach((_, id) => all.add(id));
    setExpanded(all);
  };
  const collapseAll = () => setExpanded(new Set());

  // Expand / Collapse only do anything when the tree actually has nesting.
  // With a flat list (every category at the top level) there's nothing to
  // show or hide, so we disable the buttons rather than leave them looking
  // clickable-but-dead.
  const hasNesting = useMemo(
    () => Array.from(flatById.values()).some((n) => n.children.length > 0),
    [flatById]
  );

  // ─── Move up / down within siblings ───────────────────────────────
  async function moveWithinSiblings(node: Node, direction: -1 | 1) {
    const parent = parentOf(node);
    const siblings = parent ? parent.children : tree;
    const idx = siblings.findIndex((s) => s.id === node.id);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= siblings.length) return;
    // Swap menuOrder values
    const targetNode = siblings[targetIdx];
    setBusy(true);
    try {
      await adminPut(`/api/v1/admin/catalog/categories/${node.id}`, {
        segmentId: node.segmentId,
        slug: node.slug,
        name: node.name,
        description: node.description,
        image: node.image,
        menuOrder: targetNode.menuOrder,
        isActive: node.isActive,
        parentId: node.parentId,
      });
      await adminPut(
        `/api/v1/admin/catalog/categories/${targetNode.id}`,
        {
          segmentId: targetNode.segmentId,
          slug: targetNode.slug,
          name: targetNode.name,
          description: targetNode.description,
          image: targetNode.image,
          menuOrder: node.menuOrder,
          isActive: targetNode.isActive,
          parentId: targetNode.parentId,
        }
      );
      await reload();
      SuccessToast("Reordered", `${node.name} moved.`);
    } catch (e) {
      ErrorToast("Move failed", e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setBusy(false);
    }
  }

  // ─── Delete ───────────────────────────────────────────────────────
  // Opens the confirm dialog with a context-aware warning. The actual
  // delete runs in confirmDelete() once the user confirms.
  function onDelete(node: Node) {
    const hasKids = node.children.length > 0;
    const directProducts = node.productCount ?? 0;
    const message = hasKids
      ? `It still has ${node.children.length} sub-categor${node.children.length === 1 ? "y" : "ies"}. The API will refuse — move them out first.`
      : directProducts > 0
        ? `${directProducts} product${directProducts === 1 ? " is" : "s are"} still attached. The API will refuse — reattach them first.`
        : "This cannot be undone via the UI.";
    setPendingDelete({ node, message });
  }

  async function confirmDelete() {
    const node = pendingDelete?.node;
    if (!node) return;
    setBusy(true);
    try {
      await adminDelete(`/api/v1/admin/catalog/categories/${node.id}`);
      SuccessToast("Category deleted", node.name);
      setSelectedId(null);
      setEditState({ mode: "view" });
      setPendingDelete(null);
      await reload();
    } catch (e) {
      ErrorToast(
        "Delete failed",
        e instanceof Error ? e.message : "Unknown error."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Tree */}
      <div className="lg:col-span-7 rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter categories…"
              className="w-full h-9 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button
            type="button"
            onClick={expandAll}
            disabled={!hasNesting}
            title={
              hasNesting
                ? "Expand all sub-categories"
                : "No sub-categories yet — add a child to build a tree"
            }
            className="hidden sm:inline-flex h-9 px-3 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-neutral-200"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            disabled={!hasNesting}
            title={
              hasNesting
                ? "Collapse all sub-categories"
                : "No sub-categories yet — add a child to build a tree"
            }
            className="hidden sm:inline-flex h-9 px-3 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-neutral-200"
          >
            Collapse all
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedId(null);
              setEditState({ mode: "createRoot" });
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiFolderPlus />{" "}
            <span className="hidden sm:inline">New root</span>
          </button>
        </div>

        {error ? (
          <div className="p-6 text-sm text-error-500">{error}</div>
        ) : nodes === null ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            Loading categories…
          </div>
        ) : tree.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            No categories in {segmentName} yet. Click <strong>New root</strong>{" "}
            to create the first one.
          </div>
        ) : (
          <ul className="py-2">
            {tree.filter(matches).map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                expanded={expanded}
                onToggle={toggle}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setEditState({ mode: "view" });
                }}
                onAddChild={(id) => {
                  setSelectedId(id);
                  setEditState({ mode: "createChild", parentId: id });
                }}
                matches={matches}
                query={lowerQ}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Detail / edit panel */}
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-20 rounded-2xl bg-white-base border border-neutral-100 p-5">
          {editState.mode === "createRoot" || editState.mode === "createChild" ? (
            <CategoryForm
              key={`create-${editState.mode === "createChild" ? editState.parentId : "root"}`}
              segmentId={segmentId}
              parentId={
                editState.mode === "createChild" ? editState.parentId : null
              }
              parentName={
                editState.mode === "createChild"
                  ? flatById.get(editState.parentId)?.name ?? null
                  : null
              }
              allCategories={Array.from(flatById.values())}
              initial={null}
              busy={busy}
              setBusy={setBusy}
              onDone={async () => {
                await reload();
                setEditState({ mode: "view" });
              }}
              onCancel={() => setEditState({ mode: "view" })}
            />
          ) : editState.mode === "edit" && selected ? (
            <CategoryForm
              key={`edit-${selected.id}`}
              segmentId={segmentId}
              parentId={selected.parentId}
              parentName={parentOf(selected)?.name ?? null}
              allCategories={Array.from(flatById.values())}
              initial={selected}
              busy={busy}
              setBusy={setBusy}
              onDone={async () => {
                await reload();
                setEditState({ mode: "view" });
              }}
              onCancel={() => setEditState({ mode: "view" })}
            />
          ) : selected ? (
            <DetailView
              node={selected}
              parent={parentOf(selected)}
              busy={busy}
              onEdit={() => setEditState({ mode: "edit", id: selected.id })}
              onAddChild={() =>
                setEditState({ mode: "createChild", parentId: selected.id })
              }
              onDelete={() => onDelete(selected)}
              onMoveUp={() => moveWithinSiblings(selected, -1)}
              onMoveDown={() => moveWithinSiblings(selected, 1)}
              canMoveUp={(() => {
                const parent = parentOf(selected);
                const siblings = parent ? parent.children : tree;
                return siblings.findIndex((s) => s.id === selected.id) > 0;
              })()}
              canMoveDown={(() => {
                const parent = parentOf(selected);
                const siblings = parent ? parent.children : tree;
                const idx = siblings.findIndex((s) => s.id === selected.id);
                return idx >= 0 && idx < siblings.length - 1;
              })()}
            />
          ) : (
            <div className="text-center py-8">
              <FiFolder className="mx-auto text-3xl text-neutral-300 mb-2" />
              <p className="text-sm font-bold text-neutral-900">
                Select a category
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Click any node in the tree to view and edit, or hit{" "}
                <strong>New root</strong> to create one.
              </p>
            </div>
          )}
        </div>
      </aside>

      <ConfirmDialog
        open={pendingDelete != null}
        danger
        title={
          pendingDelete
            ? `Delete "${pendingDelete.node.name}"?`
            : "Delete category?"
        }
        message={pendingDelete?.message}
        confirmLabel="Delete category"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

// ─── Tree row ─────────────────────────────────────────────────────────

function TreeNode({
  node,
  expanded,
  onToggle,
  selectedId,
  onSelect,
  onAddChild,
  matches,
  query,
}: {
  node: Node;
  expanded: Set<number>;
  onToggle: (id: number) => void;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddChild: (id: number) => void;
  matches: (n: Node) => boolean;
  query: string;
}) {
  const hasChildren = node.children.length > 0;
  const isOpen = expanded.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <li>
      <div
        className={`group flex items-center gap-2 pr-3 py-1.5 cursor-pointer transition-colors ${
          isSelected ? "bg-primary-50" : "hover:bg-neutral-50"
        }`}
        style={{ paddingLeft: `${node.depth * 1.25 + 0.75}rem` }}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={isOpen ? "Collapse" : "Expand"}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="inline-flex items-center justify-center w-5 h-5 rounded text-neutral-500 hover:bg-neutral-200"
          >
            {isOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        ) : (
          <span className="inline-block w-5 h-5" aria-hidden />
        )}

        <FiFolder
          className={`text-base shrink-0 ${
            isSelected ? "text-primary-600" : "text-neutral-400"
          }`}
        />

        <span
          className={`flex-1 text-sm font-semibold truncate ${
            isSelected ? "text-primary-700" : "text-neutral-800"
          } ${!node.isActive ? "opacity-60" : ""}`}
        >
          {query ? <Highlight text={node.name} query={query} /> : node.name}
          {!node.isActive && (
            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              hidden
            </span>
          )}
        </span>

        <span
          className="inline-flex items-center justify-center min-w-7 h-5 px-1.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-600"
          title={`${node.aggregatedCount} products at this node and below`}
        >
          {node.aggregatedCount}
        </span>

        <button
          type="button"
          aria-label={`Add child of ${node.name}`}
          title={`Add child of ${node.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddChild(node.id);
          }}
          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:bg-primary-50 hover:text-primary-700 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiPlus className="text-sm" />
        </button>
      </div>

      {hasChildren && isOpen && (
        <ul>
          {node.children.filter(matches).map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              expanded={expanded}
              onToggle={onToggle}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              matches={matches}
              query={query}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ─── Right panel: read-only view ─────────────────────────────────────

function DetailView({
  node,
  parent,
  busy,
  onEdit,
  onAddChild,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  node: Node;
  parent: Node | null;
  busy: boolean;
  onEdit: () => void;
  onAddChild: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <>
      <p className="text-[11px] font-bold tracking-wider uppercase text-primary-600 mb-1">
        Selected category
      </p>
      <h3 className="text-lg font-bold text-neutral-900">{node.name}</h3>
      <p className="mt-1 font-mono text-[11px] text-neutral-500">{node.slug}</p>

      <div className="mt-5 space-y-3 text-sm">
        <DetailRow label="Parent">
          {parent?.name ?? <span className="text-neutral-400">— root</span>}
        </DetailRow>
        <DetailRow label="Status">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              node.isActive
                ? "bg-success-50 text-success-700"
                : "bg-neutral-100 text-neutral-600"
            }`}
          >
            <span className="block w-1.5 h-1.5 rounded-full bg-current" />
            {node.isActive ? "Active" : "Hidden"}
          </span>
        </DetailRow>
        <DetailRow label="Menu order">{node.menuOrder}</DetailRow>
        <DetailRow label="Products attached">
          {node.productCount ?? 0}
          <span className="text-neutral-400 text-xs font-normal">
            {" "}
            ({node.aggregatedCount} including descendants)
          </span>
        </DetailRow>
        {node.description && (
          <DetailRow label="Description">
            <span className="text-neutral-700">{node.description}</span>
          </DetailRow>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={busy}
          className="h-9 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 disabled:opacity-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onAddChild}
          disabled={busy}
          className="h-9 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 disabled:opacity-50"
        >
          <FiPlus className="inline mr-1" /> Add child
        </button>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={busy || !canMoveUp}
          className="h-9 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 hover:border-primary-300 disabled:opacity-40"
        >
          <FiArrowUp className="inline mr-1" /> Move up
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={busy || !canMoveDown}
          className="h-9 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 hover:border-primary-300 disabled:opacity-40"
        >
          <FiArrowDown className="inline mr-1" /> Move down
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="col-span-2 h-9 rounded-lg border border-error-200 text-sm font-semibold text-error-500 hover:bg-error-50 disabled:opacity-50"
        >
          <FiTrash className="inline mr-1" /> Delete
        </button>
      </div>
    </>
  );
}

// ─── Right panel: create / edit form ─────────────────────────────────

function CategoryForm({
  segmentId,
  parentId,
  parentName,
  allCategories,
  initial,
  busy,
  setBusy,
  onDone,
  onCancel,
}: {
  segmentId: number;
  parentId: number | null;
  parentName: string | null;
  allCategories: Node[];
  initial: Node | null;
  busy: boolean;
  setBusy: (b: boolean) => void;
  onDone: () => Promise<void> | void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [menuOrder, setMenuOrder] = useState<number>(initial?.menuOrder ?? 0);
  const [parent, setParent] = useState<number | null>(parentId);

  /** Auto-derive slug from name on create until the user touches it. */
  const [slugTouched, setSlugTouched] = useState(initial != null);
  useEffect(() => {
    if (slugTouched) return;
    setSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 160)
    );
  }, [name, slugTouched]);

  /** Parent dropdown — exclude self and any descendants to prevent
   *  obvious cycles client-side. Server still validates. */
  const reparentOptions = useMemo(() => {
    if (!initial) return allCategories;
    const blocked = new Set<number>([initial.id]);
    const addDescendants = (n: Node) => {
      for (const c of n.children) {
        blocked.add(c.id);
        addDescendants(c);
      }
    };
    addDescendants(initial);
    return allCategories.filter((c) => !blocked.has(c.id));
  }, [allCategories, initial]);

  async function onSave() {
    if (!name.trim()) {
      ErrorToast("Name required", "Give the category a name.");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        segmentId,
        parentId: parent,
        slug: (slug.trim() || undefined) as string | undefined,
        name: name.trim(),
        description: (description ?? "").trim() || null,
        image: (image ?? "").trim() || null,
        menuOrder,
        isActive,
      };

      if (initial) {
        // PUT updates fields (name/slug/description/image/order/active).
        // PATCH /move handles reparenting. Run them both when needed.
        const parentChanged = parent !== initial.parentId;
        await adminPut(
          `/api/v1/admin/catalog/categories/${initial.id}`,
          payload
        );
        if (parentChanged) {
          await adminPatch(
            `/api/v1/admin/catalog/categories/${initial.id}/move`,
            { parentId: parent, menuOrder }
          );
        }
        SuccessToast("Category updated", name.trim());
      } else {
        await adminPost("/api/v1/admin/catalog/categories", payload);
        SuccessToast(
          "Category created",
          parentName
            ? `"${name}" added under "${parentName}".`
            : `"${name}" added as a new root.`
        );
      }
      await onDone();
    } catch (e) {
      ErrorToast(
        initial ? "Update failed" : "Create failed",
        e instanceof Error ? e.message : "Unknown error."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <p className="text-[11px] font-bold tracking-wider uppercase text-primary-600 mb-1">
        {initial ? "Edit category" : "New category"}
      </p>
      <h3 className="text-lg font-bold text-neutral-900">
        {initial ? initial.name : parentName ? `Under "${parentName}"` : "New root"}
      </h3>

      <div className="mt-5 space-y-4">
        <Field label="Name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Crystalline slurries"
            className="admin-input"
            maxLength={200}
          />
        </Field>
        <Field label="Slug" hint="Auto-generated from the name unless edited.">
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="crystalline-slurries"
            className="admin-input font-mono text-xs"
            maxLength={160}
          />
        </Field>
        <Field label="Description">
          <textarea
            rows={3}
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            className="admin-input resize-y"
            placeholder="One sentence on what lives in this category."
          />
        </Field>
        <Field
          label="Parent"
          hint="Move this category under a different parent — or leave on root."
        >
          <select
            value={parent ?? ""}
            onChange={(e) =>
              setParent(e.target.value === "" ? null : Number(e.target.value))
            }
            className="admin-input"
          >
            <option value="">— Root (top of segment)</option>
            {reparentOptions
              .sort((a, b) => a.depth - b.depth || a.menuOrder - b.menuOrder)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {"— ".repeat(c.depth)}
                  {c.name}
                </option>
              ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Menu order">
            <input
              type="number"
              value={menuOrder}
              onChange={(e) =>
                setMenuOrder(Number(e.target.value) || 0)
              }
              className="admin-input font-mono"
            />
          </Field>
          <Field label="Status">
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`h-10 px-3 rounded-lg border text-sm font-semibold inline-flex items-center justify-center gap-2 w-full ${
                isActive
                  ? "border-success-300 bg-success-50 text-success-700"
                  : "border-neutral-200 bg-neutral-50 text-neutral-600"
              }`}
            >
              {isActive ? <FiEye /> : <FiEyeOff />}
              {isActive ? "Active" : "Hidden"}
            </button>
          </Field>
        </div>
        <Field label="Image" hint="Optional. Upload from disk or paste a URL.">
          <ImagePicker
            value={image ?? ""}
            onChange={setImage}
            aspectClass="aspect-[4/3]"
            uploadLabel="Choose a category image"
            replaceLabel="Replace category image"
            helperText="JPG, PNG, WebP up to 5 MB. Square or 4:3 looks best."
          />
        </Field>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="h-9 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 hover:border-error-300 hover:text-error-500 disabled:opacity-50"
        >
          <FiX className="inline mr-1" /> Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={busy}
          className="h-9 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 disabled:opacity-50"
        >
          <FiSave className="inline mr-1" /> {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-0.5">
        {label}
      </dt>
      <dd className="font-semibold text-neutral-900">{children}</dd>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
        {label}
        {required && <span className="text-error-500 ml-0.5">*</span>}
      </span>
      {children}
      {hint && (
        <span className="block mt-1 text-[11px] text-neutral-400">{hint}</span>
      )}
    </label>
  );
}

