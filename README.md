# PDFH - HTML in PDF

A web application to **create** and **view** PDFH files - a new file format that embeds structured HTML content within standard PDF files.

**Live Demo**: [https://mjamiv.github.io/PDFH/](https://mjamiv.github.io/PDFH/)

## What is PDFH?

PDFH is a file format that combines the universal compatibility of PDF with the semantic richness of HTML. A PDFH file:

- Is a valid PDF that opens in any PDF reader
- Contains the original HTML source embedded within it
- Can be extracted back to HTML while preserving the original structure

## Features

### Create PDFH Files
- Write HTML directly in the Monaco code editor
- Live preview of how your document will render
- Choose between PDFH-1a (full conformance) and PDFH-1b (basic conformance)
- Download the generated PDFH file

### View PDFH Files
- Upload any PDF or PDFH file
- Automatically detects PDFH content
- Side-by-side view of PDF rendering and extracted HTML
- Copy or download the extracted HTML

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **pdf-lib** - PDF creation and modification
- **pdfjs-dist** - PDF rendering
- **Monaco Editor** - Code editing

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/mjamiv/PDFH.git
cd PDFH

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## PDFH Specification

### Conformance Levels

- **PDFH-1b**: Basic conformance - HTML is embedded as an attachment in the PDF
- **PDFH-1a**: Full conformance - Includes coordinate mapping between HTML elements and PDF positions

### File Structure

PDFH files embed HTML content in the PDF's `/EmbeddedFiles` structure with:
- Filename: `pdfh-content.html`
- AFRelationship: `/Source`
- MIME type: `text/html`

### HTML Schema

PDFH HTML includes namespace and metadata:
```html
<html xmlns="https://pdfh.org/2025/schema">
<head>
  <meta name="pdfh:version" content="1.0">
  <meta name="pdfh:conformance" content="PDFH-1b">
  ...
</head>
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
