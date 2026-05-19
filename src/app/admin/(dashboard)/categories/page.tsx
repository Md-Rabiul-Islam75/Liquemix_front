import { FiInfo, FiPlus } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import CategoryTree from "@/components/admin/CategoryTree";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { segments } from "@/data/segments";
import Link from "next/link";

export const metadata = { title: "Categories" };

/**
 * Categories page — the central UX problem from §4 of the design doc.
 * Renders one tree per segment so editors stay focused on a single
 * product family at a time (matches how the Schomburg taxonomy is
 * organised on the public site).
 */
export default function AdminCategoriesPage() {
  // Pre-compute product counts per category for the tree to use.
  // Backend will replace this with a single aggregate query.
  const productsByCategory: Record<string, number> = {};
  products.forEach((p) => {
    p.categoryIds.forEach((cid) => {
      productsByCategory[cid] = (productsByCategory[cid] ?? 0) + 1;
    });
  });

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Hierarchical taxonomy that organises the entire product catalog. Move, rename, and reorder freely — products attach to any node, branch or leaf."
        actions={
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            <FiPlus /> New category
          </Link>
        }
      />

      <div className="mb-4 flex items-start gap-3 p-4 rounded-xl bg-primary-50 border border-primary-100 text-sm text-primary-900">
        <FiInfo className="text-base text-primary-600 shrink-0 mt-0.5" />
        <p>
          The frontend already supports arbitrary depth via{" "}
          <code className="bg-white-base px-1 rounded font-mono text-xs">
            parentId
          </code>
          . Drag-and-drop reordering and the cycle-prevention guard land with
          the backend — see{" "}
          <span className="font-bold">ADMIN_PANEL_DESIGN.md §4</span>.
        </p>
      </div>

      {segments.map((seg) => {
        const segCats = categories.filter((c) => c.segmentId === seg.id);
        return (
          <section key={seg.id} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-neutral-900 tracking-wider uppercase">
                {seg.name}{" "}
                <span className="text-neutral-400 font-normal">
                  ({segCats.length} categories)
                </span>
              </h2>
              <Link
                href={`/admin/products?segment=${seg.id}`}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                View products in segment →
              </Link>
            </div>
            <CategoryTree
              categories={segCats}
              productsByCategoryId={productsByCategory}
            />
          </section>
        );
      })}
    </>
  );
}
