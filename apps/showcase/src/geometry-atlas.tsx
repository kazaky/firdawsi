import { generatePreset, PRESETS, serializeRecipe, type PatternPresetId, type RegionalProfile } from '@firdawsi/geometry';
import { useMemo, useRef, useState } from 'react';
import { CurvilinearIsometricPlate, KhatamZelligeReference, ZelligeConstructionPlate } from './reference-examples';
import './geometry-atlas.css';

type Tradition='all'|'andalusi'|'maghrebi'|'persian'|'ottoman'|'mamluk'|'south-asian';
type Family='all'|'stars'|'tiles'|'architecture'|'botanical';
export const atlasStudies: {id:PatternPresetId;name:string;subtitle:string;region:Exclude<Tradition,'all'>;family:Exclude<Family,'all'>;note:string;new?:boolean}[]=[
 {id:'shamsa-sunburst',name:'A sun made of petals',subtitle:'Shamsa · illuminated medallion',region:'persian',family:'stars',note:'Follow each ray outward: a small star opens into layered petals, then a delicate crown.',new:true},
 {id:'sebka-lattice',name:'The woven wall',subtitle:'Sebka · curving lozenge net',region:'andalusi',family:'architecture',note:'Curved outlines meet at their tips. The empty spaces become as important as the lines.',new:true},
 {id:'zellige-pinwheel',name:'Colour in rotation',subtitle:'Pinwheel · four-part tile study',region:'maghrebi',family:'tiles',note:'Four kite-like pieces turn around a diamond. A simple square cell becomes a field of movement.',new:true},
 {id:'islimi-vine',name:'A line becomes a garden',subtitle:'Islimi · scrolling vine study',region:'persian',family:'botanical',note:'An S-curve carries paired leaves. Follow the stem across the repeat to see its continuity.',new:true},
 {id:'lobed-arch',name:'Seven curves, one threshold',subtitle:'Lobed arch · architectural study',region:'andalusi',family:'architecture',note:'Seven curved lobes shape the opening; nested outlines build depth without adding a surface pattern.',new:true},
 {id:'hex-rosette-field',name:'Flowers without an end',subtitle:'Six-fold · triangular flower lattice',region:'maghrebi',family:'botanical',note:'Six petals gather around each centre. Offset rows make a field that continues beyond the frame.',new:true},
 {id:'khatam-8-star-cross',name:'The star and its neighbour',subtitle:'Khatam · eight-fold star & cross',region:'andalusi',family:'stars',note:'Read the star, then the space between stars: both are part of the same composition.'},
 {id:'zellige-star-cross',name:'A mosaic of belonging',subtitle:'Zellige · star-and-cross repeat',region:'maghrebi',family:'tiles',note:'A square repeat holds two complementary shapes. Their shared boundaries give the field its rhythm.'},
 {id:'girih-10-straps',name:'Paths that become stars',subtitle:'Girih · ten-fold strapwork',region:'persian',family:'stars',note:'Trace the angular paths through the network. Construction guides reveal the underlying scaffold.'},
 {id:'rosette-12-almond',name:'Twelve moments of light',subtitle:'Rosette · compass-derived almonds',region:'andalusi',family:'stars',note:'Twelve divisions of a circle place the petals. Repetition makes a complex whole from one gesture.'},
 {id:'medallion-16-nested',name:'A centre that keeps unfolding',subtitle:'Medallion · sixteen-fold composition',region:'mamluk',family:'stars',note:'Nested stars create layers of scale. The eye can move from the centre to the edge and back.'},
 {id:'jali-8-screen',name:'Geometry made of air',subtitle:'Jali · octagon-and-square screen',region:'south-asian',family:'architecture',note:'Octagons and squares share an edge network. The openings, rather than filled tiles, define the design.'},
 {id:'rumi-medallion-6',name:'A turning botanical world',subtitle:'Rumi · six-fold medallion',region:'ottoman',family:'botanical',note:'Leaves, petals, and scrolls turn around a central void, held together by six-fold geometry.'},
 {id:'palmette-roundel',name:'Two sides in conversation',subtitle:'Palmette · mirrored botanical roundel',region:'persian',family:'botanical',note:'Paired leaves balance across an axis. Look for the difference between reflection and rotation.'},
 {id:'floral-geometric-field',name:'Where leaf meets lattice',subtitle:'Floral field · geometry & foliage',region:'persian',family:'botanical',note:'Botanical details follow the repeat scaffold. Geometry provides a place for every leaf.'},
 {id:'pointed-arch',name:'Two centres, one meeting',subtitle:'Pointed arch · compass construction',region:'andalusi',family:'architecture',note:'Two circular arcs meet at the crown. Reveal the guides to see the construction behind the silhouette.'},
];
const traditions:{id:Tradition;name:string;ar:string;description:string}[]=[
 {id:'all',name:'All traditions',ar:'لغات الجمال',description:'A shared language, many expressions. Explore original vector studies inspired by geometric, architectural, and vegetal ornament across the Islamic world.'},
 {id:'andalusi',name:'Andalusi',ar:'أندلسي',description:'Curving sebka, lobed thresholds, and measured star compositions. These studies explore the relationship between architectural openings and patterned surfaces.'},
 {id:'maghrebi',name:'Moroccan',ar:'مغربي',description:'Colour, repetition, and the meeting of small pieces. Explore tile compositions and floral geometry through contemporary studies inspired by Moroccan ornament.'},
 {id:'persian',name:'Persian',ar:'فارسي',description:'Radiating medallions, angular networks, and scrolling foliage. These studies explore how a strong centre and a continuing field offer different kinds of rhythm.'},
 {id:'ottoman',name:'Ottoman',ar:'عثماني',description:'Explore a botanical medallion where curved leaves and six-fold order work together.'},
 {id:'mamluk',name:'Mamluk',ar:'مملوكي',description:'Explore a dense sixteen-fold composition through nested stars, petals, and changes of scale.'},
 {id:'south-asian',name:'South Asian',ar:'جنوب آسيوي',description:'Explore the screen as a composition of openings, with an octagonal network that lets the background become part of the design.'},
];
const pigments={
 twilight:{name:'Twilight',colors:['#f4c979','#bd89b2','#242341','#7799c5','#f4e7c9']},
 lapis:{name:'Lapis & copper',colors:['#203d87','#3ba6ac','#f4e9d5','#d77851','#e3b758']},
 rose:{name:'Rose & saffron',colors:['#71385b','#bc6a8c','#fff0df','#dd9b48','#4f658c']},
 jade:{name:'Jade & ink',colors:['#153f47','#5c9a83','#eff0d7','#b7ba70','#d48c54']},
} as const;
type Pigment=keyof typeof pigments;
function saveFile(content:string,type:string,name:string){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

function StudyCard({study,index,selected,onSelect,pigment}:{study:typeof atlasStudies[number];index:number;selected:boolean;onSelect:()=>void;pigment:Pigment}){
 const svg=useMemo(()=>generatePreset(study.id,{width:480,height:350,unitSize:110,crop:"none",stroke:.8,palette:pigments[pigment].colors,seed:'atlas-study',maxNodes:1000,accessibility:{decorative:true}}).svg,[study.id,pigment]);
 return <button className="atlas-card" aria-pressed={selected} onClick={onSelect} data-preset={study.id}><div className="atlas-card-art" style={{background:pigments[pigment].colors[2]}} dangerouslySetInnerHTML={{__html:svg}}/><span className="atlas-card-meta"><span>{String(index+1).padStart(2,'0')} / {traditions.find(r=>r.id===study.region)?.name}</span>{study.new&&<em>New study</em>}</span><strong>{study.name}</strong><span className="atlas-card-subtitle">{study.subtitle}<span aria-hidden="true">↗</span></span></button>;
}

export function GeometryAtlas({onOpenStudio}:{onOpenStudio:(id:PatternPresetId)=>void}){
 const [tradition,setTradition]=useState<Tradition>('all');
 const [family,setFamily]=useState<Family>('all');
 const [selected,setSelected]=useState<PatternPresetId>('shamsa-sunburst');
 const [pigment,setPigment]=useState<Pigment>('twilight');
 const [guides,setGuides]=useState(false);
 const [motion,setMotion]=useState(false);
 const [scale,setScale]=useState(135);
 const [replay,setReplay]=useState(0);
 const feature=useRef<HTMLDivElement>(null);
 const study=atlasStudies.find(s=>s.id===selected)!;
 const region=traditions.find(r=>r.id===tradition)!;
 const visible=atlasStudies.filter(s=>(tradition==='all'||s.region===tradition)&&(family==='all'||s.family===family));
 const result=useMemo(()=>generatePreset(selected,{width:800,height:650,unitSize:scale,crop:"none",stroke:1.1,seed:'atlas-study',palette:pigments[pigment].colors,regionalProfile:study.region as RegionalProfile,constructionOverlay:guides?'full':'none',maxNodes:2600,accessibility:{title:study.subtitle,description:study.note}}),[selected,scale,pigment,guides,study]);
 const periodic=PRESETS[selected].topology.mode==='periodic';
 const selectStudy=(id:PatternPresetId)=>{setSelected(id);setReplay(v=>v+1);feature.current?.scrollIntoView({behavior:'instant',block:'start'});};
 const filterRegion=(id:Tradition)=>{setTradition(id);setFamily('all');setSelected(atlasStudies.find(s=>id==='all'||s.region===id)!.id);};
 return <div className="geometry-atlas">
  <header className="atlas-heading"><div><p className="eyebrow">03 / Geometry & traditions</p><h2>One line.<br/><em>Infinite worlds.</em></h2></div><div><span className="atlas-heading-ar" lang="ar" dir="rtl">هندسةٌ تُزهر</span><p>From the courtyards of Al-Andalus to Moroccan mosaics and Persian gardens: explore shape, place, and the art of repetition.</p><span className="atlas-count">16 studies <i/> 6 new constructions <i/> 6 traditions</span></div></header>
  <nav className="atlas-traditions" aria-label="Filter by tradition">{traditions.map(r=><button key={r.id} aria-pressed={tradition===r.id} onClick={()=>filterRegion(r.id)}>{r.name}</button>)}</nav>
  <div className="atlas-region-intro"><span lang="ar" dir="rtl">{region.ar}</span><p>{region.description}</p></div>
  <div className="atlas-feature" ref={feature}>
   <div className={`atlas-stage ${motion?'atlas-stage--moving':''} ${PRESETS[selected].topology.mode==='focal'?'atlas-stage--focal':'atlas-stage--periodic'}`} style={{background:pigments[pigment].colors[2]}}><span className="atlas-stage-label">{guides?'The construction beneath the surface':'A study in light, colour & proportion'}</span><div key={`${selected}-${replay}`} className="atlas-feature-svg" dangerouslySetInnerHTML={{__html:result.svg}}/><div className="atlas-stage-footer"><span>{selected==='lobed-arch'?'Bilateral symmetry':`${PRESETS[selected].topology.rotationOrder}-fold order`} / {periodic?'repeating field':'framed composition'}</span><button type="button" aria-pressed={motion} onClick={()=>setMotion(!motion)}>{motion?'Ⅱ Pause motion':'▷ Animate study'}</button></div></div>
   <div className="atlas-inspector"><p className="eyebrow">{traditions.find(r=>r.id===study.region)?.name} / {study.family}</p><h3>{study.name}</h3><p className="atlas-inspector-subtitle">{study.subtitle}</p><p className="atlas-reading">{study.note}</p>
    <fieldset className="atlas-pigments"><legend>01 / Change the light</legend>{Object.entries(pigments).map(([id,p])=><button type="button" key={id} aria-label={p.name} title={p.name} aria-pressed={pigment===id} onClick={()=>setPigment(id as Pigment)}>{p.colors.filter((_,i)=>i!==2).map(c=><span key={c} style={{background:c}}/>)}</button>)}<span>{pigments[pigment].name}</span></fieldset>
    <div className="atlas-construction-control"><span>02 / Look beneath the pattern</span><label><input type="checkbox" checked={guides} onChange={e=>setGuides(e.target.checked)}/> Reveal construction lines</label></div>
    {periodic&&<label className="atlas-scale">03 / Repeat scale <output>{scale}</output><input type="range" min="80" max="210" step="5" value={scale} onChange={e=>setScale(Number(e.target.value))}/></label>}
    <div className="atlas-actions"><button onClick={()=>saveFile(result.svg.replace('<g', `<rect width="100%" height="100%" fill="${pigments[pigment].colors[2]}"/><g`),'image/svg+xml',`${selected}.svg`)}>Download SVG ↓</button><button onClick={()=>saveFile(serializeRecipe(result.recipe,true),'application/json',`${selected}.json`)}>Recipe JSON ↓</button><button onClick={()=>onOpenStudio(selected)}>Make it yours in Studio ↗</button></div>
    <p className="atlas-study-note">Original contemporary study. Regional groupings are an exploration of visual relationships, not a claim of exclusive origin or a reconstruction of a historic object.</p>
   </div>
  </div>
  <section className="atlas-collection" aria-labelledby="atlas-collection-title"><header><div><p className="eyebrow">The collection</p><h3 id="atlas-collection-title">Find your rhythm.</h3></div><div className="atlas-family" role="group" aria-label="Filter by pattern family">{([['all','All forms'],['stars','Stars & rosettes'],['tiles','Tilework'],['architecture','Architecture'],['botanical','Botanical']] as const).map(([id,label])=><button key={id} aria-pressed={family===id} onClick={()=>setFamily(id)}>{label}</button>)}</div></header><p className="atlas-result-count" aria-live="polite">{visible.length} {visible.length===1?'study':'studies'} · Select a pattern to explore its construction.</p><div className="atlas-grid">{visible.map(s=><StudyCard key={s.id} study={s} index={atlasStudies.indexOf(s)} selected={selected===s.id} pigment={pigment} onSelect={()=>selectStudy(s.id)}/>)}</div>{visible.length===0&&<div className="atlas-empty"><p>No {family} studies in this selection yet.</p><button onClick={()=>setFamily('all')}>Show all {region.name} studies</button></div>}</section>
  <section className="atlas-learning"><header><p className="eyebrow">Learning to see</p><h3>Circle. Division. Connection.</h3><p>A pattern becomes easier to read when you discover the few decisions beneath its complexity.</p></header><div className="atlas-learning-grid">{[['01','Start with a boundary','A circle, a cell, or an opening gives the composition a place to begin.'],['02','Find the rhythm','Equal divisions and shared edges make relationships repeat.'],['03','Let colour reveal the structure','Fill one shape, then its neighbour. The pattern changes as your attention moves.']].map(([n,title,copy])=><article key={n}><span>{n}</span><h4>{title}</h4><p>{copy}</p></article>)}</div></section>
  <section className="atlas-reference"><h3>From scaffold to surface.</h3><div className="atlas-reference-grid"><figure><ZelligeConstructionPlate/><figcaption>Zellige construction plate</figcaption></figure><figure><KhatamZelligeReference/><figcaption>Khatam · zellige palette</figcaption></figure><figure><CurvilinearIsometricPlate/><figcaption>Curvilinear isometric tessellation</figcaption></figure></div><p>Explore the reference material: <a href="https://www.metmuseum.org/essays/geometric-patterns-in-islamic-art" target="_blank" rel="noreferrer">The Met · geometric patterns ↗</a> <a href="https://www.metmuseum.org/essays/vegetal-patterns-in-islamic-art" target="_blank" rel="noreferrer">The Met · vegetal patterns ↗</a> <a href="https://www.alhambra-patronato.es/sebka-en-relieve" target="_blank" rel="noreferrer">Alhambra Museum · sebka ↗</a></p></section>
 </div>;
}
