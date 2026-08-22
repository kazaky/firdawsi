const SAFE_COLOR =
  /^(#[0-9a-f]{3,8}|[a-z]{1,24}|(?:rgb|hsl)a?\([\d.%+\-, /]+\)|var\(--[a-z0-9-_]+\))$/i;

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function sanitizeColor(value: string, fallback: string): string {
  const trimmed = value.trim();
  return SAFE_COLOR.test(trimmed) ? trimmed : fallback;
}

export function sanitizeCssIdentifier(value: string): string {
  const sanitized = value.trim().replace(/[^a-zA-Z0-9_-]/g, "-");
  return /^[a-zA-Z_]/.test(sanitized) ? sanitized : `pattern-${sanitized || "geometry"}`;
}

export function encodeSvgDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)
    .replaceAll("%20", " ")
    .replaceAll("%3D", "=")
    .replaceAll("%3A", ":")
    .replaceAll("%2F", "/")}`;
}
