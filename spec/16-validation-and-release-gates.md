# Week phases and release gates

Status record started 16 October 2026. This records implemented work and remaining
checks; it does not present unfinished reviews as approvals.

## Phase status

| Phase                             | Implemented evidence                                                                              | Remaining gate                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Week 1 — Meaning and scope        | Seven principles, linked Qur’an/sahih-hadith sources, context and bounded interpretations         | Qualified religious review; correct any disputed wording                                |
| Week 2 — Direction                | Three comparable treatments of the same reference flow                                            | Structured user evaluation and selection of a direction                                 |
| Week 3 — Foundations and controls | Tokens, six component contracts, native controls, independent Arabic/English guidance             | Manual accessibility and Arabic optical review; stability decision                      |
| Week 4 — Reference product        | Capture/edit/complete/move/remove/undo, grouped week, failure recovery, legacy-data compatibility | Real-product adoption remains separate; no Misho integration is claimed                 |
| Week 5 — Validation               | Regression suite plus automated accessibility, narrow reflow and reduced-motion gates             | Resolve audit findings; conduct formative testing and specialist reviews                |
| Week 6 — Alpha release            | Repository setup, checked starter examples, pattern-use guidance                                  | Confirm release scope, unresolved limits, versioning and release notes after validation |

## Automated evidence

The base reference implementation passes build, type checks, 138 unit tests, and
26 browser scenarios at merged commit fc284bb. Week 5 adds seven browser checks and two language/direction unit checks:

1. Whole-showcase WCAG-tagged axe audit in light mode.
2. Whole-showcase WCAG-tagged axe audit in dark mode.
3. Arabic high-contrast field-error audit in the reference flow.
4. Open-dialog audit.
5. 320 CSS pixel Arabic reflow with populated week data.
6. Reduced motion with persistent completion feedback.
7. Dark/high-contrast semantic colours across all six canonical regional providers.

Each axe scan attaches its complete JSON result. This includes violations and
incomplete checks needing human judgement, not just a pass/fail summary. CI
uploads `firdawsi-validation-evidence` even when checks fail. Do not suppress a
rule to make the gate green without a documented, justified exception.

Reflow is checked at a narrow CSS viewport. It supports assessment of enlarged
content, but is not a substitute for real 200% browser zoom, platform text-size
settings, or device testing. Automated colour analysis may leave uncertain
backgrounds for manual inspection.

The current validation result is recorded in [PR #2](https://github.com/kazaky/firdawsi/pull/2)
and its linked CI runs. The suite now contains 140 unit tests and 33 browser
scenarios; the count describes coverage, not a substitute for inspecting results.

The public site describes WCAG 2.2 AA as a target. A passing automated scan is
not a claim of full conformance.

## Findings and repairs

The first audit run (38887172141) failed four scenarios. Findings were kept as
regressions rather than hidden through rule exclusions.

| Finding | Repair |
| --- | --- |
| Regional overlays replaced dark/high-contrast surfaces | Emit theme semantics after regional overlays; exercise every canonical provider in the browser |
| Inverse sections, captions and dim labels lost contrast | Use inverse semantic roles, theme-aware caption colours and readable text on fixed-light studies; dim disabled controls rather than their explanatory text |
| Horizontal profile comparison could not receive keyboard focus | Give the scroll region a name and a focus stop |
| Toolbar and automatic grid minimums exceeded 320px | Reduce toolbar gaps, allow grid children to shrink, wrap table values and stack small gallery cards |
| RTL direction implicitly changed document language to Arabic | Add explicit optional language; preserve language when only direction changes |
| Region metadata appeared as a generated profile | Exclude metadata keys from generated region IDs |

## Formative study protocol — not yet conducted

Recruit 5–8 participants including Arabic-first and English-first users. Seek
participants with relevant access needs and record gaps. Use a clean reference
workspace and ordinary task wording; do not explain the philosophy in advance.

| Task    | Prompt                                                | Record                                             |
| ------- | ----------------------------------------------------- | -------------------------------------------------- |
| Capture | Add a task you would actually want to do this week    | Completion, hesitation, label comprehension        |
| Arrange | Move that task to Friday and find it in the week view | Orientation, keyboard/touch success                |
| Revise  | Change its title, then mark it complete               | Repair, state comprehension, effort                |
| Recover | Encounter a simulated save failure and continue       | Whether saved/pending/failed states are understood |
| Reverse | Remove the task, then restore it                      | Discovery of undo and result comprehension         |

Record unassisted completion counts and time, prompts given, errors, and direct
participant observations. The provisional target is at least 80% unassisted
completion for each task in the final round; report counts with percentages.
Every participant should correctly distinguish failed and saved states after
encountering them. This small sample finds problems; it does not establish
population-level outcomes or spiritual benefit.

After task completion, compare treatments with the same content and ask neutral
questions about clarity, effort, identity and preference. Document the chosen
direction and reasons; do not infer approval from a pleasing screenshot alone.

## Manual review checklist — pending

- Keyboard: meaningful order, visible focus, modal containment, cancellation,
  return focus, radio/tab navigation, and repair after failure.
- Screen readers: labels, state announcements, language switching, region names,
  task completion, failure, retry, and undo.
- Arabic: shaping, diacritics, optical type size, truncation, mixed-script input,
  numbers, and authored copy. Direction and language are separate concerns.
- Visual access: true browser zoom, large text, high contrast, forced colours,
  focus visibility, motion preferences, and backgrounds axe cannot determine.
- Religious framing: source wording, original context, the boundary between
  teaching and design interpretation, and respectful presentation.
- Real devices: touch targets, comfortable reach, responsiveness, and interruptible
  transitions on at least one representative mid-range phone.

For each review, record reviewer/qualification, date, tested version, findings,
changes and remaining limitations. No external reviewer has been assigned or
contacted by this workflow.

## Religious connections to validation

[Al-Isra 17:36](https://quran.com/al-isra/36) motivates evidence before claims;
[Al-Isra 17:70](https://quran.com/al-isra/70) motivates respect for every user's
dignity; [Ar-Rum 30:22](https://quran.com/ar-rum/22) motivates language respect;
[Al-Ahzab 33:70](https://quran.com/al-ahzab/70) motivates honest reporting of
readiness. These are ethical applications, not scriptural test thresholds or
claims that software validation establishes religious merit.
