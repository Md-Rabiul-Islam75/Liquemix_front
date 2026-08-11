import Image from "next/image";
import { fetchTopClients } from "@/data/topClients";

/**
 * Top-clients logo strip above the segments section.
 *   • 4 or fewer logos → a static, centered row of cards (no motion).
 *   • More than 4 → an infinite right-to-left marquee; the track is duplicated
 *     so it loops seamlessly (translateX 0 → -50%). Pauses on hover; respects
 *     reduced motion.
 * Hides itself entirely when no active clients exist.
 */
const MARQUEE_THRESHOLD = 4;

export default async function TopClientsCarousel() {
  const clients = await fetchTopClients();
  if (clients.length === 0) return null;

  const scroll = clients.length > MARQUEE_THRESHOLD;
  const track = scroll ? [...clients, ...clients] : clients;

  return (
    <section className="bg-gradient-to-b from-neutral-50 to-white-base py-14 md:py-20 border-y border-neutral-100">
      <div className="text-center mb-10 md:mb-12">
        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary-500 mb-2.5">
          Our Clients
        </p>
        <h2 className="text-2xl md:text-[2rem] font-bold tracking-tight text-neutral-900">
          Trusted by <span className="brand-gradient-text">Industry Leaders</span>
        </h2>
      </div>

      <div className={scroll ? "lqx-marquee-mask overflow-hidden" : "container-page"}>
        <div
          className={`flex items-center gap-6 md:gap-8 ${
            scroll ? "lqx-marquee w-max" : "flex-wrap justify-center"
          }`}
        >
          {track.map((c, i) => (
            <div
              key={`${c.id}-${i}`}
              title={c.name}
              aria-hidden={scroll && i >= clients.length}
              className="group shrink-0 flex items-center justify-center h-24 md:h-28 w-52 md:w-60 px-8 rounded-2xl bg-white-base border border-neutral-100 shadow-[0_6px_24px_-14px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_12px_32px_-14px_rgba(21,101,192,0.35)]"
            >
              {c.logo ? (
                <span className="relative h-14 md:h-16 w-full opacity-90 transition-opacity duration-300 group-hover:opacity-100">
                  <Image
                    src={c.logo}
                    alt={c.name}
                    fill
                    sizes="240px"
                    className="object-contain"
                    unoptimized
                  />
                </span>
              ) : (
                <span className="text-xl md:text-2xl font-bold text-neutral-400 whitespace-nowrap transition-colors duration-300 group-hover:text-primary-600">
                  {c.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
