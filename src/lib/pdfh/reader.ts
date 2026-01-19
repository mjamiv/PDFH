/**
 * PDFH Reader
 * Extracts HTML content from PDFH files using pdfjs-dist for proper decompression
 */

import {
  PdfhContent,
  PdfhReaderResult,
  PdfhPage,
  ConformanceLevel,
  PDFH_VERSION,
  PDFH_EMBEDDED_FILENAME,
} from '../../types/pdfh';
import { extractPdfhMetadata, extractBodyContent } from './schema';
import { isValidConformanceLevel } from './validator';

interface ReaderOptions {
  disableWorker?: boolean;
}

// Dynamically import pdfjs-dist
let pdfjsLib: any = null;

const getPdfJs = async () => {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
};

/**
 * Check if a PDF file is a PDFH file
 */
export async function isPdfhFile(pdfBytes: Uint8Array, options: ReaderOptions = {}): Promise<boolean> {
  try {
    const embeddedFiles = await getEmbeddedFilesWithPdfJs(pdfBytes, options);
    return embeddedFiles.some(file => file.name === PDFH_EMBEDDED_FILENAME);
  } catch {
    return false;
  }
}

/**
 * Extract PDFH content from a PDF file
 */
export async function extractPdfh(
  pdfBytes: Uint8Array,
  options: ReaderOptions = {}
): Promise<PdfhReaderResult> {
  try {
    const pdfjs = await getPdfJs();
    // Copy bytes to avoid "ArrayBuffer is detached" error
    const bytesCopy = new Uint8Array(pdfBytes);
    const loadingTask = pdfjs.getDocument({ data: bytesCopy, disableWorker: options.disableWorker });
    const pdfDoc = await loadingTask.promise;

    // Get embedded files using pdfjs (handles decompression)
    const embeddedFiles = await getEmbeddedFilesWithPdfJs(pdfBytes, options);

    // Find the PDFH content file
    const pdfhFile = embeddedFiles.find(file => file.name === PDFH_EMBEDDED_FILENAME);

    if (!pdfhFile) {
      return {
        isPdfh: false,
        error: 'No PDFH content found in PDF',
      };
    }

    // Decode HTML content
    const html = new TextDecoder().decode(pdfhFile.data);

    // Extract metadata from HTML
    const htmlMetadata = extractPdfhMetadata(html);

    // Get PDF metadata
    const metadata = await pdfDoc.getMetadata();

    // Get page information
    const pages = await getPageInfoWithPdfJs(pdfDoc);

    // Build content object
    const pdfInfo = metadata.info as Record<string, unknown> | undefined;
    const infoVersion = typeof pdfInfo?.PDFHVersion === 'string' ? pdfInfo.PDFHVersion : undefined;
    const infoConformance = typeof pdfInfo?.PDFHConformance === 'string' ? pdfInfo.PDFHConformance : undefined;
    const fallbackConformance: ConformanceLevel = isValidConformanceLevel(infoConformance || '')
      ? infoConformance
      : 'PDFH-1b';
    const content: PdfhContent = {
      html,
      version: htmlMetadata.version || infoVersion || PDFH_VERSION,
      conformanceLevel: htmlMetadata.conformanceLevel || fallbackConformance,
      pages,
      metadata: {
        title: (pdfInfo?.Title as string) || undefined,
        author: (pdfInfo?.Author as string) || undefined,
        subject: (pdfInfo?.Subject as string) || undefined,
        creator: (pdfInfo?.Creator as string) || undefined,
        producer: (pdfInfo?.Producer as string) || undefined,
      },
    };

    return {
      isPdfh: true,
      content,
    };
  } catch (error) {
    return {
      isPdfh: false,
      error: error instanceof Error ? error.message : 'Failed to read PDF',
    };
  }
}

/**
 * Get just the HTML content from a PDFH file
 */
