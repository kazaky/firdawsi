import { generatePreset } from "@firdawsi/geometry";
import { useMemo, useState, type CSSProperties } from "react";
import { palettes, type PaletteName } from "./showcase-data";
import { SourceLink } from "./source-link";

export function GeometryArtwork({ palette, construction = false, hero = false }: {
  palette: PaletteName; construction?: boolean; hero?: boolean;
}) {
  const svg = useMemo(() => generatePreset(hero ? "medallion-16-nested" : "rosette-12-almond", {
    width: 640, height: 640, seed: "firdawsi-illumination-8", palette: palettes[palette],
    crop: "circle", stroke: 0.65, strandWidth: 1.2, weaveGap: 1.8,
    density: 0.4, simplificationTier: "expanded", maxNodes: 900,
    constructionOverlay: construction ? "full" : "none",
    accessibility: { decorative: true },
  }).svg, [palette, construction, hero]);
  return <div className={`geometry-artwork${hero ? " geometry-artwork--hero" : ""}`} aria-hidden="true">
    <div className="geometry-artwork__ring" />
    <div className="geometry-artwork__image" dangerouslySetInnerHTML={{ __html: svg }} />
  </div>;
}

export function ArtDirection({ palette, onPaletteChange }: {
  palette: PaletteName; onPaletteChange: (palette: PaletteName) => void;
}) {
  const [construction, setConstruction] = useState(false);
  return <section id="art-direction" className="section art-direction">
    <header className="art-heading">
      <p className="eyebrow">The visual language / اللغة البصرية</p>
      <h2>Beauty, held<br /><em>in balance.</em></h2>
      <p>A luminous ground. A measured line. Colour with room to breathe.
        Each part belongs to a whole.</p>
    </header>
    <div className="art-composition">
      <figure className="art-plate">
        <GeometryArtwork palette={palette} construction={construction} />
        <figcaption><span>01 / Twelve-fold rosette</span><span>Contemporary geometric study</span></figcaption>
      </figure>
      <div className="art-editorial">
        <span className="art-arabic" lang="ar" dir="rtl">جمالٌ باتّزان</span>
        <h3>One rhythm.<br />Many expressions.</h3>
        <p>The same construction can feel mineral, botanical, or earthen. We keep
          its proportions steady and give each colour family its own space.</p>
        <fieldset className="art-palettes">
          <legend>Explore the colour study</legend>
          {([["jade", "Malachite"], ["lapis", "Lapis"], ["terracotta", "Clay"]] as const).map(([id, label]) =>
            <label key={id} style={{ "--pigment": palettes[id][0] } as CSSProperties}>
              <input type="radio" name="art-palette" value={id} checked={palette === id}
                onChange={() => onPaletteChange(id)} /><span className="art-pigment" aria-hidden="true" />{label}
            </label>)}
        </fieldset>
        <label className="art-construction"><input type="checkbox" checked={construction}
          onChange={event => setConstruction(event.target.checked)} />Reveal the construction</label>
        <p className="art-source">Beauty informs the intention; the geometry is a human design choice. <SourceLink id="beauty" /></p>
      </div>
    </div>
    <div className="art-principles">
      <article><span>01 / Light</span><h3>Let the ground breathe.</h3><p>Warm, quiet surfaces hold content. Ornament gathers at deliberate moments, leaving reading and action clear.</p></article>
      <article><span>02 / Rhythm</span><h3>Repeat with purpose.</h3><p>Stable symmetry, generous intervals and a clear centre make a complex pattern feel composed.</p></article>
      <article><span>03 / Voice</span><h3>Give each script its grace.</h3><p>Expressive Latin serifs meet flowing Arabic forms. Body text keeps its own steady, readable cadence.</p></article>
    </div>
  </section>;
}
