"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaWhatsapp, FaLinkedinIn, FaFacebookF, FaWeixin } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { useSettings } from "@/components/providers/SettingsProvider";
import { fetchOffices, type Office } from "@/data/offices";
import Flag from "@/components/common/Flag";

/**
 * Thin dark bar above the main nav. Social links are driven by admin Site
 * Settings (same source as the footer). Centred between the tagline and the
 * links is a "global presence" signal — real SVG flags of every active office
 * — shown only when we're genuinely multi-office, linking to /contact.
 */
export default function TopBar() {
  const settings = useSettings();

  // Active offices for the centred presence flags. Fetched client side (same
  // pattern as the header's live segments). Only surfaced when there is more
  // than one office — a single office is nothing to advertise.
  const [offices, setOffices] = useState<Office[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetchOffices()
      .then((list) => {
        if (!cancelled) setOffices(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const multi = offices.length > 1;

  return (
    <div className="hidden md:block bg-neutral-900 text-white-base">
      <div className="container-page relative flex items-center justify-between h-9 text-xs">
        <p className="text-neutral-300">
          <span className="text-accent-400 font-semibold">LiqueMix</span> —
          Construction Chemical &amp; Industrial Solutions
        </p>

        {/* Global presence — centred, real flags, only when multi-office */}
        {multi && (
          <Link
            href="/contact"
            aria-label="Our offices"
            className="group absolute left-1/2 -translate-x-1/2 hidden lg:inline-flex items-center gap-2"
          >
            <span className="flex items-center gap-1">
              {offices.map((o) => (
                <Flag
                  key={o.id || o.label}
                  label={o.label}
                  w={18}
                  h={13}
                  className="ring-1 ring-white/20"
                />
              ))}
            </span>
            <span className="font-semibold bg-gradient-to-r from-accent-300 via-secondary-300 to-accent-300 bg-clip-text text-transparent">
              Now serving {offices.length} regions
            </span>
            <FiArrowRight className="text-white/50 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
          </Link>
        )}

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
