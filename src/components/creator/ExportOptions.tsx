/**
 * ExportOptions Component
 * Configuration options for PDFH export
 */

import { ConformanceLevel } from '../../types/pdfh';

interface ExportOptionsProps {
  title: string;
  onTitleChange: (title: string) => void;
  conformanceLevel: ConformanceLevel;
  onConformanceChange: (level: ConformanceLevel) => void;
  includeCoordinateMapping: boolean;
  onCoordinateMappingChange: (include: boolean) => void;
}

export function ExportOptions({
  title,
  onTitleChange,
  conformanceLevel,
  onConformanceChange,
  includeCoordinateMapping,
  onCoordinateMappingChange,
}: ExportOptionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
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
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
    </div>
  );
}

export default ExportOptions;
