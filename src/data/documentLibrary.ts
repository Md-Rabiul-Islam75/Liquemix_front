/**
 * Static catalogue of PDFs that already live under `public/document-sheet/`.
 * The admin's Documents editor surfaces this list as a "Pick from library"
 * option so editors don't have to upload the same TDS twice when it's
 * already in the project tree.
 *
 * Add a new line whenever a PDF is dropped into `public/document-sheet/`.
 * The URL is the public path the file serves at; the suggestedTitle is
 * what gets pre-filled on the form (editors can override).
 */
export type LibraryDocument = {
  /** Path under /public — i.e. the URL the file resolves at. */
  url: string;
  /** Default title shown on the product page. Editors can override. */
  suggestedTitle: string;
  /** Best guess at the document type — editors can re-pick from the dropdown. */
  suggestedType: "TDS" | "MSDS" | "OTHER";
};

export const DOCUMENT_LIBRARY: LibraryDocument[] = [
  {
    url: "/document-sheet/Lique Hydro-Guard 3x.pdf",
    suggestedTitle: "Lique Hydro-Guard 3X — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/CRYSTAL-Flex-Skim.pdf",
    suggestedTitle: "Crystal Flex-Skim — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/CRYSTAL-Flex-Skim Liquemix.pdf",
    suggestedTitle: "Crystal Flex-Skim (LiqueMix branded) — TDS",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/Ligue Restoration GP40 D.pdf",
    suggestedTitle: "Lique Restoration GP40 D — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/LIQUE CURE-E25.pdf",
    suggestedTitle: "Lique Cure-E25 — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/Lique Cure-E25 OLD.pdf",
    suggestedTitle: "Lique Cure-E25 — TDS (previous revision)",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/Lique FIX MT-3.pdf",
    suggestedTitle: "Lique Fix MT-3 — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/Lique Latex Bond - SBR .pdf",
    suggestedTitle: "Lique Latex Bond SBR — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/Lique Plastorix -500.pdf",
    suggestedTitle: "Lique Plastorix-500 — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/Lique MicroCrete me 55 D.pdf",
    suggestedTitle: "Lique MicroCrete ME 55 D — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/Lique Precision grout PG70.pdf",
    suggestedTitle: "Lique Precision Grout PG70 — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/Lique- ShutterLube.pdf",
    suggestedTitle: "Lique ShutterLube — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/LIQUE Pump Primer.pdf",
    suggestedTitle: "Lique Pump Primer — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/Lique_Retanta WS-50.pdf",
    suggestedTitle: "Lique Retanta WS-50 — Technical Data Sheet",
    suggestedType: "TDS",
  },
  {
    url: "/document-sheet/LiqueMix.pdf",
    suggestedTitle: "LiqueMix — Company Brochure",
    suggestedType: "OTHER",
  },
];

/** Convenience: look up a library entry by URL. */
export function findInLibrary(url: string): LibraryDocument | undefined {
  return DOCUMENT_LIBRARY.find((d) => d.url === url);
}
