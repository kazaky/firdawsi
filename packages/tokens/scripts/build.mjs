import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(packageRoot, "src/tokens.json");
const generatedDir = resolve(packageRoot, "generated");
const source = JSON.parse(await readFile(sourcePath, "utf8"));

const isToken = (value) =>
  value !== null && typeof value === "object" && "$value" in value;

function collect(node, path = [], inheritedType, output = {}) {
  if (!node || typeof node !== "object") return output;
  const type = node.$type ?? inheritedType;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    const nextPath = [...path, key];
    if (isToken(value)) {
      output[nextPath.join(".")] = { type: value.$type ?? type, value: value.$value };
    } else {
      collect(value, nextPath, value?.$type ?? type, output);
    }
  }
  return output;
}

const allTokens = collect(source);
const baseTokens = Object.fromEntries(
  Object.entries(allTokens).filter(([name]) => !name.startsWith("theme."))
);
const themeNames = Object.keys(source.theme ?? {});

function resolveAlias(value, stack = []) {
  if (typeof value !== "string") return value;
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;
  const name = match[1];
  if (stack.includes(name)) {
    throw new Error(`Circular token reference: ${[...stack, name].join(" -> ")}`);
  }
  const target = allTokens[name];
  if (!target) throw new Error(`Unknown token reference: ${name}`);
  return resolveAlias(target.value, [...stack, name]);
}

function resolveEmbeddedAliases(value) {
  if (typeof value !== "string") return value;
  return value.replace(/\{([^}]+)\}/g, (_, name) => {
    const target = allTokens[name];
    if (!target) throw new Error(`Unknown token reference: ${name}`);
    const resolved = resolveAlias(target.value);
    if (resolved && typeof resolved === "object" && "value" in resolved && "unit" in resolved) {
      return `${resolved.value}${resolved.unit}`;
    }
    return String(resolved);
  });
}

function cssValue(value, type) {
  const resolved = resolveAlias(value);
  if (resolved && typeof resolved === "object" && "value" in resolved && "unit" in resolved) {
    return `${resolved.value}${resolved.unit}`;
  }
  if (type === "fontFamily" && Array.isArray(resolved)) {
    return resolved.map((family) => family.includes(" ") ? `"${family}"` : family).join(", ");
  }
  if (type === "cubicBezier" && Array.isArray(resolved)) {
    return `cubic-bezier(${resolved.join(", ")})`;
  }
  if (type === "shadow" && resolved && typeof resolved === "object") {
    return `${resolved.offsetX} ${resolved.offsetY} ${resolved.blur} ${resolved.spread} ${resolved.color}`;
  }
  return resolveEmbeddedAliases(String(resolved));
}

const cssName = (name) =>
  `--firdawsi-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/\./g, "-")}`;

function declarations(tokens, prefixToRemove = "") {
  return Object.entries(tokens)
    .map(([name, token]) => {
      const publicName = prefixToRemove ? name.replace(prefixToRemove, "") : name;
      return `  ${cssName(publicName)}: ${cssValue(token.value, token.type)};`;
    })
    .join("\n");
}

const themes = Object.fromEntries(themeNames.map((themeName) => {
  const prefix = `theme.${themeName}.`;
  const tokens = Object.fromEntries(
    Object.entries(allTokens).filter(([name]) => name.startsWith(prefix))
  );
  return [
    themeName,
    Object.fromEntries(
      Object.entries(tokens).map(([name, token]) => [
        name.slice(prefix.length),
        resolveAlias(token.value)
      ])
    )
  ];
}));

const baseResolved = Object.fromEntries(
  Object.entries(baseTokens).map(([name, token]) => [name, resolveAlias(token.value)])
);

