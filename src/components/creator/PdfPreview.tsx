/**
 * PdfPreview Component
 * Preview panel showing how HTML will render as PDF
 */

import { useEffect, useRef, useState } from 'react';

interface PdfPreviewProps {
  html: string;
  title?: string;
}

export function PdfPreview({ html, title = 'PDFH Document' }: PdfPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(100);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
              * {
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 40px;
                background: white;
                min-height: 100vh;
              }
              h1, h2, h3, h4, h5, h6 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                line-height: 1.3;
              }
              h1 { font-size: 2em; margin-top: 0; }
              h2 { font-size: 1.5em; }
              h3 { font-size: 1.25em; }
              p { margin: 1em 0; }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th { background-color: #f5f5f5; }
              code {
                background-color: #f4f4f4;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Consolas', 'Monaco', monospace;
              }
              pre {
                background-color: #f4f4f4;
                padding: 16px;
                border-radius: 4px;
                overflow-x: auto;
              }
              pre code {
                background: none;
                padding: 0;
              }
              ul, ol {
                margin: 1em 0;
                padding-left: 2em;
              }
              li { margin: 0.5em 0; }
              a { color: #0066cc; }
              img { max-width: 100%; height: auto; }
              blockquote {
                margin: 1em 0;
                padding-left: 1em;
                border-left: 4px solid #ddd;
                color: #666;
              }
            </style>
          </head>
          <body>
            ${html}
          </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, title]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">PDF Preview</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(Math.max(50, scale - 10))}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-center">{scale}%</span>
          <button
            onClick={() => setScale(Math.min(200, scale + 10))}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => setScale(100)}
            className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Reset zoom"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto p-4">
        <div
          className="bg-white shadow-lg mx-auto transition-transform origin-top"
          style={{
            width: '612px', // US Letter width in pixels at 72 DPI
            minHeight: '792px', // US Letter height
            transform: `scale(${scale / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <iframe
            ref={iframeRef}
            title="PDF Preview"
            className="w-full h-full border-0"
            style={{ minHeight: '792px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default PdfPreview;
