import type { PatternOptions, ResponsiveOptions } from "./types.js";

/**
 * Returns a copy tuned for a viewport. Small surfaces use fewer, bolder nodes;
 * large surfaces preserve the requested detail. This helper never mutates input.
 */
export function simplifyForViewport(
  options: PatternOptions,
  responsive: ResponsiveOptions,
): PatternOptions {
  const width = Math.max(1, responsive.viewportWidth);
  const scale = width < 360 ? 0.48 : width < 768 ? 0.7 : width < 1280 ? 0.88 : 1;
  const baseDensity = options.density ?? 0.65;
  const baseUnit = options.unitSize ?? 48;
  const simplificationTier =
    width < 480 ? "compact" : width < 1024 ? "regular" : "expanded";
  return {
    ...options,
    density: Math.max(0.1, baseDensity * scale),
    unitSize: baseUnit / Math.max(0.55, scale),
    stroke: (options.stroke ?? 2) * (scale < 0.7 ? 1.2 : 1),
    interlace: simplificationTier !== "compact" ? options.interlace : false,
    simplificationTier,
    maxNodes: Math.min(
      options.maxNodes ?? 1800,
      responsive.maxNodes ?? Math.max(80, Math.round(1800 * scale)),
    ),
  };
}
