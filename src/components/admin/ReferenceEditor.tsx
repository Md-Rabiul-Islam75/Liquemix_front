"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiSave, FiTrash2 } from "react-icons/fi";

import AdminPageHeader from "@/components/admin/PageHeader";
import ImagePicker from "@/components/admin/ImagePicker";
import ProductImageGallery, {
  type ProductImage,
} from "@/components/admin/ProductImageGallery";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { adminGet, adminPost, adminPut, adminDelete } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";

type Party = { name?: string | null; website?: string | null; email?: string | null };

type ReferenceDto = {
  id: number;
  slug: string;
  title: string;
  projectType: string;
  location?: { country?: string | null; city?: string | null } | null;
  year?: number | null;
  objectSize?: string | null;
  productsUsed?: number[] | null;
  challenge: string;
  solution: string;
  heroImage?: string | null;
  gallery?: ProductImage[] | null;
  applicator?: Party | null;
  architect?: Party | null;
  status: string;
};

type Props = { mode: "new"; id?: undefined } | { mode: "edit"; id: number };

/**
 * Create / edit a reference project. Talks to:
 *   GET    /api/v1/admin/content/references/{id}
 *   POST   /api/v1/admin/content/references
 *   PUT    /api/v1/admin/content/references/{id}
 *   DELETE /api/v1/admin/content/references/{id}
 */
