/**
 * PDFH Writer
 * Creates PDFH files by embedding HTML content within PDF
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFDocument, AFRelationship } from 'pdf-lib';
import {
  PdfhWriterOptions,
  PAGE_SIZES,
  DEFAULT_MARGINS,
  PDFH_VERSION,
  PDFH_EMBEDDED_FILENAME,
} from '../../types/pdfh';
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
    pageSize = PAGE_SIZES.LETTER,
    margins = DEFAULT_MARGINS,
    metadataDate,
  } = options;

  // Validate HTML
  const validation = validateHtml(html);
  if (!validation.isValid) {
    throw new Error(`Invalid HTML: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  // Render HTML to PDF using html2canvas + jsPDF
  const pdfBytes = await renderHtmlToPdf(html, title, pageSize, margins);

  // Load the PDF into pdf-lib to add metadata and HTML attachment
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Set metadata
  pdfDoc.setTitle(title);
  pdfDoc.setSubject('PDFH Document');
  pdfDoc.setCreator('PDFH Web App');
  pdfDoc.setProducer(`PDFH Writer v${PDFH_VERSION}`);
  const effectiveMetadataDate = metadataDate || new Date();
  pdfDoc.setCreationDate(effectiveMetadataDate);
  pdfDoc.setModificationDate(effectiveMetadataDate);
  if (author) {
    pdfDoc.setAuthor(author);
  }

  // Embed the HTML content as an attachment
  const htmlBytes = new TextEncoder().encode(html);
  await pdfDoc.attach(htmlBytes, PDFH_EMBEDDED_FILENAME, {
    mimeType: 'text/html',
    description: 'PDFH embedded HTML content',
    creationDate: effectiveMetadataDate,
    modificationDate: effectiveMetadataDate,
    afRelationship: AFRelationship.Source,
  });

  // Save and return the PDF bytes
  return await pdfDoc.save();
}

/**
 * Render HTML to PDF using html2canvas and jsPDF
 */
async function renderHtmlToPdf(
  html: string,
  title: string,
  pageSize: { width: number; height: number },
  margins: { top: number; right: number; bottom: number; left: number }
): Promise<Uint8Array> {
  // Create a hidden container for rendering
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${pageSize.width - margins.left - margins.right}px;
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    padding: 0;
  `;

  // Wrap HTML with default styles
  container.innerHTML = `
    <style>
      * { box-sizing: border-box; }
      body, html { margin: 0; padding: 0; }
      h1, h2, h3, h4, h5, h6 {
        margin-top: 1em;
        margin-bottom: 0.5em;
        line-height: 1.3;
      }
      h1 { font-size: 1.8em; }
      h2 { font-size: 1.4em; }
      h3 { font-size: 1.2em; }
      p { margin: 0.8em 0; }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
        font-size: 0.9em;
      }
      th, td {
        border: 1px solid #333;
        padding: 6px 8px;
        text-align: left;
      }
      th { background-color: #333; color: white; }
      code {
        background-color: #f4f4f4;
        padding: 2px 4px;
        border-radius: 2px;
        font-family: monospace;
        font-size: 0.9em;
      }
      pre {
        background-color: #f4f4f4;
        padding: 12px;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 0.85em;
      }
      ul, ol { margin: 0.8em 0; padding-left: 1.5em; }
      li { margin: 0.3em 0; }
      a { color: #0066cc; }
      img { max-width: 100%; height: auto; }
      .subtitle { color: #555; margin-bottom: 1.5em; }
      .value-add {
        background: #f0f7ff;
        border-left: 3px solid #0066cc;
        padding: 8px 12px;
        margin: 1em 0;
        font-style: italic;
      }
    </style>
    ${html}
  `;

  document.body.appendChild(container);

  try {
    // Render to canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate dimensions
    const imgWidth = pageSize.width - margins.left - margins.right;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = pageSize.height - margins.top - margins.bottom;

    // Create PDF with jsPDF (dimensions in points)
    const pdf = new jsPDF({
      orientation: pageSize.width > pageSize.height ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [pageSize.width, pageSize.height],
    });

    // Add title to PDF metadata
    pdf.setProperties({ title });

    // If content fits on one page, add it directly
    if (imgHeight <= pageHeight) {
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(
        imgData,
        'JPEG',
        margins.left,
        margins.top,
        imgWidth,
        imgHeight
      );
    } else {
      // Multi-page: split content across pages
      let remainingHeight = imgHeight;
      let sourceY = 0;
      let pageNum = 0;

      while (remainingHeight > 0) {
        if (pageNum > 0) {
          pdf.addPage([pageSize.width, pageSize.height]);
        }

        // Calculate how much content to draw on this page
        const drawHeight = Math.min(pageHeight, remainingHeight);

        // Calculate the source slice from the original canvas
        const sliceHeight = (drawHeight / imgHeight) * canvas.height;
        const sliceY = (sourceY / imgHeight) * canvas.height;

        // Create a temporary canvas for this page's portion
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.ceil(sliceHeight);
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0, sliceY,                          // source x, y
            canvas.width, sliceHeight,          // source width, height
            0, 0,                               // dest x, y
            pageCanvas.width, pageCanvas.height // dest width, height
          );
        }

        // Add image to PDF
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(
          pageImgData,
          'JPEG',
          margins.left,
          margins.top,
          imgWidth,
          drawHeight
        );

        sourceY += drawHeight;
        remainingHeight -= drawHeight;
        pageNum++;
      }
    }

    // Get PDF as array buffer
    const pdfOutput = pdf.output('arraybuffer');
    return new Uint8Array(pdfOutput);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

export { validateHtml };
