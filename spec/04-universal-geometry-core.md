# Universal Geometry-First Core

## Role

The universal core is the mandatory foundation and the default visual mode. It is intentionally not a “generic Islamic style.” It takes broadly useful geometric methods—modular grids, symmetry, repetition, subdivision, interlace logic, and bounded continuation—and applies them to interface structure without claiming regional specificity.

All components MUST be complete, recognizable, and accessible in core mode. Profiles may tune approved appearance tokens but may not replace semantics or interaction behavior.

## Construction model

### Coordinate system

- Base spatial unit: `u = 4 platform-independent units`.
- Layout dimensions SHOULD be integer multiples of `u`.
- Hairlines may align to device pixels after scaling; optical correction is permitted and documented.
- Motif generation uses normalized coordinates in a square domain `[0,1] × [0,1]`, then fits without non-uniform distortion.

### Grid families

The core supports only these neutral construction families:

1. **Orthogonal:** square/rectangular modules; default for interface layout.
2. **Triangular/hexagonal:** equilateral subdivision; optional for bounded diagrams and motifs.
3. **Radial:** concentric and angular subdivision; reserved for focal compositions, indicators, or explanatory views.

Grid family is metadata. A composition MUST NOT switch families mid-pattern unless the algorithm defines an exact shared construction and a reviewer approves the result.

### Operations

Approved operations are:

- translate;
- rotate by a documented divisor of 360°;
- reflect when reflection does not reverse text or directional symbols;
- subdivide;
- inscribe/circumscribe;
- offset;
- weave with explicit over/under ordering;
- crop at a module boundary;
- repeat periodically.

Quasiperiodic claims are prohibited by default. The Science article in the provenance registry presents an influential interpretation of particular medieval girih constructions and also has published scholarly criticism; it does not license calling any complex pattern “quasicrystalline.”

## Structural tokens

The names below are semantic targets, not implementation syntax.

### Space

- `space.1 = 1u`
- `space.2 = 2u`
- `space.3 = 3u`
- `space.4 = 4u`
- `space.6 = 6u`
- `space.8 = 8u`
- `space.12 = 12u`
- `space.16 = 16u`

Components SHOULD use the shorter sequence; page composition may use the full sequence.

### Line

- `line.hairline`: platform-resolved one-device-pixel boundary where appropriate.
- `line.structural`: standard container/divider stroke.
- `line.emphasis`: selected or focal boundary.
- `line.ornament`: never heavier or higher-contrast than `line.emphasis`.

### Radius

- `radius.none`
- `radius.small`
- `radius.medium`
- `radius.full`

Core controls use `small` or `medium`. `full` is reserved for pills, circular controls, avatars, and geometry that semantics require.

### Pattern

- `pattern.none`
- `pattern.trace`
- `pattern.bounded`
- `pattern.focal`

Pattern tokens also carry `family`, `module`, `rotationOrder`, `strandWidth`, `gap`, `cropRule`, `profile`, `sourceId`, and `reviewStatus`.

## Motif generation contract

Every generated motif MUST provide:

- deterministic seed or explicit construction parameters;
- construction family and repeat cell;
- vector path output;
- minimum rendered size;
- maximum intersection count at each responsive tier;
- foreground/background color roles;
- crop and tiling rules;
- source/provenance identifiers;
- selected profile or `universal`;
- cultural and accessibility review state.

Generators MUST reject:

- text or glyph inputs;
- arbitrary “Islamic style” prompts;
- mixed profiles;
- self-intersecting fills that produce unstable winding;
- gaps below the platform’s reliable rendering threshold;
- unbounded path complexity;
- output that resembles known trademarks or directly traces source objects.

## Interlace rules

- Crossings alternate consistently unless a documented construction specifies otherwise.
- Over/under cues require enough gap to remain visible at 200% zoom and on low-density displays.
- Small variants simplify to a single-line lattice before continuity becomes ambiguous.
- Interlace MUST NOT wrap controls, imply progress, or enter a focus-ring exclusion zone.
- Strand endpoints must terminate intentionally at a frame, node, or crop; accidental loose ends fail review.

## Ornament zones

An ornament zone is a layout region excluded from essential text and controls.

- Default maximum: 15% of viewport area.
- Minimum separation from interactive targets: `space.2`.
- Decorative vectors are hidden from accessibility APIs.
- Zones do not intercept pointer events.
- Zones disappear in high-density workflows, print modes where they waste ink, forced-colors mode when they reduce clarity, and user-selected reduced-decoration mode.

## Responsive simplification

Define at least three geometry tiers:

- **Compact:** no visible construction lines; one repeat fragment or no ornament.
- **Regular:** reduced intersections and one bounded zone.
- **Expanded:** full approved repeat cell or focal composition.

Do not scale a detailed motif down indefinitely. Replace it with a purpose-built simpler topology. Preserve line weight, whitespace, and recognizable rhythm rather than intersection count.

## Geometry for interface structure

Preferred applications:

- column and card proportions;
- repeated list cadence;
- aligned icon boxes;
- section framing;
- progress-step spacing;
- dashboard partitioning;
- responsive split ratios;
- focus movement paths;
- chart grids where data semantics permit.

Discouraged applications:

- star-shaped buttons;
- polygon-clipped body text;
- radial menus for routine navigation;
- tiled form backgrounds;
- decorative notches that reduce target size;
- animated lattices behind content.

## Validation

A geometry implementation passes when:

1. the neutral component works with `pattern.none`;
2. paths are deterministic and vector-based;
3. no text-like forms are present;
4. responsive tiers simplify topologically;
5. focus, contrast, hit targets, and reading order are unaffected;
6. profile and provenance metadata are complete;
7. no historical or sacred claim is inferred from geometry alone.

