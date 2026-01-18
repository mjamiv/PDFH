/**
 * FileDropzone Component
 * Drag and drop file upload area
 */

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
}

export function FileDropzone({
  onFileSelect,
  accept = {
    'application/pdf': ['.pdf', '.pdfh'],
  },
  maxSize = 50 * 1024 * 1024, // 50MB
  disabled = false,
  className = '',
}: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`File is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`);
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Please upload a PDF or PDFH file.');
        } else {
          setError(rejection.errors[0]?.message || 'File upload failed');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled,
    multiple: false,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive && !isDragReject ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
          ${!isDragActive && !isDragReject ? 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragActive ? 'bg-primary-100 dark:bg-primary-800' : 'bg-gray-100 dark:bg-gray-700'}
          `}>
            <svg
              className={`w-8 h-8 ${isDragActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            {isDragActive ? (
              <p className="text-lg font-medium text-primary-600 dark:text-primary-400">
                Drop the file here
              </p>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  Drag & drop a file here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  or click to browse
                </p>
              </>
            )}
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            Supports PDF and PDFH files up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

export default FileDropzone;
