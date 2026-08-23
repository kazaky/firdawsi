import {
  almondPetal,
  bounds,
  circle,
  circleCircleIntersections,
  constructionOverlay,
  DeterministicPathBuilder,
  divideCircle,
  girihPrototile,
  insetConvexPolygon,
  line,
  lineLineIntersection,
  lotusBud,
  mirrorMotifGroup,
  overlayCircle,
  overlayPoint,
  overlayPolygon,
  overlaySegment,
  palmette,
  point,
  polygon,
  polygonCentroid,
  polygonPath,
  radialGrid,
  regularPolygon,
  rotateMotifGroup,
  segment,
  splitLeaf,
  sScrollPath,
  squareGrid,
  tendrilPath,
  triangularGrid,
  type BotanicalMotif,
  type BotanicalPath,
  type ConstructionOverlay,
  type ConstructionOverlayPrimitive,
  type Point,
  type Polygon,
} from "./construction/index.js";
import { normalizeOptions, round } from "./options.js";
import { optionsForPreset, PRESETS } from "./presets.js";
import { applyRegionalProfile } from "./profiles.js";
import { createPrng } from "./prng.js";
import { createSvgDocument, points as legacyPoints, type SvgDocument } from "./svg.js";
import type {
  BotanicalPatternPresetId,
  ConstructionId,
  NormalizedOptions,
  PatternKind,
  PatternLayer,
  PatternOptions,
  PatternPresetId,
  PatternPresetOptions,
  PatternRecipe,
  PatternResult,
  RepeatCell,
} from "./types.js";

interface DrawnGeometry {
  readonly repeatCell: RepeatCell;
  readonly overlay: ConstructionOverlay;
  readonly layers: readonly PatternLayer[];
}

type DrawConstruction = (options: NormalizedOptions, document: SvgDocument) => DrawnGeometry;

const TAU = Math.PI * 2;
const SQRT_2 = Math.sqrt(2);
const STAR_INNER_RATIO = SQRT_2 - 1;

function paletteOffset(options: NormalizedOptions): number {
  return Math.floor(createPrng(options.seed)() * options.palette.length);
}

function color(options: NormalizedOptions, index: number): string {
  return options.palette[(index + paletteOffset(options)) % options.palette.length]!;
}

function strokeAttributes(
  options: NormalizedOptions,
  stroke = color(options, 0),
  width = options.stroke,
): string {
  return `fill="none" stroke="${stroke}" stroke-width="${round(width)}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"`;
}

function polygonPoints(value: Polygon): string {
  return value.vertices.map((vertex) => `${round(vertex.x)},${round(vertex.y)}`).join(" ");
}

function emitPolygon(
  document: SvgDocument,
  value: Polygon,
  options: NormalizedOptions,
  fillIndex: number,
  opacity = 0.18,
  strokeIndex = 0,
): boolean {
  return document.push(
    `<polygon points="${polygonPoints(value)}" fill="${color(options, fillIndex)}" fill-opacity="${round(opacity)}" stroke="${color(options, strokeIndex)}" stroke-width="${round(options.stroke)}" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`,
  );
}

function emitModulePolygon(
  document: SvgDocument,
  value: Polygon,
  options: NormalizedOptions,
  module: string,
  fillIndex: number,
  strokeIndex = 2,
  opacity = 1,
): boolean {
  return document.push(
    `<polygon points="${polygonPoints(value)}" fill="${color(options, fillIndex)}" fill-opacity="${round(opacity)}" stroke="${color(options, strokeIndex)}" stroke-width="${round(options.stroke)}" stroke-linejoin="round" vector-effect="non-scaling-stroke" data-module="${module}"/>`,
  );
}

/** Shrinks every vertex toward the centroid by a fixed distance (true grout inset). */
function insetTowardCentroid(value: Polygon, distance: number): Polygon {
  if (distance <= 0) {
    return value;
  }
  const center = polygonCentroid(value);
  return polygon(
    value.vertices.map((vertex) => {
      const dx = vertex.x - center.x;
      const dy = vertex.y - center.y;
      const length = Math.hypot(dx, dy);
      if (length <= distance) {
        return point(center.x, center.y);
      }
      const factor = (length - distance) / length;
      return point(center.x + dx * factor, center.y + dy * factor);
    }),
  );
}

function groutInset(value: Polygon, distance: number): Polygon {
  return insetConvexPolygon(value, distance) ?? insetTowardCentroid(value, distance);
}

/**
 * Renders one continuous strap layer. All gaps are emitted first and all strand
 * cores second, so this is an outlined continuous network, not a simulated
 * historical over/under weave.
 */
function emitStraps(
  document: SvgDocument,
  paths: readonly string[],
  options: NormalizedOptions,
  strokeIndex = 0,
): boolean {
  if (options.interlace) {
    for (const data of paths) {
      if (
        !document.push(
          `<path d="${data}" ${strokeAttributes(options, color(options, 2), options.strandWidth + options.weaveGap * 2)} data-strand-layer="gap"/>`,
        )
      ) {
        return false;
      }
    }
  }
  for (const data of paths) {
    if (
      !document.push(
        `<path d="${data}" ${strokeAttributes(options, color(options, strokeIndex), options.strandWidth)} data-strand-layer="core"/>`,
      )
    ) {
      return false;
    }
  }
  return true;
}

function regularAt(center: Point, radius: number, sides: number, rotation = -Math.PI / 2): Polygon {
  return regularPolygon(circle(center, radius), sides, rotation);
}

/**
 * Decorative star polygon. This is not compass construction: it places
 * alternating outer/inner radii on a circle. Prefer `rosetteGeometry` or a
 * named construction preset. Callers that need the decorative primitive
 * should import `decorativeStar`.
 */
function alternatingStar(
  center: Point,
  outerRadius: number,
  count: number,
  innerRatio: number,
  rotation = -Math.PI / 2,
): Polygon {
  return polygon(
    Array.from({ length: count * 2 }, (_, index) => {
      const angle = rotation + (index * Math.PI) / count;
      const radius = index % 2 === 0 ? outerRadius : outerRadius * innerRatio;
      return point(
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle) * radius,
      );
    }),
  );
}

function radialPoint(center: Point, radius: number, angle: number): Point {
  return point(center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius);
}

function almondPath(
  center: Point,
  innerRadius: number,
  outerRadius: number,
  angle: number,
  halfWidth: number,
): string {
  const start = radialPoint(center, innerRadius, angle);
  const end = radialPoint(center, outerRadius, angle);
  const middleRadius = (innerRadius + outerRadius) / 2;
  const firstControl = point(
    center.x + Math.cos(angle) * middleRadius + Math.cos(angle + Math.PI / 2) * halfWidth,
    center.y + Math.sin(angle) * middleRadius + Math.sin(angle + Math.PI / 2) * halfWidth,
  );
  const secondControl = point(
    center.x + Math.cos(angle) * middleRadius - Math.cos(angle + Math.PI / 2) * halfWidth,
    center.y + Math.sin(angle) * middleRadius - Math.sin(angle + Math.PI / 2) * halfWidth,
  );
  return `M${round(start.x)} ${round(start.y)}Q${round(firstControl.x)} ${round(firstControl.y)} ${round(end.x)} ${round(end.y)}Q${round(secondControl.x)} ${round(secondControl.y)} ${round(start.x)} ${round(start.y)}Z`;
}

function squareRepeat(id: string, size: number, origin = point(0, 0)): RepeatCell {
  return {
    id,
    width: size,
    height: size,
    vectors: [[size, 0], [0, size]],
    boundary: [
      origin,
      point(origin.x + size, origin.y),
      point(origin.x + size, origin.y + size),
      point(origin.x, origin.y + size),
    ],
  };
}

function boundedRepeat(id: string, width: number, height: number): RepeatCell {
  return {
    id,
    width,
    height,
    vectors: [[width, 0], [0, height]],
    boundary: [point(0, 0), point(width, 0), point(width, height), point(0, height)],
  };
}

function defaultLayers(sourceIds: readonly string[], hasStraps: boolean): readonly PatternLayer[] {
  return [
    { id: "modules", role: "module", sourceIds },
    ...(hasStraps ? [{ id: "straps", role: "strap" as const, sourceIds }] : []),
    { id: "outlines", role: "outline", sourceIds },
    { id: "construction", role: "construction", sourceIds },
  ];
}

function botanicalLayers(
  sourceIds: readonly string[],
  includeField = false,
): readonly PatternLayer[] {
  return [
    ...(includeField ? [{ id: "repeat-field", role: "field" as const, sourceIds }] : []),
    { id: "stems-and-tendrils", role: "stem", sourceIds },
    { id: "leaves-and-palmettes", role: "foliage", sourceIds },
    { id: "buds-and-rosettes", role: "flower", sourceIds },
    { id: "geometric-connectors", role: "connector", sourceIds },
    { id: "bounded-outline", role: "boundary", sourceIds },
    { id: "negative-floral-space", role: "void", sourceIds },
    { id: "construction", role: "construction", sourceIds },
  ];
}

function botanicalStrokeWidth(value: BotanicalPath, options: NormalizedOptions): number {
  return value.role === "vein" || value.role === "lobe"
    ? options.strandWidth * 0.58
    : value.role === "stem"
      ? options.strandWidth
      : options.stroke;
}

