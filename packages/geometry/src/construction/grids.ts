import { divideCircle } from "./polygons.js";
import {
  GEOMETRY_EPSILON,
  type Bounds,
  type Circle,
  type Point,
  type Polygon,
  type Segment,
  circle,
  point,
  polygon,
  segment,
} from "./types.js";

export interface ConstructionGrid {
  readonly points: readonly Point[];
  readonly segments: readonly Segment[];
  readonly cells: readonly Polygon[];
  readonly repeatCell?: Polygon;
}

export interface BoundedGridOptions {
  readonly bounds: Bounds;
  readonly spacing: number;
}

function validateSpacing(spacing: number): void {
  if (!Number.isFinite(spacing) || spacing <= GEOMETRY_EPSILON) {
    throw new RangeError("spacing must be finite and greater than zero");
  }
}

function ensureGridSize(count: number): void {
  if (count > 10_000) {
    throw new RangeError("grid exceeds the 10,000 point safety limit");
  }
}

/** Builds an orthogonal square grid clipped to axis-aligned bounds. */
export function squareGrid(options: BoundedGridOptions): ConstructionGrid {
  validateSpacing(options.spacing);
  const { minX, minY, maxX, maxY } = options.bounds;
  const columns = Math.floor((maxX - minX) / options.spacing) + 1;
  const rows = Math.floor((maxY - minY) / options.spacing) + 1;
  ensureGridSize(columns * rows);

  const at = (column: number, row: number): Point =>
    point(minX + column * options.spacing, minY + row * options.spacing);
  const points: Point[] = [];
  const segments: Segment[] = [];
  const cells: Polygon[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const current = at(column, row);
      points.push(current);
      if (column + 1 < columns) {
        segments.push(segment(current, at(column + 1, row)));
      }
      if (row + 1 < rows) {
        segments.push(segment(current, at(column, row + 1)));
      }
      if (column + 1 < columns && row + 1 < rows) {
        cells.push(
          polygon([
            current,
            at(column + 1, row),
            at(column + 1, row + 1),
            at(column, row + 1),
          ]),
        );
      }
    }
  }
  return { points, segments, cells, repeatCell: cells[0] };
}

/** Builds an equilateral triangular lattice clipped to axis-aligned bounds. */
export function triangularGrid(options: BoundedGridOptions): ConstructionGrid {
  validateSpacing(options.spacing);
  const { minX, minY, maxX, maxY } = options.bounds;
  const rowHeight = (Math.sqrt(3) / 2) * options.spacing;
  const maxRow = Math.floor((maxY - minY) / rowHeight);
  const nodes = new Map<string, Point>();

  for (let row = 0; row <= maxRow; row += 1) {
    const offset = (row * options.spacing) / 2;
    const minColumn = Math.ceil((minX - minX - offset) / options.spacing);
    const maxColumn = Math.floor((maxX - minX - offset) / options.spacing);
    for (let column = minColumn; column <= maxColumn; column += 1) {
      nodes.set(
        `${column}:${row}`,
        point(minX + column * options.spacing + offset, minY + row * rowHeight),
      );
    }
  }
  ensureGridSize(nodes.size);

  const segments: Segment[] = [];
  const cells: Polygon[] = [];
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 1],
  ] as const;
  for (const [key, current] of nodes) {
    const [column, row] = key.split(":").map(Number) as [number, number];
    for (const [columnDelta, rowDelta] of directions) {
      const neighbor = nodes.get(`${column + columnDelta}:${row + rowDelta}`);
      if (neighbor) {
        segments.push(segment(current, neighbor));
      }
    }

    const right = nodes.get(`${column + 1}:${row}`);
    const upper = nodes.get(`${column}:${row + 1}`);
    const upperRight = nodes.get(`${column + 1}:${row + 1}`);
    if (right && upper) {
      cells.push(polygon([current, right, upper]));
    }
    if (right && upper && upperRight) {
      cells.push(polygon([right, upperRight, upper]));
    }
  }

  const repeatCell = polygon([
    point(minX, minY),
    point(minX + options.spacing, minY),
    point(minX + options.spacing * 1.5, minY + rowHeight),
    point(minX + options.spacing * 0.5, minY + rowHeight),
  ]);
  return { points: [...nodes.values()], segments, cells, repeatCell };
}

