/**
 * ExportOptions Component
 * Configuration options for PDFH export with page size and margin controls
 */

import { useState } from 'react';
import { ConformanceLevel } from '../../types/pdfh';

export type PageSize = 'letter' | 'a4' | 'legal';
export type MarginSize = 'none' | 'narrow' | 'normal' | 'wide';

interface ExportOptionsProps {
  title: string;
  onTitleChange: (title: string) => void;
  conformanceLevel: ConformanceLevel;
  onConformanceChange: (level: ConformanceLevel) => void;
  includeCoordinateMapping: boolean;
  onCoordinateMappingChange: (include: boolean) => void;
  pageSize?: PageSize;
  onPageSizeChange?: (size: PageSize) => void;
  marginSize?: MarginSize;
  onMarginSizeChange?: (margin: MarginSize) => void;
}

const pageSizeOptions: { value: PageSize; label: string; dimensions: string }[] = [
  { value: 'letter', label: 'Letter', dimensions: '8.5" × 11"' },
  { value: 'a4', label: 'A4', dimensions: '210 × 297 mm' },
  { value: 'legal', label: 'Legal', dimensions: '8.5" × 14"' },
];

const marginOptions: { value: MarginSize; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: '0"' },
  { value: 'narrow', label: 'Narrow', description: '0.5"' },
  { value: 'normal', label: 'Normal', description: '1"' },
  { value: 'wide', label: 'Wide', description: '1.5"' },
];

export function ExportOptions({
  title,
  onTitleChange,
  conformanceLevel,
  onConformanceChange,
  includeCoordinateMapping,
  onCoordinateMappingChange,
  pageSize = 'letter',
  onPageSizeChange,
  marginSize = 'normal',
  onMarginSizeChange,
}: ExportOptionsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 transition-all duration-200">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Export Options</h3>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          Document Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          placeholder="Enter document title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          Conformance Level
        </label>
        <div className="space-y-2">
          <label className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <input
              type="radio"
              name="conformance"
              value="PDFH-1b"
              checked={conformanceLevel === 'PDFH-1b'}
              onChange={() => onConformanceChange('PDFH-1b')}
              className="mt-1 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">PDFH-1b</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Basic conformance - HTML embedding without coordinate mapping</span>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <input
              type="radio"
              name="conformance"
              value="PDFH-1a"
              checked={conformanceLevel === 'PDFH-1a'}
              onChange={() => onConformanceChange('PDFH-1a')}
              className="mt-1 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">PDFH-1a</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Full conformance with coordinate mapping for element positioning</span>
            </div>
          </label>
        </div>
      </div>

      {conformanceLevel === 'PDFH-1a' && (
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCoordinateMapping}
              onChange={(e) => onCoordinateMappingChange(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">Include coordinate mapping data</span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
            Maps HTML elements to their PDF page coordinates
          </p>
        </div>
      )}

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Advanced Options
      </button>

      {/* Advanced Options Panel */}
      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
          {/* Page Size */}
          {onPageSizeChange && (
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Page Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {pageSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onPageSizeChange(option.value)}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all duration-150 ${
                      pageSize === option.value
                        ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-[10px] opacity-70">{option.dimensions}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Margins */}
          {onMarginSizeChange && (
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Margins
              </label>
              <div className="grid grid-cols-4 gap-2">
                {marginOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onMarginSizeChange(option.value)}
                    className={`px-2 py-2 text-xs rounded-lg border transition-all duration-150 ${
                      marginSize === option.value
                        ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-[10px] opacity-70">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExportOptions;
