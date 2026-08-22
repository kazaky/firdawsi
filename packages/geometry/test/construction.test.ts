import { describe, expect, it } from "vitest";
import {
  DeterministicPathBuilder,
  almondPetal,
  bounds,
  circle,
  circleCircleIntersections,
  constructionOverlay,
  decagonalGrid,
  divideCircle,
  dodecagonalGrid,
  findSelfIntersections,
  GIRIH_PROTOTILE_KINDS,
  girihPrototile,
  hexagonalGrid,
  insetConvexPolygon,
  lineCircleIntersections,
  lineLineIntersection,
  lineThrough,
  lotusBud,
  midpoint,
  mirrorMotifGroup,
  offsetSegment,
  overlayCircle,
  overlayPoint,
  overlayPolygon,
  overlaySegment,
  point,
  pointOnRay,
  polygon,
  polygonArea,
  polygonCentroid,
  polygonPath,
  polygonWinding,
  rayFromAngle,
  reflectPoint,
  regularPolygon,
  rotatePoint,
  rotateMotifGroup,
  scalePoint,
  segment,
  segmentIntersection,
  splitLeaf,
  sScrollPath,
  squareGrid,
  starStepVertices,
  translatePoint,
  triangularGrid,
  tendrilPath,
  validatePolygon,
  validateRepeatCellEdges,
  validateSimplePolygon,
} from "../src/construction/index.js";

function expectPointClose(
  actual: { readonly x: number; readonly y: number },
  expected: { readonly x: number; readonly y: number },
): void {
  expect(actual.x).toBeCloseTo(expected.x, 10);
  expect(actual.y).toBeCloseTo(expected.y, 10);
}

describe("construction types and transforms", () => {
  it("validates canonical primitive constructors", () => {
    expect(point(0.25, 0.75)).toEqual({ x: 0.25, y: 0.75 });
    expect(() => point(Number.NaN, 0)).toThrow("x must be finite");
    expect(() => circle(point(0, 0), 0)).toThrow("radius must be greater than zero");
    expect(() => lineThrough(point(1, 1), point(1, 1))).toThrow("direction must be non-zero");
    expect(() => polygon([point(0, 0), point(1, 0)])).toThrow(
      "at least three vertices",
    );
  });

  it("performs exact affine construction operations", () => {
    expect(midpoint(point(2, 4), point(6, 8))).toEqual(point(4, 6));
    expect(translatePoint(point(2, 3), point(-1, 4))).toEqual(point(1, 7));
    expect(scalePoint(point(3, 2), 2, point(1, 1))).toEqual(point(5, 3));
    expectPointClose(rotatePoint(point(1, 0), Math.PI / 2), point(0, 1));
    expectPointClose(
      reflectPoint(point(2, 3), lineThrough(point(0, 0), point(1, 0))),
      point(2, -3),
    );
  });

  it("constructs rays and reliable segment offsets", () => {
    const value = rayFromAngle(point(1, 1), Math.PI / 2);
    expectPointClose(pointOnRay(value, 3), point(1, 4));
    expect(offsetSegment(segment(point(0, 0), point(2, 0)), 1)).toEqual(
      segment(point(0, 1), point(2, 1)),
    );
  });
});

