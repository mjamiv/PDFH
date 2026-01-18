/**
 * PDF Embedding Utilities
 * Helper functions for embedding content in PDFs using pdf-lib
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface EmbedTextOptions {
  text: string;
  x: number;
  y: number;
  size?: number;
  color?: { r: number; g: number; b: number };
  maxWidth?: number;
}

export interface PageDimensions {
  width: number;
  height: number;
}

/**
 * Create a blank PDF document with specified pages
 */
export async function createBlankPdf(
  pageCount: number = 1,
  dimensions: PageDimensions = { width: 612, height: 792 }
): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < pageCount; i++) {
    pdfDoc.addPage([dimensions.width, dimensions.height]);
  }

  return pdfDoc;
}

/**
 * Add text to a PDF page
 */
export async function addTextToPage(
  pdfDoc: PDFDocument,
  pageIndex: number,
  options: EmbedTextOptions
): Promise<void> {
  const page = pdfDoc.getPage(pageIndex);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { text, x, y, size = 12, color = { r: 0, g: 0, b: 0 } } = options;

  page.drawText(text, {
    x,
    y,
    size,
    font,
    color: rgb(color.r, color.g, color.b),
  });
}

/**
 * Get the dimensions of a PDF page
 */
export function getPageDimensions(pdfDoc: PDFDocument, pageIndex: number): PageDimensions {
  const page = pdfDoc.getPage(pageIndex);
  return page.getSize();
}

/**
 * Merge multiple PDFs into one
 */
export async function mergePdfs(pdfBytesArray: Uint8Array[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const pdfBytes of pdfBytesArray) {
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Extract a range of pages from a PDF
 */
export async function extractPages(
  pdfBytes: Uint8Array,
  startPage: number,
  endPage: number
): Promise<Uint8Array> {
  const sourcePdf = await PDFDocument.load(pdfBytes);
  const newPdf = await PDFDocument.create();

  const pageIndices: number[] = [];
  for (let i = startPage; i <= endPage && i < sourcePdf.getPageCount(); i++) {
    pageIndices.push(i);
  }

  const pages = await newPdf.copyPages(sourcePdf, pageIndices);
  pages.forEach(page => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Add metadata to a PDF document
 */
export function setDocumentMetadata(
  pdfDoc: PDFDocument,
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
    producer?: string;
  }
): void {
  if (metadata.title) pdfDoc.setTitle(metadata.title);
  if (metadata.author) pdfDoc.setAuthor(metadata.author);
  if (metadata.subject) pdfDoc.setSubject(metadata.subject);
  if (metadata.keywords) pdfDoc.setKeywords(metadata.keywords);
  if (metadata.creator) pdfDoc.setCreator(metadata.creator);
  if (metadata.producer) pdfDoc.setProducer(metadata.producer);
}
