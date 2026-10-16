import { Button, PatternSurface, TextField } from "@firdawsi/web";
import { useState, type FormEvent } from "react";
import type { Language } from "./philosophy-data";
import { SourceLink } from "./source-link";
import "./adoption-guide.css";

const setup = `git clone https://github.com/kazaky/firdawsi.git
cd firdawsi
pnpm install --frozen-lockfile
pnpm build
pnpm dev`;

export function starterSource(language: Language) {
  const ar = language === "ar";
  return `import { useState, type FormEvent } from "react";
import "@firdawsi/tokens/css";
import "@firdawsi/web/styles.css";
import { Button, TextField, ThemeProvider } from "@firdawsi/web";

export function FirstFirdawsiFlow() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  function check(event: FormEvent) {
    event.preventDefault();
    setMessage(title.trim()
      ? ${JSON.stringify(ar ? "المثال صالح. لم تُحفَظ أي بيانات." : "Example checked. No data was saved.")}
      : ${JSON.stringify(ar ? "اكتب عنوانًا أولًا." : "Enter a title first.")});
  }
  return (
    <ThemeProvider region="universal" direction="${ar ? "rtl" : "ltr"}" applyToDocument={false}>
      <section lang="${language}" aria-label=${JSON.stringify(ar ? "مثالك الأول" : "Your first example")}>
        <form onSubmit={check}>
          <TextField label=${JSON.stringify(ar ? "عنوان المهمة" : "Task title")} dir="auto"
            value={title} onChange={event => setTitle(event.target.value)} />
          <Button type="submit">${ar ? "التحقق من المثال" : "Check example"}</Button>
          <p role="status">{message}</p>
        </form>
      </section>
    </ThemeProvider>
  );
}`;
}

function CopyCode({
  code,
  language,
  label,
}: {
  code: string;
  language: Language;
  label: string;
}) {
  const [state, setState] = useState<"ready" | "copied" | "failed">("ready");
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      setState("failed");
    }
  }
  return (
    <div className="adoption-code">
      <div className="adoption-code__bar">
        <span>{label}</span>
        <button type="button" onClick={copy}>
          {language === "ar" ? "نسخ الكود" : "Copy code"}
        </button>
      </div>
      <pre dir="ltr" tabIndex={0} aria-label={label}>
        <code>{code}</code>
      </pre>
      <p role="status">
        {state === "copied"
          ? language === "ar"
            ? "نُسخ إلى الحافظة."
            : "Copied to clipboard."
          : state === "failed"
            ? language === "ar"
              ? "تعذّر النسخ. يمكنك تحديد الكود أعلاه ونسخه يدويًا."
              : "Copy unavailable. Select the code above and copy it manually."
            : ""}
      </p>
    </div>
  );
}

