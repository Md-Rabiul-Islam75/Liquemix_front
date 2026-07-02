"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { FiLogIn, FiPlus, FiSave, FiX } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";
import ImagePicker from "@/components/admin/ImagePicker";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { adminGet, adminPut, getToken } from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";
import {
  ABOUT_ICON_KEYS,
  DEFAULT_ABOUT,
  fillDefaults,
  type AboutPage,
} from "@/data/about";

export default function AdminAboutPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(getToken() != null);
  }, []);

  const [form, setForm] = useState<AboutPage>(DEFAULT_ABOUT);
  const [savedForm, setSavedForm] = useState<AboutPage>(DEFAULT_ABOUT);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  useEffect(() => {
    if (hasToken !== true) return;
    (async () => {
      try {
        const live = await adminGet<Partial<AboutPage>>(
          "/api/v1/admin/site/about"
        );
        const merged = fillDefaults(live);
        setForm(merged);
        setSavedForm(merged);
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : "Failed to load About content."
        );
      } finally {
        setLoaded(true);
      }
    })();
  }, [hasToken]);

  function set<K extends keyof AboutPage>(key: K, value: AboutPage[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    setSubmitting(true);
    try {
      const updated = await adminPut<Partial<AboutPage>>(
        "/api/v1/admin/site/about",
        form
      );
      const merged = fillDefaults(updated);
      setForm(merged);
      setSavedForm(merged);
      SuccessToast(
        "About page saved",
        "The public /about page now reflects your changes."
      );
    } catch (e) {
      ErrorToast("Save failed", e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setSubmitting(false);
    }
  }

  function onDiscard() {
    setForm(savedForm);
    setDiscardOpen(false);
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  if (hasToken === false) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Content"
          title="Sign-in required"
          description="The admin API rejects unauthenticated calls."
        />
        <Link
          href="/admin/login?next=/admin/about"
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
        Loading About content…
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="About page"
        description="Edit every section of the public /about page. Changes go live after you save."
        actions={
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
          >
            View on site
          </a>
        }
      />

      {loadError && (
        <p className="mb-4 rounded-lg bg-error-50 border border-error-200 px-4 py-2 text-sm text-error-600">
          {loadError} — showing defaults.
        </p>
      )}

      <div className="space-y-6 pb-28 max-w-4xl">
        {/* Hero + meta */}
        <Section title="Hero & meta" hint="The banner at the top of /about and the browser/SEO title.">
          <Field label="Eyebrow">
            <input className="admin-input" value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
          </Field>
          <Field label="Title">
            <input className="admin-input" value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea rows={3} className="admin-input resize-y" value={form.heroDescription} onChange={(e) => set("heroDescription", e.target.value)} />
          </Field>
          <Field label="Meta title (browser tab / SEO)">
            <input className="admin-input" value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
          </Field>
          <Field label="Meta description (SEO)">
            <textarea rows={2} className="admin-input resize-y" value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
          </Field>
        </Section>

        {/* Values */}
        <Section title="Corporate Values" hint="Heading + the value cards.">
          <Field label="Heading">
            <input className="admin-input" value={form.valuesHeading} onChange={(e) => set("valuesHeading", e.target.value)} />
          </Field>
          <Field label="Subtitle">
            <textarea rows={2} className="admin-input resize-y" value={form.valuesSubtitle} onChange={(e) => set("valuesSubtitle", e.target.value)} />
          </Field>
          <ItemsEditor
            items={form.values}
            onChange={(v) => set("values", v)}
            addLabel="Add value"
            blank={() => ({ icon: "target", title: "", body: "" })}
            renderRow={(item, patch) => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="Icon"><IconSelect value={item.icon} onChange={(v) => patch({ icon: v })} /></Field>
                  <Field label="Title" className="md:col-span-2"><input className="admin-input" value={item.title} onChange={(e) => patch({ title: e.target.value })} /></Field>
                </div>
                <Field label="Body"><textarea rows={2} className="admin-input resize-y" value={item.body} onChange={(e) => patch({ body: e.target.value })} /></Field>
              </>
            )}
          />
        </Section>

        {/* Story */}
        <Section title="Our Story" hint="Heading + the timeline entries.">
          <Field label="Heading"><input className="admin-input" value={form.storyHeading} onChange={(e) => set("storyHeading", e.target.value)} /></Field>
          <Field label="Subtitle"><textarea rows={2} className="admin-input resize-y" value={form.storySubtitle} onChange={(e) => set("storySubtitle", e.target.value)} /></Field>
          <ItemsEditor
            items={form.timeline}
            onChange={(v) => set("timeline", v)}
            addLabel="Add timeline entry"
            blank={() => ({ year: "", title: "", body: "" })}
            renderRow={(item, patch) => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="Year"><input className="admin-input" value={item.year} onChange={(e) => patch({ year: e.target.value })} /></Field>
                  <Field label="Title" className="md:col-span-2"><input className="admin-input" value={item.title} onChange={(e) => patch({ title: e.target.value })} /></Field>
                </div>
                <Field label="Body"><textarea rows={2} className="admin-input resize-y" value={item.body} onChange={(e) => patch({ body: e.target.value })} /></Field>
              </>
            )}
          />
        </Section>

        {/* Management */}
        <Section title="Management" hint="Heading + the leadership team.">
          <Field label="Heading"><input className="admin-input" value={form.managementHeading} onChange={(e) => set("managementHeading", e.target.value)} /></Field>
          <Field label="Subtitle"><textarea rows={2} className="admin-input resize-y" value={form.managementSubtitle} onChange={(e) => set("managementSubtitle", e.target.value)} /></Field>
          <ItemsEditor
            items={form.leaders}
            onChange={(v) => set("leaders", v)}
            addLabel="Add person"
            blank={() => ({ name: "", role: "", bio: "", image: "" })}
            renderRow={(item, patch) => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Name"><input className="admin-input" value={item.name} onChange={(e) => patch({ name: e.target.value })} /></Field>
                  <Field label="Role"><input className="admin-input" value={item.role} onChange={(e) => patch({ role: e.target.value })} /></Field>
                </div>
                <Field label="Bio"><textarea rows={2} className="admin-input resize-y" value={item.bio} onChange={(e) => patch({ bio: e.target.value })} /></Field>
                <Field label="Photo (optional — initials shown if empty)">
                  <ImagePicker
                    value={item.image ?? ""}
                    onChange={(v) => patch({ image: v })}
                    aspectClass="aspect-square"
                    prefix="about/leaders"
                    uploadLabel="Choose a photo"
                    replaceLabel="Replace photo"
                    helperText="JPG, PNG, WebP. A square image looks best."
                  />
                </Field>
              </>
            )}
          />
        </Section>

        {/* Quality */}
        <Section title="Quality" hint="Heading + the certifications.">
          <Field label="Heading"><input className="admin-input" value={form.qualityHeading} onChange={(e) => set("qualityHeading", e.target.value)} /></Field>
          <Field label="Subtitle"><textarea rows={2} className="admin-input resize-y" value={form.qualitySubtitle} onChange={(e) => set("qualitySubtitle", e.target.value)} /></Field>
          <ItemsEditor
            items={form.certs}
            onChange={(v) => set("certs", v)}
            addLabel="Add certification"
            blank={() => ({ code: "", body: "" })}
            renderRow={(item, patch) => (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Code"><input className="admin-input" value={item.code} onChange={(e) => patch({ code: e.target.value })} /></Field>
                <Field label="Description" className="md:col-span-2"><input className="admin-input" value={item.body} onChange={(e) => patch({ body: e.target.value })} /></Field>
              </div>
            )}
          />
        </Section>

        {/* Sustainability */}
        <Section title="Sustainability" hint="Heading + the metric cards.">
          <Field label="Heading"><input className="admin-input" value={form.sustainabilityHeading} onChange={(e) => set("sustainabilityHeading", e.target.value)} /></Field>
          <Field label="Body"><textarea rows={2} className="admin-input resize-y" value={form.sustainabilityBody} onChange={(e) => set("sustainabilityBody", e.target.value)} /></Field>
          <ItemsEditor
            items={form.sustainability}
            onChange={(v) => set("sustainability", v)}
            addLabel="Add metric"
            blank={() => ({ icon: "zap", metric: "", label: "", body: "" })}
            renderRow={(item, patch) => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="Icon"><IconSelect value={item.icon} onChange={(v) => patch({ icon: v })} /></Field>
                  <Field label="Metric"><input className="admin-input" value={item.metric} onChange={(e) => patch({ metric: e.target.value })} /></Field>
                  <Field label="Label"><input className="admin-input" value={item.label} onChange={(e) => patch({ label: e.target.value })} /></Field>
                </div>
                <Field label="Body"><textarea rows={2} className="admin-input resize-y" value={item.body} onChange={(e) => patch({ body: e.target.value })} /></Field>
              </>
            )}
          />
        </Section>

        {/* Careers */}
        <Section title="Careers" hint="Heading, application email, open roles, and the KPI stats.">
          <Field label="Heading"><input className="admin-input" value={form.careersHeading} onChange={(e) => set("careersHeading", e.target.value)} /></Field>
          <Field label="Subtitle"><textarea rows={2} className="admin-input resize-y" value={form.careersSubtitle} onChange={(e) => set("careersSubtitle", e.target.value)} /></Field>
          <Field label="Application email"><input className="admin-input" value={form.careersEmail} onChange={(e) => set("careersEmail", e.target.value)} /></Field>

          <p className="text-xs font-bold tracking-wider uppercase text-neutral-500 mt-4 mb-2">Open roles</p>
          <ItemsEditor
            items={form.careerRoles}
            onChange={(v) => set("careerRoles", v)}
            addLabel="Add role"
            blank={() => ({ title: "", location: "", type: "Full-time" })}
            renderRow={(item, patch) => (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Title"><input className="admin-input" value={item.title} onChange={(e) => patch({ title: e.target.value })} /></Field>
                <Field label="Location"><input className="admin-input" value={item.location} onChange={(e) => patch({ location: e.target.value })} /></Field>
                <Field label="Type"><input className="admin-input" value={item.type} onChange={(e) => patch({ type: e.target.value })} /></Field>
              </div>
            )}
          />

          <p className="text-xs font-bold tracking-wider uppercase text-neutral-500 mt-6 mb-2">Careers KPI stats</p>
          <ItemsEditor
            items={form.careerStats}
            onChange={(v) => set("careerStats", v)}
            addLabel="Add stat"
            blank={() => ({ icon: "users", kpi: "", label: "" })}
            renderRow={(item, patch) => (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Icon"><IconSelect value={item.icon} onChange={(v) => patch({ icon: v })} /></Field>
                <Field label="KPI"><input className="admin-input" value={item.kpi} onChange={(e) => patch({ kpi: e.target.value })} /></Field>
                <Field label="Label"><input className="admin-input" value={item.label} onChange={(e) => patch({ label: e.target.value })} /></Field>
              </div>
            )}
          />
        </Section>

        {/* CTA */}
        <Section title="Final call-to-action" hint="The banner at the very bottom of /about.">
          <Field label="Heading"><input className="admin-input" value={form.ctaHeading} onChange={(e) => set("ctaHeading", e.target.value)} /></Field>
          <Field label="Body"><textarea rows={2} className="admin-input resize-y" value={form.ctaBody} onChange={(e) => set("ctaBody", e.target.value)} /></Field>
        </Section>
      </div>

      {/* Floating save/discard bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-20 border-t border-neutral-200 bg-white-base/95 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 hidden sm:inline">
            {submitting ? "Saving…" : dirty ? "Unsaved changes." : "All changes saved."}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            {dirty && (
              <button
                type="button"
                onClick={() => setDiscardOpen(true)}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-error-300 hover:text-error-500"
              >
                Discard
              </button>
            )}
            <button
              type="button"
              onClick={onSave}
              disabled={submitting || !dirty}
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSave /> {submitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={discardOpen}
        title="Discard changes?"
        message="This reverts every field back to the last saved version."
        confirmLabel="Discard"
        onConfirm={onDiscard}
        onCancel={() => setDiscardOpen(false)}
      />
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6 space-y-3">
      <div>
        <h2 className="text-base font-bold text-neutral-900">{title}</h2>
        {hint && <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block text-xs font-bold tracking-wider uppercase text-neutral-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select className="admin-input" value={value} onChange={(e) => onChange(e.target.value)}>
      {ABOUT_ICON_KEYS.map((k) => (
        <option key={k} value={k}>{k}</option>
      ))}
    </select>
  );
}

function ItemsEditor<T>({
  items,
  onChange,
  blank,
  addLabel,
  renderRow,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  blank: () => T;
  addLabel: string;
  renderRow: (item: T, patch: (p: Partial<T>) => void) => ReactNode;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-neutral-100 p-4 space-y-3 bg-neutral-50/40">
          {renderRow(item, (p) =>
            onChange(items.map((it, j) => (j === i ? { ...it, ...p } : it)))
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-error-500"
            >
              <FiX /> Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, blank()])}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700"
      >
        <FiPlus /> {addLabel}
      </button>
    </div>
  );
}
