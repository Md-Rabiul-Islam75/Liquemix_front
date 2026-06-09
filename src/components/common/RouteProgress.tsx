"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Global navigation loader. With no loading.tsx files, App Router keeps the
 * current page on screen while the next one is fetched; this shows a brand
 * top bar + spinner during that wait so a click always gives feedback.
 *
 * It starts on an internal link click (or back/forward) and **clears the moment
 * the route actually changes** — i.e. exactly when the new page is ready, so
 * a 0.5s page shows the loader for 0.5s, not a fixed delay. Uses usePathname
 * only (no useSearchParams/Suspense, which could freeze this subtree mid-
 * navigation and leave the loader stuck on).
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    setActive(false);
    if (safety.current) clearTimeout(safety.current);
  };

  // Route committed (path changed) → the new page is on screen → hide.
  useEffect(() => {
    clear();
  }, [pathname]);

  useEffect(() => {
    function startFor(samePath: boolean) {
      setActive(true);
      if (safety.current) clearTimeout(safety.current);
      // Path navigations clear via the usePathname effect above. A query-only
      // change (same path) won't trip that effect, so bound it with a short
      // timeout. The longer bound is just a safety net for a cancelled nav.
      safety.current = setTimeout(() => setActive(false), samePath ? 1200 : 8000);
    }

    function onClick(e: MouseEvent) {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      const samePath = url.pathname === window.location.pathname;
      // Exact same URL → nothing will load.
      if (samePath && url.search === window.location.search) return;
      startFor(samePath);
    }

    function onPopState() {
      startFor(false);
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      if (safety.current) clearTimeout(safety.current);
    };
  }, []);

  if (!active) return null;

  return (
    <div aria-live="polite" aria-busy="true">
      {/* Slim top progress bar — sliding brand gradient. The route-level
          loading.tsx skeletons now own "page is loading" feedback, so this
          is just a lightweight "navigation in progress" hint and never
          covers content (which previously made a loaded page still look
          like it was loading). */}
      <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-primary-100/40 overflow-hidden">
        <span className="lqm-route-bar absolute top-0 h-full rounded-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500" />
      </div>
    </div>
  );
}
