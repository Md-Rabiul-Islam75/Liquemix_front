"use client";

import { FiPrinter } from "react-icons/fi";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-secondary-500 text-white-base text-sm font-semibold hover:bg-secondary-600 transition-colors"
    >
      <FiPrinter /> Print page
    </button>
  );
}