function emitBotanicalPath(
  document: SvgDocument,
  value: BotanicalPath,
  options: NormalizedOptions,
  transform = "",
  fillIndex = 1,
  strokeIndex = 0,
  fillOpacity = 0.34,
  layerId = "leaves-and-palmettes",
  motifId = "botanical-motif",
): boolean {
  const transformAttribute = transform ? ` transform="${transform}"` : "";
  const fill =
    value.closed && options.botanicalFill
      ? `fill="${color(options, fillIndex)}" fill-opacity="${round(fillOpacity)}"`
      : 'fill="none"';
  return document.push(
    `<path d="${value.data}" ${fill} stroke="${color(options, strokeIndex)}" stroke-width="${round(botanicalStrokeWidth(value, options))}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" data-layer="${layerId}" data-motif="${motifId}" data-botanical-role="${value.role}"${transformAttribute}/>`,
  );
}

function emitBotanicalMotif(
  document: SvgDocument,
  motif: BotanicalMotif,
  options: NormalizedOptions,
  transforms: readonly string[] = [""],
  fillIndex = 1,
  strokeIndex = 0,
  fillOpacity = 0.34,
  layerId = "leaves-and-palmettes",
  motifId = "botanical-motif",
): boolean {
  for (const transform of transforms) {
    for (const value of motif.paths) {
      if (
        !emitBotanicalPath(
          document,
          value,
          options,
          transform,
          fillIndex,
          strokeIndex,
          fillOpacity,
          layerId,
          motifId,
        )
      ) {
        return false;
      }
    }
  }
  return true;
}

function withoutLobeGuides(motif: BotanicalMotif): BotanicalMotif {
  return {
    ...motif,
    paths: motif.paths.filter((value) => value.role !== "lobe"),
  };
}

function emitBotanicalPolygon(
  document: SvgDocument,
  value: Polygon,
  options: NormalizedOptions,
  layerId: string,
  motifId: string,
  fillIndex: number,
  opacity: number,
  strokeIndex = 0,
): boolean {
  return document.push(
    `<polygon points="${polygonPoints(value)}" fill="${color(options, fillIndex)}" fill-opacity="${round(opacity)}" stroke="${color(options, strokeIndex)}" stroke-width="${round(options.stroke)}" stroke-linejoin="round" vector-effect="non-scaling-stroke" data-layer="${layerId}" data-motif="${motifId}"/>`,
  );
}

function motifOverlay(motif: BotanicalMotif): readonly ConstructionOverlayPrimitive[] {
  return [
    ...motif.referenceCircles.map((value) => overlayCircle(value)),
    ...motif.anchors.map((value) => overlayPoint(value)),
  ];
}

function emitRoundelBoundary(
  document: SvgDocument,
  center: Point,
  radius: number,
  options: NormalizedOptions,
): boolean {
  if (
    options.botanicalFill &&
    !document.push(
      `<circle cx="${round(center.x)}" cy="${round(center.y)}" r="${round(radius)}" fill="${color(options, 2)}" fill-opacity=".1" data-layer="bounded-outline" data-motif="roundel-ground"/>`,
    )
  ) {
    return false;
  }
  return document.push(
    `<circle cx="${round(center.x)}" cy="${round(center.y)}" r="${round(radius)}" ${strokeAttributes(options, color(options, 1), options.strandWidth * 1.1)} data-layer="bounded-outline" data-motif="circular-boundary" data-botanical-role="boundary"/>`,
  );
}

function crossTile(origin: Point, size: number): Polygon {
  const radius = size / 2;
  const inner = (radius * STAR_INNER_RATIO) / SQRT_2;
  return polygon([
    point(origin.x + radius, origin.y),
    point(origin.x + inner, origin.y + inner),
    point(origin.x, origin.y + radius),
    point(origin.x + inner, origin.y + size - inner),
    point(origin.x + radius, origin.y + size),
    point(origin.x + size - inner, origin.y + size - inner),
    point(origin.x + size, origin.y + radius),
    point(origin.x + size - inner, origin.y + inner),
  ]);
}

function khatamGeometry(options: NormalizedOptions, document: SvgDocument): DrawnGeometry {
  const size = options.unitSize * (1.7 - options.density * 0.45);
  const outer = size / 2;
  const inner = outer * STAR_INNER_RATIO;
  const overlayPrimitives: ConstructionOverlayPrimitive[] = [];
  const exemplar = point(size, size);
  const exemplarCircle = circle(exemplar, outer);
  const exemplarStar = alternatingStar(exemplar, outer, 8, STAR_INNER_RATIO);
  const exemplarCross = crossTile(point(size / 2, size / 2), size);
  overlayPrimitives.push(
    overlayCircle(exemplarCircle),
    ...divideCircle(exemplarCircle, 16).map((division) => overlayPoint(division)),
    overlayPolygon(exemplarStar),
    overlayPolygon(exemplarCross),
  );

  const compact = options.simplificationTier === "compact";
  const expanded = options.simplificationTier === "expanded";
  const strapPaths: string[] = [];

  for (let y = 0; y <= options.height + size; y += size) {
    for (let x = 0; x <= options.width + size; x += size) {
      const center = point(x, y);
      const star = alternatingStar(center, outer, 8, STAR_INNER_RATIO);
      strapPaths.push(polygonPath(star, 3));
      if (
        !emitModulePolygon(
          document,
          star,
          options,
          "eight-point-star",
          2,
          0,
          compact ? 0.08 : 0.18,
        )
      ) {
        return {
          repeatCell: squareRepeat("khatam-8-cell", size),
          overlay: constructionOverlay(overlayPrimitives),
          layers: defaultLayers(PRESETS["khatam-8-star-cross"].sourceIds, true),
        };
      }
      if (!compact) {
        for (let index = 0; index < 8; index += expanded ? 1 : 2) {
          const angle = -Math.PI / 2 + (index * TAU) / 8;
          const kite = polygon([
            center,
            radialPoint(center, inner, angle - Math.PI / 8),
            radialPoint(center, outer, angle),
            radialPoint(center, inner, angle + Math.PI / 8),
          ]);
          if (
            !emitModulePolygon(
              document,
              kite,
              options,
              "star-kite",
              index + 1,
              0,
              0.11,
            )
          ) {
            break;
          }
        }
      }
    }
  }
  for (let y = 0; y < options.height + size; y += size) {
    for (let x = 0; x < options.width + size; x += size) {
      const cross = crossTile(point(x, y), size);
      strapPaths.push(polygonPath(cross, 3));
      if (
        !emitModulePolygon(
          document,
          cross,
          options,
          "concave-cross",
          1,
          0,
          0.13,
        )
      ) {
        break;
      }
    }
  }
  emitStraps(document, strapPaths, options, 0);
  return {
    repeatCell: squareRepeat("khatam-8-cell", size),
    overlay: constructionOverlay(overlayPrimitives),
    layers: defaultLayers(PRESETS["khatam-8-star-cross"].sourceIds, true),
  };
}

function rosetteGeometry(options: NormalizedOptions, document: SvgDocument): DrawnGeometry {
  const center = point(options.width / 2, options.height / 2);
  const radius = Math.min(options.width, options.height) * 0.43;
  const mainCircle = circle(center, radius);
  const divisions = divideCircle(mainCircle, 12);
  const chord = Math.hypot(
    divisions[0]!.x - divisions[1]!.x,
    divisions[0]!.y - divisions[1]!.y,
  );
  const petalCircles = divisions.map((division) => circle(division, chord));
  const overlayPrimitives: ConstructionOverlayPrimitive[] = [
    overlayCircle(mainCircle),
    overlayCircle(circle(center, radius * 0.62)),
    overlayCircle(circle(center, radius * 0.26)),
    ...petalCircles.map((value) => overlayCircle(value, "guide")),
    ...divisions.map((division) => overlaySegment(segment(center, division))),
    ...divisions.map((division) => overlayPoint(division)),
  ];

  const tips: Point[] = [];
  const innerNodes: Point[] = [];
  for (let index = 0; index < 12; index += 1) {
    const hits = circleCircleIntersections(
      petalCircles[index]!,
      petalCircles[(index + 1) % 12]!,
    );
    const outer = hits.reduce((farthest, candidate) =>
      Math.hypot(candidate.x - center.x, candidate.y - center.y) >
      Math.hypot(farthest.x - center.x, farthest.y - center.y)
        ? candidate
        : farthest,
    );
    const inner = hits.reduce((nearest, candidate) =>
      Math.hypot(candidate.x - center.x, candidate.y - center.y) <
      Math.hypot(nearest.x - center.x, nearest.y - center.y)
        ? candidate
        : nearest,
    );
    tips.push(outer);
    innerNodes.push(inner);
    overlayPrimitives.push(overlayPoint(outer, "result"), overlayPoint(inner, "result"));
  }

  const petalCount = options.simplificationTier === "compact" ? 6 : 12;
  const step = options.simplificationTier === "compact" ? 2 : 1;
  for (let index = 0; index < 12; index += step) {
    if (index >= petalCount && options.simplificationTier === "compact") {
      break;
    }
    const prev = (index + 11) % 12;
    const next = (index + 1) % 12;
    const petal = polygon([
      innerNodes[prev]!,
      divisions[index]!,
      tips[index]!,
      divisions[next]!,
      innerNodes[index]!,
      radialPoint(
        center,
        radius * 0.34,
        -Math.PI / 2 + ((index + 0.5) * TAU) / 12,
      ),
    ]);
    emitModulePolygon(document, petal, options, "compass-petal", index % 3, 0, 0.55);
    overlayPrimitives.push(overlayPolygon(petal, "result"));
  }

  if (options.simplificationTier !== "compact") {
    for (let index = 0; index < 12; index += 1) {
      const tip = tips[index]!;
      const nextTip = tips[(index + 1) % 12]!;
      const ringInner = radialPoint(
        center,
        radius * 0.72,
        -Math.PI / 2 + ((index + 0.5) * TAU) / 12,
      );
      const kite = polygon([
        divisions[(index + 1) % 12]!,
        tip,
        ringInner,
        nextTip,
      ]);
      emitPolygon(document, kite, options, index + 1, 0.14, 0);
      overlayPrimitives.push(overlayPolygon(kite));
    }
  }

  emitPolygon(document, regularAt(center, radius * 0.26, 12), options, 2, 0.2, 1);
  emitStraps(
    document,
    [
      polygonPath(polygon(tips), 3),
      polygonPath(regularAt(center, radius * 0.62, 12), 3),
    ],
    options,
    0,
  );
  if (options.simplificationTier === "expanded") {
    const secondary = Array.from({ length: 12 }, (_, index) => {
      const angle = -Math.PI / 2 + (index * TAU) / 12;
      return almondPath(center, radius * 0.28, radius * 0.58, angle, radius * 0.05);
    });
    emitStraps(document, secondary, options, 1);
  }
  return {
    repeatCell: boundedRepeat("rosette-12-field", options.width, options.height),
    overlay: constructionOverlay(overlayPrimitives),
    layers: defaultLayers(PRESETS["rosette-12-almond"].sourceIds, true),
  };
}