const css = `/* Generated from src/tokens.json. Do not edit directly. */
:root,
[data-theme="light"] {
${declarations(baseTokens)}
${declarations(
  Object.fromEntries(Object.entries(allTokens).filter(([name]) => name.startsWith("theme.light."))),
  "theme.light."
)}
  color-scheme: light;
}

[data-theme="dark"] {
${declarations(
  Object.fromEntries(Object.entries(allTokens).filter(([name]) => name.startsWith("theme.dark."))),
  "theme.dark."
)}
  color-scheme: dark;
}

[data-theme="high-contrast"] {
${declarations(
  Object.fromEntries(Object.entries(allTokens).filter(([name]) => name.startsWith("theme.highContrast."))),
  "theme.highContrast."
)}
  color-scheme: dark;
}

[dir="rtl"] {
  --firdawsi-logical-icon-directional-transform: var(--firdawsi-logical-icon-directional-transform-rtl);
}

[dir="ltr"] {
  --firdawsi-logical-icon-directional-transform: var(--firdawsi-logical-icon-directional-transform-ltr);
}

/* Regional profile overlays — subtle surface/accent/pattern shifts, not full themes. */
[data-region="universal"] {
  --firdawsi-color-surface: #ffffff;
  --firdawsi-color-surface-subtle: #e8ebe9;
  --firdawsi-color-accent: #a66d12;
  --firdawsi-opacity-pattern: 0.09;
}

[data-region="maghrebi"] {
  --firdawsi-color-surface: #fbf6ee;
  --firdawsi-color-surface-subtle: #f0e6d4;
  --firdawsi-color-accent: #a66d12;
  --firdawsi-color-primary: #1f5a50;
  --firdawsi-opacity-pattern: 0.11;
}

[data-region="andalusi"] {
  --firdawsi-color-surface: #f7faf8;
  --firdawsi-color-surface-subtle: #e4efe9;
  --firdawsi-color-accent: #c89b3c;
  --firdawsi-color-primary: #245d78;
  --firdawsi-opacity-pattern: 0.1;
}

[data-region="mamluk"] {
  --firdawsi-color-surface: #f4f1ea;
  --firdawsi-color-surface-subtle: #e6dfd0;
  --firdawsi-color-accent: #843d2e;
  --firdawsi-color-primary: #184f78;
  --firdawsi-opacity-pattern: 0.12;
}

[data-region="ottoman"] {
  --firdawsi-color-surface: #f5f8fb;
  --firdawsi-color-surface-subtle: #e2ebf3;
  --firdawsi-color-accent: #c79a3b;
  --firdawsi-color-primary: #173b6c;
  --firdawsi-opacity-pattern: 0.08;
}

[data-region="persian"] {
  --firdawsi-color-surface: #faf7f2;
  --firdawsi-color-surface-subtle: #efe6d8;
  --firdawsi-color-accent: #bd6048;
  --firdawsi-color-primary: #195847;
  --firdawsi-opacity-pattern: 0.1;
}

[data-region="south-asian"] {
  --firdawsi-color-surface: #f8f4ec;
  --firdawsi-color-surface-subtle: #ebe3d2;
  --firdawsi-color-accent: #a66d12;
  --firdawsi-color-primary: #2d6b5a;
  --firdawsi-opacity-pattern: 0.11;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --firdawsi-motion-duration-fast: 0ms;
    --firdawsi-motion-duration-normal: 0ms;
    --firdawsi-motion-duration-slow: 0ms;
    --firdawsi-motion-duration-ceremonial: 0ms;
  }
}
`;

const resolvedJson = `${JSON.stringify({
  $description: "Generated, resolved token values for platform adapters.",
  base: baseResolved,
  themes
}, null, 2)}\n`;

const generatedTs = `/* Generated from tokens.json. Do not edit directly. */
export const tokens = ${JSON.stringify(baseResolved, null, 2)} as const;

export const themes = ${JSON.stringify(themes, null, 2)} as const;

export type TokenName = keyof typeof tokens;
export type ThemeName = keyof typeof themes;
export type SemanticColorRole = keyof (typeof themes)["light"];
`;

await mkdir(generatedDir, { recursive: true });
await writeFile(resolve(generatedDir, "tokens.css"), css);
await writeFile(resolve(generatedDir, "tokens.json"), resolvedJson);
await writeFile(resolve(packageRoot, "src/generated.ts"), generatedTs);
