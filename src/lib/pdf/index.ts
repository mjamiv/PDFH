/**
 * PDF Utilities - Main exports
 */

export {
  createBlankPdf,
  addTextToPage,
  getPageDimensions,
  mergePdfs,
  extractPages,
  setDocumentMetadata,
} from './embed';

export {
  loadPdfDocument,
  renderPageToCanvas,
  renderPageToDataUrl,
  getPagesInfo,
  extractPageText,
  extractAllText,
  calculateFitScale,
} from './render';

export type { EmbedTextOptions, PageDimensions } from './embed';
export type { RenderOptions, PageInfo } from './render';
