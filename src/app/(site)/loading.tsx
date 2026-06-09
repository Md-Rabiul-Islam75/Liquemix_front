/**
 * Route-level loading UI for every public page. With this in place the App
 * Router shows an instant skeleton the moment a link is clicked — instead of
 * freezing the previous page until the next server render + data fetch
 * finishes. Header/Footer stay mounted (they live in the layout); only this
 * fills <main> while the page streams in.
 */
export default function SiteLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      {/* Page-header band */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="container-page py-10 md:py-14">
          <div className="h-3 w-32 rounded bg-neutral-200" />
          <div className="mt-4 h-9 w-2/3 max-w-xl rounded-lg bg-neutral-200" />
          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-neutral-200/80" />
          <div className="mt-2 h-4 w-1/2 max-w-md rounded bg-neutral-200/80" />
        </div>
      </div>

      {/* Card grid */}
      <div className="container-page py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-100 bg-white-base overflow-hidden"
            >
              <div className="aspect-[4/3] bg-neutral-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-20 rounded bg-neutral-200" />
                <div className="h-5 w-3/4 rounded bg-neutral-200" />
                <div className="h-4 w-full rounded bg-neutral-200/80" />
                <div className="h-4 w-2/3 rounded bg-neutral-200/80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
