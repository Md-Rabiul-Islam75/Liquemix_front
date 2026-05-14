import Link from "next/link";
import { FaWhatsapp, FaLinkedinIn, FaFacebookF, FaWeixin } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="hidden md:block bg-neutral-900 text-white-base">
      <div className="container-page flex items-center justify-between h-9 text-xs">
        <p className="text-neutral-300">
          <span className="text-accent-400 font-semibold">LiqueMix</span> —
          Construction Chemical & Industrial Solutions
        </p>
        <div className="flex items-center gap-5">
          <Link href="/downloads" className="text-neutral-300 hover:text-white-base transition-colors">
            Downloads
          </Link>
          <Link href="/references" className="text-neutral-300 hover:text-white-base transition-colors">
            References
          </Link>
          <Link href="/contact" className="text-neutral-300 hover:text-white-base transition-colors">
            Contact
          </Link>
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <a aria-label="WhatsApp" href="https://wa.me/8801000000000" className="hover:text-accent-400 transition-colors">
              <FaWhatsapp />
            </a>
            <a aria-label="LinkedIn" href="https://linkedin.com" className="hover:text-accent-400 transition-colors">
              <FaLinkedinIn />
            </a>
            <a aria-label="Facebook" href="https://facebook.com" className="hover:text-accent-400 transition-colors">
              <FaFacebookF />
            </a>
            <a aria-label="WeChat" href="#" className="hover:text-accent-400 transition-colors">
              <FaWeixin />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
