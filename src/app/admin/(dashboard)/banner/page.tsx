"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiImage, FiLogIn, FiSave, FiVideo } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ImagePicker from "@/components/admin/ImagePicker";
import VideoPicker from "@/components/admin/VideoPicker";
import LogoListManager from "@/components/admin/LogoListManager";
import { adminGet, adminPut, getToken } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/data/settings";

export default function AdminBannerPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [savedForm, setSavedForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  const [products, setProducts] = useState<{ slug: string; name: string }[]>([]);
  useEffect(() => {
    if (hasToken !== true) return;
    (async () => {
      try {
        const page = await adminGet<{ items: { slug: string; name: string }[] }>(
          "/api/v1/admin/catalog/products?page=1&size=100"
        );
        setProducts((page.items ?? []).map((p) => ({ slug: p.slug, name: p.name })));
      } catch {
        /* selector falls back to free-text slug */
      }
    })();
  }, [hasToken]);

  useEffect(() => {
    if (hasToken !== true) return;
    (async () => {
      try {
        const live = await adminGet<Partial<SiteSettings>>(
          "/api/v1/admin/site/settings"
        );
        const merged: SiteSettings = { ...DEFAULT_SETTINGS };
        for (const key of Object.keys(merged) as (keyof SiteSettings)[]) {
          const v = live?.[key];
          if (typeof v === "string") merged[key] = v;
        }
        if (!merged.bannerMode) merged.bannerMode = "default";
        setForm(merged);
        setSavedForm(merged);
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Failed to load banner settings.");
      } finally {
        setLoaded(true);
      }
    })();
  }, [hasToken]);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    setSubmitting(true);
    try {
      const updated = await adminPut<SiteSettings>("/api/v1/admin/site/settings", form);
      const merged: SiteSettings = { ...form };
      for (const key of Object.keys(merged) as (keyof SiteSettings)[]) {
        const v = updated?.[key];
        if (typeof v === "string") merged[key] = v;
      }
      setForm(merged);
      setSavedForm(merged);
      SuccessToast("Banner saved", "The public homepage now reflects your changes.");
    } catch (e) {
      ErrorToast("Save failed", e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setSubmitting(false);
    }
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(savedForm);
  const isVideo = form.bannerMode === "video";

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Banner"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href="/admin/login?next=/admin/banner"
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
        eyebrow="Banner"
        title="Homepage banner"
        description="The first thing every visitor sees. Choose the default image banner or a video banner, then manage the certification strip that sits below it."
      />

      {!loaded ? (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          Loading banner…
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-error-300 bg-error-50 p-6 text-sm text-error-500">
          {loadError}
        </div>
      ) : (
        <div className="space-y-6 pb-24">
          {/* Mode toggle */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">Banner mode</h2>
            <p className="text-xs text-neutral-500 mb-4">
              Pick which banner the public homepage shows. Only the selected one is live.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ModeCard
                active={!isVideo}
                icon={<FiImage />}
                title="Default banner"
                desc="The classic hero — headline, stats, and two product cards."
                onClick={() => set("bannerMode", "default")}
              />
              <ModeCard
                active={isVideo}
                icon={<FiVideo />}
                title="Video banner"
                desc="A looping video with a “Watch video” button that opens a longer clip."
                onClick={() => set("bannerMode", "video")}
              />
            </div>
          </section>

          {/* DEFAULT mode fields */}
          {!isVideo && (
            <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
              <h2 className="text-base font-bold text-neutral-900 mb-1">Default banner content</h2>
              <p className="text-xs text-neutral-500 mb-5">
                Headline is split across two lines on a line-break.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Eyebrow">
                  <input type="text" value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} className="admin-input" maxLength={240} />
                </Field>
                <Field label="Headline (two lines, separated by Enter)">
                  <textarea rows={2} value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} className="admin-input resize-none" maxLength={400} />
                </Field>
                <Field label="Subtitle" className="lg:col-span-2">
                  <textarea rows={3} value={form.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} className="admin-input resize-none" />
                </Field>
              </div>

              <h3 className="mt-6 mb-1 text-sm font-bold text-neutral-900">Banner stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Products">
                  <input type="text" value={form.statProducts} onChange={(e) => set("statProducts", e.target.value)} className="admin-input" maxLength={40} placeholder="200+" />
                </Field>
                <Field label="Countries served">
                  <input type="text" value={form.statCountries} onChange={(e) => set("statCountries", e.target.value)} className="admin-input" maxLength={40} placeholder="40+" />
                </Field>
                <Field label="Reference projects">
                  <input type="text" value={form.statReferences} onChange={(e) => set("statReferences", e.target.value)} className="admin-input" maxLength={40} placeholder="1500+" />
                </Field>
              </div>

              <h3 className="mt-6 mb-1 text-sm font-bold text-neutral-900">Banner product cards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Primary product (large card)">
                  <ProductSelect products={products} value={form.heroPrimaryProductSlug} onChange={(v) => set("heroPrimaryProductSlug", v)} />
                </Field>
                <Field label="Secondary product (small card)">
                  <ProductSelect products={products} value={form.heroSecondaryProductSlug} onChange={(v) => set("heroSecondaryProductSlug", v)} />
                </Field>
              </div>
            </section>
          )}

          {/* VIDEO mode fields */}
          {isVideo && (
            <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
              <h2 className="text-base font-bold text-neutral-900 mb-1">Video banner</h2>
              <p className="text-xs text-neutral-500 mb-5">
                The short video loops silently in the banner. The long video opens in an
                overlay when a visitor clicks “Watch video”. Each can be a YouTube link or an
                uploaded MP4/WebM.
              </p>

              <h3 className="mb-2 text-sm font-bold text-neutral-900">Short banner video (loops)</h3>
              <VideoPicker value={form.bannerShortVideoUrl} onChange={(v) => set("bannerShortVideoUrl", v)} prefix="banner/video" label="Short video" />

              <h3 className="mt-6 mb-2 text-sm font-bold text-neutral-900">Long video (“Watch video”)</h3>
              <VideoPicker value={form.bannerLongVideoUrl} onChange={(v) => set("bannerLongVideoUrl", v)} prefix="banner/video" label="Long video" />

              <h3 className="mt-6 mb-2 text-sm font-bold text-neutral-900">Poster image (optional)</h3>
              <p className="text-xs text-neutral-500 mb-3">Shown before the short video loads / while it buffers.</p>
              <ImagePicker
                value={form.bannerVideoPoster}
                onChange={(v) => set("bannerVideoPoster", v)}
                prefix="banner/poster"
                aspectClass="aspect-video"
                uploadLabel="Choose a poster image"
                replaceLabel="Replace poster image"
              />
            </section>
          )}

          {/* Certifications — sits below the banner on the public page, both modes */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">Certifications strip</h2>
            <p className="text-xs text-neutral-500 mb-5">
              Logos shown directly below the banner on the home page — in both default and
              video modes. Hidden on the public site until at least one is active. Changes
              here save immediately (independent of the banner Save button).
            </p>
            <LogoListManager
              endpoint="/api/v1/admin/content/certifications"
              itemNoun="certification"
              uploadPrefix="certifications"
              addLabel="Add certification"
            />
          </section>
        </div>
      )}

      {/* Floating save bar (banner settings only) */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-end gap-3">
          {loaded && !dirty && (
            <span className="text-xs text-neutral-400 hidden sm:inline">No unsaved changes</span>
          )}
          <button
            type="button"
            onClick={() => setDiscardOpen(true)}
            disabled={submitting || !loaded || !dirty}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-error-300 hover:text-error-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={submitting || !loaded || !dirty}
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiSave /> {submitting ? "Saving…" : "Save banner"}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={discardOpen}
        title="Discard changes?"
        message="The banner form will revert to your last saved values."
        confirmLabel="Discard changes"
        onConfirm={() => {
          setForm(savedForm);
          setDiscardOpen(false);
        }}
        onCancel={() => setDiscardOpen(false)}
      />
    </>
  );
}

function ModeCard({
  active,
  icon,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border-2 p-4 transition-colors ${
        active
          ? "border-primary-500 bg-primary-50/50"
          : "border-neutral-200 bg-white-base hover:border-primary-300"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg mb-2 ${
          active ? "bg-primary-500 text-white-base" : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {icon}
      </span>
      <p className="text-sm font-bold text-neutral-900">{title}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
    </button>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function ProductSelect({
  products,
  value,
  onChange,
}: {
  products: { slug: string; name: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const known = products.some((p) => p.slug === value);
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="admin-input">
      <option value="">— None —</option>
      {!known && value && <option value={value}>{value} (current)</option>}
      {products.map((p) => (
        <option key={p.slug} value={p.slug}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
