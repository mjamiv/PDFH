import { describe, it, expect } from 'vitest';
import { textToHtml } from './textToHtml';

describe('textToHtml', () => {
  it('wraps paragraphs and preserves line breaks', () => {
    const input = 'Line one\nLine two\n\nLine three';
    const output = textToHtml(input);
    expect(output).toBe('<p>Line one<br>Line two</p>\n\n<p>Line three</p>');
  });

  it('creates unordered lists', () => {
    const input = '- First\n- Second\n\nParagraph';
    const output = textToHtml(input);
    expect(output).toBe('<ul><li>First</li><li>Second</li></ul>\n\n<p>Paragraph</p>');
  });

  it('creates ordered lists', () => {
    const input = '1. Alpha\n2. Beta';
    const output = textToHtml(input);
    expect(output).toBe('<ol><li>Alpha</li><li>Beta</li></ol>');
  });
});
