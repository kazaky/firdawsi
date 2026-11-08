# Component guidance: purpose, source, behaviour

The component-guidance explorer uses actual `@firdawsi/web` primitives. Each
contract includes purpose, a religious connection, states, keyboard operation,
language/direction, reduced-motion behaviour, and an example of misuse.

## Contracts and religious connections

| Contract | Source | Proposed application |
| --- | --- | --- |
| Button | [Muslim 2594a](https://sunnah.com/muslim:2594a) | Gentleness motivates immediate, restrained acknowledgement. Busy is not success. |
| Text field | [Bukhari 69](https://sunnah.com/bukhari:69) | Facilitation motivates preserved input, local errors, and direct repair. |
| Choices | [Al-Isra 17:70](https://quran.com/al-isra/70) | Dignity motivates clear choices across touch, keyboard, and assistive use. |
| Dialog | [An-Nisa 4:58](https://quran.com/an-nisa/58) | Trust motivates stated consequences, cancellation, and restored context. |
| Local navigation | [Al-Insan 76:14](https://quran.com/al-insan/14) | Easy reach inspires nearby related views with familiar interaction conventions. |
| Status and recovery | [Al-Ahzab 33:70](https://quran.com/al-ahzab/70) | Truthful speech motivates distinguishing accepted, pending, failed, and completed work. |

These are design interpretations with the contextual limits documented in the
philosophy source register. Scripture does not prescribe these component APIs or
technical values. Sacred excerpts stay outside specimen controls and feedback.

## Research-informed checks across the contracts

The [prior-work review](18-precedents-to-design-system.md) adds checks that apply across components:

- **Recognise the action:** for any culturally derived icon or metaphor, ask intended users what they expect it to do before activation. Keep a plain functional label and accessible name. Nasruddin and colleagues' 2022 study found divergent interpretations of a tested icon even within its computer-literate student sample.
- **Consult across modes:** review the same task with Arabic and English readers, keyboard users, and assistive-technology users. Record what feedback changed; do not infer a shared mental model from one participant.
- **Audit the exchange:** a button or dialog that commits a purchase must show the total price, renewal, included benefits, and limits before commitment. A permission prompt explains why access is needed and respects refusal.
- **Preserve coherence:** inspect the component alone, within a screen, and across a complete journey. Spacing and grouping establish hierarchy before optional pattern; decorative scale never replaces action semantics.
- **Observe recovery:** long forms retain work and allow a suitable return path; status components state pending, success, or failure as observed.

These checks are design-system contracts derived from the cited research and Firdawsi's existing principles. The research does not establish numerical acceptance thresholds for this product.

## Working specimens

- Button: activation counter; ready, busy, and disabled states; native disabled and
  `aria-busy` semantics.
- Field: persistent label, hint, associated error, value retention, repair focus,
  and correction. Validation is local and submits no data.
- Choices: independent checkbox, immediate switch, and exclusive native radio
  group. These do not enable actual notifications.
- Dialog: reversible in-memory archival, explicit consequence, cancellation,
  Escape dismissal, trigger focus restoration, and undo.
- Navigation: actual tab primitives, selected-panel agreement, and keyboard
  navigation following local RTL independently of the surrounding page.
- Feedback: state inspection for ready/pending/failed/completed; retry returns to
  pending and never claims a successful save.

All specimens are temporary in-memory examples. Switching component resets its
specimen; changing language preserves the example state. Language does not change
the global site direction. The Dialog and Sheet API now accept an optional
`closeLabel` (default `Close`) so localised examples can name their close action.

## Validation and remaining work

Browser scenarios cover disabled/busy semantics, validation preserving input,
focus on repair, dialog cancellation and confirmation, focus return, undo,
Arabic local navigation, selection, localised dialog close, truthful feedback,
and narrow layouts. Existing package tests and production compilation remain
required. These checks do not replace manual screen-reader review or broader
accessibility/user validation.

Next adoption work should use these contracts in one real product flow, recording
which rules generalise before adding more component variants.
