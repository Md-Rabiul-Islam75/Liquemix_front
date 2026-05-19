/**
 * Generic page-header for admin list/detail screens. Renders title,
 * optional eyebrow, description, and a right-aligned action slot.
 */
export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-primary-600 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-neutral-600 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
