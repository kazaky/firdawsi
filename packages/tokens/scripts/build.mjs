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
const themeNames = Object.keys(source.theme ?? {});
const regionNames = Object.keys(source.region ?? {});

const isScoped = (name) => name.startsWith("theme.") || name.startsWith("region.");
const baseTokens = Object.fromEntries(
  Object.entries(allTokens).filter(([name]) => !isScoped(name))
);

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

function flatten(value) {
  if (value && typeof value === "object" && "value" in value && "unit" in value) {
    return `${value.value}${value.unit}`;
  }
  return String(value);
}

function resolveEmbeddedAliases(value) {
  if (typeof value !== "string") return value;
  return value.replace(/\{([^}]+)\}/g, (_, name) => {
    const target = allTokens[name];
    if (!target) throw new Error(`Unknown token reference: ${name}`);
    return flatten(resolveAlias(target.value));
  });
}

function cssValue(value, type) {
  const resolved = resolveAlias(value);
  if (resolved && typeof resolved === "object" && "value" in resolved && "unit" in resolved) {
    return flatten(resolved);
  }
  if (type === "fontFamily" && Array.isArray(resolved)) {
    return resolved.map((family) => (family.includes(" ") ? `"${family}"` : family)).join(", ");
  }
  if (type === "cubicBezier" && Array.isArray(resolved)) {
    return `cubic-bezier(${resolved.join(", ")})`;
  }
  if (type === "shadow" && resolved && typeof resolved === "object") {
    return `${resolved.offsetX} ${resolved.offsetY} ${resolved.blur} ${resolved.spread} ${resolved.color}`;
  }
  return resolveEmbeddedAliases(String(resolved));
}

/**
 * Negative sebka steps would emit a double hyphen, which reads as a malformed
 * custom property. `sebka.step.-2` becomes `--firdawsi-sebka-step-n2`.
 */
const cssName = (name) =>
  `--firdawsi-${name
    .replace(/\.-/g, ".n")
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/\./g, "-")}`;

function declarations(tokens, prefixToRemove = "") {
  return Object.entries(tokens)
    .map(([name, token]) => {
      const publicName = prefixToRemove ? name.slice(prefixToRemove.length) : name;
      return `  ${cssName(publicName)}: ${cssValue(token.value, token.type)};`;
    })
    .join("\n");
}

const scopedTokens = (prefix) =>
  Object.fromEntries(Object.entries(allTokens).filter(([name]) => name.startsWith(prefix)));

/**
 * Alberca springs are authored as physics. Settling time to within 2% of rest is
 * derived here rather than hand-written so the CSS fallback duration can never
 * drift from the spring it approximates.
 */
function springDurationMs({ stiffness, damping, mass }) {
  const angularFrequency = Math.sqrt(stiffness / mass);
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const settling = -Math.log(0.02) / (Math.min(dampingRatio, 1) * angularFrequency);
  return Math.round(settling * 1000);
}

const springs = Object.fromEntries(
  Object.entries(source.motion?.spring ?? {})
    .filter(([key]) => !key.startsWith("$"))
    .map(([name, group]) => [
      name,
      {
        stiffness: group.stiffness.$value,
        damping: group.damping.$value,
        mass: group.mass.$value
      }
    ])
);

const springDeclarations = Object.entries(springs)
  .map(([name, spring]) => {
    const ratio = spring.damping / (2 * Math.sqrt(spring.stiffness * spring.mass));
    return [
      `  --firdawsi-motion-spring-${name}-damping-ratio: ${ratio.toFixed(4)};`,
      `  --firdawsi-motion-spring-${name}-duration: ${springDurationMs(spring)}ms;`
    ].join("\n");
  })
  .join("\n");

const regionRules = regionNames
  .map((regionName) => {
    const aliases = source.region[regionName].$aliases ?? [];
    const selectors = [regionName, ...aliases]
      .map((id) => `[data-region="${id}"]`)
      .join(",\n");
    const description = source.region[regionName].$description;
    return `${description ? `/* ${description} */\n` : ""}${selectors} {
${declarations(scopedTokens(`region.${regionName}.`), `region.${regionName}.`)}
}`;
  })
  .join("\n\n");

