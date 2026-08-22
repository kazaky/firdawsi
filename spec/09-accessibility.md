# Accessibility

## Standard

The system targets WCAG 2.2 AA for web content as a minimum and follows current native platform accessibility guidance. Legal or organizational requirements may be stricter. Conformance applies to each supported language, direction, profile, color mode, viewport, input method, and motion preference—not only the neutral English demo.

Accessibility is part of the design grammar. No regional profile or ornament may claim an exception.

## Perceivable

### Color and contrast

- Normal text: at least 4.5:1 contrast.
- Large text: at least 3:1 under WCAG definitions.
- Essential non-text UI boundaries, states, focus indicators, and meaningful graphics: at least 3:1 against adjacent colors.
- Disabled controls need not meet text contrast criteria when truly unavailable, but must remain identifiable and must not be the only way information is communicated.
- Profile colors are tested in every state and cannot override semantic status color meaning.
- Text over pattern is prohibited; text over imagery requires a stable contrast surface.

Automated contrast checks are necessary but insufficient for thin Arabic strokes, diacritics, gradients, anti-aliasing, and adjacent patterned regions. Conduct visual review on target devices.

### Text and reflow

- Web content supports 200% text zoom and reflow at 400% zoom/320 CSS px equivalent without loss of information or two-dimensional scrolling except where essential.
- Native apps support platform text scaling to the maximum product-supported accessibility size.
- No fixed-height text containers for localized content.
- Arabic dots and marks are never clipped.
- Content does not depend on exact line breaks.
- Orientation is not restricted unless essential.

### Meaningful graphics

- Decorative geometry is hidden from accessibility APIs.
- Informative construction diagrams have concise alternatives and, when complex, extended descriptions.
- Pattern does not encode categories unless a text/shape equivalent exists.
- Historical object images require useful captions and alt text focused on the page’s purpose, not unsupported interpretation.

## Operable

### Keyboard and alternative input

- All functionality is keyboard operable without timing traps.
- Focus order follows semantic reading order in LTR and RTL.
- Focus is visible, not obscured, and survives profile styling.
- No keyboard trap except standard managed modal behavior with an obvious exit.
- Drag actions have non-drag alternatives.
- Pointer gestures have single-pointer alternatives unless essential.
- Hover-only information is dismissible, hoverable, persistent as required, and accessible by focus.

### Target size

- Meet WCAG 2.2 target-size requirements at minimum.
- Prefer 44×44 CSS px-equivalent touch targets or the current native platform recommendation.
- Adjacent polygonal or decorative shapes do not reduce effective spacing or create misleading hit regions.
- Inline text links remain distinguishable and sufficiently separated in dense content.

### Motion, flashing, and timing

- Respect reduced motion as specified in the motion document.
- No content flashes more than permitted WCAG thresholds.
- Users can pause, stop, or hide nonessential moving content.
- Time limits are avoided or adjustable.
- Animation does not take focus, trigger unexpected context changes, or block input.

## Understandable

- Navigation and component behavior are consistent across profiles and directions.
- Labels remain visible; placeholders are examples, not names.
- Instructions do not rely only on shape, location, color, sound, or “left/right.”
- Errors identify the field, explain the issue, and suggest correction when known.
- Destructive or consequential actions provide review, confirmation, or undo proportional to risk.
- Language changes are programmatically identified.
- Historical and religious language is reviewed for accuracy and audience comprehension.

## Robust

- Prefer native semantics and controls.
- Expose accessible name, role, value/state, relationships, and live status.
- Custom geometry never replaces control semantics.
- Decorative vectors are not focusable and do not intercept input.
- Status announcements are concise and throttled.
- Bidi isolation and DOM/accessibility order are verified with assistive technology.
- Generated UI is schema-validated before render and cannot omit required labels.

## Cognitive accessibility

Restraint is functional:

- ornament density defaults to 0 in forms, settings, errors, tables, and high-stakes flows;
- one primary action per region;
- plain language and short labels;
- progressive disclosure rather than dense simultaneous detail;
- predictable placement and behavior;
- no “mystery meat” symbols based on cultural motifs;
- user preferences for reduced decoration, motion, and contrast persist.

Geometric regularity may aid grouping, but excessive repetition can make items hard to distinguish. Use headings, whitespace, labels, and state—not ornament—to create landmarks.

## Screen-reader specifics

- Arabic pronunciation depends on installed voices and language tagging; tag content accurately and test representative voices.
- Do not transliterate Arabic automatically as the sole alternative.
- Bilingual content declares language at the smallest practical span.
- Directional visual order and spoken order must agree semantically.
- Decorative motif names, construction metadata, and profile labels are not announced unless they are content.
- A historical pattern shown as educational content receives a factual description without claims unsupported by provenance.

## Themes and user preferences

Support as applicable:

- light and dark appearance;
- forced colors / high contrast;
- increased contrast;
- reduced motion;
- bold text;
- large/dynamic text;
- reduced decoration;
- platform color filters without relying on hue alone.

In forced colors, remove ornamental fills and preserve control boundaries, text, selected states, and focus. In dark mode, do not simply invert source-inspired colors; retest contrast and visual weight.

## Test matrix

Each release tests representative flows across:

- keyboard only;
- screen reader + keyboard/touch (VoiceOver, TalkBack, and desktop/web readers in supported scope);
- switch/voice control where platform scope requires;
- 200% and 400% web zoom;
- maximum native text scaling;
- RTL Arabic and LTR English;
- mixed Arabic–Latin strings;
- light, dark, forced-colors/high-contrast;
- reduced motion and reduced decoration;
- color-vision simulations plus non-simulation human checks;
- touch and pointer target spacing;
- low vision magnification;
- profile `universal` and every production regional profile.

Automated tests cover semantics, contrast candidates, keyboard smoke checks, reduced-motion CSS, and schema validation. Manual testing remains mandatory.

## Accessibility acceptance record

Record:

- tested version and platforms;
- languages/directions;
- profiles and themes;
- assistive technologies and versions;
- failures, severity, owner, and remediation date;
- any exception with impact and expiry date.

An inaccessible ornament or profile override is removed; it is not deferred while the functional core remains available.

