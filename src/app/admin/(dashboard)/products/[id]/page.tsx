import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiClock,
  FiDownload,
  FiEye,
  FiFile,
  FiFileText,
  FiImage,
  FiPlus,
  FiSave,
  FiStar,
  FiTag,
  FiTrash,
  FiUpload,
  FiUser,
  FiVideo,
  FiX,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import { products } from "@/data/products";
import { segments, getSegmentById } from "@/data/segments";
import { getCategoryById } from "@/data/categories";

export const dynamicParams = true;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

/**
 * Product edit page — the longest single screen in the admin and the
 * most-used one in practice. Mirrors the layout sketched in
 * ADMIN_PANEL_DESIGN.md §5: main column for content, sidebar for
 * status/taxonomy/media/audit, floating bottom bar for save actions.
 *
 * For the static demo every input renders with `defaultValue` (no real
 * mutation). Once the backend's PATCH endpoint exists, lift this into a
 * client component, wire up React Hook Form + Zod, and call the API.
 */
export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params;
  // "new" → blank-create state (handled by a separate route in v1, here we
  // 404 so the route is honest)
  if (id === "new") {
    return (
      <>
        <AdminPageHeader
          eyebrow="Create"
          title="New product"
          description="Backend isn't connected — the create action will be wired up once the API lands."
          actions={
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
            >
              <FiArrowLeft /> Back to list
            </Link>
          }
        />
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white-base p-12 text-center">
          <FiPlus className="mx-auto text-3xl text-neutral-400 mb-3" />
          <p className="text-sm font-bold text-neutral-900">
            New-product flow coming soon
          </p>
          <p className="mt-1 text-xs text-neutral-500 max-w-md mx-auto">
            Will mirror the edit screen with empty fields, autosave a draft as
            soon as the user enters a name, and POST to{" "}
            <code className="bg-neutral-100 px-1 rounded">
              /api/v1/admin/products
            </code>{" "}
            on first blur.
          </p>
        </div>
      </>
    );
  }

  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const segment = getSegmentById(product.segmentId);
  const productCategories = product.categoryIds
    .map((cid) => getCategoryById(cid))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
  const primary =
    product.images.find((i) => i.isPrimary) ?? product.images[0];

  return (
    <>
      <AdminPageHeader
        eyebrow={`Catalog · ${segment?.name ?? "Product"}`}
        title={product.name}
        description={product.shortDescription}
        actions={
          <>
            <Link
              href={`/products/${segment?.slug}/${product.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
            >
              <FiEye /> View on site
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
            >
              <FiArrowLeft /> Back
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        {/* Main */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic info */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-4">
              Basic information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Product name" required>
                <input
                  type="text"
                  defaultValue={product.name}
                  className="admin-input"
                />
              </Field>
              <Field label="SKU" required>
                <input
                  type="text"
                  defaultValue={product.sku}
                  className="admin-input font-mono"
                />
              </Field>
              <Field label="Slug" hint="Auto-generated from name. Editable.">
                <input
                  type="text"
                  defaultValue={product.slug}
                  className="admin-input font-mono text-xs"
                />
              </Field>
              <Field label="Segment" required>
                <select
                  defaultValue={product.segmentId}
                  className="admin-input"
                >
                  {segments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Short description" required className="sm:col-span-2">
                <textarea
                  rows={2}
                  defaultValue={product.shortDescription}
                  className="admin-input resize-none"
                />
              </Field>
              <Field
                label="Long description"
                hint="Rich text — supports headings, lists, bold."
                className="sm:col-span-2"
              >
                <textarea
                  rows={6}
                  defaultValue={product.longDescription ?? ""}
                  className="admin-input resize-y"
                  placeholder="Detailed product description..."
                />
                <p className="mt-1 text-[11px] text-neutral-400">
                  Rich-text editor (TipTap) will replace this textarea once
                  the editor component ships.
                </p>
              </Field>
            </div>
          </section>

          {/* Application areas */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Application areas
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Where this product can be used. One per row.
            </p>
            <ul className="space-y-2">
              {product.applicationAreas.map((a, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={a}
                    className="admin-input flex-1"
                  />
                  <button
                    type="button"
                    aria-label="Remove"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md text-neutral-400 hover:bg-error-50 hover:text-error-500"
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-600 hover:border-primary-400 hover:text-primary-700"
            >
              <FiPlus /> Add application area
            </button>
          </section>

          {/* Advantages */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Advantages
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Selling points displayed on the product page.
            </p>
            <ul className="space-y-2">
              {product.advantages.map((a, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={a}
                    className="admin-input flex-1"
                  />
                  <button
                    type="button"
                    aria-label="Remove"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md text-neutral-400 hover:bg-error-50 hover:text-error-500"
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-600 hover:border-primary-400 hover:text-primary-700"
            >
              <FiPlus /> Add advantage
            </button>
          </section>

          {/* Consumption */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-4">
              Consumption rate
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Value">
                <input
                  type="text"
                  defaultValue={product.consumption?.value ?? ""}
                  placeholder="e.g. 1.8 – 2.4"
                  className="admin-input"
                />
              </Field>
              <Field label="Unit">
                <input
                  type="text"
                  defaultValue={product.consumption?.unit ?? ""}
                  placeholder="e.g. kg / m² per coat"
                  className="admin-input"
                />
              </Field>
            </div>
          </section>

          {/* Packaging */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Packaging & article numbers
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Sizes and SKUs procurement teams quote against.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[11px] font-bold tracking-wider uppercase text-neutral-500">
                  <tr className="border-b border-neutral-100">
                    <th className="text-left pb-2 pr-3">Article #</th>
                    <th className="text-left pb-2 pr-3">Size</th>
                    <th className="text-left pb-2 pr-3">Color</th>
                    <th className="text-left pb-2 pr-3">Units / pallet</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {product.packaging.map((pk, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-3">
                        <input
                          type="text"
                          defaultValue={pk.articleNumber}
                          className="admin-input font-mono text-xs"
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="text"
                          defaultValue={pk.size}
                          className="admin-input"
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="text"
                          defaultValue={pk.color ?? ""}
                          className="admin-input"
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          defaultValue={pk.unitPerPallet ?? ""}
                          className="admin-input"
                        />
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          aria-label="Remove row"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:bg-error-50 hover:text-error-500"
                        >
                          <FiTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-600 hover:border-primary-400 hover:text-primary-700"
            >
              <FiPlus /> Add packaging row
            </button>
          </section>

          {/* Documents */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Documents
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              TDS, MSDS, MTC, brochures. PDF only, ≤ 25 MB.
            </p>
            <ul className="space-y-2">
              {product.documents.map((d, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100 hover:border-primary-200"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600">
                    <FiFile />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {d.title}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {d.type} · {d.language} · {d.revision ?? "R01"} ·{" "}
                      {d.uploadedAt}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Replace"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-primary-50 hover:text-primary-700"
                  >
                    <FiUpload />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:bg-error-50 hover:text-error-500"
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-600 hover:border-primary-400 hover:text-primary-700"
            >
              <FiPlus /> Upload document
            </button>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Status */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Status</h3>
            <div className="flex items-center gap-2 mb-4">
              <StatusPill status={product.isNew ? "Draft" : "Published"} />
              <span className="text-xs text-neutral-500">
                Last update {product.publishedAt}
              </span>
            </div>
            <label className="flex items-center gap-2 mb-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                defaultChecked={product.isFeatured}
                className="h-4 w-4 rounded border-neutral-300 text-primary-500"
              />
              <FiStar className="text-accent-500" />
              <span>Featured on home page</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                defaultChecked={product.isNew}
                className="h-4 w-4 rounded border-neutral-300 text-primary-500"
              />
              <FiTag className="text-secondary-500" />
              <span>Show NEW badge</span>
            </label>
          </section>

          {/* Taxonomy */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">
              Taxonomy
            </h3>
            <p className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-2">
              Categories
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {productCategories.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold"
                >
                  {c.name}
                  <button type="button" aria-label="Remove">
                    <FiX className="text-[11px]" />
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-600 hover:border-primary-400 hover:text-primary-700"
            >
              <FiPlus /> Pick from tree
            </button>
            <p className="mt-3 text-[11px] text-neutral-400">
              Opens the category tree picker — a product can attach to any
              leaf <em>or</em> branch.
            </p>
          </section>

          {/* Media */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Media</h3>
            <p className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-2">
              Primary image
            </p>
            <div className="relative aspect-square rounded-xl bg-neutral-100 overflow-hidden mb-3">
              {primary ? (
                <Image
                  src={encodeURI(primary.url)}
                  alt={primary.alt}
                  fill
                  sizes="240px"
                  className="object-contain p-3"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-neutral-400">
                  <FiImage className="text-3xl" />
                </div>
              )}
              <button
                type="button"
                className="absolute bottom-2 right-2 inline-flex items-center gap-1 h-8 px-2.5 rounded-md bg-neutral-900/80 text-white-base text-xs font-semibold backdrop-blur hover:bg-neutral-900"
              >
                <FiUpload /> Replace
              </button>
            </div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-2">
              Gallery
            </p>
            <button
              type="button"
              className="w-full h-20 rounded-xl border border-dashed border-neutral-300 grid place-items-center text-sm font-semibold text-neutral-500 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50/30"
            >
              <span className="inline-flex items-center gap-1.5">
                <FiUpload /> Drop images or click to upload
              </span>
            </button>
          </section>

          {/* Videos */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-1 flex items-center gap-2">
              <FiVideo className="text-primary-600" /> Videos
            </h3>
            <p className="text-xs text-neutral-500 mb-3">
              Paste a YouTube URL — the ID is extracted automatically.
            </p>
            <ul className="space-y-2 mb-3">
              {(product.videos ?? []).map((v, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-lg border border-neutral-100"
                >
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100">
                    {v.youtubeId}
                  </span>
                  <span className="flex-1 text-xs text-neutral-700 truncate">
                    {v.title}
                  </span>
                  <button
                    type="button"
                    aria-label="Remove"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:text-error-500"
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-600 hover:border-primary-400 hover:text-primary-700"
            >
              <FiPlus /> Add video
            </button>
          </section>

          {/* Audit */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Audit</h3>
            <dl className="space-y-2 text-xs">
              <Audit
                icon={<FiClock />}
                label="Created"
                value={product.publishedAt}
              />
              <Audit
                icon={<FiClock />}
                label="Last update"
                value={`${product.publishedAt} · 14:22 BST`}
              />
              <Audit
                icon={<FiUser />}
                label="By"
                value="fatima@liquemix.com"
              />
              <Audit
                icon={<FiFileText />}
                label="Product ID"
                value={
                  <code className="font-mono text-[10px] text-neutral-500">
                    {product.id}
                  </code>
                }
              />
            </dl>
            <Link
              href={`/admin/audit?entity=${product.id}`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              Full audit trail <FiDownload className="text-[10px]" />
            </Link>
          </section>
        </aside>
      </div>

      {/* Floating save bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 hidden sm:flex items-center gap-1.5">
            <span className="block w-1.5 h-1.5 rounded-full bg-success-500" />
            Autosaves every 5 seconds when wired to the API.
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-error-300 hover:text-error-500"
            >
              Discard
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
            >
              <FiSave /> Save draft
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)]"
            >
              <FiSave /> Save &amp; publish
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
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

function Audit({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded text-neutral-400 mt-0.5">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <dt className="text-neutral-500">{label}</dt>
        <dd className="font-semibold text-neutral-800">{value}</dd>
      </div>
    </div>
  );
}
