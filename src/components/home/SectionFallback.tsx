/**
 * Skeleton placeholders shown while an async home section streams in.
 *
 * The home page wraps each data-fetching section in its own <Suspense>
 * boundary (see app/(site)/page.tsx) so a slow backend call only delays
 * that one section instead of blocking the entire server render. These
 * fallbacks paint immediately and keep the layout from collapsing while
 * the real content resolves.
 */

/** Generic light-background section skeleton — header + a 3-card grid. */
export function SectionFallback() {
  return (
    <section className="section" aria-hidden>
      <div className="container-page">
        <div className="animate-pulse">
          <div className="h-3 w-28 bg-neutral-200 rounded mb-4" />
          <div className="h-9 w-2/3 max-w-xl bg-neutral-200 rounded mb-3" />
          <div className="h-4 w-1/2 max-w-md bg-neutral-100 rounded mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-72 bg-neutral-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Hero-sized dark skeleton — matches the branded hero band so the top
 *  of the page paints instantly instead of waiting on the (image-heavy)
 *  hero product fetch. */
export function HeroFallback() {
  return (
    <section className="relative overflow-hidden bg-neutral-900" aria-hidden>
      <div className="relative container-page py-20 md:py-28 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 animate-pulse">
          <div className="h-7 w-64 bg-white/10 rounded-full mb-6" />
          <div className="h-14 w-full max-w-2xl bg-white/10 rounded mb-4" />
          <div className="h-14 w-3/4 bg-white/10 rounded mb-8" />
          <div className="h-5 w-full max-w-xl bg-white/5 rounded mb-2" />
          <div className="h-5 w-2/3 bg-white/5 rounded" />
        </div>
        <div className="hidden sm:block lg:col-span-5">
          <div className="aspect-square max-w-[600px] mx-auto rounded-3xl bg-white/5 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
