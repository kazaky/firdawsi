import type { ConstructionOverlay, Point } from "./construction/index.js";

export const SUPPORTED_SYMMETRIES = [2, 4, 6, 8, 10, 12, 16] as const;
export const PATTERN_KINDS = [
  "grid",
  "star",
  "rosette",
  "girih",
  "zellige",
  "screen",
  "arch",
  "corners",
  "frame",
  "arabesque",
] as const;

export type Symmetry = (typeof SUPPORTED_SYMMETRIES)[number];
export type PatternKind = (typeof PATTERN_KINDS)[number];
export type CropMode = "none" | "square" | "circle";
export type SimplificationTier = "compact" | "regular" | "expanded";
export type ConstructionOverlayMode = "none" | "guides" | "full";
export type RegionalProfile =
  | "universal"
  | "maghrebi"
  | "andalusi"
  | "mamluk"
  | "ottoman"
  | "persian"
  | "south-asian";

export interface AccessibilityOptions {
  title?: string;
  description?: string;
  decorative?: boolean;
}

export interface PatternOptions {
  seed?: string | number;
  symmetry?: Symmetry;
  unitSize?: number;
  stroke?: number;
  interlace?: boolean;
  density?: number;
  crop?: CropMode;
  palette?: readonly string[];
  regionalProfile?: RegionalProfile;
  accessibility?: AccessibilityOptions;
  width?: number;
  height?: number;
  maxNodes?: number;
  simplificationTier?: SimplificationTier;
  constructionOverlay?: ConstructionOverlayMode;
  petalDepth?: number;
  botanicalFill?: boolean;
  strandWidth?: number;
  weaveGap?: number;
  presetId?: BotanicalPatternPresetId;
}

export interface NormalizedOptions {
  seed: string;
  symmetry: Symmetry;
  unitSize: number;
  stroke: number;
  interlace: boolean;
  density: number;
  crop: CropMode;
  palette: readonly string[];
  regionalProfile: RegionalProfile;
  accessibility: AccessibilityOptions;
  width: number;
  height: number;
  maxNodes: number;
  simplificationTier: SimplificationTier;
  constructionOverlay: ConstructionOverlayMode;
  petalDepth: number;
  botanicalFill: boolean;
  strandWidth: number;
  weaveGap: number;
}

export const CONSTRUCTION_IDS = [
  "orthogonal-grid-v2",
  "radial-grid-v2",
  "khatam-8-v2",
  "rosette-12-v2",
  "medallion-16-v2",
  "girih-10-v2",
  "zellige-star-cross-v2",
  "jali-8-v2",
  "pointed-arch-v2",
  "khatam-corners-v2",
  "geometric-frame-v2",
  "rumi-medallion-6-v2",
  "palmette-roundel-v2",
  "floral-geometric-field-v2",
] as const;

export type ConstructionId = (typeof CONSTRUCTION_IDS)[number];

export const PATTERN_PRESET_IDS = [
  "construction-grid",
  "khatam-8-star-cross",
  "rosette-12-almond",
  "medallion-16-nested",
  "girih-10-straps",
  "zellige-star-cross",
  "jali-8-screen",
  "pointed-arch",
  "khatam-corners",
  "geometric-frame",
  "rumi-medallion-6",
  "palmette-roundel",
  "floral-geometric-field",
] as const;

export type PatternPresetId = (typeof PATTERN_PRESET_IDS)[number];
export type BotanicalPatternPresetId =
  | "rumi-medallion-6"
  | "palmette-roundel"
  | "floral-geometric-field";

export interface LegacyPatternRecipeV1 {
  version: 1;
  kind: PatternKind;
  options: PatternOptions;
}

export interface RepeatCell {
  id: string;
  width: number;
  height: number;
  vectors: readonly [readonly [number, number], readonly [number, number]];
  boundary: readonly Point[];
}

export interface PatternLayer {
  id: string;
  role:
    | "field"
    | "module"
    | "strap"
    | "outline"
    | "construction"
    | "boundary"
    | "stem"
    | "foliage"
    | "flower"
    | "connector"
    | "void";
  sourceIds: readonly string[];
}

export interface PatternTopology {
  mode: "periodic" | "bounded" | "focal";
  rotationOrder: number;
  interlace: "none" | "continuous-straps" | "alternating-crossings";
  edgeContinuity: "repeat-matched" | "frame-terminated" | "not-applicable";
  prototiles: readonly string[];
}

export interface PatternReviewState {
  geometry: "verified" | "research-draft";
  cultural: "research-draft" | "expert-review-pending" | "expert-reviewed";
  limitations: readonly string[];
}

export interface PatternRecipe {
  version: 2;
  kind: PatternKind;
  presetId?: PatternPresetId;
  construction: {
    id: ConstructionId;
    version: 2;
  };
  repeatCell: RepeatCell;
  sourceIds: readonly string[];
  layers: readonly PatternLayer[];
  topology: PatternTopology;
  review: PatternReviewState;
  simplificationTier: SimplificationTier;
  options: NormalizedOptions;
}

export interface PatternPreset {
  id: PatternPresetId;
  label: string;
  kind: PatternKind;
  constructionId: ConstructionId;
  description: string;
  sourceIds: readonly string[];
  defaults: Readonly<PatternOptions>;
  validSymmetries: readonly Symmetry[];
  topology: Pick<PatternTopology, "mode" | "rotationOrder" | "interlace" | "edgeContinuity" | "prototiles">;
}

export interface PatternPresetSymmetryMap {
  "construction-grid": Symmetry;
  "khatam-8-star-cross": 8;
  "rosette-12-almond": 12;
  "medallion-16-nested": 16;
  "girih-10-straps": 10;
  "zellige-star-cross": 8;
  "jali-8-screen": 8;
  "pointed-arch": 4;
  "khatam-corners": 8;
  "geometric-frame": 8;
  "rumi-medallion-6": 6;
  "palmette-roundel": 2;
  "floral-geometric-field": 8 | 12;
}

export type PatternPresetOptions<Id extends PatternPresetId = PatternPresetId> = Omit<
  PatternOptions,
  "symmetry"
> & {
  symmetry?: PatternPresetSymmetryMap[Id];
};

export interface PerformanceDiagnostics {
  nodeCount: number;
  maxNodes: number;
  truncated: boolean;
  estimatedComplexity: "low" | "medium" | "high";
  warnings: string[];
}

export interface PatternResult {
  svg: string;
  css?: string;
  recipe: PatternRecipe;
  constructionOverlay: ConstructionOverlay;
  diagnostics: PerformanceDiagnostics;
}

export interface ResponsiveOptions {
  viewportWidth: number;
  reducedMotion?: boolean;
  maxNodes?: number;
}