const themes = Object.fromEntries(
  themeNames.map((themeName) => {
    const prefix = `theme.${themeName}.`;
    return [
      themeName,
      Object.fromEntries(
        Object.entries(scopedTokens(prefix)).map(([name, token]) => [
          name.slice(prefix.length),
          resolveAlias(token.value)
        ])
      )
    ];
  })
);

const regions = Object.fromEntries(
  regionNames.map((regionName) => {
    const prefix = `region.${regionName}.`;
    return [
      regionName,
      {
        aliases: source.region[regionName].$aliases ?? [],
        tokens: Object.fromEntries(
          Object.entries(scopedTokens(prefix)).map(([name, token]) => [
            name.slice(prefix.length),
            resolveAlias(token.value)
          ])
        )
      }
    ];
  })
);

const baseResolved = Object.fromEntries(
  Object.entries(baseTokens).map(([name, token]) => [name, resolveAlias(token.value)])
);

const css = `/* Generated from src/tokens.json. Do not edit directly. */
:root,
[data-theme="light"] {
${declarations(baseTokens)}
${springDeclarations}
${declarations(scopedTokens("theme.light."), "theme.light.")}
  color-scheme: light;
}

[data-theme="dark"] {
${declarations(scopedTokens("theme.dark."), "theme.dark.")}
  color-scheme: dark;
}

[data-theme="high-contrast"] {
${declarations(scopedTokens("theme.highContrast."), "theme.highContrast.")}
  color-scheme: dark;
}

[dir="rtl"] {
  --firdawsi-logical-icon-directional-transform: var(--firdawsi-logical-icon-directional-transform-rtl);
}

[dir="ltr"] {
  --firdawsi-logical-icon-directional-transform: var(--firdawsi-logical-icon-directional-transform-ltr);
}

/* Regional profile overlays. Andalusi is the system default, so its overlay
   restates the baseline; the others are deviations from it. Profiles tune
   non-semantic surface and ornament values only. */
${regionRules}

@media (prefers-reduced-motion: reduce) {
  :root {
    --firdawsi-motion-duration-fast: 0ms;
    --firdawsi-motion-duration-normal: 0ms;
    --firdawsi-motion-duration-slow: 0ms;
    --firdawsi-motion-duration-ceremonial: 0ms;
${Object.keys(springs)
  .map((name) => `    --firdawsi-motion-spring-${name}-duration: 0ms;`)
  .join("\n")}
  }
}
`;

const resolvedJson = `${JSON.stringify(
  {
    $description: "Generated, resolved token values for platform adapters.",
    base: baseResolved,
    themes,
    regions,
    springs: Object.fromEntries(
      Object.entries(springs).map(([name, spring]) => [
        name,
        {
          ...spring,
          dampingRatio:
            Math.round((spring.damping / (2 * Math.sqrt(spring.stiffness * spring.mass))) * 1e4) / 1e4,
          durationMs: springDurationMs(spring)
        }
      ])
    )
  },
  null,
  2
)}\n`;

const generatedTs = `/* Generated from tokens.json. Do not edit directly. */
export const tokens = ${JSON.stringify(baseResolved, null, 2)} as const;

export const themes = ${JSON.stringify(themes, null, 2)} as const;

export const regions = ${JSON.stringify(regions, null, 2)} as const;

export const springs = ${JSON.stringify(
  Object.fromEntries(
    Object.entries(springs).map(([name, spring]) => [
      name,
      {
        ...spring,
        dampingRatio:
          Math.round((spring.damping / (2 * Math.sqrt(spring.stiffness * spring.mass))) * 1e4) / 1e4,
        durationMs: springDurationMs(spring)
      }
    ])
  ),
  null,
  2
)} as const;

export type TokenName = keyof typeof tokens;
export type ThemeName = keyof typeof themes;
export type RegionName = keyof typeof regions;
export type SpringName = keyof typeof springs;
export type SemanticColorRole = keyof (typeof themes)["light"];
`;

await mkdir(generatedDir, { recursive: true });
await writeFile(resolve(generatedDir, "tokens.css"), css);
await writeFile(resolve(generatedDir, "tokens.json"), resolvedJson);
await writeFile(resolve(packageRoot, "src/generated.ts"), generatedTs);
