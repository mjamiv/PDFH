/**
 * PDFH TypeScript Type Definitions
 * Defines types for the PDFH file format - embedding HTML within PDF
 */

export type ConformanceLevel = 'PDFH-1a' | 'PDFH-1b';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CoordinateMapping {
  elementId: string;
  page: number;
  bbox: BoundingBox;
}

export interface PdfhPage {
  pageNumber: number;
  width: number;
  height: number;
  coordinateMappings?: CoordinateMapping[];
}

export interface PdfhMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creationDate?: Date;
  modificationDate?: Date;
  creator?: string;
  producer?: string;
}

export interface PdfhContent {
  html: string;
  version: string;
  conformanceLevel: ConformanceLevel;
  metadata?: PdfhMetadata;
  pages: PdfhPage[];
}

export interface PdfhWriterOptions {
  html: string;
  title?: string;
  author?: string;
  conformanceLevel: ConformanceLevel;
  includeCoordinateMapping?: boolean;
  pageSize?: PageSize;
  margins?: PageMargins;
}

export interface PageSize {
  width: number;
  height: number;
}

export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PdfhReaderResult {
  isPdfh: boolean;
  content?: PdfhContent;
  error?: string;
}

export interface PdfhValidationResult {
  isValid: boolean;
  errors: PdfhValidationError[];
  warnings: PdfhValidationWarning[];
}

export interface PdfhValidationError {
  code: string;
  message: string;
  line?: number;
  column?: number;
}

export interface PdfhValidationWarning {
  code: string;
  message: string;
  line?: number;
  column?: number;
}

// Standard page sizes in points (72 points = 1 inch)
export const PAGE_SIZES = {
  LETTER: { width: 612, height: 792 },
  LEGAL: { width: 612, height: 1008 },
  A4: { width: 595.28, height: 841.89 },
  A3: { width: 841.89, height: 1190.55 },
} as const;

// Default margins in points
export const DEFAULT_MARGINS: PageMargins = {
  top: 72,
  right: 72,
  bottom: 72,
  left: 72,
};

// PDFH namespace and version constants
export const PDFH_NAMESPACE = 'https://pdfh.org/2025/schema';
export const PDFH_VERSION = '1.0';
export const PDFH_EMBEDDED_FILENAME = 'pdfh-content.html';
