import type { PackagingOption } from "@/types/Catalog";

export default function PackagingTable({ rows }: { rows: PackagingOption[] }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-neutral-50">
            <th className="text-left font-semibold text-neutral-700 px-4 py-3">
              Article-No.
            </th>
            <th className="text-left font-semibold text-neutral-700 px-4 py-3">
              Packaging size
            </th>
            <th className="text-left font-semibold text-neutral-700 px-4 py-3">
              Color
            </th>
            <th className="text-left font-semibold text-neutral-700 px-4 py-3">
              Unit / Pallet
            </th>
            <th className="text-left font-semibold text-neutral-700 px-4 py-3">
              Repackaging
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.map((r) => (
            <tr key={r.articleNumber} className="text-neutral-900">
              <td className="px-4 py-3 font-mono text-xs text-neutral-700">
                {r.articleNumber}
              </td>
              <td className="px-4 py-3">{r.size}</td>
              <td className="px-4 py-3">{r.color ?? "—"}</td>
              <td className="px-4 py-3">{r.unitPerPallet ?? "—"}</td>
              <td className="px-4 py-3 text-neutral-500">{r.repackaging ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
