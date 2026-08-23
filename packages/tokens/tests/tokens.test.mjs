import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const canonical = JSON.parse(await readFile(resolve(root, "src/tokens.json"), "utf8"));
const resolved = JSON.parse(await readFile(resolve(root, "generated/tokens.json"), "utf8"));
const css = await readFile(resolve(root, "generated/tokens.css"), "utf8");

function visit(node, path = [], inheritedType, tokens = []) {
  if (!node || typeof node !== "object") return tokens;
  const type = node.$type ?? inheritedType;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    const nextPath = [...path, key];
    if (value && typeof value === "object" && "$value" in value) {
      tokens.push({ name: nextPath.join("."), type: value.$type ?? type, value: value.$value });
    } else {
      visit(value, nextPath, value?.$type ?? type, tokens);
    }
  }
  return tokens;
}

const TYPE_ROLES = [
  "display-lg", "display-md", "display-sm",
  "headline-lg", "headline-md", "headline-sm",
  "title-lg", "title-md", "title-sm",
  "body-lg", "body-md", "body-sm",
  "label-lg", "label-md", "label-sm"
];

test("canonical source uses typed DTCG token objects", () => {
  const tokens = visit(canonical);
  assert.ok(tokens.length >= 100, "expected a useful cross-platform token set");
  for (const token of tokens) {
    assert.ok(token.type, `${token.name} must inherit or declare $type`);
    assert.notEqual(token.value, undefined, `${token.name} must declare $value`);
  }
});

test("required foundations and distinctive shape groups exist", () => {
  for (const group of [
    "color", "sebka", "space", "font", "radius", "shape", "focus", "stroke",
    "elevation", "opacity", "state", "pattern", "motion", "zIndex", "size",
    "density", "logical", "region"
  ]) {
    assert.ok(canonical[group], `missing ${group} token group`);
  }
  assert.ok(canonical.shape.facet);
  assert.ok(canonical.shape.arch);
  assert.ok(canonical.shape.corner);
  assert.ok(canonical.logical.icon["directional-transform-rtl"]);
});

test("sebka scale is a 2^(1/4) progression anchored at 16px", () => {
  const step = canonical.sebka.step;
  assert.equal(step["0"].$value.value, 16, "step 0 is the 16px anchor");

  // Every fourth step is an octave; every second step is the octagon ratio.
  assert.equal(step["4"].$value.value, 32);
  assert.equal(step["8"].$value.value, 64);

  const ratios = canonical.sebka.ratio;
  assert.ok(Math.abs(ratios.octagon.$value - Math.SQRT2) < 1e-6, "octagon ratio is root-2");
  assert.ok(Math.abs(ratios.silver.$value - (1 + Math.SQRT2)) < 1e-6, "silver ratio is 1+root-2");
  assert.ok(
    Math.abs(ratios.step.$value ** 2 - ratios.octagon.$value) < 1e-4,
    "one micro step squared is the octagon ratio"
  );

  // Steps ascend monotonically.
  const ordered = ["-2", "-1", "0", "1", "2", "3", "4", "5", "6", "7", "8"];
  for (let index = 1; index < ordered.length; index += 1) {
    assert.ok(
      step[ordered[index]].$value.value > step[ordered[index - 1]].$value.value,
      `step ${ordered[index]} must exceed step ${ordered[index - 1]}`
    );
  }
});

test("every type role carries independent Arabic optical metrics", () => {
  assert.deepEqual(Object.keys(canonical.font.role).filter((key) => !key.startsWith("$")), TYPE_ROLES);

  for (const role of TYPE_ROLES) {
    const definition = canonical.font.role[role];
    for (const field of ["size", "size-arabic", "line-height", "line-height-arabic", "weight", "tracking"]) {
      assert.ok(definition[field], `${role} must define ${field}`);
    }
    assert.ok(
      definition["line-height-arabic"].$value > definition["line-height"].$value,
      `${role} Arabic leading must exceed Latin leading`
    );
  }
});

test("Arabic tracking token is zero so cursive joining cannot be broken", () => {
  assert.equal(canonical.font.tracking.arabic.$value.value, 0);
});

test("light, dark, and high-contrast expose matching semantic roles", () => {
  const expectedThemes = ["light", "dark", "highContrast"];
  assert.deepEqual(Object.keys(canonical.theme), expectedThemes);

  const roleSets = expectedThemes.map((name) => Object.keys(canonical.theme[name].color).sort());
  assert.ok(roleSets[0].length >= 50, "expected a semantically complete role set");
  assert.deepEqual(roleSets[1], roleSets[0]);
  assert.deepEqual(roleSets[2], roleSets[0]);
  assert.deepEqual(Object.keys(resolved.themes), expectedThemes);
});

test("themes expose container, outline, inverse, and status roles", () => {
  for (const theme of ["light", "dark", "highContrast"]) {
    const roles = canonical.theme[theme].color;
    for (const role of [
      "primary-container", "on-primary-container",
      "secondary-container", "on-secondary-container",
      "tertiary-container", "on-tertiary-container",
      "error-container", "on-error-container",
      "success", "warning", "info",
      "outline", "outline-variant",
      "inverse-surface", "inverse-on-surface", "inverse-primary",
      "on-surface", "on-surface-variant", "focus-contrast"
    ]) {
      assert.ok(roles[role], `${theme} is missing ${role}`);
    }
  }
});

test("surface tiers replace blurred elevation inside the document plane", () => {
  for (const theme of ["light", "dark", "highContrast"]) {
    const roles = canonical.theme[theme].color;
    for (const tier of [1, 2, 3, 4]) {
      assert.ok(roles[`surface-tier-${tier}`], `${theme} is missing surface-tier-${tier}`);
    }
  }
  assert.equal(canonical.elevation.tonal, undefined, "tonal elevation is superseded by surface tiers");
});

