import type {
  CropMode,
  PatternOptions,
  PatternPresetId,
  RegionalProfile,
} from "./types.js";

/** Geometry defaults associated with a named regional profile. */
export interface RegionalProfileDefaults {
  readonly preferredPreset: PatternPresetId;
  readonly density: number;
  readonly unitSize: number;
  readonly strandWidth: number;
  readonly crop: CropMode;
  readonly interlace: boolean;
  readonly stroke?: number;
  readonly petalDepth?: number;
  readonly weaveGap?: number;
  readonly botanicalFill?: boolean;
}

/**
 * Research-informed starting points for proportion and rhythm.
 * Not authenticity presets — explicit caller options always win.
 */
export const REGIONAL_PROFILES = {
  universal: {
    preferredPreset: "khatam-8-star-cross",
    density: 0.62,
    unitSize: 48,
    strandWidth: 2,
    crop: "square",
    interlace: true,
    stroke: 2,
  },
  maghrebi: {
    preferredPreset: "zellige-star-cross",
    density: 0.78,
    unitSize: 42,
    strandWidth: 1.75,
    crop: "square",
    interlace: false,
    stroke: 1.75,
  },
  andalusi: {
    preferredPreset: "rosette-12-almond",
    density: 0.7,
    unitSize: 52,
    strandWidth: 1.85,
    crop: "circle",
    interlace: false,
    stroke: 1.5,
  },
  mamluk: {
    preferredPreset: "medallion-16-nested",
    density: 0.84,
    unitSize: 44,
    strandWidth: 2.4,
    crop: "circle",
    interlace: true,
    stroke: 2.2,
    weaveGap: 1.8,
  },
  ottoman: {
    preferredPreset: "rumi-medallion-6",
    density: 0.58,
    unitSize: 64,
    strandWidth: 2.2,
    crop: "circle",
    interlace: false,
    stroke: 1.8,
    petalDepth: 0.22,
    botanicalFill: true,
    weaveGap: 1.6,
  },
  persian: {
    preferredPreset: "floral-geometric-field",
    density: 0.68,
    unitSize: 72,
    strandWidth: 1.6,
    crop: "square",
    interlace: false,
    stroke: 1.5,
    petalDepth: 0.28,
    botanicalFill: true,
    weaveGap: 1.2,
  },
  "south-asian": {
    preferredPreset: "jali-8-screen",
    density: 0.64,
    unitSize: 46,
    strandWidth: 2.1,
    crop: "square",
    interlace: true,
    stroke: 1.9,
    weaveGap: 1.5,
  },
} as const satisfies Record<RegionalProfile, RegionalProfileDefaults>;

export function preferredPresetForProfile(profile: RegionalProfile): PatternPresetId {
  return REGIONAL_PROFILES[profile].preferredPreset;
}

export function profileDefaults(profile: RegionalProfile): PatternOptions {
  const {
    preferredPreset: _preferred,
    ...geometry
  } = REGIONAL_PROFILES[profile];
  return {
    regionalProfile: profile,
    ...geometry,
  };
}

/**
 * Fills only unspecified option fields from the selected regional profile.
 * Explicit caller values always win. No-ops when `regionalProfile` is unset
 * so the universal core keeps its existing numeric fallbacks.
 */
export function applyRegionalProfile(options: PatternOptions = {}): PatternOptions {
  if (options.regionalProfile === undefined) {
    return options;
  }
  const defaults = profileDefaults(options.regionalProfile);
  return { ...defaults, ...options, regionalProfile: options.regionalProfile };
}
