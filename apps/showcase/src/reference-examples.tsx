import { KHATAM_ZELLIGE_PALETTE } from "./khatam-mark";
import { generatePreset } from "@firdawsi/geometry";
import { useMemo } from "react";

export { KHATAM_ZELLIGE_PALETTE };

export function KhatamZelligeReference() {
  const svg = useMemo(
    () =>
      generatePreset("khatam-8-star-cross", {
        width: 720,
        height: 500,
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
    <div
      className="pattern-preview reference-preview reference-preview--khatam"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function IsometricGrid({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const step = 18;
  const lines: string[] = [];
  for (let i = -4; i < Math.ceil(w / step) + 4; i += 1) {
    const ox = x + i * step * 0.5;
    lines.push(`M ${ox} ${y} L ${ox + h * 0.58} ${y + h}`);
    lines.push(`M ${ox + w} ${y} L ${ox + w - h * 0.58} ${y + h}`);
  }
  for (let j = 0; j < Math.ceil(h / (step * 0.86)) + 2; j += 1) {
    const oy = y + j * step * 0.86;
    lines.push(`M ${x} ${oy} L ${x + w} ${oy}`);
  }
  return (
    <g stroke="#9ec9e8" strokeWidth="0.75" fill="none" opacity="0.85">
      {lines.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </g>
  );
}

function CurvilinearUnit({ cx, cy, scale = 1, fill = "none", stroke = "#111" }: {
  cx: number;
  cy: number;
  scale?: number;
  fill?: string;
  stroke?: string;
}) {
  const s = scale;
  return (
    <path
      d={`M ${cx} ${cy - 26 * s}
         C ${cx + 34 * s} ${cy - 18 * s}, ${cx + 34 * s} ${cy + 8 * s}, ${cx + 8 * s} ${cy + 22 * s}
         C ${cx - 10 * s} ${cy + 30 * s}, ${cx - 28 * s} ${cy + 12 * s}, ${cx - 24 * s} ${cy - 8 * s}
         C ${cx - 20 * s} ${cy - 24 * s}, ${cx - 4 * s} ${cy - 30 * s}, ${cx} ${cy - 26 * s} Z`}
      fill={fill}
      stroke={stroke}
      strokeWidth={fill === "none" ? 2.2 : 0}
      strokeLinejoin="round"
    />
  );
}

function StarHexEmbellishment({ cx, cy }: { cx: number; cy: number }) {
  const star = "M 0 -7 L 2 -2 L 7 -2 L 3 1 L 5 6 L 0 3 L -5 6 L -3 1 L -7 -2 L -2 -2 Z";
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#fff" />
      <path d={star} fill="#111" transform="scale(1.05)" />
    </g>
  );
}

export function CurvilinearIsometricPlate() {
  return (
    <svg
      className="reference-plate"
      viewBox="0 0 820 620"
      role="img"
      aria-labelledby="curvilinear-plate-title curvilinear-plate-desc"
    >
      <title id="curvilinear-plate-title">Curvilinear isometric tessellation construction plate</title>
      <desc id="curvilinear-plate-desc">
        Four stages from a single curvilinear figure on an isometric grid to a tessellated field
        embellished with stars and hexagons.
      </desc>
      <rect width="820" height="620" fill="#f7f2e8" />
      <g fontFamily="ui-sans-serif, system-ui, sans-serif" fill="#173f6c">
        <text x="24" y="34" fontSize="15" fontWeight="600">
          Curvilinear variations on the isometric tessellation
        </text>
      </g>

      <g transform="translate(24 52)">
        <rect width="376" height="248" fill="#fff" stroke="#173f6c" strokeWidth="1.2" />
        <text x="14" y="24" fontSize="13" fontWeight="600" fill="#173f6c">(a) The basic figure</text>
        <IsometricGrid x={20} y={40} w={336} h={188} />
        <CurvilinearUnit cx={198} cy={152} scale={1.35} />
        <circle cx={198} cy={152} r="54" fill="none" stroke="#111" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
      </g>

      <g transform="translate(420 52)">
        <rect width="376" height="248" fill="#fff" stroke="#173f6c" strokeWidth="1.2" />
        <text x="14" y="24" fontSize="13" fontWeight="600" fill="#173f6c">(b) Its usual arrangement</text>
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <g
              key={`${row}-${col}`}
              transform={`translate(${54 + col * 78} ${58 + row * 68}) rotate(${((row + col) % 3) * 120} 26 26)`}
            >
              <CurvilinearUnit cx={26} cy={26} scale={0.82} fill={(row + col) % 2 === 0 ? "#2f78c6" : "#fff"} stroke="#111" />
            </g>
          )),
        )}
      </g>

      <g transform="translate(24 320)">
        <rect width="376" height="248" fill="#fff" stroke="#173f6c" strokeWidth="1.2" />
        <text x="14" y="24" fontSize="13" fontWeight="600" fill="#173f6c">(c) Embellished with stars and hexagons</text>
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <g
              key={`c-${row}-${col}`}
              transform={`translate(${54 + col * 78} ${58 + row * 68}) rotate(${((row + col) % 3) * 120} 26 26)`}
            >
              <CurvilinearUnit cx={26} cy={26} scale={0.82} fill={(row + col) % 2 === 0 ? "#2f78c6" : "#fff"} stroke="#111" />
            </g>
          )),
        )}
        <StarHexEmbellishment cx={132} cy={126} />
        <StarHexEmbellishment cx={288} cy={126} />
        <StarHexEmbellishment cx={210} cy={194} />
      </g>

      <g transform="translate(420 320)">
        <rect width="376" height="248" fill="#fff" stroke="#173f6c" strokeWidth="1.2" />
        <text x="14" y="24" fontSize="13" fontWeight="600" fill="#173f6c">(d) An alternative radial format</text>
        <IsometricGrid x={20} y={40} w={336} h={188} />
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <g key={index} transform={`translate(198 152) rotate(${index * 60}) translate(0 -58)`}>
            <CurvilinearUnit cx={0} cy={0} scale={0.72} />
          </g>
        ))}
        <circle cx={198} cy={152} r="16" fill="none" stroke="#111" strokeWidth="1.6" />
      </g>

      <text x="24" y="598" fontSize="12" fill="#4a607a">
        Reference study after classical girih construction manuals · isometric scaffold → repeat → embellishment
      </text>
    </svg>
  );
}
