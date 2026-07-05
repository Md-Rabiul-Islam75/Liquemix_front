import Image from "next/image";
import { fetchTopClients } from "@/data/topClients";

/**
 * Top-clients logos above the segments section.
 *   • Few logos → a static centered row (no duplication).
 *   • Enough to overflow → an infinite left-to-right marquee (the track is
 *     duplicated so it loops seamlessly).
 * Hides itself entirely when no active clients exist.
 */
const MARQUEE_THRESHOLD = 6;

export default async function TopClientsCarousel() {
  const clients = await fetchTopClients();
  if (clients.length === 0) return null;

  const scroll = clients.length > MARQUEE_THRESHOLD;
  const track = scroll ? [...clients, ...clients] : clients;

  return (
    <section className="bg-white-base py-12 md:py-14 border-b border-neutral-100">
      <p className="text-center text-xs font-bold tracking-[0.22em] uppercase text-neutral-400 mb-8">
        Trusted by industry leaders
      </p>
      <div className={scroll ? "lqx-marquee-mask overflow-hidden" : "container-page"}>
        <div
          className={`flex items-center gap-12 md:gap-16 ${
            scroll ? "lqx-marquee w-max" : "flex-wrap justify-center"
          }`}
        >
          {track.map((c, i) => (
            <div
              key={`${c.id}-${i}`}
              className="flex items-center justify-center shrink-0"
              title={c.name}
              aria-hidden={scroll && i >= clients.length}
            >
              {c.logo ? (
                <span className="relative h-14 w-36">
                  <Image
                    src={c.logo}
                    alt={c.name}
                    fill
                    sizes="144px"
                    className="object-contain"
                    unoptimized
                  />
                </span>
              ) : (
                <span className="text-lg font-bold text-neutral-500 whitespace-nowrap">
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
