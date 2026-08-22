import {
  PATTERN_PRESET_IDS,
  PRESETS,
  applyRegionalProfile,
  generatePreset,
  preferredPresetForProfile,
  serializeRecipe,
  toCssPattern,
  type ConstructionOverlayMode,
  type CropMode,
  type PatternOptions,
  type PatternPresetId,
  type RegionalProfile,
  type SimplificationTier,
} from "@firdawsi/geometry";
import { themes, tokenVar, type ThemeName } from "@firdawsi/tokens";
import {
  AppHeader,
  Atmosphere,
  Banner,
  Button,
  Card,
  Checkbox,
  Dialog,
  Frame,
  IconButton,
  IslamicCorner,
  Menu,
  Navigation,
  PatternSurface,
  Progress,
  Radio,
  SearchField,
  Select,
  Sheet,
  Stepper,
  Switch,
  Tabs,
  TextField,
  Tooltip,
} from "@firdawsi/web";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import { KhatamMark } from "./khatam-mark";
import {
  GITHUB_URL,
  GuideMenuButton,
  GuidePanel,
  GuideScrim,
  guideNavGroups,
} from "./guide-panel";
import { CurvilinearIsometricPlate, KhatamZelligeReference } from "./reference-examples";

const profiles: RegionalProfile[] = [
  "universal",
  "maghrebi",
  "andalusi",
  "mamluk",
  "ottoman",
  "persian",
  "south-asian",
];

const profileCopy: Record<RegionalProfile, { place: string; note: string }> = {
  universal: { place: "Shared grammar", note: "A balanced, context-neutral baseline." },
  maghrebi: { place: "Western North Africa", note: "Compact rhythm and grounded proportions." },
  andalusi: { place: "Al-Andalus", note: "Measured intricacy with luminous intervals." },
  mamluk: { place: "Cairo & the Levant", note: "Assertive construction and clear hierarchy." },
  ottoman: { place: "Anatolia & Balkans", note: "Generous curves and spacious cadence." },
  persian: { place: "Iranian plateau", note: "Elongated rhythm with layered refinement." },
  "south-asian": { place: "South Asia", note: "Architectural clarity with a warm density." },
};

const palettes = {
  courtyard: ["#113b67", "#0d684f", "#f3ead7", "#ca9338", "#a84932"],
  lapis: ["#153f73", "#267b70", "#f7efd9", "#d3a13e", "#963e2f"],
  jade: ["#0b5b49", "#173d65", "#f1e8d2", "#d5a23d", "#ad5438"],
  terracotta: ["#9e4733", "#133e6a", "#f6eddc", "#bf8b2e", "#276c5b"],
} as const;

type PaletteName = keyof typeof palettes;
type Theme = ThemeName;

type PresetCategory = "geometric" | "architectural" | "botanical" | "hybrid";

const presetGroups: Record<PresetCategory, readonly PatternPresetId[]> = {
  geometric: [
    "khatam-8-star-cross",
    "rosette-12-almond",
    "medallion-16-nested",
    "girih-10-straps",
    "zellige-star-cross",
  ],
  architectural: [
    "jali-8-screen",
    "pointed-arch",
    "khatam-corners",
    "geometric-frame",
    "construction-grid",
  ],
  botanical: ["rumi-medallion-6", "palmette-roundel"],
  hybrid: ["floral-geometric-field"],
};

interface GalleryPreset {
  id: PatternPresetId;
  label: string;
  note: string;
  wide?: boolean;
  overlay?: ConstructionOverlayMode;
}

const galleryPresets: readonly GalleryPreset[] = [
  { id: "khatam-8-star-cross", label: "Khatam · 8", note: "Star, cross, kite, almond", wide: true, overlay: "guides" },
  { id: "rosette-12-almond", label: "Rosette · 12", note: "Compass-derived almond ring" },
  { id: "medallion-16-nested", label: "Medallion · 16", note: "Nested focal construction" },
  { id: "girih-10-straps", label: "Girih · 10", note: "Decagon prototile field", wide: true },
  { id: "zellige-star-cross", label: "Zellige star-cross", note: "Exact square repeat" },
  { id: "jali-8-screen", label: "Jali · 8", note: "Continuous 4.8.8 lattice" },
  { id: "rumi-medallion-6", label: "Rumi medallion", note: "Six-fold botanical whorl", overlay: "guides" },
  { id: "palmette-roundel", label: "Palmette roundel", note: "Bilateral focal study" },
  { id: "floral-geometric-field", label: "Floral-geometric field", note: "Repeat-governed leaf lattice", wide: true },
] as const;