function medallionGeometry(options: NormalizedOptions, document: SvgDocument): DrawnGeometry {
  const center = point(options.width / 2, options.height / 2);
  const radius = Math.min(options.width, options.height) * 0.45;
  const boundary = circle(center, radius);
  const ringRatios = [0.18, 0.32, 0.46, 0.58, 0.7, 0.82, 0.94, 1] as const;
  const rayCount = 16;
  const startAngle = -Math.PI / 2;
  const grid = radialGrid(boundary, rayCount, ringRatios.length, startAngle);
  const overlayPrimitives: ConstructionOverlayPrimitive[] = [
    ...ringRatios.map((ratio) => overlayCircle(circle(center, radius * ratio))),
    ...grid.segments.map((edge) => overlaySegment(edge)),
    ...grid.points.map((division) => overlayPoint(division)),
  ];

  const at = (ring: number, ray: number): Point => {
    const angle = startAngle + ((ray % rayCount) * TAU) / rayCount;
    return radialPoint(center, radius * ringRatios[ring]!, angle);
  };
  const midRay = (ring: number, ray: number): Point => {
    const angle = startAngle + ((ray + 0.5) * TAU) / rayCount;
    return radialPoint(center, radius * ringRatios[ring]!, angle);
  };

  document.push(
    `<circle cx="${round(center.x)}" cy="${round(center.y)}" r="${round(radius)}" fill="${color(options, 2)}" fill-opacity=".34" stroke="${color(options, 0)}" stroke-width="${round(options.stroke)}" data-module="medallion-boundary"/>`,
  );

  const outerStar = polygon(
    Array.from({ length: rayCount * 2 }, (_, index) => {
      const ray = Math.floor(index / 2);
      return index % 2 === 0 ? at(7, ray) : midRay(5, ray);
    }),
  );
  emitModulePolygon(document, outerStar, options, "outer-sixteen-star", 0, 2, 0.82);

  for (let ray = 0; ray < rayCount; ray += 1) {
    const outerKite = polygon([
      at(4, ray),
      midRay(5, ray),
      at(7, ray),
      midRay(5, (ray + rayCount - 1) % rayCount),
      at(4, (ray + rayCount - 1) % rayCount),
    ]);
    emitModulePolygon(
      document,
      outerKite,
      options,
      "outer-kite-facet",
      ray % 2 === 0 ? 1 : 3,
      2,
      0.82,
    );
  }

  if (options.simplificationTier !== "compact") {
    for (let ray = 0; ray < rayCount; ray += 1) {
      const petal = polygon([
        midRay(2, ray),
        at(3, ray),
        midRay(4, ray),
        at(3, (ray + 1) % rayCount),
      ]);
      emitModulePolygon(
        document,
        petal,
        options,
        "grid-petal-ring",
        ray % 2 === 0 ? 3 : 1,
        0,
        0.76,
      );
    }
  }

  const middleStar = polygon(
    Array.from({ length: rayCount * 2 }, (_, index) => {
      const ray = Math.floor(index / 2);
      return index % 2 === 0 ? at(4, ray) : midRay(3, ray);
    }),
  );
  emitModulePolygon(document, middleStar, options, "middle-sixteen-star", 1, 2, 0.86);

  for (let ray = 0; ray < rayCount; ray += 1) {
    const innerKite = polygon([
      at(1, ray),
      midRay(2, ray),
      at(3, ray),
      midRay(2, (ray + rayCount - 1) % rayCount),
      at(1, (ray + rayCount - 1) % rayCount),
    ]);
    emitModulePolygon(
      document,
      innerKite,
      options,
      "inner-kite-facet",
      ray % 2 === 0 ? 2 : 3,
      0,
      0.88,
    );
  }

  const centralStar = polygon(
    Array.from({ length: 16 }, (_, index) => {
      const ray = Math.floor(index / 2);
      return index % 2 === 0 ? at(1, ray * 2) : midRay(0, ray * 2);
    }),
  );
  emitModulePolygon(document, centralStar, options, "central-eight-star", 3, 2, 0.96);
  emitModulePolygon(
    document,
    polygon(Array.from({ length: rayCount }, (_, ray) => at(0, ray))),
    options,
    "central-sixteen-facet",
    1,
    0,
    1,
  );
  emitStraps(
    document,
    [
      polygonPath(polygon(Array.from({ length: rayCount }, (_, ray) => at(6, ray))), 3),
      polygonPath(polygon(Array.from({ length: rayCount }, (_, ray) => midRay(4, ray))), 3),
      polygonPath(polygon(Array.from({ length: rayCount }, (_, ray) => at(1, ray))), 3),
    ],
    options,
    0,
  );
  return {
    repeatCell: boundedRepeat("medallion-16-field", options.width, options.height),
    overlay: constructionOverlay(overlayPrimitives),
    layers: defaultLayers(PRESETS["medallion-16-nested"].sourceIds, true),
  };
}

function midpoint(first: Point, second: Point): Point {
  return point((first.x + second.x) / 2, (first.y + second.y) / 2);
}

function attachGirihTile(
  kind: "pentagon" | "bowtie",
  start: Point,
  end: Point,
  awayFrom: Point,
): Polygon {
  const side = Math.hypot(end.x - start.x, end.y - start.y);
  const prototype = girihPrototile(kind, point(0, 0), side);
  const targetAngle = Math.atan2(end.y - start.y, end.x - start.x);
  const candidates = prototype.vertices.map((prototypeStart, index) => {
    const prototypeEnd = prototype.vertices[(index + 1) % prototype.vertices.length]!;
    const prototypeAngle = Math.atan2(
      prototypeEnd.y - prototypeStart.y,
      prototypeEnd.x - prototypeStart.x,
    );
    const rotation = targetAngle - prototypeAngle;
    const cosine = Math.cos(rotation);
    const sine = Math.sin(rotation);
    const rotatedStart = point(
      prototypeStart.x * cosine - prototypeStart.y * sine,
      prototypeStart.x * sine + prototypeStart.y * cosine,
    );
    return polygon(
      prototype.vertices.map((vertex) => {
        const rotated = point(
          vertex.x * cosine - vertex.y * sine,
          vertex.x * sine + vertex.y * cosine,
        );
        return point(
          start.x + rotated.x - rotatedStart.x,
          start.y + rotated.y - rotatedStart.y,
        );
      }),
    );
  });
  return candidates.reduce((farther, candidate) => {
    const average = (value: Polygon): Point =>
      point(
        value.vertices.reduce((sum, vertex) => sum + vertex.x, 0) / value.vertices.length,
        value.vertices.reduce((sum, vertex) => sum + vertex.y, 0) / value.vertices.length,
      );
    const candidateCenter = average(candidate);
    const fartherCenter = average(farther);
    return Math.hypot(candidateCenter.x - awayFrom.x, candidateCenter.y - awayFrom.y) >
      Math.hypot(fartherCenter.x - awayFrom.x, fartherCenter.y - awayFrom.y)
      ? candidate
      : farther;
  });
}

function girihConstructionPrimitives(
  center: Point,
  radius: number,
): readonly ConstructionOverlayPrimitive[] {
  return girihClusterTiles(center, radius).flatMap((tile) => {
    if (tile.kind === "decagon") {
      return [
        overlayCircle(circle(center, radius), "guide"),
        overlayPolygon(tile.polygon, "guide"),
        ...tile.polygon.vertices.map((value) => overlayPoint(value, "division")),
      ];
    }
    return [overlayPolygon(tile.polygon, "guide")];
  });
}

interface GirihClusterTile {
  readonly kind: "decagon" | "rhombus" | "pentagon" | "bowtie";
  readonly polygon: Polygon;
}

