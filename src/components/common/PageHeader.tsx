import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";

type Variant = "default" | "dark" | "gradient";

const VARIANT_CLASSES: Record<Variant, string> = {
  default: "bg-neutral-50 text-neutral-900",
  dark: "bg-neutral-900 text-white-base",
  gradient: "brand-gradient text-white-base",
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  variant = "default",
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  variant?: Variant;
  children?: React.ReactNode;
}) {
  const isDark = variant !== "default";
  return (
    <section className={`${VARIANT_CLASSES[variant]} relative overflow-hidden`}>
      {variant === "gradient" && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 30%, rgba(255,179,0,0.4) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(245,124,0,0.3) 0%, transparent 50%)",
          }}
        />
      )}

      <div className="container-page py-10 md:py-14 relative">
        {breadcrumbs && (
          <div
            className={
              isDark
                ? "[&_*]:!text-white/70 [&_.font-semibold]:!text-white-base"
                : ""
            }
          >
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        <div className={`${breadcrumbs ? "mt-6" : ""} flex flex-col md:flex-row md:items-end md:justify-between gap-6`}>
          <div className="max-w-3xl">
            {eyebrow && (
              <span
                className={`eyebrow ${isDark ? "!text-accent-400" : ""}`}
              >
                <span
                  className={`block w-4 h-px ${
                    isDark ? "bg-accent-400" : "bg-primary-500"
                  }`}
                />
                {eyebrow}
              </span>
            )}
            <h1 className={`mt-3 text-3xl md:text-5xl font-bold tracking-tight text-balance ${
              isDark ? "text-white-base" : "text-neutral-900"
            }`}>
              {title}
            </h1>
            {description && (
              <p className={`mt-4 text-base md:text-lg max-w-2xl text-balance ${
                isDark ? "text-white/80" : "text-neutral-600"
              }`}>
                {description}
              </p>
            )}
          </div>
          {children && <div className="shrink-0">{children}</div>}
        </div>
      </div>
    </section>
  );
}
