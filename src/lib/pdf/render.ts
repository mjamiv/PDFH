/**
 * PDF Rendering Utilities
 * Helper functions for rendering PDFs using pdfjs-dist
 */

import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface RenderOptions {
  scale?: number;
  pageNumber?: number;
}

export interface PageInfo {
  pageNumber: number;
  width: number;
  height: number;
}

/**
 * Load a PDF document from bytes
 */
export async function loadPdfDocument(pdfBytes: Uint8Array): Promise<pdfjsLib.PDFDocumentProxy> {
  const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
  return await loadingTask.promise;
}

/**
 * Render a PDF page to a canvas
 */
export async function renderPageToCanvas(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.5
): Promise<void> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not get canvas context');
  }

  const renderContext = {
    canvasContext: context,
    viewport,
  };

  await page.render(renderContext).promise;
}

/**
 * Render a PDF page and return as data URL
 */
export async function renderPageToDataUrl(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  scale: number = 1.5
): Promise<string> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not get canvas context');
  }

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return canvas.toDataURL('image/png');
}

/**
 * Get information about all pages in a PDF
 */
export async function getPagesInfo(pdfDoc: pdfjsLib.PDFDocumentProxy): Promise<PageInfo[]> {
  const pages: PageInfo[] = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1 });

    pages.push({
      pageNumber: i,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return pages;
}

/**
 * Extract text content from a PDF page
 */
export async function extractPageText(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number
): Promise<string> {
  const page = await pdfDoc.getPage(pageNumber);
  const textContent = await page.getTextContent();

  return textContent.items
    .map(item => ('str' in item ? item.str : ''))
    .join(' ');
}

/**
 * Extract text from all pages of a PDF
 */
export async function extractAllText(pdfDoc: pdfjsLib.PDFDocumentProxy): Promise<string> {
  const texts: string[] = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const text = await extractPageText(pdfDoc, i);
    texts.push(text);
  }

  return texts.join('\n\n');
}

/**
 * Calculate appropriate scale for fitting page in container
 */
export function calculateFitScale(
  pageWidth: number,
  pageHeight: number,
  containerWidth: number,
  containerHeight: number
): number {
  const scaleX = containerWidth / pageWidth;
  const scaleY = containerHeight / pageHeight;
  return Math.min(scaleX, scaleY);
}