export async function extractHtml(pdfBytes: Uint8Array): Promise<string | null> {
  const result = await extractPdfh(pdfBytes);
  return result.content?.html || null;
}

/**
 * Get the body content (without wrapper) from a PDFH file
 */
export async function extractBodyHtml(pdfBytes: Uint8Array): Promise<string | null> {
  const html = await extractHtml(pdfBytes);
  return html ? extractBodyContent(html) : null;
}

/**
 * Get list of embedded files from a PDF using pdfjs-dist
 * This properly handles decompression of embedded file streams
 */
async function getEmbeddedFilesWithPdfJs(
  pdfBytes: Uint8Array,
  options: ReaderOptions
): Promise<Array<{ name: string; data: Uint8Array }>> {
  const embeddedFiles: Array<{ name: string; data: Uint8Array }> = [];

  try {
    const pdfjs = await getPdfJs();
    // Copy the bytes to avoid "ArrayBuffer is detached" error when the same bytes
    // are used by multiple pdfjs instances (e.g., reader and renderer)
    const bytesCopy = new Uint8Array(pdfBytes);
    const loadingTask = pdfjs.getDocument({ data: bytesCopy, disableWorker: options.disableWorker });
    const pdfDoc = await loadingTask.promise;

    // Get the document's attachment list
    const attachments = await pdfDoc.getAttachments();

    if (attachments) {
      for (const [filename, attachment] of Object.entries(attachments)) {
        if (attachment && typeof attachment === 'object' && 'content' in attachment) {
          const content = (attachment as any).content;
          if (content instanceof Uint8Array) {
            embeddedFiles.push({
              name: filename,
              data: content,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading embedded files:', error);
  }

  return embeddedFiles;
}

/**
 * Get page information from PDF document using pdfjs
 */
async function getPageInfoWithPdfJs(pdfDoc: any): Promise<PdfhPage[]> {
  const pages: PdfhPage[] = [];
  const numPages = pdfDoc.numPages;

  for (let i = 1; i <= numPages; i++) {
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
 * Get PDFH metadata from PDF without extracting full content
 */
export async function getPdfhMetadata(pdfBytes: Uint8Array): Promise<{
  isPdfh: boolean;
  version?: string;
  conformanceLevel?: ConformanceLevel;
  pageCount?: number;
  title?: string;
}> {
  try {
    const pdfjs = await getPdfJs();
    // Copy bytes to avoid "ArrayBuffer is detached" error
    const bytesCopy = new Uint8Array(pdfBytes);
    const loadingTask = pdfjs.getDocument({ data: bytesCopy, disableWorker: true });
    const pdfDoc = await loadingTask.promise;

    const embeddedFiles = await getEmbeddedFilesWithPdfJs(pdfBytes, { disableWorker: true });
    const pdfhFile = embeddedFiles.find(file => file.name === PDFH_EMBEDDED_FILENAME);

    if (!pdfhFile) {
      return { isPdfh: false };
    }

    const html = new TextDecoder().decode(pdfhFile.data);
    const metadata = extractPdfhMetadata(html);
    const pdfMetadata = await pdfDoc.getMetadata();
    const pdfInfo = pdfMetadata.info as Record<string, unknown> | undefined;
    const infoVersion = typeof pdfInfo?.PDFHVersion === 'string' ? pdfInfo.PDFHVersion : undefined;
    const infoConformance = typeof pdfInfo?.PDFHConformance === 'string' ? pdfInfo.PDFHConformance : undefined;
    const fallbackConformance: ConformanceLevel | undefined = isValidConformanceLevel(infoConformance || '')
      ? infoConformance
      : undefined;

    return {
      isPdfh: true,
      version: metadata.version || infoVersion,
      conformanceLevel: metadata.conformanceLevel || fallbackConformance,
      pageCount: pdfDoc.numPages,
      title: (pdfInfo?.Title as string) || undefined,
    };
  } catch {
    return { isPdfh: false };
  }
}
