"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiArrowRight,
  FiHelpCircle,
  FiMinus,
  FiPlus,
  FiMessageCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappUrl, buildEnquiryMessage } from "@/components/contact/EnquireOptions";

const FAQS: { question: string; answer: string; tag: string }[] = [
  {
    tag: "Specification",
    question:
      "How do I choose between mineral-based, bitumen, and sheet-membrane waterproofing?",
    answer:
      "It comes down to substrate, water-table pressure, and the layer that sits on top. Mineral slurries like Hydro-Guard 3X bond directly to concrete and accept tiles or screeds above. Bitumen suits below-grade work where the membrane stays buried. Sheet membranes are best when you need a single warranted system over large horizontal areas. A LiqueMix engineer can confirm in under an hour — share the section drawing on WhatsApp.",
  },
  {
    tag: "Service & Support",
    question: "Do you provide on-site application support?",
    answer:
      "Yes — included in the quotation, not invoiced as extra. Our technical service engineers attend the first day of every system installation: substrate inspection, mix-water ratios, applicator briefing, and a sign-off on the first 50 m² before the crew runs the full pour.",
  },
  {
    tag: "Quality & Documentation",
    question: "What documents ship with every product order?",
    answer:
      "Every batch leaves the plant with a Material Test Certificate (MTC), the current Technical Data Sheet (TDS), and a Safety Data Sheet (MSDS). Structural products (R4-class repair mortars, precision grouts) additionally carry a Declaration of Performance against the relevant EN standard. All documents are downloadable from each product page without needing to register.",
  },
  {
    tag: "Logistics",
    question: "What's the lead time for bulk orders to a jobsite?",
    answer:
      "Standard items ship in 3–5 working days from Dhaka to anywhere in Bangladesh, 10–14 working days to ports across South-East Asia and the Middle East. For 20-tonne+ pours, we recommend opening a 4-week conversation so we can reserve production capacity and arrange shaded warehousing on or near your site.",
  },
  {
    tag: "Sustainability",
    question: "How does LiqueMix measure embodied carbon?",
    answer:
      "We publish absolute CO₂ figures per tonne of product, audited against a 2020 baseline. By end-2026 every product family will carry a third-party-verified Environmental Product Declaration (EPD). Our concrete-technology range has already cut embodied carbon by 18% through PCE water reduction and clinker substitution with calcined clay.",
  },
  {
    tag: "Pricing & Samples",
    question: "Can I get samples before specifying a system?",
    answer:
      "Yes. 1–5 kg samples ship free to specifiers and main contractors within Bangladesh, and at-cost internationally. Request via WhatsApp with the project name, expected area in m², and your delivery address — we'll send a tracking number the same business day.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="section bg-gradient-to-b from-white-base to-primary-50/30">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left rail — heading + reassurance + CTA */}
          <div className="lg:col-span-4">
            <span className="eyebrow">
              <span className="block w-4 h-px bg-primary-500" /> Q &amp; A
            </span>
            <h2 className="section-title mt-3">
              Answers from the LiqueMix lab and the field.
            </h2>
            <p className="section-subtitle">
              The six questions our technical service team hears most often.
              If yours isn't here, ask us — we reply within four business
              hours.
            </p>

            <div className="mt-8 lg:sticky lg:top-28 space-y-3">
              <a
                href={whatsappUrl(buildEnquiryMessage())}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[10px] bg-[#25D366] text-white-base font-semibold shadow-[0_8px_24px_-8px_rgba(37,211,102,0.45)] hover:bg-[#1ea355] transition-colors"
              >
                <FaWhatsapp className="text-lg" /> Ask on WhatsApp
              </a>
              <Link
                href="/contact"
                className="w-full btn-ghost"
              >
                <FiMessageCircle /> More enquiry options
              </Link>

              <div className="mt-6 p-5 rounded-2xl border border-primary-100 bg-white-base shadow-soft flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 text-lg shrink-0">
                  <FiHelpCircle />
                </span>
                <div>
                  <p className="text-sm font-bold text-neutral-900">
                    Can't find the question?
                  </p>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                    Send us the project type, location, and what you're
                    trying to achieve — we'll come back with the system
                    that fits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-8">
            <ul className="space-y-3">
              {FAQS.map((faq, i) => {
                const isOpen = openIdx === i;
                return (
                  <li
                    key={faq.question}
                    className={`rounded-2xl border bg-white-base shadow-soft transition-all duration-300 ${
                      isOpen
                        ? "border-primary-200 shadow-primary"
                        : "border-neutral-100 hover:border-primary-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="w-full text-left flex items-start gap-4 p-5 md:p-6"
                    >
                      <span
                        className={`mt-0.5 inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors ${
                          isOpen
                            ? "bg-primary-500 text-white-base"
                            : "bg-primary-50 text-primary-600"
                        }`}
                      >
                        {isOpen ? <FiMinus /> : <FiPlus />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold tracking-wider uppercase">
                          {faq.tag}
                        </span>
                        <span className="block mt-2 text-base md:text-lg font-bold text-neutral-900 leading-snug">
                          {faq.question}
                        </span>
                      </span>
                    </button>

                    {/* Smooth open/close via grid-rows trick — no JS measure,
                        no fixed max-height guess. */}
                    <div
                      id={`faq-panel-${i}`}
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 md:px-6 pb-5 md:pb-6 pl-[4.5rem] md:pl-[5rem] text-sm md:text-base text-neutral-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer CTA strip — keeps a path open for visitors who scroll
                through every answer without clicking. */}
            <div className="mt-8 rounded-2xl brand-gradient text-white-base p-6 md:p-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="text-lg font-bold leading-tight">
                  Still chasing a specification?
                </p>
                <p className="mt-1 text-sm text-white/85">
                  Share your section drawing or pour schedule — we'll come
                  back with a system in under four business hours.
                </p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[10px] bg-white-base text-primary-700 font-semibold hover:bg-accent-50 transition-colors"
              >
                Talk to an engineer <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
