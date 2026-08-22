/** Default tolerance for geometric predicates. */
export const GEOMETRY_EPSILON = 1e-9;

/** A finite Cartesian coordinate. Coordinates are unit-agnostic. */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/** An infinite line represented by one point and a non-zero direction. */
export interface Line {
  readonly point: Point;
  readonly direction: Point;
}

/** A circle with a finite center and a strictly positive radius. */
export interface Circle {
  readonly center: Point;
  readonly radius: number;
}

/** A finite line segment. */
export interface Segment {
  readonly start: Point;
  readonly end: Point;
}

/** A simple vertex list; the closing vertex is implicit. */
export interface Polygon {
  readonly vertices: readonly Point[];
}

/** A half-line represented by an origin and a non-zero direction. */
export interface Ray {
  readonly origin: Point;
  readonly direction: Point;
}

/** Axis-aligned construction bounds. */
export interface Bounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

function finite(value: number, name: string): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite`);
  }
  return value;
}

function nonZeroDirection(direction: Point): Point {
  if (Math.hypot(direction.x, direction.y) <= GEOMETRY_EPSILON) {
    throw new RangeError("direction must be non-zero");
  }
  return direction;
}

/** Creates a validated point. */
export function point(x: number, y: number): Point {
  return { x: finite(x, "x"), y: finite(y, "y") };
}

/** Creates a validated infinite line. */
export function line(anchor: Point, direction: Point): Line {
  return { point: point(anchor.x, anchor.y), direction: nonZeroDirection(point(direction.x, direction.y)) };
}

/** Creates the infinite line through two distinct points. */
export function lineThrough(first: Point, second: Point): Line {
  return line(first, point(second.x - first.x, second.y - first.y));
}

/** Creates a validated circle. */
export function circle(center: Point, radius: number): Circle {
  finite(radius, "radius");
  if (radius <= 0) {
    throw new RangeError("radius must be greater than zero");
  }
  return { center: point(center.x, center.y), radius };
}

/** Creates a validated segment. */
export function segment(start: Point, end: Point): Segment {
  return { start: point(start.x, start.y), end: point(end.x, end.y) };
}

/** Creates a polygon with at least three finite vertices. */
export function polygon(vertices: readonly Point[]): Polygon {
  if (vertices.length < 3) {
    throw new RangeError("a polygon requires at least three vertices");
  }
  return { vertices: vertices.map((vertex) => point(vertex.x, vertex.y)) };
}

/** Creates a validated ray. */
export function ray(origin: Point, direction: Point): Ray {
  return { origin: point(origin.x, origin.y), direction: nonZeroDirection(point(direction.x, direction.y)) };
}

/** Creates and validates axis-aligned bounds. */
export function bounds(minX: number, minY: number, maxX: number, maxY: number): Bounds {
  finite(minX, "minX");
  finite(minY, "minY");
  finite(maxX, "maxX");
  finite(maxY, "maxY");
  if (maxX <= minX || maxY <= minY) {
    throw new RangeError("bounds must have positive width and height");
  }
  return { minX, minY, maxX, maxY };
}
