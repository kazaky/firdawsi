import { useState, type CSSProperties } from "react";
import { palettes, type PaletteName } from "./showcase-data";
import { SourceLink } from "./source-link";
import { MosaicArt } from "./mosaic-art";

export function GeometryArtwork({ palette, construction = false, hero = false }: {
  palette: PaletteName; construction?: boolean; hero?: boolean;
}) {
  return <div className={`geometry-artwork${hero ? " geometry-artwork--hero" : ""}`} aria-hidden="true">
    <MosaicArt palette={palette} construction={construction} hero={hero} />
  </div>;
}

export function ArtDirection({ palette, onPaletteChange }: {
  palette: PaletteName; onPaletteChange: (palette: PaletteName) => void;
}) {
  const [construction, setConstruction] = useState(false);
  return <section id="art-direction" className="section art-direction">
    <header className="art-heading">
      <p className="eyebrow">The visual language / اللغة البصرية</p>
      <h2>Coherence<br /><em>carries identity.</em></h2>
      <p>Expressive colour. Exact geometry. Two scripts with a shared voice.
        A living design language, from the smallest action to the whole composition.</p>
    </header>
    <div className="art-composition">
      <figure className="art-plate">
        <GeometryArtwork palette={palette} construction={construction} />
        <figcaption><span>01 / Eight-fold star & cross</span><span>Contemporary geometric study</span></figcaption>
      </figure>
      <div className="art-editorial">
        <span className="art-arabic" lang="ar" dir="rtl">تناسقٌ يصنع الهويّة</span>
        <h3>Precise in structure.<br />Alive in colour.</h3>
        <p>Stars and their complementary crosses share every edge. Facets bring light into the repeat; garden greens, cobalt, violet and coral give it different expressions.</p>
        <fieldset className="art-palettes"><legend>Explore the colour study</legend>
          {([["garden", "Garden"], ["cobalt", "Cobalt"], ["violet", "Violet"], ["coral", "Coral"]] as const).map(([id, label]) =>
            <label key={id} style={{ "--pigment": palettes[id][0] } as CSSProperties}>
              <input type="radio" name="art-palette" value={id} checked={palette === id} onChange={() => onPaletteChange(id)} />
              <span className="art-pigment" aria-hidden="true" />{label}
            </label>)}
        </fieldset>
        <label className="art-construction"><input type="checkbox" checked={construction} onChange={event => setConstruction(event.target.checked)} />Reveal the construction</label>
        <p className="art-source">Beauty informs the intention; the geometry is a human design choice. <SourceLink id="beauty" /></p>
      </div>
    </div>
    <div className="art-principles">
      <article><span>01 / Colour</span><h3>Light, with energy.</h3><p>Cobalt anchors the interface. Violet creates depth; coral adds warmth. Clear reading surfaces give each colour room.</p></article>
      <article><span>02 / Geometry</span><h3>From edge to whole.</h3><p>Shared boundaries build the repeat. The same measured facets guide controls, selection and composition.</p></article>
      <article><span>03 / Typography</span><h3>Two scripts. One voice.</h3><p>El Messiri carries both Arabic and Latin display. Each script keeps its natural rhythm, with Noto Sans for sustained reading.</p></article>
    </div>
  </section>;
}
