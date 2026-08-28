# Firdawsi — Specification Index

## Status and scope

This directory defines the research basis and design-language contract for a cross-platform digital design system informed by arts made in Muslim societies. It is not a catalogue of a single, timeless “Islamic style.” The visual traditions discussed here developed across distinct places, periods, workshops, materials, patrons, and communities.

The system’s default is a **universal, geometry-first core**: modern, restrained, and usable without regional ornament. Historical references enter only through named, opt-in regional profiles. Those profiles are starting points for design exploration and **require review by qualified historians, curators, craftspeople, language specialists, and relevant community representatives before public claims of cultural or historical fidelity**.

This specification governs design intent and cross-platform behavior. It does not authorize copying museum objects, sacred text, monuments, or living artists’ work.

## Documents

1. [Design philosophy and principles](01-philosophy-and-principles.md) — purpose, design posture, restraint, and decision tests.
2. [Visual grammar](02-visual-grammar.md) — composition, hierarchy, color, shape, pattern, imagery, and ornament budgets.
3. [Cultural safeguards](03-cultural-safeguards.md) — mandatory prohibitions, review gates, claims, and escalation.
4. [Universal geometry-first core](04-universal-geometry-core.md) — grid, construction logic, tokens, density, and generation constraints.
5. [Regional profiles](05-regional-profiles.md) — Andalusi/Maghrebi, Mamluk, Ottoman, Persian/Central Asian, and Mughal profiles with explicit no-blending rules.
6. [Typography, Arabic–Latin, and RTL](06-typography-arabic-latin-rtl.md) — script parity, type pairing, bidi behavior, numerals, and localization.
7. [Motion](07-motion.md) — motion principles, geometric transitions, reduced motion, and timing contracts.
8. [Component anatomy and contracts](08-component-anatomy-and-contracts.md) — semantic anatomy and shared web, iOS, Android, and desktop behavior.
9. [Accessibility](09-accessibility.md) — WCAG-oriented requirements across color, text, motion, input, semantics, and testing.
10. [Sources and provenance registry](10-sources-and-provenance.md) — authoritative references, evidence levels, object records, and source logging.
11. [Qur’an-guided experience and interaction](11-quranic-experience-and-interaction.md) — source hierarchy, non-claims, experiential laws, and the six-stage interaction cycle.

## Normative language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** indicate requirement strength. A deviation from MUST/MUST NOT requires a documented exception and cultural/accessibility review where relevant.

## Shared vocabulary

- **Geometry:** designs constructed from points, lines, circles, polygons, grids, symmetry, repetition, and interlace. Geometry can organize layout without appearing as ornament.
- **Vegetal ornament:** stylized plant-derived forms such as scrolling stems, leaves, blossoms, palmettes, and composite flowers. “Arabesque” is used only when a source uses it or when narrowly defined; it is not a synonym for all Islamic ornament.
- **Calligraphy:** writing shaped through a script tradition. It carries linguistic content and may carry religious, legal, political, poetic, or dedicatory meaning. It is never treated as a texture.
- **Figural imagery:** representations of people, animals, or narrative scenes. Such imagery occurs in many Islamic artistic contexts; the system does not repeat the inaccurate claim that Islamic art is universally aniconic.
- **Profile:** a bounded reference configuration tied to a named region and historical frame. A profile is not proof of authenticity.
- **Provenance:** the documented source, context, transformation, review status, and rights basis for a design reference.

## Non-negotiable summary

- Geometry structures interfaces before it decorates them.
- Ornament never competes with content or interaction.
- Geometry, vegetal ornament, calligraphy, and figural imagery remain distinct categories in analysis and implementation.
- Qur’anic text, the names of God, the shahada, devotional formulas, and sacred calligraphy MUST NOT be used as decoration, filler, texture, masks, animation paths, loading states, or generated motifs.
- Regional profiles MUST NOT be blended into an unnamed “Islamic” composite.
- Accessibility, legibility, correct Arabic shaping, and semantic direction take priority over visual effect.
- Every historical reference used in production requires a provenance entry and human review.
