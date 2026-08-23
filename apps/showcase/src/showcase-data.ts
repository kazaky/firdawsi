import type {
  ConstructionOverlayMode,
  PatternPresetId,
  RegionalProfile,
} from "@firdawsi/geometry";

export const profiles: RegionalProfile[] = [
  "universal",
  "maghrebi",
  "andalusi",
  "mamluk",
  "ottoman",
  "persian",
  "south-asian",
];

export const profileCopy: Record<RegionalProfile, { place: string; note: string }> = {
  universal: { place: "Shared grammar", note: "A balanced, context-neutral baseline." },
  maghrebi: { place: "Western North Africa", note: "Compact rhythm and grounded proportions." },
  andalusi: { place: "Al-Andalus", note: "Measured intricacy with luminous intervals." },
  mamluk: { place: "Cairo & the Levant", note: "Assertive construction and clear hierarchy." },
  ottoman: { place: "Anatolia & Balkans", note: "Generous curves and spacious cadence." },
  persian: { place: "Iranian plateau", note: "Elongated rhythm with layered refinement." },
  "south-asian": { place: "South Asia", note: "Architectural clarity with a warm density." },
};

export const palettes = {
  courtyard: ["#113b67", "#0d684f", "#f3ead7", "#ca9338", "#a84932"],
  lapis: ["#153f73", "#267b70", "#f7efd9", "#d3a13e", "#963e2f"],
  jade: ["#0b5b49", "#173d65", "#f1e8d2", "#d5a23d", "#ad5438"],
  terracotta: ["#9e4733", "#133e6a", "#f6eddc", "#bf8b2e", "#276c5b"],
} as const;

export type PaletteName = keyof typeof palettes;
export type PresetCategory = "geometric" | "architectural" | "botanical" | "hybrid";

export const presetGroups: Record<PresetCategory, readonly PatternPresetId[]> = {
  geometric: [
    "khatam-8-star-cross",
    "rosette-12-almond",
    "medallion-16-nested",
    "girih-10-straps",
    "zellige-star-cross",
  ],
  architectural: [
    "jali-8-screen",
    "pointed-arch",
    "khatam-corners",
    "geometric-frame",
    "construction-grid",
  ],
  botanical: ["rumi-medallion-6", "palmette-roundel"],
  hybrid: ["floral-geometric-field"],
};

export interface GalleryPreset {
  id: PatternPresetId;
  label: string;
  note: string;
  wide?: boolean;
  overlay?: ConstructionOverlayMode;
}

export const galleryPresets: readonly GalleryPreset[] = [
  { id: "khatam-8-star-cross", label: "Khatam · 8", note: "Star, cross, kite, almond", wide: true, overlay: "guides" },
  { id: "rosette-12-almond", label: "Rosette · 12", note: "Compass-derived almond ring" },
  { id: "medallion-16-nested", label: "Medallion · 16", note: "Nested focal construction" },
  { id: "girih-10-straps", label: "Girih · 10", note: "Decagon prototile field", wide: true },
  { id: "zellige-star-cross", label: "Zellige star-cross", note: "Exact square repeat" },
  { id: "jali-8-screen", label: "Jali · 8", note: "Continuous 4.8.8 lattice" },
  { id: "rumi-medallion-6", label: "Rumi medallion", note: "Six-fold botanical whorl", overlay: "guides" },
  { id: "palmette-roundel", label: "Palmette roundel", note: "Bilateral focal study" },
  { id: "floral-geometric-field", label: "Floral-geometric field", note: "Repeat-governed leaf lattice", wide: true },
];

export function categoryForPreset(presetId: PatternPresetId): PresetCategory {
  for (const [category, ids] of Object.entries(presetGroups) as [
    PresetCategory,
    readonly PatternPresetId[],
  ][]) {
    if (ids.includes(presetId)) return category;
  }
  return "geometric";
}
