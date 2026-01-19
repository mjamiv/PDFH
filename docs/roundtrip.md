# HTML Round-Trip Fidelity (HTML -> PDFH -> HTML)

Goal: preserve the original HTML bytes exactly across the round-trip. The HTML extracted from a PDFH file must match the original input HTML string byte-for-byte.

## Scope
- Applies to the HTML provided by the user in the creator/editor.
- The embedded HTML payload must not be normalized, reserialized, or rewrapped in a way that alters bytes.
- Schema metadata should not modify the original HTML payload.

## Fidelity Requirements
- Exact match: extracted HTML bytes MUST equal the original input bytes.
- Encoding: UTF-8, no BOM, no normalization.
- Whitespace: preserved exactly (spaces, tabs, newlines).
- Attribute order and quoting: preserved exactly.
- Entity encoding: preserved exactly as provided.

## Storage Model
- Embed the original HTML input as a standalone attachment without mutation.
- If PDFH metadata wrapper is required, store it separately from the original payload to avoid altering the user input.

## Extraction Model
- Extract the embedded HTML attachment bytes and return them as-is.
- Do not parse and reserialize the HTML during extraction.

## Edge Cases to Cover
- Empty document and whitespace-only input.
- Mixed newline styles (LF/CRLF).
- Non-ASCII characters (emoji, CJK, RTL).
- HTML entities and numeric entities.
- Inline scripts/styles and event handlers (should be preserved even if warnings are emitted).
- Large files (size limits and memory handling).

## Validation Behavior
- Validation may warn on risky content but must not modify the HTML payload.
- Validation errors should not reformat or auto-correct input.
- Large HTML payloads should emit warnings but remain unchanged.

## Tests (Planned)
- Round-trip tests with fixture HTML files covering the edge cases.
- Byte-exact equality check between input and extracted output.
