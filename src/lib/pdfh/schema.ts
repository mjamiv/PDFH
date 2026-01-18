/**
 * PDFH Schema Definitions
 * Defines the structure and requirements for PDFH HTML content
 */

import { PDFH_NAMESPACE, PDFH_VERSION, ConformanceLevel } from '../../types/pdfh';

/**
 * Generate the PDFH HTML wrapper with proper namespace and metadata
 */
export function wrapHtmlWithPdfhSchema(
  content: string,
  options: {
    title?: string;
    conformanceLevel: ConformanceLevel;
    includeCoordinateMapping?: boolean;
  }
): string {
  const { title = 'PDFH Document', conformanceLevel, includeCoordinateMapping } = options;

  return `<!DOCTYPE html>
<html xmlns="${PDFH_NAMESPACE}" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="pdfh:version" content="${PDFH_VERSION}">
  <meta name="pdfh:conformance" content="${conformanceLevel}">
  <meta name="pdfh:generator" content="PDFH Web App">
  <meta name="pdfh:created" content="${new Date().toISOString()}">
  ${includeCoordinateMapping ? '<meta name="pdfh:coordinate-mapping" content="enabled">' : ''}
  <title>${escapeHtml(title)}</title>
  <style>
    /* PDFH default styles for PDF rendering */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 100%;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.25em; }
    p { margin: 1em 0; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th { background-color: #f5f5f5; }
    code {
      background-color: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Consolas', 'Monaco', monospace;
    }
    pre {
      background-color: #f4f4f4;
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    ul, ol {
      margin: 1em 0;
      padding-left: 2em;
    }
    li { margin: 0.5em 0; }
    a { color: #0066cc; }
    img { max-width: 100%; height: auto; }
    blockquote {
      margin: 1em 0;
      padding-left: 1em;
      border-left: 4px solid #ddd;
      color: #666;
    }
  </style>
</head>
<body>
${content}
</body>
</html>`;
}

/**
 * Extract the body content from PDFH HTML
 */
export function extractBodyContent(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1].trim() : html;
}

/**
 * Extract PDFH metadata from HTML
 */
export function extractPdfhMetadata(html: string): {
  version?: string;
  conformanceLevel?: ConformanceLevel;
  generator?: string;
  created?: string;
  hasCoordinateMapping?: boolean;
} {
  const getMetaContent = (name: string): string | undefined => {
    const match = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'));
    if (match) return match[1];
    // Try alternate attribute order
    const altMatch = html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i'));
    return altMatch ? altMatch[1] : undefined;
  };

  return {
    version: getMetaContent('pdfh:version'),
    conformanceLevel: getMetaContent('pdfh:conformance') as ConformanceLevel | undefined,
    generator: getMetaContent('pdfh:generator'),
    created: getMetaContent('pdfh:created'),
    hasCoordinateMapping: getMetaContent('pdfh:coordinate-mapping') === 'enabled',
  };
}

/**
 * Check if HTML has valid PDFH structure
 */
export function isPdfhHtml(html: string): boolean {
  const hasNamespace = html.includes(PDFH_NAMESPACE);
  const hasVersion = html.includes('pdfh:version');
  const hasConformance = html.includes('pdfh:conformance');
  return hasNamespace && hasVersion && hasConformance;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * PDFH-1a coordinate mapping attributes
 */
export const COORDINATE_ATTRIBUTES = {
  PAGE: 'data-pdfh-page',
  BBOX: 'data-pdfh-bbox',
  ELEMENT_ID: 'data-pdfh-id',
} as const;

/**
 * Add coordinate mapping attributes to an element
 */
export function addCoordinateMapping(
  elementHtml: string,
  mapping: { page: number; bbox: { x: number; y: number; width: number; height: number } }
): string {
  const bboxStr = `${mapping.bbox.x},${mapping.bbox.y},${mapping.bbox.width},${mapping.bbox.height}`;
  // Insert attributes into the first tag
  return elementHtml.replace(
    /^(<\w+)/,
    `$1 ${COORDINATE_ATTRIBUTES.PAGE}="${mapping.page}" ${COORDINATE_ATTRIBUTES.BBOX}="${bboxStr}"`
  );
}
