import {
  Button,
  Checkbox,
  Dialog,
  Radio,
  Switch,
  Tabs,
  TextField,
} from "@firdawsi/web";
import { useRef, useState, type FormEvent } from "react";
import type { Language, SourceId } from "./philosophy-data";
import { SourceLink } from "./source-link";
import "./component-contracts.css";

type Copy = [string, string];
type Contract = {
  id: string;
  title: Copy;
  purpose: Copy;
  source: SourceId;
  connection: Copy;
  states: Copy;
  keyboard: Copy;
  direction: Copy;
  motion: Copy;
  avoid: Copy;
};
const contracts: Contract[] = [
  {
    id: "button",
    title: ["Button", "الزر"],
    purpose: [
      "Make the next deliberate action clear, and acknowledge activation without disguising its outcome.",
      "وضّح الإجراء المقصود وأكّد تلقيه دون إخفاء نتيجته.",
    ],
    source: "gentleness",
    connection: [
      "Gentleness motivates restrained acknowledgement; it does not prescribe a button shape or timing.",
      "يلهم الرفق استجابة لطيفة، ولا يفرض شكل الزر أو توقيته.",
    ],
    states: [
      "Ready, hover, focus, pressed, busy, disabled, and completed. Busy is not success.",
      "جاهز، مرور المؤشر، تركيز، ضغط، انشغال، تعطيل، واكتمال. الانشغال لا يعني النجاح.",
    ],
    keyboard: [
      "Native button: Tab to focus; Space or Enter to activate. Busy and disabled controls cannot activate.",
      "زر أصلي: Tab للتركيز، وSpace أو Enter للتفعيل. لا يُفعّل الزر عند الانشغال أو التعطيل.",
    ],
    direction: [
      "Keep the label in its authored language; mirror only genuinely directional icons.",
      "احفظ لغة العنوان الأصلية، واعكس الأيقونات الاتجاهية فقط.",
    ],
    motion: [
      "Feedback must remain clear without animation. A press never waits for a transition.",
      "تبقى الاستجابة واضحة دون حركة، ولا ينتظر الإجراء انتهاء الانتقال.",
    ],
    avoid: [
      "A loading spinner labelled Saved, or a decorative shape that obscures the action.",
      "مؤشر تحميل بعنوان تم الحفظ، أو شكل زخرفي يخفي الإجراء.",
    ],
  },
  {
    id: "field",
    title: ["Text field", "حقل النص"],
    purpose: [
      "Receive input with a persistent label and bring repair next to the problem.",
      "استقبل الإدخال بعنوان دائم وقرّب الإصلاح من المشكلة.",
    ],
    source: "ease",
    connection: [
      "Facilitation motivates local validation and preserving effort. It does not remove necessary information or consent.",
      "يلهم التيسير التحقق الموضعي وحفظ الجهد، دون إسقاط المعلومات الضرورية أو الموافقة.",
    ],
    states: [
      "Empty, populated, focused, invalid, disabled, and corrected. Preserve the value on error.",
      "فارغ، ممتلئ، مركّز، غير صالح، معطّل، ومصحّح. احفظ القيمة عند الخطأ.",
    ],
    keyboard: [
      "Native input with linked label, hint, and error. On invalid submission, focus the first problem.",
      "حقل أصلي مرتبط بالعنوان والمساعدة والخطأ. عند إرسال غير صالح، ركّز أول مشكلة.",
    ],
    direction: [
      "Use content direction for mixed text. Email, IDs, and phone numbers may need LTR inside an RTL layout.",
      "اضبط اتجاه المحتوى للنص المختلط. قد يحتاج البريد والمعرّفات والأرقام إلى اتجاه يساري داخل التخطيط العربي.",
    ],
    motion: [
      "Keep label and repair text stable; never animate the entered text out of view.",
      "ثبّت العنوان ورسالة الإصلاح، ولا تُخرج النص المكتوب من العرض بحركة.",
    ],
    avoid: [
      "Placeholder-only labels, erased drafts, or an error communicated only in red.",
      "عنوان داخل النص النائب فقط، أو مسودة ممسوحة، أو خطأ يُعرض بالأحمر وحده.",
    ],
  },
  {
    id: "choice",
    title: ["Selection controls", "عناصر الاختيار"],
    purpose: [
      "Distinguish independent choices, exclusive choices, and immediate settings.",
      "ميّز بين الاختيارات المستقلة والحصرية والإعدادات الفورية.",
    ],
    source: "dignity",
    connection: [
      "Human dignity motivates usable choices through keyboard, touch, and assistive technology.",
      "تلهم الكرامة الإنسانية إتاحة الاختيار باللمس ولوحة المفاتيح والتقنيات المساعدة.",
    ],
    states: [
      "Checked, unchecked, focused, and disabled. Radios share a named group; switches expose on or off.",
      "محدّد، غير محدّد، مركّز، ومعطّل. تشترك أزرار الاختيار في مجموعة، ويعرض المفتاح التشغيل أو الإيقاف.",
    ],
    keyboard: [
      "Space toggles checkbox and switch. Arrow keys change a native radio group; Tab moves between groups.",
      "Space يبدّل مربع الاختيار والمفتاح. الأسهم تغيّر الاختيار في المجموعة الأصلية، وTab ينتقل بين المجموعات.",
    ],
    direction: [
      "Labels and descriptions follow reading direction without reversing the meaning of on and off.",
      "تتبع العناوين والوصف اتجاه القراءة دون عكس معنى التشغيل والإيقاف.",
    ],
    motion: [
      "The selected state remains understandable with motion disabled and without colour alone.",
      "تبقى حالة التحديد مفهومة عند إيقاف الحركة ودون الاعتماد على اللون وحده.",
    ],
    avoid: [
      "A checkbox for a mutually exclusive choice, or a switch that silently submits a whole form.",
      "مربع اختيار لخيارات حصرية، أو مفتاح يرسل النموذج كاملًا دون توضيح.",
    ],
  },
  {
    id: "overlay",
    title: ["Dialog", "الحوار"],
    purpose: [
      "Create a deliberate threshold when a decision needs focused attention; explain its consequence.",
      "أنشئ انتقالًا مقصودًا حين يحتاج القرار إلى تركيز، ووضّح عاقبته.",
    ],
    source: "trust",
    connection: [
      "Fulfilling trusts motivates explicit consequences, safe cancellation, and restoration of context.",
      "تلهم الأمانة توضيح العواقب والإلغاء الآمن والعودة إلى السياق.",
    ],
    states: [
      "Closed, open, cancelled, confirmed, and recovered. Keep the result near the original action.",
      "مغلق، مفتوح، ملغى، مؤكّد، ومستعاد. أبقِ النتيجة قرب الإجراء الأصلي.",
    ],
    keyboard: [
      "Focus enters the modal, remains inside, and returns to the trigger. Escape cancels without committing.",
      "يدخل التركيز إلى الحوار ويبقى داخله ثم يعود إلى الزر الأصلي. Escape يلغي دون تنفيذ.",
    ],
    direction: [
      "Title, description, action order, and close control follow the local reading direction.",
      "يتبع العنوان والوصف وترتيب الإجراءات وزر الإغلاق اتجاه القراءة المحلي.",
    ],
    motion: [
      "Opening and closing work immediately under reduced motion; no information depends on the entrance effect.",
      "يعمل الفتح والإغلاق مباشرة عند تقليل الحركة، ولا تعتمد المعلومات على مؤثر الدخول.",
    ],
    avoid: [
      "Routine success dialogs, a vague Are you sure, or cancellation that still changes data.",
      "حوارات نجاح روتينية، أو سؤال مبهم عن التأكد، أو إلغاء يغيّر البيانات رغم ذلك.",
    ],
  },
  {
    id: "navigation",
    title: ["Local navigation", "التنقل المحلي"],
    purpose: [
      "Keep the current place explicit and related views close without mixing local actions with global destinations.",
      "وضّح الموضع الحالي وقرّب العروض المرتبطة دون خلط الإجراءات المحلية بالوجهات العامة.",
    ],
    source: "nearness",
    connection: [
      "Easy reach inspires nearby related views. Familiar keyboard and platform conventions remain the practical basis.",
      "يلهم القرب جمع العروض المرتبطة. وتبقى أعراف المنصة ولوحة المفاتيح أساسًا عمليًا.",
    ],
    states: [
      "Current, available, focused, and disabled. Selected tab and visible panel must agree.",
      "حالي، متاح، مركّز، ومعطّل. يجب أن يتوافق التبويب المحدّد مع اللوحة الظاهرة.",
    ],
    keyboard: [
      "Tab enters the tab list. Arrow keys, Home, and End navigate available tabs; focus and selection stay coherent.",
      "Tab يدخل قائمة التبويبات. الأسهم وHome وEnd تنتقل بين المتاح منها مع اتساق التركيز والتحديد.",
    ],
    direction: [
      "Horizontal arrow navigation follows direction. Content language and page direction remain independent.",
      "يتبع التنقل الأفقي اتجاه القراءة، وتبقى لغة المحتوى مستقلة عن اتجاه الصفحة.",
    ],
    motion: [
      "Changing views preserves context without mandatory travel animations.",
      "يحفظ تغيير العرض السياق دون فرض انتقالات متحركة.",
    ],
    avoid: [
      "A tab strip that changes the whole product destination or hides the selected location.",
      "تبويبات تغيّر وجهة المنتج بالكامل أو تخفي الموضع المحدّد.",
    ],
  },
  {
    id: "feedback",
    title: ["Status & recovery", "الحالة والاستعادة"],
    purpose: [
      "Tell the truth about progress and outcome, then bring the repair action near.",
      "أبلغ بصدق عن التقدم والنتيجة، ثم قرّب إجراء الإصلاح.",
    ],
    source: "truth",
    connection: [
      "Truthful speech motivates accurate state messages. An accepted input is not a completed save.",
      "يلهم القول السديد رسائل حالة دقيقة. تلقي الإدخال لا يعني اكتمال الحفظ.",
    ],
    states: [
      "Ready, pending, failed, retrying, and completed. Announce changes without moving focus unnecessarily.",
      "جاهز، معلّق، فاشل، إعادة محاولة، ومكتمل. أعلن التغيير دون نقل التركيز بلا حاجة.",
    ],
    keyboard: [
      "Keep retry and cancellation in the normal tab order. Live status is announced without becoming a focus trap.",
      "أبقِ إعادة المحاولة والإلغاء ضمن ترتيب التركيز المعتاد. تُعلن الحالة دون حبس التركيز.",
    ],
    direction: [
      "Localise feedback; isolate file names, times, and IDs inside translated sentences.",
      "عرّب رسائل الحالة واعزل أسماء الملفات والأوقات والمعرّفات داخل الجمل المترجمة.",
    ],
    motion: [
      "Keep the final message visible; never communicate completion only through a fading animation.",
      "أبقِ الرسالة النهائية ظاهرة، ولا تجعل حركة متلاشية الوسيلة الوحيدة لعرض الاكتمال.",
    ],
    avoid: [
      "Success before confirmation, endless ceremonial loading, and errors that discard work.",
      "إعلان النجاح قبل التأكيد، أو تحميل احتفالي لا ينتهي، أو أخطاء تُضيّع العمل.",
    ],
  },
];

