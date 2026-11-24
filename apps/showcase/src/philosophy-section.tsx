import { CareConvictions, CareJourney, CareFoundations } from "./philosophy-compositions";
import { PrincipleStories } from "./principle-stories";
import { MeaningExplorer } from "./meaning-explorer";
import { GardenWorld } from "./garden-world";
import { useState } from "react";
import { type Language } from "./philosophy-data";
import { SourceLink } from "./source-link";
import "./philosophy.css";

export function PhilosophySection() {
  const [language, setLanguage] = useState<Language>("en");
  const t = (en: string, ar: string) => language === "en" ? en : ar;
  return <section id="principles" className="section philosophy" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
    <header className="philosophy-heading">
      <div><p className="eyebrow">01 / {t("The Firdawsi philosophy", "فلسفة فردوسي")}</p>
        <h2>{t("Meaning takes form.", "معنى يتجسّد.")}</h2>
        <p className="section-intro">{t("What should an interface give back for the attention it asks of us? Firdawsi draws on welcome, rest, permission, fair dealing, consultation, tranquillity, nearness, ease, and beauty to shape experiences that respect people’s work, choices, and time. These values should be felt from the first step through recovery and completion.", "ماذا تقدّم الواجهة للإنسان مقابل انتباهه؟ يستلهم فردوسي الترحيب والراحة والاستئذان والإنصاف والشورى والطمأنينة والقرب والتيسير والجمال ليصمّم تجارب تحترم عمل الناس واختياراتهم ووقتهم. وتظهر هذه القيم منذ الخطوة الأولى، وعند التعثر، وحتى اكتمال المهمة.")}</p></div>
      <div className="segmented" aria-label={t("Philosophy language", "لغة الفلسفة")}>
        <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</button>
        <button type="button" lang="ar" aria-pressed={language === "ar"} onClick={() => setLanguage("ar")}>العربية</button>
      </div>
    </header>
    <article className="return-study" aria-labelledby="return-heading">
      <header>
        <p className="eyebrow">{t("A study in mercy", "تأمّل في الرحمة")}</p>
        <h3 id="return-heading">{t("When we return", "حين نعود")}</h3>
        <p>{t("A planner can count the days since we last opened it. Only we know what those days asked of us.", "يستطيع المخطّط أن يحصي الأيام منذ آخر زيارة. ونحن وحدنا نعرف ما احتاجته تلك الأيام منّا.")}</p>
      </header>
      <div className="return-panels">
        {[
          ["intention", t("Monday", "الاثنين"), t("An intention takes shape", "بداية النيّة"), t("In Misho, I set aside Thursday to call my sister and finish a drawing.", "أخصّص في ميشو وقتًا يوم الخميس لأتصل بأختي وأُكمل رسمة.")],
          ["interval", t("Midweek", "منتصف الأسبوع"), t("The space between", "ما بين الموعدين"), t("My child falls ill. I spend two nights by his bed. The drawing stays where I left it.", "يمرض طفلي، فأقضي ليلتين إلى جوار سريره. تبقى الرسمة حيث تركتها.")],
          ["return", t("Thursday", "الخميس"), t("I choose again", "أختار من جديد"), t("I still want to call my sister. I let the drawing go for this week. Both decisions are mine.", "ما زلت أرغب في الاتصال بأختي. أمّا الرسمة فأتركها جانبًا هذا الأسبوع. كلا القرارين لي.")]
        ].map(([id, day, title, caption]) => <figure key={id}>
          <img src={`/return-study/${id}.svg`} alt="" width="360" height="240" />
          <figcaption><small>{day}</small><h4>{title}</h4><p>{caption}</p></figcaption>
        </figure>)}
      </div>
      <footer><p><strong>{t("The right to return", "حقّ الرجوع إلى ما بدأناه")}</strong> {t("Keep a familiar landmark where someone paused. Give carrying a plan forward and setting it aside equal weight. Ask for no explanation.", "نترك معلمًا مألوفًا حيث توقّف الإنسان، ونمنحه حرية مواصلة خطته أو تركها جانبًا، من غير أن نطلب منه تبرير اختياره.")}</p>
      <p>{t("Looking at the last panel, what do you feel the planner expects of you?", "حين تتأمّل اللوحة الأخيرة، ماذا تشعر أنّ المخطّط ينتظر منك؟")}</p></footer>
    </article>
    <MeaningExplorer language={language} />
    <div className="philosophy-manifesto" aria-label={t("What guides Firdawsi", "ما يوجّه فردوسي")}>
      <div className="philosophy-manifesto__art" aria-hidden="true"><GardenWorld compact /></div>
      <div className="philosophy-manifesto__words"><p className="eyebrow">{t("Our point of departure", "نقطة الانطلاق")}</p><h3>{t("Care becomes real in use.", "العناية تظهر في الاستخدام.")}</h3><p>{t("A considerate interface protects what people enter, shows what has happened, and makes the next step clear.", "تحفظ الواجهة المراعية ما أدخله الإنسان، وتوضح ما حدث، وتُبيّن الخطوة التالية.")}</p></div>
    </div>
    <CareConvictions language={language} />
    <div className="philosophy-method">
      <div className="philosophy-method__heading"><p className="eyebrow">{t("From meaning to action", "من المعنى إلى الفعل")}</p><h3>{t("A source opens a question for design.", "المصدر يفتح سؤالًا للتصميم.")}</h3><p>{t("This example shows how we move from a source to a design decision.", "يوضح هذا المثال كيف ننتقل من المصدر إلى قرار تصميمي.")}</p></div>
      <div className="philosophy-method__story"><div className="philosophy-method__source"><span className="philosophy-label">{t("Qur’anic guidance / Al-Ahzab 33:70", "توجيه قرآني / الأحزاب ٣٣:٧٠")}</span><blockquote>{t("Say what is right.", "وَقُولُوا قَوْلًا سَدِيدًا")}</blockquote><p>{t("The verse calls believers to speak rightly.", "تدعو الآية المؤمنين إلى القول السديد.")}</p><SourceLink id="truth" language={language} /></div><div className="philosophy-method__translation"><span className="philosophy-label">{t("A question for design", "سؤال للتصميم")}</span><p>{t("How can an interface report a task’s status truthfully?", "كيف تصف الواجهة حالة المهمة بصدق؟")}</p><span className="philosophy-method__connector" aria-hidden="true">↓</span><span className="philosophy-label">{t("Our interpretation", "استلهامنا")}</span><p>{t("Status messages should report what happened, including when saving fails.", "ينبغي أن تصف رسائل الحالة ما حدث فعلًا، وأن توضح تعذّر الحفظ عند وقوعه.")}</p></div><div className="philosophy-method__outcome"><span className="philosophy-label">{t("What a person experiences", "ما يلمسه الإنسان")}</span><div className="outcome-status" aria-label={t("Three honest saving states", "ثلاث حالات صادقة للحفظ")}><span><i aria-hidden="true">✓</i>{t("Saved", "حُفظ")}</span><span><i aria-hidden="true">◌</i>{t("Saving", "جارٍ الحفظ")}</span><span><i aria-hidden="true">↻</i>{t("Couldn’t save", "تعذّر الحفظ")}</span></div><p>{t("Show the actual state. If saving fails, keep the work and offer a clear way to try again.", "اعرض الحالة الفعلية. وإذا تعذّر الحفظ، فاحتفظ بالعمل وقدّم طريقة واضحة لإعادة المحاولة.")}</p></div></div>
    </div>
    <aside className="philosophy-boundary"><strong>{t("Where interpretation ends", "حدود الاستلهام")}</strong><p>{t("Qur’anic descriptions of Jannah invite reflection, and Islamic teachings inform our ethics. The interface decisions here are our own design interpretations. They neither depict the unseen nor give religious authority to a colour, layout, or control.", "تدعونا أوصاف الجنة في القرآن إلى التأمل، وتوجّه التعاليم الإسلامية أخلاقنا. أما قرارات الواجهة فهي استلهامات تصميمية من عندنا؛ لا تصوّر الغيب ولا تضفي صفة دينية على لون أو تخطيط أو عنصر تحكّم.")}</p></aside>
    <section className="philosophy-precedents" aria-labelledby="philosophy-precedents-heading">
      <div className="philosophy-precedents__intro"><p className="eyebrow">{t("Earlier thinking", "أفكار سبقتنا")}</p><h3 id="philosophy-precedents-heading">{t("Build on the work already done.", "نبني على ما سبقنا.")}</h3><p>{t("These works inform how we research, involve people, and compose a visual language. Each has a different scope; none is presented as an endorsement of Firdawsi’s interpretations.", "تساعدنا هذه الأعمال في البحث وإشراك الناس وبناء لغة بصرية. ولكل عمل نطاقه؛ ولا نقدّم أيًّا منها بوصفه اعتمادًا لاستلهامات فردوسي.")}</p></div>
      <div className="philosophy-precedents__list">
        <article><span>01 / {t("Interface research", "بحث الواجهات")}</span><h4>Muslim Centred User Interface Design</h4><p>{t("Nasruddin and colleagues separate the designer's cultural reading, the user's interpretation, and the interface. In their later study, 17 of 26 students linked a tested icon to its intended action; 9 chose another action. We use that result to test metaphors rather than assume their meaning is obvious.", "تفصل نصر الدين وزملاؤها بين فهم المصمم للثقافة، وتفسير المستخدم، والواجهة. في دراستهم اللاحقة، ربط ١٧ من ٢٦ طالبًا رمزًا مختبرًا بالفعل المقصود؛ واختار ٩ فعلًا آخر. لذا نختبر معنى الرموز مع الناس بدل افتراض وضوحها.")}</p><a href="https://www.istes.org/seeder/books/files/70a06283965f27a3f824dac257f774fc.pdf" target="_blank" rel="noopener noreferrer">{t("Read the full 2022 paper ↗", "اقرأ ورقة ٢٠٢٢ كاملة ↗")}</a></article>
        <article><span>02 / {t("Design process", "عملية التصميم")}</span><h4>{t("Design Thinking from an Islamic Perspective", "التفكير التصميمي من منظور إسلامي")}</h4><p>{t("Riasat Islam connects empathy, purposeful ideas, iteration, consultation, and ethical responsibility with Islamic thought. We use these as process prompts: listen to affected people, prototype, invite critique, and revise. Individual religious claims still need independent review.", "يربط رياست إسلام بين فهم الناس، والأفكار ذات الغاية، والتحسين، والشورى، والمسؤولية الأخلاقية وبين الفكر الإسلامي. نستخدمها أسئلة للعمل: نستمع للناس المعنيين، ونجرب، ونطلب النقد، ونعدّل. وتبقى الإحالات الدينية بحاجة إلى مراجعة مستقلة.")}</p><a href="https://www.riasatislam.com/blog/design-thinking/" target="_blank" rel="noopener noreferrer">{t("Read the article ↗", "اقرأ المقال ↗")}</a></article>
        <article><span>03 / {t("Architecture", "العمارة")}</span><h4>The Sense of Unity</h4><p>{t("Ardalan and Bakhtiar study relationships among elements of Persian Islamic architecture, from a single unit to an urban setting. A university review describes the book's progression from concepts and forms to city scale. We ask whether parts form a coherent whole; the full book still needs direct review.", "يدرس أردلان وبختيار ترابط عناصر العمارة الإسلامية الفارسية من الوحدة الصغيرة إلى البيئة العمرانية. وتعرض مراجعة جامعية انتقال الكتاب من المفاهيم والأشكال إلى مستوى المدينة. نسأل: هل تصنع الأجزاء كلًّا متسقًا؟ وتبقى قراءة الكتاب كاملًا خطوة لازمة.")}</p><a href="https://books.google.com/books/about/The_Sense_of_Unity.html?id=g7A3jwEACAAJ" target="_blank" rel="noopener noreferrer">{t("View the book record ↗", "اطّلع على سجل الكتاب ↗")}</a></article>
      </div>
      <div className="philosophy-precedents__application"><strong>{t("What changes in the system", "ما الذي يتغير في النظام")}</strong><p>{t("We write down a design's intended meaning, test what people think it will do, revise after feedback, and check coherence from component to complete journey. Religious and historical sources remain cited with their context.", "نكتب المعنى المقصود من التصميم، ونختبر ما يتوقع الناس أن يفعله، ونعدّله بعد الملاحظات، ونراجع ترابطه من المكوّن إلى الرحلة كاملة. ونوثّق المصادر الدينية والتاريخية مع سياقها.")}</p></div>
    </section>
    <div className="philosophy-subheading philosophy-subheading--principles"><p className="eyebrow">{t("Twelve principles", "اثنا عشر مبدأً")}</p><h3>{t("Principles made visible in use.", "مبادئ تظهر في الاستخدام.")}</h3><p>{t("Each principle connects a cited source with an interpretation and a design behaviour people can observe.", "يربط كل مبدأ مصدرًا موثّقًا باستلهام تصميمي وسلوك يمكن للناس ملاحظته.")}</p></div>
    <PrincipleStories language={language} />
    <aside className="philosophy-test"><p className="eyebrow">{t("A practical test", "اختبار عملي")}</p><h3>{t("The experience is the measure.", "التجربة هي المقياس.")}</h3><p>{t("If a calm-looking screen loses a draft, it fails Tranquillity and Ease. If a beautiful screen excludes Arabic readers or keyboard users, it fails Dignity. The principles matter only when the experience lives up to them.", "إذا بدت الواجهة مطمئنة لكنها أضاعت مسودة، فقد أخفقت في الطمأنينة والتيسير. وإذا كانت جميلة لكنها تُقصي قارئ العربية أو مستخدم لوحة المفاتيح، فقد أخفقت في الكرامة. قيمة المبادئ فيما تحققه التجربة.")}</p></aside>
    <div className="philosophy-subheading"><p className="eyebrow">{t("Touch & transition", "اللمس والانتقال")}</p><h3>{t("From first touch to a clear result.", "من اللمسة الأولى إلى نتيجة واضحة.")}</h3><p>{t("Six qualities to look for across an interaction. They are a guide for evaluation, not a required animation sequence.", "ست صفات ننظر إليها خلال التفاعل. هي دليل للتقييم، وليست تسلسل حركات إلزاميًا.")}</p></div>
    <CareJourney language={language} />
    <div className="philosophy-subheading"><p className="eyebrow">{t("Foundations with purpose", "أسس ذات غاية")}</p><h3>{t("Give every choice a purpose.", "اجعل لكل اختيار غاية.")}</h3></div>
    <CareFoundations language={language} />
  </section>;
}
