import { useId } from "react";
import { palettes, type PaletteName } from "./showcase-data";

type Point = readonly [number, number];
const turn = ([x, y]: Point, quarter: number): Point => {
  const angle = quarter * Math.PI / 2;
  return [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
};
const points = (vertices: readonly Point[]) => vertices.map(([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`).join(" ");
const a = 50, b = a / Math.sqrt(2), c = a - b;
const quadrant: Point[] = [[a, 0], [b, c], [b, b], [c, b]];
const star = Array.from({ length: 4 }, (_, q) => quadrant.map(p => turn(p, q))).flat();
const corners: Point[] = [[100, 0], [100, 100], [0, 100], [0, 0]];
const cross = corners.flatMap(([cx, cy], q) => quadrant.map(([x, y]) => {
  const [rx, ry] = turn([-x, y], q);
  return [rx + cx, ry + cy] as Point;
}));

/** The star and its complementary cross share every boundary in a 100-unit repeat. */
export function MosaicArt({ palette, construction = false, hero = false }: {
  palette: PaletteName; construction?: boolean; hero?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const colours = palettes[palette];
  const cells = hero ? 4 : 3;
  const size = cells * 100;
  return <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true" data-mosaic="star-cross" className="mosaic-svg">
    <defs>
      <linearGradient id={`${id}-glaze`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={colours[0]} /><stop offset="1" stopColor={colours[1]} />
      </linearGradient>
      <pattern id={`${id}-repeat`} width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill={colours[2]} />
        <polygon points={points(cross)} fill={colours[3]} stroke={colours[2]} strokeWidth="1.2" strokeLinejoin="round" />
        {[[0, 0], [100, 0], [100, 100], [0, 100]].map(([x, y], i) =>
          <g key={i} transform={`translate(${x} ${y})`}>
            <polygon points={points(star)} fill={`url(#${id}-glaze)`} stroke={colours[2]} strokeWidth="1.2" strokeLinejoin="round" />
            {Array.from({ length: 8 }, (_, k) => <polygon key={k}
              points={points([[0, 0], star[k * 2], star[(k * 2 + 1) % 16]])}
              fill={k % 2 ? colours[1] : colours[0]} opacity=".48" />)}
            <polygon points={points(star.map(([sx, sy]) => [sx * .34, sy * .34]))} fill={colours[2]} />
            <polygon points="0,-9 9,0 0,9 -9,0" fill={colours[4]} />
          </g>)}
      </pattern>
    </defs>
    <rect width={size} height={size} fill={`url(#${id}-repeat)`} />
    {construction && <g data-construction-role="repeat-grid" fill="none" stroke="#111a3c" strokeWidth=".6" strokeDasharray="3 2">
      {Array.from({ length: cells + 1 }, (_, i) => <g key={i}>
        <path d={`M${i * 100} 0V${size}M0 ${i * 100}H${size}`} />
        {Array.from({ length: cells + 1 }, (_, j) => <circle key={j} cx={i * 100} cy={j * 100} r="50" />)}
      </g>)}
    </g>}
  </svg>;
}
