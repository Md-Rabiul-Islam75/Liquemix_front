import type { Metadata } from "next";
import Link from "next/link";
import {
  FiMapPin,
  FiClock,
  FiArrowUpRight,
  FiPhoneCall,
  FiMail,
  FiHome,
} from "react-icons/fi";

import PageHeader from "@/components/common/PageHeader";
import EnquireOptions from "@/components/contact/EnquireOptions";
import { products } from "@/data/products";
import { fetchSegmentsMap } from "@/data/segments";
import { fetchSiteSettings, type SiteSettings } from "@/data/settings";
import {
  fetchOffices,
  officesOrFallback,
  headquarters,
  telHref,
  type Office,
} from "@/data/offices";
import Flag from "@/components/common/Flag";

export const metadata: Metadata = {
  title: "Contact LiqueMix",
  description:
    "Enquire about LiqueMix construction-chemical products via WhatsApp, email, phone, or social — reply within four business hours.",
};

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const sp = await searchParams;
  const productSku = sp.product;

  // If the URL carries ?product=SKU, look up the product so the enquiry
  // surfaces the right context (name + link). Falls back to a generic
  // message if the SKU is unknown.
  const product = productSku
    ? products.find((p) => p.sku === productSku)
    : undefined;
  const [settings, segMap, offices] = await Promise.all([
    fetchSiteSettings(),
    product ? fetchSegmentsMap() : Promise.resolve(null),
    fetchOffices().catch(() => [] as Office[]),
  ]);
  // Live offices, or a single HQ synthesised from settings when none exist yet.
  // HQ is pinned first; the rest keep their display order.
  const officeList = officesOrFallback(offices, settings);
  const hq = headquarters(officeList);
  const orderedOffices = hq
    ? [hq, ...officeList.filter((o) => o !== hq)]
    : officeList;
  const segment = product
    ? segMap?.get(String(product.segmentId))
    : undefined;
  const productUrl =
    product && segment
      ? `https://liquemix.com/products/${segment.slug}/${product.slug}`
      : undefined;

  return (
    <>
      <PageHeader
        eyebrow={product ? `Enquire: ${product.name}` : "Get in touch"}
        title={
          product
            ? `Talk to a LiqueMix engineer about ${product.name}.`
            : "Talk to a LiqueMix engineer."
        }
        description={
          product
            ? `Pick the channel that suits you. We answer with a system recommendation, datasheet, sample, or quotation — usually within four business hours.`
            : "Pick the channel that suits you — WhatsApp for fastest reply, email for documents, phone for urgent jobsite questions, or social for everything in between."
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          ...(product
            ? [
                { label: "Products", href: "/products" },
                {
                  label: segment?.name ?? "Products",
                  href: segment ? `/products/${segment.slug}` : "/products",
                },
                {
                  label: product.name,
                  href: `/products/${segment?.slug}/${product.slug}`,
                },
                { label: "Enquire" },
              ]
            : [{ label: "Contact" }]),
        ]}
      />

      <section className="section pt-10">
        <div className="container-page space-y-10">
          {/* Global presence strip — flags + cities, only when we're multi-office */}
          {orderedOffices.length > 1 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-primary-100 bg-primary-50/40 px-5 py-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700">
                Global presence
              </span>
              <span className="hidden sm:inline text-primary-200" aria-hidden>
                |
              </span>
              <ul className="flex flex-wrap items-center gap-2">
                {orderedOffices.map((o) => (
                  <li
                    key={o.id || o.label}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white-base px-3 py-1 text-sm text-neutral-700"
                  >
                    <Flag label={o.label} w={20} h={14} className="ring-1 ring-black/5" />
                    <span className="font-medium">{o.city || o.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product context card (only when ?product= is set) */}
          {product && segment && (
            <div className="brand-panel-blue p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
              <div>
                <p className="brand-panel__eyebrow mb-1">
                  You&apos;re enquiring about
                </p>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {product.shortDescription}
                </p>
                <p className="mt-2 text-[11px] font-mono text-neutral-400">
                  SKU: {product.sku}
                </p>
              </div>
              <Link
                href={`/products/${segment.slug}/${product.slug}`}
                className="md:ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-600"
              >
                View product page <FiArrowUpRight />
              </Link>
            </div>
          )}

          {/* Channels */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {product ? "Send a pre-filled enquiry" : "Enquiry channels"}
            </h2>
            <p className="text-sm text-neutral-600 mb-6 max-w-2xl">
              {product
                ? "Each option opens the chat or email app with your enquiry already drafted — including the product name and SKU so our engineer can answer immediately."
                : "Each option opens your chat or email app pre-filled with a starter message. We reply during business hours, GMT+6."}
            </p>
            <EnquireOptions
              context={
                product
                  ? {
                      productName: product.name,
                      productSku: product.sku,
                      productUrl,
                    }
                  : undefined
              }
            />
          </div>

          {/* Offices */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {orderedOffices.length > 1 ? "Our offices" : "Head office"}
            </h2>
            <p className="text-sm text-neutral-600 mb-6 max-w-2xl">
              Visit, call, or email the office nearest you — we reply during
              business hours, GMT+6.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {orderedOffices.map((office) => (
                <OfficeCard
                  key={office.id || office.label}
                  office={office}
                  settings={settings}
                />
              ))}
            </div>

            {/* Email shortcuts — company-wide department inboxes */}
            <div className="mt-6 rounded-2xl border border-neutral-100 bg-white-base p-6">
              <p className="brand-panel__eyebrow mb-3">Email shortcuts</p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <li>
                  <a
                    href={`mailto:${settings.emailSales}`}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    {settings.emailSales}
                  </a>
                  <span className="block text-xs text-neutral-500">
                    Sales & quotations
                  </span>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.emailTechnical}`}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    {settings.emailTechnical}
                  </a>
                  <span className="block text-xs text-neutral-500">
                    Technical support
                  </span>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.emailGeneral}`}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    {settings.emailGeneral}
                  </a>
                  <span className="block text-xs text-neutral-500">
                    General enquiries
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Reassurance / SLA */}
          <div className="rounded-2xl border border-primary-100 bg-primary-50/40 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { kpi: "< 4 h", label: "Business-hour reply SLA" },
              { kpi: "40+", label: "Countries we ship to" },
              { kpi: "On-site", label: "Application support included" },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-3xl md:text-4xl font-bold text-primary-700">
                  {m.kpi}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * A single office address card. The headquarters card is visually promoted
 * (primary tint + badge) and is the only one that shows the company-wide
 * business hours / reply SLA. Fields render only when present.
 */
function OfficeCard({
  office,
  settings,
}: {
  office: Office;
  settings: SiteSettings;
}) {
  const isHq = office.isHeadquarters;
  // Per-office hours when set; the HQ falls back to the global Site-Settings
  // business hours. Other offices simply show nothing when hours are blank.
  const hoursText =
    office.hours?.trim() ||
    (isHq ? `${settings.businessDays} · ${settings.businessHours}` : null);
  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col ${
        isHq
          ? "border-primary-200 bg-primary-50/30 ring-1 ring-primary-100"
          : "border-neutral-100 bg-white-base"
      }`}
    >
      <div className="flex items-start gap-2.5 mb-4">
        <span className="inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-primary-500 text-white-base">
          <FiMapPin />
        </span>
        <div className="min-w-0">
          <p className="text-lg font-bold text-neutral-900 leading-tight">
            {office.label}
          </p>
          {office.city && (
            <p className="text-xs text-neutral-500">{office.city}</p>
          )}
        </div>
        {isHq && (
          <span className="ml-auto inline-flex items-center gap-1 px-2.5 h-6 shrink-0 rounded-full bg-primary-500 text-white-base text-[10px] font-bold uppercase tracking-wide">
            <FiHome className="text-[10px]" /> Head office
          </span>
        )}
      </div>

      <div className="space-y-3 text-sm">
        {office.address && (
          <p className="text-neutral-700 whitespace-pre-line leading-relaxed">
            {office.address}
          </p>
        )}
        {office.phone && (
          <p className="flex items-center gap-2">
            <FiPhoneCall className="text-primary-500 shrink-0" />
            <a
              href={telHref(office.phone)}
              className="text-neutral-800 hover:text-primary-600"
            >
              {office.phone}
            </a>
          </p>
        )}
        {office.email && (
          <p className="flex items-center gap-2">
            <FiMail className="text-primary-500 shrink-0" />
            <a
              href={`mailto:${office.email}`}
              className="text-primary-600 hover:text-primary-700 break-all"
            >
              {office.email}
            </a>
          </p>
        )}
        {hoursText && (
          <p className="flex items-start gap-2">
            <FiClock className="text-primary-500 shrink-0 mt-0.5" />
            <span className="text-neutral-700">
              {hoursText}
              {isHq && (
                <>
                  <br />
                  <span className="text-xs text-neutral-500">
                    Reply SLA: {settings.replySla}
                  </span>
                </>
              )}
            </span>
          </p>
        )}
      </div>

      {office.mapLink && (
        <a
          href={office.mapLink}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          Open in Google Maps <FiArrowUpRight />
        </a>
      )}
    </div>
  );
}
