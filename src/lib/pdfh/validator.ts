/**
 * PDFH Validation Utilities
 * Validates HTML content and PDFH structure
 */

import { PdfhValidationResult, PdfhValidationError, PdfhValidationWarning, ConformanceLevel, PDFH_NAMESPACE } from '../../types/pdfh';
import { extractPdfhMetadata, isPdfhHtml } from './schema';

/**
 * Validate HTML content for PDFH compliance
 */
export function validateHtml(html: string): PdfhValidationResult {
  const errors: PdfhValidationError[] = [];
  const warnings: PdfhValidationWarning[] = [];

  // Check for basic HTML structure
  if (!html.trim()) {
    errors.push({
      code: 'EMPTY_CONTENT',
      message: 'HTML content is empty',
    });
    return { isValid: false, errors, warnings };
  }

  // Check for unclosed tags (basic check)
  const openTags = html.match(/<(\w+)[^>]*(?<!\/)\s*>/g) || [];
  const closeTags = html.match(/<\/(\w+)>/g) || [];

  const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];

  const openTagNames = openTags
    .map(tag => {
      const match = tag.match(/<(\w+)/);
      return match ? match[1].toLowerCase() : '';
    })
    .filter(name => !selfClosingTags.includes(name));

  const closeTagNames = closeTags.map(tag => {
    const match = tag.match(/<\/(\w+)/);
    return match ? match[1].toLowerCase() : '';
  });

  // Simple check - count should roughly match
  if (Math.abs(openTagNames.length - closeTagNames.length) > 5) {
    warnings.push({
      code: 'UNCLOSED_TAGS',
      message: 'HTML may contain unclosed tags',
    });
  }

  // Check for script tags (potential security concern)
  if (/<script/i.test(html)) {
    warnings.push({
      code: 'SCRIPT_TAG',
      message: 'HTML contains script tags which will not execute in PDF',
    });
  }

  // Check for inline event handlers
  if (/\bon\w+\s*=/i.test(html)) {
    warnings.push({
      code: 'EVENT_HANDLERS',
      message: 'HTML contains event handlers which will not work in PDF',
    });
  }

  // Check for external resources
  if (/src\s*=\s*["']https?:/i.test(html) || /href\s*=\s*["']https?:/i.test(html)) {
    warnings.push({
      code: 'EXTERNAL_RESOURCES',
      message: 'HTML references external resources which may not be embedded',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate PDFH-formatted HTML
 */
export function validatePdfhHtml(html: string): PdfhValidationResult {
  const baseValidation = validateHtml(html);
  const errors = [...baseValidation.errors];
  const warnings = [...baseValidation.warnings];

  // Check for PDFH structure
  if (!isPdfhHtml(html)) {
    errors.push({
      code: 'MISSING_PDFH_STRUCTURE',
      message: 'HTML does not contain required PDFH metadata',
    });
  }

  // Check for namespace
  if (!html.includes(PDFH_NAMESPACE)) {
    errors.push({
      code: 'MISSING_NAMESPACE',
      message: `HTML does not include PDFH namespace: ${PDFH_NAMESPACE}`,
    });
  }

  // Extract and validate metadata
  const metadata = extractPdfhMetadata(html);

  if (!metadata.version) {
    errors.push({
      code: 'MISSING_VERSION',
      message: 'PDFH version metadata is missing',
    });
  }

  if (!metadata.conformanceLevel) {
    errors.push({
      code: 'MISSING_CONFORMANCE',
      message: 'PDFH conformance level is missing',
    });
  } else if (!['PDFH-1a', 'PDFH-1b'].includes(metadata.conformanceLevel)) {
    errors.push({
      code: 'INVALID_CONFORMANCE',
      message: `Invalid conformance level: ${metadata.conformanceLevel}`,
    });
  }

  // PDFH-1a specific validation
  if (metadata.conformanceLevel === 'PDFH-1a' && !metadata.hasCoordinateMapping) {
    warnings.push({
      code: 'PDFH_1A_NO_COORDINATES',
      message: 'PDFH-1a conformance level typically includes coordinate mapping',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate conformance level
 */
export function isValidConformanceLevel(level: string): level is ConformanceLevel {
  return level === 'PDFH-1a' || level === 'PDFH-1b';
}

/**
 * Get validation summary as human-readable text
 */
export function getValidationSummary(result: PdfhValidationResult): string {
  const parts: string[] = [];

  if (result.isValid) {
    parts.push('Validation passed.');
  } else {
    parts.push('Validation failed.');
  }

  if (result.errors.length > 0) {
    parts.push(`\nErrors (${result.errors.length}):`);
    result.errors.forEach(err => {
      parts.push(`  - ${err.code}: ${err.message}`);
    });
  }

  if (result.warnings.length > 0) {
    parts.push(`\nWarnings (${result.warnings.length}):`);
    result.warnings.forEach(warn => {
      parts.push(`  - ${warn.code}: ${warn.message}`);
    });
  }

  return parts.join('\n');
}
