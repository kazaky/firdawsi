import {
  GEOMETRY_EPSILON,
  type Circle,
  type Line,
  type Point,
  type Segment,
  point,
  segment,
} from "./types.js";

function cross(first: Point, second: Point): number {
  return first.x * second.y - first.y * second.x;
}

function subtract(first: Point, second: Point): Point {
  return point(first.x - second.x, first.y - second.y);
}

function dot(first: Point, second: Point): number {
  return first.x * second.x + first.y * second.y;
}

/** Intersects two infinite lines. Parallel and coincident lines return `null`. */
export function lineLineIntersection(
  first: Line,
  second: Line,
  epsilon = GEOMETRY_EPSILON,
): Point | null {
  const denominator = cross(first.direction, second.direction);
  if (Math.abs(denominator) <= epsilon) {
    return null;
  }
  const delta = subtract(second.point, first.point);
  const parameter = cross(delta, second.direction) / denominator;
  return point(
    first.point.x + parameter * first.direction.x,
    first.point.y + parameter * first.direction.y,
  );
}

/** Intersects an infinite line and a circle, ordered along the line direction. */
export function lineCircleIntersections(
  value: Line,
  target: Circle,
  epsilon = GEOMETRY_EPSILON,
): readonly Point[] {
  const relative = subtract(value.point, target.center);
  const a = dot(value.direction, value.direction);
  const b = 2 * dot(relative, value.direction);
  const c = dot(relative, relative) - target.radius * target.radius;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < -epsilon) {
    return [];
  }
  if (Math.abs(discriminant) <= epsilon) {
    const parameter = -b / (2 * a);
    return [
      point(
        value.point.x + parameter * value.direction.x,
        value.point.y + parameter * value.direction.y,
      ),
    ];
  }
  const root = Math.sqrt(discriminant);
  const parameters = [(-b - root) / (2 * a), (-b + root) / (2 * a)];
  return parameters.map((parameter) =>
    point(
      value.point.x + parameter * value.direction.x,
      value.point.y + parameter * value.direction.y,
    ),
  );
}

/**
 * Intersects two circles.
 * Disjoint, contained, and coincident circles return an empty array.
 */
export function circleCircleIntersections(
  first: Circle,
  second: Circle,
  epsilon = GEOMETRY_EPSILON,
): readonly Point[] {
  const dx = second.center.x - first.center.x;
  const dy = second.center.y - first.center.y;
  const distance = Math.hypot(dx, dy);
  if (
    distance <= epsilon ||
    distance > first.radius + second.radius + epsilon ||
    distance < Math.abs(first.radius - second.radius) - epsilon
  ) {
    return [];
  }

  const along =
    (first.radius * first.radius - second.radius * second.radius + distance * distance) /
    (2 * distance);
  const heightSquared = Math.max(0, first.radius * first.radius - along * along);
  const base = point(
    first.center.x + (along * dx) / distance,
    first.center.y + (along * dy) / distance,
  );
  if (heightSquared <= epsilon * epsilon) {
    return [base];
  }

  const height = Math.sqrt(heightSquared);
  const offsetX = (-dy * height) / distance;
  const offsetY = (dx * height) / distance;
  return [
    point(base.x + offsetX, base.y + offsetY),
    point(base.x - offsetX, base.y - offsetY),
  ];
}

export type SegmentIntersection =
  | { readonly kind: "none" }
  | { readonly kind: "point"; readonly point: Point }
  | { readonly kind: "overlap"; readonly segment: Segment };

function pointOnSegment(value: Point, target: Segment, epsilon: number): boolean {
  const startToPoint = subtract(value, target.start);
  const startToEnd = subtract(target.end, target.start);
  return (
    Math.abs(cross(startToPoint, startToEnd)) <= epsilon &&
    dot(startToPoint, subtract(value, target.end)) <= epsilon
  );
}

/**
 * Classifies the finite intersection of two segments.
 * Collinear intersections are returned as a point or overlapping segment.
 */
export function segmentIntersection(
  first: Segment,
  second: Segment,
  epsilon = GEOMETRY_EPSILON,
): SegmentIntersection {
  const firstVector = subtract(first.end, first.start);
  const secondVector = subtract(second.end, second.start);
  const delta = subtract(second.start, first.start);
  const firstLengthSquared = dot(firstVector, firstVector);
  const secondLengthSquared = dot(secondVector, secondVector);

  if (firstLengthSquared <= epsilon * epsilon) {
    return pointOnSegment(first.start, second, epsilon)
      ? { kind: "point", point: first.start }
      : { kind: "none" };
  }
  if (secondLengthSquared <= epsilon * epsilon) {
    return pointOnSegment(second.start, first, epsilon)
      ? { kind: "point", point: second.start }
      : { kind: "none" };
  }

  const denominator = cross(firstVector, secondVector);
  if (Math.abs(denominator) > epsilon) {
    const firstParameter = cross(delta, secondVector) / denominator;
    const secondParameter = cross(delta, firstVector) / denominator;
    if (
      firstParameter < -epsilon ||
      firstParameter > 1 + epsilon ||
      secondParameter < -epsilon ||
      secondParameter > 1 + epsilon
    ) {
      return { kind: "none" };
    }
    const clamped = Math.max(0, Math.min(1, firstParameter));
    return {
      kind: "point",
      point: point(
        first.start.x + clamped * firstVector.x,
        first.start.y + clamped * firstVector.y,
      ),
    };
  }

  if (Math.abs(cross(delta, firstVector)) > epsilon) {
    return { kind: "none" };
  }

  const startParameter = dot(delta, firstVector) / firstLengthSquared;
  const endParameter = startParameter + dot(secondVector, firstVector) / firstLengthSquared;
  const overlapStart = Math.max(0, Math.min(startParameter, endParameter));
  const overlapEnd = Math.min(1, Math.max(startParameter, endParameter));
  if (overlapEnd < overlapStart - epsilon) {
    return { kind: "none" };
  }

  const start = point(
    first.start.x + overlapStart * firstVector.x,
    first.start.y + overlapStart * firstVector.y,
  );
  if (Math.abs(overlapEnd - overlapStart) <= epsilon) {
    return { kind: "point", point: start };
  }
  return {
    kind: "overlap",
    segment: segment(
      start,
      point(
        first.start.x + overlapEnd * firstVector.x,
        first.start.y + overlapEnd * firstVector.y,
      ),
    ),
  };
}
