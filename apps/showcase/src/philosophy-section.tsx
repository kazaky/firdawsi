import { useState } from "react";
import { principles, sources, stages, type Language, type SourceId } from "./philosophy-data";
import { ExperienceLab } from "./experience-lab";
import { SourceLink } from "./source-link";
import "./philosophy.css";

export function PhilosophySection({ view = "principles" }: { view?: string }) {
  const [language, setLanguage] = useState<Language>("en");
  const t = (en: string, ar: string) => language === "en" ? en : ar;
  return <section id="principles" className="section philosophy" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
    <header className="philosophy-heading">
      <div><p className="eyebrow">01 / {t("The Firdawsi philosophy", "فلسفة فردوسي")}</p>
        <h2>{t("Meaning takes form.", "معنى يتجسّد.")}</h2>
        <p className="section-intro">{t("Seven principles. A traceable religious connection. A practical promise in every interaction.", "سبعة مبادئ. صلة دينية موثّقة. ووعد عملي في كل تفاعل.")}</p></div>
      <div className="segmented" aria-label="Philosophy language">
        <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</button>
        <button type="button" lang="ar" aria-pressed={language === "ar"} onClick={() => setLanguage("ar")}>العربية</button>
      </div>
    </header>
    <div hidden={view === "experience"}><aside className="philosophy-boundary">
      <strong>{t("Source → meaning → design interpretation → observable behaviour", "المصدر ← المعنى ← الاستلهام التصميمي ← السلوك القابل للملاحظة")}</strong>
      <p>{t("Qur’anic descriptions of Jannah inspire experiential qualities; Islamic teachings inform our ethics. The interface rules are our design interpretations, not religious prescriptions or depictions of the unseen.", "تلهمنا أوصاف الجنة في القرآن بصفات للتجربة، وتوجّه التعاليم الإسلامية أخلاقنا. قواعد الواجهة اجتهادات تصميمية، وليست أحكامًا دينية أو تصويرًا للغيب.")}</p>
    </aside>
    <div className="philosophy-principles">
      {principles.map((principle, index) => <article key={principle.id} className="philosophy-principle" id={`principle-${principle.id}`}>
        <div className="philosophy-principle__title"><span className="philosophy-number">{String(index + 1).padStart(2, "0")}</span><h3>{principle.name[language]}</h3><span lang="ar" dir="rtl" className="philosophy-arabic-name">{language === "en" ? principle.name.ar : ""}</span></div>
        <div className="philosophy-principle__body"><h4>{principle.rule[language]}</h4><p>{principle.example[language]}</p>
          <p className="philosophy-avoid"><strong>{t("Avoid: ", "تجنّب: ")}</strong>{principle.avoid[language]}</p></div>
        <div className="philosophy-source"><p lang="ar" dir="rtl" className="source-arabic">{sources[principle.id].arabic}</p>
          <SourceLink id={principle.id} /><p>{sources[principle.id].meaning[language]}</p>
          <details><summary>{t("Context & interpretation", "السياق والاستلهام")}</summary><p>{sources[principle.id].context[language]}</p></details>
        </div>
      </article>)}
    </div>
    <div className="philosophy-subheading"><p className="eyebrow">{t("Touch & transition", "اللمس والانتقال")}</p><h3>{t("Received gently. Settled clearly.", "استجابة برفق. واستقرار بوضوح.")}</h3><p>{t("Six lenses for evaluating an interaction, not six compulsory animations.", "ست مراحل لتقييم التفاعل، وليست ست حركات إلزامية.")}</p></div>
    <div className="interaction-cycle">
      {stages.map((stage, index) => <article key={stage.name} data-stage={stage.name.toLowerCase()}>
        <span>{String(index + 1).padStart(2, "0")}</span><h3>{language === "en" ? stage.name : stage.ar}</h3><strong>{stage.meaning[language]}</strong><p>{stage.behavior[language]}</p><SourceLink id={stage.source} />
      </article>)}
    </div>
    <div className="philosophy-subheading"><p className="eyebrow">{t("Foundations with purpose", "أسس ذات غاية")}</p><h3>{t("Every choice answers a need.", "كل اختيار يخدم حاجة.")}</h3></div>
    <div className="philosophy-foundations">
      {([
        ["Prepared surfaces", "أسطح مهيأة", "Useful defaults and stable places for work.", "إعدادات مفيدة ومواضع عمل مستقرة.", "preparation"],
        ["Colour & focus", "الألوان والتركيز", "Legible contrast and states beyond colour alone.", "تباين مقروء وحالات لا تعتمد على اللون وحده.", "dignity"],
        ["Bilingual typography", "خطوط ثنائية اللغة", "Independent optical tuning, shaping, and reading order.", "ضبط بصري وتشكيل وترتيب قراءة لكل لغة.", "language"],
        ["Geometry & proportion", "الهندسة والتناسب", "Coherent relationships before decorative patterns.", "علاقات متسقة قبل الزخارف.", "beauty"],
        ["Motion & feedback", "الحركة والتغذية الراجعة", "Acknowledge change gently; preserve reduced-motion access.", "أكّد التغيير برفق، واحفظ الإتاحة عند تقليل الحركة.", "gentleness"],
        ["Data & recovery", "البيانات والاستعادة", "Protect drafts, name failures, and keep repair nearby.", "احفظ المسودات ووضّح الفشل وقرّب الإصلاح.", "trust"],
      ] as const).map(([en, ar, copy, arCopy, source]) => <article key={en}><h4>{t(en, ar)}</h4><p>{t(copy, arCopy)}</p><SourceLink id={source}/></article>)}
    </div>
    <details className="source-register"><summary>{t("Source register · context and limits", "سجل المصادر · السياق والحدود")}</summary>
      <p>{t("Meanings are paraphrased. Hadith references are from Sahih al-Bukhari and Sahih Muslim. References checked; design interpretations have not received scholarly endorsement. Numerical timings, accessibility targets, and visual tokens are engineering choices.", "المعاني معروضة بتصرف، والأحاديث من صحيحَي البخاري ومسلم. جرى التحقق من المراجع، ولم تُعتمد الاستلهامات التصميمية من مراجع شرعي. الأزمنة ومعايير الإتاحة والقيم البصرية اختيارات هندسية.")}</p>
      {Object.entries(sources).map(([id, source]) => <article key={id}><SourceLink id={id as SourceId}/><p>{source.meaning[language]} {source.context[language]}</p></article>)}
    </details>
    </div><div hidden={view !== "experience"}><ExperienceLab language={language}/></div>
  </section>;
}
