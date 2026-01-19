/**
 * RichHtmlEditor Component
 * Visual editor with a simple toolbar and live HTML source view.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';
import { textToHtml } from '../../lib/pdfh/textToHtml';

type ViewMode = 'visual' | 'split' | 'source';

interface RichHtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function RichHtmlEditor({
  value,
  onChange,
  readOnly = false,
  height = '400px',
}: RichHtmlEditorProps) {
  const { isDarkMode } = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showHelper, setShowHelper] = useState(false);
  const [rawText, setRawText] = useState('');

  const editorStyle = useMemo(() => ({ height }), [height]);

  useEffect(() => {
    const node = editorRef.current;
    if (!node) return;
    if (node.innerHTML !== value) {
      node.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const applyCommand = useCallback((command: string, commandValue?: string) => {
    if (!editorRef.current || readOnly) return;
    editorRef.current.focus();
    document.execCommand(command, false, commandValue);
    handleInput();
  }, [handleInput, readOnly]);

  const handleCreateLink = useCallback(() => {
    if (readOnly) return;
    const url = window.prompt('Enter link URL');
    if (!url) return;
    applyCommand('createLink', url);
  }, [applyCommand, readOnly]);

  const handlePasteText = useCallback(() => {
    const html = textToHtml(rawText);
    onChange(html);
    setRawText('');
    setShowHelper(false);
  }, [onChange, rawText]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Editor</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-1">
            <button
              className={`px-2 py-1 text-xs rounded ${viewMode === 'visual' ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
              onClick={() => setViewMode('visual')}
              type="button"
            >
              Visual
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${viewMode === 'split' ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
              onClick={() => setViewMode('split')}
              type="button"
            >
              Split
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${viewMode === 'source' ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
              onClick={() => setViewMode('source')}
              type="button"
            >
              HTML
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowHelper(!showHelper)}
            className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          >
            Paste Text
          </button>
        </div>
      </div>

      {!readOnly && (
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex flex-wrap items-center gap-2 bg-white dark:bg-gray-800">
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            onClick={() => applyCommand('bold')}
            type="button"
          >
            Bold
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            onClick={() => applyCommand('italic')}
            type="button"
          >
            Italic
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            onClick={() => applyCommand('underline')}
            type="button"
          >
            Underline
          </button>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-600" />
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            onClick={() => applyCommand('formatBlock', 'H1')}
            type="button"
          >
            H1
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            onClick={() => applyCommand('formatBlock', 'H2')}
            type="button"
          >
            H2
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            onClick={() => applyCommand('formatBlock', 'P')}
            type="button"
          >
            P
          </button>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-600" />
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            onClick={() => applyCommand('insertUnorderedList')}
            type="button"
          >
            Bullet List
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            onClick={() => applyCommand('insertOrderedList')}
            type="button"
          >
            Numbered List
          </button>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-600" />
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            onClick={handleCreateLink}
            type="button"
          >
            Link
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            onClick={() => applyCommand('removeFormat')}
            type="button"
          >
            Clear
          </button>
        </div>
      )}

      {showHelper && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Paste plain text below. We will convert it into basic HTML with paragraphs and lists.
          </p>
          <textarea
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            className="w-full h-28 p-2 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
            placeholder="Paste raw text here..."
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded bg-primary-600 text-white"
              onClick={handlePasteText}
              disabled={!rawText.trim()}
            >
              Convert to HTML
            </button>
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600"
              onClick={() => setShowHelper(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {(viewMode === 'visual' || viewMode === 'split') && (
          <div className="border-r border-gray-200 dark:border-gray-700" style={editorStyle}>
            <div
              ref={editorRef}
              className="h-full p-4 overflow-auto outline-none"
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onInput={handleInput}
            />
          </div>
        )}
        {(viewMode === 'source' || viewMode === 'split') && (
          <div style={editorStyle}>
            <Editor
              height={height}
              language="html"
              value={value}
              onChange={(next) => onChange(next || '')}
              options={{
                readOnly,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                padding: { top: 16, bottom: 16 },
              }}
              theme={isDarkMode ? 'vs-dark' : 'light'}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RichHtmlEditor;
