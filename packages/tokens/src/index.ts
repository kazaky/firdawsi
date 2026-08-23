export {
  regions,
  springs,
  themes,
  tokens,
  type RegionName,
  type SemanticColorRole,
  type SpringName,
  type ThemeName,
  type TokenName
} from "./generated.js";

import { springs as springTable, type SpringName } from "./generated.js";

export const themeAttribute = {
  light: "light",
  dark: "dark",
  highContrast: "high-contrast"
} as const;

export type ThemeAttribute = (typeof themeAttribute)[keyof typeof themeAttribute];

/** Canonical regional profile IDs, matching spec/05-regional-profiles.md. */
export const REGION_IDS = [
  "universal",
  "andalusi-maghrebi",
  "mamluk",
  "ottoman",
  "persian-central-asian",
  "mughal"
] as const;

export type RegionId = (typeof REGION_IDS)[number];

/** The dual-optical type roles. Every role carries independent Arabic metrics. */
export const TYPE_ROLES = [
  "display-lg",
  "display-md",
  "display-sm",
  "headline-lg",
  "headline-md",
  "headline-sm",
  "title-lg",
  "title-md",
  "title-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "label-lg",
  "label-md",
  "label-sm"
] as const;

export type TypeRole = (typeof TYPE_ROLES)[number];

/** Returns the CSS custom property name for a dot-separated token path. */
export function cssVariable(tokenPath: string): `--firdawsi-${string}` {
  const kebabPath = tokenPath
    .replace(/\.-/g, ".n")
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/\./g, "-");

  return `--firdawsi-${kebabPath}`;
}

/** Returns a CSS var() expression with an optional fallback. */
export function tokenVar(tokenPath: string, fallback?: string): string {
  const name = cssVariable(tokenPath);
  return fallback === undefined ? `var(${name})` : `var(${name}, ${fallback})`;
}

export interface SpringSpec {
  stiffness: number;
  damping: number;
  mass: number;
  dampingRatio: number;
  durationMs: number;
}

/** Looks up an Alberca spring by name. */
export function spring(name: SpringName): SpringSpec {
  return springTable[name] as SpringSpec;
}

/**
 * Samples an Alberca spring at a normalised time in [0, 1] of its settling
 * duration, returning displacement toward the target where 0 is start and 1 is
 * rest. Underdamped springs briefly exceed 1, which is the overshoot that gives
 * the motion its character.
 */
export function sampleSpring(name: SpringName, progress: number): number {
  const { stiffness, damping, mass, durationMs } = spring(name);
  if (durationMs === 0) return 1;

  const time = Math.max(0, Math.min(1, progress)) * (durationMs / 1000);
  const angularFrequency = Math.sqrt(stiffness / mass);
  const ratio = damping / (2 * Math.sqrt(stiffness * mass));

  if (ratio < 1) {
    const damped = angularFrequency * Math.sqrt(1 - ratio * ratio);
    return (
      1 -
      Math.exp(-ratio * angularFrequency * time) *
        (Math.cos(damped * time) + ((ratio * angularFrequency) / damped) * Math.sin(damped * time))
    );
  }

  return 1 - Math.exp(-angularFrequency * time) * (1 + angularFrequency * time);
}
