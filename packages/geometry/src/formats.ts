import {
  generateConstructionRecipe,
} from "./generators.js";
import { PRESETS } from "./presets.js";
import { encodeSvgDataUri, sanitizeCssIdentifier } from "./sanitize.js";
import type {
  LegacyPatternRecipeV1,
  PatternKind,
  PatternPresetId,
  PatternRecipe,
  PatternResult,
} from "./types.js";
import {
  CONSTRUCTION_IDS,
  PATTERN_KINDS,
  PATTERN_PRESET_IDS,
  SUPPORTED_SYMMETRIES,
} from "./types.js";

export function toCssPattern(result: PatternResult, selector = `.geometry-${result.recipe.kind}`): string {
  const safeSelector = selector.startsWith(".")
    ? `.${sanitizeCssIdentifier(selector.slice(1))}`
    : `#${sanitizeCssIdentifier(selector.replace(/^#/, ""))}`;
  const repeat = result.recipe.repeatCell;
  return `${safeSelector}{background-image:url("${encodeSvgDataUri(result.svg)}");background-repeat:repeat;background-size:${repeat.width}px ${repeat.height}px}`;
}

export function serializeRecipe(recipe: PatternRecipe, pretty = false): string {
  return JSON.stringify(recipe, null, pretty ? 2 : 0);
}

const PRESET_BY_CONSTRUCTION = Object.fromEntries(
  Object.values(PRESETS).map((preset) => [preset.constructionId, preset.id]),
) as Record<PatternRecipe["construction"]["id"], PatternPresetId>;

const V1_PRESET_BY_KIND: Record<PatternKind, PatternPresetId> = {
  grid: "construction-grid",
  star: "khatam-8-star-cross",
  rosette: "rosette-12-almond",
  girih: "girih-10-straps",
  zellige: "zellige-star-cross",
  screen: "jali-8-screen",
  arch: "pointed-arch",
  corners: "khatam-corners",
  frame: "geometric-frame",
  arabesque: "rumi-medallion-6",
};

/**
 * Migrates a v1 parameter record to the closest reviewed v2 construction.
 * The former shortcut renderer is intentionally not retained.
 */
export function migrateRecipe(recipe: LegacyPatternRecipeV1): PatternRecipe {
  if (
    !recipe ||
    recipe.version !== 1 ||
    !PATTERN_KINDS.includes(recipe.kind) ||
    !recipe.options ||
    (recipe.options.symmetry !== undefined &&
      !SUPPORTED_SYMMETRIES.includes(recipe.options.symmetry))
  ) {
    throw new TypeError("Unsupported or invalid v1 geometry recipe.");
  }
  const presetId =
    recipe.kind === "star" && recipe.options.symmetry === 16
      ? "medallion-16-nested"
      : V1_PRESET_BY_KIND[recipe.kind];
  return generateConstructionRecipe(
    presetId,
    PRESETS[presetId].constructionId,
    recipe.options,
  ).recipe;
}

export function generateFromRecipe(
  recipe: PatternRecipe | LegacyPatternRecipeV1,
): PatternResult {
  if (recipe?.version === 1) {
    const migrated = migrateRecipe(recipe);
    return generateConstructionRecipe(
      migrated.presetId!,
      migrated.construction.id,
      migrated.options,
    );
  }
  if (
    !recipe ||
    recipe.version !== 2 ||
    !PATTERN_KINDS.includes(recipe.kind) ||
    !recipe.options ||
    !SUPPORTED_SYMMETRIES.includes(recipe.options.symmetry) ||
    !recipe.construction ||
    recipe.construction.version !== 2 ||
    !CONSTRUCTION_IDS.includes(recipe.construction.id)
  ) {
    throw new TypeError("Unsupported or invalid geometry recipe.");
  }
  const presetId =
    recipe.presetId && PATTERN_PRESET_IDS.includes(recipe.presetId)
      ? recipe.presetId
      : PRESET_BY_CONSTRUCTION[recipe.construction.id];
  if (!presetId) {
    throw new TypeError("Recipe construction has no compatible preset.");
  }
  return generateConstructionRecipe(presetId, recipe.construction.id, recipe.options);
}
