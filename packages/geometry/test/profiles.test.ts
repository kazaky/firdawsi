import { describe, expect, it } from "vitest";
import {
  applyRegionalProfile,
  generatePreset,
  preferredPresetForProfile,
  profileDefaults,
  REGIONAL_PROFILES,
  type RegionalProfile,
} from "../src/index.js";

const PROFILES = Object.keys(REGIONAL_PROFILES) as RegionalProfile[];

describe("regional profiles", () => {
  it("maps every profile to a preferred preset and geometry defaults", () => {
    for (const profile of PROFILES) {
      const preferred = preferredPresetForProfile(profile);
      const defaults = profileDefaults(profile);
      expect(preferred).toBe(REGIONAL_PROFILES[profile].preferredPreset);
      expect(defaults.regionalProfile).toBe(profile);
      expect(defaults.density).toBeGreaterThan(0);
      expect(defaults.unitSize).toBeGreaterThan(0);
    }
  });

  it("fills only unspecified fields and lets caller options win", () => {
    const applied = applyRegionalProfile({
      regionalProfile: "persian",
      density: 0.41,
    });
    expect(applied.density).toBe(0.41);
    expect(applied.unitSize).toBe(REGIONAL_PROFILES.persian.unitSize);
    expect(applied.petalDepth).toBe(REGIONAL_PROFILES.persian.petalDepth);
  });

  it("does not alter options when regionalProfile is unset", () => {
    expect(applyRegionalProfile({ density: 0.5 })).toEqual({ density: 0.5 });
  });

  it("produces visibly different geometry across preferred presets", () => {
    const maghrebi = generatePreset(
      preferredPresetForProfile("maghrebi"),
      applyRegionalProfile({ regionalProfile: "maghrebi", seed: "profile", width: 240, height: 180 }),
    );
    const ottoman = generatePreset(
      preferredPresetForProfile("ottoman"),
      applyRegionalProfile({ regionalProfile: "ottoman", seed: "profile", width: 240, height: 180 }),
    );
    expect(maghrebi.recipe.presetId).toBe("zellige-star-cross");
    expect(ottoman.recipe.presetId).toBe("rumi-medallion-6");
    expect(maghrebi.svg).not.toBe(ottoman.svg);
    expect(maghrebi.recipe.options.density).toBe(0.78);
    expect(ottoman.recipe.options.density).toBe(0.58);
  });
});
