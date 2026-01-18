/**
 * usePdfhWriter Hook
 * React hook for creating PDFH files
 */

import { useState, useCallback } from 'react';
import { createPdfh, validateHtml } from '../lib/pdfh';
import { PdfhWriterOptions, PdfhValidationResult } from '../types/pdfh';

interface UsePdfhWriterState {
  isGenerating: boolean;
  error: string | null;
  validation: PdfhValidationResult | null;
  pdfBytes: Uint8Array | null;
}

interface UsePdfhWriterReturn extends UsePdfhWriterState {
  generatePdfh: (options: PdfhWriterOptions) => Promise<Uint8Array | null>;
  validateContent: (html: string) => PdfhValidationResult;
  downloadPdfh: (filename?: string) => void;
  reset: () => void;
}

export function usePdfhWriter(): UsePdfhWriterReturn {
  const [state, setState] = useState<UsePdfhWriterState>({
    isGenerating: false,
    error: null,
    validation: null,
    pdfBytes: null,
  });

  const validateContent = useCallback((html: string): PdfhValidationResult => {
    const result = validateHtml(html);
    setState(prev => ({ ...prev, validation: result }));
    return result;
  }, []);

  const generatePdfh = useCallback(async (options: PdfhWriterOptions): Promise<Uint8Array | null> => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      // Validate first
      const validation = validateHtml(options.html);
      setState(prev => ({ ...prev, validation }));

      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          isGenerating: false,
          error: `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`,
        }));
        return null;
      }

      // Generate PDFH
      const pdfBytes = await createPdfh(options);

      setState(prev => ({
        ...prev,
        isGenerating: false,
        pdfBytes,
        error: null,
      }));

      return pdfBytes;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDFH';
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
        pdfBytes: null,
      }));
      return null;
    }
  }, []);

  const downloadPdfh = useCallback((filename: string = 'document.pdfh') => {
    if (!state.pdfBytes) {
      console.error('No PDFH data to download');
      return;
    }

    const blob = new Blob([new Uint8Array(state.pdfBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.pdfh') ? filename : `${filename}.pdfh`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [state.pdfBytes]);

  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      error: null,
      validation: null,
      pdfBytes: null,
    });
  }, []);

  return {
    ...state,
    generatePdfh,
    validateContent,
    downloadPdfh,
    reset,
  };
}

export default usePdfhWriter;
