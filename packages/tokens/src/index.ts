export {
  themes,
  tokens,
  type SemanticColorRole,
  type ThemeName,
  type TokenName
} from "./generated.js";

export const themeAttribute = {
  light: "light",
  dark: "dark",
  highContrast: "high-contrast"
} as const;

export type ThemeAttribute = (typeof themeAttribute)[keyof typeof themeAttribute];

/** Returns the CSS custom property name for a dot-separated token path. */
export function cssVariable(tokenPath: string): `--firdawsi-${string}` {
  const kebabPath = tokenPath
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/\./g, "-");

  return `--firdawsi-${kebabPath}`;
}

/** Returns a CSS var() expression with an optional fallback. */
export function tokenVar(tokenPath: string, fallback?: string): string {
  const name = cssVariable(tokenPath);
  return fallback === undefined ? `var(${name})` : `var(${name}, ${fallback})`;
}
