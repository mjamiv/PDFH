/**
 * ResizablePanes Component
 * Draggable split view divider for PDF and HTML views
 */

import { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '../../hooks';

interface ResizablePanesProps {
  leftPane: ReactNode;
  rightPane: ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  storageKey?: string;
  className?: string;
}

export function ResizablePanes({
  leftPane,
  rightPane,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  storageKey = 'pdfh-pane-width',
  className = '',
}: ResizablePanesProps) {
  const [leftWidth, setLeftWidth] = useLocalStorage(storageKey, defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

      const clampedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth);
      setLeftWidth(clampedWidth);
    },
    [isDragging, minLeftWidth, maxLeftWidth, setLeftWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    setLeftWidth(50);
  }, [setLeftWidth]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={`flex h-full ${className}`}
    >
      {/* Left pane */}
      <div
        className="overflow-hidden transition-none"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPane}
      </div>

      {/* Divider */}
      <div
        className={`
          relative flex-shrink-0 w-2 group cursor-col-resize
          ${isDragging ? 'bg-primary-200 dark:bg-primary-700' : 'bg-gray-200 dark:bg-gray-700'}
          hover:bg-primary-200 dark:hover:bg-primary-700
          transition-colors duration-150
        `}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title="Drag to resize, double-click to reset"
      >
        {/* Visual indicator */}
        <div
          className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-1 h-8 rounded-full
            ${isDragging ? 'bg-primary-500' : 'bg-gray-400 dark:bg-gray-500'}
            group-hover:bg-primary-500
            transition-colors duration-150
          `}
        />

        {/* Grip dots */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1">
          <div className={`w-1 h-1 rounded-full ${isDragging ? 'bg-primary-400' : 'bg-gray-300 dark:bg-gray-600'} group-hover:bg-primary-400 transition-colors`} />
          <div className={`w-1 h-1 rounded-full ${isDragging ? 'bg-primary-400' : 'bg-gray-300 dark:bg-gray-600'} group-hover:bg-primary-400 transition-colors`} />
          <div className={`w-1 h-1 rounded-full ${isDragging ? 'bg-primary-400' : 'bg-gray-300 dark:bg-gray-600'} group-hover:bg-primary-400 transition-colors`} />
        </div>
      </div>

      {/* Right pane */}
      <div
        className="overflow-hidden transition-none flex-1"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPane}
      </div>
    </div>
  );
}

export default ResizablePanes;
