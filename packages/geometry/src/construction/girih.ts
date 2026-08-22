import { polygonCentroid } from "./polygons.js";
import { rotatePoint } from "./transforms.js";
import { GEOMETRY_EPSILON, type Point, type Polygon, point, polygon } from "./types.js";

export const GIRIH_PROTOTILE_KINDS = [
  "decagon",
  "pentagon",
  "bowtie",
  "rhombus",
  "elongated-hexagon",
] as const;

export type GirihPrototileKind = (typeof GIRIH_PROTOTILE_KINDS)[number];

function validateSide(side: number): void {
  if (!Number.isFinite(side) || side <= GEOMETRY_EPSILON) {
    throw new RangeError("girih prototile side must be finite and greater than zero");
  }
}

function centerPolygon(value: Polygon, center: Point, rotation: number): Polygon {
  const centroid = polygonCentroid(value);
  return polygon(
    value.vertices.map((vertex) => {
      const local = point(vertex.x - centroid.x, vertex.y - centroid.y);
      const rotated = rotatePoint(local, rotation);
      return point(center.x + rotated.x, center.y + rotated.y);
    }),
  );
}

function edgeWalk(
  side: number,
  headings: readonly number[],
  center: Point,
  rotation: number,
): Polygon {
  validateSide(side);
  const vertices: Point[] = [point(0, 0)];
  for (let index = 0; index < headings.length - 1; index += 1) {
    const heading = headings[index]!;
    const previous = vertices[vertices.length - 1]!;
    vertices.push(
      point(previous.x + Math.cos(heading) * side, previous.y + Math.sin(heading) * side),
    );
  }
  const last = vertices[vertices.length - 1]!;
  const closingHeading = headings[headings.length - 1]!;
  const closing = point(
    last.x + Math.cos(closingHeading) * side,
    last.y + Math.sin(closingHeading) * side,
  );
  if (Math.hypot(closing.x, closing.y) > GEOMETRY_EPSILON * Math.max(1, side)) {
    throw new Error("girih prototile edge walk did not close");
  }
  return centerPolygon(polygon(vertices), center, rotation);
}

function regularBySide(sides: number, side: number, center: Point, rotation: number): Polygon {
  validateSide(side);
  const radius = side / (2 * Math.sin(Math.PI / sides));
  return polygon(
    Array.from({ length: sides }, (_, index) => {
      const angle = rotation + (index * Math.PI * 2) / sides;
      return point(center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius);
    }),
  );
}

/**
 * Constructs the five equilateral polygon types commonly used by the girih
 * tile interpretation. This is a mathematical prototile vocabulary, not a
 * claim about a specific historical workshop method.
 */
export function girihPrototile(
  kind: GirihPrototileKind,
  center: Point,
  side: number,
  rotation = 0,
): Polygon {
  if (!Number.isFinite(rotation)) {
    throw new RangeError("girih prototile rotation must be finite");
  }
  if (kind === "decagon") {
    return regularBySide(10, side, center, rotation);
  }
  if (kind === "pentagon") {
    return regularBySide(5, side, center, rotation);
  }
  if (kind === "rhombus") {
    return edgeWalk(side, [0, (2 * Math.PI) / 5, Math.PI, (7 * Math.PI) / 5], center, rotation);
  }
  if (kind === "bowtie") {
    return edgeWalk(
      side,
      [0, (3 * Math.PI) / 5, (6 * Math.PI) / 5, Math.PI, (8 * Math.PI) / 5, Math.PI / 5],
      center,
      rotation,
    );
  }
  return edgeWalk(
    side,
    [0, (3 * Math.PI) / 5, (4 * Math.PI) / 5, Math.PI, (8 * Math.PI) / 5, (9 * Math.PI) / 5],
    center,
    rotation,
  );
}
