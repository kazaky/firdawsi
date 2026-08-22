import { round } from "./options.js";
import { escapeXml } from "./sanitize.js";
import type { NormalizedOptions, PerformanceDiagnostics } from "./types.js";

export interface SvgDocument {
  push(node: string): boolean;
  /** Raises the draw ceiling to `maxNodes` so reserved overlay nodes can be appended. */
  allowOverlay(): void;
  finish(): { svg: string; diagnostics: PerformanceDiagnostics };
  readonly id: string;
}

function hashId(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `g${(hash >>> 0).toString(36)}`;
}

export function createSvgDocument(
  options: NormalizedOptions,
  namespace: string,
  drawLimit = options.maxNodes,
): SvgDocument {
  const nodes: string[] = [];
  const id = hashId(`${namespace}:${options.seed}:${options.symmetry}:${options.unitSize}`);
  let truncated = false;
  let limit = Math.max(0, Math.min(options.maxNodes, drawLimit));
  const accessibility = options.accessibility;
  const labelled = !accessibility.decorative && (accessibility.title || accessibility.description);
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const labels = [
    accessibility.title ? `<title id="${titleId}">${escapeXml(accessibility.title)}</title>` : "",
    accessibility.description
      ? `<desc id="${descriptionId}">${escapeXml(accessibility.description)}</desc>`
      : "",
  ].join("");
  const role = accessibility.decorative
    ? 'aria-hidden="true" focusable="false"'
    : `role="img"${labelled ? ` aria-labelledby="${[accessibility.title && titleId, accessibility.description && descriptionId].filter(Boolean).join(" ")}"` : ""}`;
  const clip =
    options.crop === "circle"
      ? `<clipPath id="${id}-crop"><circle cx="${round(options.width / 2)}" cy="${round(options.height / 2)}" r="${round(Math.min(options.width, options.height) / 2)}"/></clipPath>`
      : "";
  const clipAttr = options.crop === "circle" ? ` clip-path="url(#${id}-crop)"` : "";

  return {
    id,
    get push() {
      return (node: string): boolean => {
        if (nodes.length >= limit) {
          truncated = true;
          return false;
        }
        nodes.push(node);
        return true;
      };
    },
    allowOverlay() {
      limit = options.maxNodes;
    },
    finish() {
      const nodeCount = nodes.length;
      const complexity = nodeCount < 250 ? "low" : nodeCount < 1000 ? "medium" : "high";
      return {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(options.width)} ${round(options.height)}" width="100%" height="100%" ${role}>${labels}${clip ? `<defs>${clip}</defs>` : ""}<g${clipAttr}>${nodes.join("")}</g></svg>`,
        diagnostics: {
          nodeCount,
          maxNodes: options.maxNodes,
          truncated,
          estimatedComplexity: complexity,
          warnings: truncated ? [`Node limit ${options.maxNodes} reached; output was truncated.`] : [],
        },
      };
    },
  };
}

export function points(
  count: number,
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius = outerRadius,
  rotation = -Math.PI / 2,
): string {
  const total = innerRadius === outerRadius ? count : count * 2;
  return Array.from({ length: total }, (_, index) => {
    const angle = rotation + (Math.PI * 2 * index) / total;
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    return `${round(centerX + Math.cos(angle) * radius)},${round(centerY + Math.sin(angle) * radius)}`;
  }).join(" ");
}
