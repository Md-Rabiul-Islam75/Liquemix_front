"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiMoreVertical } from "react-icons/fi";

export type RowAction = {
  label: string;
  icon?: React.ReactNode;
  /** Render as an external link instead of a button. */
  href?: string;
  onClick?: () => void;
  /** Red styling for destructive actions. */
  danger?: boolean;
  /** Draw a divider above this item. */
  separatorBefore?: boolean;
};

/**
 * Compact "⋮" row-actions dropdown for admin tables. The menu is
 * portal-rendered with fixed positioning so it never gets clipped by a
 * table's overflow-x-auto wrapper, and closes on outside click, Escape,
 * scroll, or resize.
 */
export default function RowActionsMenu({
  actions,
  label = "Row menu",
}: {
  actions: RowAction[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(
    null
  );

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setCoords({ top: r.bottom + 6, right: window.innerWidth - r.right });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
      >
        <FiMoreVertical />
      </button>

      {open &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              className="fixed inset-0 z-[90] cursor-default"
              onClick={() => setOpen(false)}
            />
            <div
              role="menu"
              style={{ top: coords.top, right: coords.right }}
              className="fixed z-[91] w-48 rounded-xl border border-neutral-100 bg-white-base shadow-xl overflow-hidden py-1 lqm-pop-in"
            >
              {actions.map((a, i) => {
                const cls = `w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left ${
                  a.danger
                    ? "text-error-500 hover:bg-error-50"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`;
                const content = (
                  <>
                    {a.icon && (
                      <span className={a.danger ? "" : "text-neutral-400"}>
                        {a.icon}
                      </span>
                    )}
                    {a.label}
                  </>
                );
                return (
                  <div key={i}>
                    {a.separatorBefore && (
                      <div className="my-1 border-t border-neutral-100" />
                    )}
                    {a.href ? (
                      <a
                        href={a.href}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        className={cls}
                        onClick={() => setOpen(false)}
                      >
                        {content}
                      </a>
                    ) : (
                      <button
                        type="button"
                        role="menuitem"
                        className={cls}
                        onClick={() => {
                          setOpen(false);
                          a.onClick?.();
                        }}
                      >
                        {content}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
