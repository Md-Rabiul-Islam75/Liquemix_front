import { countryCode } from "@/data/offices";

/**
 * A real SVG country flag (via the `flag-icons` package), sized in px so it
 * renders identically on every OS — unlike emoji flags, which Windows shows as
 * two letters. Falls back to a small globe when the country isn't recognised.
 */
export default function Flag({
  label,
  w = 18,
  h = 13,
  className = "",
}: {
  label: string;
  w?: number;
  h?: number;
  className?: string;
}) {
  const code = countryCode(label);
  if (!code) {
    return (
      <span aria-hidden className={`inline-block leading-none ${className}`}>
        🌐
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={label}
      className={`fi fi-${code} inline-block rounded-[2px] ${className}`}
      style={{
        width: w,
        height: h,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
