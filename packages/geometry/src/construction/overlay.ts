import type { Circle, Point, Polygon, Segment } from "./types.js";

/** Semantic visibility role for construction diagrams. */
export type OverlayRole = "guide" | "division" | "result";

interface OverlayBase {
  readonly role: OverlayRole;
}

export interface OverlayPoint extends OverlayBase {
  readonly kind: "point";
  readonly geometry: Point;
}

export interface OverlaySegment extends OverlayBase {
  readonly kind: "segment";
  readonly geometry: Segment;
}

export interface OverlayCircle extends OverlayBase {
  readonly kind: "circle";
  readonly geometry: Circle;
}

export interface OverlayPolygon extends OverlayBase {
  readonly kind: "polygon";
  readonly geometry: Polygon;
}

/** Renderer-neutral construction geometry. */
export type ConstructionOverlayPrimitive =
  | OverlayPoint
  | OverlaySegment
  | OverlayCircle
  | OverlayPolygon;

export interface ConstructionOverlay {
  readonly primitives: readonly ConstructionOverlayPrimitive[];
}

export function overlayPoint(
  geometry: Point,
  role: OverlayRole = "division",
): OverlayPoint {
  return { kind: "point", geometry, role };
}

export function overlaySegment(
  geometry: Segment,
  role: OverlayRole = "guide",
): OverlaySegment {
  return { kind: "segment", geometry, role };
}

export function overlayCircle(
  geometry: Circle,
  role: OverlayRole = "guide",
): OverlayCircle {
  return { kind: "circle", geometry, role };
}

export function overlayPolygon(
  geometry: Polygon,
  role: OverlayRole = "result",
): OverlayPolygon {
  return { kind: "polygon", geometry, role };
}

/** Groups primitives without applying renderer-specific styling. */
export function constructionOverlay(
  primitives: readonly ConstructionOverlayPrimitive[],
): ConstructionOverlay {
  return { primitives: [...primitives] };
}
