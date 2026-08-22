# @firdawsi/geometry

Deterministic TypeScript constructions for responsive geometric, botanical, and
hybrid ornament. The package emits bounded SVG, repeat metadata,
renderer-neutral construction overlays, and versioned JSON recipes.

These are independent contemporary vector constructions, not authenticated
reconstructions of specific objects or workshop methods. Source IDs document
the references that informed the design vocabulary; they do not turn generated
output into historical evidence. Girih metadata records the published
quasiperiodicity debate and makes no quasiperiodic claim.

The botanical family uses a visually reviewed Pinterest board as a design
brief only. Every path is independently constructed from circles, equal-angle
rotations, reflection axes, and deterministic Bézier/arc operations; board
images are not copied or traced. Botanical naming and cultural or regional
attribution remain pending specialist review.

## Curated presets

```ts
import {
  PRESETS,
  generatePreset,
  serializeRecipe,
  toCssPattern,
} from "@firdawsi/geometry";

const result = generatePreset("khatam-8-star-cross", {
  seed: "brand-palette-a",
  unitSize: 44,
  stroke: 1.5,
  interlace: true,
  constructionOverlay: "guides",
  palette: ["#14342b", "#c99b3c", "#f5edda", "#39706a"],
});

element.innerHTML = result.svg;
stylesheet.textContent = toCssPattern(result, ".ornament");
localStorage.setItem("recipe", serializeRecipe(result.recipe));
```

`PRESETS` is a typed `Record<PatternPresetId, PatternPreset>`. Each preset fixes
the valid symmetry and construction topology. Invalid requested symmetry is
replaced with the preset's valid value; angles are never randomly perturbed.

- `construction-grid`: square, triangular, or radial construction divisions
- `khatam-8-star-cross`: square-repeat star, cross, kite, and almond modules
- `rosette-12-almond`: focal layered rosette with twelve almond petals
- `medallion-16-nested`: dense sixteen-fold star, petal, kite, and color-facet rings
- `girih-10-straps`: closed periodic ten-fold star network with prototiles as guides
- `zellige-star-cross`: grouted eight-point star, concave-cross, and kite repeat
- `jali-8-screen`: exact regular-octagon and square (`4.8.8`) edge lattice
- `pointed-arch`: compass-derived two-center pointed arch
- `khatam-corners`: mirrored eight-fold corner fragments
- `geometric-frame`: module-aligned star-and-cross boundary band
- `rumi-medallion-6`: bounded six-fold whorl with split leaves and floral void
- `palmette-roundel`: bilateral palmettes, lotus buds, leaves, and tendrils
- `floral-geometric-field`: exact eight- or twelve-fold floral/geometric repeat

The earlier `generatePattern(kind, options)` and per-kind functions remain
available. They route to the closest curated preset; `generateStar` selects the
sixteen-fold medallion only when `symmetry: 16` is requested and otherwise uses
the eight-fold khatam family. `generateArabesque()` defaults to
`rumi-medallion-6`; pass `presetId: "palmette-roundel"` or
`presetId: "floral-geometric-field"` to select another botanical grammar.

## Geometry and straps

The `@firdawsi/geometry/construction` entry point exports validated
points, lines, circles, segments, polygons, intersections, exact circle
division, square/triangular/hexagonal/radial grids, repeat-edge validation,
deterministic paths, construction overlays, and equilateral girih prototiles.
It also exports `almondPetal`, `splitLeaf`, `palmette`, `lotusBud`,
`sScrollPath`, `tendrilPath`, `mirrorMotifGroup`, and `rotateMotifGroup`.
Almond and split-leaf boundaries are exact arcs of paired reference circles.

When `interlace` is enabled, the current geometric families render a
`continuous-straps` model: every gap outline is emitted first, followed by every
strand core. This produces one consistent outlined network. It intentionally
does not simulate or claim alternating historical over/under weaving. Compact
responsive variants remove strap outlining before continuity becomes unclear.
For `girih-10-straps`, decagon, pentagon, bowtie, and rhombus boundaries are
educational construction-overlay geometry only; the default visible layer is a
closed star/hub/connector network with repeat-matched endpoints.

`PatternResult.constructionOverlay` always contains renderer-neutral guide,
division, and result primitives. Set `constructionOverlay` to `"guides"` or
`"full"` to include those primitives in the SVG. The default is `"none"`.

Seed affects palette ordering (and SVG crop identifiers when a circular crop is
used), never point coordinates, rotations, topology, or angles.

Botanical families additionally accept `petalDepth`, `botanicalFill`,
`strandWidth`, and `weaveGap`. Values are normalized to finite construction
ranges, and existing callers that omit them retain compatible defaults.

## Recipe v2

Every result includes a JSON-safe `PatternRecipe` with:

- construction ID and version;
- exact repeat-cell boundary and translation vectors;
- provenance source IDs;
- semantic layers;
- periodic/bounded/focal topology and rotation order;
- explicit `none`, `continuous-straps`, or `alternating-crossings` metadata;
- geometry and cultural review state with limitations;
- responsive simplification tier;
- normalized rendering options.

```ts
import {
  generateFromRecipe,
  migrateRecipe,
  type LegacyPatternRecipeV1,
} from "@firdawsi/geometry";

const legacy: LegacyPatternRecipeV1 = {
  version: 1,
  kind: "screen",
  options: { seed: "old-screen" },
};

const v2 = migrateRecipe(legacy); // maps to jali-8-v2
const replay = generateFromRecipe(v2);
```

Migration maps v1 inputs to the closest v2 construction. It does not retain the
old shortcut renderer. Legacy `arabesque` recipes migrate to
`rumi-medallion-6-v2`.

## Responsive and performance behavior

`simplifyForViewport` chooses a topology tier:

- `compact`: reduced module count and no outlined straps;
- `regular`: reduced detail with the same recognizable family;
- `expanded`: full approved construction.

The helper also lowers density, enlarges modules, and tightens the node budget
without mutating its input. `maxNodes` remains a hard emission limit (default
1,800; maximum 20,000). Truncation is reported in diagnostics and never emits
`NaN`, infinity, or an unbounded string.

`toCssPattern` uses the recipe repeat-cell dimensions for `background-size`.
Focal and bounded constructions are still valid SVG backgrounds, but are not
semantically periodic decorations.

## Development

```sh
pnpm build
pnpm test
pnpm typecheck
```

Tests cover deterministic golden SVG hashes, finite output, equilateral and
nondegenerate girih prototiles, repeat-edge matching, practical rotational
closure, seed-invariant coordinates, recipe v1 migration/v2 round trips,
construction overlays, circle-derived botanical petals, mirror/rotation groups,
bounded focal anchors, eight-/twelve-fold field invariants, and hard node
limits.
