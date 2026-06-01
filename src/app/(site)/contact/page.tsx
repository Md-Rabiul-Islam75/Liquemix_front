import type { Metadata } from "next";
import Link from "next/link";
import {
  FiMapPin,
  FiClock,
  FiArrowUpRight,
  FiPhoneCall,
} from "react-icons/fi";

import PageHeader from "@/components/common/PageHeader";
import EnquireOptions, {
  LIQUEMIX_CONTACT,
} from "@/components/contact/EnquireOptions";
import { products } from "@/data/products";
import { fetchSegmentsMap } from "@/data/segments";

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
  const segMap = product ? await fetchSegmentsMap() : null;
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

          {/* Address / hours grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl border border-neutral-100 bg-white-base p-6 md:p-8">
              <p className="brand-panel__eyebrow mb-3">Head office</p>
              <h3 className="text-xl font-bold text-neutral-900">
                LiqueMix HQ — Dhaka
              </h3>
              <address className="not-italic mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <p className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                    <FiMapPin className="text-primary-500" /> Address
                  </p>
                  <p className="text-neutral-800">
                    Plot 42, Dhaka EPZ
                    <br />
                    Savar, Dhaka 1349
                    <br />
                    Bangladesh
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                    <FiPhoneCall className="text-primary-500" /> Phone
                  </p>
                  <p className="text-neutral-800">
                    <a
                      href={`tel:${LIQUEMIX_CONTACT.phoneTel}`}
                      className="hover:text-primary-600"
                    >
                      {LIQUEMIX_CONTACT.phoneDisplay}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                    <FiClock className="text-primary-500" /> Business hours
                  </p>
                  <p className="text-neutral-800">
                    Sun–Thu · 9:00 – 18:00
                    <br />
                    Fri–Sat · Closed
                    <br />
                    <span className="text-xs text-neutral-500">
                      (Bangladesh Standard Time, GMT+6)
                    </span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
                    Email shortcuts
                  </p>
                  <ul className="space-y-1">
                    <li>
                      <a
                        href={`mailto:${LIQUEMIX_CONTACT.emailSales}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {LIQUEMIX_CONTACT.emailSales}
                      </a>{" "}
                      <span className="text-xs text-neutral-500">— sales</span>
                    </li>
                    <li>
                      <a
                        href={`mailto:${LIQUEMIX_CONTACT.emailTechnical}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {LIQUEMIX_CONTACT.emailTechnical}
                      </a>{" "}
                      <span className="text-xs text-neutral-500">— technical</span>
                    </li>
                    <li>
                      <a
                        href={`mailto:${LIQUEMIX_CONTACT.emailGeneral}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {LIQUEMIX_CONTACT.emailGeneral}
                      </a>{" "}
                      <span className="text-xs text-neutral-500">— general</span>
                    </li>
                  </ul>
                </div>
              </address>
            </div>

            {/* Map placeholder */}
            <div
              className="lg:col-span-5 rounded-2xl overflow-hidden relative min-h-[260px] p-8 flex flex-col justify-end text-white-base"
              style={{
                background:
                  "linear-gradient(135deg, #072454 0%, #1565c0 50%, #3f88d6 100%)",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="relative">
                <FiMapPin className="text-3xl text-accent-400 mb-3" />
                <p className="text-lg font-bold leading-tight">
                  Plot 42, Dhaka EPZ
                </p>
                <p className="text-sm text-white/80 mt-1">
                  Savar, Dhaka 1349 · Bangladesh
                </p>
                <a
                  href="https://maps.google.com/?q=Dhaka+EPZ+Savar+Bangladesh"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-300 hover:text-accent-200 mt-5"
                >
                  Open in Google Maps <FiArrowUpRight />
                </a>
              </div>
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