function StateExample({ id, language }: { id: string; language: Language }) {
  const t = (en: string, ar: string) => (language === "en" ? en : ar);
  const [state, setState] = useState("ready");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [open, setOpen] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  };
  function validate(event: FormEvent) {
    event.preventDefault();
    const invalid = value.trim().length < 3;
    setError(invalid);
    setState(invalid ? "invalid" : "valid");
    if (invalid) field.current?.focus();
  }
  if (id === "button")
    return (
      <div className="contract-example-stack">
        <label>
          {t("Preview state", "حالة المعاينة")}
          <select
            value={state}
            onChange={(event) => setState(event.target.value)}
          >
            {[
              ["ready", "Ready", "جاهز"],
              ["busy", "Busy", "مشغول"],
              ["disabled", "Disabled", "معطّل"],
            ].map(([v, en, ar]) => (
              <option key={v} value={v}>
                {t(en, ar)}
              </option>
            ))}
          </select>
        </label>
        <Button
          loading={state === "busy"}
          disabled={state === "disabled"}
          onClick={() => setValue(String(Number(value || 0) + 1))}
        >
          {state === "busy"
            ? t("Working…", "جارٍ العمل…")
            : t("Activate example", "تفعيل المثال")}
        </Button>
        <p role="status">
          {t("Activations: ", "مرات التفعيل: ")}
          {value || "0"}
        </p>
      </div>
    );
  if (id === "field")
    return (
      <form className="contract-example-stack" onSubmit={validate} noValidate>
        <TextField
          ref={field}
          label={t("Project name", "اسم المشروع")}
          dir="auto"
          value={value}
          hint={t(
            "Use at least three characters. Nothing is sent or saved.",
            "استخدم ثلاثة أحرف على الأقل. لا يُرسَل شيء أو يُحفَظ.",
          )}
          error={
            error
              ? t(
                  "Add at least three characters. Your text is kept.",
                  "أدخل ثلاثة أحرف على الأقل. نصك محفوظ في الحقل.",
                )
              : undefined
          }
          onChange={(event) => {
            setValue(event.target.value);
            setError(false);
            setState("ready");
          }}
        />
        <Button type="submit">
          {t("Validate example", "التحقق من المثال")}
        </Button>
        <p role="status">
          {state === "valid"
            ? t(
                "Valid example. No data was submitted.",
                "مثال صالح. لم تُرسَل أي بيانات.",
              )
            : error
              ? t("Please correct the project name.", "صحّح اسم المشروع.")
              : ""}
        </p>
      </form>
    );
  if (id === "choice")
    return (
      <div className="contract-example-stack">
        <Checkbox
          label={t("Include completed tasks", "تضمين المهام المكتملة")}
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
        <Switch
          label={t("Preview reminders", "معاينة التذكيرات")}
          checked={state === "on"}
          onChange={(event) => setState(event.target.checked ? "on" : "off")}
        />
        <fieldset>
          <legend>{t("Review frequency", "وتيرة المراجعة")}</legend>
          <Radio
            name="contract-frequency"
            label={t("Weekly", "أسبوعيًا")}
            checked={frequency === "weekly"}
            onChange={() => setFrequency("weekly")}
          />
          <Radio
            name="contract-frequency"
            label={t("Monthly", "شهريًا")}
            checked={frequency === "monthly"}
            onChange={() => setFrequency("monthly")}
          />
        </fieldset>
        <p role="status">
          {t("Completed tasks: ", "المهام المكتملة: ")}
          {checked ? t("included", "مضمّنة") : t("hidden", "مخفية")}.{" "}
          {t("Reminders: ", "التذكيرات: ")}
          {state === "on" ? t("on", "مفعّلة") : t("off", "متوقفة")}.{" "}
          {frequency === "weekly"
            ? t("Weekly review.", "مراجعة أسبوعية.")
            : t("Monthly review.", "مراجعة شهرية.")}
        </p>
      </div>
    );
  if (id === "overlay")
    return (
      <div className="contract-example-stack">
        <Button ref={trigger} variant="secondary" onClick={() => setOpen(true)}>
          {t("Archive sample project", "أرشفة المشروع التجريبي")}
        </Button>
        <p role="status">
          {state === "archived"
            ? t(
                "Sample project archived in this preview.",
                "أُرشف المشروع التجريبي في هذه المعاينة.",
              )
            : t("Sample project is active.", "المشروع التجريبي نشط.")}
        </p>
        {state === "archived" && (
          <Button
            variant="quiet"
            onClick={() => {
              setState("ready");
              requestAnimationFrame(() => trigger.current?.focus());
            }}
          >
            {t("Undo archive", "التراجع عن الأرشفة")}
          </Button>
        )}
        <Dialog
          closeLabel={t("Close", "إغلاق")}
          lang={language}
          dir={language === "ar" ? "rtl" : "ltr"}
          open={open}
          onOpenChange={(value) => {
            if (!value) close();
          }}
          title={t("Archive the sample project?", "أرشفة المشروع التجريبي؟")}
          description={t(
            "It will leave the active list in this preview. You can undo this. No real project changes.",
            "سيغادر القائمة النشطة في المعاينة، ويمكنك التراجع. لا يتغير أي مشروع حقيقي.",
          )}
          footer={
            <>
              <Button variant="secondary" onClick={close}>
                {t("Keep active", "إبقاؤه نشطًا")}
              </Button>
              <Button
                onClick={() => {
                  setState("archived");
                  close();
                }}
              >
                {t("Archive sample", "أرشفة المثال")}
              </Button>
            </>
          }
        >
          {t(
            "Use a deliberate decision only when its consequence needs attention.",
            "اطلب قرارًا مقصودًا حين تستحق عاقبته الانتباه.",
          )}
        </Dialog>
      </div>
    );
  if (id === "navigation")
    return (
      <Tabs
        label={t("Contract example views", "عروض مثال المكوّن")}
        items={[
          {
            id: "today",
            label: t("Today", "اليوم"),
            content: (
              <p>
                {t(
                  "Today’s priorities stay in this view.",
                  "أولويات اليوم في هذا العرض.",
                )}
              </p>
            ),
          },
          {
            id: "week",
            label: t("Week", "الأسبوع"),
            content: (
              <p>
                {t(
                  "The week is another view of the same work.",
                  "الأسبوع عرض آخر للعمل نفسه.",
                )}
              </p>
            ),
          },
          {
            id: "notes",
            label: t("Notes", "ملاحظات"),
            content: (
              <p>
                {t(
                  "Related notes remain nearby.",
                  "الملاحظات المرتبطة تبقى قريبة.",
                )}
              </p>
            ),
          },
        ]}
      />
    );
  return (
    <div className="contract-example-stack">
      <div className="contract-state-buttons">
        {[
          ["ready", "Ready", "جاهز"],
          ["pending", "Pending", "معلّق"],
          ["failed", "Failed", "فاشل"],
          ["completed", "Completed", "مكتمل"],
        ].map(([key, en, ar]) => (
          <Button
            key={key}
            variant={state === key ? "primary" : "secondary"}
            aria-pressed={state === key}
            onClick={() => setState(key)}
          >
            {t(en, ar)}
          </Button>
        ))}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        <p>
          {state === "pending"
            ? t(
                "Waiting for confirmation. This example has not completed.",
                "ننتظر التأكيد. لم يكتمل هذا المثال.",
              )
            : state === "failed"
              ? t(
                  "Not completed. Your example content is kept.",
                  "لم يكتمل. محتوى المثال محفوظ.",
                )
              : state === "completed"
                ? t(
                    "Example completed. This is a state preview, not a real save.",
                    "اكتمل المثال. هذه معاينة حالة، وليست حفظًا حقيقيًا.",
                  )
                : t("Ready for your next action.", "جاهز للإجراء التالي.")}
        </p>
      </div>
      {state === "failed" && (
        <Button onClick={() => setState("pending")}>
          {t("Retry example", "إعادة محاولة المثال")}
        </Button>
      )}
    </div>
  );
}

