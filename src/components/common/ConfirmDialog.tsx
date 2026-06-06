"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiX } from "react-icons/fi";

type Props = {
  open: boolean;
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button + warning icon for destructive actions. */
  danger?: boolean;
  /** Disables buttons + shows a working label while the action runs. */
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Accessible confirmation modal — replaces native window.confirm() so the
 * dialog matches the LiqueMix admin UI instead of the browser chrome.
 * Portal-rendered (same pattern as ProductSearchModal), closes on Escape
 * or overlay click.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    // Lock background scroll while open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, busy, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm lqm-fade-in"
        onClick={() => !busy && onCancel()}
      />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white-base shadow-2xl border border-neutral-100 overflow-hidden lqm-pop-in">
        <button
          type="button"
          onClick={() => !busy && onCancel()}
          aria-label="Close"
          className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        >
          <FiX />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            {danger && (
              <span className="inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-full bg-error-50 text-error-500 text-xl">
                <FiAlertTriangle />
              </span>
            )}
            <div className="min-w-0">
              <h2
                id="confirm-dialog-title"
                className="text-lg font-bold text-neutral-900 leading-snug"
              >
                {title}
              </h2>
              {message && (
                <div className="mt-1.5 text-sm text-neutral-500 leading-relaxed">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-neutral-50 border-t border-neutral-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex items-center h-10 px-4 rounded-lg border border-neutral-200 bg-white-base text-sm font-semibold text-neutral-700 hover:border-neutral-300 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex items-center gap-1.5 h-10 px-5 rounded-lg text-sm font-semibold text-white-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
              danger
                ? "bg-error-500 hover:bg-error-600"
                : "bg-primary-500 hover:bg-primary-600"
            }`}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
