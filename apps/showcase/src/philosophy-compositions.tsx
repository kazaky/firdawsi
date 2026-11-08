import { stages, type Language } from './philosophy-data';
import { SourceLink } from './source-link';
import './philosophy-compositions.css';

/** Original diagrams: motion illustrates a quality while the text remains still. */
function Study({ kind }: { kind: number }) {
  return <svg className={`care-study care-study--${kind}`} viewBox="0 0 360 240" fill="none" aria-hidden="true">
    <path d="M30 210H330M30 30V210" stroke="currentColor" opacity=".14" />
    {kind === 0 && <><rect x="72" y="62" width="216" height="124" rx="8" stroke="currentColor"/><rect x="88" y="78" width="68" height="92" rx="4" fill="currentColor" opacity=".12"/><path d="M178 88H266M178 104H244M178 120H252" stroke="currentColor" strokeWidth="3"/><rect className="care-breathe" x="178" y="143" width="68" height="20" rx="10" fill="currentColor"/></>}
    {kind === 1 && <><circle cx="180" cy="120" r="80" stroke="currentColor" opacity=".25"/><circle cx="180" cy="120" r="52" stroke="currentColor" strokeDasharray="3 7"/><circle className="care-breathe" cx="180" cy="120" r="25" fill="currentColor"/><path d="m248 163-25-8 7 25 5-12Z" fill="currentColor"/></>}
    {kind === 2 && <><path d="M75 155Q180 45 285 155" stroke="currentColor" opacity=".25"/><rect x="82" y="90" width="196" height="72" rx="36" stroke="currentColor" strokeWidth="2"/><circle className="care-breathe" cx="124" cy="126" r="23" fill="currentColor" opacity=".2"/><path className="care-trace" d="m113 126 8 8 16-18M165 116h77m-77 18h48" stroke="currentColor" strokeWidth="3"/></>}
    {kind === 3 && <>{[0,1,2].map(i=><g key={i} transform={`translate(${i*68} ${-i*17})`}><rect x="68" y="90" width="88" height="88" rx="12" fill="var(--study-paper)" stroke="currentColor"/><path className="care-trace" d="M86 115h49m-49 13h36m-36 24h20" stroke="currentColor" strokeWidth="2"/></g>)}</>}
    {kind === 4 && <><path d="M72 176h216" stroke="currentColor"/><path className="care-trace" d="M75 78C110 78 100 150 137 150S157 110 184 136 215 163 285 163" stroke="currentColor" strokeWidth="3"/><circle cx="285" cy="163" r="7" fill="currentColor"/></>}
    {kind === 5 && <><circle cx="180" cy="120" r="68" stroke="currentColor"/><circle className="care-breathe" cx="180" cy="120" r="53" fill="currentColor" opacity=".1"/><path className="care-trace" d="m150 120 21 21 43-47" stroke="currentColor" strokeWidth="4"/><path d="M180 30v12m0 156v12M90 120h12m156 0h12" stroke="currentColor"/></>}
    {kind === 6 && <>{Array.from({length:8},(_,i)=><ellipse key={i} cx="180" cy="91" rx="25" ry="57" transform={`rotate(${i*45} 180 120)`} stroke="currentColor" fill="currentColor" fillOpacity=".035"/>)}<circle cx="180" cy="120" r="7" fill="currentColor"/></>}
    {kind === 7 && <><path d="M180 48v140M105 188h150M85 85h190M108 85l-32 64h64L108 85Zm144 0-32 64h64L252 85Z" stroke="currentColor" strokeWidth="2"/><circle cx="180" cy="48" r="7" fill="currentColor"/></>}
    {kind === 8 && <><text x="80" y="145" fill="currentColor" fontSize="66" fontFamily="serif">Aa</text><text x="220" y="145" fill="currentColor" fontSize="66" fontFamily="serif">ع</text><path d="M70 162h220M180 65v110" stroke="currentColor" opacity=".25"/></>}
  </svg>;
}

