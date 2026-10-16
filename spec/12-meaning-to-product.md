# Meaning to product

## Foundation

Firdawsi is an experience-first design language. Jannah-inspired qualities inform
its welcome, nearness, ease, and peaceful completion. Intention, dignity,
gentleness, truthfulness, and trust inform its ethical practice. Architecture and
geometry are optional expressions, not required metaphors or substitutes for usable behaviour.

The religious source, its meaning and original context, and the proposed design
interpretation MUST remain distinguishable. Religious connections are not claims
that revelation prescribes software controls, timings, colours, or layouts.
Sources have been checked; no scholarly endorsement of the design interpretations
is claimed. Sacred text belongs to explanatory documentation, never ornamental
texture, button labels, loading copy, or completion feedback.

## Seven principles

| Principle | Religious source | Proposed product contract |
| --- | --- | --- |
| Intention | [Bukhari 1](https://sunnah.com/bukhari:1) | State the user need before selecting the visual treatment. |
| Peace | [Al-Hijr 15:46](https://quran.com/al-hijr/46) | Make commitment, waiting, and completion understandable. |
| Nearness | [Al-Insan 76:14](https://quran.com/al-insan/14) | Relevant action and recovery stay beside their context. |
| Ease | [Bukhari 69](https://sunnah.com/bukhari:69) | Preserve work, avoid repeated entry, and offer direct recovery. |
| Beauty | [Muslim 91a](https://sunnah.com/muslim:91a) | Coherent proportion and hierarchy precede ornament; reject contempt and exclusion. |
| Dignity | [Al-Isra 17:70](https://quran.com/al-isra/70) | Support touch, keyboard, assistive technology, and authored language experiences. |
| Restraint | [Al-Waqi‘ah 56:25–26](https://quran.com/al-waqiah/25-26) | Use purposeful motion and feedback, then return to stillness. |

Jannah passages are experiential inspiration, not depictions of the unseen.
Bukhari 69 concerns religious guidance; usability is an ethical extension.
Muslim 91a discusses fine clothing and pride, not a mandated visual style.
Restraint is an analogy about attention, not a ruling against decoration.

## Interaction and foundation connections

- Rest: 56:25–26; stable and readable defaults.
- Approach: 76:14; discoverable contextual actions.
- Response: [Muslim 2594a](https://sunnah.com/muslim:2594a); gentle feedback.
- Continuity: Bukhari 69; preserve context and orientation.
- Settling: Muslim 2594a; movement reaches a stable result.
- Completion: [Al-Ahzab 33:70](https://quran.com/al-ahzab/70); truthful state reporting.
- Prepared surfaces: [Al-Ghashiyah 88:13–16](https://legacy.quran.com/88/10-16);
  arranged furnishings inspire readiness without literal visual imitation.
- Typography and localisation: [Ar-Rum 30:22](https://quran.com/ar-rum/22);
  respect for linguistic diversity motivates independent optical tuning.
- Focus and contrast: 17:70; dignity motivates usable access.
- Data and recovery: [An-Nisa 4:58](https://quran.com/an-nisa/58);
  fulfilling trusts motivates preservation of drafts and truthful recovery.
- Evaluation: [Al-Isra 17:36](https://quran.com/al-isra/36);
  knowledge before claims motivates source checks and practical testing.

## Implemented reference scope

The showcase philosophy section has English/Arabic content, source links,
Arabic excerpts, context disclosures, a source register, and the six-stage model.
The experience lab demonstrates three complete flows:

1. Capture a task: trim input, retain selected day, persist locally, confirm only
   after storage succeeds. Connection: ease (Bukhari 69) and trust (4:58).
2. Move within a week: use a native select accessible by keyboard; persist the
   day and expose undo. Connection: dignity (17:70) and gentleness (Muslim 2594a).
3. Recover from failure: preserve old tasks and the capture draft, expose retry
   and cancellation, and never claim success on a storage error. Connection:
   truthfulness (33:70) and trust (4:58).

Invalid saved data is not overwritten. While a failed mutation is pending, other
mutations are disabled until retry or cancellation, avoiding accidental loss.
Three visual directions share identical data and functionality. Decorative
geometry is optional and absent by default. Sacred excerpts remain outside the
working task interface. These are reference interactions, not a complete planner
or an integration into Misho.

## Validation

Run the repository unit tests, production build, type checks, and Playwright suite.
The philosophy suite covers sources, independent Arabic direction, storage failures,
retry without duplication, keyboard movement, persistence, undo, corrupt data,
visual treatment switching, and narrow RTL high-contrast layouts.

Automated checks do not constitute full accessibility conformance or scholarly
review. Formative user studies, expert Arabic review, expert accessibility review,
and adoption in a real product remain follow-on work. The prototype alone does
not establish that a design direction is recognisable or successful.