test("state layer opacities exist and stay within a usable range", () => {
  for (const layer of ["hover", "focus", "pressed", "dragged", "selected"]) {
    const value = canonical.state[layer].$value;
    assert.ok(value > 0 && value < 0.3, `state.${layer} should be a subtle overlay`);
  }
});

test("Alberca springs are physically grounded and ordered by damping", () => {
  const { snap, settle, ripple, calm } = resolved.springs;

  for (const [name, sample] of Object.entries(resolved.springs)) {
    assert.ok(sample.stiffness > 0, `${name} needs positive stiffness`);
    assert.ok(sample.durationMs > 0, `${name} needs a derived duration`);
    assert.ok(sample.dampingRatio > 0.5, `${name} must not oscillate visibly`);
    assert.ok(sample.dampingRatio <= 1.01, `${name} must not be overdamped`);
  }

  // Water settling: the snappier the spring, the closer to critical damping.
  assert.ok(snap.dampingRatio > settle.dampingRatio);
  assert.ok(settle.dampingRatio > ripple.dampingRatio);
  assert.ok(Math.abs(calm.dampingRatio - 1) < 0.02, "calm is critically damped");
});

test("strapwork focus tokens describe a two-stroke band", () => {
  assert.ok(canonical.focus.strap.gap);
  assert.ok(canonical.focus.strap.core);
  assert.ok(canonical.focus.strap.offset);
});

test("checked-in CSS contains themes, RTL behavior, and reduced motion", () => {
  assert.match(css, /:root,/);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /\[data-theme="high-contrast"\]/);
  assert.match(css, /\[dir="rtl"\]/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /--firdawsi-color-background:/);
  assert.doesNotMatch(css, /\{color\./, "CSS aliases must be resolved");
  assert.doesNotMatch(css, /--firdawsi-[a-z0-9-]*--/, "no malformed double-hyphen custom properties");
});

test("CSS exposes sebka steps, type roles, and spring durations", () => {
  assert.match(css, /--firdawsi-sebka-step-n2:/, "negative steps use an n prefix");
  assert.match(css, /--firdawsi-sebka-step-0:/);
  assert.match(css, /--firdawsi-font-role-body-md-size:/);
  assert.match(css, /--firdawsi-font-role-body-md-size-arabic:/);
  assert.match(css, /--firdawsi-font-family-display: "El Messiri"/);
  assert.match(css, /--firdawsi-motion-spring-settle-duration:/);
  assert.match(css, /--firdawsi-motion-spring-settle-damping-ratio:/);
  assert.match(css, /--firdawsi-color-surface-tier-2:/);
  assert.match(css, /--firdawsi-state-hover:/);
});

test("atmosphere gradients and regional overlays are present", () => {
  assert.ok(canonical.gradient["courtyard-wash"]);
  assert.ok(canonical.gradient["lapis-veil"]);
  assert.ok(canonical.gradient["jade-depth"]);
  assert.match(css, /--firdawsi-gradient-courtyard-wash:/);
});

test("regional profiles use spec IDs and keep legacy aliases resolvable", () => {
  const specIds = [
    "universal",
    "andalusi-maghrebi",
    "mamluk",
    "ottoman",
    "persian-central-asian",
    "mughal"
  ];
  assert.deepEqual(Object.keys(canonical.region).filter((key) => !key.startsWith("$")), specIds);

  for (const id of specIds) {
    assert.match(css, new RegExp(`\\[data-region="${id}"\\]`), `CSS must scope ${id}`);
  }

  // Legacy aliases from v1 must still select something.
  for (const alias of ["andalusi", "maghrebi", "persian", "south-asian"]) {
    assert.match(css, new RegExp(`\\[data-region="${alias}"\\]`), `alias ${alias} must remain usable`);
  }

  assert.deepEqual(resolved.regions["andalusi-maghrebi"].aliases, ["andalusi", "maghrebi"]);
  assert.deepEqual(resolved.regions["mughal"].aliases, ["south-asian"]);
});

test("profiles never tune semantic status colours, type, or accessibility roles", () => {
  const forbidden = ["success", "warning", "info", "error", "on-error", "focus", "text"];
  for (const [id, profile] of Object.entries(canonical.region)) {
    if (id.startsWith("$")) continue;
    for (const role of Object.keys(profile.color ?? {})) {
      if (role.startsWith("$")) continue;
      assert.ok(
        !forbidden.includes(role),
        `region ${id} must not override the invariant role ${role}`
      );
    }
    assert.equal(profile.font, undefined, `region ${id} must not retune type`);
  }
});

test("Andalusi is the default surface family, not a peer overlay", () => {
  // The light theme's surface must come from the carved-plaster ramp, so the
  // system reads Andalusi before any profile is applied.
  assert.match(canonical.theme.light.color.surface.$value, /yeso/);
  assert.match(canonical.theme.light.color.background.$value, /yeso/);
  assert.equal(
    canonical.region["andalusi-maghrebi"].color.surface.$value,
    "{color.primitive.yeso.0}",
    "the Andalusi overlay restates the baseline"
  );
});

test("all aliases point to existing tokens", () => {
  const names = new Set(visit(canonical).map((token) => token.name));
  for (const token of visit(canonical)) {
    if (typeof token.value !== "string") continue;
    const alias = token.value.match(/^\{(.+)\}$/)?.[1];
    if (alias) assert.ok(names.has(alias), `${token.name} references missing ${alias}`);
  }
});
