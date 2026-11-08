import { useState } from "react";
import { principles, sources, type Language, type SourceId } from "./philosophy-data";
import { SourceLink } from "./source-link";

const chapters: { id: SourceId; color: string; title: [string,string]; feeling: [string,string]; before: [string,string]; after: [string,string]; symbol: string }[] = [
  { id: 'welcome', color: 'apricot', title: ['A clear beginning', 'بداية واضحة'], feeling: ['I know where to start.', 'أعرف من أين أبدأ.'], before: ['An empty screen. No next step.', 'شاشة فارغة بلا خطوة تالية.'], after: ['Welcome. Start with one small intention.', 'أهلًا بك. ابدأ بنية صغيرة.'], symbol: 'arch' },
  { id: 'rest', color: 'iris', title: ['Room to pause', 'مساحة للتوقف'], feeling: ['I can return without starting over.', 'أعود دون أن أبدأ من جديد.'], before: ['Leave now and lose your progress.', 'إذا غادرت الآن ستفقد تقدمك.'], after: ['Draft saved. Continue when you’re ready.', 'حُفظت المسودة. أكمل حين تكون مستعدًا.'], symbol: 'moon' },
  { id: 'nearness', color: 'blue', title: ['Within reach', 'في متناولك'], feeling: ['The next step is right here.', 'الخطوة التالية أمامي.'], before: ['Search through menus to continue.', 'ابحث في القوائم لتكمل.'], after: ['Your next action, beside your work.', 'خطوتك التالية بجانب عملك.'], symbol: 'orbit' },
  { id: 'permission', color: 'rose', title: ['A choice that is yours', 'الخيار لك'], feeling: ['My boundaries are respected.', 'حدودي محترمة.'], before: ['Camera access requested without context.', 'طلب الكاميرا دون توضيح السبب.'], after: ['Add a photo? You can also skip this step.', 'هل تضيف صورة؟ يمكنك تخطي هذه الخطوة.'], symbol: 'petal' },
];

export function MeaningGlyph({ kind }: { kind: string }) {
  return <svg viewBox="0 0 200 160" fill="none" aria-hidden="true" focusable="false">
    <circle cx="100" cy="80" r="68" stroke="currentColor" opacity=".2"/>
    {kind==='arch' ? <><path d="M48 140V75Q48 40 100 20Q152 40 152 75V140" stroke="currentColor" strokeWidth="10"/><path d="M77 140V86Q77 64 100 52Q123 64 123 86V140" fill="currentColor" opacity=".25"/><circle cx="100" cy="90" r="11" fill="currentColor"/></> : kind==='moon' ? <><path d="M123 28A56 56 0 1 0 151 110A57 57 0 0 1 123 28Z" fill="currentColor" opacity=".75"/><path d="m142 40 5 12 13 5-13 5-5 13-5-13-13-5 13-5Z" fill="currentColor"/></> : kind==='orbit' ? <><circle cx="100" cy="80" r="16" fill="currentColor"/><ellipse cx="100" cy="80" rx="64" ry="32" stroke="currentColor" strokeWidth="2" transform="rotate(-35 100 80)"/><circle cx="153" cy="47" r="10" fill="currentColor"/><path d="M55 125 82 101" stroke="currentColor" strokeWidth="3"/><path d="m69 101 13 0 0 13" stroke="currentColor" strokeWidth="3"/></> : <>{Array.from({length:6},(_,i)=><ellipse key={i} cx="100" cy="54" rx="17" ry="34" transform={`rotate(${i*60} 100 80)`} fill="currentColor" fillOpacity=".13" stroke="currentColor"/>)}<circle cx="100" cy="80" r="9" fill="currentColor"/></>}
  </svg>;
}

export function MeaningExplorer({ language }: { language: Language }) {
  const [selected, setSelected] = useState(0);
  const c = chapters[selected];
  const l = language === 'ar' ? 1 : 0;
  const p = principles.find(p => p.id === c.id)!;
  return <section className="meaning-explorer" aria-labelledby="meaning-heading">
    <header><p className="eyebrow">{l ? 'الفلسفة في لحظة' : 'The philosophy, at a glance'}</p><h3 id="meaning-heading">{l ? 'كيف يشعر الإنسان بهذا المعنى؟' : 'What does a principle feel like?'}</h3><p>{l ? 'اختر فكرة لتتبعها من المصدر إلى تجربة ملموسة. هذه تطبيقات تصميمية نقترحها.' : 'Choose an idea. Follow it from its source to something a person can feel. These are our design interpretations.'}</p></header>
    <div className="meaning-choices" role="group" aria-label={l ? 'اختر معنى' : 'Choose a meaning'}>{chapters.map((chapter,i)=><button key={chapter.id} type="button" data-tone={chapter.color} aria-pressed={selected===i} aria-controls="meaning-detail" onClick={()=>setSelected(i)}><MeaningGlyph kind={chapter.symbol}/><span>0{i+1}</span><strong>{chapter.title[l]}</strong></button>)}</div>
    <div id="meaning-detail" className="meaning-detail" data-tone={c.color} aria-live="polite">
      <div className="meaning-feeling"><p className="eyebrow">{l ? 'ما يشعر به الإنسان' : 'The human feeling'}</p><h4>“{c.feeling[l]}”</h4><MeaningGlyph kind={c.symbol}/></div>
      <div className="meaning-steps"><article><span className="meaning-step">01</span><div><h4>{l ? 'المصدر' : 'The source'}</h4><blockquote className="meaning-source-arabic" lang="ar" dir="rtl">{sources[c.id].arabic}</blockquote><p>{sources[c.id].meaning[language]}</p><SourceLink id={c.id} language={language}/></div></article><article><span className="meaning-step">02</span><div><h4>{l ? 'استلهامنا التصميمي' : 'Our design interpretation'}</h4><p>{p.rule[language]}</p></div></article><article><span className="meaning-step">03</span><div><h4>{l ? 'ما يتغير في التجربة' : 'What changes on screen'}</h4><div className="meaning-before"><small>{l ? 'بدلًا من' : 'Instead of'}</small><p>{c.before[l]}</p></div><div className="meaning-after"><div className="meaning-after__mark" aria-hidden="true"><MeaningGlyph kind={c.symbol}/></div><div><small>{l ? 'في التجربة' : 'In the experience'}</small><p>{c.after[l]}</p><span className="meaning-after__rule" aria-hidden="true"><i/><i/><i/></span></div></div></div></article><a href={`#principle-${c.id}`} onClick={e=>{e.preventDefault();document.getElementById(`principle-${c.id}`)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}}>{l ? 'اقرأ المبدأ وسياقه ↓' : 'Read the principle & its context ↓'}</a></div>
    </div>
  </section>;
}
