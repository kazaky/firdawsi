import { generatePreset } from "@firdawsi/geometry";
import { useMemo } from "react";

/** Zellige khatam palette — teal, slate, crimson, jade, violet, gold accents. */
export const KHATAM_ZELLIGE_PALETTE = [
  "#1e2433",
  "#3d8f8a",
  "#f4f0e6",
  "#7a8fa3",
  "#8b2942",
  "#2a3548",
  "#3d6b4f",
  "#6b4f7a",
  "#b8d4cf",
  "#e8c547",
  "#c45a28",
  "#d4a574",
] as const;

export function generateKhatamLogoSvg(size: number): string {
  return generatePreset("khatam-8-star-cross", {
    width: size,
    height: size,
    maxNodes: 1400,
    unitSize: Math.round(size * 0.72),
    density: 0.38,
    crop: "circle",
    interlace: true,
    strandWidth: Math.max(1.6, size * 0.02),
    weaveGap: Math.max(1, size * 0.012),
    stroke: 0,
    simplificationTier: "expanded",
    seed: "firdawsi-mark",
    palette: [...KHATAM_ZELLIGE_PALETTE],
    accessibility: { decorative: true, title: "Firdawsi khatam mark" },
  }).svg;
}

export function KhatamMark({
  size = 32,
  className = "",
  labelled = false,
}: {
  size?: number;
  className?: string;
  /** Set true when the mark is meaningful standalone (e.g. hero), not decorative chrome. */
  labelled?: boolean;
}) {
  const svg = useMemo(() => generateKhatamLogoSvg(size), [size]);

  return (
    <div
      className={`khatam-mark ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden={labelled ? undefined : true}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? "Firdawsi khatam mark" : undefined}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
