import { principles, sources, type Language } from './philosophy-data';
import { SourceLink } from './source-link';

const scenes = [
  ['A purpose before a pixel', 'غاية تسبق الشكل', 'A person needs to…', 'يحتاج الإنسان إلى…', 'One need → one clear action', 'حاجة واحدة ← إجراء واضح'],
  ['Clarity brings calm', 'الوضوح يبعث الطمأنينة', 'Your work is saved', 'حُفظ عملك', 'A truthful state. Nothing to guess.', 'حالة صادقة. لا حاجة للتخمين.'],
  ['An open beginning', 'بداية مرحّبة', 'Welcome. Start here.', 'أهلًا بك. ابدأ هنا.', 'A useful first step, clearly explained.', 'خطوة أولى مفيدة وموضّحة.'],
  ['A place to return to', 'مكان تعود إليه', 'Continue your draft', 'أكمل مسودتك', 'Step 2 of 3 · your progress is kept', 'الخطوة ٢ من ٣ · تقدمك محفوظ'],
  ['Your choice comes first', 'خيارك أولًا', 'Add a photo?', 'هل تضيف صورة؟', 'Choose a photo · Skip for now', 'اختر صورة · تخطَّ الآن'],
  ['Nothing in the small print', 'لا شيء مخفي', 'The whole picture', 'الصورة كاملة', 'Price + renewal + limits, together.', 'السعر والتجديد والحدود معًا.'],
  ['Listen. Learn. Refine.', 'استمع. تعلّم. حسّن.', 'Whose voice is missing?', 'صوت من لم نسمعه؟', 'Different people. A shared design.', 'أناس مختلفون. تصميم مشترك.'],
  ['Help, right where it matters', 'المساعدة حيث تحتاجها', 'Couldn’t save · Retry', 'تعذّر الحفظ · حاول مجددًا', 'The way forward stays beside the problem.', 'الحل يبقى بجانب المشكلة.'],
  ['Keep the effort. Remove the friction.', 'احفظ الجهد. قلّل المشقة.', 'Your draft is still here', 'مسودتك لا تزال هنا', 'Try again without starting again.', 'أعد المحاولة دون أن تعيد العمل.'],
  ['Many parts. One language.', 'أجزاء كثيرة. لغة واحدة.', 'Space · type · rhythm', 'مساحة · خط · إيقاع', 'Every detail belongs to the same whole.', 'كل تفصيل ينتمي إلى الكل.'],
  ['Many ways to belong', 'طرق كثيرة للمشاركة', 'العربية · English', 'العربية · English', 'Touch · keyboard · screen reader', 'لمس · لوحة مفاتيح · قارئ شاشة'],
  ['Room for your attention', 'مساحة لانتباهك', 'You’re all caught up', 'أكملت ما لديك', 'A clear finish. Permission to leave.', 'نهاية واضحة. مساحة للمغادرة.'],
];

