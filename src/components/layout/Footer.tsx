import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaLinkedinIn, FaFacebookF, FaWeixin } from "react-icons/fa";
import { segments } from "@/data/segments";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-24">
      {/* CTA strip */}
      <div className="brand-gradient">
        <div className="container-page py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white-base">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-balance">
              Have a project? Talk to a LiqueMix engineer.
            </h2>
            <p className="mt-2 text-white/85 max-w-xl">
              From basement waterproofing to industrial flooring — get a system
              recommendation, sample, or quotation in under 4 business hours.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="https://wa.me/8801000000000"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[10px] bg-white-base text-primary-700 font-semibold shadow-lg hover:bg-accent-50 transition-colors"
            >
              <FaWhatsapp className="text-lg" /> WhatsApp
            </Link>
            <Link href="/contact" className="btn-outline-light">
              Contact form
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-page py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <Image
            src="/logo/LiqueMix.png"
            alt="LiqueMix"
            width={240}
            height={70}
            className="h-12 w-auto brightness-0 invert opacity-90"
          />
          <p className="mt-5 text-sm text-neutral-400 max-w-sm">
            LiqueMix — Construction Chemical & Industrial Solutions. Engineered
            in Bangladesh, trusted on projects across Asia, the Middle East,
            and beyond.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[
              { icon: <FaWhatsapp />, href: "https://wa.me/8801000000000", label: "WhatsApp" },
              { icon: <FaLinkedinIn />, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
              { icon: <FaWeixin />, href: "#", label: "WeChat" },
            ].map((s) => (
              <a
                key={s.label}
                aria-label={s.label}
                href={s.href}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-white-base hover:bg-secondary-500 hover:border-secondary-500 transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white-base mb-4">
            Products
          </p>
          <ul className="space-y-2.5 text-sm">
            {segments.map((seg) => (
              <li key={seg.id}>
                <Link
                  href={`/products/${seg.slug}`}
                  className="text-neutral-400 hover:text-accent-400 transition-colors"
                >
                  {seg.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white-base mb-4">
            Explore
          </p>
          <ul className="space-y-2.5 text-sm">
            {[
              ["/solutions", "System Solutions"],
              ["/references", "References"],
              ["/downloads", "Downloads"],
              ["/news", "News & Press"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-neutral-400 hover:text-accent-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white-base mb-4">
            Company
          </p>
          <ul className="space-y-2.5 text-sm">
            {[
              ["/about", "About Us"],
              ["/about/quality", "Quality"],
              ["/about/sustainability", "Sustainability"],
              ["/about/careers", "Careers"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-neutral-400 hover:text-accent-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white-base mb-4">
            Reach us
          </p>
          <address className="not-italic text-sm text-neutral-400 leading-relaxed">
            LiqueMix HQ<br />
            Dhaka, Bangladesh<br />
            <a href="mailto:info@liquemix.com" className="text-accent-400 hover:underline">
              info@liquemix.com
            </a><br />
            <a href="mailto:support@liquemix.com" className="hover:text-accent-400">
              support@liquemix.com
            </a>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} LiqueMix. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/legal/privacy" className="hover:text-neutral-300">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-neutral-300">Terms</Link>
            <Link href="/legal/imprint" className="hover:text-neutral-300">Imprint</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
