/**
 * Convert raw text into simple, well-formed HTML.
 * Uses paragraphs and basic lists with minimal formatting.
 */

const UNORDERED_LIST_PREFIX = /^(\s*[-*•])\s+/;
const ORDERED_LIST_PREFIX = /^(\s*\d+\.)\s+/;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isBlank(line: string): boolean {
  return line.trim().length === 0;
}

export function textToHtml(rawText: string): string {
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');

  const blocks: string[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    const paragraphHtml = paragraphLines
      .map(line => escapeHtml(line))
      .join('<br>');
    blocks.push(`<p>${paragraphHtml}</p>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0 || !listType) return;
    const itemsHtml = listItems.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    blocks.push(`<${listType}>${itemsHtml}</${listType}>`);
    listItems = [];
    listType = null;
  };

  for (const line of lines) {
    if (isBlank(line)) {
      flushList();
      flushParagraph();
      continue;
    }

    const unorderedMatch = line.match(UNORDERED_LIST_PREFIX);
    const orderedMatch = line.match(ORDERED_LIST_PREFIX);

    if (unorderedMatch) {
      flushParagraph();
      if (listType && listType !== 'ul') {
        flushList();
      }
      listType = 'ul';
      listItems.push(line.replace(UNORDERED_LIST_PREFIX, '').trim());
      continue;
    }

    if (orderedMatch) {
      flushParagraph();
      if (listType && listType !== 'ol') {
        flushList();
      }
      listType = 'ol';
      listItems.push(line.replace(ORDERED_LIST_PREFIX, '').trim());
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushList();
  flushParagraph();

  return blocks.join('\n\n');
}

export default textToHtml;
