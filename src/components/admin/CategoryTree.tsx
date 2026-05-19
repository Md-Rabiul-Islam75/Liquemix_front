"use client";

import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiFolder,
  FiFolderPlus,
  FiMoreVertical,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import type { Category } from "@/types/Catalog";

/**
 * Hierarchical category tree — read-only structure for v1 admin demo.
 * Drag-and-drop reordering and parent-changing is left as a follow-up;
 * the data model and API contract for those moves is documented in
 * ADMIN_PANEL_DESIGN.md §4.
 *
 * Tree assembly: builds a parent → children map from the flat input list
 * (matches the adjacency-list shape the backend will return).
 *
 * Counts shown next to each node aggregate products at this node and all
 * descendants — that's the count editors actually care about ("if I
 * delete this branch, how many products will lose their home?").
 */

/** Explicit override of `Category.children` so TS resolves the recursive
 *  type cleanly (an intersection would leave `children` ambiguous). */
interface Node extends Omit<Category, "children"> {
  children: Node[];
  productCount: number; // including descendants
}

function buildTree(flat: Category[], productsByCategoryId: Record<string, number>): Node[] {
  const map = new Map<string, Node>();
  flat.forEach((c) =>
    map.set(c.id, { ...c, children: [], productCount: productsByCategoryId[c.id] ?? 0 })
  );
  const roots: Node[] = [];
  flat.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  // Sort siblings by menu_order
  const sortByOrder = (a: Node, b: Node) => a.menuOrder - b.menuOrder;
  roots.sort(sortByOrder);
  const sortRecursive = (n: Node) => {
    n.children.sort(sortByOrder);
    n.children.forEach(sortRecursive);
  };
  roots.forEach(sortRecursive);
  // Bubble descendant counts up — done after sorting so traversal order
  // is deterministic.
  const aggregate = (n: Node): number => {
    n.productCount += n.children.reduce((sum, c) => sum + aggregate(c), 0);
    return n.productCount;
  };
  roots.forEach(aggregate);
  return roots;
}

export default function CategoryTree({
  categories,
  productsByCategoryId,
}: {
  categories: Category[];
  productsByCategoryId: Record<string, number>;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(categories.map((c) => c.id))
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const tree = useMemo(
    () => buildTree(categories, productsByCategoryId),
    [categories, productsByCategoryId]
  );

  const selected = selectedId
    ? categories.find((c) => c.id === selectedId)
    : null;
  const selectedParent = selected?.parentId
    ? categories.find((c) => c.id === selected.parentId)
    : null;

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () =>
    setExpanded(new Set(categories.map((c) => c.id)));
  const collapseAll = () => setExpanded(new Set());

  const lowerQ = query.trim().toLowerCase();
  const matches = (n: Node): boolean => {
    if (!lowerQ) return true;
    return (
      n.name.toLowerCase().includes(lowerQ) ||
      n.slug.toLowerCase().includes(lowerQ) ||
      n.children.some(matches)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Tree */}
      <div className="lg:col-span-8 rounded-2xl bg-white-base border border-neutral-100 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter categories..."
              className="w-full h-9 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button
            type="button"
            onClick={expandAll}
            className="hidden sm:inline-flex h-9 px-3 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-primary-300"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="hidden sm:inline-flex h-9 px-3 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-primary-300"
          >
            Collapse all
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            <FiFolderPlus /> <span className="hidden sm:inline">New root</span>
          </button>
        </div>

        <ul className="py-2">
          {tree.filter(matches).length === 0 ? (
            <li className="p-12 text-center text-sm text-neutral-500">
              No categories match &quot;{query}&quot;.
            </li>
          ) : (
            tree
              .filter(matches)
              .map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  expanded={expanded}
                  onToggle={toggle}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  matches={matches}
                  query={lowerQ}
                />
              ))
          )}
        </ul>
      </div>

      {/* Detail panel */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-20 rounded-2xl bg-white-base border border-neutral-100 p-5">
          {selected ? (
            <>
              <p className="text-[11px] font-bold tracking-wider uppercase text-primary-600 mb-1">
                Selected category
              </p>
              <h3 className="text-lg font-bold text-neutral-900">
                {selected.name}
              </h3>
              <p className="mt-1 font-mono text-[11px] text-neutral-500">
                {selected.slug}
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <DetailRow label="Parent">
                  {selectedParent?.name ?? (
                    <span className="text-neutral-400">— root</span>
                  )}
                </DetailRow>
                <DetailRow label="Segment">
                  <code className="font-mono text-xs text-neutral-500">
                    {selected.segmentId}
                  </code>
                </DetailRow>
                <DetailRow label="Status">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      selected.isActive
                        ? "bg-success-50 text-success-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <span className="block w-1.5 h-1.5 rounded-full bg-current" />
                    {selected.isActive ? "Active" : "Hidden"}
                  </span>
                </DetailRow>
                <DetailRow label="Menu order">{selected.menuOrder}</DetailRow>
                {selected.description && (
                  <DetailRow label="Description">
                    <span className="text-neutral-700">
                      {selected.description}
                    </span>
                  </DetailRow>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="h-9 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="h-9 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
                >
                  Add child
                </button>
                <button
                  type="button"
                  className="col-span-2 h-9 rounded-lg border border-error-200 text-sm font-semibold text-error-500 hover:bg-error-50"
                >
                  Delete (with cascade warning)
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <FiFolder className="mx-auto text-3xl text-neutral-300 mb-2" />
              <p className="text-sm font-bold text-neutral-900">
                Select a category
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Click any node in the tree to view and edit its details here.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  expanded,
  onToggle,
  selectedId,
  onSelect,
  matches,
  query,
}: {
  node: Node;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
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
        style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
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
          }`}
        >
          {query ? <Highlight text={node.name} query={query} /> : node.name}
        </span>

        <span
          className="inline-flex items-center justify-center min-w-7 h-5 px-1.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-600"
          title={`${node.productCount} products at this node and below`}
        >
          {node.productCount}
        </span>

        <button
          type="button"
          aria-label="Row menu"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:bg-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiMoreVertical className="text-sm" />
        </button>
      </div>

      {hasChildren && isOpen && (
        <ul>
          {node.children.filter(matches).map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              selectedId={selectedId}
              onSelect={onSelect}
              matches={matches}
              query={query}
            />
          ))}
          {/* "Add child" drop target — visual only for v1 */}
          <li>
            <button
              type="button"
              onClick={() => onSelect(node.id)}
              className="flex items-center gap-2 w-full text-left py-1.5 text-xs font-semibold text-neutral-400 hover:text-primary-700"
              style={{ paddingLeft: `${(depth + 1) * 1.25 + 1.5}rem` }}
            >
              <FiPlus className="text-sm" /> Add child of {node.name}
            </button>
          </li>
        </ul>
      )}
    </li>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent-200 text-neutral-900 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

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
