/**
 * HtmlEditor Component
 * Monaco-based HTML code editor
 */

import { useRef, useCallback } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

const DEFAULT_HTML = `<h1>Welcome to PDFH</h1>

<p>This is a sample HTML document that will be embedded within a PDF file.</p>

<h2>Features</h2>
<ul>
  <li>Full HTML support</li>
  <li>Semantic structure preservation</li>
  <li>Backward compatible with PDF viewers</li>
</ul>

<h2>Sample Table</h2>
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>PDFH-1a</td>
      <td>Full conformance with coordinate mapping</td>
    </tr>
    <tr>
      <td>PDFH-1b</td>
      <td>Basic conformance for HTML embedding</td>
    </tr>
  </tbody>
</table>

<p>Edit this content to create your own PDFH document!</p>`;

export function HtmlEditor({
  value,
  onChange,
  readOnly = false,
  height = '400px',
}: HtmlEditorProps) {
  const { isDarkMode } = useTheme();
  const editorRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleChange: OnChange = (value) => {
    onChange(value || '');
  };

  const handleFormat = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  }, []);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">HTML Editor</span>
        {!readOnly && (
          <button
            onClick={handleFormat}
            className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          >
            Format
          </button>
        )}
      </div>
      <Editor
        height={height}
        language="html"
        value={value}
        onChange={handleChange}
        onMount={handleEditorMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
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
  );
}

export { DEFAULT_HTML };
export default HtmlEditor;
