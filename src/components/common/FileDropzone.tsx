/**
 * FileDropzone Component
 * Drag and drop file upload area with enhanced animations
 */

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocalStorage } from '../../hooks';

interface RecentFile {
  name: string;
  size: number;
  lastUsed: number;
}

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  showRecentFiles?: boolean;
}

// File type icon component
function FileTypeIcon({ isPdfh, className = '' }: { isPdfh: boolean; className?: string }) {
  if (isPdfh) {
    return (
      <div className={`relative ${className}`}>
        <svg className="w-full h-full text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[6px] font-bold text-primary-600 dark:text-primary-400">PDFH</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <svg className="w-full h-full text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[6px] font-bold text-red-600 dark:text-red-400">PDF</span>
    </div>
  );
}

export function FileDropzone({
  onFileSelect,
  accept = {
    'application/pdf': ['.pdf', '.pdfh'],
  },
  maxSize = 50 * 1024 * 1024, // 50MB
  disabled = false,
  className = '',
  showRecentFiles = true,
}: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [recentFiles, setRecentFiles] = useLocalStorage<RecentFile[]>('pdfh-recent-files', []);

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
        const file = acceptedFiles[0];
        // Add to recent files
        const newRecent: RecentFile = {
          name: file.name,
          size: file.size,
          lastUsed: Date.now(),
        };
        setRecentFiles((prev) => {
          const filtered = prev.filter((f) => f.name !== file.name);
          return [newRecent, ...filtered].slice(0, 5);
        });
        onFileSelect(file);
      }
    },
    [onFileSelect, maxSize, setRecentFiles]
  );

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

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
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive && !isDragReject ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
          ${!isDragActive && !isDragReject ? 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDragActive ? 'animate-pulse' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
            ${isDragActive ? 'bg-primary-100 dark:bg-primary-800 scale-110' : 'bg-gray-100 dark:bg-gray-700'}
          `}>
            <svg
              className={`w-8 h-8 transition-all duration-300 ${isDragActive ? 'text-primary-600 dark:text-primary-400 -translate-y-1' : 'text-gray-400 dark:text-gray-500'}`}
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
              <p className="text-lg font-medium text-primary-600 dark:text-primary-400 animate-pulse">
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

          {/* File type icons */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileTypeIcon isPdfh={false} className="w-6 h-6" />
              <span className="text-xs text-gray-500 dark:text-gray-400">PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <FileTypeIcon isPdfh={true} className="w-6 h-6" />
              <span className="text-xs text-gray-500 dark:text-gray-400">PDFH</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            Up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>

      {/* Recent files */}
      {showRecentFiles && recentFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Recent files</p>
          <div className="space-y-1">
            {recentFiles.slice(0, 3).map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm cursor-default"
              >
                <FileTypeIcon isPdfh={file.name.endsWith('.pdfh')} className="w-5 h-5" />
                <span className="flex-1 truncate text-gray-700 dark:text-gray-300">{file.name}</span>
                <span className="text-xs text-gray-400">{formatSize(file.size)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slide-up">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

export default FileDropzone;
