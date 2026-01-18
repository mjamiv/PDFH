/**
 * PDFH Writer
 * Creates PDFH files by embedding HTML content within PDF
 */

import { PDFDocument, PDFName, PDFDict, PDFHexString, AFRelationship } from 'pdf-lib';
import {
  PdfhWriterOptions,
  PAGE_SIZES,
  DEFAULT_MARGINS,
  PDFH_VERSION,
  PDFH_EMBEDDED_FILENAME,
} from '../../types/pdfh';
import { wrapHtmlWithPdfhSchema } from './schema';
import { validateHtml } from './validator';

/**
 * Create a PDFH file from HTML content
 */
export async function createPdfh(options: PdfhWriterOptions): Promise<Uint8Array> {
  const {
    html,
    title = 'PDFH Document',
    author,
    conformanceLevel,
    includeCoordinateMapping = false,
    pageSize = PAGE_SIZES.LETTER,
    margins = DEFAULT_MARGINS,
  } = options;

  // Validate HTML
  const validation = validateHtml(html);
  if (!validation.isValid) {
    throw new Error(`Invalid HTML: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  // Wrap HTML with PDFH schema
  const pdfhHtml = wrapHtmlWithPdfhSchema(html, {
    title,
    conformanceLevel,
    includeCoordinateMapping,
  });

  // Create PDF document
  const pdfDoc = await PDFDocument.create();

  // Set metadata
  pdfDoc.setTitle(title);
  pdfDoc.setSubject('PDFH Document');
  pdfDoc.setCreator('PDFH Web App');
  pdfDoc.setProducer(`PDFH Writer v${PDFH_VERSION}`);
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setModificationDate(new Date());
  if (author) {
    pdfDoc.setAuthor(author);
  }

  // Add custom PDFH metadata
  const infoDict = pdfDoc.context.lookup(pdfDoc.context.trailerInfo.Info) as PDFDict | undefined;
  if (infoDict) {
    infoDict.set(PDFName.of('PDFHVersion'), PDFHexString.fromText(PDFH_VERSION));
    infoDict.set(PDFName.of('PDFHConformance'), PDFHexString.fromText(conformanceLevel));
  }

  // Create a page with rendered HTML representation
  const page = pdfDoc.addPage([pageSize.width, pageSize.height]);

  // Draw a simple text representation of the content
  // In a full implementation, this would use a proper HTML-to-PDF renderer
  const { width, height } = page.getSize();
  const contentWidth = width - margins.left - margins.right;

  // Extract text content from HTML for the visual PDF representation
  const textContent = extractTextFromHtml(html);
  const lines = wrapText(textContent, contentWidth, 12);

  let yPosition = height - margins.top;
  const lineHeight = 16;
  const font = await pdfDoc.embedFont('Helvetica');

  // Draw title
  page.drawText(title, {
    x: margins.left,
    y: yPosition,
    size: 18,
    font,
  });
  yPosition -= 30;

  // Draw content
  for (const line of lines) {
    if (yPosition < margins.bottom) {
      // Add new page if needed
      const newPage = pdfDoc.addPage([pageSize.width, pageSize.height]);
      yPosition = height - margins.top;
      newPage.drawText(line, {
        x: margins.left,
        y: yPosition,
        size: 12,
        font,
      });
    } else {
      page.drawText(line, {
        x: margins.left,
        y: yPosition,
        size: 12,
        font,
      });
    }
    yPosition -= lineHeight;
  }

  // Add footer note about PDFH
  const firstPage = pdfDoc.getPage(0);
  firstPage.drawText(`[PDFH Document - ${conformanceLevel}]`, {
    x: margins.left,
    y: margins.bottom - 20,
    size: 8,
    font,
    opacity: 0.5,
  });

  // Embed the HTML content as an attachment
  await embedHtmlContent(pdfDoc, pdfhHtml);

  // Save and return the PDF bytes
  return await pdfDoc.save();
}

/**
 * Embed HTML content in PDF as an embedded file
 */
async function embedHtmlContent(pdfDoc: PDFDocument, html: string): Promise<void> {
  const htmlBytes = new TextEncoder().encode(html);

  // Use pdf-lib's built-in attachment method
  await pdfDoc.attach(htmlBytes, PDFH_EMBEDDED_FILENAME, {
    mimeType: 'text/html',
    description: 'PDFH embedded HTML content',
    creationDate: new Date(),
    modificationDate: new Date(),
    afRelationship: AFRelationship.Source,
  });
}

/**
 * Extract plain text from HTML for PDF visual rendering
 */
function extractTextFromHtml(html: string): string {
  // Remove script and style tags with their content
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Replace block elements with newlines
  text = text.replace(/<\/(p|div|h[1-6]|li|tr|br|hr)[^>]*>/gi, '\n');
  text = text.replace(/<(br|hr)[^>]*\/?>/gi, '\n');

  // Replace list items with bullets
  text = text.replace(/<li[^>]*>/gi, '\n• ');

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  text = decodeHtmlEntities(text);

  // Clean up whitespace
  text = text.replace(/\n\s*\n/g, '\n\n');
  text = text.trim();

  return text;
}

/**
 * Decode common HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char);
  }

  // Handle numeric entities
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
  result = result.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));

  return result;
}

/**
 * Wrap text to fit within a given width
 */
function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const lines: string[] = [];
  const avgCharWidth = fontSize * 0.5; // Approximate
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);

  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push('');
      continue;
    }

    const words = paragraph.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= charsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

export { validateHtml };
