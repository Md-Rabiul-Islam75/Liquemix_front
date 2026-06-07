"use client";

import { useEffect, useState } from "react";

/**
 * Common consumption-rate units across LiqueMix products. Kept in the
 * spaced style the catalog already uses ("kg / m²") so existing values map
 * straight onto a dropdown option. Anything not in this list (one-off
 * product notes) is handled by the "Other…" free-text escape hatch.
 */
export const CONSUMPTION_UNITS = [
  "kg / m²",
  "kg / m² per coat",
  "kg / m² per mm thickness",
  "kg / m² per cm thickness",
  "L / m²",
  "L / m² per coat",
  "g / m²",
  "ml / m²",
  "kg / m³",
  "m² / L (substrate dependent)",
  "kg / linear m",
  "kg per bag",
  "kg per set",
  "% by cement weight",
];

const OTHER = "__other__";

/**
 * Consumption unit picker: a dropdown of the common units plus an "Other…"
 * option that reveals a free-text input. Stores the plain string via
 * onChange so the rest of the form is unchanged.
 */
export default function ConsumptionUnitField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const isKnown = CONSUMPTION_UNITS.includes(value);
  const [mode, setMode] = useState<"list" | "other">(
    !isKnown && value.length > 0 ? "other" : "list"
  );

  // If the parent loads an existing custom value (edit screen), flip to the
  // free-text mode so it's shown and editable rather than silently dropped.
  useEffect(() => {
    if (value.length > 0 && !CONSUMPTION_UNITS.includes(value)) {
      setMode("other");
    }
  }, [value]);

  const selectValue = mode === "other" ? OTHER : value;

  return (
    <>
      <select
        value={selectValue}
        onChange={(e) => {
          const v = e.target.value;
          if (v === OTHER) {
            setMode("other");
            onChange("");
          } else {
            setMode("list");
            onChange(v);
          }
        }}
        className="admin-input"
      >
        <option value="">Select a unit…</option>
        {CONSUMPTION_UNITS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
        <option value={OTHER}>Other…</option>
      </select>
      {mode === "other" && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. of 125 mm pipeline / see TDS for mix ratios"
          className="admin-input mt-2"
        />
      )}
    </>
  );
}
