import assert from "node:assert/strict";
import test from "node:test";
import {
  ARCH_PRESETS,
  archBorderRadius,
  archClipPath,
  archCornerCssVars,
  archCornerPath,
  archForState,
  interpolateArch,
  morphRise,
  resolveArchCorner,
} from "./index.ts";

test("balanced corners stay convex and closed", () => {
  const path = archCornerPath({ width: 160, height: 48, rise: 0.32, shoulder: 0.34 });
  assert.match(path, /^M /);
  assert.match(path, /Z$/);
  assert.doesNotMatch(path, /NaN|Infinity/);
  assert.ok(path.includes("C ") || path.includes("Q "), "corners are curved, not a horseshoe silhouette");
});

test("zero rise falls back to a rounded rectangle", () => {
  const path = archCornerPath({ width: 120, height: 40, rise: 0, shoulder: 0.22 });
  assert.match(path, /Q /);
});

test("morphing pressed lowers rise relative to rest", () => {
  const rest = archForState(120, 40, "balanced", "rest");
  const pressed = archForState(120, 40, "balanced", "pressed");
  const hover = archForState(120, 40, "balanced", "hover");
  assert.ok(pressed.rise < rest.rise);
  assert.ok(hover.rise > rest.rise);
  assert.equal(morphRise(0.32, "rest"), 0.32);
});

test("interpolation is linear between construction ratios", () => {
  const mid = interpolateArch(
    { width: 100, height: 40, rise: 0.18, shoulder: 0.22 },
    { width: 100, height: 40, rise: 0.5, shoulder: 0.44 },
    0.5,
  );
  assert.ok(Math.abs(mid.rise - 0.34) < 1e-6);
  assert.ok(Math.abs(mid.shoulder - 0.33) < 1e-6);
});

test("clip-path and radius fallback stay usable in CSS", () => {
  const input = { width: 80, height: 40, rise: ARCH_PRESETS.balanced.rise, shoulder: ARCH_PRESETS.balanced.shoulder };
  assert.match(archClipPath(input), /^path\('/);
  assert.match(archBorderRadius(input), /px$/);
  const vars = archCornerCssVars(input);
  assert.ok(vars["--firdawsi-shape-path"]);
  assert.ok(Number(vars["--firdawsi-shape-rise"]) > 0);
});

test("resolved reach never exceeds half the shorter edge", () => {
  const resolved = resolveArchCorner({ width: 40, height: 40, rise: 0.5, shoulder: 0.48 });
  assert.ok(resolved.reach <= 19.5);
});
