import { describe, it, expect } from 'vitest';
import { createPdfh } from './writer';
import { extractPdfh } from './reader';

describe('PDFH HTML round-trip fidelity', () => {
  const cases = [
    {
      name: 'basic',
      html: '<h1>Title</h1>\n<p>Line one.</p>\n<p>Line two.</p>',
    },
    {
      name: 'whitespace-crlf',
      html: '<div>\r\n  <span> A\tB </span>\r\n</div>',
    },
    {
      name: 'entities',
      html: '<p>&amp; &lt; &gt; &quot; &#039; &#x1F600;</p>',
    },
    {
      name: 'unicode',
      html: `<p>${String.fromCodePoint(0x1f600)} ${String.fromCodePoint(0x4e2d)}</p>`,
    },
  ];

  it.each(cases)('preserves HTML exactly for $name', async ({ html }) => {
    const pdfBytes = await createPdfh({
      html,
      conformanceLevel: 'PDFH-1b',
    });

    const result = await extractPdfh(pdfBytes, { disableWorker: true });

    expect(result.isPdfh).toBe(true);
    expect(result.content?.html).toBe(html);
  });
});