export function ComponentContracts() {
  const [language, setLanguage] = useState<Language>("en");
  const [active, setActive] = useState("button");
  const contract = contracts.find((item) => item.id === active)!;
  const t = (copy: Copy) => copy[language === "en" ? 0 : 1];
  return (
    <div
      id="contracts"
      className="component-contracts"
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <header className="contract-header">
        <div>
          <p className="eyebrow">
            {t(["From principle to component", "من المبدأ إلى المكوّن"])}
          </p>
          <h3>{t(["A promise in every control.", "وعد في كل عنصر تحكم."])}</h3>
          <p>
            {t([
              "Choose a component. Read its contract, then test its behaviour with the actual Firdawsi primitives.",
              "اختر مكوّنًا، واقرأ قواعده، ثم جرّب سلوكه بعناصر فردوسي الفعلية.",
            ])}
          </p>
        </div>
        <div className="segmented" aria-label="Component guidance language">
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
      <label className="contract-picker">
        {t(["Choose component", "اختر المكوّن"])}
        <select
          value={active}
          onChange={(event) => setActive(event.target.value)}
        >
          {contracts.map((item) => (
            <option key={item.id} value={item.id}>
              {t(item.title)}
            </option>
          ))}
        </select>
      </label>
      <div className="contract-layout">
        <article className="contract-guidance">
          <h4>{t(contract.title)}</h4>
          <p>{t(contract.purpose)}</p>
          <div className="contract-connection">
            <SourceLink id={contract.source} />
            <p>{t(contract.connection)}</p>
          </div>
          <dl>
            {(
              [
                [["States", "الحالات"], contract.states],
                [
                  ["Keyboard & access", "لوحة المفاتيح والإتاحة"],
                  contract.keyboard,
                ],
                [
                  ["Language & direction", "اللغة والاتجاه"],
                  contract.direction,
                ],
                [["Reduced motion", "تقليل الحركة"], contract.motion],
                [["Avoid", "تجنّب"], contract.avoid],
              ] as [Copy, Copy][]
            ).map(([label, copy]) => (
              <div key={label[0]}>
                <dt>{t(label)}</dt>
                <dd>{t(copy)}</dd>
              </div>
            ))}
          </dl>
        </article>
        <div className="contract-preview">
          <p className="eyebrow">
            {t(["Interactive specimen", "مثال تفاعلي"])}
          </p>
          <p className="contract-preview-note">
            {t([
              "Temporary example state only. Nothing is sent, saved, or connected to notifications.",
              "حالة مؤقتة للمثال فقط. لا يُرسَل شيء أو يُحفَظ، ولا اتصال بالإشعارات.",
            ])}
          </p>
          <StateExample key={active} id={active} language={language} />
        </div>
      </div>
    </div>
  );
}
