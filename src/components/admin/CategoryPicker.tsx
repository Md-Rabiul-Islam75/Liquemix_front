"use client";

import { useMemo } from "react";
import { FiCornerDownRight } from "react-icons/fi";

type FlatCategory = {
  id: number;
  slug: string;
  name: string;
  parentId: number | null;
  menuOrder: number;
  isActive?: boolean;
};

type TreeNode = FlatCategory & {
  depth: number;
  children: TreeNode[];
};

function buildTree(flat: FlatCategory[]): TreeNode[] {
  const byParent = new Map<number | null, FlatCategory[]>();
  for (const c of flat) {
    const key = c.parentId ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(c);
  }
  const attach = (parentId: number | null, depth: number): TreeNode[] => {
    const kids = (byParent.get(parentId) ?? []).sort(
      (a, b) => a.menuOrder - b.menuOrder
    );
    return kids.map((k) => ({
      ...k,
      depth,
      children: attach(k.id, depth + 1),
    }));
  };
  return attach(null, 0);
}

function flattenInOrder(roots: TreeNode[]): TreeNode[] {
  const out: TreeNode[] = [];
  const walk = (n: TreeNode) => {
    out.push(n);
    n.children.forEach(walk);
  };
  roots.forEach(walk);
  return out;
}

/**
 * Tree-aware multi-select for category attachment. The flat list comes
 * in from the API; we re-derive the parent/child relationships and
 * render each row with depth indentation so the editor can see whether
 * they're checking a root, a sub-category, or a tertiary leaf. A
 * product can be attached to any combination at any depth.
 */
export default function CategoryPicker({
  categories,
  selectedIds,
  onToggle,
}: {
  categories: FlatCategory[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
}) {
  const flatOrdered = useMemo(
    () => flattenInOrder(buildTree(categories)),
    [categories]
  );

  return (
    <ul className="space-y-0.5 max-h-80 overflow-y-auto pr-1">
      {flatOrdered.map((c) => {
        const isChecked = selectedIds.has(c.id);
        return (
          <li key={c.id}>
            <label
              className={`flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 text-sm cursor-pointer ${
                isChecked ? "bg-primary-50/60" : ""
              } ${!c.isActive ? "opacity-60" : ""}`}
              style={{ paddingLeft: `${c.depth * 1 + 0.5}rem` }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(c.id)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-500 shrink-0"
              />
              {c.depth > 0 && (
                <FiCornerDownRight
                  className="mt-1 text-neutral-300 shrink-0"
                  aria-hidden
                />
              )}
              <span className="min-w-0 flex-1">
                <span
                  className={`font-semibold ${
                    isChecked ? "text-primary-800" : "text-neutral-800"
                  }`}
                >
                  {c.name}
                </span>
                {!c.isActive && (
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    hidden
                  </span>
                )}
                <span className="ml-2 text-[11px] text-neutral-400 font-mono">
                  {c.slug}
                </span>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