function girihClusterTiles(center: Point, radius: number): readonly GirihClusterTile[] {
  const tileSide = 2 * radius * Math.sin(Math.PI / 10);
  const decagon = girihPrototile("decagon", center, tileSide, -Math.PI / 2);
  const tiles: GirihClusterTile[] = [{ kind: "decagon", polygon: decagon }];

  for (let index = 0; index < 10; index += 1) {
    const first = decagon.vertices[index]!;
    const second = decagon.vertices[(index + 1) % 10]!;
    const edgeMiddle = midpoint(first, second);
    const edgeX = second.x - first.x;
    const edgeY = second.y - first.y;
    const angle = (2 * Math.PI) / 5;
    const candidates = [angle, -angle].map((turn) =>
      point(
        edgeX * Math.cos(turn) - edgeY * Math.sin(turn),
        edgeX * Math.sin(turn) + edgeY * Math.cos(turn),
      ),
    );
    const delta = candidates.reduce((farther, candidate) => {
      const candidateDistance = Math.hypot(
        edgeMiddle.x + candidate.x - center.x,
        edgeMiddle.y + candidate.y - center.y,
      );
      const fartherDistance = Math.hypot(
        edgeMiddle.x + farther.x - center.x,
        edgeMiddle.y + farther.y - center.y,
      );
      return candidateDistance > fartherDistance ? candidate : farther;
    });
    const outerFirst = point(first.x + delta.x, first.y + delta.y);
    const outerSecond = point(second.x + delta.x, second.y + delta.y);
    const rhombus = polygon([first, second, outerSecond, outerFirst]);
    const attachedKind = index % 2 === 0 ? "pentagon" : "bowtie";
    const attached = attachGirihTile(attachedKind, outerFirst, outerSecond, center);
    tiles.push({ kind: "rhombus", polygon: rhombus }, { kind: attachedKind, polygon: attached });
  }
  return tiles;
}

const GIRIH_HANKIN_ANGLE = Math.PI / 5;

function unitDirection(value: Point): Point {
  const length = Math.hypot(value.x, value.y) || 1;
  return point(value.x / length, value.y / length);
}

function rotateDirection(value: Point, angle: number): Point {
  return point(
    value.x * Math.cos(angle) - value.y * Math.sin(angle),
    value.x * Math.sin(angle) + value.y * Math.cos(angle),
  );
}

function pickInwardDirection(origin: Point, candidates: readonly Point[], toward: Point): Point {
  return candidates.reduce((best, candidate) => {
    const score =
      candidate.x * (toward.x - origin.x) + candidate.y * (toward.y - origin.y);
    const bestScore = best.x * (toward.x - origin.x) + best.y * (toward.y - origin.y);
    return score > bestScore ? candidate : best;
  });
}

/** Hankin intersection near a tile vertex: rays from adjacent edge midpoints at ±36°. */
function hankinCorner(
  previous: Point,
  vertex: Point,
  next: Point,
  centroid: Point,
  theta = GIRIH_HANKIN_ANGLE,
): Point | null {
  const midPrevious = midpoint(previous, vertex);
  const midNext = midpoint(vertex, next);
  const edgePrevious = unitDirection(point(vertex.x - previous.x, vertex.y - previous.y));
  const edgeNext = unitDirection(point(next.x - vertex.x, next.y - vertex.y));
  const fromPrevious = pickInwardDirection(
    midPrevious,
    [rotateDirection(edgePrevious, theta), rotateDirection(edgePrevious, -theta)],
    centroid,
  );
  const fromNext = pickInwardDirection(
    midNext,
    [rotateDirection(edgeNext, theta), rotateDirection(edgeNext, -theta)],
    centroid,
  );
  return lineLineIntersection(line(midPrevious, fromPrevious), line(midNext, fromNext));
}

interface GirihNetworkPaths {
  readonly circuits: readonly string[];
  readonly connectors: readonly string[];
}

function girihHankinNetwork(tiles: readonly GirihClusterTile[]): GirihNetworkPaths {
  const circuits: string[] = [];

  for (const tile of tiles) {
    const vertices = tile.polygon.vertices;
    const centroid = polygonCentroid(tile.polygon);
    const mids = vertices.map((vertex, index) =>
      midpoint(vertex, vertices[(index + 1) % vertices.length]!),
    );
    const corners: Point[] = [];
    let intact = true;
    for (let index = 0; index < vertices.length; index += 1) {
      const previous = vertices[(index + vertices.length - 1) % vertices.length]!;
      const vertex = vertices[index]!;
      const next = vertices[(index + 1) % vertices.length]!;
      const corner = hankinCorner(previous, vertex, next, centroid);
      if (!corner) {
        intact = false;
        break;
      }
      corners.push(corner);
    }
    if (!intact || corners.length !== vertices.length) {
      continue;
    }

    const circuitPoints: Point[] = [];
    for (let index = 0; index < vertices.length; index += 1) {
      circuitPoints.push(mids[index]!, corners[(index + 1) % vertices.length]!);
    }
    circuits.push(polygonPath(polygon(circuitPoints), 3));
  }

  return { circuits, connectors: [] };
}

function emitGirihNetwork(
  document: SvgDocument,
  network: GirihNetworkPaths,
  options: NormalizedOptions,
): boolean {
  const paths = [
    ...network.circuits.map((data) => ({ data, role: "midline" })),
    ...network.connectors.map((data) => ({ data, role: "connector" })),
  ] as const;
  if (options.interlace) {
    for (const path of paths) {
      if (
        !document.push(
          `<path d="${path.data}" ${strokeAttributes(options, color(options, 2), options.strandWidth + options.weaveGap * 2)} data-strand-layer="gap" data-girih-role="${path.role}"/>`,
        )
      ) {
        return false;
      }
    }
  }
  for (const path of paths) {
    if (
      !document.push(
        `<path d="${path.data}" ${strokeAttributes(options, color(options, 0), options.strandWidth)} data-strand-layer="core" data-girih-role="${path.role}"/>`,
      )
    ) {
      return false;
    }
  }
  return true;
}

function girihRepeatCell(cell: number): RepeatCell {
  return {
    id: "girih-10-cluster-cell",
    width: cell,
    height: cell,
    vectors: [[cell, 0], [0, cell]],
    boundary: [
      point(0, 0),
      point(cell, 0),
      point(cell, cell),
      point(0, cell),
    ],
  };
}

function girihGeometry(options: NormalizedOptions, document: SvgDocument): DrawnGeometry {
  const cell = options.unitSize * (2.65 - options.density * 0.35);
  const radius = cell * 0.2;
  const overlayPrimitives = girihConstructionPrimitives(point(cell / 2, cell / 2), radius);
  const fillTiles = options.simplificationTier === "expanded";

  for (let y = -cell / 2; y < options.height + cell; y += cell) {
    for (let x = -cell / 2; x < options.width + cell; x += cell) {
      const clusterCenter = point(x, y);
      const tiles = girihClusterTiles(clusterCenter, radius);
      if (fillTiles) {
        for (const tile of tiles) {
          const fillIndex =
            tile.kind === "decagon" ? 2 : tile.kind === "rhombus" ? 1 : tile.kind === "pentagon" ? 3 : 0;
          if (
            !emitModulePolygon(
              document,
              tile.polygon,
              options,
              `girih-${tile.kind}`,
              fillIndex,
              2,
              0.08,
            )
          ) {
            return {
              repeatCell: girihRepeatCell(cell),
              overlay: constructionOverlay(overlayPrimitives),
              layers: defaultLayers(PRESETS["girih-10-straps"].sourceIds, true),
            };
          }
        }
      }
      if (!emitGirihNetwork(document, girihHankinNetwork(tiles), options)) {
        return {
          repeatCell: girihRepeatCell(cell),
          overlay: constructionOverlay(overlayPrimitives),
          layers: defaultLayers(PRESETS["girih-10-straps"].sourceIds, true),
        };
      }
    }
  }
  return {
    repeatCell: girihRepeatCell(cell),
    overlay: constructionOverlay(overlayPrimitives),
    layers: defaultLayers(PRESETS["girih-10-straps"].sourceIds, true),
  };
}

