/**
 * usePdfhReader Hook
 * React hook for reading and extracting content from PDFH files
 */

import { useState, useCallback } from 'react';
import { extractPdfh, isPdfhFile } from '../lib/pdfh';
import { PdfhContent, PdfhReaderResult } from '../types/pdfh';

interface UsePdfhReaderState {
  isLoading: boolean;
  error: string | null;
  isPdfh: boolean | null;
  content: PdfhContent | null;
  pdfBytes: Uint8Array | null;
}

interface UsePdfhReaderReturn extends UsePdfhReaderState {
  loadFile: (file: File) => Promise<PdfhReaderResult>;
  loadBytes: (bytes: Uint8Array) => Promise<PdfhReaderResult>;
  checkIsPdfh: (bytes: Uint8Array) => Promise<boolean>;
  reset: () => void;
}

export function usePdfhReader(): UsePdfhReaderReturn {
  const [state, setState] = useState<UsePdfhReaderState>({
    isLoading: false,
    error: null,
    isPdfh: null,
    content: null,
    pdfBytes: null,
  });

  const loadBytes = useCallback(async (bytes: Uint8Array): Promise<PdfhReaderResult> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await extractPdfh(bytes);

      setState({
        isLoading: false,
        error: result.error || null,
        isPdfh: result.isPdfh,
        content: result.content || null,
        pdfBytes: bytes,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to read PDF';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isPdfh: false,
        content: null,
      }));

      return { isPdfh: false, error: errorMessage };
    }
  }, []);

  const loadFile = useCallback(async (file: File): Promise<PdfhReaderResult> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      return await loadBytes(bytes);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to read file';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isPdfh: false,
        content: null,
      }));

      return { isPdfh: false, error: errorMessage };
    }
  }, [loadBytes]);

  const checkIsPdfh = useCallback(async (bytes: Uint8Array): Promise<boolean> => {
    try {
      return await isPdfhFile(bytes);
    } catch {
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      isPdfh: null,
      content: null,
      pdfBytes: null,
    });
  }, []);

  return {
    ...state,
    loadFile,
    loadBytes,
    checkIsPdfh,
    reset,
  };
}

export default usePdfhReader;