function coordinateKey(value: Point): string {
  return `${Math.round(value.x / GEOMETRY_EPSILON)}:${Math.round(value.y / GEOMETRY_EPSILON)}`;
}

function edgeKey(value: Segment): string {
  const first = coordinateKey(value.start);
  const second = coordinateKey(value.end);
  return first < second ? `${first}|${second}` : `${second}|${first}`;
}

/**
 * Builds complete, flat-top regular hexagons inside bounds.
 * Partial boundary cells are intentionally omitted to keep edge topology exact.
 */
export function hexagonalGrid(options: BoundedGridOptions): ConstructionGrid {
  validateSpacing(options.spacing);
  const { minX, minY, maxX, maxY } = options.bounds;
  const radius = options.spacing;
  const halfHeight = (Math.sqrt(3) / 2) * radius;
  const cells: Polygon[] = [];
  const pointsByKey = new Map<string, Point>();
  const segmentsByKey = new Map<string, Segment>();

  for (
    let column = 0, centerX = minX + radius;
    centerX + radius <= maxX + GEOMETRY_EPSILON;
    column += 1, centerX = minX + radius + column * radius * 1.5
  ) {
    const columnOffset = column % 2 === 0 ? 0 : halfHeight;
    for (
      let centerY = minY + halfHeight + columnOffset;
      centerY + halfHeight <= maxY + GEOMETRY_EPSILON;
      centerY += halfHeight * 2
    ) {
      const vertices = divideCircle(circle(point(centerX, centerY), radius), 6, 0);
      const cell = polygon(vertices);
      cells.push(cell);
      vertices.forEach((vertex, index) => {
        pointsByKey.set(coordinateKey(vertex), vertex);
        const edge = segment(vertex, vertices[(index + 1) % vertices.length]!);
        segmentsByKey.set(edgeKey(edge), edge);
      });
    }
  }
  ensureGridSize(pointsByKey.size);
  return {
    points: [...pointsByKey.values()],
    segments: [...segmentsByKey.values()],
    cells,
    repeatCell: cells[0],
  };
}

/** Builds an n-fold radial construction grid with concentric divisions. */
export function radialGrid(
  boundary: Circle,
  divisions: number,
  rings = 1,
  startAngle = -Math.PI / 2,
): ConstructionGrid {
  if (!Number.isInteger(divisions) || divisions < 3) {
    throw new RangeError("divisions must be an integer of at least three");
  }
  if (!Number.isInteger(rings) || rings < 1) {
    throw new RangeError("rings must be a positive integer");
  }
  ensureGridSize(divisions * rings + 1);

  const ringPoints = Array.from({ length: rings }, (_, index) =>
    divideCircle(
      circle(boundary.center, (boundary.radius * (index + 1)) / rings),
      divisions,
      startAngle,
    ),
  );
  const segments: Segment[] = [];
  const cells: Polygon[] = [];
  for (let ringIndex = 0; ringIndex < rings; ringIndex += 1) {
    const current = ringPoints[ringIndex]!;
    for (let division = 0; division < divisions; division += 1) {
      const nextDivision = (division + 1) % divisions;
      segments.push(segment(current[division]!, current[nextDivision]!));
      if (ringIndex === 0) {
        segments.push(segment(boundary.center, current[division]!));
        cells.push(
          polygon([boundary.center, current[division]!, current[nextDivision]!]),
        );
      } else {
        const inner = ringPoints[ringIndex - 1]!;
        segments.push(segment(inner[division]!, current[division]!));
        cells.push(
          polygon([
            inner[division]!,
            current[division]!,
            current[nextDivision]!,
            inner[nextDivision]!,
          ]),
        );
      }
    }
  }
  return {
    points: [boundary.center, ...ringPoints.flat()],
    segments,
    cells,
  };
}

/** Builds a ten-fold radial construction grid. */
export function decagonalGrid(
  boundary: Circle,
  rings = 1,
  startAngle = -Math.PI / 2,
): ConstructionGrid {
  return radialGrid(boundary, 10, rings, startAngle);
}

/** Builds a twelve-fold radial construction grid. */
export function dodecagonalGrid(
  boundary: Circle,
  rings = 1,
  startAngle = -Math.PI / 2,
): ConstructionGrid {
  return radialGrid(boundary, 12, rings, startAngle);
}
