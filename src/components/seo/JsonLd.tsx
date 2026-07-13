/**
 * Renders a JSON-LD structured-data block. Server-safe; the object is
 * stringified into a <script type="application/ld+json"> that search engines
 * read (Google, Bing) for rich results and entity understanding.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here — it's our own structured data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
