# Typography, Arabic–Latin, and RTL

## Principle

Arabic and Latin are distinct writing systems, not mirrored visual substitutes. When both are supported, they receive equal design, editorial, and QA attention. Pairing seeks compatible hierarchy, color, and rhythm—not identical glyph shapes or nominal point sizes.

Arabic type is product language. Historical or sacred calligraphy is outside the UI type system and is governed by the cultural safeguards.

## Typeface requirements

A production Arabic family MUST provide:

- correct joining and contextual forms;
- required language coverage and diacritics;
- OpenType shaping compatible with target engines;
- clear differentiation of confusable forms at UI sizes;
- tested Arabic and Persian/Urdu forms where those languages are claimed;
- stable baselines and line metrics across supported weights;
- a license covering all target platforms and embedding;
- readable numerals and punctuation for the selected locale.

The Latin companion SHOULD share:

- comparable perceived weight;
- compatible stroke contrast and overall formality;
- compatible x-height-to-body impression;
- a similar range of weights and styles;
- aligned functional roles.

Do not choose Arabic because it “looks calligraphic” or force Latin to mimic Arabic strokes.

## Typographic roles

Define roles semantically:

- display;
- heading levels 1–4;
- body;
- compact body;
- label;
- helper;
- code/data;
- numeric/tabular.

Arabic and Latin MAY use different numeric sizes, line heights, and weight mappings to achieve optical parity. Token APIs should expose one role while resolving script-aware values.

### Minimum behavior

- Body text starts at a platform-equivalent of 16 CSS px on the web unless platform guidance requires another metric.
- Arabic line height SHOULD generally be more generous than Latin when diacritics or tall/descending forms require it.
- UI labels MUST NOT use all-caps transformations on Arabic. Latin all caps SHOULD be rare and never the only distinction.
- Letter spacing MUST NOT be applied mechanically to Arabic joining text.
- Artificial bold, oblique, or condensed transformations are prohibited.
- Underlines must avoid obscuring dots and marks; use platform text-decoration controls where available.

## Arabic shaping and content integrity

- Use Unicode text, not glyph outlines or manually selected presentation forms.
- Preserve canonical character sequences supplied by verified content.
- Do not insert tatweel/kashida for visual justification in UI labels.
- Test ligatures, lam-alif behavior, diacritics, combining marks, and fallback transitions.
- Never mirror Arabic glyphs.
- Do not crop ascenders, descenders, dots, vowel marks, or Quranic annotation signs.
- Text embedded in SVG is avoided for localized UI; when unavoidable for non-sacred diagrams, provide accessible equivalent text and test shaping.

Sacred text has stricter requirements and cannot be approved through ordinary localization QA.

## Direction model

Direction is semantic and scoped:

- Set document/app direction from the active locale.
- Allow nested `dir="auto"`-equivalent behavior for user-generated or unknown-direction strings.
- Use bidi isolation for interpolated names, IDs, amounts, dates, and links.
- Keep source code, email addresses, URLs, version strings, and many identifiers LTR within isolated spans.
- Do not concatenate directional fragments into a single unstructured string.

Logical order in the accessibility tree MUST match intended reading order. Visual reordering through CSS or layout transforms must not create a different spoken order.

## Mirroring rules

Mirror:

- back/forward navigation arrows;
- disclosure chevrons when they indicate inline progression;
- steppers, timelines, and carousels whose progression follows reading direction;
- directional entrance/exit motion;
- layout alignment and edge-affixed controls.

Do not mirror:

- text glyphs;
- clocks and many physical-world objects;
- media playback symbols;
- mathematical operators where standards define appearance;
- trademarks and logos;
- maps, charts, or diagrams whose axes/directions carry fixed meaning;
- phone, share, camera, search, check, warning, and other non-directional icons.

Every icon declares `directional: true|false`; no implicit transform is allowed.

## Mixed-script composition

- Prefer complete localized phrases over alternating script fragments.
- Align Arabic and Latin by optical text block, not by forcing a shared baseline that clips one script.
- For bilingual headings, use stacked blocks by default; side-by-side layout is reserved for enough width and a clear reading order.
- Language-switch labels use the language’s own name and script where practical.
- Search, chips, and tables must accommodate Arabic, Latin, and mixed strings without truncating the meaningful edge.
- Ellipsis appears at the logical end. Provide access to full content.

## Numerals, dates, and data

- Numeral system follows locale and user expectation; Arabic-Indic, Eastern Arabic-Indic, and European digits are not interchangeable defaults.
- Use locale-aware formatting APIs for dates, time, currency, decimals, percent, and units.
- Preserve sign/currency placement and bidi isolation.
- Tables align numbers according to locale and task; tabular figures are selected only if available and legible.
- Gregorian and Hijri calendars must be explicitly labeled. Do not infer religious-calendar use from Arabic locale alone.
- Charts identify axis direction and do not mirror data semantics automatically.

## Truncation and wrapping

- Allow at least 200% text zoom and operating-system text scaling without loss.
- Arabic strings often expand differently from English; test translated content, not synthetic character multiplication alone.
- Avoid fixed-height text containers.
- Keep diacritics clear of adjacent rules and ornament.
- Hyphenation and word breaking follow language support; never split joined Arabic words arbitrarily.
- Critical labels, error messages, religious names, and legal text MUST NOT be ellipsized without an accessible full form.

## Input and editing

- Cursor movement, selection, deletion, and home/end behavior follow platform bidi conventions.
- Placeholder direction follows expected input, while user-entered content may use automatic direction.
- Validation must not reject Arabic marks, normalize destructively, or assume ASCII digits.
- Password reveal, search-clear, and inline icons attach to logical start/end, not hard-coded left/right.
- Voice, handwriting, and IME composition states are tested where supported.

## QA matrix

At minimum test:

- Arabic-only RTL;
- English-only LTR;
- Arabic UI with Latin names, URLs, and numbers;
- Latin UI with Arabic names;
- Arabic with full diacritics;
- Persian or Urdu if claimed;
- long translations and narrow screens;
- 200% zoom / maximum supported dynamic type;
- screen readers in both directions;
- copy/paste into and out of mixed-direction fields;
- fallback-font failure and missing-glyph detection.

