/**
 * SideBySideView Component
 * Split view showing PDF and extracted HTML side by side with resizable panes
 */

import { useState, useEffect } from 'react';
import { PdfRenderer } from './PdfRenderer';
import { HtmlExtractor } from './HtmlExtractor';
import { ResizablePanes } from '../common/ResizablePanes';
import { PdfhContent } from '../../types/pdfh';
import { useLocalStorage } from '../../hooks';

interface SideBySideViewProps {
  pdfBytes: Uint8Array | null;
  content: PdfhContent | null;
}

type ViewLayout = 'split' | 'pdf-only' | 'html-only';

export function SideBySideView({ pdfBytes, content }: SideBySideViewProps) {
  const [layout, setLayout] = useLocalStorage<ViewLayout>('pdfh-view-layout', 'split');
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Check for large screen on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const renderPdfPane = () => (
    <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <PdfRenderer pdfBytes={pdfBytes} />
    </div>
  );

  const renderHtmlPane = () => (
    <div className="h-full">
      <HtmlExtractor content={content} />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Layout toggle */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => setLayout('split')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
              layout === 'split'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
            </svg>
            Split View
          </button>
          <button
            onClick={() => setLayout('pdf-only')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
              layout === 'pdf-only'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF Only
          </button>
          <button
            onClick={() => setLayout('html-only')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
              layout === 'html-only'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            HTML Only
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-[400px] h-[60vh]">
        {layout === 'split' && isLargeScreen ? (
          <ResizablePanes
            leftPane={renderPdfPane()}
            rightPane={renderHtmlPane()}
            storageKey="pdfh-split-width"
            className="animate-scale-in"
          />
        ) : layout === 'split' ? (
          /* Stacked view for smaller screens */
          <div className="grid grid-cols-1 gap-4 h-full">
            <div className="min-h-[300px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-scale-in">
              <PdfRenderer pdfBytes={pdfBytes} />
            </div>
            <div className="min-h-[300px] animate-scale-in">
              <HtmlExtractor content={content} />
            </div>
          </div>
        ) : layout === 'pdf-only' ? (
          <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-scale-in">
            <PdfRenderer pdfBytes={pdfBytes} />
          </div>
        ) : (
          <div className="h-full animate-scale-in">
            <HtmlExtractor content={content} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBySideView;
