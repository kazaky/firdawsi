import { pathRound, type Path } from "d3-path";
import type { Point, Polygon } from "./types.js";

/**
 * A deterministic, chainable d3-path wrapper.
 * Coordinates are rounded by d3-path only when serialized.
 */
export class DeterministicPathBuilder {
  readonly #path: Path;

  constructor(digits = 6) {
    if (!Number.isInteger(digits) || digits < 0 || digits > 15) {
      throw new RangeError("digits must be an integer from zero through fifteen");
    }
    this.#path = pathRound(digits);
  }

  moveTo(value: Point): this {
    this.#path.moveTo(value.x, value.y);
    return this;
  }

  lineTo(value: Point): this {
    this.#path.lineTo(value.x, value.y);
    return this;
  }

  quadraticCurveTo(control: Point, end: Point): this {
    this.#path.quadraticCurveTo(control.x, control.y, end.x, end.y);
    return this;
  }

  bezierCurveTo(firstControl: Point, secondControl: Point, end: Point): this {
    this.#path.bezierCurveTo(
      firstControl.x,
      firstControl.y,
      secondControl.x,
      secondControl.y,
      end.x,
      end.y,
    );
    return this;
  }

  arc(
    center: Point,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterClockwise = false,
  ): this {
    this.#path.arc(center.x, center.y, radius, startAngle, endAngle, counterClockwise);
    return this;
  }

  arcTo(first: Point, second: Point, radius: number): this {
    this.#path.arcTo(first.x, first.y, second.x, second.y, radius);
    return this;
  }

  close(): this {
    this.#path.closePath();
    return this;
  }

  /** Returns the stable SVG path-data string. */
  toString(): string {
    return this.#path.toString();
  }
}

/** Serializes a polygon to deterministic closed SVG path data. */
export function polygonPath(value: Polygon, digits = 6): string {
  const builder = new DeterministicPathBuilder(digits).moveTo(value.vertices[0]!);
  value.vertices.slice(1).forEach((vertex) => builder.lineTo(vertex));
  return builder.close().toString();
}
