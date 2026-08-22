import {
  polygonArea as d3PolygonArea,
  polygonCentroid as d3PolygonCentroid,
} from "d3-polygon";
import { lineLineIntersection } from "./intersections.js";
import { offsetSegment } from "./transforms.js";
import {
  GEOMETRY_EPSILON,
  type Circle,
  type Point,
  type Polygon,
  lineThrough,
  point,
  polygon,
  segment,
} from "./types.js";

function tuples(value: Polygon): [number, number][] {
  return value.vertices.map((vertex) => [vertex.x, vertex.y]);
}

function cross(first: Point, middle: Point, last: Point): number {
  return (
    (middle.x - first.x) * (last.y - middle.y) -
    (middle.y - first.y) * (last.x - middle.x)
  );
}

function greatestCommonDivisor(first: number, second: number): number {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** Divides a circle into equal angular points, counter-clockwise. */
export function divideCircle(
  value: Circle,
  count: number,
  startAngle = -Math.PI / 2,
): readonly Point[] {
  if (!Number.isInteger(count) || count < 3) {
    throw new RangeError("count must be an integer of at least three");
  }
  if (!Number.isFinite(startAngle)) {
    throw new RangeError("startAngle must be finite");
  }
  return Array.from({ length: count }, (_, index) => {
    const angle = startAngle + (index * Math.PI * 2) / count;
    return point(
      value.center.x + Math.cos(angle) * value.radius,
      value.center.y + Math.sin(angle) * value.radius,
    );
  });
}

/** Returns the vertices of a regular polygon. */
export function regularPolygonVertices(
  value: Circle,
  sides: number,
  startAngle = -Math.PI / 2,
): readonly Point[] {
  return divideCircle(value, sides, startAngle);
}

/** Creates a regular polygon from a circumcircle. */
export function regularPolygon(
  value: Circle,
  sides: number,
  startAngle = -Math.PI / 2,
): Polygon {
  return polygon(regularPolygonVertices(value, sides, startAngle));
}

/**
 * Orders regular vertices as one star-polygon circuit.
 * `step` must be coprime with `sides`; compound stars are intentionally rejected.
 */
export function starStepVertices(
  value: Circle,
  sides: number,
  step: number,
  startAngle = -Math.PI / 2,
): readonly Point[] {
  if (!Number.isInteger(step) || step < 2 || step >= sides) {
    throw new RangeError("step must be an integer from two through sides minus one");
  }
  if (greatestCommonDivisor(sides, step) !== 1) {
    throw new RangeError("step and sides must be coprime to form one circuit");
  }
  const vertices = regularPolygonVertices(value, sides, startAngle);
  const ordered: Point[] = [];
  let index = 0;
  for (let visited = 0; visited < sides; visited += 1) {
    ordered.push(vertices[index]!);
    index = (index + step) % sides;
  }
  return ordered;
}

/** Returns the unsigned area calculated by d3-polygon. */
export function polygonArea(value: Polygon): number {
  return Math.abs(d3PolygonArea(tuples(value)));
}

/** Returns Cartesian winding, independent of screen-coordinate conventions. */
export function polygonWinding(
  value: Polygon,
  epsilon = GEOMETRY_EPSILON,
): "clockwise" | "counterclockwise" | "degenerate" {
  const signedD3Area = d3PolygonArea(tuples(value));
  if (Math.abs(signedD3Area) <= epsilon) {
    return "degenerate";
  }
  return signedD3Area < 0 ? "counterclockwise" : "clockwise";
}

/** Returns the area-weighted centroid calculated by d3-polygon. */
export function polygonCentroid(value: Polygon, epsilon = GEOMETRY_EPSILON): Point {
  if (polygonArea(value) <= epsilon) {
    throw new RangeError("a degenerate polygon has no stable area centroid");
  }
  const [x, y] = d3PolygonCentroid(tuples(value));
  return point(x, y);
}

export interface PolygonValidation {
  readonly valid: boolean;
  readonly issues: readonly string[];
}

/** Validates finite vertices, distinct edges, and non-zero d3-polygon area. */
export function validatePolygon(
  value: Polygon,
  epsilon = GEOMETRY_EPSILON,
): PolygonValidation {
  const issues: string[] = [];
  if (value.vertices.length < 3) {
    issues.push("fewer-than-three-vertices");
  }
  if (value.vertices.some((vertex) => !Number.isFinite(vertex.x) || !Number.isFinite(vertex.y))) {
    issues.push("non-finite-vertex");
  }

  const unique = new Set(
    value.vertices.map(
      (vertex) => `${Math.round(vertex.x / epsilon)}:${Math.round(vertex.y / epsilon)}`,
    ),
  );
  if (unique.size < 3) {
    issues.push("fewer-than-three-distinct-vertices");
  }

  for (let index = 0; index < value.vertices.length; index += 1) {
    const current = value.vertices[index]!;
    const next = value.vertices[(index + 1) % value.vertices.length]!;
    if (Math.hypot(next.x - current.x, next.y - current.y) <= epsilon) {
      issues.push("zero-length-edge");
      break;
    }
  }
  if (value.vertices.length >= 3 && polygonArea(value) <= epsilon) {
    issues.push("degenerate-area");
  }
  return { valid: issues.length === 0, issues };
}

/** Reports whether all non-collinear turns have the same orientation. */
export function isConvexPolygon(value: Polygon, epsilon = GEOMETRY_EPSILON): boolean {
  let sign = 0;
  for (let index = 0; index < value.vertices.length; index += 1) {
    const turn = cross(
      value.vertices[index]!,
      value.vertices[(index + 1) % value.vertices.length]!,
      value.vertices[(index + 2) % value.vertices.length]!,
    );
    if (Math.abs(turn) <= epsilon) {
      continue;
    }
    const currentSign = Math.sign(turn);
    if (sign !== 0 && currentSign !== sign) {
      return false;
    }
    sign = currentSign;
  }
  return sign !== 0;
}

/**
 * Insets a convex polygon by an exact edge-normal distance.
 * Returns `null` for concave, degenerate, or collapsed results.
 */
export function insetConvexPolygon(
  value: Polygon,
  distance: number,
  epsilon = GEOMETRY_EPSILON,
): Polygon | null {
  if (!Number.isFinite(distance) || distance < 0) {
    throw new RangeError("distance must be finite and non-negative");
  }
  if (distance <= epsilon) {
    return polygon(value.vertices);
  }
  const winding = polygonWinding(value, epsilon);
  if (winding === "degenerate" || !isConvexPolygon(value, epsilon)) {
    return null;
  }

  const inwardDistance = winding === "counterclockwise" ? distance : -distance;
  const shifted = value.vertices.map((start, index) =>
    offsetSegment(
      segment(start, value.vertices[(index + 1) % value.vertices.length]!),
      inwardDistance,
    ),
  );
  const vertices = shifted.map((current, index) =>
    lineLineIntersection(
      lineThrough(shifted[(index + shifted.length - 1) % shifted.length]!.start,
        shifted[(index + shifted.length - 1) % shifted.length]!.end),
      lineThrough(current.start, current.end),
      epsilon,
    ),
  );
  if (vertices.some((vertex) => vertex === null)) {
    return null;
  }

  const result = polygon(vertices as Point[]);
  if (polygonWinding(result, epsilon) !== winding) {
    return null;
  }

  const interiorSign = winding === "counterclockwise" ? 1 : -1;
  const satisfiesEveryInsetHalfPlane = result.vertices.every((candidate) =>
    value.vertices.every((start, index) => {
      const end = value.vertices[(index + 1) % value.vertices.length]!;
      const edgeX = end.x - start.x;
      const edgeY = end.y - start.y;
      const side = interiorSign * (edgeX * (candidate.y - start.y) - edgeY * (candidate.x - start.x));
      return side >= distance * Math.hypot(edgeX, edgeY) - epsilon;
    }),
  );
  return satisfiesEveryInsetHalfPlane ? result : null;
}
