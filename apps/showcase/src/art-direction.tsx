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

function InterfaceStudy() {
  const [selected, setSelected] = useState("Focus");
  const [complete, setComplete] = useState(false);
  return <div className="interface-study">
    <div className="interface-study__intro"><span className="eyebrow">From pattern to interaction</span>
      <h3>One language.<br />Every detail.</h3><p>The eight-fold centre becomes a selection mark. A softened facet gives controls their silhouette. Colour gathers around the action.</p>
      <SourceLink id="beauty" /></div>
    <div className="interface-study__demo">
      <div className="interface-study__top"><span className="facet-seal" aria-hidden="true">✦</span><span>Make room for intention<br /><span lang="ar" dir="rtl">مساحةٌ للنيّة</span></span><span className="study-status">Interactive study</span></div>
      <fieldset className="intention-choices"><legend>Choose your rhythm</legend>
        {["Focus", "Create", "Reflect"].map(label => <label key={label}><input type="radio" name="intention-study" checked={selected === label} onChange={() => { setSelected(label); setComplete(false); }} /><span>{label}</span></label>)}
      </fieldset>
      <div className="study-action-row"><div><span className="study-caption">Your intention</span><strong>{selected}, with presence.</strong></div>
        <button className="study-action" type="button" onClick={() => setComplete(!complete)} aria-pressed={complete}>{complete ? "Begin again" : "Set intention"}<span aria-hidden="true">{complete ? "↺" : "↗"}</span></button></div>
      <div className="study-progress" role="progressbar" aria-label="Intention set" aria-valuemin={0} aria-valuemax={1} aria-valuenow={complete ? 1 : 0}><span style={{ width: complete ? "100%" : "12%" }} /></div>
      <p className="study-feedback" role="status">{complete ? `${selected} is your intention. Take one thoughtful step.` : "A small action, a clear response."}</p>
    </div>
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
        <p>Stars and their complementary crosses share every edge. Facets bring light into the repeat; cobalt, violet and coral give it different expressions.</p>
        <fieldset className="art-palettes"><legend>Explore the colour study</legend>
          {([["cobalt", "Cobalt"], ["violet", "Violet"], ["coral", "Coral"]] as const).map(([id, label]) =>
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
    <InterfaceStudy />
  </section>;
}
