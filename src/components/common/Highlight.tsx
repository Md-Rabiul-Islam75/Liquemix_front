import React from "react";

/** Escape regex metacharacters so a query like "C2 (S2)" is matched literally. */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Highlights every case-insensitive occurrence of `query` inside `text`,
 * wrapping matches in a yellow <mark>. Used across the admin search lists
 * (categories, products, news, references, videos, downloads) so typing
 * progressively highlights what matched.
 */
export default function Highlight({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
  const lowerQ = q.toLowerCase();
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === lowerQ ? (
          <mark
            key={i}
            className="bg-accent-200 text-neutral-900 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}
