import Link from "next/link";
import { FaWhatsapp, FaLinkedinIn, FaFacebookF, FaWeixin } from "react-icons/fa";
import { FiMail, FiPhone, FiArrowUpRight } from "react-icons/fi";

/**
 * Centralised LiqueMix contact endpoints. Update these in one place — every
 * page that imports `EnquireOptions` picks up the change.
 *
 * NOTE: replace the placeholder numbers/handles with the live ones before
 * launch. Country code 880 = Bangladesh.
 */
export const LIQUEMIX_CONTACT = {
  whatsappNumber: "8801000000000",                   // 88 01000-000000
  phoneDisplay: "+880 1000-000000",
  phoneTel: "+8801000000000",
  emailGeneral: "info@liquemix.com",
  emailSales: "sales@liquemix.com",
  emailTechnical: "support@liquemix.com",
  linkedin: "https://linkedin.com/company/liquemix",
  facebook: "https://facebook.com/liquemix",
  wechat: "#",                                       // WeChat QR code modal — out of scope for v1
} as const;

/**
 * Builds a WhatsApp click-to-chat URL with a prefilled message body.
 * Reference: https://faq.whatsapp.com/5913398998672934
 */
export function whatsappUrl(message: string): string {
  const u = new URL(`https://wa.me/${LIQUEMIX_CONTACT.whatsappNumber}`);
  u.searchParams.set("text", message);
  return u.toString();
}

export type EnquireContext = {
  /** Product name if the user clicked Enquire from a product detail page. */
  productName?: string;
  /** Product SKU for inclusion in the message body. */
  productSku?: string;
  /** Public URL of the product, so the LiqueMix engineer can open it immediately. */
  productUrl?: string;
};

/**
 * Builds the default enquiry message body. Engineers reading the message see
 * exactly which product the visitor was on (name + SKU + link), so they can
 * answer with full context.
 */
export function buildEnquiryMessage(ctx: EnquireContext = {}): string {
  if (ctx.productName && ctx.productSku) {
    const lines = [
      `Hi LiqueMix, I'd like to enquire about ${ctx.productName} (SKU: ${ctx.productSku}).`,
      "",
      "Could you share:",
      "  • Availability and lead time",
      "  • Pricing for my project quantity",
      "  • Application support / on-site demo",
    ];
    if (ctx.productUrl) {
      lines.push("", `Product page: ${ctx.productUrl}`);
    }
    return lines.join("\n");
  }
  return [
    "Hi LiqueMix, I'd like to talk to a technical engineer about an upcoming project.",
    "",
    "  • Project type:",
    "  • Location:",
    "  • Approximate quantity / area:",
  ].join("\n");
}

export default function EnquireOptions({
  context,
  layout = "grid",
}: {
  context?: EnquireContext;
  /** "grid" for landing pages, "list" for sidebars. */
  layout?: "grid" | "list";
}) {
  const message = buildEnquiryMessage(context);
  const wa = whatsappUrl(message);

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
      hint: LIQUEMIX_CONTACT.emailSales,
      href: `mailto:${LIQUEMIX_CONTACT.emailSales}?subject=${encodeURIComponent(
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
      hint: LIQUEMIX_CONTACT.emailTechnical,
      href: `mailto:${LIQUEMIX_CONTACT.emailTechnical}?subject=${encodeURIComponent(
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
      hint: LIQUEMIX_CONTACT.phoneDisplay,
      href: `tel:${LIQUEMIX_CONTACT.phoneTel}`,
      bg: "bg-secondary-500",
      external: false,
      primary: false,
    },
    {
      key: "linkedin",
      icon: <FaLinkedinIn />,
      label: "LinkedIn",
      hint: "Follow updates and DM the team.",
      href: LIQUEMIX_CONTACT.linkedin,
      bg: "bg-[#0a66c2]",
      external: true,
      primary: false,
    },
    {
      key: "facebook",
      icon: <FaFacebookF />,
      label: "Facebook",
      hint: "Messenger reaches sales directly.",
      href: LIQUEMIX_CONTACT.facebook,
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
  );
}
