/**
 * SideBySideView Component
 * Split view showing PDF and extracted HTML side by side
 */

import { useState } from 'react';
import { PdfRenderer } from './PdfRenderer';
import { HtmlExtractor } from './HtmlExtractor';
import { PdfhContent } from '../../types/pdfh';

interface SideBySideViewProps {
  pdfBytes: Uint8Array | null;
  content: PdfhContent | null;
}

type ViewLayout = 'split' | 'pdf-only' | 'html-only';

export function SideBySideView({ pdfBytes, content }: SideBySideViewProps) {
  const [layout, setLayout] = useState<ViewLayout>('split');

  return (
    <div className="flex flex-col h-full">
      {/* Layout toggle */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => setLayout('split')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
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
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
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
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
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
      <div className="flex-1 grid gap-4" style={{
        gridTemplateColumns: layout === 'split' ? '1fr 1fr' : '1fr',
      }}>
        {(layout === 'split' || layout === 'pdf-only') && (
          <div className="h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <PdfRenderer pdfBytes={pdfBytes} />
          </div>
        )}
        {(layout === 'split' || layout === 'html-only') && (
          <div className="h-[600px]">
            <HtmlExtractor content={content} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBySideView;
