import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  PATTERN_PRESET_IDS,
  PRESETS,
  SUPPORTED_SYMMETRIES,
  generateArabesque,
  generatePreset,
  generateFromRecipe,
  generatePattern,
  generateStar,
  generateZellige,
  migrateRecipe,
  point,
  polygon,
  serializeRecipe,
  simplifyForViewport,
  toCssPattern,
  validatePolygon,
  validateRepeatCellEdges,
  type PatternKind,
} from "../src/index.js";

const KINDS: PatternKind[] = [
  "grid",
  "star",
  "rosette",
  "girih",
  "zellige",
  "screen",
  "arch",
  "corners",
  "frame",
  "arabesque",
];

describe("geometry generators", () => {
  it.each(KINDS)("emits stable, finite SVG for %s", (kind) => {
    const options = { seed: "fixed", width: 240, height: 180, symmetry: 8 as const };
    const first = generatePattern(kind, options);
    const second = generatePattern(kind, options);
    expect(first.svg).toBe(second.svg);
    expect(first.svg).toMatch(/^<svg[^>]+>/);
    expect(first.svg.endsWith("</svg>")).toBe(true);
    expect(first.svg).not.toMatch(/NaN|Infinity|undefined/);
    expect(first.recipe.kind).toBe(kind);
  });

  it("uses the seed to vary deterministic arrangements", () => {
    expect(generateZellige({ seed: "one" }).svg).not.toBe(generateZellige({ seed: "two" }).svg);
  });

  it("enforces construction-valid preset symmetry", () => {
    expect(generatePreset("khatam-8-star-cross", { symmetry: 12 }).recipe.options.symmetry).toBe(8);
    expect(generatePreset("rosette-12-almond", { symmetry: 8 }).recipe.options.symmetry).toBe(12);
    expect(generateStar({ symmetry: 16 }).recipe.construction.id).toBe("medallion-16-v2");
    expect(SUPPORTED_SYMMETRIES).toContain(16);
  });

  it("keeps generateArabesque compatible while allowing botanical preset selection", () => {
    expect(generateArabesque().recipe.presetId).toBe("rumi-medallion-6");
    expect(
      generateArabesque({ presetId: "palmette-roundel" }).recipe.presetId,
    ).toBe("palmette-roundel");
    expect(
      generatePattern("arabesque", {
        presetId: "floral-geometric-field",
        symmetry: 12,
      }).recipe.presetId,
    ).toBe("floral-geometric-field");
  });

  it("escapes accessible text and rejects unsafe colors", () => {
    const output = generateStar({
      palette: ['"><script>alert(1)</script>', "#fff"],
      accessibility: {
        decorative: false,
        title: 'A <star> & "moon"',
        description: "</desc><script>bad()</script>",
      },
    });
    expect(output.svg).toContain("A &lt;star&gt; &amp; &quot;moon&quot;");
    expect(output.svg).toContain("&lt;/desc&gt;&lt;script&gt;bad()&lt;/script&gt;");
    expect(output.svg).not.toContain("<script>");
    expect(output.svg).not.toContain('stroke=""><');
  });

  it("exports CSS and round-trippable JSON recipes", () => {
    const output = generatePattern("screen", { seed: 42, unitSize: 36 });
    const css = toCssPattern(output, ".demo pattern");
    const serialized = serializeRecipe(output.recipe);
    const restored = generateFromRecipe(JSON.parse(serialized));
    expect(css).toContain(".demo-pattern{background-image:url(");
    expect(css).toContain("background-repeat:repeat");
    expect(restored.svg).toBe(output.svg);
    expect(restored.recipe.version).toBe(2);
  });

  it("migrates v1 recipes to their closest v2 construction", () => {
    const migrated = migrateRecipe({
      version: 1,
      kind: "girih",
      options: { seed: "legacy", symmetry: 8, unitSize: 40 },
    });
    expect(migrated.version).toBe(2);
    expect(migrated.construction.id).toBe("girih-10-v2");
    expect(migrated.options.symmetry).toBe(10);
    expect(generateFromRecipe({ version: 1, kind: "screen", options: {} }).recipe.construction.id).toBe("jali-8-v2");
    expect(
      generateFromRecipe({ version: 1, kind: "arabesque", options: {} })
        .recipe.construction.id,
    ).toBe("rumi-medallion-6-v2");
  });

  it("normalizes optional botanical controls without changing old call sites", () => {
    const defaults = generateArabesque().recipe.options;
    expect(defaults.botanicalFill).toBe(true);
    expect(defaults.petalDepth).toBe(0.2);
    const normalized = generateArabesque({
      petalDepth: 99,
      botanicalFill: false,
      strandWidth: 0,
      weaveGap: -4,
    }).recipe.options;
    expect(normalized.petalDepth).toBe(0.48);
    expect(normalized.botanicalFill).toBe(false);
    expect(normalized.strandWidth).toBe(0.25);
    expect(normalized.weaveGap).toBe(0);
  });

  it("honors hard node limits and reports truncation", () => {
    const output = generatePattern("zellige", {
      density: 1,
      unitSize: 8,
      width: 1024,
      height: 1024,
      maxNodes: 24,
    });
    expect(output.diagnostics.nodeCount).toBeLessThanOrEqual(24);
    expect(output.diagnostics.truncated).toBe(true);
    expect(output.diagnostics.warnings).toHaveLength(1);
  });

  it("simplifies without mutating source options", () => {
    const source = { density: 0.9, unitSize: 40, interlace: true, maxNodes: 1000 };
    const simplified = simplifyForViewport(source, { viewportWidth: 320 });
    expect(source).toEqual({ density: 0.9, unitSize: 40, interlace: true, maxNodes: 1000 });
    expect(simplified.density).toBeLessThan(source.density);
    expect(simplified.unitSize).toBeGreaterThan(source.unitSize);
    expect(simplified.interlace).toBe(false);
    expect(simplified.maxNodes).toBeLessThan(source.maxNodes);
  });
});

