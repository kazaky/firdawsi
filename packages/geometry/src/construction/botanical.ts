import { DeterministicPathBuilder } from "./path.js";
import { circle, point, type Circle, type Point } from "./types.js";

const TAU = Math.PI * 2;

export type BotanicalPathRole =
  | "outline"
  | "vein"
  | "stem"
  | "lobe"
  | "connector";

export interface BotanicalPath {
  readonly data: string;
  readonly role: BotanicalPathRole;
  readonly closed: boolean;
}

export interface BotanicalMotif {
  readonly paths: readonly BotanicalPath[];
  readonly referenceCircles: readonly Circle[];
  readonly anchors: readonly Point[];
}

export interface BotanicalMotifGroup {
  readonly motif: BotanicalMotif;
  readonly transforms: readonly string[];
}

function finitePositive(value: number, name: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be finite and greater than zero`);
  }
  return value;
}

function clampDepth(value: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError("depth must be finite");
  }
  return Math.min(0.48, Math.max(0.04, value));
}

function path(
  data: string,
  role: BotanicalPathRole,
  closed = false,
): BotanicalPath {
  return { data, role, closed };
}

function vector(start: Point, end: Point): {
  readonly length: number;
  readonly tangent: Point;
  readonly normal: Point;
} {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  finitePositive(length, "motif length");
  return {
    length,
    tangent: point(dx / length, dy / length),
    normal: point(-dy / length, dx / length),
  };
}

function add(value: Point, tangent: Point, along: number, normal: Point, across: number): Point {
  return point(
    value.x + tangent.x * along + normal.x * across,
    value.y + tangent.y * along + normal.y * across,
  );
}

function minorArc(
  builder: DeterministicPathBuilder,
  guide: Circle,
  start: Point,
  end: Point,
): void {
  const startAngle = Math.atan2(start.y - guide.center.y, start.x - guide.center.x);
  const endAngle = Math.atan2(end.y - guide.center.y, end.x - guide.center.x);
  const signedDelta = ((endAngle - startAngle + Math.PI * 3) % TAU) - Math.PI;
  builder.arc(guide.center, guide.radius, startAngle, endAngle, signedDelta < 0);
}

/**
 * Constructs a vesica/almond petal as two exact minor arcs. The two reference
 * circles share the supplied base and tip; `depth` is the half-width as a
 * proportion of the base-to-tip distance.
 */
export function almondPetal(base: Point, tip: Point, depth = 0.22): BotanicalMotif {
  const frame = vector(base, tip);
  const halfWidth = frame.length * clampDepth(depth);
  const radius =
    (frame.length * frame.length) / (8 * halfWidth) + halfWidth / 2;
  const middle = add(base, frame.tangent, frame.length / 2, frame.normal, 0);
  const centerOffset = radius - halfWidth;
  const firstGuide = circle(
    add(middle, frame.tangent, 0, frame.normal, -centerOffset),
    radius,
  );
  const secondGuide = circle(
    add(middle, frame.tangent, 0, frame.normal, centerOffset),
    radius,
  );
  const builder = new DeterministicPathBuilder()
    .moveTo(base);
  minorArc(builder, firstGuide, base, tip);
  minorArc(builder, secondGuide, tip, base);
  builder.close();
  return {
    paths: [path(builder.toString(), "outline", true)],
    referenceCircles: [firstGuide, secondGuide],
    anchors: [base, tip],
  };
}

/**
 * Adds a center vein and paired lobe divisions to a circle-derived almond.
 */
export function splitLeaf(
  base: Point,
  tip: Point,
  depth = 0.24,
  split = 0.58,
): BotanicalMotif {
  const outer = almondPetal(base, tip, depth);
  const frame = vector(base, tip);
  const division = Math.min(0.82, Math.max(0.3, split));
  const shoulder = frame.length * clampDepth(depth) * 0.68;
  const join = add(base, frame.tangent, frame.length * division, frame.normal, 0);
  const leftControl = add(
    base,
    frame.tangent,
    frame.length * 0.38,
    frame.normal,
    shoulder,
  );
  const rightControl = add(
    base,
    frame.tangent,
    frame.length * 0.38,
    frame.normal,
    -shoulder,
  );
  const vein = new DeterministicPathBuilder().moveTo(base).lineTo(tip).toString();
  const lobes = new DeterministicPathBuilder()
    .moveTo(base)
    .quadraticCurveTo(leftControl, join)
    .moveTo(base)
    .quadraticCurveTo(rightControl, join)
    .toString();
  return {
    paths: [
      ...outer.paths,
      path(vein, "vein"),
      path(lobes, "lobe"),
    ],
    referenceCircles: outer.referenceCircles,
    anchors: [base, join, tip],
  };
}

/**
 * Builds a symmetric tiered palmette around a vertical construction axis.
 */
export function palmette(
  base: Point,
  height: number,
  width: number,
  depth = 0.2,
): BotanicalMotif {
  finitePositive(height, "height");
  finitePositive(width, "width");
  const tip = point(base.x, base.y - height);
  const central = splitLeaf(
    point(base.x, base.y - height * 0.18),
    tip,
    Math.min(0.32, depth),
    0.62,
  );
  const left = splitLeaf(
    point(base.x, base.y - height * 0.12),
    point(base.x - width * 0.5, base.y - height * 0.62),
    Math.min(0.34, depth * 1.2),
    0.55,
  );
  const right = splitLeaf(
    point(base.x, base.y - height * 0.12),
    point(base.x + width * 0.5, base.y - height * 0.62),
    Math.min(0.34, depth * 1.2),
    0.55,
  );
  const lowerLeft = almondPetal(
    base,
    point(base.x - width * 0.46, base.y - height * 0.34),
    Math.min(0.3, depth * 1.15),
  );
  const lowerRight = almondPetal(
    base,
    point(base.x + width * 0.46, base.y - height * 0.34),
    Math.min(0.3, depth * 1.15),
  );
  return {
    paths: [
      ...central.paths,
      ...left.paths,
      ...right.paths,
      ...lowerLeft.paths,
      ...lowerRight.paths,
    ],
    referenceCircles: [
      ...central.referenceCircles,
      ...left.referenceCircles,
      ...right.referenceCircles,
      ...lowerLeft.referenceCircles,
      ...lowerRight.referenceCircles,
    ],
    anchors: [base, tip, ...left.anchors.slice(1), ...right.anchors.slice(1)],
  };
}

/** Constructs a pointed three-lobed lotus bud with a central seam. */
export function lotusBud(base: Point, tip: Point, width: number): BotanicalMotif {
  const frame = vector(base, tip);
  finitePositive(width, "width");
  const shoulderDistance = Math.min(width, frame.length * 0.45);
  const left = add(
    base,
    frame.tangent,
    frame.length * 0.56,
    frame.normal,
    shoulderDistance,
  );
  const right = add(
    base,
    frame.tangent,
    frame.length * 0.56,
    frame.normal,
    -shoulderDistance,
  );
  const outline = new DeterministicPathBuilder()
    .moveTo(base)
    .bezierCurveTo(
      add(base, frame.tangent, frame.length * 0.2, frame.normal, shoulderDistance * 0.5),
      add(base, frame.tangent, frame.length * 0.42, frame.normal, shoulderDistance),
      left,
    )
    .bezierCurveTo(
      add(base, frame.tangent, frame.length * 0.74, frame.normal, shoulderDistance * 0.92),
      add(base, frame.tangent, frame.length * 0.82, frame.normal, shoulderDistance * 0.28),
      tip,
    )
    .bezierCurveTo(
      add(base, frame.tangent, frame.length * 0.82, frame.normal, -shoulderDistance * 0.28),
      add(base, frame.tangent, frame.length * 0.74, frame.normal, -shoulderDistance * 0.92),
      right,
    )
    .bezierCurveTo(
      add(base, frame.tangent, frame.length * 0.42, frame.normal, -shoulderDistance),
      add(base, frame.tangent, frame.length * 0.2, frame.normal, -shoulderDistance * 0.5),
      base,
    )
    .close()
    .toString();
  const seam = new DeterministicPathBuilder()
    .moveTo(base)
    .quadraticCurveTo(
      add(base, frame.tangent, frame.length * 0.52, frame.normal, 0),
      tip,
    )
    .toString();
  return {
    paths: [path(outline, "outline", true), path(seam, "vein")],
    referenceCircles: [],
    anchors: [base, left, tip, right],
  };
}

/** Builds a deterministic cubic S-scroll between two construction anchors. */
export function sScrollPath(start: Point, end: Point, bend: number): BotanicalPath {
  const frame = vector(start, end);
  if (!Number.isFinite(bend)) {
    throw new RangeError("bend must be finite");
  }
  const firstControl = add(
    start,
    frame.tangent,
    frame.length / 3,
    frame.normal,
    bend,
  );
  const secondControl = add(
    start,
    frame.tangent,
    (frame.length * 2) / 3,
    frame.normal,
    -bend,
  );
  return path(
    new DeterministicPathBuilder()
      .moveTo(start)
      .bezierCurveTo(firstControl, secondControl, end)
      .toString(),
    "stem",
  );
}

/**
 * Builds an S-scroll terminating in a circular hook. The hook radius and bend
 * are explicit construction values; no sampled or sinusoidal lane is used.
 */
export function tendrilPath(
  start: Point,
  end: Point,
  bend: number,
  hookRadius: number,
  clockwise = true,
): BotanicalPath {
  finitePositive(hookRadius, "hookRadius");
  const frame = vector(start, end);
  const approach = add(end, frame.tangent, -hookRadius, frame.normal, 0);
  const scroll = sScrollPath(start, approach, bend);
  const center = add(end, frame.tangent, -hookRadius, frame.normal, clockwise ? -hookRadius : hookRadius);
  const startAngle = Math.atan2(
    approach.y - center.y,
    approach.x - center.x,
  );
  const endAngle =
    startAngle + (clockwise ? Math.PI * 1.5 : -Math.PI * 1.5);
  const hook = new DeterministicPathBuilder()
    .moveTo(approach)
    .arc(center, hookRadius, startAngle, endAngle, !clockwise)
    .toString();
  return path(`${scroll.data}${hook}`, "stem");
}

/** Returns SVG transforms for a motif and its reflection around a vertical axis. */
export function mirrorMotifGroup(
  motif: BotanicalMotif,
  axisX = 0,
): BotanicalMotifGroup {
  if (!Number.isFinite(axisX)) {
    throw new RangeError("axisX must be finite");
  }
  return {
    motif,
    transforms: ["", `translate(${axisX * 2} 0) scale(-1 1)`],
  };
}

/** Returns exact equal-angle SVG transforms for a repeated motif group. */
export function rotateMotifGroup(
  motif: BotanicalMotif,
  count: number,
  center: Point = point(0, 0),
  startAngle = 0,
): BotanicalMotifGroup {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("count must be a positive integer");
  }
  if (!Number.isFinite(startAngle)) {
    throw new RangeError("startAngle must be finite");
  }
  return {
    motif,
    transforms: Array.from({ length: count }, (_, index) => {
      const degrees = ((startAngle + (index * TAU) / count) * 180) / Math.PI;
      return `rotate(${Number(degrees.toFixed(6))} ${Number(center.x.toFixed(6))} ${Number(center.y.toFixed(6))})`;
    }),
  };
}
