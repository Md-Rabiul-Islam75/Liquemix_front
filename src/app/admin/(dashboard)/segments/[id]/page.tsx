"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiEye,
  FiImage,
  FiLock,
  FiLogIn,
  FiSave,
  FiTrash,
  FiUpload,
  FiX,
} from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import { adminGet, adminPut, getToken } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";

type SegmentResponse = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  color: "blue" | "orange" | "yellow" | "green";
  heroImage?: string | null;
  icon?: string | null;
  displayOrder?: number;
  productCount: number;
  solutionCount: number;
};

const COLOR_LABEL: Record<SegmentResponse["color"], string> = {
  blue: "Cobalt blue — Waterproofing",
  orange: "Vivid orange — Tile & Stone",
  yellow: "Golden yellow — Flooring",
  green: "Success green — Concrete",
};

const COLOR_SWATCH: Record<SegmentResponse["color"], string> = {
  blue: "bg-primary-500",
  orange: "bg-secondary-500",
  yellow: "bg-accent-500",
  green: "bg-success-500",
};

const MAX_HERO_BYTES = 5 * 1024 * 1024;

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export default function AdminSegmentEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // Auth gate
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  const [segment, setSegment] = useState<SegmentResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hasToken !== true || !id) return;
    (async () => {
      try {
        const s = await adminGet<SegmentResponse>(
          `/api/v1/admin/catalog/segments/${id}`
        );
        setSegment(s);
        setName(s.name);
        setTagline(s.tagline);
        setDescription(s.description);
        setHeroImage(s.heroImage ?? "");
        setIcon(s.icon ?? "");
        setDisplayOrder(s.displayOrder ?? 0);
        setLoaded(true);
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : "Failed to load segment."
        );
        setLoaded(true);
      }
    })();
  }, [hasToken, id]);

  async function save() {
    if (!segment) return;
    setSubmitting(true);
    try {
      const payload = {
        // slug + color come from the loaded record (locked in the UI)
        slug: segment.slug,
        color: segment.color,
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        heroImage: heroImage.trim() || null,
        icon: icon.trim() || null,
        displayOrder,
      };
      const updated = await adminPut<SegmentResponse>(
        `/api/v1/admin/catalog/segments/${segment.id}`,
        payload
      );
      setSegment(updated);
      SuccessToast(
        "Segment saved",
        `${updated.name} now reflects across the public site.`
      );
      router.refresh();
    } catch (e) {
      ErrorToast(
        "Save failed",
        e instanceof Error ? e.message : "Unknown error."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function onDiscard() {
    if (window.confirm("Discard changes and return to the segments list?")) {
      router.push("/admin/segments");
    }
  }

  // ─── Render gates ─────────────────────────────────────────────────
  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Segment"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href={`/admin/login?next=/admin/segments/${id ?? ""}`}
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
        >
          <FiLogIn /> Go to sign in
        </Link>
      </>
    );
  }

  if (!loaded) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
        Loading segment…
      </div>
    );
  }

  if (loadError || !segment) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Segment"
          title="Couldn't load this segment"
          description={loadError ?? "Unknown error."}
          actions={
            <Link
              href="/admin/segments"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
            >
              <FiArrowLeft /> Back to list
            </Link>
          }
        />
      </>
    );
  }

  // ─── Render: form ─────────────────────────────────────────────────
  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog · Segment"
        title={name || segment.name}
        description={tagline || segment.tagline}
        actions={
          <>
            <a
              href={`/products/${segment.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
            >
              <FiEye /> View on site
            </a>
            <Link
              href="/admin/segments"
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
            >
              <FiArrowLeft /> Back
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-6">
          <Section
            title="Brand copy"
            hint="The name, tagline, and description appear on the homepage segments grid, the /products index, and the segment landing page."
          >
            <div className="grid grid-cols-1 gap-4">
              <Field label="Name" required>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-input"
                  maxLength={160}
                />
              </Field>
              <Field
                label="Tagline"
                required
                hint="One short, punchy line — shown under the name on the segment card."
              >
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="admin-input"
                  maxLength={240}
                />
              </Field>
              <Field
                label="Description"
                required
                hint="Two to three sentences — used on the segment landing page hero."
              >
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="admin-input resize-y"
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Hero image"
            hint="The image used on the segment's landing page banner."
          >
            <HeroImagePicker value={heroImage} onChange={setHeroImage} />
          </Section>

          <Section
            title="Display"
            hint="Smaller display order shows first in the homepage grid and the mega-menu."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Icon name"
                hint="Optional. Lucide / Feather icon name (e.g. droplet, grid, layers)."
              >
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

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-5">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Brand identity
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Slug and colour are locked — they're part of the LiqueMix
                  brand system and changing them would break every product
                  URL.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                <FiLock /> Locked
              </span>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                  Slug
                </dt>
                <dd>
                  <code className="block px-2 py-1.5 rounded-md bg-neutral-50 border border-neutral-100 font-mono text-xs text-neutral-700 break-all">
                    {segment.slug}
                  </code>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                  Colour
                </dt>
                <dd className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-neutral-50 border border-neutral-100">
                  <span
                    className={`block w-4 h-4 rounded-full ${COLOR_SWATCH[segment.color]}`}
                  />
                  <span className="text-xs font-semibold text-neutral-700">
                    {COLOR_LABEL[segment.color]}
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">
              Live counts
            </h3>
            <p className="text-[11px] text-neutral-500 mb-3">
              Derived from published rows on every request — not stored.
            </p>
            <dl className="grid grid-cols-2 gap-3">
              <Counter
                label="Products"
                value={segment.productCount}
                href={`/admin/products?segment=${segment.id}`}
              />
              <Counter
                label="Solutions"
                value={segment.solutionCount}
                href={`/admin/system-solutions`}
              />
            </dl>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">
              Audit
            </h3>
            <dl className="space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <dt className="text-neutral-500">Segment ID</dt>
                <dd>
                  <code className="font-mono text-[10px] text-neutral-700">
                    {segment.id}
                  </code>
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>

      {/* Floating save bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 hidden sm:inline">
            {submitting
              ? "Saving…"
              : "Changes save to the API when you click Save."}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onDiscard}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-error-300 hover:text-error-500 disabled:opacity-60"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={save}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSave /> {submitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

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

function Counter({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/40 transition-colors px-3 py-2.5"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500">
          {label}
        </span>
        <FiArrowUpRight className="text-neutral-400 text-[12px]" />
      </div>
      <div className="text-xl font-bold text-neutral-900">{value}</div>
    </Link>
  );
}

/**
 * Hero image picker — single-image. Supports two flows:
 *   1. Upload from disk (FileReader → base64 data URL), same v1 strategy
 *      as ProductImageGallery.
 *   2. Direct URL entry, for assets already served from /public.
 *
 * Storing as base64 keeps v1 simple — the segment row holds the URL or
 * data URL directly. When S3 lands the upload branch just swaps to a
 * POST that returns a CDN URL; nothing else here changes.
 */
function HeroImagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(`"${file.name}" is not an image.`);
      return;
    }
    if (file.size > MAX_HERO_BYTES) {
      setError(
        `"${file.name}" is ${fmtSize(file.size)} — max ${fmtSize(MAX_HERO_BYTES)}.`
      );
      return;
    }
    try {
      setBusy(true);
      const dataUrl = await readAsDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read file.");
    } finally {
      setBusy(false);
    }
  }

  function applyUrl() {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setUrlDraft("");
  }

  return (
    <div className="space-y-4">
      {value && (
        <div className="rounded-xl border border-neutral-100 bg-white-base p-3">
          <div className="relative w-full aspect-[16/9] rounded-lg bg-neutral-100 overflow-hidden mb-3">
            <Image
              src={value}
              alt="Segment hero"
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove image"
              className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-md bg-white-base/95 text-error-500 hover:bg-error-50 shadow-soft"
            >
              <FiTrash />
            </button>
          </div>
          <p
            className="text-[11px] font-mono text-neutral-500 truncate"
            title={value}
          >
            {value.startsWith("data:")
              ? `Uploaded image (${fmtSize(value.length)})`
              : value}
          </p>
        </div>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className="group rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/60 p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onPickFile}
          className="hidden"
        />
        <FiImage className="mx-auto text-2xl text-neutral-400 group-hover:text-primary-500 mb-2" />
        <p className="text-sm font-semibold text-neutral-800">
          {busy
            ? "Reading image…"
            : value
              ? "Replace hero image"
              : "Choose a hero image"}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Click to pick from your computer.
        </p>
        <span className="inline-flex items-center gap-1.5 mt-3 h-9 px-4 rounded-lg bg-primary-500 text-white-base text-sm font-semibold">
          <FiUpload /> Choose image
        </span>
        <p className="mt-2 text-[11px] text-neutral-400">
          JPG, PNG, WebP up to {fmtSize(MAX_HERO_BYTES)}. 16:9 aspect ratio
          looks best.
        </p>
      </div>

      <div
        className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <label className="block text-[10px] font-bold tracking-wider uppercase text-neutral-600 mb-2">
          Or enter a URL
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="/images/segments/waterproofing.jpg or https://…"
            className="admin-input font-mono text-xs flex-1"
          />
          <button
            type="button"
            onClick={applyUrl}
            disabled={!urlDraft.trim()}
            className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-neutral-200 bg-white-base text-xs font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-500 text-sm">
          <FiX className="text-base mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
