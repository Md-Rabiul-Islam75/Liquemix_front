/**
 * Status pill — used across product, news, solution, reference lists.
 * Visual contract:
 *   - published / active → green
 *   - draft             → amber
 *   - archived          → grey
 *   - hidden            → red
 */
const VARIANTS: Record<string, string> = {
  published: "bg-success-50 text-success-700 ring-1 ring-success-500/30",
  active: "bg-success-50 text-success-700 ring-1 ring-success-500/30",
  draft: "bg-accent-50 text-accent-800 ring-1 ring-accent-500/40",
  archived: "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-300",
  hidden: "bg-error-50 text-error-500 ring-1 ring-error-500/30",
};

export default function StatusPill({ status }: { status: string }) {
  const cls = VARIANTS[status.toLowerCase()] ?? VARIANTS.archived;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${cls}`}
    >
      <span className="block w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
