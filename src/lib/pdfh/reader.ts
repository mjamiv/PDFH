/**
 * PDFH Reader
 * Extracts HTML content from PDFH files
 */

import { PDFDocument, PDFDict, PDFName, PDFArray, PDFStream, PDFHexString, PDFString } from 'pdf-lib';
import {
  PdfhContent,
  PdfhReaderResult,
  PdfhPage,
  ConformanceLevel,
  PDFH_VERSION,
  PDFH_EMBEDDED_FILENAME,
} from '../../types/pdfh';
import { extractPdfhMetadata, extractBodyContent } from './schema';

/**
 * Check if a PDF file is a PDFH file
 */
export async function isPdfhFile(pdfBytes: Uint8Array): Promise<boolean> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const embeddedFiles = await getEmbeddedFiles(pdfDoc);
    return embeddedFiles.some(file => file.name === PDFH_EMBEDDED_FILENAME);
  } catch {
    return false;
  }
}

/**
 * Extract PDFH content from a PDF file
 */
export async function extractPdfh(pdfBytes: Uint8Array): Promise<PdfhReaderResult> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    // Get embedded files
    const embeddedFiles = await getEmbeddedFiles(pdfDoc);

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

    // Extract metadata
    const metadata = extractPdfhMetadata(html);

    // Get page information
    const pages = getPageInfo(pdfDoc);

    // Build content object
    const content: PdfhContent = {
      html,
      version: metadata.version || PDFH_VERSION,
      conformanceLevel: metadata.conformanceLevel || 'PDFH-1b',
      pages,
      metadata: {
        title: pdfDoc.getTitle() || undefined,
        author: pdfDoc.getAuthor() || undefined,
        subject: pdfDoc.getSubject() || undefined,
        creationDate: pdfDoc.getCreationDate() || undefined,
        modificationDate: pdfDoc.getModificationDate() || undefined,
        creator: pdfDoc.getCreator() || undefined,
        producer: pdfDoc.getProducer() || undefined,
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
 * Get list of embedded files from a PDF document
 */
async function getEmbeddedFiles(pdfDoc: PDFDocument): Promise<Array<{ name: string; data: Uint8Array }>> {
  const embeddedFiles: Array<{ name: string; data: Uint8Array }> = [];

  try {
    const catalog = pdfDoc.catalog;
    const namesDict = catalog.lookup(PDFName.of('Names')) as PDFDict | undefined;

    if (!namesDict) {
      return embeddedFiles;
    }

    const embeddedFilesDict = namesDict.lookup(PDFName.of('EmbeddedFiles')) as PDFDict | undefined;

    if (!embeddedFilesDict) {
      return embeddedFiles;
    }

    // Get the Names array directly or from Kids
    let namesArray = embeddedFilesDict.lookup(PDFName.of('Names')) as PDFArray | undefined;

    if (!namesArray) {
      // Try to get from Kids
      const kids = embeddedFilesDict.lookup(PDFName.of('Kids')) as PDFArray | undefined;
      if (kids && kids.size() > 0) {
        const firstKid = kids.lookup(0) as PDFDict | undefined;
        if (firstKid) {
          namesArray = firstKid.lookup(PDFName.of('Names')) as PDFArray | undefined;
        }
      }
    }

    if (!namesArray) {
      return embeddedFiles;
    }

    // Process name-value pairs
    for (let i = 0; i < namesArray.size(); i += 2) {
      const nameObj = namesArray.lookup(i);
      const fileSpecRef = namesArray.get(i + 1);

      if (!nameObj || !fileSpecRef) continue;

      // Get the filename
      let filename = '';
      if (nameObj instanceof PDFHexString) {
        filename = nameObj.decodeText();
      } else if (nameObj instanceof PDFString) {
        filename = nameObj.decodeText();
      }

      // Get the file specification dictionary
      const fileSpec = pdfDoc.context.lookup(fileSpecRef) as PDFDict | undefined;
      if (!fileSpec) continue;

      // Get the embedded file stream
      const efDict = fileSpec.lookup(PDFName.of('EF')) as PDFDict | undefined;
      if (!efDict) continue;

      const streamRef = efDict.get(PDFName.of('F')) || efDict.get(PDFName.of('UF'));
      if (!streamRef) continue;

      const stream = pdfDoc.context.lookup(streamRef) as PDFStream | undefined;
      if (!stream) continue;

      // Get the file data
      const data = stream.getContents();

      embeddedFiles.push({ name: filename, data });
    }
  } catch (error) {
    console.error('Error reading embedded files:', error);
  }

  return embeddedFiles;
}

/**
 * Get page information from PDF document
 */
function getPageInfo(pdfDoc: PDFDocument): PdfhPage[] {
  const pages: PdfhPage[] = [];
  const pageCount = pdfDoc.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();

    pages.push({
      pageNumber: i + 1,
      width,
      height,
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
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const embeddedFiles = await getEmbeddedFiles(pdfDoc);
    const pdfhFile = embeddedFiles.find(file => file.name === PDFH_EMBEDDED_FILENAME);

    if (!pdfhFile) {
      return { isPdfh: false };
    }

    const html = new TextDecoder().decode(pdfhFile.data);
    const metadata = extractPdfhMetadata(html);

    return {
      isPdfh: true,
      version: metadata.version,
      conformanceLevel: metadata.conformanceLevel,
      pageCount: pdfDoc.getPageCount(),
      title: pdfDoc.getTitle() || undefined,
    };
  } catch {
    return { isPdfh: false };
  }
}