export function CareConvictions({ language }: { language: Language }) {
  const t=(en:string,ar:string)=>language==='ar'?ar:en;
  return <div className="care-convictions">
    <article><div className="care-conviction-art"><Study kind={6}/><span>{t('Proportion · rhythm · space','تناسب · إيقاع · فراغ')}</span></div><div><p className="eyebrow">01 / {t('Beauty','الجمال')}</p><h3>{t('Beauty lives in relationships.','الجمال في ترابط العناصر.')}</h3><p>{t('Proportion, rhythm, language, and space give the experience coherence. Pattern belongs where it strengthens that whole.','يصنع التناسب والإيقاع واللغة والفراغ تجربة متسقة. وللزخرفة مكان حين تعزّز هذا الترابط.')}</p></div></article>
    <article><div className="care-conviction-art"><Study kind={7}/><span>{t('Source → interpretation → evidence','مصدر ← استلهام ← دليل')}</span></div><div><p className="eyebrow">02 / {t('Responsibility','المسؤولية')}</p><h3>{t('Interpretation carries responsibility.','الاستلهام مسؤولية.')}</h3><p>{t('We cite the source, explain our interpretation, and test whether the resulting design helps people.','نذكر المصدر، ونشرح استلهامنا التصميمي، ونختبر ما إذا كان التصميم الناتج ينفع الناس.')}</p></div></article>
  </div>;
}

export function CareJourney({ language }: { language: Language }) {
  return <div className="care-journey">{stages.map((stage,i)=><article className="care-stop" key={stage.name}>
    <span className="care-stop-number">{String(i+1).padStart(2,'0')}</span>
    <div className="care-stop-copy"><p className="eyebrow">{stage.meaning[language]}</p><h3>{language==='ar'?stage.ar:stage.name}{language==='en'&&<span lang="ar" dir="rtl">{stage.ar}</span>}</h3><p>{stage.behavior[language]}</p><SourceLink id={stage.source} language={language}/></div>
    <div className="care-stop-art"><Study kind={i}/></div>
  </article>)}</div>;
}

const foundations = [
  ['Prepared surfaces','أسطح مهيأة','Useful defaults and a consistent place to resume work.','إعدادات مفيدة وموضع ثابت لاستئناف العمل.','preparation',0,'A place for everything','مكان لكل شيء'],
  ['Colour & focus','الألوان والتركيز','Readable contrast and states that do not rely on colour alone.','تباين يسهّل القراءة، وحالات لا تعتمد على اللون وحده.','dignity',1,'Attention, with intention','انتباه له غاية'],
  ['Bilingual typography','خطوط للعربية والإنجليزية','Typography tuned for each script, with correct letter shaping and reading order.','خطوط مضبوطة لكل نظام كتابة، مع وصل صحيح للحروف وترتيب قراءة مناسب.','language',8,'Two scripts. Equal care.','لغتان. عناية متساوية.'],
  ['Geometry & proportion','الهندسة والتناسب','Use proportion and alignment before adding pattern.','اضبط التناسب والمحاذاة قبل إضافة الزخرفة.','beauty',6,'Order you can feel','نظام تشعر به'],
  ['Motion & feedback','الحركة والتغذية الراجعة','Acknowledge changes gently and respect reduced-motion preferences.','أكّد التغييرات برفق، واحترم تفضيلات تقليل الحركة.','gentleness',4,'Every change, acknowledged','كل تغيير يستحق التأكيد'],
  ['Data & recovery','البيانات والاستعادة','Protect drafts, explain failures, and make recovery easy to find.','احفظ المسودات، واشرح ما تعذّر، واجعل الاستعادة سهلة الوصول.','trust',3,'Your effort stays with you','جهدك يبقى معك'],
] as const;
export function CareFoundations({ language }: { language: Language }) {
  const ar=language==='ar';
  return <div className="care-foundations">{foundations.map(([en,arabic,copy,arCopy,source,kind,caption,arCaption],i)=><article key={en}>
    <div className="care-foundation-art"><span className="care-folio">{String(i+1).padStart(2,'0')} / 06</span><Study kind={kind}/><span className="care-caption">{ar?arCaption:caption}</span></div>
    <div className="care-foundation-copy"><h4>{ar?arabic:en}</h4><p>{ar?arCopy:copy}</p><SourceLink id={source} language={language}/></div>
  </article>)}</div>;
}