export function GettingStarted() {
  const [language, setLanguage] = useState<Language>("en");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState<"ready" | "empty" | "checked">(
    "ready",
  );
  const t = (en: string, ar: string) => (language === "en" ? en : ar);
  function check(event: FormEvent) {
    event.preventDefault();
    setMessage(title.trim() ? "checked" : "empty");
  }
  return (
    <section
      id="getting-started"
      className="section adoption-guide"
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <header className="adoption-heading">
        <div>
          <p className="eyebrow">{t("Start building", "ابدأ البناء")}</p>
          <h2>
            {t("Your first meaningful flow.", "تجربتك الأولى ذات المعنى.")}
          </h2>
          <p>
            {t(
              "Start from the source, use familiar controls, then bring the philosophy into one real task.",
              "ابدأ من المصدر، واستخدم عناصر مألوفة، ثم طبّق الفلسفة في مهمة حقيقية واحدة.",
            )}
          </p>
        </div>
        <div className="segmented" aria-label="Getting started language">
          <button
            type="button"
            aria-pressed={language === "en"}
            onClick={() => {
              setLanguage("en");
            }}
          >
            English
          </button>
          <button
            type="button"
            lang="ar"
            aria-pressed={language === "ar"}
            onClick={() => {
              setLanguage("ar");
            }}
          >
            العربية
          </button>
        </div>
      </header>
      <div className="adoption-steps">
        <article>
          <span>01</span>
          <h3>{t("Run the workspace", "شغّل المشروع")}</h3>
          <p>
            {t(
              "Use Node.js 20+ and pnpm 10.15.0, as declared by this repository. These commands run the existing showcase; they do not install an assumed published package.",
              "استخدم Node.js 20 أو أحدث وpnpm 10.15.0 كما يحدد المشروع. تشغّل الأوامر موقع العرض الموجود، ولا تفترض نشر حزمة في سجل الحزم.",
            )}
          </p>
          <SourceLink id="knowledge" />
        </article>
        <article>
          <span>02</span>
          <h3>{t("Build one useful action", "ابنِ إجراءً مفيدًا واحدًا")}</h3>
          <p>
            {t(
              "Choose a task, keep its label visible, preserve input, and report the actual result. This small example validates locally; it does not save or sync.",
              "اختر مهمة، وأبقِ عنوانها ظاهرًا، واحفظ الإدخال، وأبلغ بالنتيجة الفعلية. يتحقق هذا المثال محليًا دون حفظ أو مزامنة.",
            )}
          </p>
          <SourceLink id="ease" />
        </article>
        <article>
          <span>03</span>
          <h3>{t("Verify before expanding", "تحقّق قبل التوسّع")}</h3>
          <p>
            {t(
              "Try keyboard, Arabic, English, narrow screens, contrast, and reduced motion. Add persistence and recovery only with a clear, tested contract.",
              "جرّب لوحة المفاتيح والعربية والإنجليزية والشاشات الضيقة والتباين وتقليل الحركة. أضف الحفظ والاستعادة بعقد واضح ومختبَر.",
            )}
          </p>
          <SourceLink id="trust" />
        </article>
      </div>
      <p>
        <a
          href="https://github.com/kazaky/firdawsi/actions?query=branch%3Amain"
          target="_blank"
          rel="noreferrer"
        >
          {t(
            "Get the separate preview kit from a successful main CI run",
            "احصل على حزمة التجربة المستقلة من تشغيل ناجح لفرع main",
          )}
        </a>
        {t(
          " — four local packages and a bilingual React starter. Manual reviews remain pending.",
          " — أربع حزم محلية ومثال React بالعربية والإنجليزية. لا تزال المراجعات البشرية قيد الانتظار.",
        )}
      </p>
      <CopyCode
        code={setup}
        language={language}
        label={t("Repository setup", "إعداد المشروع")}
      />
      <div className="adoption-example-layout">
        <div>
          <h3>{t("Try the starter", "جرّب المثال الأول")}</h3>
          <form className="adoption-starter" onSubmit={check} noValidate>
            <TextField
              label={t("Task title", "عنوان المهمة")}
              dir="auto"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setMessage("ready");
              }}
              error={
                message === "empty"
                  ? t("Enter a title first.", "اكتب عنوانًا أولًا.")
                  : undefined
              }
            />
            <Button type="submit">
              {t("Check example", "التحقق من المثال")}
            </Button>
            <p role="status">
              {message === "checked"
                ? t(
                    "Example checked. No data was saved.",
                    "المثال صالح. لم تُحفَظ أي بيانات.",
                  )
                : message === "empty"
                  ? t(
                      "Your input stays here while you correct it.",
                      "يبقى إدخالك هنا أثناء تصحيحه.",
                    )
                  : t(
                      "Temporary example. Nothing is sent or saved.",
                      "مثال مؤقت. لا يُرسَل شيء أو يُحفَظ.",
                    )}
            </p>
          </form>
          <p className="adoption-note">
            {t(
              "The code below is an in-workspace React example. In another app, configure the workspace packages, load suitable Arabic and Latin fonts, and verify the integration before release.",
              "الكود أدناه مثال React داخل المشروع. في تطبيق آخر، اضبط حزم المشروع وحمّل خطوطًا مناسبة للعربية واللاتينية وتحقق من التكامل قبل الإصدار.",
            )}
          </p>
          <SourceLink id="truth" />
        </div>
        <CopyCode
          key={language}
          code={starterSource(language)}
          language={language}
          label={t("React starter", "مثال React")}
        />
      </div>
    </section>
  );
}

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
