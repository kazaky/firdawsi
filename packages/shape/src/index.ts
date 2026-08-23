/**
 * Arch-corner family.
 *
 * Corners are derived from construction ratios — rise and shoulder — not from a
 * horseshoe silhouette. The resulting path is a continuous container outline
 * whose corners interpolate between states (rest → hover → pressed), which is
 * Firdawsi's counterpart to Material 3 Expressive shape morphing.
 */

export type ArchState = "rest" | "hover" | "pressed" | "selected" | "expanded";

export interface ArchCornerInput {
  width: number;
  height: number;
  /** Fraction of the shorter edge that the corner curve rises inward. */
  rise: number;
  /** Fraction of the shorter edge at which the curve leaves each edge. */
  shoulder: number;
}

export interface ArchCornerResolved {
  width: number;
  height: number;
  rise: number;
  shoulder: number;
  inset: number;
  reach: number;
}

export const ARCH_MORPH: Record<ArchState, number> = {
  rest: 1,
  hover: 1.08,
  pressed: 0.86,
  selected: 1.12,
  expanded: 1.18,
};

export const ARCH_PRESETS = {
  none: { rise: 0, shoulder: 0.22 },
  shallow: { rise: 0.18, shoulder: 0.22 },
  balanced: { rise: 0.32, shoulder: 0.34 },
  tall: { rise: 0.5, shoulder: 0.44 },
} as const;

export type ArchPreset = keyof typeof ARCH_PRESETS;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function interpolateArch(
  from: ArchCornerInput,
  to: ArchCornerInput,
  t: number,
): ArchCornerInput {
  const progress = clamp(t, 0, 1);
  return {
    width: lerp(from.width, to.width, progress),
    height: lerp(from.height, to.height, progress),
    rise: lerp(from.rise, to.rise, progress),
    shoulder: lerp(from.shoulder, to.shoulder, progress),
  };
}

export function morphRise(rise: number, state: ArchState, progress = 1): number {
  return rise * lerp(1, ARCH_MORPH[state], clamp(progress, 0, 1));
}

export function resolveArchCorner(input: ArchCornerInput): ArchCornerResolved {
  const width = Math.max(1, input.width);
  const height = Math.max(1, input.height);
  const shorter = Math.min(width, height);
  const reach = clamp(input.shoulder, 0, 0.48) * shorter;
  const inset = clamp(input.rise, 0, 0.5) * shorter * 0.28;
  return {
    width,
    height,
    rise: clamp(input.rise, 0, 0.5),
    shoulder: clamp(input.shoulder, 0, 0.48),
    inset,
    reach: Math.min(reach, shorter / 2 - 0.5),
  };
}

/**
 * Closed SVG path for a container. Control points sit on the construction
 * ratios; the outline stays convex so it can clip interactive surfaces.
 */
export function archCornerPath(input: ArchCornerInput): string {
  const { width: w, height: h, inset, reach } = resolveArchCorner(input);
  if (reach <= 0.5 || inset <= 0.01) {
    const r = Math.max(reach, 4);
    return [
      `M ${r} 0`,
      `H ${w - r}`,
      `Q ${w} 0 ${w} ${r}`,
      `V ${h - r}`,
      `Q ${w} ${h} ${w - r} ${h}`,
      `H ${r}`,
      `Q 0 ${h} 0 ${h - r}`,
      `V ${r}`,
      `Q 0 0 ${r} 0`,
      "Z",
    ].join(" ");
  }

  return [
    `M ${reach} 0`,
    `H ${w - reach}`,
    `C ${w - reach + inset} 0 ${w} ${reach - inset} ${w} ${reach}`,
    `V ${h - reach}`,
    `C ${w} ${h - reach + inset} ${w - reach + inset} ${h} ${w - reach} ${h}`,
    `H ${reach}`,
    `C ${reach - inset} ${h} 0 ${h - reach + inset} 0 ${h - reach}`,
    `V ${reach}`,
    `C 0 ${reach - inset} ${reach - inset} 0 ${reach} 0`,
    "Z",
  ].join(" ");
}

export function archClipPath(input: ArchCornerInput): string {
  return `path('${archCornerPath(input)}')`;
}

/** CSS border-radius fallback when clip-path is unavailable. */
export function archBorderRadius(input: ArchCornerInput): string {
  const { reach } = resolveArchCorner(input);
  return `${Math.max(4, Math.round(reach))}px`;
}

export function archCornerCssVars(input: ArchCornerInput): Record<string, string> {
  const resolved = resolveArchCorner(input);
  return {
    "--firdawsi-shape-path": archCornerPath(input),
    "--firdawsi-shape-clip": archClipPath(input),
    "--firdawsi-shape-radius": archBorderRadius(input),
    "--firdawsi-shape-rise": String(resolved.rise),
    "--firdawsi-shape-shoulder": String(resolved.shoulder),
  };
}

export function archForState(
  width: number,
  height: number,
  preset: ArchPreset = "balanced",
  state: ArchState = "rest",
): ArchCornerInput {
  const { rise, shoulder } = ARCH_PRESETS[preset];
  return {
    width,
    height,
    rise: morphRise(rise, state),
    shoulder,
  };
}