export default function ReferenceEditor(props: Props) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const editId = props.mode === "edit" ? props.id : undefined;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [projectType, setProjectType] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [year, setYear] = useState("");
  const [objectSize, setObjectSize] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [gallery, setGallery] = useState<ProductImage[]>([]);
  const [applicatorName, setApplicatorName] = useState("");
  const [applicatorWebsite, setApplicatorWebsite] = useState("");
  const [applicatorEmail, setApplicatorEmail] = useState("");
  const [architectName, setArchitectName] = useState("");
  const [architectWebsite, setArchitectWebsite] = useState("");
  const [architectEmail, setArchitectEmail] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [productsUsed, setProductsUsed] = useState<number[]>([]);

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (editId == null) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const r = await adminGet<ReferenceDto>(
          `/api/v1/admin/content/references/${editId}`
        );
        if (cancelled) return;
        setTitle(r.title ?? "");
        setSlug(r.slug ?? "");
        setProjectType(r.projectType ?? "");
        setCountry(r.location?.country ?? "");
        setCity(r.location?.city ?? "");
        setYear(r.year != null ? String(r.year) : "");
        setObjectSize(r.objectSize ?? "");
        setChallenge(r.challenge ?? "");
        setSolution(r.solution ?? "");
        setHeroImage(r.heroImage ?? "");
        setGallery(r.gallery ?? []);
        setApplicatorName(r.applicator?.name ?? "");
        setApplicatorWebsite(r.applicator?.website ?? "");
        setApplicatorEmail(r.applicator?.email ?? "");
        setArchitectName(r.architect?.name ?? "");
        setArchitectWebsite(r.architect?.website ?? "");
        setArchitectEmail(r.architect?.email ?? "");
        setStatus(r.status === "published" ? "published" : "draft");
        setProductsUsed(r.productsUsed ?? []);
      } catch (e) {
        if (!cancelled)
          setLoadError(
            e instanceof Error ? e.message : "Failed to load the reference."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editId]);

  const canSubmit = useMemo(
    () =>
      !submitting &&
      title.trim().length > 0 &&
      projectType.trim().length > 0 &&
      year.trim().length > 0 &&
      challenge.trim().length > 0 &&
      solution.trim().length > 0,
    [submitting, title, projectType, year, challenge, solution]
  );

  function party(name: string, website: string, email: string): Party | null {
    if (!name.trim() && !website.trim() && !email.trim()) return null;
    return {
      name: name.trim() || null,
      website: website.trim() || null,
      email: email.trim() || null,
    };
  }

  function buildPayload() {
    return {
      title: title.trim(),
      slug: slug.trim() || null,
      projectType: projectType.trim(),
      location:
        country.trim() || city.trim()
          ? { country: country.trim() || null, city: city.trim() || null }
          : null,
      year: Number(year),
      objectSize: objectSize.trim() || null,
      productsUsed,
      challenge: challenge.trim(),
      solution: solution.trim(),
      heroImage: heroImage.trim() || null,
      gallery,
      applicator: party(applicatorName, applicatorWebsite, applicatorEmail),
      architect: party(architectName, architectWebsite, architectEmail),
      status,
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload = buildPayload();
      if (isEdit) {
        await adminPut<ReferenceDto>(
          `/api/v1/admin/content/references/${props.id}`,
          payload
        );
        SuccessToast(
          "Saved",
          status === "published" ? "Reference is live." : "Draft saved."
        );
        setTimeout(() => router.refresh(), 400);
      } else {
        const created = await adminPost<ReferenceDto>(
          "/api/v1/admin/content/references",
          payload
        );
        SuccessToast(
          status === "published" ? "Published" : "Draft created",
          `"${created.title}" saved.`
        );
        setTimeout(() => {
          router.push(`/admin/references/${created.id}`);
          router.refresh();
        }, 600);
      }
    } catch (err) {
      ErrorToast(
        "Couldn't save reference",
        err instanceof Error ? err.message : "Unknown error."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (editId == null) return;
    setDeleting(true);
    try {
      await adminDelete(`/api/v1/admin/content/references/${editId}`);
      SuccessToast("Deleted", "The reference has been removed.");
      setConfirmOpen(false);
      setTimeout(() => {
        router.push("/admin/references");
        router.refresh();
      }, 500);
    } catch (err) {
      ErrorToast(
        "Couldn't delete reference",
        err instanceof Error ? err.message : "Unknown error."
      );
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
        Loading reference…
      </div>
    );
  }

  if (loadError) {
    return (
      <AdminPageHeader
        eyebrow="References"
        title="Couldn't load reference"
        description={loadError}
        actions={
          <Link
            href="/admin/references"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
          >
            <FiArrowLeft /> Back to list
          </Link>
        }
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="References"
        title={isEdit ? "Edit reference" : "New reference"}
        description={
          isEdit
            ? "Update the case study, or publish a draft to push it live."
            : "Document a project: the challenge, the LiqueMix solution, and the outcome."
        }
        actions={
          <Link
            href="/admin/references"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300"
          >
            <FiArrowLeft /> Back to list
          </Link>
        }
      />

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24"
      >
        {/* Main column */}
        <div className="lg:col-span-8 space-y-6">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-4">
              Basic information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block sm:col-span-2">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Title <span className="text-error-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Marina Residences — Watertight Basement & Pool"
                  className="admin-input"
                />
                <span className="mt-1 block text-[11px] text-neutral-400">
                  Slug is auto-generated from the title if left blank.
                </span>
              </label>

              <label className="block sm:col-span-2">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Slug
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="marina-residences-dhaka"
                  className="admin-input font-mono"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Project type <span className="text-error-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="Residential High-Rise"
                  className="admin-input"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Completion year <span className="text-error-500">*</span>
                </span>
                <input
                  type="number"
                  required
                  min={1900}
                  max={2100}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  className="admin-input"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Country
                </span>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Bangladesh"
                  className="admin-input"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  City
                </span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dhaka"
                  className="admin-input"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Object size
                </span>
                <input
                  type="text"
                  value={objectSize}
                  onChange={(e) => setObjectSize(e.target.value)}
                  placeholder="42,000 m²"
                  className="admin-input"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-4">
              Challenge & solution
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  Challenge <span className="text-error-500">*</span>
                </span>
                <textarea
                  required
                  rows={4}
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="What made this project demanding?"
                  className="admin-input resize-y"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  LiqueMix solution <span className="text-error-500">*</span>
                </span>
                <textarea
                  required
                  rows={4}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Which systems were specified and how were they applied?"
                  className="admin-input resize-y"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Hero image
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              The main image on the reference card and detail page.
            </p>
            <ImagePicker
              value={heroImage}
              onChange={setHeroImage}
              aspectClass="aspect-[16/10]"
              uploadLabel="Choose a hero image"
              replaceLabel="Replace hero image"
            />
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Gallery
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Additional project photos. Paste a path or upload.
            </p>
            <ProductImageGallery images={gallery} onChange={setGallery} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Status</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="status"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                />
                Save as draft
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="status"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                />
                Published
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">Applicator</h3>
            <PartyFields
              name={applicatorName}
              setName={setApplicatorName}
              website={applicatorWebsite}
              setWebsite={setApplicatorWebsite}
              email={applicatorEmail}
              setEmail={setApplicatorEmail}
              namePlaceholder="Acme Waterproofing Co."
            />
          </section>

          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">Architect</h3>
            <PartyFields
              name={architectName}
              setName={setArchitectName}
              website={architectWebsite}
              setWebsite={setArchitectWebsite}
              email={architectEmail}
              setEmail={setArchitectEmail}
              namePlaceholder="Urbana Studio"
            />
          </section>

          {isEdit && (
            <section className="rounded-2xl bg-white-base border border-error-200 p-5">
              <h3 className="text-sm font-bold text-error-600 mb-1">
                Danger zone
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Removes the reference from the public site.
              </p>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-error-300 bg-white-base text-sm font-semibold text-error-600 hover:bg-error-50 disabled:opacity-60"
              >
                <FiTrash2 /> {deleting ? "Deleting…" : "Delete reference"}
              </button>
            </section>
          )}
        </aside>

        {/* Floating bottom bar */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
            <p className="text-xs text-neutral-500 hidden sm:inline">
              {canSubmit
                ? "Ready to save."
                : "Fill title, type, year, challenge, and solution to enable Save."}
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <Link
                href="/admin/references"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-error-300 hover:text-error-500"
              >
                Discard
              </Link>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiSave />
                {submitting
                  ? "Saving…"
                  : isEdit
                  ? "Save changes"
                  : status === "published"
                  ? "Create & publish"
                  : "Create draft"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        danger
        title="Delete this reference?"
        message="It will be removed from the public site. This can't be undone from here."
        confirmLabel="Delete reference"
        busy={deleting}
        onConfirm={onDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

function PartyFields({
  name,
  setName,
  website,
  setWebsite,
  email,
  setEmail,
  namePlaceholder,
}: {
  name: string;
  setName: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  namePlaceholder: string;
}) {
  return (
    <>
      <label className="block">
        <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
          Name
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={namePlaceholder}
          className="admin-input"
        />
      </label>
      <label className="block">
        <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
          Website
        </span>
        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://example.com"
          className="admin-input"
        />
      </label>
      <label className="block">
        <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contact@example.com"
          className="admin-input"
        />
      </label>
    </>
  );
}
