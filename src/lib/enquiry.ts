import { DEFAULT_SETTINGS, type SiteSettings } from "@/data/settings";

/**
 * Pure helpers for building enquiry messages and WhatsApp click-to-chat
 * URLs. Kept out of the EnquireOptions component file because that file
 * is "use client" — and server components can't import from a client
 * module, even when the import is a plain function. This file has no
 * directive so both server and client trees can reach it.
 */

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

/**
 * Builds a WhatsApp click-to-chat URL with a prefilled message body.
 * Reference: https://faq.whatsapp.com/5913398998672934
 */
export function whatsappUrl(
  message: string,
  settings: SiteSettings = DEFAULT_SETTINGS
): string {
  const u = new URL(`https://wa.me/${settings.whatsappNumber}`);
  u.searchParams.set("text", message);
  return u.toString();
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/**
 * Records the person enquiring by sending their Google ID token to the
 * backend, which verifies it and upserts the user (name + email). That's
 * what surfaces them in the admin "Enquiries" list. Throws on failure so the
 * caller can show an error.
 */
export async function recordEnquiryIdentity(idToken: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Could not record your details (HTTP ${res.status}).`);
  }
}
