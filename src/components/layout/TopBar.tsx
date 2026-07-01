"use client";

import Link from "next/link";
import { FaWhatsapp, FaLinkedinIn, FaFacebookF, FaWeixin } from "react-icons/fa";
import { useSettings } from "@/components/providers/SettingsProvider";

/**
 * Thin dark bar above the main nav. Every social link is driven by admin
 * Site Settings via the SettingsProvider context (same source the footer
 * and contact page use), so editing settings updates here too — not just
 * the footer.
 */
export default function TopBar() {
  const settings = useSettings();

  return (
    <div className="hidden md:block bg-neutral-900 text-white-base">
      <div className="container-page flex items-center justify-between h-9 text-xs">
        <p className="text-neutral-300">
          <span className="text-accent-400 font-semibold">LiqueMix</span> —
          Construction Chemical & Industrial Solutions
        </p>
        <div className="flex items-center gap-5">
          <Link href="/service/downloads" className="text-neutral-300 hover:text-white-base transition-colors">
            Downloads
          </Link>
          <Link href="/references" className="text-neutral-300 hover:text-white-base transition-colors">
            References
          </Link>
          <Link href="/contact" className="text-neutral-300 hover:text-white-base transition-colors">
            Contact
          </Link>
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <a
              aria-label={`WhatsApp: +${settings.whatsappNumber}`}
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-accent-400 transition-colors"
            >
              <FaWhatsapp />
            </a>
            <a
              aria-label="LinkedIn"
              href={settings.linkedinUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-accent-400 transition-colors"
            >
              <FaLinkedinIn />
            </a>
            <a
              aria-label="Facebook"
              href={settings.facebookUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-accent-400 transition-colors"
            >
              <FaFacebookF />
            </a>
            {/* WeChat has no URL from a handle — surface the handle on hover,
                same as the footer. */}
            <a
              aria-label={`WeChat: ${settings.wechatHandle}`}
              title={`WeChat: ${settings.wechatHandle}`}
              href="#"
              className="hover:text-accent-400 transition-colors"
            >
              <FaWeixin />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
