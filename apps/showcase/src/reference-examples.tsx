import { KHATAM_ZELLIGE_PALETTE } from "./khatam-mark";
import {
  circle,
  divideCircle,
  generatePreset,
  hexagonalGrid,
  polygon,
  polygonCentroid,
  polygonPath,
  sScrollPath,
} from "@firdawsi/geometry";
import { useMemo } from "react";

export { KHATAM_ZELLIGE_PALETTE };

const COURTYARD_MINERALS = ["#c9a227", "#1f6b4a", "#2f6f9a", "#2a2a28"] as const;
const PLATE_CREAM = "#f4ecd9";
const PLATE_INK = "#111111";
const PLATE_BLUE = "#173f6c";
const PLATE_GROUND = "#f7f2e8";

function svgInnerMarkup(svg: string): string {
  return svg.replace(/^[\s\S]*?<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");
}

function hexagramPath(cx: number, cy: number, radius: number): string {
  const verts = divideCircle(circle({ x: cx, y: cy }, radius), 6, -Math.PI / 2);
  return [
    polygonPath(polygon([verts[0]!, verts[2]!, verts[4]!])),
    polygonPath(polygon([verts[1]!, verts[3]!, verts[5]!])),
  ].join(" ");
}

function buildZelligeStudy(width: number, height: number, spacing: number) {
  const pad = 10;
  const grid = hexagonalGrid({
    bounds: { minX: pad, minY: pad, maxX: width - pad, maxY: height - pad },
    spacing,
  });
  const bend = spacing * 0.22;
  const straps = grid.segments.map((edge) => sScrollPath(edge.start, edge.end, bend).data);
  const stars = grid.cells.map((cell) => {
    const center = polygonCentroid(cell);
    return hexagramPath(center.x, center.y, spacing * 0.22);
  });
  return { grid, straps, stars };
}

function ZelligeField({
  width,
  height,
  mode,
}: {
  width: number;
  height: number;
  mode: "construction" | "color";
}) {
  const study = useMemo(() => buildZelligeStudy(width, height, 34), [width, height]);

  if (mode === "construction") {
    return (
      <g>
        {study.grid.segments.map((edge, index) => (
          <line
            key={`guide-${index}`}
            x1={edge.start.x}
            y1={edge.start.y}
            x2={edge.end.x}
            y2={edge.end.y}
            stroke="#9ec9e8"
            strokeWidth="0.75"
            strokeDasharray="3 3"
            data-construction-role="guide"
          />
        ))}
        {study.straps.map((data, index) => (
          <path
            key={`strap-${index}`}
            d={data}
            fill="none"
            stroke={PLATE_INK}
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            data-construction-role="result"
          />
        ))}
        {study.stars.map((data, index) => (
          <path
            key={`star-${index}`}
            d={data}
            fill="none"
            stroke={PLATE_INK}
            strokeWidth="1.1"
            data-construction-role="result"
          />
        ))}
      </g>
    );
  }

  return (
    <g>
      <rect width={width} height={height} fill={PLATE_CREAM} />
      {study.grid.cells.map((cell, index) => (
        <path
          key={`petal-${index}`}
          d={polygonPath(cell)}
          fill="#fff9ec"
          stroke={PLATE_CREAM}
          strokeWidth="0.6"
        />
      ))}
      {study.stars.map((data, index) => (
        <path
          key={`star-fill-${index}`}
          d={data}
          fill={COURTYARD_MINERALS[index % COURTYARD_MINERALS.length]}
          stroke={PLATE_INK}
          strokeWidth="0.35"
        />
      ))}
      {study.straps.map((data, index) => (
        <path
          key={`strap-fill-${index}`}
          d={data}
          fill="none"
          stroke={COURTYARD_MINERALS[(index + 1) % COURTYARD_MINERALS.length]}
          strokeWidth="3.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

export function ZelligeConstructionPlate() {
  return (
    <svg
      className="reference-plate"
      viewBox="0 0 420 620"
      role="img"
      aria-labelledby="zellige-plate-title zellige-plate-desc"
      data-plate="zellige"
    >
      <title id="zellige-plate-title">Zellige construction plate</title>
      <desc id="zellige-plate-desc">
        Hexagonal grid and curved strapwork above a courtyard tile field — the drawn sequence before color is laid.
      </desc>
      <rect width="420" height="620" fill={PLATE_GROUND} />
      <defs>
        <clipPath id="zellige-construct-clip">
          <rect x="4" y="0" width="380" height="214" />
        </clipPath>
        <clipPath id="zellige-color-clip">
          <rect x="4" y="0" width="380" height="214" />
        </clipPath>
      </defs>
      <text x="16" y="30" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="14" fontWeight="600" fill={PLATE_BLUE}>
        Hexagonal strapwork construction
      </text>

      <g transform="translate(16 44)">
        <rect width="388" height="248" fill="#fff" stroke={PLATE_BLUE} strokeWidth="1.2" />
        <text x="12" y="22" fontSize="12" fontWeight="600" fill={PLATE_BLUE} fontFamily="ui-sans-serif, system-ui, sans-serif">
          (a) Grid and S-strap outlines
        </text>
        <g transform="translate(0 28)" clipPath="url(#zellige-construct-clip)">
          <ZelligeField width={388} height={214} mode="construction" />
        </g>
      </g>

      <g transform="translate(16 308)">
        <rect width="388" height="248" fill="#fff" stroke={PLATE_BLUE} strokeWidth="1.2" />
        <text x="12" y="22" fontSize="12" fontWeight="600" fill={PLATE_BLUE} fontFamily="ui-sans-serif, system-ui, sans-serif">
          (b) Courtyard tile field
        </text>
        <g transform="translate(0 28)" clipPath="url(#zellige-color-clip)">
          <ZelligeField width={388} height={214} mode="color" />
        </g>
      </g>

      <text x="16" y="590" fontSize="11" fill="#4a607a" fontFamily="ui-sans-serif, system-ui, sans-serif">
        hexagonalGrid + sScrollPath · scaffold → strapwork → mineral glaze
      </text>
    </svg>
  );
}

export function KhatamZelligeReference() {
  const construction = useMemo(
    () =>
      generatePreset("khatam-8-star-cross", {
        width: 380,
        height: 214,
        maxNodes: 1400,
        unitSize: 118,
        density: 0.4,
        crop: "square",
        interlace: false,
        stroke: 1.15,
        constructionOverlay: "full",
        simplificationTier: "expanded",
        seed: "zellige-khatam-construction",
        palette: ["#173f6c", "#2f6f9a", "#f7f2e8", "#c9a227"],
        accessibility: {
          decorative: true,
          title: "Eight-fold khatam construction overlay",
        },
      }),
    [],
  );

  const colorStudy = useMemo(
    () =>
      generatePreset("khatam-8-star-cross", {
        width: 380,
        height: 214,
        maxNodes: 1400,
        unitSize: 168,
        density: 0.42,
        crop: "circle",
        interlace: true,
        strandWidth: 3.4,
        weaveGap: 2.2,
        stroke: 0,
        simplificationTier: "expanded",
        seed: "zellige-reference",
        palette: [...KHATAM_ZELLIGE_PALETTE],
        accessibility: {
          decorative: true,
          title: "Eight-fold khatam with zellige color roles",
        },
      }),
    [],
  );

  return (
    <svg
      className="reference-plate"
      viewBox="0 0 420 620"
      role="img"
      aria-labelledby="khatam-plate-title khatam-plate-desc"
      data-plate="khatam-zellige"
    >
      <title id="khatam-plate-title">Khatam zellige palette plate</title>
      <desc id="khatam-plate-desc">
        Eight-fold star and cross with interlaced straps — construction first, then a multi-role color study.
      </desc>
      <rect width="420" height="620" fill={PLATE_GROUND} />
      <text x="16" y="30" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="14" fontWeight="600" fill={PLATE_BLUE}>
        Eight-fold khatam · zellige roles
      </text>

      <g transform="translate(16 44)" data-panel="construction">
        <rect width="388" height="248" fill="#fff" stroke={PLATE_BLUE} strokeWidth="1.2" />
        <text x="12" y="22" fontSize="12" fontWeight="600" fill={PLATE_BLUE} fontFamily="ui-sans-serif, system-ui, sans-serif">
          (a) Compass construction
        </text>
        <g
          transform="translate(4 28)"
          data-panel-body="construction"
          dangerouslySetInnerHTML={{ __html: svgInnerMarkup(construction.svg) }}
        />
      </g>

      <g transform="translate(16 308)" data-panel="color">
        <rect width="388" height="248" fill="#fff" stroke={PLATE_BLUE} strokeWidth="1.2" />
        <text x="12" y="22" fontSize="12" fontWeight="600" fill={PLATE_BLUE} fontFamily="ui-sans-serif, system-ui, sans-serif">
          (b) Interlaced color study
        </text>
        <g
          transform="translate(4 28)"
          dangerouslySetInnerHTML={{ __html: svgInnerMarkup(colorStudy.svg) }}
        />
      </g>

      <text x="16" y="590" fontSize="11" fill="#4a607a" fontFamily="ui-sans-serif, system-ui, sans-serif">
        generatePreset khatam-8-star-cross · overlay → interlaced glaze
      </text>
    </svg>
  );
}

const SQRT3 = Math.sqrt(3);
const TILE_BLUE = "#2f78c6";
const GRID_LINE = "#9ec9e8";

interface Vec {
  x: number;
  y: number;
}

function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y };
}

function sub(a: Vec, b: Vec): Vec {
  return { x: a.x - b.x, y: a.y - b.y };
}

/** Axial point on the equilateral-triangle lattice. */
function triPoint(origin: Vec, s: number, q: number, r: number): Vec {
  return { x: origin.x + s * (q + r / 2), y: origin.y + s * (SQRT3 / 2) * r };
}

function neighbor(center: Vec, s: number, index: number, startDeg = 0): Vec {
  const angle = ((startDeg + index * 60) * Math.PI) / 180;
  return { x: center.x + s * Math.cos(angle), y: center.y + s * Math.sin(angle) };
}

function outerEquilateral(a: Vec, b: Vec, inside: Vec): Vec {
  return sub(add(a, b), inside);
}

/** Minor arc `from → to` of `radius` around `center`. */
function arcThrough(from: Vec, to: Vec, center: Vec, radius: number): string {
  const start = Math.atan2(from.y - center.y, from.x - center.x);
  const end = Math.atan2(to.y - center.y, to.x - center.x);
  let delta = end - start;
  while (delta <= -Math.PI) delta += Math.PI * 2;
  while (delta > Math.PI) delta -= Math.PI * 2;
  const sweep: 0 | 1 = delta >= 0 ? 1 : 0;
  return `A ${radius} ${radius} 0 0 ${sweep} ${to.x} ${to.y}`;
}

/**
 * 3-fold propeller / shuriken: unit hexagon with alternating convex (circle at
 * the tile center) and concave (circle at the outward equilateral third) 60° arcs.
 */
function propellerPath(center: Vec, s: number, invert = false): string {
  const verts = Array.from({ length: 6 }, (_, index) => neighbor(center, s, index));
  const parts = [`M ${verts[0]!.x} ${verts[0]!.y}`];
  for (let index = 0; index < 6; index += 1) {
    const from = verts[index]!;
    const to = verts[(index + 1) % 6]!;
    const outward = invert ? index % 2 === 1 : index % 2 === 0;
    const arcCenter = outward ? center : outerEquilateral(from, to, center);
    parts.push(arcThrough(from, to, arcCenter, s));
  }
  return `${parts.join(" ")} Z`;
}

function vesicaPetal(a: Vec, b: Vec, s: number): string {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const hx = ((a.y - b.y) * SQRT3) / 2;
  const hy = ((b.x - a.x) * SQRT3) / 2;
  const c1 = { x: mid.x + hx, y: mid.y + hy };
  const c2 = { x: mid.x - hx, y: mid.y - hy };
  return `M ${a.x} ${a.y} ${arcThrough(a, b, c1, s)} ${arcThrough(b, a, c2, s)} Z`;
}

function isHexCenter(q: number, r: number): boolean {
  return (((q - r) % 3) + 3) % 3 === 0;
}

function hexColor(q: number, r: number): number {
  return (((q + r) % 3) + 3) % 3;
}

function hexCells(origin: Vec, s: number, qRange: number, rRange: number) {
  const cells: Array<Vec & { q: number; r: number; color: number }> = [];
  for (let q = -qRange; q <= qRange; q += 1) {
    for (let r = -rRange; r <= rRange; r += 1) {
      if (!isHexCenter(q, r)) continue;
      const point = triPoint(origin, s, q, r);
      cells.push({ ...point, q, r, color: hexColor(q, r) });
    }
  }
  return cells;
}

function IsometricScaffold({
  origin,
  s,
  qRange,
  rRange,
}: {
  origin: Vec;
  s: number;
  qRange: number;
  rRange: number;
}) {
  const segments: Array<{ key: string; a: Vec; b: Vec }> = [];
  const once: ReadonlyArray<readonly [number, number]> = [
    [1, 0],
    [0, 1],
    [-1, 1],
  ];
  for (let q = -qRange; q <= qRange; q += 1) {
    for (let r = -rRange; r <= rRange; r += 1) {
      const a = triPoint(origin, s, q, r);
      for (const [dq, dr] of once) {
        const nq = q + dq;
        const nr = r + dr;
        if (nq < -qRange || nq > qRange || nr < -rRange || nr > rRange) continue;
        segments.push({
          key: `${q},${r}-${nq},${nr}`,
          a,
          b: triPoint(origin, s, nq, nr),
        });
      }
    }
  }
  return (
    <g stroke={GRID_LINE} strokeWidth="0.65" fill="none" opacity="0.95">
      {segments.map((edge) => (
        <line key={edge.key} x1={edge.a.x} y1={edge.a.y} x2={edge.b.x} y2={edge.b.y} />
      ))}
    </g>
  );
}

function hexagonPath(center: Vec, s: number): string {
  return polygonPath(polygon(Array.from({ length: 6 }, (_, index) => neighbor(center, s, index))));
}

function inscribedHexagram(center: Vec, s: number): string {
  const verts = Array.from({ length: 6 }, (_, index) => neighbor(center, s, index));
  return [
    polygonPath(polygon([verts[0]!, verts[2]!, verts[4]!])),
    polygonPath(polygon([verts[1]!, verts[3]!, verts[5]!])),
  ].join(" ");
}

export function CurvilinearIsometricPlate() {
  const panel = { w: 376, h: 248 };
  const field = { x: 18, y: 36, w: 340, h: 196 };
  const s = 26;
  const origin = { x: field.x + field.w / 2, y: field.y + field.h / 2 };
  const qRange = 7;
  const rRange = 6;
  const tiles = hexCells(origin, s, qRange, rRange);
  const ring = Array.from({ length: 6 }, (_, index) => neighbor(origin, s, index));
  const tips = ring.map((pt, index) => outerEquilateral(pt, ring[(index + 1) % 6]!, origin));
  const concaveCenters = [1, 3, 5].map((index) =>
    outerEquilateral(ring[index]!, ring[(index + 1) % 6]!, origin),
  );

  return (
    <svg
      className="reference-plate"
      viewBox="0 0 820 620"
      role="img"
      aria-labelledby="curvilinear-plate-title curvilinear-plate-desc"
      data-plate="curvilinear-isometric"
    >
      <title id="curvilinear-plate-title">Curvilinear isometric tessellation construction plate</title>
      <desc id="curvilinear-plate-desc">
        Four stages from a single curvilinear figure on an isometric grid to a tessellated field
        embellished with stars and hexagons. Arcs are 60° unit circles on a triangular lattice.
      </desc>
      <rect width="820" height="620" fill="#f7f2e8" />
      <g fontFamily="ui-sans-serif, system-ui, sans-serif" fill="#173f6c">
        <text x="24" y="34" fontSize="15" fontWeight="600">
          Curvilinear variations on the isometric tessellation
        </text>
      </g>

      <g transform="translate(24 52)">
        <rect width={panel.w} height={panel.h} fill="#fff" stroke="#173f6c" strokeWidth="1.2" />
        <text x="14" y="24" fontSize="13" fontWeight="600" fill="#173f6c">
          (a) The basic figure
        </text>
        <g clipPath="url(#iso-a-clip)">
          <IsometricScaffold origin={origin} s={s} qRange={qRange} rRange={rRange} />
          <circle
            cx={origin.x}
            cy={origin.y}
            r={s}
            fill="none"
            stroke="#111"
            strokeWidth="1"
            strokeDasharray="3.5 3"
            opacity="0.55"
          />
          {ring.map((pt, index) => (
            <circle
              key={`flower-${index}`}
              cx={pt.x}
              cy={pt.y}
              r={s}
              fill="none"
              stroke="#111"
              strokeWidth="0.7"
              strokeDasharray="3.5 3"
              opacity="0.22"
            />
          ))}
          {concaveCenters.map((pt, index) => (
            <circle
              key={`outer-${index}`}
              cx={pt.x}
              cy={pt.y}
              r={s}
              fill="none"
              stroke="#111"
              strokeWidth="0.85"
              strokeDasharray="3.5 3"
              opacity="0.4"
            />
          ))}
          <path
            d={propellerPath(origin, s)}
            fill="none"
            stroke="#111"
            strokeWidth="2.15"
            strokeLinejoin="round"
          />
        </g>
      </g>

      <g transform="translate(420 52)">
        <rect width={panel.w} height={panel.h} fill="#fff" stroke="#173f6c" strokeWidth="1.2" />
        <text x="14" y="24" fontSize="13" fontWeight="600" fill="#173f6c">
          (b) Its usual arrangement
        </text>
        <g clipPath="url(#iso-b-clip)">
          {tiles.map((tile) => (
            <path
              key={`b-${tile.q}-${tile.r}`}
              d={propellerPath(tile, s)}
              fill={tile.color === 0 ? TILE_BLUE : "#fff"}
              stroke="#111"
              strokeWidth="0.7"
            />
          ))}
          <IsometricScaffold origin={origin} s={s} qRange={qRange} rRange={rRange} />
        </g>
      </g>

      <g transform="translate(24 320)">
        <rect width={panel.w} height={panel.h} fill="#fff" stroke="#173f6c" strokeWidth="1.2" />
        <text x="14" y="24" fontSize="13" fontWeight="600" fill="#173f6c">
          (c) Embellished with stars and hexagons
        </text>
        <g clipPath="url(#iso-c-clip)">
          {tiles.map((tile) => {
            if (tile.color === 0) {
              return (
                <path
                  key={`c-hex-${tile.q}-${tile.r}`}
                  d={hexagonPath(tile, s)}
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1"
                />
              );
            }
            if (tile.color === 1) {
              return (
                <path
                  key={`c-star-${tile.q}-${tile.r}`}
                  d={inscribedHexagram(tile, s)}
                  fill="#111"
                  stroke="#111"
                  strokeWidth="0.4"
                />
              );
            }
            return (
              <path
                key={`c-blue-${tile.q}-${tile.r}`}
                d={propellerPath(tile, s)}
                fill={TILE_BLUE}
                stroke="#111"
                strokeWidth="0.7"
              />
            );
          })}
          <IsometricScaffold origin={origin} s={s} qRange={qRange} rRange={rRange} />
        </g>
      </g>

      <g transform="translate(420 320)">
        <rect width={panel.w} height={panel.h} fill="#fff" stroke="#173f6c" strokeWidth="1.2" />
        <text x="14" y="24" fontSize="13" fontWeight="600" fill="#173f6c">
          (d) An alternative radial format
        </text>
        <g clipPath="url(#iso-d-clip)">
          <IsometricScaffold origin={origin} s={s} qRange={qRange} rRange={rRange} />
          <circle
            cx={origin.x}
            cy={origin.y}
            r={s}
            fill="none"
            stroke="#111"
            strokeWidth="0.75"
            strokeDasharray="3.5 3"
            opacity="0.35"
          />
          {ring.map((pt, index) => (
            <circle
              key={`d-flower-${index}`}
              cx={pt.x}
              cy={pt.y}
              r={s}
              fill="none"
              stroke="#111"
              strokeWidth="0.65"
              strokeDasharray="3.5 3"
              opacity="0.2"
            />
          ))}
          {ring.map((pt, index) => (
            <path
              key={`vesica-${index}`}
              d={vesicaPetal(origin, pt, s)}
              fill="none"
              stroke="#111"
              strokeWidth="1.65"
            />
          ))}
          {tips.map((tip, index) => (
            <path
              key={`outer-${index}`}
              d={`M ${ring[index]!.x} ${ring[index]!.y} ${arcThrough(ring[index]!, tip, ring[(index + 1) % 6]!, s)} ${arcThrough(tip, ring[(index + 1) % 6]!, ring[index]!, s)}`}
              fill="none"
              stroke="#111"
              strokeWidth="1.65"
            />
          ))}
          <circle cx={origin.x} cy={origin.y} r="5" fill="none" stroke="#111" strokeWidth="1.5" />
        </g>
      </g>

      <defs>
        <clipPath id="iso-a-clip">
          <rect x={field.x} y={field.y} width={field.w} height={field.h} />
        </clipPath>
        <clipPath id="iso-b-clip">
          <rect x={field.x} y={field.y} width={field.w} height={field.h} />
        </clipPath>
        <clipPath id="iso-c-clip">
          <rect x={field.x} y={field.y} width={field.w} height={field.h} />
        </clipPath>
        <clipPath id="iso-d-clip">
          <rect x={field.x} y={field.y} width={field.w} height={field.h} />
        </clipPath>
      </defs>

      <text x="24" y="598" fontSize="12" fill="#4a607a">
        triangular lattice · 60° unit arcs · construction → tessellation → hexagon/star → rosette
      </text>
    </svg>
  );
}