const GOLDEN_HASHES = {
  "construction-grid": "45e6400cf2e7d876",
  "khatam-8-star-cross": "7fa32634c0de856a",
  "rosette-12-almond": "bc0b19cadf506f0f",
  "medallion-16-nested": "a40600393dbfc56e",
  "girih-10-straps": "294bb404d83d6a91",
  "zellige-star-cross": "91528b91d178b8bb",
  "jali-8-screen": "c835133aa9b99b78",
  "pointed-arch": "f73edd0ffb7af105",
  "khatam-corners": "ca2abda6a39d2f6f",
  "geometric-frame": "c5ffa978807fb6e7",
  "rumi-medallion-6": "9061bea0d02dc4b2",
  "palmette-roundel": "50b6989184a3c6f3",
  "floral-geometric-field": "e7bc7dba883ffc74",
} as const;

describe("v2 construction invariants", () => {
  it.each(PATTERN_PRESET_IDS)("matches the golden SVG hash for %s", (presetId) => {
    const svg = generatePreset(presetId, {
      seed: "golden",
      width: 192,
      height: 192,
      maxNodes: 5000,
    }).svg;
    const hash = createHash("sha256").update(svg).digest("hex").slice(0, 16);
    expect(hash).toBe(GOLDEN_HASHES[presetId]);
  });

  it.each(PATTERN_PRESET_IDS)("has finite, matched repeat geometry for %s", (presetId) => {
    const output = generatePreset(presetId, { width: 224, height: 192 });
    const cell = polygon(output.recipe.repeatCell.boundary.map((value) => point(value.x, value.y)));
    expect(validateRepeatCellEdges(cell).valid).toBe(true);
    expect(output.svg).not.toMatch(/NaN|Infinity|undefined/);
    for (const primitive of output.constructionOverlay.primitives) {
      if (primitive.kind === "polygon") {
        expect(validatePolygon(primitive.geometry).valid).toBe(true);
      }
    }
  });

  it("keeps geometry fixed when only seed changes", () => {
    const normalizePalette = (svg: string): string =>
      svg.replace(/#[0-9a-f]{3,8}/gi, "#COLOR");
    const first = generateZellige({ seed: "one", width: 192, height: 192 }).svg;
    const second = generateZellige({ seed: "two", width: 192, height: 192 }).svg;
    expect(normalizePalette(first)).toBe(normalizePalette(second));
  });

  it.each(["rumi-medallion-6", "palmette-roundel"] as const)(
    "keeps focal botanical anchors inside the circular boundary for %s",
    (presetId) => {
      const output = generatePreset(presetId, { width: 240, height: 200 });
      const center = point(120, 100);
      const boundaryRadius = 200 * 0.44;
      const anchors = output.constructionOverlay.primitives.filter(
        (primitive) => primitive.kind === "point",
      );
      expect(anchors.length).toBeGreaterThan(0);
      for (const anchor of anchors) {
        expect(
          Math.hypot(
            anchor.geometry.x - center.x,
            anchor.geometry.y - center.y,
          ),
        ).toBeLessThanOrEqual(boundaryRadius + 1e-7);
      }
      expect(output.recipe.topology.mode).toBe("focal");
      expect(output.recipe.review.cultural).toBe("expert-review-pending");
      expect(output.recipe.review.limitations.join(" ")).toMatch(
        /visual brief.*no board image.*traced/i,
      );
    },
  );

  it.each([8, 12] as const)(
    "builds an exact repeat-matched %s-fold floral field",
    (symmetry) => {
      const output = generatePreset("floral-geometric-field", {
        symmetry,
        width: 240,
        height: 200,
      });
      expect(output.recipe.options.symmetry).toBe(symmetry);
      expect(output.recipe.topology.rotationOrder).toBe(symmetry);
      expect(output.recipe.topology.edgeContinuity).toBe("repeat-matched");
      expect(output.recipe.repeatCell.width).toBeCloseTo(
        output.recipe.repeatCell.height,
        10,
      );
      expect(output.recipe.repeatCell.vectors).toEqual([
        [output.recipe.repeatCell.width, 0],
        [0, output.recipe.repeatCell.height],
      ]);
    },
  );

  it("emits a continuous six-fold Rumi skeleton with stem-mounted leaves", () => {
    const svg = generatePreset("rumi-medallion-6", {
      width: 240,
      height: 240,
      constructionOverlay: "none",
    }).svg;
    expect(svg.match(/data-motif="rumi-continuous-whorl"/g)).toHaveLength(1);
    expect(svg.match(/data-motif="rumi-whirling-stem"/g)).toHaveLength(6);
    expect(svg.match(/data-motif="rumi-stem-leaf"/g)).toHaveLength(12);
    expect(svg.match(/data-motif="sixfold-floral-void"/g)).toHaveLength(7);
    expect(svg).not.toContain('data-botanical-role="lobe"');
    expect(svg).not.toContain("data-construction-role");
  });

  it("emits a centered bilateral palmette hierarchy with mirrored wings", () => {
    const svg = generatePreset("palmette-roundel", {
      width: 240,
      height: 240,
      constructionOverlay: "none",
    }).svg;
    expect(svg).toContain('data-motif="central-palmette"');
    expect(svg).toContain('data-motif="nested-lotus-lower"');
    expect(svg).toContain('data-motif="nested-lotus-upper"');
    expect(svg).toContain('data-motif="ogival-boundary"');
    expect(svg).toContain('data-motif="circular-boundary"');
    expect(svg.match(/data-motif="palmette-wing"/g)).toHaveLength(4);
    expect(svg).toContain(
      'data-motif="palmette-wing" data-botanical-role="outline" transform="translate(240 0) scale(-1 1)"',
    );
    expect(svg).not.toContain('data-botanical-role="lobe"');
    expect(svg).not.toContain("data-construction-role");
  });

  it.each([8, 12] as const)(
    "exposes the complete %s-fold repeat motif hierarchy",
    (symmetry) => {
      const svg = generatePreset("floral-geometric-field", {
        symmetry,
        width: 240,
        height: 240,
        maxNodes: 5000,
      }).svg;
      expect(
        (svg.match(/data-motif="field-kite-connector"/g) ?? []).length,
      ).toBeGreaterThanOrEqual(symmetry);
      expect(svg).toContain('data-motif="field-central-rosette"');
      expect(svg).toContain('data-motif="field-split-leaf-ring"');
      expect(svg).toContain('data-motif="field-rosette-node"');
      expect(svg).toContain('data-motif="field-edge-rosette"');
      const motifTags = svg.match(/<(?:path|polygon|circle|rect)[^>]+data-motif="[^"]+"[^>]*>/g) ?? [];
      expect(motifTags.length).toBeGreaterThan(0);
      expect(motifTags.every((tag) => tag.includes("data-layer="))).toBe(true);
      expect(
        generatePreset("floral-geometric-field", { symmetry }).diagnostics
          .truncated,
      ).toBe(false);
    },
  );

  it("connects girih prototiles edge-to-edge around the decagon", () => {
    const polygons = generatePreset("girih-10-straps", {
      width: 192,
      height: 192,
      simplificationTier: "expanded",
    }).constructionOverlay.primitives
      .filter((primitive) => primitive.kind === "polygon")
      .map((primitive) => primitive.geometry);
    const edgeKeys = (value: (typeof polygons)[number]): Set<string> =>
      new Set(
        value.vertices.map((vertex, index) => {
          const next = value.vertices[(index + 1) % value.vertices.length]!;
          const first = `${vertex.x.toFixed(6)}:${vertex.y.toFixed(6)}`;
          const second = `${next.x.toFixed(6)}:${next.y.toFixed(6)}`;
          return first < second ? `${first}|${second}` : `${second}|${first}`;
        }),
      );
    const sharesEdge = (
      first: (typeof polygons)[number],
      second: (typeof polygons)[number],
    ): boolean => {
      const firstEdges = edgeKeys(first);
      return [...edgeKeys(second)].some((edge) => firstEdges.has(edge));
    };
    const decagon = polygons[0]!;
    for (let index = 0; index < 10; index += 1) {
      const rhombus = polygons[1 + index * 2]!;
      const attached = polygons[2 + index * 2]!;
      expect(sharesEdge(decagon, rhombus)).toBe(true);
      expect(sharesEdge(rhombus, attached)).toBe(true);
    }
  });

  it("keeps girih prototile guides out of the default visible layer", () => {
    const base = generatePreset("girih-10-straps", {
      width: 240,
      height: 240,
      constructionOverlay: "none",
    });
    const guides = generatePreset("girih-10-straps", {
      width: 240,
      height: 240,
      constructionOverlay: "guides",
    });
    const full = generatePreset("girih-10-straps", {
      width: 240,
      height: 240,
      constructionOverlay: "full",
    });
    expect(base.svg).not.toContain("data-construction-role");
    expect(base.svg).toMatch(/data-girih-role="midline"|data-module="girih-/);
    expect(guides.svg).toMatch(/<polygon[^>]+data-construction-role="guide"/);
    expect(full.svg).toMatch(/<polygon[^>]+data-construction-role="guide"/);
  });

  it("emits continuous Hankin strap midlines from girih prototile edges", () => {
    const width = 320;
    const height = 280;
    const svg = generatePreset("girih-10-straps", { width, height }).svg;
    const midlines = [
      ...svg.matchAll(
        /<path d="([^"]+)"[^>]+data-strand-layer="core" data-girih-role="midline"/g,
      ),
    ].map((match) => match[1]!);
    expect(midlines.length).toBeGreaterThan(0);
    expect(svg).not.toContain('data-girih-role="circuit"');
    for (const data of midlines) {
      expect(data.startsWith("M")).toBe(true);
      expect(data.includes("Z") || /L[\d. ,-]+Z?$/.test(data)).toBe(true);
      const points = [
        ...data.matchAll(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g),
      ];
      expect(points.length).toBeGreaterThanOrEqual(6);
    }
  });

  it("emits unmistakable zellige star, cross, and kite modules", () => {
    const svg = generatePreset("zellige-star-cross", {
      width: 240,
      height: 240,
    }).svg;
    expect(svg.match(/data-module="eight-point-star"/g)?.length).toBeGreaterThan(4);
    expect(svg.match(/data-module="concave-cross"/g)?.length).toBeGreaterThan(4);
    expect(svg.match(/data-module="cross-kite"/g)?.length).toBeGreaterThan(8);
    expect(svg).toContain('data-module="grout-field"');
  });

  it("keeps khatam star, cross, and kite connectors visible", () => {
    const svg = generatePreset("khatam-8-star-cross", {
      width: 240,
      height: 240,
    }).svg;
    expect(svg).toContain('data-module="eight-point-star"');
    expect(svg).toContain('data-module="concave-cross"');
    expect(svg).toContain('data-module="star-kite"');
    expect(svg).not.toContain("Q");
  });

  it("builds a dense faceted sixteen-fold medallion", () => {
    const svg = generatePreset("medallion-16-nested", {
      width: 240,
      height: 240,
      simplificationTier: "expanded",
    }).svg;
    expect(svg.match(/data-module="outer-kite-facet"/g)).toHaveLength(16);
    expect(svg.match(/data-module="grid-petal-ring"/g)).toHaveLength(16);
    expect(svg.match(/data-module="inner-kite-facet"/g)).toHaveLength(16);
    expect(svg).toContain('data-module="middle-sixteen-star"');
    expect(svg).toContain('data-module="central-eight-star"');
    expect(svg).not.toContain('data-module="almond-petal-ring"');
  });

  it("builds compass-derived interlocking rosette petals", () => {
    const svg = generatePreset("rosette-12-almond", {
      width: 240,
      height: 240,
      simplificationTier: "expanded",
    }).svg;
    expect(svg.match(/data-module="compass-petal"/g)?.length).toBeGreaterThanOrEqual(12);
  });

  it.each(["rosette-12-almond", "medallion-16-nested"] as const)(
    "exposes rotationally closed divisions for %s",
    (presetId) => {
      const output = generatePreset(presetId, { width: 200, height: 200 });
      const order = PRESETS[presetId].topology.rotationOrder;
      const center = point(100, 100);
      const divisions = output.constructionOverlay.primitives
        .filter((primitive) => primitive.kind === "point")
        .map((primitive) => primitive.geometry);
      const keys = new Set(
        divisions.map((value) => `${value.x.toFixed(5)}:${value.y.toFixed(5)}`),
      );
      for (const value of divisions) {
        const dx = value.x - center.x;
        const dy = value.y - center.y;
        const angle = (Math.PI * 2) / order;
        const rotated = point(
          center.x + dx * Math.cos(angle) - dy * Math.sin(angle),
          center.y + dx * Math.sin(angle) + dy * Math.cos(angle),
        );
        expect(keys.has(`${rotated.x.toFixed(5)}:${rotated.y.toFixed(5)}`)).toBe(true);
      }
    },
  );

  it("emits construction overlays without exceeding node limits", () => {
    const overlay = generatePreset("girih-10-straps", {
      constructionOverlay: "full",
      width: 192,
      height: 192,
      maxNodes: 1000,
    });
    const limited = generatePreset("girih-10-straps", {
      constructionOverlay: "full",
      width: 640,
      height: 480,
      maxNodes: 64,
    });
    expect(overlay.svg).toContain("data-construction-role");
    expect(limited.diagnostics.nodeCount).toBeLessThanOrEqual(64);
    expect(limited.diagnostics.truncated).toBe(true);
  });
});
