"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiLogIn, FiMail, FiPhone, FiSave } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { adminGet, adminPut, getToken } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/data/settings";

export default function AdminSettingsPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  // The last persisted state — what the form reverts to on Discard. Set on
  // first load and after every successful save (so Discard returns to the
  // last save, not the raw defaults).
  const [savedForm, setSavedForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  // Product list for the hero card selectors.
  const [products, setProducts] = useState<{ slug: string; name: string }[]>([]);
  useEffect(() => {
    if (hasToken !== true) return;
    (async () => {
      try {
        const page = await adminGet<{ items: { slug: string; name: string }[] }>(
          "/api/v1/admin/catalog/products?page=1&size=100"
        );
        setProducts(
          (page.items ?? []).map((p) => ({ slug: p.slug, name: p.name }))
        );
      } catch {
        /* selector just falls back to a free-text slug if this fails */
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
        // Merge over defaults so any nulls from a freshly-seeded row
        // become sensible strings in the form.
        const merged: SiteSettings = { ...DEFAULT_SETTINGS };
        for (const key of Object.keys(merged) as (keyof SiteSettings)[]) {
          const v = live?.[key];
          if (typeof v === "string") merged[key] = v;
        }
        setForm(merged);
        setSavedForm(merged);
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : "Failed to load settings."
        );
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
      const updated = await adminPut<SiteSettings>(
        "/api/v1/admin/site/settings",
        form
      );
      // The PUT response carries the row back; fold it into the form so
      // any server-side trims are reflected.
      const merged: SiteSettings = { ...form };
      for (const key of Object.keys(merged) as (keyof SiteSettings)[]) {
        const v = updated?.[key];
        if (typeof v === "string") merged[key] = v;
      }
      setForm(merged);
      setSavedForm(merged); // this is the new "last saved" baseline
      SuccessToast(
        "Settings saved",
        "The public site now reflects your changes."
      );
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
    // Revert to the last saved state — not the raw defaults.
    setForm(savedForm);
    setDiscardOpen(false);
  }

  // Are there unsaved edits since the last save/load?
  const dirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Settings"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href="/admin/login?next=/admin/settings"
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
        eyebrow="Settings"
        title="Site settings"
        description="Global settings the public site reads from — contact channels, social URLs, homepage hero copy, business hours."
      />

      {!loaded ? (
        <div className="rounded-2xl border border-neutral-100 bg-white-base p-12 text-center text-sm text-neutral-500">
          Loading settings…
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-error-300 bg-error-50 p-6 text-sm text-error-500">
          {loadError}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24">
          {/* Contact channels */}
          <section className="lg:col-span-2 rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Contact channels
            </h2>
            <p className="text-xs text-neutral-500 mb-5">
              Used by the floating WhatsApp button, /contact page, and
              product enquiry deep-links.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="WhatsApp number">
                <input
                  type="text"
                  value={form.whatsappNumber}
                  onChange={(e) => set("whatsappNumber", e.target.value)}
                  className="admin-input font-mono"
                  maxLength={40}
                />
              </Field>
              <Field label="Phone (display)">
                <input
                  type="text"
                  value={form.phoneDisplay}
                  onChange={(e) => set("phoneDisplay", e.target.value)}
                  className="admin-input"
                  maxLength={60}
                />
              </Field>
              <Field label="Phone (tel: link)">
                <input
                  type="text"
                  value={form.phoneTel}
                  onChange={(e) => set("phoneTel", e.target.value)}
                  className="admin-input font-mono"
                  maxLength={60}
                />
              </Field>
              <Field label="Email — sales">
                <input
                  type="email"
                  value={form.emailSales}
                  onChange={(e) => set("emailSales", e.target.value)}
                  className="admin-input"
                  maxLength={200}
                />
              </Field>
              <Field label="Email — technical">
                <input
                  type="email"
                  value={form.emailTechnical}
                  onChange={(e) => set("emailTechnical", e.target.value)}
                  className="admin-input"
                  maxLength={200}
                />
              </Field>
              <Field label="Email — general">
                <input
                  type="email"
                  value={form.emailGeneral}
                  onChange={(e) => set("emailGeneral", e.target.value)}
                  className="admin-input"
                  maxLength={200}
                />
              </Field>
            </div>
          </section>

          {/* Social */}
          <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Social URLs
            </h2>
            <p className="text-xs text-neutral-500 mb-5">
              Linked from the footer and the contact page.
            </p>
            <div className="space-y-3">
              <Field label="LinkedIn">
                <input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => set("linkedinUrl", e.target.value)}
                  className="admin-input"
                  maxLength={500}
                />
              </Field>
              <Field label="Facebook">
                <input
                  type="url"
                  value={form.facebookUrl}
                  onChange={(e) => set("facebookUrl", e.target.value)}
                  className="admin-input"
                  maxLength={500}
                />
              </Field>
              <Field label="WeChat handle">
                <input
                  type="text"
                  value={form.wechatHandle}
                  onChange={(e) => set("wechatHandle", e.target.value)}
                  className="admin-input"
                  maxLength={120}
                />
              </Field>
            </div>
          </section>

          {/* Hero copy */}
          <section className="lg:col-span-3 rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Homepage hero
            </h2>
            <p className="text-xs text-neutral-500 mb-5">
              The first thing every visitor sees on the public site.
              Headline is split across two lines on a line-break.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Field label="Eyebrow">
                <input
                  type="text"
                  value={form.heroEyebrow}
                  onChange={(e) => set("heroEyebrow", e.target.value)}
                  className="admin-input"
                  maxLength={240}
                />
              </Field>
              <Field label="Headline (two lines, separated by Enter)">
                <textarea
                  rows={2}
                  value={form.heroHeadline}
                  onChange={(e) => set("heroHeadline", e.target.value)}
                  className="admin-input resize-none"
                  maxLength={400}
                />
              </Field>
              <Field label="Subtitle" className="lg:col-span-2">
                <textarea
                  rows={3}
                  value={form.heroSubtitle}
                  onChange={(e) => set("heroSubtitle", e.target.value)}
                  className="admin-input resize-none"
                />
              </Field>
            </div>

            {/* KPI stats */}
            <h3 className="mt-6 mb-1 text-sm font-bold text-neutral-900">
              Banner stats
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              The three numbers under the headline. Type them exactly as shown
              (e.g. <code className="font-mono">200+</code>).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Products">
                <input
                  type="text"
                  value={form.statProducts}
                  onChange={(e) => set("statProducts", e.target.value)}
                  className="admin-input"
                  maxLength={40}
                  placeholder="200+"
                />
              </Field>
              <Field label="Countries served">
                <input
                  type="text"
                  value={form.statCountries}
                  onChange={(e) => set("statCountries", e.target.value)}
                  className="admin-input"
                  maxLength={40}
                  placeholder="40+"
                />
              </Field>
              <Field label="Reference projects">
                <input
                  type="text"
                  value={form.statReferences}
                  onChange={(e) => set("statReferences", e.target.value)}
                  className="admin-input"
                  maxLength={40}
                  placeholder="1500+"
                />
              </Field>
            </div>

            {/* Featured product cards */}
            <h3 className="mt-6 mb-1 text-sm font-bold text-neutral-900">
              Banner product cards
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              The two products shown in the banner. The first is the large
              card, the second is the smaller overlapping card.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Primary product (large card)">
                <ProductSelect
                  products={products}
                  value={form.heroPrimaryProductSlug}
                  onChange={(v) => set("heroPrimaryProductSlug", v)}
                />
              </Field>
              <Field label="Secondary product (small card)">
                <ProductSelect
                  products={products}
                  value={form.heroSecondaryProductSlug}
                  onChange={(v) => set("heroSecondaryProductSlug", v)}
                />
              </Field>
            </div>
          </section>

          {/* Operations */}
          <section className="lg:col-span-3 rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-neutral-900 mb-1">
              Operations
            </h2>
            <p className="text-xs text-neutral-500 mb-5">
              Office address, business hours, reply SLA — surfaced on /contact.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Field label="Office address" className="lg:col-span-2">
                <textarea
                  rows={3}
                  value={form.officeAddress}
                  onChange={(e) => set("officeAddress", e.target.value)}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label="Reply SLA">
                <input
                  type="text"
                  value={form.replySla}
                  onChange={(e) => set("replySla", e.target.value)}
                  className="admin-input"
                  maxLength={120}
                />
              </Field>
              <Field label="Business days">
                <input
                  type="text"
                  value={form.businessDays}
                  onChange={(e) => set("businessDays", e.target.value)}
                  className="admin-input"
                  maxLength={120}
                />
              </Field>
              <Field label="Business hours">
                <input
                  type="text"
                  value={form.businessHours}
                  onChange={(e) => set("businessHours", e.target.value)}
                  className="admin-input"
                  maxLength={120}
                />
              </Field>
              <Field label="Map link">
                <input
                  type="url"
                  value={form.mapLink}
                  onChange={(e) => set("mapLink", e.target.value)}
                  className="admin-input"
                  maxLength={600}
                />
              </Field>
            </div>
          </section>
        </div>
      )}

      {/* Floating save bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 hidden sm:inline-flex items-center gap-1.5">
            <FiMail className="text-neutral-400" /> Settings power every
            contact surface — header, footer, floating WhatsApp, product
            enquiry, /contact.
            <FiPhone className="text-neutral-400" />
          </p>
          <div className="flex items-center gap-3 ml-auto">
            {loaded && !dirty && (
              <span className="text-xs text-neutral-400 hidden sm:inline">
                No unsaved changes
              </span>
            )}
            <button
              type="button"
              onClick={() => setDiscardOpen(true)}
              disabled={submitting || !loaded || !dirty}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-error-300 hover:text-error-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-neutral-200 disabled:hover:text-neutral-700"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={submitting || !loaded || !dirty}
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSave /> {submitting ? "Saving…" : "Save settings"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={discardOpen}
        title="Discard changes?"
        message="The form will revert to your last saved values. Any edits since the last save will be lost."
        confirmLabel="Discard changes"
        onConfirm={onDiscard}
        onCancel={() => setDiscardOpen(false)}
      />
    </>
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

/** Product picker for the hero cards. Keeps the current slug selectable even
 *  if the product list failed to load (e.g. backend down). */
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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="admin-input"
    >
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
