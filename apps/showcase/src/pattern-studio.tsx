import {
  PATTERN_PRESET_IDS,
  PRESETS,
  generatePreset,
  serializeRecipe,
  toCssPattern,
  type ConstructionOverlayMode,
  type CropMode,
  type PatternOptions,
  type PatternPresetId,
  type SimplificationTier,
} from "@firdawsi/geometry";
import {
  Banner,
  Button,
  Select,
  Switch,
  TextField,
} from "@firdawsi/web";
import { useMemo, useState } from "react";

import { categoryForPreset, palettes, presetGroups, type PaletteName, type PresetCategory } from "./showcase-data";

export function PatternStudio() {
  const [presetId, setPresetId] = useState<PatternPresetId>("rosette-12-almond");
  const [symmetry, setSymmetry] = useState<NonNullable<PatternOptions["symmetry"]>>(12);
  const [seed, setSeed] = useState("courtyard-27");
  const [unitSize, setUnitSize] = useState(76);
  const [stroke, setStroke] = useState(1.35);
  const [strandWidth, setStrandWidth] = useState(2.1);
  const [weaveGap, setWeaveGap] = useState(1.4);
  const [petalDepth, setPetalDepth] = useState(0.2);
  const [density, setDensity] = useState(0.68);
  const [botanicalFill, setBotanicalFill] = useState(true);
  const [crop, setCrop] = useState<CropMode>("circle");
  const [paletteName, setPaletteName] = useState<PaletteName>("courtyard");
  const [overlay, setOverlay] = useState<ConstructionOverlayMode>("guides");
  const [layers, setLayers] = useState({ straps: true, botanical: true, construction: true });
  const [notice, setNotice] = useState("");

  const preset = PRESETS[presetId];
  const category = categoryForPreset(presetId);
  const isBotanical = category === "botanical" || category === "hybrid";
  const hasStraps = preset.topology.interlace === "continuous-straps";
  const supportsRepeatScale =
    preset.topology.mode === "periodic" ||
    ["pointed-arch", "khatam-corners", "geometric-frame"].includes(presetId);
  const supportsDensity = preset.topology.mode !== "focal";

  const baseOptions = useMemo<PatternOptions>(
    () => ({
      symmetry,
      seed,
      stroke,
      crop,
      palette: palettes[paletteName],
      constructionOverlay: overlay,
      interlace: preset.defaults.interlace,
      ...(supportsRepeatScale ? { unitSize } : {}),
      ...(supportsDensity ? { density } : {}),
      ...(hasStraps || isBotanical ? { strandWidth } : {}),
      ...(hasStraps && preset.defaults.interlace ? { weaveGap } : {}),
      ...(isBotanical ? { petalDepth, botanicalFill } : {}),
    }),
    [
      botanicalFill,
      crop,
      density,
      hasStraps,
      isBotanical,
      overlay,
      paletteName,
      petalDepth,
      preset.defaults.interlace,
      seed,
      strandWidth,
      stroke,
      supportsDensity,
      supportsRepeatScale,
      symmetry,
      unitSize,
      weaveGap,
    ],
  );

  const result = useMemo(
    () =>
      generatePreset(presetId, {
        ...baseOptions,
        width: 920,
        height: 640,
        maxNodes: 2200,
        simplificationTier: "expanded",
        accessibility: {
          decorative: false,
          title: `${preset.label} pattern preview`,
          description: `${preset.description} Construction overlay: ${overlay}.`,
        },
      }),
    [baseOptions, overlay, preset.description, preset.label, presetId],
  );

  const tierResults = useMemo(
    () =>
      (["compact", "regular", "expanded"] as SimplificationTier[]).map((tier) => ({
        tier,
        result: generatePreset(presetId, {
          ...baseOptions,
          width: 420,
          height: 290,
          maxNodes: tier === "compact" ? 320 : tier === "regular" ? 760 : 1400,
          simplificationTier: tier,
          accessibility: { decorative: true },
        }),
      })),
    [baseOptions, presetId],
  );

  const selectPreset = (nextId: PatternPresetId) => {
    const next = PRESETS[nextId];
    const defaults: Readonly<PatternOptions> = next.defaults;
    setPresetId(nextId);
    setSymmetry(next.validSymmetries[0]!);
    setDensity(defaults.density ?? 0.65);
    setUnitSize(defaults.unitSize ?? 76);
    setStroke(defaults.stroke ?? 1.35);
    setStrandWidth(defaults.strandWidth ?? 2.1);
    setWeaveGap(defaults.weaveGap ?? 1.4);
    setPetalDepth(defaults.petalDepth ?? 0.2);
    setBotanicalFill(defaults.botanicalFill ?? true);
    setCrop(defaults.crop ?? "square");
  };

  const copy = async (format: "svg" | "css" | "json") => {
    const value = format === "svg"
      ? result.svg
      : format === "css"
        ? toCssPattern(result, ".my-pattern")
        : serializeRecipe(result.recipe, true);
    await navigator.clipboard.writeText(value);
    setNotice(`${format.toUpperCase()} copied`);
    window.setTimeout(() => setNotice(""), 1800);
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([result.svg], { type: "image/svg+xml;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${presetId}-${seed || "pattern"}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("SVG downloaded");
  };

  const complexity = result.diagnostics.estimatedComplexity;
  const layerClass = [
    !layers.straps && "studio-layer--hide-straps",
    !layers.botanical && "studio-layer--hide-botanical",
    !layers.construction && "studio-layer--hide-construction",
  ].filter(Boolean).join(" ");
  const recipe = result.recipe;
  const recipeHasStraps = recipe.layers.some((layer) => layer.role === "strap");
  const recipeHasBotanical = recipe.layers.some((layer) =>
    ["stem", "foliage", "flower", "connector", "void"].includes(layer.role),
  );

  return (
    <div className="studio-workbench">
      <div className="preset-browser" aria-label="Pattern presets">
        <div className="preset-browser__heading">
          <p className="eyebrow">Curated constructions</p>
          <p>{PATTERN_PRESET_IDS.length} reviewed entry points · choose a preset before tuning its valid parameters.</p>
        </div>
        <div className="preset-groups">
          {(Object.entries(presetGroups) as [PresetCategory, readonly PatternPresetId[]][]).map(
            ([group, ids]) => (
              <section className="preset-group" key={group} aria-labelledby={`preset-${group}`}>
                <h3 id={`preset-${group}`}>{group}</h3>
                <div>
                  {ids.map((id) => {
                    const option = PRESETS[id];
                    return (
                      <button
                        type="button"
                        className="preset-card"
                        key={id}
                        data-preset-id={id}
                        aria-pressed={presetId === id}
                        onClick={() => selectPreset(id)}
                      >
                        <span>{option.validSymmetries.join(" / ")}-fold</span>
                        <strong>{option.label}</strong>
                        <small>{option.topology.mode} · {option.kind}</small>
                      </button>
                    );
                  })}
                </div>
              </section>
            ),
          )}
        </div>
      </div>

      <div className="studio-shell">
        <div className="studio-preview">
          <div className={`studio-canvas ${layerClass}`}>
            <div dangerouslySetInnerHTML={{ __html: result.svg }} />
            <div className="canvas-label">
              <span>LIVE / {preset.label}</span>
              <span>{recipe.options.width} × {recipe.options.height}</span>
            </div>
          </div>
          <div className="diagnostics" aria-label="Pattern diagnostics">
            <div><span>Nodes</span><strong>{result.diagnostics.nodeCount}</strong></div>
            <div><span>Complexity</span><strong className={`complexity complexity--${complexity}`}>{complexity}</strong></div>
            <div><span>Budget</span><strong>{Math.round((result.diagnostics.nodeCount / result.diagnostics.maxNodes) * 100)}%</strong></div>
            <div><span>Status</span><strong>{result.diagnostics.truncated ? "Truncated" : "Exact"}</strong></div>
          </div>
          {result.diagnostics.warnings.length > 0 && (
            <Banner tone="warning" title="Rendering note">
              {result.diagnostics.warnings.join(" ")}
            </Banner>
          )}
        </div>

        <form className="studio-controls" onSubmit={(event) => event.preventDefault()}>
          <div className="control-heading">
            <div>
              <p className="eyebrow">Recipe / v2</p>
              <h3>{preset.label}</h3>
              <p>{preset.description}</p>
            </div>
          </div>

          <div className="control-grid">
            <TextField label="Color-role seed" value={seed} onChange={(event) => setSeed(event.target.value)} />
            {preset.validSymmetries.length > 1 && (
              <Select
                label="Valid symmetry"
                value={String(symmetry)}
                options={preset.validSymmetries.map((value) => ({ label: `${value}-fold`, value: String(value) }))}
                onChange={(event) => setSymmetry(Number(event.target.value) as NonNullable<PatternOptions["symmetry"]>)}
              />
            )}
          </div>
          <p className="seed-note">Seed rotates color roles only; construction geometry remains invariant.</p>

          <div className="range-stack">
            {supportsRepeatScale && (
              <label>
                <span>Repeat scale / unit size <output>{unitSize}px</output></span>
                <input aria-label="Repeat scale / unit size" type="range" min="28" max="150" value={unitSize} onChange={(event) => setUnitSize(Number(event.target.value))} />
              </label>
            )}
            <label>
              <span>Stroke <output>{stroke.toFixed(2)}px</output></span>
              <input aria-label="Stroke" type="range" min="0.5" max="4" step="0.25" value={stroke} onChange={(event) => setStroke(Number(event.target.value))} />
            </label>
            {(hasStraps || isBotanical) && (
              <label>
                <span>Strand width <output>{strandWidth.toFixed(1)}px</output></span>
                <input aria-label="Strand width" type="range" min="0.5" max="6" step="0.25" value={strandWidth} onChange={(event) => setStrandWidth(Number(event.target.value))} />
              </label>
            )}
            {hasStraps && preset.defaults.interlace && (
              <label>
                <span>Weave gap <output>{weaveGap.toFixed(1)}px</output></span>
                <input aria-label="Weave gap" type="range" min="0" max="5" step="0.25" value={weaveGap} onChange={(event) => setWeaveGap(Number(event.target.value))} />
              </label>
            )}
            {supportsDensity && (
              <label>
                <span>Density <output>{Math.round(density * 100)}%</output></span>
                <input aria-label="Density" type="range" min="0.1" max="1" step="0.05" value={density} onChange={(event) => setDensity(Number(event.target.value))} />
              </label>
            )}
            {isBotanical && (
              <label>
                <span>Petal depth <output>{petalDepth.toFixed(2)}</output></span>
                <input aria-label="Petal depth" type="range" min="0.08" max="0.42" step="0.01" value={petalDepth} onChange={(event) => setPetalDepth(Number(event.target.value))} />
              </label>
            )}
          </div>

          <div className="control-row">
            {isBotanical && (
              <Switch label="Botanical fill" checked={botanicalFill} onChange={(event) => setBotanicalFill(event.target.checked)} />
            )}
            <fieldset className="crop-options">
              <legend>Crop</legend>
              {(["none", "square", "circle"] as const).map((value) => (
                <label key={value}>
                  <input type="radio" name="crop" value={value} checked={crop === value} onChange={() => setCrop(value)} />
                  <span>{value}</span>
                </label>
              ))}
            </fieldset>
          </div>

          <fieldset className="overlay-options">
            <legend>Construction overlay</legend>
            <div>
              {(["none", "guides", "full"] as const).map((value) => (
                <label key={value}>
                  <input type="radio" name="overlay" value={value} checked={overlay === value} onChange={() => setOverlay(value)} />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="layer-options">
            <legend>SVG layers</legend>
            <label><input type="checkbox" checked readOnly disabled /><span>Geometry / modules</span><small>Bundled in generator output</small></label>
            <label><input type="checkbox" checked={layers.straps} disabled={!recipeHasStraps} onChange={(event) => setLayers((value) => ({ ...value, straps: event.target.checked }))} /><span>Straps</span><small>{recipeHasStraps ? "data-strand-layer" : "Not in this preset"}</small></label>
            <label><input type="checkbox" checked={layers.botanical} disabled={!recipeHasBotanical} onChange={(event) => setLayers((value) => ({ ...value, botanical: event.target.checked }))} /><span>Botanical</span><small>{recipeHasBotanical ? "data-botanical-role" : "Not in this preset"}</small></label>
            <label><input type="checkbox" checked readOnly disabled /><span>Outlines</span><small>Bundled in module paths</small></label>
            <label><input type="checkbox" checked={layers.construction} disabled={overlay === "none"} onChange={(event) => setLayers((value) => ({ ...value, construction: event.target.checked }))} /><span>Construction</span><small>data-construction-role</small></label>
          </fieldset>

          <fieldset className="palette-options">
            <legend>Palette</legend>
            {(Object.keys(palettes) as PaletteName[]).map((name) => (
              <button
                key={name}
                type="button"
                aria-label={`${name} palette`}
                aria-pressed={paletteName === name}
                onClick={() => setPaletteName(name)}
              >
                {palettes[name].slice(0, 5).map((color) => <span key={color} style={{ background: color }} />)}
              </button>
            ))}
          </fieldset>

          <div className="export-row">
            <Button type="button" onClick={download}>Download SVG</Button>
            <Button type="button" variant="secondary" onClick={() => copy("svg")}>Copy SVG</Button>
            <Button type="button" variant="quiet" onClick={() => copy("css")}>CSS</Button>
            <Button type="button" variant="quiet" onClick={() => copy("json")}>JSON</Button>
          </div>
          <p className="notice" aria-live="polite">{notice}</p>
        </form>
      </div>

      <section className="tier-study" aria-labelledby="tier-study-title">
        <header>
          <p className="eyebrow">Responsive fidelity</p>
          <h3 id="tier-study-title">One construction, three detail budgets</h3>
        </header>
        <div className="tier-grid">
          {tierResults.map(({ tier, result: tierResult }) => (
            <article key={tier}>
              <div className={`tier-canvas ${layerClass}`} dangerouslySetInnerHTML={{ __html: tierResult.svg }} />
              <div><strong>{tier}</strong><span>{tierResult.diagnostics.nodeCount} nodes</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="recipe-inspector" aria-labelledby="recipe-title">
        <header>
          <p className="eyebrow">Inspectable provenance</p>
          <h3 id="recipe-title">Recipe v2</h3>
          <code>{recipe.presetId}</code>
        </header>
        <dl className="recipe-facts">
          <div><dt>Construction</dt><dd>{recipe.construction.id} · v{recipe.construction.version}</dd></div>
          <div><dt>Topology</dt><dd>{recipe.topology.mode} · order {recipe.topology.rotationOrder} · {recipe.topology.edgeContinuity}</dd></div>
          <div><dt>Interlace</dt><dd>{recipe.topology.interlace}</dd></div>
          <div><dt>Repeat cell</dt><dd>{recipe.repeatCell.id} · {recipe.repeatCell.width.toFixed(1)} × {recipe.repeatCell.height.toFixed(1)}</dd></div>
          <div><dt>Vectors</dt><dd>{recipe.repeatCell.vectors.map(([x, y]) => `[${x.toFixed(1)}, ${y.toFixed(1)}]`).join(" · ")}</dd></div>
          <div><dt>Review</dt><dd>geometry {recipe.review.geometry} · culture {recipe.review.cultural}</dd></div>
        </dl>
        <div className="recipe-columns">
          <div>
            <h4>Source IDs</h4>
            <p className="source-chips">{recipe.sourceIds.map((id) => <code key={id}>{id}</code>)}</p>
          </div>
          <div>
            <h4>Prototiles</h4>
            <p>{recipe.topology.prototiles.join(" · ")}</p>
          </div>
          <div>
            <h4>Declared layers</h4>
            <p>{recipe.layers.map((layer) => `${layer.id} (${layer.role})`).join(" · ")}</p>
          </div>
        </div>
        <details>
          <summary>Review limitations ({recipe.review.limitations.length})</summary>
          <ul>{recipe.review.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
        </details>
      </section>
    </div>
  );
}
