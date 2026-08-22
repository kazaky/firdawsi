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
    "color", "space", "font", "radius", "shape", "stroke", "elevation",
    "opacity", "pattern", "motion", "zIndex", "size", "logical"
  ]) {
    assert.ok(canonical[group], `missing ${group} token group`);
  }
  assert.ok(canonical.shape.facet);
  assert.ok(canonical.shape.arch);
  assert.ok(canonical.shape.corner);
  assert.ok(canonical.logical.icon["directional-transform-rtl"]);
});

test("light, dark, and high-contrast expose matching semantic roles", () => {
  const expectedThemes = ["light", "dark", "highContrast"];
  assert.deepEqual(Object.keys(canonical.theme), expectedThemes);

  const roleSets = expectedThemes.map((name) => Object.keys(canonical.theme[name].color).sort());
  assert.ok(roleSets[0].length >= 12);
  assert.deepEqual(roleSets[1], roleSets[0]);
  assert.deepEqual(roleSets[2], roleSets[0]);
  assert.deepEqual(Object.keys(resolved.themes), expectedThemes);
});

test("checked-in CSS contains themes, RTL behavior, and reduced motion", () => {
  assert.match(css, /:root,/);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /\[data-theme="high-contrast"\]/);
  assert.match(css, /\[dir="rtl"\]/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /--firdawsi-color-background:/);
  assert.doesNotMatch(css, /\{color\./, "CSS aliases must be resolved");
});

test("atmosphere gradients and regional overlays are present", () => {
  assert.ok(canonical.gradient["courtyard-wash"]);
  assert.ok(canonical.gradient["lapis-veil"]);
  assert.ok(canonical.gradient["jade-depth"]);
  assert.match(css, /--firdawsi-gradient-courtyard-wash:/);
  assert.match(css, /\[data-region="maghrebi"\]/);
  assert.match(css, /\[data-region="andalusi"\]/);
  assert.match(css, /\[data-region="south-asian"\]/);
});

test("all aliases point to existing tokens", () => {
  const names = new Set(visit(canonical).map((token) => token.name));
  for (const token of visit(canonical)) {
    if (typeof token.value !== "string") continue;
    const alias = token.value.match(/^\{(.+)\}$/)?.[1];
    if (alias) assert.ok(names.has(alias), `${token.name} references missing ${alias}`);
  }
});
