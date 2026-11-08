import { circle, constructionOverlay, overlayCircle, overlayPolygon, overlaySegment, point, polygon, segment } from './construction/index.js';
import { round } from './options.js';
import type { SvgDocument } from './svg.js';
import type { NormalizedOptions, PatternLayer, RepeatCell } from './types.js';

export type AtlasConstruction = 'sebka' | 'lobed' | 'pinwheel' | 'hexflower' | 'shamsa' | 'vine';
const TAU = Math.PI * 2;
const pt = (x:number,y:number) => `${round(x)} ${round(y)}`;
const polar = (x:number,y:number,r:number,a:number) => pt(x+Math.cos(a)*r,y+Math.sin(a)*r);

/** Original parametric studies; regional associations are interpretive, not reconstructions. */
export function drawAtlasConstruction(kind: AtlasConstruction, o: NormalizedOptions, doc: SvgDocument) {
  const size=o.unitSize*(1.5-o.density*.45), cx=o.width/2, cy=o.height/2;
  const focal=kind==='shamsa'||kind==='lobed';
  const w=focal?o.width:size, h=focal?o.height:kind==='hexflower'?size*Math.sqrt(3):size;
  const repeatCell:RepeatCell={id:`${kind}-cell`,width:w,height:h,vectors:[[w,0],[0,h]],boundary:[point(0,0),point(w,0),point(w,h),point(0,h)]};
  const r=Math.min(o.width,o.height)*.43;
  const guideX=focal?cx:w/2, guideY=kind==='lobed'?cy+o.height*.06:focal?cy:h/2;
  const guideRadius=kind==='lobed'?Math.min(o.width*.36,o.height*.34):focal?r:w*.45;
  const divisions=kind==='shamsa'?o.symmetry:kind==='lobed'?7:0;
  const meta={repeatCell,overlay:constructionOverlay([
    overlayPolygon(polygon(repeatCell.boundary)),
    overlayCircle(circle(point(guideX,guideY),guideRadius)),
    ...Array.from({length:divisions},(_,i)=>{const angle=kind==='lobed'?Math.PI+i*Math.PI/7:i*TAU/divisions-Math.PI/2;return overlaySegment(segment(point(guideX,guideY),point(guideX+Math.cos(angle)*guideRadius,guideY+Math.sin(angle)*guideRadius)));}),
    overlaySegment(segment(point(0,focal?cy:h/2),point(focal?o.width:w,focal?cy:h/2))),
    overlaySegment(segment(point(focal?cx:w/2,0),point(focal?cx:w/2,focal?o.height:h))),
  ]),layers:[{id:'atlas-modules',role:'module',sourceIds:['SRC-MET-003']}] as PatternLayer[]};
  const c=(i:number)=>o.palette[i%o.palette.length]!;
  const path=(d:string, fill:number|null, stroke=0, opacity=1, transform='')=>doc.push(`<path d="${d}" fill="${fill===null?'none':c(fill)}" stroke="${c(stroke)}" stroke-width="${round(o.stroke)}" opacity="${opacity}" stroke-linejoin="round" ${transform?`transform="${transform}"`:''} data-atlas-module="${kind}"/>`);
  if(kind==='shamsa') {
    const n=o.symmetry;
    for(let i=0;i<n;i++) {
      const a=TAU*i/n-Math.PI/2, half=Math.PI/n;
      if(!path(`M${polar(cx,cy,r*.36,a-half)} Q${polar(cx,cy,r*.84,a-half*.8)} ${polar(cx,cy,r,a)} Q${polar(cx,cy,r*.84,a+half*.8)} ${polar(cx,cy,r*.36,a+half)} L${polar(cx,cy,r*.24,a)}Z`,i%2?1:3,0)) return meta;
      if(!path(`M${polar(cx,cy,r*.42,a)} Q${polar(cx,cy,r*.67,a-half*.45)} ${polar(cx,cy,r*.85,a)} Q${polar(cx,cy,r*.67,a+half*.45)} ${polar(cx,cy,r*.42,a)}Z`,2,0)) return meta;
      if(!path(`M${polar(cx,cy,r*1.06,a-half)} L${polar(cx,cy,r*.77,a-half*.7)} L${polar(cx,cy,r*.77,a-half*1.3)}Z`,4,0)) return meta;
    }
    const star=Array.from({length:n*2},(_,i)=>polar(cx,cy,r*(i%2?.16:.3),i*Math.PI/n-Math.PI/2));
    path(`M${star.join('L')}Z`,0,4);
    doc.push(`<circle cx="${cx}" cy="${cy}" r="${round(r*.1)}" fill="${c(4)}"/>`);
    return meta;
  }
  if(kind==='lobed') {
    const radius=Math.min(o.width*.36,o.height*.34), y=cy+o.height*.06;
    for(let layer=0;layer<4;layer++) {
      const rr=radius*(1-layer*.13), left=cx-rr, right=cx+rr;
      let d=`M${pt(left,y+rr*.8)}L${pt(left,y)}`;
      for(let i=0;i<7;i++) {
        const a=Math.PI+i*Math.PI/7, b=a+Math.PI/7;
        d+=`Q${polar(cx,y,rr*1.5,(a+b)/2)} ${polar(cx,y,rr,b)}`;
      }
      d+=`L${pt(right,y+rr*.8)}`;
      if(!path(d,null,layer%4,1)) return meta;
    }
    path(`M${pt(cx-radius*1.15,y+radius*.85)}H${round(cx+radius*1.15)}`,null,4);
    return meta;
  }
  for(let row=-1;row<=Math.ceil(o.height/h);row++) {
    for(let col=-1;col<=Math.ceil(o.width/w);col++) {
      const x=col*w, y=row*h;
      if(kind==='sebka') {
        for(const [dx,dy] of [[0,0],[w/2,h/2]]) {
          const xx=x+dx, yy=y+dy;
          if(!path(`M${pt(xx,yy)} Q${pt(xx+w*.05,yy+h*.3)} ${pt(xx+w*.25,yy+h*.3)} Q${pt(xx+w*.45,yy+h*.3)} ${pt(xx+w*.5,yy+h*.5)} Q${pt(xx+w*.45,yy+h*.7)} ${pt(xx+w*.25,yy+h*.7)} Q${pt(xx+w*.05,yy+h*.7)} ${pt(xx,yy+h)} Q${pt(xx-w*.05,yy+h*.7)} ${pt(xx-w*.25,yy+h*.7)} Q${pt(xx-w*.45,yy+h*.7)} ${pt(xx-w*.5,yy+h*.5)} Q${pt(xx-w*.45,yy+h*.3)} ${pt(xx-w*.25,yy+h*.3)} Q${pt(xx-w*.05,yy+h*.3)} ${pt(xx,yy)}Z`,null,0)) return meta;
          if(!path(`M${pt(xx,yy+h*.3)}Q${pt(xx+w*.15,yy+h*.5)} ${pt(xx,yy+h*.68)}Q${pt(xx-w*.15,yy+h*.5)} ${pt(xx,yy+h*.3)}Z`,3,1,.8)) return meta;
        }
      } else if(kind==='pinwheel') {
        for(let i=0;i<4;i++) if(!path(`M0 0L${pt(w*.5,0)}L${pt(w*.24,w*.24)}L${pt(0,w*.5)}Z`,i%2?1:3,2,1,`translate(${round(x+w/2)} ${round(y+h/2)}) rotate(${i*90})`)) return meta;
        if(!path(`M${pt(x+w/2,y+h*.32)}L${pt(x+w*.68,y+h/2)}L${pt(x+w/2,y+h*.68)}L${pt(x+w*.32,y+h/2)}Z`,4,2)) return meta;
      } else if(kind==='hexflower') {
        for(const [dx,dy] of [[0,0],[w/2,h/2]]) {
          const xx=x+dx,yy=y+dy,rad=w*.48;
          for(let i=0;i<6;i++) {
            const a=TAU*i/6;
            if(!path(`M${pt(xx,yy)}Q${polar(xx,yy,rad*.8,a-.42)} ${polar(xx,yy,rad,a)}Q${polar(xx,yy,rad*.8,a+.42)} ${pt(xx,yy)}Z`,i%2?1:3,0))return meta;
          }
          if(!doc.push(`<circle cx="${round(xx)}" cy="${round(yy)}" r="${round(w*.07)}" fill="${c(4)}" stroke="${c(0)}"/>`))return meta;
        }
      } else {
        if(!path(`M${pt(x,y+h/2)}C${pt(x+w*.25,y-h*.15)} ${pt(x+w*.75,y+h*1.15)} ${pt(x+w,y+h/2)}`,null,0)) return meta;
        for(let i=0;i<2;i++) {
          const xx=x+w*(.25+.5*i),yy=y+h*.5;
          if(!path(`M${pt(xx,yy)}Q${pt(xx-w*.3,yy-h*(.35+o.petalDepth*.5))} ${pt(xx+w*.08,yy-h*.38)}Q${pt(xx+w*.2,yy-h*.2)} ${pt(xx,yy)}Z`,o.botanicalFill?(i?3:1):null,0))return meta;
          if(!path(`M${pt(xx,yy)}Q${pt(xx+w*.3,yy+h*(.35+o.petalDepth*.5))} ${pt(xx-w*.08,yy+h*.38)}Q${pt(xx-w*.2,yy+h*.2)} ${pt(xx,yy)}Z`,o.botanicalFill?(i?1:3):null,0))return meta;
        }
      }
    }
  }
  return meta;
}
