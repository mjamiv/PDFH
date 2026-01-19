import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPdfh } from './writer';
import { extractPdfh, listEmbeddedFiles } from './reader';
import { PDFH_EMBEDDED_FILENAME } from '../../types/pdfh';

describe('PDFH HTML round-trip fidelity', () => {
  const fixturesDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../..',
    'tests',
    'fixtures',
    'html'
  );

  const fixtureFiles = [
    'basic.html',
    'entities.html',
    'scripts-styles.html',
    'whitespace.html',
  ];

  it('preserves HTML exactly for fixture files', async () => {
    for (const file of fixtureFiles) {
      const html = await readFile(path.join(fixturesDir, file), 'utf8');

      const pdfBytes = await createPdfh({
        html,
        conformanceLevel: 'PDFH-1b',
        metadataDate: new Date('2020-01-01T00:00:00.000Z'),
      });

      const result = await extractPdfh(pdfBytes, { disableWorker: true });
      expect(result.isPdfh).toBe(true);
      expect(result.content?.html).toBe(html);

      const embeddedFiles = await listEmbeddedFiles(pdfBytes, { disableWorker: true });
      const embedded = embeddedFiles.find(entry => entry.name === PDFH_EMBEDDED_FILENAME);
      expect(embedded).toBeTruthy();
      if (embedded?.contentType) {
        expect(embedded.contentType).toBe('text/html');
      }
      const embeddedHtml = new TextDecoder().decode(embedded?.data);
      expect(embeddedHtml).toBe(html);
    }
  });

  it('preserves unicode and CRLF variants', async () => {
    const unicodeHtml = `<p>${String.fromCodePoint(0x1f600)} ${String.fromCodePoint(0x4e2d)}</p>`;
    const crlfHtml = '<div>\r\n  <span> A\tB </span>\r\n</div>';

    for (const html of [unicodeHtml, crlfHtml]) {
      const pdfBytes = await createPdfh({
        html,
        conformanceLevel: 'PDFH-1b',
        metadataDate: new Date('2020-01-01T00:00:00.000Z'),
      });
      const result = await extractPdfh(pdfBytes, { disableWorker: true });
      expect(result.content?.html).toBe(html);
    }
  });
});