function categoryForPreset(presetId: PatternPresetId): PresetCategory {
  for (const [category, ids] of Object.entries(presetGroups) as [
    PresetCategory,
    readonly PatternPresetId[],
  ][]) {
    if (ids.includes(presetId)) return category;
  }
  return "geometric";
}

const sectionIds = guideNavGroups.flatMap((group) => group.items.map((item) => item.id));

function Mark(props: { size?: number; className?: string; labelled?: boolean }) {
  return <KhatamMark {...props} />;
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function SectionHeading({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="section-heading">
      <div className="section-index" aria-hidden="true">{number}</div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {children && <p className="section-intro">{children}</p>}
      </div>
    </header>
  );
}

function PresetPreview({
  presetId,
  options,
  className = "",
}: {
  presetId: PatternPresetId;
  options?: PatternOptions;
  className?: string;
}) {
  const svg = useMemo(
    () =>
      generatePreset(presetId, {
        width: 720,
        height: 500,
        maxNodes: 1400,
        accessibility: { decorative: true },
        ...options,
      }).svg,
    [options, presetId],
  );
  return (
    <div
      className={`pattern-preview ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function ThemeControls({
  theme,
  setTheme,
  direction,
  setDirection,
}: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  direction: "ltr" | "rtl";
  setDirection: (direction: "ltr" | "rtl") => void;
}) {
  return (
    <div className="display-controls" aria-label="Display preferences">
      <div className="segmented" aria-label="Color theme">
        {(["light", "dark", "highContrast"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-label={option === "highContrast" ? "High contrast" : option}
            aria-pressed={theme === option}
            onClick={() => setTheme(option)}
          >
            <span className={`theme-dot theme-dot--${option}`} />
            <span className="control-label">{option === "highContrast" ? "Contrast" : option}</span>
          </button>
        ))}
      </div>
      <div className="segmented" aria-label="Text direction">
        {(["ltr", "rtl"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={direction === option}
            onClick={() => setDirection(option)}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

function PatternStudio() {
  const [presetId, setPresetId] = useState<PatternPresetId>("khatam-8-star-cross");
  const [symmetry, setSymmetry] = useState<NonNullable<PatternOptions["symmetry"]>>(8);
  const [seed, setSeed] = useState("courtyard-27");
  const [unitSize, setUnitSize] = useState(76);
  const [stroke, setStroke] = useState(1.35);
  const [strandWidth, setStrandWidth] = useState(2.1);
  const [weaveGap, setWeaveGap] = useState(1.4);
  const [petalDepth, setPetalDepth] = useState(0.2);
  const [density, setDensity] = useState(0.68);
  const [botanicalFill, setBotanicalFill] = useState(true);
  const [crop, setCrop] = useState<CropMode>("square");
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

function NavGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 7h16M4 12h10M4 17h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ComponentMatrix() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="component-stage">
      <div className="component-panel component-panel--wide">
        <div className="panel-label"><span>01</span>App chrome</div>
        <AppHeader
          brand={<Mark size={28} />}
          title="Firdawsi"
          actions={
            <>
              <Button variant="secondary" size="sm" corner="bevel">Share</Button>
              <IconButton label="More actions" variant="quiet" size="sm">⋯</IconButton>
            </>
          }
          framed
        >
          <Navigation
            label="Product sections"
            items={[
              { label: "Overview", href: "#overview", current: true, icon: <NavGlyph /> },
              { label: "Library", href: "#geometry", badge: 3, icon: <NavGlyph /> },
              { label: "Studio", href: "#studio", icon: <NavGlyph /> },
            ]}
          />
        </AppHeader>
      </div>

      <div className="component-panel">
        <div className="panel-label"><span>02</span>Buttons</div>
        <div className="button-row">
          {(["primary", "secondary", "quiet", "danger"] as const).map((variant) => (
            <Button key={variant} variant={variant}>{variant}</Button>
          ))}
        </div>
        <div className="button-row">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Button key={size} size={size} variant="secondary">{size}</Button>
          ))}
          <IconButton label="Bookmark" variant="secondary">★</IconButton>
        </div>
        <div className="button-row">
          <Button variant="secondary" corner="round">Round</Button>
          <Button variant="secondary" corner="bevel">Bevel</Button>
          <Button variant="secondary" corner="notch">Notch</Button>
          <Button variant="secondary" corner="arch">Arch</Button>
        </div>
      </div>

      <div className="component-panel">
        <div className="panel-label"><span>03</span>Inputs & choices</div>
        <div className="field-row">
          <TextField label="Title" placeholder="Thursday review" />
          <SearchField label="Search the collection" placeholder="Type a keyword…" />
          <Select label="View" options={[{ label: "All items", value: "all" }, { label: "Recent", value: "recent" }]} />
        </div>
        <div className="choice-row">
          <Checkbox label="Include archived" />
          <Switch label="Live updates" defaultChecked />
          <Radio label="Weekly digest" name="frequency" defaultChecked />
          <Radio label="Monthly digest" name="frequency" />
        </div>
        <Menu
          label="Actions"
          items={[
            { label: "Duplicate", onSelect: () => undefined },
            { label: "Archive", onSelect: () => undefined },
            { label: "Delete", onSelect: () => undefined, disabled: true },
          ]}
        />
      </div>

      <div className="component-panel component-panel--wide">
        <div className="panel-label"><span>04</span>Cards · corners & ornaments</div>
        <div className="card-matrix">
          <Card title="Round · quiet" corner="round" ornament="none">Baseline surface without ornament.</Card>
          <Card title="Bevel · corners" corner="bevel" ornament="corners" intensity="quiet">Corner fragments frame the content.</Card>
          <Card title="Notch · frame" corner="notch" ornament="frame" intensity="balanced">A boundary band for emphasis.</Card>
          <Card title="Arch · pattern" corner="arch" ornament="pattern" intensity="quiet">Quiet lattice behind the copy.</Card>
        </div>
      </div>

      <div className="component-panel component-panel--wide">
        <div className="panel-label"><span>05</span>Atmosphere</div>
        <div className="atmosphere-matrix">
          <Atmosphere tone="courtyard-wash" pattern data-atmosphere="courtyard-wash">
            <p className="eyebrow">courtyard-wash</p>
            <h3>Warm courtyard field</h3>
          </Atmosphere>
          <Atmosphere tone="lapis-veil" data-atmosphere="lapis-veil">
            <p className="eyebrow">lapis-veil</p>
            <h3>Cool veil gradient</h3>
          </Atmosphere>
          <Atmosphere tone="jade-depth" pattern presetId="jali-8-screen" data-atmosphere="jade-depth">
            <p className="eyebrow">jade-depth</p>
            <h3>Deep jade with lattice</h3>
          </Atmosphere>
        </div>
      </div>

      <div className="component-panel component-panel--pattern">
        <div className="panel-label"><span>06</span>Frame & corner</div>
        <PatternSurface kind="screen" intensity="quiet" options={{ symmetry: 8 }}>
          <Frame options={{ symmetry: 8, density: 0.25 }}>
            <p className="eyebrow">Bilingual card</p>
            <h3>Thursday review</h3>
            <p>Five tasks are ready for a final pass.</p>
            <div className="bilingual-line">
              <span>Open workspace</span>
              <span lang="ar" dir="rtl">فتح مساحة العمل</span>
            </div>
          </Frame>
        </PatternSurface>
        <IslamicCorner options={{ density: 0.2 }}>
          <p className="eyebrow">IslamicCorner</p>
          <p>Mirrored quarter fragments for inset moments.</p>
        </IslamicCorner>
      </div>

      <div className="component-panel component-panel--wide">
        <div className="panel-label"><span>07</span>Overlays & progress</div>
        <div className="button-row">
          <Button type="button" onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Button type="button" variant="secondary" onClick={() => setSheetOpen(true)}>Open sheet</Button>
          <Tooltip content="Measured clarity"><Button variant="quiet">Hover tip</Button></Tooltip>
        </div>
        <Tabs
          label="Project details"
          items={[
            { id: "overview", label: "Overview", content: <Banner title="Everything is in rhythm">The workspace is up to date and ready to share.</Banner> },
            { id: "progress", label: "Progress", content: <Progress label="Editorial review" value={72} showValue /> },
            { id: "steps", label: "Steps", content: <Stepper current={1} steps={[{ label: "Draft" }, { label: "Review" }, { label: "Publish" }]} /> },
          ]}
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Confirm publish" description="This will make the collection public." footer={<Button onClick={() => setDialogOpen(false)}>Done</Button>}>
          Review provenance tags before publishing.
        </Dialog>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="Filters" footer={<Button variant="secondary" onClick={() => setSheetOpen(false)}>Close</Button>}>
          Narrow the gallery by symmetry, region, or medium.
        </Sheet>
      </div>
    </div>
  );
}

export function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [active, setActive] = useState("overview");
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "highContrast" ? "high-contrast" : theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === "rtl" ? "ar" : "en";
  }, [direction]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -66%", threshold: [0, 0.2, 0.5] },
    );
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!guideOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGuideOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guideOpen]);

  return (
    <div className={`app${guideOpen ? " app--guide-open" : ""}`}>
      <header className="topbar">
        <div className="topbar__start">
          <GuideMenuButton open={guideOpen} onClick={() => setGuideOpen((value) => !value)} />
          <a className="brand" href="#overview" aria-label="Firdawsi home">
            <Mark />
            <span>Firdawsi <i>/</i> <span lang="ar" dir="rtl">فردوسي</span></span>
          </a>
        </div>
        <div className="topbar__end">
          <a className="topbar__github" href={GITHUB_URL} rel="noreferrer" target="_blank">
            GitHub <Arrow />
          </a>
          <ThemeControls
            theme={theme}
            setTheme={setTheme}
            direction={direction}
            setDirection={setDirection}
          />
        </div>
      </header>

      <GuideScrim open={guideOpen} onClose={() => setGuideOpen(false)} />
      <GuidePanel
        active={active}
        mobileOpen={guideOpen}
        onNavigate={() => setGuideOpen(false)}
      />

      <main id="main">
        <section id="overview" className="hero">
          <div className="hero-grid" aria-hidden="true">
            <KhatamMark size={420} className="hero-khatam" />
          </div>
          <div className="hero-content">
            <p className="issue-label">Paradise-inspired design · al-tasmīm al-firdawsī</p>
            <h1>
              Gardens of
              <span>light.</span>
            </h1>
            <div className="hero-statement">
              <p>
                A modern interface system rooted in the Firdawsi grammar of Islamic architecture —
                enclosure, water, geometry, and measured ornament translated into digital structure.
              </p>
              <p lang="ar" dir="rtl">
                نظام واجهات معاصر يستمد من التصميم الفردوسي: الإحاطة والماء والهندسة والزخرفة المقيسة،
                فيخدم البنية لا الزينة.
              </p>
            </div>
            <div className="hero-actions">
              <a className="text-link" href="#studio">Open Pattern Studio <Arrow /></a>
              <a className="text-link text-link--quiet" href="#principles">Read the manifesto ↓</a>
              <a className="text-link text-link--github" href={GITHUB_URL} rel="noreferrer" target="_blank">
                Star on GitHub <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-meta">
            <span>10 families</span><span>3 themes</span><span>2 directions</span><span>∞ outcomes</span>
          </div>
        </section>

        <section id="principles" className="section">
          <SectionHeading number="01" eyebrow="Manifesto" title="Principles before pixels">
            The system does not reproduce a single visual tradition. It translates durable ideas
            into an adaptable interface language.
          </SectionHeading>
          <div className="principle-list">
            {[
              ["01", "Geometry carries meaning", "Proportion, repetition, and relation organize the interface before any ornament appears."],
              ["02", "Culture is plural", "Regional profiles are lenses, never labels. They invite context without collapsing difference."],
              ["03", "Language shapes layout", "Arabic and Latin scripts receive equal typographic attention, not mirrored afterthoughts."],
              ["04", "Restraint creates presence", "Pattern is used as architecture: to frame, pace, divide, and guide."],
            ].map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span><h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="foundations" className="section section--ink">
          <SectionHeading number="02" eyebrow="Foundations" title="A calibrated material palette">
            Semantic tokens keep every surface coherent across themes, directions, and products.
          </SectionHeading>
          <div className="foundation-layout">
            <div className="swatch-stack">
              {[
                ["Primary / Jade", themes[theme]["color.primary"]],
                ["Accent / Saffron", themes[theme]["color.accent"]],
                ["Surface", themes[theme]["color.surface"]],
                ["Text", themes[theme]["color.text"]],
              ].map(([label, value], index) => (
                <div className="swatch" key={label} style={{ "--swatch": value } as CSSProperties}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{label}</strong>
                  <code>{value}</code>
                </div>
              ))}
            </div>
            <div className="type-specimen">
              <p className="eyebrow">Multiscript typography</p>
              <div className="type-line type-line--display">
                <span>Measured clarity</span>
                <span lang="ar" dir="rtl">وضوحٌ متوازن</span>
              </div>
              <div className="type-line">
                <p>Plan the next step with calm, legible hierarchy.</p>
                <p lang="ar" dir="rtl">خطّط للخطوة التالية بتسلسل واضح وهادئ.</p>
              </div>
              <div className="measure-grid">
                {[4, 8, 16, 24, 40, 64].map((size) => (
                  <div key={size}><span style={{ width: size }} />{size}</div>
                ))}
              </div>
              <code className="token-callout">{tokenVar("font.family.sans")}</code>
            </div>
          </div>
        </section>

        <section id="geometry" className="section">
          <SectionHeading number="03" eyebrow="Construction atlas" title="Exact geometry at working scale">
            Nine curated studies move from compass divisions and repeat cells to architectural
            lattices and botanical-geometric fields — plus reference plates from the Firdawsi tradition.
          </SectionHeading>
          <div className="geometry-grid">
            {galleryPresets.map((study, index) => (
              <article className={study.wide ? "geometry-card geometry-card--wide" : "geometry-card"} key={study.id}>
                <PresetPreview
                  presetId={study.id}
                  options={{
                    seed: `atlas-${study.id}`,
                    unitSize: study.wide ? 104 : 78,
                    density: 0.66,
                    stroke: 1.15,
                    strandWidth: 2,
                    weaveGap: 1.35,
                    petalDepth: 0.2,
                    botanicalFill: true,
                    constructionOverlay: study.overlay ?? "none",
                    simplificationTier: "expanded",
                    crop: PRESETS[study.id].topology.mode === "focal" ? "circle" : "square",
                    palette: palettes[index % 2 === 0 ? "courtyard" : "lapis"],
                  }}
                />
                <div className="geometry-card__caption">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{study.label}</h3><p>{study.note}</p></div>
                  <code>{study.id}</code>
                </div>
              </article>
            ))}
          </div>

          <div className="reference-studies">
            <header className="reference-studies__intro">
              <p className="eyebrow">Reference examples</p>
              <h3>From garden tile to construction plate</h3>
              <p>
                Traditional sources show how color, interlace, and isometric scaffolds turn abstract
                geometry into paradisiacal atmosphere — the same grammar Firdawsi encodes as recipes.
              </p>
            </header>
            <div className="reference-grid">
              <article className="reference-card reference-card--wide">
                <KhatamZelligeReference />
                <div className="geometry-card__caption">
                  <span>Ref</span>
                  <div>
                    <h3>Khatam · zellige palette</h3>
                    <p>
                      Eight-fold star and cross with interlaced straps — the Alhambra courtyard motif
                      rendered as a multi-role color study.
                    </p>
                  </div>
                  <code>khatam-8 · zellige</code>
                </div>
              </article>
              <article className="reference-card reference-card--wide">
                <div className="reference-preview reference-preview--plate">
                  <CurvilinearIsometricPlate />
                </div>
                <div className="geometry-card__caption">
                  <span>Ref</span>
                  <div>
                    <h3>Curvilinear isometric tessellation</h3>
                    <p>
                      From a single figure on a triangular grid to a tessellated field embellished with
                      stars and hexagons — a classic construction sequence.
                    </p>
                  </div>
                  <code>isometric · girih</code>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="regions" className="section section--sand">
          <SectionHeading number="04" eyebrow="Regional profiles" title="One engine, many cadences">
            Profiles adjust proportion and rhythm while preserving the same API and performance budget.
          </SectionHeading>
          <div className="profile-strip">
            {profiles.map((profile, index) => {
              const presetId = preferredPresetForProfile(profile);
              const options = applyRegionalProfile({
                regionalProfile: profile,
                seed: `profile-${profile}`,
                stroke: 1.2,
                width: 720,
                height: 500,
                maxNodes: 1400,
                simplificationTier: "expanded",
                accessibility: { decorative: true },
                palette: ["currentColor", "#dda83a", "transparent", "#2f6f6d"],
              });
              return (
                <article key={profile} data-region={profile} data-preset={presetId}>
                  <PresetPreview presetId={presetId} options={options} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{profile.replace("-", " ")}</h3>
                  <small>{profileCopy[profile].place}</small>
                  <p>{profileCopy[profile].note}</p>
                  <code data-preset={presetId}>{presetId}</code>
                </article>
              );
            })}
          </div>
        </section>

        <section id="components" className="section">
          <SectionHeading number="05" eyebrow="Component gallery" title="Familiar controls, distinct voice">
            Accessible React primitives carry the design language without changing expected behavior.
          </SectionHeading>
          <ComponentMatrix />
        </section>

        <section id="motion" className="section section--motion">
          <SectionHeading number="06" eyebrow="Motion" title="Movement should explain">
            Transitions clarify cause and effect. They remain brief, interruptible, and disappear when reduced motion is preferred.
          </SectionHeading>
          <div className="motion-grid">
            {[
              ["120", "Respond", "Hover, press, focus"],
              ["220", "Rearrange", "Tabs, disclosure, layout"],
              ["360", "Enter", "Panels and spatial context"],
            ].map(([duration, title, copy], index) => (
              <div className="motion-card" key={duration}>
                <div className={`motion-orbit motion-orbit--${index + 1}`}><Mark size={24} /></div>
                <strong>{duration}<small>ms</small></strong>
                <h3>{title}</h3><p>{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="accessibility" className="section">
          <SectionHeading number="07" eyebrow="Accessibility" title="Access is part of the form">
            Contrast, focus, direction, language, and motion preferences are design inputs—not post-production checks.
          </SectionHeading>
          <div className="access-layout">
            <div className="access-score">
              <div>
                <span>AA</span>
                <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" /><circle className="score-ring" cx="60" cy="60" r="52" /></svg>
              </div>
              <p>Core semantic pairs maintain WCAG AA contrast across all three themes.</p>
            </div>
            <div className="access-list">
              {[
                ["Direction aware", "Logical properties and mirrored reading order."],
                ["Keyboard complete", "Visible focus and predictable tab sequence."],
                ["Motion considerate", "No essential information depends on animation."],
                ["Geometry described", "Decorative SVG stays silent; meaningful SVG is named."],
              ].map(([title, copy], index) => (
                <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div><b aria-hidden="true">✓</b></article>
              ))}
            </div>
          </div>
          <div className="language-pair">
            <article dir="ltr"><span>English / LTR</span><h3>Your week, in balance.</h3><p>Review priorities and make room for what matters next.</p></article>
            <article dir="rtl" lang="ar"><span>العربية / من اليمين</span><h3>أسبوعك، بتوازن.</h3><p>راجع أولوياتك واترك مساحة لما هو مهم تالياً.</p></article>
          </div>
        </section>

        <section id="studio" className="section section--studio">
          <SectionHeading number="08" eyebrow="Preset-first workshop" title="Pattern Studio">
            Begin with a construction-valid preset, tune only the controls its family supports,
            compare responsive tiers, then inspect and export its recipe.
          </SectionHeading>
          <PatternStudio />
        </section>

        <footer className="footer">
          <div><Mark size={42} /><strong>Firdawsi</strong></div>
          <p>Paradise-inspired design for interfaces that feel grounded, contemporary, and open to many contexts.</p>
          <a href="https://firdawsi.org" rel="noreferrer">firdawsi.org</a>
          <a href={GITHUB_URL} rel="noreferrer" target="_blank">GitHub</a>
          <a href="#overview">Return to top ↑</a>
        </footer>
      </main>
    </div>
  );
}
