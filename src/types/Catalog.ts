/**
 * Catalog data model — mirrors the future REST/GraphQL response shape.
 * Components consume these types directly; swapping mock data for real fetches
 * is a single-import change in src/data/*.
 */

export type SegmentColor = "blue" | "orange" | "yellow" | "green";

export interface Segment {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  color: SegmentColor;
  heroImage: string;
  icon: string;
  productCount: number;
  solutionCount: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  segmentId: string;
  description?: string;
  image?: string;
  menuOrder: number;
  isActive: boolean;
  productIds?: string[];
  children?: Category[];
}

export type DocumentType =
  | "TDS"
  | "MSDS"
  | "MTC"
  | "COO"
  | "BROCHURE"
  | "EPD"
  | "DRAWING_DWG"
  | "DRAWING_PDF"
  | "TEST_REPORT"
  | "OTHER";

export interface ProductDocument {
  type: DocumentType;
  title: string;
  url: string;
  language: string;
  revision?: string;
  fileSizeKb?: number;
  uploadedAt: string;
}

export interface PackagingOption {
  articleNumber: string;
  size: string;
  color?: string;
  unitPerPallet?: number;
  repackaging?: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductVideo {
  title: string;
  youtubeId: string;
  thumbnail?: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  segmentId: string;
  categoryIds: string[];
  applicationAreas: string[];
  advantages: string[];
  consumption?: { value: string; unit: string };
  packaging: PackagingOption[];
  documents: ProductDocument[];
  images: ProductImage[];
  videos?: ProductVideo[];
  relatedProductIds?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  publishedAt: string;
}

export interface SystemSolutionLayer {
  order: number;
  name: string;
  productId?: string;
  description?: string;
}

export interface SystemSolution {
  id: string;
  slug: string;
  name: string;
  description: string;
  segmentId: string;
  applicationAreas: string[];
  layers: SystemSolutionLayer[];
  productIds: string[];
  technicalDrawingUrl?: string;
  heroImage: string;
}

export interface ReferenceProject {
  id: string;
  slug: string;
  title: string;
  projectType: string;
  location: { country: string; city: string };
  year: number;
  objectSize?: string;
  productsUsed: string[];
  challenge: string;
  solution: string;
  heroImage: string;
  gallery: ProductImage[];
  applicator?: { name: string; website?: string; email?: string };
  architect?: { name: string; website?: string; email?: string };
}

/**
 * Standalone technical document (not tied to a single product).
 * Used on /service/downloads — covers ATIs, brochures, planning folders, etc.
 */
export interface StandaloneDocument {
  id: string;
  title: string;
  description?: string;
  category:
    | "Datasheets"
    | "Brochures"
    | "Interactive system visualizations"
    | "Planning folder"
    | "Checklist for Technical Support"
    | "Product range"
    | "Additional Technical Information"
    | "Declaration of Performance"
    | "Environmental Product Declaration"
    | "Safety Data Sheets"
    | "Test Reports";
  segmentId?: string;
  language: string;
  fileSizeKb?: number;
  url: string;
  uploadedAt: string;
}

/**
 * Standalone video — for /service/videos and embedded on product detail pages.
 * `youtubeId` is the 11-character ID after watch?v= in a YouTube URL.
 */
export interface Video {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  durationSeconds?: number;
  category:
    | "Product Demo"
    | "Application Technique"
    | "Case Study"
    | "Tutorial"
    | "System Solution";
  segmentId?: string;
  relatedProductIds?: string[];
  publishedAt: string;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  publishedAt: string;
  coverImage: string;
  author?: { name: string; role?: string };
  category: "Product Launch" | "Company News" | "Industry" | "Project";
  readMinutes: number;
  tags?: string[];
  relatedProductIds?: string[];
}