function PrincipleDrawing({ index }: { index: number }) {
  return <svg viewBox="0 0 300 180" fill="none" aria-hidden="true" focusable="false">
    <circle cx="150" cy="90" r="78" stroke="currentColor" opacity=".14"/>
    {index===0 && <><circle cx="150" cy="90" r="48" stroke="currentColor"/><circle cx="150" cy="90" r="25" stroke="currentColor"/><circle cx="150" cy="90" r="7" fill="currentColor"/><path d="M65 145 140 98M124 98h16v16" stroke="currentColor" strokeWidth="3"/></>}
    {index===1 && <>{[0,1,2,3].map(i=><path key={i} d={`M65 ${65+i*20}Q107 ${40+i*20} 150 ${65+i*20}T235 ${65+i*20}`} stroke="currentColor" strokeWidth="2" opacity={1-i*.18}/>)}<circle cx="150" cy="35" r="12" fill="currentColor" opacity=".6"/></>}
    {index===2 && <><path d="M95 150V75Q95 40 150 20Q205 40 205 75V150" stroke="currentColor" strokeWidth="8"/><path d="M125 150V85Q125 65 150 53Q175 65 175 85V150" fill="currentColor" opacity=".2"/><path d="M150 150V98m-12 13 12-13 12 13" stroke="currentColor" strokeWidth="3"/></>}
    {index===3 && <><path d="M170 33A60 60 0 1 0 205 115A61 61 0 0 1 170 33Z" fill="currentColor" opacity=".5"/><path d="M185 55v30m15-15h-30" stroke="currentColor" strokeWidth="2"/></>}
    {index===4 && <><rect x="95" y="55" width="110" height="90" rx="18" stroke="currentColor" strokeWidth="2"/><path d="M122 55V42a28 28 0 0 1 56 0" stroke="currentColor" strokeWidth="4"/><circle cx="150" cy="95" r="10" fill="currentColor"/><path d="M150 105v16" stroke="currentColor" strokeWidth="4"/></>}
    {index===5 && <><path d="M150 35v105m-40 5h80M85 60h130M100 60l-27 50h54L100 60Zm100 0-27 50h54L200 60Z" stroke="currentColor" strokeWidth="2"/><circle cx="150" cy="35" r="7" fill="currentColor"/></>}
    {index===6 && <>{[0,1,2].map(i=><g key={i} transform={`translate(${i*65} ${i===1?-15:15})`}><circle cx="85" cy="65" r="15" fill="currentColor" opacity={.35+i*.2}/><path d="M62 110q0-40 46 0" stroke="currentColor" strokeWidth="3"/></g>)}<path d="M95 140q55 35 110 0" stroke="currentColor" strokeDasharray="3 5"/></>}
    {index===7 && <><circle cx="150" cy="90" r="18" fill="currentColor"/><ellipse cx="150" cy="90" rx="80" ry="38" transform="rotate(-25 150 90)" stroke="currentColor" strokeWidth="2"/><circle cx="220" cy="57" r="11" fill="currentColor" opacity=".5"/><path d="m105 133 24-19m-20 0h20v20" stroke="currentColor" strokeWidth="3"/></>}
    {index===8 && <><path d="M95 118a63 63 0 1 1 107 9" stroke="currentColor" strokeWidth="3"/><path d="m184 125 18 2 2-18" stroke="currentColor" strokeWidth="3"/><path d="m125 88 18 18 35-36" stroke="currentColor" strokeWidth="4"/></>}
    {index===9 && <>{Array.from({length:8},(_,i)=><ellipse key={i} cx="150" cy="62" rx="19" ry="40" transform={`rotate(${i*45} 150 90)`} stroke="currentColor" fill="currentColor" fillOpacity=".06"/>)}<circle cx="150" cy="90" r="8" fill="currentColor"/></>}
    {index===10 && <><circle cx="150" cy="48" r="15" fill="currentColor"/><path d="M105 76h90M150 76v35m0 0-30 40m30-40 30 40" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/></>}
    {index===11 && <><circle cx="150" cy="90" r="40" stroke="currentColor" strokeWidth="2"/><path d="m130 90 15 15 30-33" stroke="currentColor" strokeWidth="3"/>{[65,235].map(x=><circle key={x} cx={x} cy="90" r="3" fill="currentColor"/>)}</>}
  </svg>;
}

export function PrincipleStories({ language }: { language: Language }) {
  const ar=language==='ar';
  const t=(en:string, arabic:string)=>ar?arabic:en;
  return <div className="principle-stories">{principles.map((p,i)=>{
    const s=sources[p.id];const scene=scenes[i];
    return <article key={p.id} id={`principle-${p.id}`} className="philosophy-principle principle-story" data-tone={['iris','blue','apricot','iris','rose','apricot','blue','rose','blue','iris','rose','apricot'][i]}>
      <header className="principle-story-heading"><span className="principle-story-index">{String(i+1).padStart(2,'0')}</span><div><p className="eyebrow">{t('A principle to design by','مبدأ نسترشد به')}</p><h3>{p.name[language]}{!ar && <span lang="ar" dir="rtl">{p.name.ar}</span>}</h3></div></header>
      <div className="principle-story-scene"><div><p className="eyebrow">{t('The idea, made tangible','الفكرة حين تصبح ملموسة')}</p><h4>{scene[ar?1:0]}</h4><PrincipleDrawing index={i}/></div><div className="principle-example"><span className="principle-example-label">{t('Illustrative interface','مثال توضيحي للواجهة')}</span><div className="principle-example-window"><div className="principle-window-dots" aria-hidden="true"><i/><i/><i/></div><strong>{scene[ar?3:2]}</strong><p>{scene[ar?5:4]}</p><div className={`principle-example-marks principle-example-marks--${i}`} aria-hidden="true"><span/><span/><span/></div></div></div></div>
      <div className="principle-story-lesson"><div><span className="philosophy-label">{t('Our design interpretation','استلهامنا التصميمي')}</span><h4>{p.rule[language]}</h4><p>{p.example[language]}</p></div><aside><span>{t('Leave this behind','ما نتجنبه')}</span><p>{p.avoid[language]}</p></aside></div>
      <section className="principle-scripture" aria-label={t('Source and context','المصدر وسياقه')}><div className="principle-scripture-reference"><span className="philosophy-label">{s.href.includes('quran.com')?t('Qur’an · cited passage','القرآن الكريم · النص المستشهد به'):t('Hadith · cited passage','حديث نبوي · النص المستشهد به')}</span><SourceLink id={p.id} language={language}/></div><blockquote className="source-arabic" lang="ar" dir="rtl">{s.arabic}</blockquote><p className="principle-source-meaning">{s.meaning[language]}</p><div className="principle-context"><strong>{t('Read in context','في سياقه')}</strong><p>{s.context[language]}</p></div></section>
    </article>;
  })}</div>;
}
