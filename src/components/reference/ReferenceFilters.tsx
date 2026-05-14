"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { FiX } from "react-icons/fi";

interface FilterOption {
  value: string;
  label: string;
}

export default function ReferenceFilters({
  segments,
  projectTypes,
  countries,
  years,
  total,
  filtered,
}: {
  segments: FilterOption[];
  projectTypes: FilterOption[];
  countries: FilterOption[];
  years: FilterOption[];
  total: number;
  filtered: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const segment = params.get("segment") ?? "";
  const projectType = params.get("type") ?? "";
  const country = params.get("country") ?? "";
  const year = params.get("year") ?? "";

  const hasFilters = segment || projectType || country || year;

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    });
  };

  const clear = () => {
    startTransition(() => router.replace(pathname, { scroll: false }));
  };

  return (
    <div className="brand-panel p-5 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Segment"
          value={segment}
          options={segments}
          placeholder="All segments"
          onChange={(v) => updateParam("segment", v)}
        />
        <Select
          label="Type of installation"
          value={projectType}
          options={projectTypes}
          placeholder="All types"
          onChange={(v) => updateParam("type", v)}
        />
        <Select
          label="Country"
          value={country}
          options={countries}
          placeholder="All countries"
          onChange={(v) => updateParam("country", v)}
        />
        <Select
          label="Year"
          value={year}
          options={years}
          placeholder="Any year"
          onChange={(v) => updateParam("year", v)}
        />
      </div>

      <div className="mt-5 pt-5 border-t border-primary-100/60 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-bold text-neutral-900">{filtered}</span>{" "}
          of {total} reference projects
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            <FiX /> Reset filters
          </button>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="brand-panel__eyebrow block mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 rounded-lg bg-white-base border border-primary-100/70 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
