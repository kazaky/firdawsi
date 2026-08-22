import {
  segmentIntersection,
  type SegmentIntersection,
} from "./intersections.js";
import { validatePolygon } from "./polygons.js";
import {
  GEOMETRY_EPSILON,
  type Point,
  type Polygon,
  segment,
} from "./types.js";

export interface PolygonSelfIntersection {
  readonly firstEdge: number;
  readonly secondEdge: number;
  readonly intersection: Exclude<SegmentIntersection, { readonly kind: "none" }>;
}

function edgesAreAdjacent(first: number, second: number, edgeCount: number): boolean {
  return (
    first === second ||
    (first + 1) % edgeCount === second ||
    (second + 1) % edgeCount === first
  );
}

/** Finds all intersections between non-adjacent polygon edges. */
export function findSelfIntersections(
  value: Polygon,
  epsilon = GEOMETRY_EPSILON,
): readonly PolygonSelfIntersection[] {
  const intersections: PolygonSelfIntersection[] = [];
  const edgeCount = value.vertices.length;
  for (let first = 0; first < edgeCount; first += 1) {
    const firstEdge = segment(
      value.vertices[first]!,
      value.vertices[(first + 1) % edgeCount]!,
    );
    for (let second = first + 1; second < edgeCount; second += 1) {
      if (edgesAreAdjacent(first, second, edgeCount)) {
        continue;
      }
      const secondEdge = segment(
        value.vertices[second]!,
        value.vertices[(second + 1) % edgeCount]!,
      );
      const intersection = segmentIntersection(firstEdge, secondEdge, epsilon);
      if (intersection.kind !== "none") {
        intersections.push({ firstEdge: first, secondEdge: second, intersection });
      }
    }
  }
  return intersections;
}

export interface GeometryValidation {
  readonly valid: boolean;
  readonly issues: readonly string[];
}

/** Validates polygon degeneracy and rejects any self-intersection. */
export function validateSimplePolygon(
  value: Polygon,
  epsilon = GEOMETRY_EPSILON,
): GeometryValidation {
  const base = validatePolygon(value, epsilon);
  const issues = [...base.issues];
  if (findSelfIntersections(value, epsilon).length > 0) {
    issues.push("self-intersection");
  }
  return { valid: issues.length === 0, issues };
}

function edgeVector(value: Polygon, index: number): Point {
  const start = value.vertices[index]!;
  const end = value.vertices[(index + 1) % value.vertices.length]!;
  return { x: end.x - start.x, y: end.y - start.y };
}

/**
 * Validates that opposite repeat-cell edges pair by translation.
 * This checks boundary compatibility, not whether the cell alone tiles the plane.
 */
export function validateRepeatCellEdges(
  value: Polygon,
  epsilon = GEOMETRY_EPSILON,
): GeometryValidation {
  const issues = [...validateSimplePolygon(value, epsilon).issues];
  const edgeCount = value.vertices.length;
  if (edgeCount < 4 || edgeCount % 2 !== 0) {
    issues.push("repeat-cell-requires-even-edge-count");
    return { valid: false, issues };
  }

  const half = edgeCount / 2;
  for (let index = 0; index < half; index += 1) {
    const first = edgeVector(value, index);
    const opposite = edgeVector(value, index + half);
    const scale = Math.max(1, Math.hypot(first.x, first.y), Math.hypot(opposite.x, opposite.y));
    if (
      Math.hypot(first.x + opposite.x, first.y + opposite.y) >
      epsilon * scale
    ) {
      issues.push(`unmatched-opposite-edge:${index}`);
    }
  }
  return { valid: issues.length === 0, issues };
}
