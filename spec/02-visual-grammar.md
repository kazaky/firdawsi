# Visual Grammar

## Purpose

This grammar defines how visual decisions combine. It is intentionally narrower than the historical record: a coherent digital system needs limits, while historical arts are diverse and cannot be reduced to product tokens.

## Composition

### Field, frame, and focus

Each view has three layers:

1. **Field:** the quiet working surface. It carries content and MUST preserve text contrast.
2. **Frame:** the layout boundary or sectional edge. It may express geometry through proportion, rules, notches, or bounded pattern.
3. **Focus:** the active task, message, or object. It receives the strongest contrast and interaction cues.

Frames support focus; they do not become the subject. Avoid decorative corner marks on every card, nested borders, and full-screen motifs behind long-form text.

### Proportion and rhythm

- Use an underlying 4-unit spatial base for platform interoperability.
- Prefer simple proportional relationships—1:1, 1:2, 2:3, 3:4—before more elaborate subdivisions.
- Repetition SHOULD establish cadence, then allow controlled interruption for hierarchy.
- Centered/radial composition MAY be used for singular, ceremonial, or contemplative moments, not routine dense workflows.
- Asymmetry is allowed and often preferred for modern interfaces; it should remain anchored to the grid.

## Shape language

- Primary containers are rectilinear or gently rounded. A profile MAY adjust corner character within accessibility and platform norms.
- Polygons and stars are motif primitives, not default container silhouettes.
- Interlace is represented by clear over/under continuity only at sufficient scale. At small sizes, simplify rather than creating visual noise.
- Arches MUST NOT be treated as a generic “Islamic” silhouette. A historically scoped profile may use an arch-derived ratio for framing after review; interactive controls should not masquerade as architecture.
- Avoid crescents, mosque domes, minarets, lanterns, prayer beads, and similar identity shorthand unless the product content specifically calls for them and cultural review approves.

## Line

Three line roles are allowed:

- **Structural:** dividers, outlines, grid guides, and component boundaries.
- **Constructive:** visible traces of motif generation, used sparingly in explanatory or branded moments.
- **Ornamental:** interlace or profile-specific detail, confined to an ornament zone.

Structural lines have highest perceptual priority. Ornament MUST NOT resemble focus rings, selected states, chart lines, links, or separators.

## Color

### Core palette behavior

- Neutral surfaces dominate.
- One primary action color and one semantic accent family are the default maximum in a single view.
- Semantic colors for success, warning, error, and information are invariant across profiles.
- Profile colors are contextual references, not claims that a hue “belongs” to a culture.
- Metallic gold is not a default proxy for luxury or Islam. If used, represent it as a flat accessible color rather than fake reflective texture.

### Distribution

Use an approximate distribution of 70–85% neutral field, 10–25% structural/brand color, and no more than 5–10% ornamental accent in expressive views. Dense data views may use more categorical color but less ornament.

Never encode meaning by color alone. Pattern fills used for differentiation MUST remain legible at 200% zoom and in forced-colors/high-contrast modes.

## Pattern

Pattern has four approved roles:

1. **Structural grid:** usually invisible; controls layout and generation.
2. **Boundary pattern:** a cropped band, divider, or edge treatment.
3. **Focal medallion/field:** a single bounded composition for an empty state, cover, or ceremonial moment.
4. **Explanatory diagram:** shows construction, history, or geometry as content.

Pattern MUST NOT:

- cover routine application backgrounds;
- sit beneath paragraphs, forms, tables, maps, or charts;
- animate continuously;
- create false affordances;
- mix motifs from regional profiles;
- include text-like pseudo-calligraphy;
- be described as “sacred geometry” without a specific sourced scholarly context.

### Density levels

- **0 — none:** default for forms, settings, tables, and task flows.
- **1 — trace:** one rule, notch, crop, or low-detail construction echo.
- **2 — bounded:** one ornament zone occupying at most 15% of the view.
- **3 — focal:** one expressive composition, with plain surroundings.

Density 3 requires brand/cultural review. There is no production density above 3.

## Image and illustration

- Prefer original diagrams, abstract illustrations, or commissioned work with documented rights.
- Museum images are research references unless license terms explicitly allow use.
- Do not erase inscriptions, detach sacred objects from context, or crop an object so that religious text becomes texture.
- Captions for historical objects SHOULD include object type, place, date/period, material, collection, and accession identifier where available.
- Generative imagery MUST carry the same provenance and safeguard review as human-made imagery; model output is not historical evidence.

## Ornament budget

Each screen receives an ornament budget measured by expressive events, not pixels:

- Standard task screen: 0–1 event.
- Editorial/educational screen: 0–2 events.
- Onboarding/brand screen: 0–3 events.
- Sacred or worship-related context: default 0; any use requires domain and community review.

Repeated instances of the same motif still count separately when users perceive them separately.

## Responsive behavior

- Preserve motif logic, not motif detail. Reduce strand count, intersections, and subdivisions at smaller sizes.
- Crop at intentional repeat boundaries; never squeeze a pattern non-uniformly.
- At narrow widths, ornament zones SHOULD collapse before content or controls.
- Geometry may reflow, but reading order and component semantics remain stable.
- Use vector or programmatic forms; raster pattern backgrounds are outside this specification.

## Anti-patterns

- “Islamic” visual identity assembled from teal + gold + stars + arches.
- A universal profile containing Ottoman flowers, Moroccan zellij-like stars, Persian interlace, and Mughal arches.
- Arabic glyphs selected for appearance without knowing their text.
- Dense pattern at 3–8% opacity behind content.
- Decorative dividers that screen readers encounter as content.
- Randomly generated stars with no repeat or construction discipline.
- Claims that abstraction or aniconism applies uniformly to all Islamic societies and contexts.