function zelligeGeometry(options: NormalizedOptions, document: SvgDocument): DrawnGeometry {
  const size = options.unitSize * (1.62 - options.density * 0.32);
  const outer = size / 2;
  const grout = size * (options.simplificationTier === "compact" ? 0.055 : 0.04);
  document.push(
    `<rect width="${round(options.width)}" height="${round(options.height)}" fill="${color(options, 2)}" data-module="grout-field"/>`,
  );
  const exemplarCenter = point(size, size);
  const exemplarStar = alternatingStar(exemplarCenter, outer, 8, STAR_INNER_RATIO);
  const exemplarCross = crossTile(point(size / 2, size / 2), size);
  const overlayPrimitives: ConstructionOverlayPrimitive[] = [
    overlayCircle(circle(exemplarCenter, outer)),
    ...divideCircle(circle(exemplarCenter, outer), 16).map((value) => overlayPoint(value)),
    overlayPolygon(exemplarStar),
    overlayPolygon(exemplarCross),
  ];
  crosses:
  for (let y = 0; y < options.height + size; y += size) {
    for (let x = 0; x < options.width + size; x += size) {
      const center = point(x + size / 2, y + size / 2);
      const cross = groutInset(crossTile(point(x, y), size), grout);
      if (!emitModulePolygon(document, cross, options, "concave-cross", 1, 2, 0.96)) {
        break crosses;
      }
      if (options.simplificationTier !== "compact") {
        for (let arm = 0; arm < 4; arm += 1) {
          const cardinalIndex = arm * 2;
          const previous = cross.vertices[(cardinalIndex + 7) % 8]!;
          const cardinal = cross.vertices[cardinalIndex]!;
          const next = cross.vertices[(cardinalIndex + 1) % 8]!;
          const kite = polygon([center, previous, cardinal, next]);
          if (
            !emitModulePolygon(
              document,
              kite,
              options,
              "cross-kite",
              arm % 2 === 0 ? 3 : 0,
              2,
              0.7,
            )
          ) {
            break crosses;
          }
        }
      }
    }
  }
  stars:
  for (let y = 0; y <= options.height + size; y += size) {
    for (let x = 0; x <= options.width + size; x += size) {
      const center = point(x, y);
      const star = groutInset(alternatingStar(center, outer, 8, STAR_INNER_RATIO), grout);
      if (!emitModulePolygon(document, star, options, "eight-point-star", 0, 2, 0.98)) {
        break stars;
      }
      if (options.simplificationTier !== "compact") {
        const innerFacet = groutInset(alternatingStar(center, outer * 0.34, 8, 0.48), grout * 0.5);
        if (
          !emitModulePolygon(
            document,
            innerFacet,
            options,
            "star-center-facet",
            3,
            2,
            0.94,
          )
        ) {
          break stars;
        }
      }
    }
  }
  return {
    repeatCell: squareRepeat("zellige-star-cross-cell", size),
    overlay: constructionOverlay(overlayPrimitives),
    layers: defaultLayers(PRESETS["zellige-star-cross"].sourceIds, false),
  };
}

function jaliGeometry(options: NormalizedOptions, document: SvgDocument): DrawnGeometry {
  const spacing = options.unitSize * (1.75 - options.density * 0.55);
  const side = spacing / (1 + SQRT_2);
  const radius = side / (2 * Math.sin(Math.PI / 8));
  const overlayPrimitives: ConstructionOverlayPrimitive[] = [];
  const paths: string[] = [];
  const pathBudget = Math.floor(options.maxNodes / (options.interlace ? 2 : 1)) + 1;
  let exemplar = true;
  octagons: 
  for (let y = 0; y <= options.height + spacing; y += spacing) {
    for (let x = 0; x <= options.width + spacing; x += spacing) {
      if (paths.length >= pathBudget) {
        break octagons;
      }
      const octagon = regularAt(point(x, y), radius, 8, Math.PI / 8);
      paths.push(polygonPath(octagon));
      if (exemplar) {
        overlayPrimitives.push(
          overlayCircle(circle(point(x, y), radius)),
          overlayPolygon(octagon),
          ...octagon.vertices.map((value) => overlayPoint(value)),
        );
        exemplar = false;
      }
    }
  }
  squares:
  for (let y = spacing / 2; y < options.height + spacing; y += spacing) {
    for (let x = spacing / 2; x < options.width + spacing; x += spacing) {
      if (paths.length >= pathBudget) {
        break squares;
      }
      const square = regularAt(point(x, y), side / Math.sqrt(2), 4, 0);
      paths.push(polygonPath(square));
      if (overlayPrimitives.filter((primitive) => primitive.kind === "polygon").length === 1) {
        overlayPrimitives.push(overlayPolygon(square));
      }
    }
  }
  emitStraps(document, paths, options, 0);
  return {
    repeatCell: squareRepeat("jali-4-8-8-cell", spacing),
    overlay: constructionOverlay(overlayPrimitives),
    layers: defaultLayers(PRESETS["jali-8-screen"].sourceIds, true),
  };
}

function gridGeometry(options: NormalizedOptions, document: SvgDocument): DrawnGeometry {
  const requestedSpacing = options.unitSize / Math.max(0.5, options.density);
  const safePointBudget = Math.max(16, Math.min(9_000, options.maxNodes * 2));
  const spacing = Math.max(
    requestedSpacing,
    Math.sqrt((options.width * options.height) / safePointBudget),
  );
  const area = bounds(0, 0, options.width, options.height);
  const grid =
    options.symmetry === 6
      ? triangularGrid({ bounds: area, spacing })
      : options.symmetry === 4 || options.symmetry === 8
        ? squareGrid({ bounds: area, spacing })
        : radialGrid(
            circle(point(options.width / 2, options.height / 2), Math.min(options.width, options.height) * 0.46),
            options.symmetry,
            options.simplificationTier === "compact" ? 2 : 4,
          );
  for (const edge of grid.segments) {
    if (
      !document.push(
        `<path d="M${round(edge.start.x)} ${round(edge.start.y)}L${round(edge.end.x)} ${round(edge.end.y)}" ${strokeAttributes(options, color(options, 0), options.stroke * 0.65)} opacity=".42"/>`,
      )
    ) {
      break;
    }
  }
  for (const cell of grid.cells) {
    if (options.simplificationTier === "expanded") {
      emitPolygon(document, cell, options, 1, 0.025, 1);
    }
  }
  const repeat =
    grid.repeatCell && options.symmetry !== 10 && options.symmetry !== 12 && options.symmetry !== 16
      ? {
          id: "construction-grid-cell",
          width: Math.max(...grid.repeatCell.vertices.map((value) => value.x)) - Math.min(...grid.repeatCell.vertices.map((value) => value.x)),
          height: Math.max(...grid.repeatCell.vertices.map((value) => value.y)) - Math.min(...grid.repeatCell.vertices.map((value) => value.y)),
          vectors: [
            [
              grid.repeatCell.vertices[1]!.x - grid.repeatCell.vertices[0]!.x,
              grid.repeatCell.vertices[1]!.y - grid.repeatCell.vertices[0]!.y,
            ],
            [
              grid.repeatCell.vertices[grid.repeatCell.vertices.length - 1]!.x -
                grid.repeatCell.vertices[0]!.x,
              grid.repeatCell.vertices[grid.repeatCell.vertices.length - 1]!.y -
                grid.repeatCell.vertices[0]!.y,
            ],
          ] as const,
          boundary: grid.repeatCell.vertices,
        }
      : boundedRepeat("radial-construction-field", options.width, options.height);
  return {
    repeatCell: repeat,
    overlay: constructionOverlay([
      ...grid.segments.map((edge) => overlaySegment(edge)),
      ...grid.points.slice(0, 128).map((value) => overlayPoint(value)),
    ]),
    layers: defaultLayers(PRESETS["construction-grid"].sourceIds, false),
  };
}

function pointedArchData(left: number, right: number, top: number, bottom: number): string {
  const span = right - left;
  const spring = top + (Math.sqrt(3) / 2) * span;
  const apex = (left + right) / 2;
  return `M${round(left)} ${round(bottom)}V${round(spring)}A${round(span)} ${round(span)} 0 0 1 ${round(apex)} ${round(top)}A${round(span)} ${round(span)} 0 0 1 ${round(right)} ${round(spring)}V${round(bottom)}`;
}

function archGeometry(options: NormalizedOptions, document: SvgDocument): DrawnGeometry {
  const inset = Math.min(options.unitSize * 0.5, Math.min(options.width, options.height) * 0.12);
  const availableWidth = options.width - inset * 2;
  const availableHeight = options.height - inset * 2;
  const span = Math.min(availableWidth, (availableHeight * 2) / Math.sqrt(3));
  const left = (options.width - span) / 2;
  const right = left + span;
  const top = inset;
  const bottom = options.height - inset;
  const spring = top + (Math.sqrt(3) / 2) * span;
  const center = point(options.width / 2, top);
  const paths = [pointedArchData(left, right, top, bottom)];
  if (options.simplificationTier !== "compact") {
    const delta = Math.min(options.unitSize * 0.22, span * 0.06);
    paths.push(pointedArchData(left + delta, right - delta, top + delta * Math.sqrt(3), bottom));
  }
  emitStraps(document, paths, options, 0);
  const overlayPrimitives: ConstructionOverlayPrimitive[] = [
    overlaySegment(segment(point(left, spring), point(right, spring))),
    overlayCircle(circle(point(left, spring), span)),
    overlayCircle(circle(point(right, spring), span)),
    overlayPoint(point(left, spring)),
    overlayPoint(point(right, spring)),
    overlayPoint(center),
  ];
  return {
    repeatCell: boundedRepeat("two-center-pointed-arch-field", options.width, options.height),
    overlay: constructionOverlay(overlayPrimitives),
    layers: defaultLayers(PRESETS["pointed-arch"].sourceIds, true),
  };
}