describe("circle, polygon, and grid constructions", () => {
  it("divides circles and orders regular star-step vertices", () => {
    const unit = circle(point(0, 0), 1);
    const divided = divideCircle(unit, 4, 0);
    expectPointClose(divided[0]!, point(1, 0));
    expectPointClose(divided[1]!, point(0, 1));
    expectPointClose(divided[2]!, point(-1, 0));
    expectPointClose(divided[3]!, point(0, -1));

    const regular = divideCircle(unit, 5, 0);
    const star = starStepVertices(unit, 5, 2, 0);
    expect(star).toEqual([regular[0], regular[2], regular[4], regular[1], regular[3]]);
    expect(() => starStepVertices(unit, 6, 2)).toThrow("must be coprime");
  });

  it("builds exact bounded and radial construction grids", () => {
    const square = squareGrid({ bounds: bounds(0, 0, 2, 2), spacing: 1 });
    expect(square.points).toHaveLength(9);
    expect(square.segments).toHaveLength(12);
    expect(square.cells).toHaveLength(4);
    expect(validateRepeatCellEdges(square.repeatCell!)).toEqual({
      valid: true,
      issues: [],
    });

    const triangular = triangularGrid({
      bounds: bounds(0, 0, 2, Math.sqrt(3)),
      spacing: 1,
    });
    expect(triangular.points).toHaveLength(8);
    expect(triangular.cells.length).toBeGreaterThan(0);
    expect(validateRepeatCellEdges(triangular.repeatCell!).valid).toBe(true);

    const hexagonal = hexagonalGrid({
      bounds: bounds(0, 0, 4, Math.sqrt(3) * 2),
      spacing: 1,
    });
    expect(hexagonal.cells).toHaveLength(3);
    expect(hexagonal.segments.length).toBeLessThan(hexagonal.cells.length * 6);

    expect(decagonalGrid(circle(point(0, 0), 1), 2).points).toHaveLength(21);
    expect(dodecagonalGrid(circle(point(0, 0), 1)).points).toHaveLength(13);
  });

  it("measures, validates, and insets polygons with d3-polygon", () => {
    const square = polygon([
      point(0, 0),
      point(4, 0),
      point(4, 4),
      point(0, 4),
    ]);
    expect(polygonArea(square)).toBe(16);
    expect(polygonWinding(square)).toBe("counterclockwise");
    expect(polygonCentroid(square)).toEqual(point(2, 2));
    expect(validatePolygon(square)).toEqual({ valid: true, issues: [] });

    const inset = insetConvexPolygon(square, 1);
    expect(inset?.vertices).toEqual([
      point(1, 1),
      point(3, 1),
      point(3, 3),
      point(1, 3),
    ]);
    expect(insetConvexPolygon(square, 3)).toBeNull();
  });

  it.each(GIRIH_PROTOTILE_KINDS)("constructs an equilateral, nondegenerate %s", (kind) => {
    const tile = girihPrototile(kind, point(0, 0), 2);
    const lengths = tile.vertices.map((vertex, index) => {
      const next = tile.vertices[(index + 1) % tile.vertices.length]!;
      return Math.hypot(next.x - vertex.x, next.y - vertex.y);
    });
    expect(lengths.every((length) => Math.abs(length - 2) < 1e-9)).toBe(true);
    expect(validateSimplePolygon(tile).valid).toBe(true);
    expect(polygonArea(tile)).toBeGreaterThan(0);
  });
});

describe("intersections and topology validation", () => {
  it("solves line and circle intersections with tangent handling", () => {
    const horizontal = lineThrough(point(-2, 0), point(2, 0));
    const vertical = lineThrough(point(0, -2), point(0, 2));
    expect(lineLineIntersection(horizontal, vertical)).toEqual(point(0, 0));
    expect(lineLineIntersection(horizontal, lineThrough(point(0, 1), point(1, 1)))).toBeNull();

    expect(lineCircleIntersections(horizontal, circle(point(0, 0), 1))).toEqual([
      point(-1, 0),
      point(1, 0),
    ]);
    expect(
      lineCircleIntersections(
        lineThrough(point(-2, 1), point(2, 1)),
        circle(point(0, 0), 1),
      ),
    ).toEqual([point(0, 1)]);

    const intersections = circleCircleIntersections(
      circle(point(0, 0), 1),
      circle(point(1, 0), 1),
    );
    expect(intersections).toHaveLength(2);
    expectPointClose(intersections[0]!, point(0.5, Math.sqrt(3) / 2));
    expectPointClose(intersections[1]!, point(0.5, -Math.sqrt(3) / 2));
  });

  it("classifies segment crossings and overlaps", () => {
    expect(
      segmentIntersection(
        segment(point(0, 0), point(2, 2)),
        segment(point(0, 2), point(2, 0)),
      ),
    ).toEqual({ kind: "point", point: point(1, 1) });
    expect(
      segmentIntersection(
        segment(point(0, 0), point(3, 0)),
        segment(point(1, 0), point(4, 0)),
      ),
    ).toEqual({
      kind: "overlap",
      segment: segment(point(1, 0), point(3, 0)),
    });
  });

  it("rejects self-intersections and unmatched repeat edges", () => {
    const bowTie = polygon([
      point(0, 0),
      point(2, 2),
      point(0, 2),
      point(2, 0),
    ]);
    expect(findSelfIntersections(bowTie)).toHaveLength(1);
    expect(validateSimplePolygon(bowTie).issues).toContain("self-intersection");

    const trapezoid = polygon([
      point(0, 0),
      point(3, 0),
      point(2, 1),
      point(0, 1),
    ]);
    expect(validateRepeatCellEdges(trapezoid)).toEqual({
      valid: false,
      issues: ["unmatched-opposite-edge:0", "unmatched-opposite-edge:1"],
    });
  });
});

