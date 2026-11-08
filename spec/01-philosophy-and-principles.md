# Design Philosophy and Principles

## Position

The system translates durable compositional ideas—proportion, rhythm, continuity, balance, modular construction, and skilled restraint—into contemporary interface behavior. It does not turn historical ornament into a visual theme pack.

Its starting point is the person using the interface. Welcome, rest, permission, fair dealing, consultation, tranquillity, nearness, ease, and beauty are qualities for reflection; care becomes real when the interface receives people clearly, lets them pause and resume, asks before accessing private capabilities or data, discloses the full exchange before commitment, involves affected people in design decisions, preserves their work, explains its state, respects choice, and settles clearly. Visual expression should make that care legible in both Arabic and English. The source-to-behaviour chain and its religious limits are documented in [Meaning to product](12-meaning-to-product.md).

Five commitments guide this translation:

1. **Care is practical.** A calm appearance cannot compensate for lost work, hidden consequences, or uncertain status.
2. **Beauty is relational.** Proportion, rhythm, language, and space create coherence; visible pattern serves that order where useful.
3. **Interpretation is accountable.** Name the source and its context, distinguish the design inference, then observe whether the resulting behaviour helps people.
4. **Meaning is tested with people.** The designer's intended metaphor, action, or cultural signal is a hypothesis until affected people can explain it and use it. Unexpected interpretations are recorded and repaired.
5. **Consultation changes the work.** Arabic readers, people using assistive technology, and domain experts should review real tasks. The design record names what their feedback changed.

The source-by-source research behind these commitments and their component applications is in [Prior work to design practice](18-precedents-to-design-system.md).

“Islamic” here describes a broad field of arts and design produced across societies where Islam was culturally significant. It does not imply one theology, ethnicity, geography, dynasty, or formal language. Historical works must be named as precisely as evidence allows: place, period or polity, medium, maker/workshop when known, and collection record.

## Design philosophy

### Modern, not faux-historical

Interfaces SHOULD feel native to the present platform. Contemporary typography, spacing, interaction patterns, and accessibility conventions lead. Historical references MAY inform proportion, subdivision, framing, cadence, and material character; they MUST NOT be used to simulate a palace, mosque, manuscript, carpet, or tiled surface.

### Restrained, not empty

Restraint means deliberate hierarchy. Most surfaces remain quiet. A small number of moments—an opening frame, section divider, data visualization, ceremonial confirmation, or branded empty state—may carry greater visual expression. “More Islamic” MUST NOT be interpreted as “more ornament.”

### Geometry as structure, not wallpaper

Geometry first determines:

- spacing ratios and column relationships;
- component proportions and corner logic;
- alignment, repetition, and grouping;
- responsive subdivision;
- paths for motion and focus;
- the boundary between content and supporting detail.

Visible pattern is optional. Repeating a motif behind every screen, placing stars in every corner, or covering surfaces with low-contrast tessellation fails this principle even when technically subtle.

### Content has ethical priority

Meaning, legibility, task completion, and user dignity outrank stylistic impact. Text is not bent, clipped, mirrored, fragmented, or obscured to fit geometry. Religious or culturally sensitive material receives additional review and is never generated casually.

## Principles

### 1. Begin with a neutral core

Every component MUST work with no ornament and no regional profile. The neutral form is the accessibility and behavior baseline. A profile can alter approved visual tokens but cannot change a component’s meaning or required affordances.

### 2. Construct, do not paste

Use geometric relationships to derive layouts and motifs. Do not crop an object photograph, trace a museum object, or paste a downloaded pattern into the product. Any derived motif requires provenance, transformation notes, and rights review.

### 3. Reveal order gradually

Complexity SHOULD reward attention without obstructing first use. At first glance, users perceive clear hierarchy; at closer inspection, they may notice proportional echoes, alignments, or carefully bounded pattern.

### 4. Preserve category distinctions

Geometry, vegetal ornament, calligraphy, and figural imagery have different histories and meanings. They MUST be tagged and reviewed separately. A floral scroll is not “geometric”; Arabic-looking marks are not “calligraphy”; calligraphy is not an abstract pattern.

### 5. Prefer relationships over symbols

Use repetition, balance, framed views, center/periphery relationships, and modular growth before recognizable motifs. An eight-pointed star is not a universal shorthand for Islam and MUST NOT become the default brand stamp.

### 6. Make context explicit

When a regional profile is used, product documentation MUST name it. Public-facing historical claims must identify uncertainty and avoid essentialist language such as “authentic Islamic colors,” “the sacred geometry,” or “the Muslim aesthetic.”

### 7. Design bidirectionally from the start

Arabic and Latin are co-primary design cases where both are supported. RTL is not a mirrored screenshot. Logical reading order, script metrics, icon semantics, and mixed-direction content are specified before visual polish.

### 8. Let accessibility constrain form

Contrast, zoom, target size, focus visibility, reduced motion, screen-reader order, and text reflow are generative constraints. Ornament MUST yield before any functional signal.

### 9. Respect material translation

Wood inlay, carved stucco, mosaic, manuscript illumination, textile, ceramic, and stone are not interchangeable skins. Digital references should abstract a material’s logic—assembly, layering, line weight, join, rhythm—rather than counterfeit its surface.

### 10. Record the chain of evidence

Every non-generic historical reference must be traceable from source to design decision. “Found online,” AI output, mood boards without object records, and unattributed pattern libraries are not valid provenance.

## Decision test

Before approving a design, answer:

1. Does it remain clear and complete with ornament removed?
2. Is geometry doing compositional work?
3. Can every historical claim and non-generic motif be traced?
4. Are visual categories correctly identified?
5. Is one regional profile named, or is the universal core used?
6. Could the design be mistaken for a sacred, liturgical, or historical reproduction?
7. Does Arabic receive equal typographic and functional care?
8. Does the experience pass accessibility requirements without a “simplified” separate version?

Any “no” blocks release until resolved or formally reviewed.