function cornerGeometry(options: NormalizedOptions, document: SvgDocument): DrawnGeometry {
  const radius = Math.min(options.unitSize * 1.15, Math.min(options.width, options.height) * 0.24);
  const star = alternatingStar(point(0, 0), radius, 8, STAR_INNER_RATIO);
  const starData = polygonPath(star);
  const kite = polygon([
    point(0, 0),
    radialPoint(point(0, 0), radius * STAR_INNER_RATIO, 0),
    radialPoint(point(0, 0), radius, Math.PI / 4),
    radialPoint(point(0, 0), radius * STAR_INNER_RATIO, Math.PI / 2),
  ]);
  const transforms = [
    "",
    ` transform="translate(${round(options.width)} 0) scale(-1 1)"`,
    ` transform="translate(0 ${round(options.height)}) scale(1 -1)"`,
    ` transform="translate(${round(options.width)} ${round(options.height)}) scale(-1 -1)"`,
  ];
  if (options.interlace) {
    for (const transform of transforms) {
      document.push(`<path d="${starData}" ${strokeAttributes(options, color(options, 2), options.stroke * 2.6)}${transform}/>`);
    }
  }
  for (const transform of transforms) {
    document.push(`<path d="${starData}" ${strokeAttributes(options)}${transform}/>`);
    document.push(`<polygon points="${polygonPoints(kite)}" fill="${color(options, 1)}" fill-opacity=".16" stroke="${color(options, 0)}" stroke-width="${round(options.stroke)}"${transform}/>`);
  }
  return {
    repeatCell: boundedRepeat("khatam-corner-field", options.width, options.height),
    overlay: constructionOverlay([
      overlayCircle(circle(point(0, 0), radius)),
      overlayPolygon(star),
      overlayPolygon(kite),
    ]),
    layers: defaultLayers(PRESETS["khatam-corners"].sourceIds, true),
  };
}

function frameGeometry(options: NormalizedOptions, document: SvgDocument): DrawnGeometry {
  const module = options.unitSize * (1.25 - options.density * 0.25);
  const radius = module * 0.34;
  const paths: string[] = [];
  const stars: Polygon[] = [];
  for (let x = module / 2; x < options.width; x += module) {
    stars.push(alternatingStar(point(x, radius), radius, 8, STAR_INNER_RATIO));
    stars.push(alternatingStar(point(x, options.height - radius), radius, 8, STAR_INNER_RATIO));
  }
  for (let y = module / 2 + module; y < options.height - module / 2; y += module) {
    stars.push(alternatingStar(point(radius, y), radius, 8, STAR_INNER_RATIO));
    stars.push(alternatingStar(point(options.width - radius, y), radius, 8, STAR_INNER_RATIO));
  }
  for (const star of stars) {
    paths.push(polygonPath(star));
  }
  const chamfer = radius * 1.4;
  const inner = polygon([
    point(chamfer, radius * 2),
    point(options.width - chamfer, radius * 2),
    point(options.width - radius * 2, chamfer),
    point(options.width - radius * 2, options.height - chamfer),
    point(options.width - chamfer, options.height - radius * 2),
    point(chamfer, options.height - radius * 2),
    point(radius * 2, options.height - chamfer),
    point(radius * 2, chamfer),
  ]);
  paths.push(polygonPath(inner));
  emitStraps(document, paths, options, 0);
  return {
    repeatCell: {
      id: "geometric-frame-module",
      width: module,
      height: module,
      vectors: [[module, 0], [0, module]],
      boundary: [point(0, 0), point(module, 0), point(module, module), point(0, module)],
    },
    overlay: constructionOverlay([
      overlayPolygon(stars[0] ?? alternatingStar(point(0, 0), radius, 8, STAR_INNER_RATIO)),
      overlayPolygon(inner),
    ]),
    layers: defaultLayers(PRESETS["geometric-frame"].sourceIds, true),
  };
}

function whirlingSkeleton(center: Point, radius: number): BotanicalMotif {
  const anchors = divideCircle(circle(center, radius * 0.17), 6, -Math.PI / 2);
  const builder = new DeterministicPathBuilder().moveTo(anchors[0]!);
  for (let index = 0; index < 6; index += 1) {
    const angle = -Math.PI / 2 + (index * TAU) / 6;
    const nextAngle = angle + TAU / 6;
    builder.bezierCurveTo(
      radialPoint(center, radius * 0.5, angle + 0.08),
      radialPoint(center, radius * 0.6, nextAngle - 0.31),
      anchors[(index + 1) % 6]!,
    );
  }
  return {
    paths: [{ data: builder.close().toString(), role: "stem", closed: true }],
    referenceCircles: [],
    anchors,
  };
}

function rumiMedallionGeometry(
  options: NormalizedOptions,
  document: SvgDocument,
): DrawnGeometry {
  const center = point(options.width / 2, options.height / 2);
  const radius = Math.min(options.width, options.height) * 0.44;
  emitRoundelBoundary(document, center, radius, options);

  const skeleton = whirlingSkeleton(center, radius);
  emitBotanicalMotif(
    document,
    skeleton,
    options,
    [""],
    0,
    0,
    0,
    "stems-and-tendrils",
    "rumi-continuous-whorl",
  );

  const branch: BotanicalMotif = {
    paths: [
      sScrollPath(
        radialPoint(center, radius * 0.16, -Math.PI / 2),
        radialPoint(center, radius * 0.8, -Math.PI / 3),
        radius * 0.13,
      ),
    ],
    referenceCircles: [],
    anchors: [
      radialPoint(center, radius * 0.16, -Math.PI / 2),
      radialPoint(center, radius * 0.8, -Math.PI / 3),
    ],
  };
  const branches = rotateMotifGroup(branch, 6, center);
  emitBotanicalMotif(
    document,
    branches.motif,
    options,
    branches.transforms,
    0,
    0,
    0,
    "stems-and-tendrils",
    "rumi-whirling-stem",
  );

  const ridingLeaf = withoutLobeGuides(
    splitLeaf(
      point(center.x + radius * 0.24, center.y - radius * 0.39),
      point(center.x + radius * 0.56, center.y - radius * 0.48),
      options.petalDepth * 0.9,
      0.58,
    ),
  );
  const leafWhorl = rotateMotifGroup(ridingLeaf, 6, center);
  emitBotanicalMotif(
    document,
    leafWhorl.motif,
    options,
    leafWhorl.transforms,
    1,
    0,
    0.42,
    "leaves-and-palmettes",
    "rumi-stem-leaf",
  );

  const innerLeaf = almondPetal(
    point(center.x + radius * 0.08, center.y - radius * 0.25),
    point(center.x + radius * 0.28, center.y - radius * 0.46),
    options.petalDepth * 0.8,
  );
  const innerLeafWhorl = rotateMotifGroup(innerLeaf, 6, center);
  emitBotanicalMotif(
    document,
    innerLeafWhorl.motif,
    options,
    innerLeafWhorl.transforms,
    3,
    0,
    0.28,
    "leaves-and-palmettes",
    "rumi-inner-leaf",
  );

  const voidPetal = almondPetal(
    radialPoint(center, radius * 0.018, -Math.PI / 2),
    radialPoint(center, radius * 0.19, -Math.PI / 2),
    Math.min(0.38, options.petalDepth * 1.25),
  );
  const floralVoid = rotateMotifGroup(voidPetal, 6, center);
  emitBotanicalMotif(
    document,
    floralVoid.motif,
    options,
    floralVoid.transforms,
    2,
    1,
    0.98,
    "negative-floral-space",
    "sixfold-floral-void",
  );
  document.push(
    `<circle cx="${round(center.x)}" cy="${round(center.y)}" r="${round(radius * 0.035)}" fill="${color(options, 2)}" stroke="${color(options, 1)}" stroke-width="${round(options.stroke)}" data-layer="negative-floral-space" data-motif="sixfold-floral-void" data-botanical-role="void"/>`,
  );

  const boundary = circle(center, radius);
  const divisions = divideCircle(boundary, 6, -Math.PI / 2);
  return {
    repeatCell: boundedRepeat("rumi-medallion-6-field", options.width, options.height),
    overlay: constructionOverlay([
      overlayCircle(boundary),
      overlayCircle(circle(center, radius * 0.17)),
      overlayCircle(circle(center, radius * 0.5)),
      ...divisions.map((value) => overlaySegment(segment(center, value))),
      ...divisions.map((value) => overlayPoint(value)),
      ...motifOverlay(ridingLeaf),
    ]),
    layers: botanicalLayers(PRESETS["rumi-medallion-6"].sourceIds),
  };
}

