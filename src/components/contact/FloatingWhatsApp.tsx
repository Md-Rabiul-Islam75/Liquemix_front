"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { LIQUEMIX_CONTACT, whatsappUrl, buildEnquiryMessage } from "./EnquireOptions";

/**
 * Site-wide floating WhatsApp button. Appears after the user scrolls past
 * the hero so it doesn't compete with the primary CTA on the first screen.
 * Tooltip expands on hover (lg+) to nudge towards Enquire.
 */
export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const href = whatsappUrl(buildEnquiryMessage());

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-5 right-5 md:bottom-7 md:right-7 z-40 flex items-end gap-2 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      {/* Hover bubble (lg+ only — phones get the icon alone). */}
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Enquire on WhatsApp at ${LIQUEMIX_CONTACT.phoneDisplay}`}
        className="hidden lg:flex group items-center gap-2 px-4 h-12 rounded-full bg-white-base shadow-[0_10px_30px_-10px_rgba(15,19,32,0.25)] border border-neutral-100 text-sm font-semibold text-neutral-800 hover:text-[#25D366] transition-colors"
      >
        <span>Chat with us on WhatsApp</span>
        <span className="text-[11px] text-neutral-400 group-hover:text-[#25D366]">
          {LIQUEMIX_CONTACT.phoneDisplay}
        </span>
      </a>

      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Open WhatsApp chat"
        className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white-base text-3xl shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] hover:scale-110 transition-transform"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-25"
        />
        <FaWhatsapp className="relative" />
      </a>

      <button
        type="button"
        aria-label="Hide WhatsApp button"
        onClick={() => setDismissed(true)}
        className="hidden md:inline-flex absolute -top-2 -right-2 items-center justify-center w-6 h-6 rounded-full bg-neutral-900 text-white-base text-xs hover:bg-neutral-700"
      >
        <FiX />
      </button>
    </div>
  );
}
