import { PatternSurface } from "@firdawsi/web";
import { useState } from "react";
import type { Language } from "./philosophy-data";
import { SourceLink } from "./source-link";
import "./adoption-guide.css";

type Tier = "none" | "quiet" | "supporting" | "expressive";
export function PatternGuidance() {
  const [language, setLanguage] = useState<Language>("en");
  const [tier, setTier] = useState<Tier>("none");
  const t = (en: string, ar: string) => (language === "en" ? en : ar);
  return (
    <section
      id="pattern-guidance"
      className="section adoption-guide"
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <header className="adoption-heading">
        <div>
          <p className="eyebrow">
            {t("Pattern-use guidance", "إرشادات استخدام الزخارف")}
          </p>
          <h2>{t("Beauty leaves room.", "جمال يترك مساحة.")}</h2>
          <p>
            {t(
              "Choose the quietest treatment that serves the task. Pattern tiers are usage guidance, not new component API values.",
              "اختر أهدأ معالجة تخدم المهمة. مستويات الزخرفة إرشادات استخدام، وليست قيمًا جديدة لواجهة المكوّن البرمجية.",
            )}
          </p>
        </div>
        <div className="segmented" aria-label="Pattern guidance language">
          <button
            type="button"
            aria-pressed={language === "en"}
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button
            type="button"
            lang="ar"
            aria-pressed={language === "ar"}
            onClick={() => setLanguage("ar")}
          >
            العربية
          </button>
        </div>
      </header>
      <p className="adoption-note">
        {t(
          "Purposeful intention and beauty inform these choices. No geometric ratio, pattern family, or ornament percentage is religiously prescribed.",
          "توجّه النية الهادفة والجمال هذه الاختيارات. لا نفرض نسبة هندسية أو عائلة زخارف أو مقدارًا للزينة بوصفه حكمًا دينيًا.",
        )}{" "}
        <SourceLink id="intention" /> · <SourceLink id="beauty" />
      </p>
      <fieldset className="pattern-tier-picker">
        <legend>{t("Choose a pattern tier", "اختر مستوى الزخرفة")}</legend>
        {(
          [
            ["none", "None", "دون زخرفة"],
            ["quiet", "Quiet", "هادئ"],
            ["supporting", "Supporting", "مساند"],
            ["expressive", "Expressive", "تعبيري"],
          ] as const
        ).map(([value, en, ar]) => (
          <label key={value}>
            <input
              type="radio"
              name="pattern-guidance-tier"
              value={value}
              checked={tier === value}
              onChange={() => setTier(value)}
            />
            {t(en, ar)}
          </label>
        ))}
      </fieldset>
      <div className="pattern-guidance-layout">
        <article className="pattern-specimen" data-pattern-tier={tier}>
          <div
            className={`pattern-specimen__band pattern-specimen__band--${tier}`}
            aria-hidden="true"
          >
            {tier !== "none" && (
              <PatternSurface
                presetId={
                  tier === "expressive" ? "rosette-12-almond" : "jali-8-screen"
                }
                intensity={tier === "quiet" ? "quiet" : "balanced"}
                options={{
                  seed: "firdawsi-pattern-guidance",
                  width: 640,
                  height: 160,
                  maxNodes: 500,
                }}
              >
                <span />
              </PatternSurface>
            )}
          </div>
          <div className="pattern-specimen__content">
            <p className="eyebrow">
              {t("Same content. Same hierarchy.", "نفس المحتوى. نفس التسلسل.")}
            </p>
            <h3>{t("Room for your next step.", "مساحة لخطوتك التالية.")}</h3>
            <p>
              {t(
                "Keep long reading, forms, and dense data on a clear surface. Let proportion, typography, and useful structure carry the experience.",
                "أبقِ القراءة الطويلة والنماذج والبيانات الكثيفة على سطح واضح. دع التناسب والخطوط والبنية المفيدة تحمل التجربة.",
              )}
            </p>
            <a className="text-link" href="#experience">
              {t("Try a working flow →", "جرّب تفاعلًا عمليًا ←")}
            </a>
          </div>
        </article>
        <div className="pattern-guidance-rules" aria-live="polite">
          <h3>
            {tier === "none"
              ? t("Begin without ornament", "ابدأ دون زخرفة")
              : tier === "quiet"
                ? t("Quiet: a supporting accent", "هادئ: لمسة مساندة")
                : tier === "supporting"
                  ? t("Supporting: mark a boundary", "مساند: توضيح حد")
                  : t(
                      "Expressive: a deliberate brand moment",
                      "تعبيري: لحظة هوية مقصودة",
                    )}
          </h3>
          <p>
            {tier === "none"
              ? t(
                  "The default for forms, workspaces, and dense content. The system should feel coherent before any pattern is added.",
                  "الافتراضي للنماذج ومساحات العمل والمحتوى الكثيف. ينبغي أن يبقى النظام متسقًا قبل إضافة أي زخرفة.",
                )
              : tier === "quiet"
                ? t(
                    "Use a small, subdued accent for a section edge or calm empty state. Remove it if it competes with the next action.",
                    "استخدم لمسة صغيرة هادئة لحافة قسم أو حالة فارغة. احذفها إن نافست الإجراء التالي.",
                  )
                : tier === "supporting"
                  ? t(
                      "Use a bounded band to separate sections or introduce a chapter. Keep the pattern outside the reading surface.",
                      "استخدم شريطًا محدودًا للفصل بين الأقسام أو تقديم فصل، وأبقِ الزخرفة خارج سطح القراءة.",
                    )
                  : t(
                      "Reserve larger geometry for a cover, introduction, or rare brand moment. Keep the functional content on its own solid plane.",
                      "خصّص الهندسة الأكبر لغلاف أو مقدمة أو لحظة هوية نادرة، مع إبقاء المحتوى الوظيفي على سطح مستقل وواضح.",
                    )}
          </p>
          <ul>
            <li>
              {t(
                "Never place sacred text into texture or routine feedback.",
                "لا تستخدم النصوص المقدسة كخامة أو كتغذية راجعة روتينية.",
              )}
            </li>
            <li>
              {t(
                "Never place dense patterns behind text, fields, or tables.",
                "لا تضع زخارف كثيفة خلف النصوص أو الحقول أو الجداول.",
              )}
            </li>
            <li>
              {t(
                "Decorative SVG stays hidden from assistive technology.",
                "تبقى الرسوم الزخرفية مخفية عن التقنيات المساعدة.",
              )}
            </li>
            <li>
              {t(
                "High contrast removes this specimen’s ornament, preserving its content.",
                "يخفي التباين العالي زخرفة هذا المثال مع الحفاظ على محتواه.",
              )}
            </li>
          </ul>
          <SourceLink id="dignity" />
        </div>
      </div>
    </section>
  );
}
