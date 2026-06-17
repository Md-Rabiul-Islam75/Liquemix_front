"use client";

import Link from "next/link";
import { useState } from "react";
import { FaWhatsapp, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiPhone, FiArrowUpRight, FiCheckCircle } from "react-icons/fi";
import { useSettings } from "@/components/providers/SettingsProvider";
import {
  buildEnquiryMessage,
  recordEnquiryIdentity,
  whatsappUrl,
  type EnquireContext,
} from "@/lib/enquiry";
import { isFirebaseConfigured, signInWithGoogle } from "@/lib/firebase";
import { useEnquirer, saveEnquirer } from "@/lib/enquirer";

export default function EnquireOptions({
  context,
  layout = "grid",
}: {
  context?: EnquireContext;
  /** "grid" for landing pages, "list" for sidebars. */
  layout?: "grid" | "list";
}) {
  const settings = useSettings();
  const message = buildEnquiryMessage(context);
  const wa = whatsappUrl(message, settings);

  // ─── Enquire → Google sign-in gate ────────────────────────────────
  // When Firebase is configured, the visitor identifies themselves with
  // Google first (so the team can follow up + it shows in admin Enquiries).
  // Cached per session. If Firebase isn't set up, channels show directly.
  // Shared across the tab — also drives the "Signed in as …" chip in the
  // site header (see lib/enquirer.ts + Header.tsx).
  const enquirer = useEnquirer();
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gateEnabled = isFirebaseConfigured();

  async function handleGoogle() {
    setSigning(true);
    setError(null);
    try {
      const id = await signInWithGoogle();
      await recordEnquiryIdentity(id.idToken);
      saveEnquirer({ name: id.name, email: id.email });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        msg.includes("popup-closed") || msg.includes("cancelled")
          ? "Sign-in was cancelled."
          : "Couldn't sign you in. Please try again."
      );
    } finally {
      setSigning(false);
    }
  }

  if (gateEnabled && !enquirer) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white-base p-6 sm:p-8 text-center max-w-md mx-auto">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 text-xl mb-4">
          <FiMail />
        </span>
        <h3 className="text-lg font-bold text-neutral-900">
          Let&apos;s get you the right answer
        </h3>
        <p className="mt-2 text-sm text-neutral-600">
          Sign in with Google so our engineer can follow up. We only use your
          name and email to respond — it takes a second.
        </p>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={signing}
          className="mt-5 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-800 hover:border-primary-300 hover:bg-neutral-50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FcGoogle className="text-lg" />
          {signing ? "Signing in…" : "Continue with Google"}
        </button>
        {error && <p className="mt-3 text-xs text-error-500">{error}</p>}
      </div>
    );
  }

  const channels = [
    {
      key: "whatsapp",
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      hint: "Fastest reply — usually under 30 min during business hours.",
      href: wa,
      bg: "bg-[#25D366]",
      external: true,
      primary: true,
    },
    {
      key: "email-sales",
      icon: <FiMail />,
      label: "Email Sales",
      hint: settings.emailSales,
      href: `mailto:${settings.emailSales}?subject=${encodeURIComponent(
        context?.productName
          ? `Enquiry: ${context.productName}`
          : "LiqueMix project enquiry"
      )}&body=${encodeURIComponent(message)}`,
      bg: "bg-primary-500",
      external: false,
      primary: false,
    },
    {
      key: "email-tech",
      icon: <FiMail />,
      label: "Email Technical",
      hint: settings.emailTechnical,
      href: `mailto:${settings.emailTechnical}?subject=${encodeURIComponent(
        context?.productName
          ? `Technical: ${context.productName}`
          : "LiqueMix technical question"
      )}&body=${encodeURIComponent(message)}`,
      bg: "bg-accent-500",
      external: false,
      primary: false,
    },
    {
      key: "phone",
      icon: <FiPhone />,
      label: "Phone",
      hint: settings.phoneDisplay,
      href: `tel:${settings.phoneTel}`,
      bg: "bg-secondary-500",
      external: false,
      primary: false,
    },
    {
      key: "linkedin",
      icon: <FaLinkedinIn />,
      label: "LinkedIn",
      hint: "Follow updates and DM the team.",
      href: settings.linkedinUrl,
      bg: "bg-[#0a66c2]",
      external: true,
      primary: false,
    },
    {
      key: "facebook",
      icon: <FaFacebookF />,
      label: "Facebook",
      hint: "Messenger reaches sales directly.",
      href: settings.facebookUrl,
      bg: "bg-[#1877f2]",
      external: true,
      primary: false,
    },
  ];

  if (layout === "list") {
    return (
      <ul className="space-y-2">
        {channels.map((c) => (
          <li key={c.key}>
            <Link
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noreferrer noopener" : undefined}
              className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                c.primary
                  ? "border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/10"
                  : "border-neutral-100 hover:border-primary-200 hover:bg-primary-50/40"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-white-base ${c.bg}`}
              >
                {c.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900">{c.label}</p>
                <p className="text-xs text-neutral-500 truncate">{c.hint}</p>
              </div>
              <FiArrowUpRight className="text-neutral-400 group-hover:text-primary-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      {enquirer && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success-50 border border-success-200 text-success-700 text-sm">
          <FiCheckCircle className="shrink-0" />
          <span>
            Signed in as{" "}
            <span className="font-semibold">
              {enquirer.name || enquirer.email}
            </span>{" "}
            — pick how you&apos;d like to reach us.
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((c) => (
          <Link
            key={c.key}
            href={c.href}
          target={c.external ? "_blank" : undefined}
          rel={c.external ? "noreferrer noopener" : undefined}
          className={`group relative rounded-2xl border p-6 transition-all ${
            c.primary
              ? "border-[#25D366]/40 bg-[#25D366]/5 hover:border-[#25D366] hover:shadow-[0_10px_30px_-10px_rgba(37,211,102,0.45)] lg:col-span-3"
              : "border-neutral-100 bg-white-base hover:border-primary-200 hover:shadow-soft hover:-translate-y-1"
          }`}
        >
          <span
            className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-white-base text-xl mb-4 ${c.bg}`}
          >
            {c.icon}
          </span>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">{c.label}</h3>
            <FiArrowUpRight className="text-lg text-neutral-400 group-hover:text-primary-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            {c.hint}
          </p>
          {c.primary && (
            <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#25D366] text-white-base text-[10px] font-bold tracking-wider uppercase">
              Recommended
            </span>
          )}
        </Link>
      ))}
      </div>
    </div>
  );
}