describe("deterministic paths and construction overlays", () => {
  it("serializes rounded d3 paths deterministically", () => {
    const path = new DeterministicPathBuilder(3)
      .moveTo(point(0.12345, 0.98765))
      .lineTo(point(1.23456, 2.34567))
      .close()
      .toString();
    expect(path).toBe("M0.123,0.988L1.235,2.346Z");

    const triangle = regularPolygon(circle(point(0, 0), 1), 3, 0);
    expect(polygonPath(triangle, 2)).toMatch(/^M1,0L-0\.5,0\.87L-0\.5,-0\.87Z$/);
  });

  it("groups renderer-neutral overlay primitives", () => {
    const marker = point(0, 0);
    const edge = segment(point(0, 0), point(1, 0));
    const guide = circle(point(0, 0), 1);
    const face = regularPolygon(guide, 4);
    const overlay = constructionOverlay([
      overlayPoint(marker),
      overlaySegment(edge),
      overlayCircle(guide),
      overlayPolygon(face),
    ]);
    expect(overlay.primitives.map((primitive) => primitive.kind)).toEqual([
      "point",
      "segment",
      "circle",
      "polygon",
    ]);
    expect(overlay.primitives.map((primitive) => primitive.role)).toEqual([
      "division",
      "guide",
      "guide",
      "result",
    ]);
  });
});

describe("botanical constructions", () => {
  it("constructs circle-derived almond petals through both anchors", () => {
    const base = point(0, 0);
    const tip = point(0, -10);
    const motif = almondPetal(base, tip, 0.2);
    expect(motif.paths).toHaveLength(1);
    expect(motif.paths[0]!.closed).toBe(true);
    expect(motif.referenceCircles).toHaveLength(2);
    for (const guide of motif.referenceCircles) {
      expect(Math.hypot(base.x - guide.center.x, base.y - guide.center.y)).toBeCloseTo(
        guide.radius,
        10,
      );
      expect(Math.hypot(tip.x - guide.center.x, tip.y - guide.center.y)).toBeCloseTo(
        guide.radius,
        10,
      );
    }
  });

  it("builds deterministic split leaves, buds, scrolls, and tendrils", () => {
    const base = point(0, 0);
    const tip = point(0, -20);
    const first = splitLeaf(base, tip, 0.22);
    const second = splitLeaf(base, tip, 0.22);
    expect(first).toEqual(second);
    expect(first.paths.map((value) => value.role)).toEqual([
      "outline",
      "vein",
      "lobe",
    ]);
    const lotus = lotusBud(base, tip, 4);
    expect(lotus.paths).toHaveLength(2);
    expect(lotus.paths[0]!.data.match(/C/g)).toHaveLength(4);
    expect(lotus.paths[0]!.data).toMatch(/^M.*Z$/);
    expect(lotus.paths[0]!.data).not.toMatch(/Q|NaN|Infinity/);
    expect(sScrollPath(base, tip, 3).data).toMatch(/^M/);
    expect(tendrilPath(base, tip, 3, 2).data).not.toMatch(/NaN|Infinity/);
  });

  it("mirrors and rotates motif groups with exact deterministic transforms", () => {
    const motif = almondPetal(point(2, 0), point(2, -8));
    expect(mirrorMotifGroup(motif, 5).transforms).toEqual([
      "",
      "translate(10 0) scale(-1 1)",
    ]);
    expect(rotateMotifGroup(motif, 6, point(5, 5)).transforms).toEqual([
      "rotate(0 5 5)",
      "rotate(60 5 5)",
      "rotate(120 5 5)",
      "rotate(180 5 5)",
      "rotate(240 5 5)",
      "rotate(300 5 5)",
    ]);
  });
});
