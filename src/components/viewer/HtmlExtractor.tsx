/**
 * HtmlExtractor Component
 * Displays extracted HTML content from PDFH files with syntax highlighting
 */

import { useState, useCallback, useMemo } from 'react';
import { Button } from '../common/Button';
import { PdfhContent } from '../../types/pdfh';
import { extractBodyContent } from '../../lib/pdfh/schema';
import { useToastContext } from '../common/ToastContainer';

interface HtmlExtractorProps {
  content: PdfhContent | null;
  className?: string;
}

type ViewMode = 'formatted' | 'source';

// Simple HTML syntax highlighter
function highlightHtml(html: string): string {
  // Escape HTML entities first
  let result = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Highlight tags
  result = result.replace(
    /(&lt;\/?)([\w-]+)/g,
    '<span class="text-pink-600 dark:text-pink-400">$1</span><span class="text-blue-600 dark:text-blue-400">$2</span>'
  );

  // Highlight closing bracket
  result = result.replace(
    /(\/?&gt;)/g,
    '<span class="text-pink-600 dark:text-pink-400">$1</span>'
  );

  // Highlight attributes
  result = result.replace(
    /\s([\w-]+)=/g,
    ' <span class="text-yellow-600 dark:text-yellow-400">$1</span>='
  );

  // Highlight strings (attribute values)
  result = result.replace(
    /=(".*?"|'.*?')/g,
    '=<span class="text-green-600 dark:text-green-400">$1</span>'
  );

  // Highlight comments
  result = result.replace(
    /(&lt;!--.*?--&gt;)/gs,
    '<span class="text-gray-500 dark:text-gray-500 italic">$1</span>'
  );

  // Highlight DOCTYPE
  result = result.replace(
    /(&lt;!DOCTYPE[^&]*&gt;)/gi,
    '<span class="text-purple-600 dark:text-purple-400">$1</span>'
  );

  return result;
}

export function HtmlExtractor({ content, className = '' }: HtmlExtractorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('formatted');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const toast = useToastContext();

  // Memoize highlighted HTML for performance
  const highlightedHtml = useMemo(() => {
    if (!content) return '';
    return highlightHtml(content.html);
  }, [content]);

  // Split into lines for line numbers
  const lines = useMemo(() => {
    if (!content) return [];
    return content.html.split('\n');
  }, [content]);

  const handleCopy = useCallback(async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content.html);
      setCopySuccess(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    }
  }, [content, toast]);

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
    toast.success('HTML file downloaded');
  }, [content, toast]);

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
              leftIcon={
                copySuccess ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                      className="animate-checkmark"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )
              }
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadHtml}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            >
              Download
            </Button>
          </div>
        </div>

        {/* View mode toggle and options */}
        <div className="flex items-center justify-between">
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
          {viewMode === 'source' && (
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
              />
              Line numbers
            </label>
          )}
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
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
        {viewMode === 'formatted' ? (
          <div
            className="p-4 prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          <div className="flex text-xs font-mono">
            {showLineNumbers && (
              <div className="flex-shrink-0 py-4 pr-2 pl-4 text-right select-none border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                {lines.map((_, i) => (
                  <div key={i} className="text-gray-400 dark:text-gray-600 leading-5">
                    {i + 1}
                  </div>
                ))}
              </div>
            )}
            <pre
              className="flex-1 p-4 overflow-x-auto leading-5"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HtmlExtractor;
