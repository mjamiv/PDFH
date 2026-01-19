import { describe, it, expect } from 'vitest';
import { validateHtml } from './validator';

describe('validateHtml', () => {
  it('warns when HTML payload is large', () => {
    const html = `<p>${'a'.repeat(1_000_100)}</p>`;
    const result = validateHtml(html);

    const warningCodes = result.warnings.map(warning => warning.code);
    expect(warningCodes).toContain('LARGE_HTML');
  });
});
