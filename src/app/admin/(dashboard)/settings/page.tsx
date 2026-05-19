import { FiMail, FiPhone, FiSave } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/PageHeader";

export const metadata = { title: "Site settings" };

export default function AdminSettingsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Settings"
        title="Site settings"
        description="Global settings the public site reads from — contact channels, social URLs, homepage hero copy."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact channels */}
        <section className="lg:col-span-2 rounded-2xl bg-white-base border border-neutral-100 p-5 md:p-6">
          <h2 className="text-base font-bold text-neutral-900 mb-1">
            Contact channels
          </h2>
          <p className="text-xs text-neutral-500 mb-5">
            Used by the floating WhatsApp button, /contact page, and product
            enquiry deep-links.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="WhatsApp number">
              <input
                type="text"
                defaultValue="8801000000000"
                className="admin-input font-mono"
              />
            </Field>
            <Field label="Phone (display)">
              <input
                type="text"
                defaultValue="+880 1000-000000"
                className="admin-input"
              />
            </Field>
            <Field label="Email — sales" className="sm:col-span-2">
              <input
                type="email"
                defaultValue="sales@liquemix.com"
                className="admin-input"
              />
            </Field>
            <Field label="Email — technical">
              <input
                type="email"
                defaultValue="support@liquemix.com"
                className="admin-input"
              />
            </Field>
            <Field label="Email — general">
              <input
                type="email"
                defaultValue="info@liquemix.com"
                className="admin-input"
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
                defaultValue="https://linkedin.com/company/liquemix"
                className="admin-input"
              />
            </Field>
            <Field label="Facebook">
              <input
                type="url"
                defaultValue="https://facebook.com/liquemix"
                className="admin-input"
              />
            </Field>
            <Field label="WeChat handle">
              <input
                type="text"
                defaultValue="liquemix_bd"
                className="admin-input"
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
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Field label="Eyebrow">
              <input
                type="text"
                defaultValue="Construction Chemicals · Engineered Systems"
                className="admin-input"
              />
            </Field>
            <Field label="Headline (two lines)">
              <textarea
                rows={2}
                defaultValue={"Build on simple systems.\nEngineered for the real world."}
                className="admin-input resize-none"
              />
            </Field>
            <Field label="Subtitle" className="lg:col-span-2">
              <textarea
                rows={3}
                defaultValue="From basement waterproofing to industrial flooring — LiqueMix delivers complete engineered systems with full technical documentation, applicator support, and a guaranteed service life."
                className="admin-input resize-none"
              />
            </Field>
          </div>
        </section>

        {/* SLA / business hours */}
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
                defaultValue="Plot 42, Dhaka EPZ\nSavar, Dhaka 1349\nBangladesh"
                className="admin-input resize-none"
              />
            </Field>
            <Field label="Reply SLA">
              <input
                type="text"
                defaultValue="< 4 business hours"
                className="admin-input"
              />
            </Field>
            <Field label="Business days">
              <input
                type="text"
                defaultValue="Sunday–Thursday"
                className="admin-input"
              />
            </Field>
            <Field label="Business hours">
              <input
                type="text"
                defaultValue="9:00–18:00 (GMT+6)"
                className="admin-input"
              />
            </Field>
            <Field label="Map link">
              <input
                type="url"
                defaultValue="https://maps.google.com/?q=Dhaka+EPZ+Savar"
                className="admin-input"
              />
            </Field>
          </div>
        </section>
      </div>

      {/* Save bar */}
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700"
        >
          Discard
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600 shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)]"
        >
          <FiSave /> Save settings
        </button>
      </div>

      <p className="mt-6 text-xs text-neutral-500 inline-flex items-center gap-1.5">
        <FiMail className="text-neutral-400" /> Settings power every contact
        surface — header, footer, floating WhatsApp, product enquiry, /contact.
        <FiPhone className="text-neutral-400" />
      </p>
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