function palmetteRoundelGeometry(
  options: NormalizedOptions,
  document: SvgDocument,
): DrawnGeometry {
  const center = point(options.width / 2, options.height / 2);
  const radius = Math.min(options.width, options.height) * 0.44;
  emitRoundelBoundary(document, center, radius, options);

  const ogive: BotanicalPath = {
    data: new DeterministicPathBuilder()
      .moveTo(point(center.x, center.y - radius * 0.86))
      .bezierCurveTo(
        point(center.x - radius * 0.56, center.y - radius * 0.58),
        point(center.x - radius * 0.68, center.y + radius * 0.3),
        point(center.x, center.y + radius * 0.76),
      )
      .bezierCurveTo(
        point(center.x + radius * 0.68, center.y + radius * 0.3),
        point(center.x + radius * 0.56, center.y - radius * 0.58),
        point(center.x, center.y - radius * 0.86),
      )
      .close()
      .toString(),
    role: "outline",
    closed: true,
  };
  emitBotanicalPath(
    document,
    ogive,
    options,
    "",
    2,
    1,
    0.05,
    "bounded-outline",
    "ogival-boundary",
  );

  const tendril: BotanicalMotif = {
    paths: [
      tendrilPath(
        point(center.x - radius * 0.02, center.y + radius * 0.34),
        point(center.x - radius * 0.67, center.y + radius * 0.08),
        -radius * 0.12,
        radius * 0.045,
        false,
      ),
    ],
    referenceCircles: [],
    anchors: [
      point(center.x - radius * 0.02, center.y + radius * 0.34),
      point(center.x - radius * 0.67, center.y + radius * 0.08),
    ],
  };
  const tendrils = mirrorMotifGroup(tendril, center.x);
  emitBotanicalMotif(
    document,
    tendrils.motif,
    options,
    tendrils.transforms,
    0,
    0,
    0,
    "stems-and-tendrils",
    "palmette-tendril",
  );

  const lowerWing = withoutLobeGuides(
    splitLeaf(
      point(center.x - radius * 0.04, center.y + radius * 0.2),
      point(center.x - radius * 0.62, center.y - radius * 0.02),
      options.petalDepth,
      0.58,
    ),
  );
  const lowerWings = mirrorMotifGroup(lowerWing, center.x);
  emitBotanicalMotif(
    document,
    lowerWings.motif,
    options,
    lowerWings.transforms,
    3,
    0,
    0.38,
    "leaves-and-palmettes",
    "palmette-wing",
  );

  const upperWing = withoutLobeGuides(
    splitLeaf(
      point(center.x - radius * 0.03, center.y - radius * 0.08),
      point(center.x - radius * 0.46, center.y - radius * 0.42),
      options.petalDepth * 0.82,
      0.56,
    ),
  );
  const upperWings = mirrorMotifGroup(upperWing, center.x);
  emitBotanicalMotif(
    document,
    upperWings.motif,
    options,
    upperWings.transforms,
    1,
    0,
    0.32,
    "leaves-and-palmettes",
    "palmette-upper-wing",
  );

  const centralPalmette = withoutLobeGuides(
    palmette(
      point(center.x, center.y + radius * 0.34),
      radius * 0.84,
      radius * 0.66,
      options.petalDepth * 0.88,
    ),
  );
  emitBotanicalMotif(
    document,
    centralPalmette,
    options,
    [""],
    1,
    0,
    0.3,
    "leaves-and-palmettes",
    "central-palmette",
  );

  const lowerLotus = lotusBud(
    point(center.x, center.y + radius * 0.38),
    point(center.x, center.y + radius * 0.03),
    radius * 0.13,
  );
  emitBotanicalMotif(
    document,
    lowerLotus,
    options,
    [""],
    3,
    0,
    0.5,
    "buds-and-rosettes",
    "nested-lotus-lower",
  );
  const upperLotus = lotusBud(
    point(center.x, center.y - radius * 0.3),
    point(center.x, center.y - radius * 0.78),
    radius * 0.12,
  );
  emitBotanicalMotif(
    document,
    upperLotus,
    options,
    [""],
    1,
    0,
    0.48,
    "buds-and-rosettes",
    "nested-lotus-upper",
  );

  return {
    repeatCell: boundedRepeat("palmette-roundel-field", options.width, options.height),
    overlay: constructionOverlay([
      overlayCircle(circle(center, radius)),
      overlayCircle(circle(center, radius * 0.66)),
      overlaySegment(
        segment(
          point(center.x, center.y - radius),
          point(center.x, center.y + radius),
        ),
      ),
      overlayPoint(center),
      ...motifOverlay(centralPalmette),
      ...motifOverlay(lowerWing),
      ...motifOverlay(upperWing),
    ]),
    layers: botanicalLayers(PRESETS["palmette-roundel"].sourceIds),
  };
}

function radialBotanicalMotif(
  center: Point,
  count: number,
  innerRadius: number,
  outerRadius: number,
  depth: number,
): BotanicalMotif {
  const petals = Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index * TAU) / count;
    return almondPetal(
      radialPoint(center, innerRadius, angle),
      radialPoint(center, outerRadius, angle),
      depth,
    );
  });
  return {
    paths: petals.flatMap((value) => value.paths),
    referenceCircles: petals.flatMap((value) => value.referenceCircles),
    anchors: petals.flatMap((value) => value.anchors),
  };
}

function radialSplitLeafMotif(
  center: Point,
  count: number,
  innerRadius: number,
  outerRadius: number,
  depth: number,
  rotation = -Math.PI / 2,
): BotanicalMotif {
  const leaves = Array.from({ length: count }, (_, index) => {
    const angle = rotation + (index * TAU) / count;
    return withoutLobeGuides(
      splitLeaf(
        radialPoint(center, innerRadius, angle),
        radialPoint(center, outerRadius, angle),
        depth,
        0.58,
      ),
    );
  });
  return {
    paths: leaves.flatMap((value) => value.paths),
    referenceCircles: leaves.flatMap((value) => value.referenceCircles),
    anchors: leaves.flatMap((value) => value.anchors),
  };
}

function fieldConnector(center: Point, radius: number, angle: number): Polygon {
  return polygon([
    radialPoint(center, radius * 0.48, angle - Math.PI / 16),
    radialPoint(center, radius * 0.72, angle - Math.PI / 24),
    radialPoint(center, radius, angle),
    radialPoint(center, radius * 0.72, angle + Math.PI / 24),
    radialPoint(center, radius * 0.48, angle + Math.PI / 16),
  ]);
}

function floralGeometricFieldGeometry(
  options: NormalizedOptions,
  document: SvgDocument,
): DrawnGeometry {
  const order = options.symmetry === 12 ? 12 : 8;
  const cell =
    options.unitSize *
    (2.15 - options.density * 0.35) *
    (order === 12 ? 1.18 : 1);
  document.push(
    `<rect width="${round(options.width)}" height="${round(options.height)}" fill="${color(options, 2)}" fill-opacity=".18" data-layer="repeat-field" data-motif="floral-field-ground" data-botanical-role="field"/>`,
  );

  let complete = true;
  cells:
  for (let y = cell / 2; y < options.height + cell / 2; y += cell) {
    for (let x = cell / 2; x < options.width + cell / 2; x += cell) {
      const center = point(x, y);
      const innerRosette = radialBotanicalMotif(
        center,
        order,
        cell * 0.025,
        cell * 0.17,
        Math.min(0.32, options.petalDepth * 1.15),
      );
      if (
        !emitBotanicalMotif(
          document,
          innerRosette,
          options,
          [""],
          3,
          0,
          0.44,
          "buds-and-rosettes",
          "field-central-rosette",
        )
      ) {
        complete = false;
        break cells;
      }
      const leafRing = radialSplitLeafMotif(
        center,
        order,
        cell * 0.19,
        cell * 0.36,
        options.petalDepth * 0.72,
        -Math.PI / 2 + Math.PI / order,
      );
      if (
        !emitBotanicalMotif(
          document,
          leafRing,
          options,
          [""],
          1,
          0,
          0.3,
          "leaves-and-palmettes",
          "field-split-leaf-ring",
        )
      ) {
        complete = false;
        break cells;
      }
      for (let index = 0; index < order; index += 1) {
        const connector = fieldConnector(
          center,
          cell * 0.45,
          -Math.PI / 2 + ((index + 0.5) * TAU) / order,
        );
        if (
          !emitBotanicalPolygon(
            document,
            connector,
            options,
            "geometric-connectors",
            "field-kite-connector",
            3,
            0.18,
            1,
          )
        ) {
          complete = false;
          break cells;
        }
      }
    }
  }

  if (complete) {
    nodes:
    for (let y = 0; y <= options.height; y += cell) {
      for (let x = 0; x <= options.width; x += cell) {
        const node = radialBotanicalMotif(
          point(x, y),
          order === 12 ? 6 : 4,
          cell * 0.012,
          cell * 0.085,
          Math.min(0.34, options.petalDepth * 1.25),
        );
        if (
          !emitBotanicalMotif(
            document,
            node,
            options,
            [""],
            3,
            0,
            0.42,
            "buds-and-rosettes",
            "field-rosette-node",
          )
        ) {
          break nodes;
        }
      }
    }
  }

  if (complete) {
    edgeNodes:
    for (let y = 0; y <= options.height; y += cell) {
      for (let x = cell / 2; x < options.width + cell / 2; x += cell) {
        const node = radialBotanicalMotif(
          point(x, y),
          order === 12 ? 6 : 4,
          cell * 0.01,
          cell * 0.065,
          options.petalDepth,
        );
        if (
          !emitBotanicalMotif(
            document,
            node,
            options,
            [""],
            1,
            0,
            0.34,
            "buds-and-rosettes",
            "field-edge-rosette",
          )
        ) {
          break edgeNodes;
        }
      }
    }
  }
  if (complete) {
    edgeNodes:
    for (let y = cell / 2; y < options.height + cell / 2; y += cell) {
      for (let x = 0; x <= options.width; x += cell) {
        const node = radialBotanicalMotif(
          point(x, y),
          order === 12 ? 6 : 4,
          cell * 0.01,
          cell * 0.065,
          options.petalDepth,
        );
        if (
          !emitBotanicalMotif(
            document,
            node,
            options,
            [""],
            1,
            0,
            0.34,
            "buds-and-rosettes",
            "field-edge-rosette",
          )
        ) {
          break edgeNodes;
        }
      }
    }
  }

  const exemplarCenter = point(cell / 2, cell / 2);
  const exemplarCircle = circle(exemplarCenter, cell * 0.4);
  const exemplarDivisions = divideCircle(exemplarCircle, order, -Math.PI / 2);
  const exemplarConnector = fieldConnector(exemplarCenter, cell * 0.49, 0);
  return {
    repeatCell: squareRepeat("floral-geometric-field-cell", cell),
    overlay: constructionOverlay([
      overlayPolygon(
        polygon([
          point(0, 0),
          point(cell, 0),
          point(cell, cell),
          point(0, cell),
        ]),
      ),
      overlayCircle(exemplarCircle),
      ...exemplarDivisions.map((value) =>
        overlaySegment(segment(exemplarCenter, value)),
      ),
      ...exemplarDivisions.map((value) => overlayPoint(value)),
      overlayPolygon(exemplarConnector),
    ]),
    layers: botanicalLayers(
      PRESETS["floral-geometric-field"].sourceIds,
      true,
    ),
  };
}

