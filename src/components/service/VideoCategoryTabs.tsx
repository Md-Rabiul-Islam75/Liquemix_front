"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

export default function VideoCategoryTabs({
  categories,
  counts,
}: {
  categories: string[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const current = params.get("category") ?? "";

  const setCategory = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("category", value);
    else next.delete("category");
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    });
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setCategory("")}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
          !current
            ? "bg-secondary-500 text-white-base"
            : "bg-white-base border border-neutral-200 text-neutral-700 hover:border-secondary-300"
        }`}
      >
        All <span className={`text-[10px] ${!current ? "text-white/70" : "text-neutral-400"}`}>{total}</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => setCategory(cat)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            current === cat
              ? "bg-secondary-500 text-white-base"
              : "bg-white-base border border-neutral-200 text-neutral-700 hover:border-secondary-300"
          }`}
        >
          {cat}
          <span
            className={`text-[10px] ${
              current === cat ? "text-white/70" : "text-neutral-400"
            }`}
          >
            {counts[cat] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
