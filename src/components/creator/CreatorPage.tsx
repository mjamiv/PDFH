/**
 * CreatorPage Component
 * Main creator interface for generating PDFH files
 */

import { useState, useCallback } from 'react';
import { Button } from '../common/Button';
import { RichHtmlEditor } from './RichHtmlEditor';
import { DEFAULT_HTML } from './HtmlEditor';
import { PdfPreview } from './PdfPreview';
import { ExportOptions, PageSize, MarginSize } from './ExportOptions';
import { usePdfhWriter, useLocalStorage } from '../../hooks';
import { useToastContext } from '../common/ToastContainer';
import { ConformanceLevel } from '../../types/pdfh';

export function CreatorPage() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [title, setTitle] = useState('My PDFH Document');
  const [conformanceLevel, setConformanceLevel] = useLocalStorage<ConformanceLevel>('pdfh-conformance', 'PDFH-1b');
  const [includeCoordinateMapping, setIncludeCoordinateMapping] = useState(false);
  const [showPreview, setShowPreview] = useLocalStorage('pdfh-show-preview', true);
  const [pageSize, setPageSize] = useLocalStorage<PageSize>('pdfh-page-size', 'letter');
  const [marginSize, setMarginSize] = useLocalStorage<MarginSize>('pdfh-margin-size', 'normal');
  const toast = useToastContext();

  const { isGenerating, error, validation, generatePdfh, downloadPdfh, reset } = usePdfhWriter();

  const handleGenerate = useCallback(async () => {
    const result = await generatePdfh({
      html,
      title,
      conformanceLevel,
      includeCoordinateMapping: conformanceLevel === 'PDFH-1a' && includeCoordinateMapping,
    });

    if (result) {
      downloadPdfh(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdfh`, result);
      toast.success('File downloaded successfully');
    } else if (error) {
      toast.error('Failed to generate PDFH file');
    }
  }, [html, title, conformanceLevel, includeCoordinateMapping, generatePdfh, downloadPdfh, toast, error]);

  const handleLoadSample = useCallback(() => {
    setHtml(DEFAULT_HTML);
    setTitle('Sample PDFH Document');
    reset();
  }, [reset]);

  const handleClear = useCallback(() => {
    setHtml('');
    reset();
  }, [reset]);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Create a PDFH File</h2>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Enter or paste HTML content below. The HTML will be embedded within a PDF file that can be viewed in any
          PDF reader while preserving the original HTML structure for extraction.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">HTML Content</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleLoadSample}>
                Load Sample
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
          <RichHtmlEditor value={html} onChange={setHtml} height="min(500px, 50vh)" />

          {/* Validation Messages */}
          {validation && !validation.isValid && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Validation Errors:</p>
              <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                {validation.errors.map((err, i) => (
                  <li key={i}>{err.message}</li>
                ))}
              </ul>
            </div>
          )}

          {validation && validation.warnings.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">Warnings:</p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                {validation.warnings.map((warn, i) => (
                  <li key={i}>{warn.message}</li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Right Column - Preview & Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Preview</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>

          {showPreview && (
            <div className="min-h-[300px] h-[45vh]">
              <PdfPreview html={html} title={title} />
            </div>
          )}

          <ExportOptions
            title={title}
            onTitleChange={setTitle}
            conformanceLevel={conformanceLevel}
            onConformanceChange={setConformanceLevel}
            includeCoordinateMapping={includeCoordinateMapping}
            onCoordinateMappingChange={setIncludeCoordinateMapping}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            marginSize={marginSize}
            onMarginSizeChange={setMarginSize}
          />

          {/* Generate Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!html.trim()}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Generate & Download PDFH
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            The generated file will have a .pdfh extension but is fully compatible with PDF viewers.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreatorPage;