const CONSTRUCTIONS: Record<ConstructionId, DrawConstruction> = {
  "orthogonal-grid-v2": gridGeometry,
  "radial-grid-v2": gridGeometry,
  "khatam-8-v2": khatamGeometry,
  "rosette-12-v2": rosetteGeometry,
  "medallion-16-v2": medallionGeometry,
  "girih-10-v2": girihGeometry,
  "zellige-star-cross-v2": zelligeGeometry,
  "jali-8-v2": jaliGeometry,
  "pointed-arch-v2": archGeometry,
  "khatam-corners-v2": cornerGeometry,
  "geometric-frame-v2": frameGeometry,
  "rumi-medallion-6-v2": rumiMedallionGeometry,
  "palmette-roundel-v2": palmetteRoundelGeometry,
  "floral-geometric-field-v2": floralGeometricFieldGeometry,
};

function emitConstructionOverlay(
  document: SvgDocument,
  overlay: ConstructionOverlay,
  options: NormalizedOptions,
): void {
  if (options.constructionOverlay === "none") {
    return;
  }
  for (const primitive of overlay.primitives) {
    if (options.constructionOverlay === "guides" && primitive.role === "result") {
      continue;
    }
    const common = `stroke="${color(options, primitive.role === "result" ? 1 : 3)}" stroke-width="${round(options.stroke * 0.55)}" fill="none" opacity="${primitive.role === "guide" ? ".28" : ".48"}" stroke-dasharray="${primitive.role === "guide" ? "3 3" : "none"}" vector-effect="non-scaling-stroke" data-construction-role="${primitive.role}"`;
    if (primitive.kind === "point") {
      document.push(`<circle cx="${round(primitive.geometry.x)}" cy="${round(primitive.geometry.y)}" r="${round(options.stroke * 0.85)}" fill="${color(options, 3)}" opacity=".55" data-construction-role="${primitive.role}"/>`);
    } else if (primitive.kind === "circle") {
      document.push(`<circle cx="${round(primitive.geometry.center.x)}" cy="${round(primitive.geometry.center.y)}" r="${round(primitive.geometry.radius)}" ${common}/>`);
    } else if (primitive.kind === "segment") {
      document.push(`<path d="M${round(primitive.geometry.start.x)} ${round(primitive.geometry.start.y)}L${round(primitive.geometry.end.x)} ${round(primitive.geometry.end.y)}" ${common}/>`);
    } else {
      document.push(`<polygon points="${polygonPoints(primitive.geometry)}" ${common}/>`);
    }
  }
}

function createRecipe(
  presetId: PatternPresetId,
  constructionId: ConstructionId,
  options: NormalizedOptions,
  geometry: DrawnGeometry,
): PatternRecipe {
  const preset = PRESETS[presetId];
  const botanical =
    presetId === "rumi-medallion-6" ||
    presetId === "palmette-roundel" ||
    presetId === "floral-geometric-field";
  return {
    version: 2,
    kind: preset.kind,
    presetId,
    construction: { id: constructionId, version: 2 },
    repeatCell: geometry.repeatCell,
    sourceIds: [...preset.sourceIds],
    layers: geometry.layers,
    topology: {
      ...preset.topology,
      ...(presetId === "floral-geometric-field"
        ? { rotationOrder: options.symmetry }
        : {}),
    },
    review: {
      geometry: "verified",
      cultural: botanical ? "expert-review-pending" : "research-draft",
      limitations: [
        "Independent contemporary vector construction; not an authenticated reconstruction of a specific object.",
        ...(presetId === "girih-10-straps"
          ? ["Girih scholarship is contested; this output makes no quasiperiodic or workshop-method claim."]
          : []),
        ...(botanical
          ? [
              "The Pinterest board served only as a visual brief; no board image was copied, sampled, or traced.",
              "Botanical terminology, cultural context, and any regional attribution remain pending specialist review.",
            ]
          : []),
      ],
    },
    simplificationTier: options.simplificationTier,
    options,
  };
}

function estimateOverlayNodeCount(
  overlay: ConstructionOverlay,
  mode: NormalizedOptions["constructionOverlay"],
): number {
  if (mode === "none") {
    return 0;
  }
  return overlay.primitives.reduce((count, primitive) => {
    if (mode === "guides" && primitive.role === "result") {
      return count;
    }
    return count + 1;
  }, 0);
}

function buildPreset(
  presetId: PatternPresetId,
  input: PatternPresetOptions = {},
  constructionId: ConstructionId = PRESETS[presetId].constructionId,
): PatternResult {
  // Regional profile fills unspecified fields before preset defaults so cadence
  // overrides apply; explicit caller options still win via optionsForPreset merge.
  const options = normalizeOptions(optionsForPreset(presetId, applyRegionalProfile(input)));
  const reserve =
    options.constructionOverlay === "none"
      ? 0
      : estimateOverlayNodeCount(
          CONSTRUCTIONS[constructionId](
            { ...options, maxNodes: 0 },
            createSvgDocument({ ...options, maxNodes: 0 }, constructionId),
          ).overlay,
          options.constructionOverlay,
        );
  const drawLimit =
    reserve === 0 ? options.maxNodes : Math.max(0, options.maxNodes - reserve);
  const document = createSvgDocument(options, constructionId, drawLimit);
  const geometry = CONSTRUCTIONS[constructionId](options, document);
  document.allowOverlay();
  emitConstructionOverlay(document, geometry.overlay, options);
  const output = document.finish();
  return {
    ...output,
    recipe: createRecipe(presetId, constructionId, options, geometry),
    constructionOverlay: geometry.overlay,
  };
}

export function generatePreset<Id extends PatternPresetId>(
  presetId: Id,
  options: PatternPresetOptions<Id> = {},
): PatternResult {
  return buildPreset(presetId, options as PatternPresetOptions);
}

export const generateGrid = (options: PatternOptions = {}): PatternResult =>
  buildPreset("construction-grid", options);
export const generateStar = (options: PatternOptions = {}): PatternResult =>
  options.symmetry === 16
    ? buildPreset("medallion-16-nested", options)
    : options.symmetry === 8
      ? buildPreset("khatam-8-star-cross", options)
      : buildPreset("rosette-12-almond", options);
export const generateRosette = (options: PatternOptions = {}): PatternResult =>
  buildPreset("rosette-12-almond", options);
export const generateGirih = (options: PatternOptions = {}): PatternResult =>
  buildPreset("girih-10-straps", options);
export const generateZellige = (options: PatternOptions = {}): PatternResult =>
  buildPreset("zellige-star-cross", options);
export const generateScreen = (options: PatternOptions = {}): PatternResult =>
  buildPreset("jali-8-screen", options);
export const generateArch = (options: PatternOptions = {}): PatternResult =>
  buildPreset("pointed-arch", options);
export const generateCorners = (options: PatternOptions = {}): PatternResult =>
  buildPreset("khatam-corners", options);
export const generateFrame = (options: PatternOptions = {}): PatternResult =>
  buildPreset("geometric-frame", options);

const BOTANICAL_PRESET_IDS: readonly BotanicalPatternPresetId[] = [
  "rumi-medallion-6",
  "palmette-roundel",
  "floral-geometric-field",
];

function botanicalPreset(options: PatternOptions): BotanicalPatternPresetId {
  return options.presetId &&
    BOTANICAL_PRESET_IDS.includes(options.presetId)
    ? options.presetId
    : "rumi-medallion-6";
}

export const generateArabesque = (options: PatternOptions = {}): PatternResult =>
  buildPreset(botanicalPreset(options), options);

const DEFAULT_PRESET_BY_KIND: Record<PatternKind, PatternPresetId> = {
  grid: "construction-grid",
  star: "khatam-8-star-cross",
  rosette: "rosette-12-almond",
  girih: "girih-10-straps",
  zellige: "zellige-star-cross",
  screen: "jali-8-screen",
  arch: "pointed-arch",
  corners: "khatam-corners",
  frame: "geometric-frame",
  arabesque: "rumi-medallion-6",
};

export function generatePattern(kind: PatternKind, options: PatternOptions = {}): PatternResult {
  if (kind === "star" && options.symmetry === 16) {
    return buildPreset("medallion-16-nested", options);
  }
  if (kind === "arabesque") {
    return buildPreset(botanicalPreset(options), options);
  }
  return buildPreset(DEFAULT_PRESET_BY_KIND[kind], options);
}

/** Internal recipe entry point: construction ID is authoritative for v2 replay. */
export function generateConstructionRecipe(
  presetId: PatternPresetId,
  constructionId: ConstructionId,
  options: PatternOptions,
): PatternResult {
  return buildPreset(presetId, options, constructionId);
}

// Retained only for downstream source compatibility with callers that imported
// the old helper indirectly; new construction code uses validated polygons.
export const points = legacyPoints;

/** Explicit decorative primitive — not a construction recipe. */
export const decorativeStar = alternatingStar;
