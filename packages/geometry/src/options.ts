import { applyRegionalProfile } from "./profiles.js";
import { sanitizeColor } from "./sanitize.js";
import type { NormalizedOptions, PatternOptions, Symmetry } from "./types.js";
import { SUPPORTED_SYMMETRIES } from "./types.js";

const DEFAULT_PALETTE = ["#16302b", "#c89b3c", "#f3ead3", "#2f6f6d"] as const;

function finite(value: number | undefined, fallback: number, minimum: number, maximum: number): number {
  return value === undefined || !Number.isFinite(value)
    ? fallback
    : Math.min(maximum, Math.max(minimum, value));
}

export function normalizeOptions(options: PatternOptions = {}): NormalizedOptions {
  const profiled = applyRegionalProfile(options);
  const stroke = finite(profiled.stroke, 2, 0.25, 32);
  const symmetry = SUPPORTED_SYMMETRIES.includes(profiled.symmetry as Symmetry)
    ? (profiled.symmetry as Symmetry)
    : 8;
  const suppliedPalette = (profiled.palette?.length ? profiled.palette : DEFAULT_PALETTE)
    .slice(0, 12)
    .map((color, index) => sanitizeColor(color, DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]!));
  const palette = Array.from(
    { length: Math.max(DEFAULT_PALETTE.length, suppliedPalette.length) },
    (_, index) => suppliedPalette[index] ?? DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]!,
  );
  const simplificationTier = ["compact", "regular", "expanded"].includes(
    profiled.simplificationTier ?? "",
  )
    ? profiled.simplificationTier!
    : "expanded";
  const constructionOverlay = ["none", "guides", "full"].includes(
    profiled.constructionOverlay ?? "",
  )
    ? profiled.constructionOverlay!
    : "none";
  return {
    seed: String(profiled.seed ?? "geometry"),
    symmetry,
    unitSize: finite(profiled.unitSize, 48, 8, 512),
    stroke,
    interlace: profiled.interlace ?? false,
    density: finite(profiled.density, 0.65, 0.1, 1),
    crop: profiled.crop ?? "square",
    palette,
    regionalProfile: profiled.regionalProfile ?? "universal",
    accessibility: {
      title: profiled.accessibility?.title,
      description: profiled.accessibility?.description,
      decorative: profiled.accessibility?.decorative ?? true,
    },
    width: finite(profiled.width, 512, 32, 4096),
    height: finite(profiled.height, 512, 32, 4096),
    maxNodes: Math.floor(finite(profiled.maxNodes, 1800, 16, 20_000)),
    simplificationTier,
    constructionOverlay,
    petalDepth: finite(profiled.petalDepth, 0.22, 0.04, 0.48),
    botanicalFill: profiled.botanicalFill ?? true,
    strandWidth: finite(profiled.strandWidth, stroke, 0.25, 32),
    weaveGap: finite(profiled.weaveGap, stroke * 0.8, 0, 32),
  };
}

export function round(value: number): string {
  return Number(value.toFixed(3)).toString();
}
