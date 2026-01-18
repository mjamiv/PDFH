/**
 * useFileHandler Hook
 * React hook for handling file uploads and drag-and-drop
 */

import { useState, useCallback } from 'react';

interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

interface UseFileHandlerState {
  file: File | null;
  fileInfo: FileInfo | null;
  bytes: Uint8Array | null;
  isLoading: boolean;
  error: string | null;
}

interface UseFileHandlerOptions {
  acceptedTypes?: string[];
  maxSizeMB?: number;
  onFileLoaded?: (bytes: Uint8Array, file: File) => void;
  onError?: (error: string) => void;
}

interface UseFileHandlerReturn extends UseFileHandlerState {
  handleFile: (file: File) => Promise<void>;
  handleDrop: (event: React.DragEvent) => Promise<void>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  reset: () => void;
}

const DEFAULT_MAX_SIZE_MB = 50;
const DEFAULT_ACCEPTED_TYPES = ['application/pdf', '.pdf', '.pdfh'];

export function useFileHandler(options: UseFileHandlerOptions = {}): UseFileHandlerReturn {
  const {
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    onFileLoaded,
    onError,
  } = options;

  const [state, setState] = useState<UseFileHandlerState>({
    file: null,
    fileInfo: null,
    bytes: null,
    isLoading: false,
    error: null,
  });

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const isValidType = acceptedTypes.some(type =>
      type === file.type ||
      type === fileExtension ||
      (type.startsWith('.') && fileExtension === type.toLowerCase())
    );

    if (!isValidType) {
      return `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File too large. Maximum size: ${maxSizeMB}MB`;
    }

    return null;
  }, [acceptedTypes, maxSizeMB]);

  const handleFile = useCallback(async (file: File): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: validationError,
      }));
      onError?.(validationError);
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const fileInfo: FileInfo = {
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        lastModified: new Date(file.lastModified),
      };

      setState({
        file,
        fileInfo,
        bytes,
        isLoading: false,
        error: null,
      });

      onFileLoaded?.(bytes, file);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to read file';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      onError?.(errorMessage);
    }
  }, [validateFile, onFileLoaded, onError]);

  const handleDrop = useCallback(async (event: React.DragEvent): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  }, [handleFile]);

  const handleInputChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  }, [handleFile]);

  const reset = useCallback(() => {
    setState({
      file: null,
      fileInfo: null,
      bytes: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    handleFile,
    handleDrop,
    handleInputChange,
    reset,
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default useFileHandler;
