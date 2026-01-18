/**
 * HtmlExtractor Component
 * Displays extracted HTML content from PDFH files
 */

import { useState, useCallback } from 'react';
import { Button } from '../common/Button';
import { PdfhContent } from '../../types/pdfh';
import { extractBodyContent } from '../../lib/pdfh/schema';

interface HtmlExtractorProps {
  content: PdfhContent | null;
  className?: string;
}

type ViewMode = 'formatted' | 'source';

export function HtmlExtractor({ content, className = '' }: HtmlExtractorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('formatted');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content.html);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [content]);

  const handleDownloadHtml = useCallback(() => {
    if (!content) return;

    const blob = new Blob([content.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'extracted-content.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [content]);

  if (!content) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No PDFH content extracted</p>
      </div>
    );
  }

  const bodyHtml = extractBodyContent(content.html);

  return (
    <div className={`flex flex-col h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Extracted HTML</span>
          <div className="flex items-center gap-2">
            <Button
              variant={copySuccess ? 'primary' : 'ghost'}
              size="sm"
              onClick={handleCopy}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownloadHtml}>
              Download
            </Button>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('formatted')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'formatted'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Formatted
          </button>
          <button
            onClick={() => setViewMode('source')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'source'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Source
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-2">
        <div className="flex flex-wrap gap-4 text-xs">
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Version:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-200">{content.version}</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Conformance:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-200">{content.conformanceLevel}</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Pages:</span>
            <span className="ml-1 text-blue-800 dark:text-blue-200">{content.pages.length}</span>
          </div>
          {content.metadata?.title && (
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Title:</span>
              <span className="ml-1 text-blue-800 dark:text-blue-200">{content.metadata.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'formatted' ? (
          <div
            className="p-4 prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          <pre className="p-4 text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
            {content.html}
          </pre>
        )}
      </div>
    </div>
  );
}

export default HtmlExtractor;
