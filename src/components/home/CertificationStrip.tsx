import Image from "next/image";
import { FiAward } from "react-icons/fi";
import { fetchCertifications } from "@/data/certifications";

/**
 * Dynamic certification strip below the home-page banner (replaces the old
 * hardcoded TrustStrip). Admin-managed on the Banner page. Hides itself
 * entirely when no active certifications exist.
 */
export default async function CertificationStrip() {
  const items = await fetchCertifications();
  if (items.length === 0) return null;

  return (
    <section className="bg-white-base border-y border-neutral-100">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-6 py-8 md:py-10">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-3" title={it.name}>
            {it.logo ? (
              <span className="relative w-12 h-12 shrink-0">
                <Image
                  src={it.logo}
                  alt={it.name}
                  fill
                  sizes="48px"
                  className="object-contain"
                  unoptimized
                />
              </span>
            ) : (
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 text-xl shrink-0">
                <FiAward />
              </span>
            )}
            <p className="text-sm font-bold text-neutral-900 leading-tight">
              {it.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
