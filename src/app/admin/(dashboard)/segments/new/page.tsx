"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiLogIn, FiSave } from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import ImagePicker from "@/components/admin/ImagePicker";
import { adminPost, getToken } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";

type SegmentColor = "blue" | "orange" | "yellow" | "green";

// New segments must reuse a brand colour — the public theme is built around
// exactly these four. Multiple segments may share a colour.
const COLORS: { value: SegmentColor; label: string; swatch: string }[] = [
  { value: "blue", label: "Cobalt blue", swatch: "bg-primary-500" },
  { value: "orange", label: "Vivid orange", swatch: "bg-secondary-500" },
  { value: "yellow", label: "Golden yellow", swatch: "bg-accent-500" },
  { value: "green", label: "Success green", swatch: "bg-success-500" },
];

/** URL-safe slug from a display name. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminSegmentNewPage() {
  const router = useRouter();

  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [color, setColor] = useState<SegmentColor>("blue");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [icon, setIcon] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill the slug from the name until the user edits the slug directly.
  function onName(v: string) {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  const canSubmit =
    !submitting &&
    name.trim().length > 0 &&
    slug.trim().length > 0 &&
    tagline.trim().length > 0 &&
    description.trim().length > 0;

  async function save() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload = {
        slug: slug.trim(),
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        color,
        heroImage: heroImage.trim() || null,
        icon: icon.trim() || null,
        displayOrder,
      };
      const created = await adminPost<{ id: number; name: string }>(
        "/api/v1/admin/catalog/segments",
        payload
      );
      SuccessToast("Segment created", `${created.name} is now live.`);
      router.push("/admin/segments");
      router.refresh();
    } catch (e) {
      ErrorToast("Create failed", e instanceof Error ? e.message : "Unknown error.");
      setSubmitting(false);
    }
  }

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Catalog · Segment"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href="/admin/login?next=/admin/segments/new"
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
        >
          <FiLogIn /> Go to sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog · Segment"
        title="New segment"
        description="Create a new product segment. It appears on the homepage grid, the mega-menu, and /products once saved."
        actions={
          <Link
            href="/admin/segments"
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
          >
            <FiArrowLeft /> Back
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        <div className="lg:col-span-8 space-y-6">
          <Section title="Brand copy" hint="Name, tagline, and description shown on the segment card and landing page.">
            <div className="grid grid-cols-1 gap-4">
              <Field label="Name" required>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onName(e.target.value)}
                  className="admin-input"
                  maxLength={160}
                  placeholder="e.g. Sealants & Adhesives"
                />
              </Field>
              <Field label="Tagline" required hint="One short line shown under the name.">
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="admin-input"
                  maxLength={240}
                />
              </Field>
              <Field label="Description" required hint="Two to three sentences for the segment hero.">
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="admin-input resize-y"
                />
              </Field>
            </div>
          </Section>

          <Section title="Hero image" hint="Shown on the segment landing page banner.">
            <ImagePicker
              value={heroImage}
              onChange={setHeroImage}
              aspectClass="aspect-[16/9]"
              prefix="segments"
              uploadLabel="Choose a hero image"
              replaceLabel="Replace hero image"
              helperText="JPG, PNG, WebP up to 5 MB. 16:9 looks best."
            />
          </Section>

          <Section title="Display" hint="Smaller display order shows first in the grid and mega-menu.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Icon name" hint="Optional. Lucide / Feather name (e.g. droplet, layers).">
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="admin-input font-mono text-sm"
                  maxLength={80}
                  placeholder="droplet"
                />
              </Field>
              <Field label="Display order">
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
                  className="admin-input font-mono"
                />
              </Field>
            </div>
          </Section>
        </div>

        {/* Sidebar — identity (slug + colour), editable only at creation */}
        <aside className="lg:col-span-4 space-y-5">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Brand identity</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Set the slug and colour now — the slug becomes part of every
                product URL under this segment, so choose carefully.
              </p>
            </div>

            <Field label="Slug" required hint="Lowercase, hyphenated. Auto-filled from the name.">
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                className="admin-input font-mono text-xs"
                maxLength={120}
                placeholder="sealants-and-adhesives"
              />
            </Field>

            <div>
              <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                Colour <span className="text-error-500">*</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {COLORS.map((c) => {
                  const on = color === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`flex items-center gap-2 px-3 h-10 rounded-lg border text-sm font-semibold transition-colors ${
                        on
                          ? "border-primary-300 bg-primary-50/60 text-neutral-900"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full ${c.swatch}`} />
                      {c.label}
                    </button>
                  );
                })}
              </div>
              <span className="block mt-1.5 text-[11px] text-neutral-400">
                Reuse a brand colour — the public theme supports these four.
              </span>
            </div>
          </section>
        </aside>
      </div>

      {/* Floating save bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 hidden sm:inline">
            {canSubmit ? "Ready to create." : "Add a name, slug, tagline, and description."}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/admin/segments"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-error-300 hover:text-error-500"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={!canSubmit}
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSave /> {submitting ? "Creating…" : "Create segment"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
      <h2 className="text-base font-bold text-neutral-900 mb-1">{title}</h2>
      {hint && <p className="text-xs text-neutral-500 mb-4">{hint}</p>}
      {!hint && <div className="mb-4" />}
      {children}
    </section>
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
      {hint && <span className="block mt-1 text-[11px] text-neutral-400">{hint}</span>}
    </label>
  );
}
