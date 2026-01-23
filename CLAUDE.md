# CLAUDE.md - Project Context for Claude Code

## Project Overview

PDFH is a React/TypeScript web application that creates and views PDFH files - a format embedding HTML within PDF documents.

## Architecture

```
src/
├── components/
│   ├── common/          # Shared UI components (Button, Header, FileDropzone)
│   ├── creator/         # PDFH creation UI (RichHtmlEditor, PdfPreview, ExportOptions)
│   └── viewer/          # PDFH viewing UI (PdfRenderer, HtmlExtractor)
├── hooks/               # React hooks (usePdfhWriter, useLocalStorage)
├── lib/pdfh/            # Core PDFH logic
│   ├── writer.ts        # PDF generation (html2canvas + jsPDF + pdf-lib)
│   ├── reader.ts        # PDF parsing and HTML extraction
│   └── validator.ts     # HTML validation
├── types/               # TypeScript definitions
│   └── pdfh.ts          # PDFH types, page sizes, margins
└── context/             # React contexts (ThemeContext)
```

## Key Files

- `src/lib/pdfh/writer.ts` - PDF generation using html2canvas to render HTML, jsPDF to create PDF, pdf-lib to embed HTML attachment
- `src/lib/pdfh/reader.ts` - Extracts embedded HTML from PDFH files
- `src/components/creator/CreatorPage.tsx` - Main creation interface
- `src/components/creator/PdfPreview.tsx` - Live HTML preview (iframe-based, not actual PDF)
- `src/types/pdfh.ts` - Type definitions, PAGE_SIZES, DEFAULT_MARGINS constants

## PDF Generation Flow

1. User writes HTML in RichHtmlEditor
2. PdfPreview shows live HTML render in iframe
3. On export, `createPdfh()` in writer.ts:
   - Renders HTML to canvas via html2canvas
   - Creates PDF pages via jsPDF
   - Loads into pdf-lib to add metadata and HTML attachment
   - Returns Uint8Array for download

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # TypeScript check + production build
npm run test     # Run vitest tests
npm run preview  # Preview production build
```

## Dependencies

- **pdf-lib** - PDF manipulation, adding attachments
- **jsPDF** - PDF document creation
- **html2canvas** - HTML to canvas rendering
- **pdfjs-dist** - PDF viewing/rendering
- **agentation** - Visual feedback tool for AI agents (dev only)

## Common Tasks

### Modifying PDF export styling
Edit the `<style>` block in `renderHtmlToPdf()` in `src/lib/pdfh/writer.ts`

### Changing page size options
Edit `PAGE_SIZES` in `src/types/pdfh.ts` and `pageSizeOptions` in `src/components/creator/ExportOptions.tsx`

### Adding new export options
1. Add state to `CreatorPage.tsx`
2. Pass to `ExportOptions.tsx` for UI
3. Include in `generatePdfh()` call
4. Handle in `writer.ts`

## Notes

- The "PDF Preview" is actually an HTML iframe preview, not a true PDF render
- PDFH files use `.pdfh` extension but are valid PDFs
- HTML is embedded as `/EmbeddedFiles` attachment with `pdfh-content.html` filename
- Font file `public/fonts/NotoSans-Regular.ttf` required for Unicode support (legacy, now using html2canvas)
