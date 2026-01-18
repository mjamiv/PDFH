/**
 * ViewerPage Component
 * Main viewer interface for reading PDFH files
 */

import { useState, useCallback } from 'react';
import { FileDropzone } from '../common/FileDropzone';
import { Button } from '../common/Button';
import { SideBySideView } from './SideBySideView';
import { PdfRenderer } from './PdfRenderer';
import { usePdfhReader } from '../../hooks';

export function ViewerPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const { isLoading, error, isPdfh, content, pdfBytes, loadFile, reset } = usePdfhReader();

  const handleFileSelect = useCallback(async (file: File) => {
    setFileName(file.name);
    await loadFile(file);
  }, [loadFile]);

  const handleReset = useCallback(() => {
    setFileName(null);
    reset();
  }, [reset]);

  const hasFile = pdfBytes !== null;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">View a PDFH File</h2>
        <p className="text-sm text-green-700 dark:text-green-300">
          Upload a PDF or PDFH file to view it. If the file contains embedded PDFH content, you'll see both the PDF
          rendering and the extracted HTML side by side.
        </p>
      </div>

      {/* File Upload Area */}
      {!hasFile && (
        <FileDropzone
          onFileSelect={handleFileSelect}
          accept={{
            'application/pdf': ['.pdf', '.pdfh'],
          }}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">Processing file...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Error loading file</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="mt-3">
            Try another file
          </Button>
        </div>
      )}

      {/* File Info & Content */}
      {hasFile && !isLoading && !error && (
        <div className="space-y-4">
          {/* File Info Bar */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{fileName}</p>
                <div className="flex items-center gap-2 text-sm">
                  {isPdfh ? (
                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      PDFH Content Detected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Regular PDF (No PDFH Content)
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Load Another File
            </Button>
          </div>

          {/* Content Display */}
          {isPdfh && content ? (
            <SideBySideView pdfBytes={pdfBytes} content={content} />
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">No PDFH Content Found</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      This appears to be a regular PDF file without embedded PDFH content. You can still view the PDF below.
                    </p>
                  </div>
                </div>
              </div>
              <div className="min-h-[400px] h-[60vh] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <PdfRenderer pdfBytes={pdfBytes} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewerPage;
