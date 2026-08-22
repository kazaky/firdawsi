import {
  GEOMETRY_EPSILON,
  type Line,
  type Point,
  type Polygon,
  type Ray,
  type Segment,
  point,
  polygon,
  ray,
  segment,
} from "./types.js";

/** Returns the point halfway between two points. */
export function midpoint(first: Point, second: Point): Point {
  return point((first.x + second.x) / 2, (first.y + second.y) / 2);
}

/** Rotates a point counter-clockwise in Cartesian coordinates. */
export function rotatePoint(value: Point, angle: number, center: Point = point(0, 0)): Point {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const x = value.x - center.x;
  const y = value.y - center.y;
  return point(center.x + x * cosine - y * sine, center.y + x * sine + y * cosine);
}

/** Reflects a point over an infinite line. */
export function reflectPoint(value: Point, axis: Line): Point {
  const dx = axis.direction.x;
  const dy = axis.direction.y;
  const denominator = dx * dx + dy * dy;
  const projection =
    ((value.x - axis.point.x) * dx + (value.y - axis.point.y) * dy) / denominator;
  const projected = point(axis.point.x + projection * dx, axis.point.y + projection * dy);
  return point(2 * projected.x - value.x, 2 * projected.y - value.y);
}

/** Translates a point by a Cartesian delta. */
export function translatePoint(value: Point, delta: Point): Point {
  return point(value.x + delta.x, value.y + delta.y);
}

/** Uniformly scales a point around an origin. */
export function scalePoint(value: Point, factor: number, center: Point = point(0, 0)): Point {
  if (!Number.isFinite(factor)) {
    throw new RangeError("factor must be finite");
  }
  return point(center.x + (value.x - center.x) * factor, center.y + (value.y - center.y) * factor);
}

/** Applies a point transform to every polygon vertex. */
export function mapPolygon(value: Polygon, transform: (vertex: Point) => Point): Polygon {
  return polygon(value.vertices.map(transform));
}

/** Translates every vertex of a polygon. */
export function translatePolygon(value: Polygon, delta: Point): Polygon {
  return mapPolygon(value, (vertex) => translatePoint(vertex, delta));
}

/** Rotates every vertex of a polygon. */
export function rotatePolygon(value: Polygon, angle: number, center: Point = point(0, 0)): Polygon {
  return mapPolygon(value, (vertex) => rotatePoint(vertex, angle, center));
}

/** Uniformly scales every vertex of a polygon. */
export function scalePolygon(value: Polygon, factor: number, center: Point = point(0, 0)): Polygon {
  return mapPolygon(value, (vertex) => scalePoint(vertex, factor, center));
}

/** Creates a unit-direction ray from an angle in radians. */
export function rayFromAngle(origin: Point, angle: number): Ray {
  if (!Number.isFinite(angle)) {
    throw new RangeError("angle must be finite");
  }
  return ray(origin, point(Math.cos(angle), Math.sin(angle)));
}

/** Returns a point at a non-negative distance along a ray. */
export function pointOnRay(value: Ray, distance: number): Point {
  if (!Number.isFinite(distance) || distance < 0) {
    throw new RangeError("distance must be finite and non-negative");
  }
  const magnitude = Math.hypot(value.direction.x, value.direction.y);
  return point(
    value.origin.x + (value.direction.x / magnitude) * distance,
    value.origin.y + (value.direction.y / magnitude) * distance,
  );
}

/** Converts a finite portion of a ray to a segment. */
export function raySegment(value: Ray, length: number): Segment {
  if (length <= GEOMETRY_EPSILON) {
    throw new RangeError("length must be greater than zero");
  }
  return segment(value.origin, pointOnRay(value, length));
}

/**
 * Offsets a non-degenerate segment to its left.
 * A negative distance offsets to its right.
 */
export function offsetSegment(value: Segment, distance: number): Segment {
  if (!Number.isFinite(distance)) {
    throw new RangeError("distance must be finite");
  }
  const dx = value.end.x - value.start.x;
  const dy = value.end.y - value.start.y;
  const length = Math.hypot(dx, dy);
  if (length <= GEOMETRY_EPSILON) {
    throw new RangeError("cannot offset a degenerate segment");
  }
  const delta = point((-dy / length) * distance, (dx / length) * distance);
  return segment(translatePoint(value.start, delta), translatePoint(value.end, delta));
}
