import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Language } from "./philosophy-data";
import { SourceLink } from "./source-link";

type Task = { id: string; title: string; day: number; complete: boolean };
type Change = "capture" | "edit" | "change" | "undo";
const STORAGE_KEY = "firdawsi-experience-tasks-v1";
function readTasks(): { tasks: Task[]; failed: boolean } {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (
      !Array.isArray(raw) ||
      !raw.every(
        (task) =>
          task &&
          typeof task.id === "string" &&
          typeof task.title === "string" &&
          Number.isInteger(task.day) &&
          task.day >= 0 &&
          task.day <= 6 &&
          (task.complete === undefined || typeof task.complete === "boolean"),
      )
    )
      return { tasks: [], failed: true };
    return {
      tasks: raw.map((task) => ({ ...task, complete: task.complete ?? false })),
      failed: false,
    };
  } catch {
    return { tasks: [], failed: true };
  }
}
export function ExperienceLab({ language }: { language: Language }) {
  const t = (en: string, ar: string) => (language === "en" ? en : ar);
  const [initial] = useState(readTasks);
  const [tasks, setTasks] = useState<Task[]>(initial.tasks);
  const [draft, setDraft] = useState("");
  const [day, setDay] = useState(0);
  const [treatment, setTreatment] = useState("light");
  const [ornament, setOrnament] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const [status, setStatus] = useState<
    "ready" | "saved" | "failed" | "invalid" | "undone"
  >("ready");
  const [pending, setPending] = useState<Task[] | null>(null);
  const [previous, setPrevious] = useState<Task[] | null>(null);
  const [readFailed, setReadFailed] = useState(initial.failed);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingChange = useRef<Change>("change");
  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editingId) editRef.current?.focus();
  }, [editingId]);
  const days =
    language === "en"
      ? [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ]
      : [
          "الاثنين",
          "الثلاثاء",
          "الأربعاء",
          "الخميس",
          "الجمعة",
          "السبت",
          "الأحد",
        ];
  function persist(next: Task[], change: Change = "change") {
    try {
      if (failNext) {
        setFailNext(false);
        throw new Error("Demo failure");
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setPrevious(change === "undo" ? null : tasks);
      setTasks(next);
      setPending(null);
      setStatus(change === "undo" ? "undone" : "saved");
      setReadFailed(false);
      if (change === "capture") setDraft("");
      if (change === "edit") {
        setEditingId(null);
        setEditError(false);
      }
      pendingChange.current = "change";
      if (change === "capture" || change === "edit")
        requestAnimationFrame(() => inputRef.current?.focus());
    } catch {
      setPending(next);
      setStatus("failed");
      pendingChange.current = change;
    }
  }
  function capture(event: FormEvent) {
    event.preventDefault();
    if (blocked || editingId !== null) return;
    if (!draft.trim()) {
      setStatus("invalid");
      inputRef.current?.focus();
      return;
    }
    persist(
      [
        ...tasks,
        { id: crypto.randomUUID(), title: draft.trim(), day, complete: false },
      ],
      "capture",
    );
  }
  function undo() {
    if (previous) persist(previous, "undo");
  }
  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditValue(task.title);
    setEditError(false);
  }
  function saveEdit(event: FormEvent) {
    event.preventDefault();
    if (!editValue.trim()) {
      setEditError(true);
      editRef.current?.focus();
      return;
    }
    persist(
      tasks.map((task) =>
        task.id === editingId ? { ...task, title: editValue.trim() } : task,
      ),
      "edit",
    );
  }
  const blocked = pending !== null || readFailed;
  function renderTask(task: Task) {
    const taskBlocked = blocked || editingId !== null;
    return (
      <li key={task.id} data-complete={task.complete}>
        <label className="experience-task-title">
          <input
            type="checkbox"
            checked={task.complete}
            disabled={taskBlocked}
            aria-label={`${t("Complete", "إكمال")} ${task.title}`}
            onChange={(event) =>
              persist(
                tasks.map((item) =>
                  item.id === task.id
                    ? { ...item, complete: event.target.checked }
                    : item,
                ),
              )
            }
          />
          <span dir="auto">{task.title}</span>
        </label>
        <div className="experience-task-actions">
          <select
            aria-label={`${t("Move", "نقل")} ${task.title}`}
            disabled={taskBlocked}
            value={task.day}
            onChange={(event) =>
              persist(
                tasks.map((item) =>
                  item.id === task.id
                    ? { ...item, day: Number(event.target.value) }
                    : item,
                ),
              )
            }
          >
            {days.map((name, index) => (
              <option value={index} key={index}>
                {name}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={taskBlocked}
            aria-label={`${t("Edit", "تعديل")} ${task.title}`}
            onClick={() => startEdit(task)}
          >
            {t("Edit", "تعديل")}
          </button>
          <button
            type="button"
            disabled={taskBlocked}
            aria-label={`${t("Remove", "حذف")} ${task.title}`}
            onClick={() => {
              persist(tasks.filter((item) => item.id !== task.id));
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
          >
            {t("Remove", "حذف")}
          </button>
        </div>
      </li>
    );
  }
  return (
    <div className="experience-lab" id="experience">
      <header className="philosophy-subheading">
        <p className="eyebrow">
          {t(
            "Experience lab / working prototype",
            "مختبر التجربة / نموذج تفاعلي",
          )}
        </p>
        <h3>{t("Feel the principles at work.", "جرّب المبادئ عمليًا.")}</h3>
        <p>
          {t(
            "Capture, edit, complete, and move tasks through your week. Remove with undo and recover from failed saves. Your tasks stay in this browser.",
            "أضف المهام وعدّلها وأكملها وانقلها خلال الأسبوع. احذف مع إمكانية التراجع واستعد من فشل الحفظ. تبقى مهامك في هذا المتصفح.",
          )}
        </p>
      </header>
      <fieldset className="experience-treatments">
        <legend>
          {t("Explore a visual direction", "استكشف اتجاهًا بصريًا")}
        </legend>
        {[
          ["light", "Light & depth", "الضوء والعمق"],
          ["rhythm", "Rhythm & proportion", "الإيقاع والتناسب"],
          ["gathering", "Continuity & gathering", "الترابط والتجميع"],
        ].map(([value, en, ar]) => (
          <label key={value}>
            <input
              type="radio"
              name="experience-treatment"
              value={value}
              checked={treatment === value}
              onChange={() => setTreatment(value)}
            />
            {t(en, ar)}
          </label>
        ))}
      </fieldset>
      <div className="experience-options">
        <label>
          <input
            type="checkbox"
            checked={ornament}
            onChange={(event) => setOrnament(event.target.checked)}
          />
          {t("Show decorative geometry", "إظهار الزخرفة الهندسية")}
        </label>
        <label>
          <input
            type="checkbox"
            checked={failNext}
            onChange={(event) => setFailNext(event.target.checked)}
          />
          {t("Simulate next save failure", "محاكاة فشل الحفظ التالي")}
        </label>
      </div>
      <div
        className={`experience-workspace experience-workspace--${treatment}`}
        data-ornament={ornament}
      >
        <div className="experience-workspace__heading">
          <div>
            <span className="eyebrow">
              {t("A little room for what matters", "مساحة صغيرة لما يهم")}
            </span>
            <h4>{t("Your week, gathered.", "أسبوعك، في مكان واحد.")}</h4>
          </div>
          <span aria-hidden="true" className="experience-emblem">
            ◇
          </span>
        </div>
        {readFailed && (
          <div role="alert" className="experience-error">
            <p>
              {t(
                "Saved tasks could not be read. Nothing has been overwritten. Retry reading before making changes.",
                "تعذّرت قراءة المهام المحفوظة. لم تُستبدل أي بيانات. أعد محاولة القراءة قبل إجراء تغييرات.",
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                const result = readTasks();
                if (!result.failed) {
                  setTasks(result.tasks);
                  setReadFailed(false);
                }
              }}
            >
              {t("Retry reading", "إعادة القراءة")}
            </button>
          </div>
        )}
        <form onSubmit={capture} className="experience-capture">
          <div>
            <label htmlFor="experience-task">
              {t("What needs your attention?", "ما الذي يحتاج إلى اهتمامك؟")}
            </label>
            <input
              ref={inputRef}
              id="experience-task"
              value={draft}
              maxLength={160}
              disabled={blocked}
              aria-invalid={status === "invalid"}
              aria-describedby="experience-feedback"
              onChange={(event) => {
                setDraft(event.target.value);
                if (status === "invalid") setStatus("ready");
              }}
            />
          </div>
          <div>
            <label htmlFor="experience-day">{t("Day", "اليوم")}</label>
            <select
              id="experience-day"
              value={day}
              disabled={blocked}
              onChange={(event) => setDay(Number(event.target.value))}
            >
              {days.map((name, index) => (
                <option value={index} key={index}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={blocked || editingId !== null}>
            {t("Add task", "إضافة مهمة")} <span aria-hidden="true">+</span>
          </button>
        </form>
        <div
          id="experience-feedback"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={`experience-feedback ${pending ? "experience-error" : ""}`}
        >
          <p>
            {status === "invalid"
              ? t(
                  "Enter a task first. Your day selection is kept.",
                  "اكتب المهمة أولًا. احتفظنا باليوم المحدد.",
                )
              : status === "failed"
                ? t(
                    "Not saved. Your previous tasks and draft are safe. Retry or cancel this change.",
                    "لم تُحفَظ. المهام السابقة والمسودة محفوظة. أعد المحاولة أو ألغِ التغيير.",
                  )
                : status === "saved"
                  ? t("Saved in this browser.", "حُفظت في هذا المتصفح.")
                  : status === "undone"
                    ? t(
                        "Previous change undone and saved.",
                        "أُلغي التغيير السابق وحُفظت النتيجة.",
                      )
                    : t("Ready when you are.", "جاهز حين تكون مستعدًا.")}
          </p>
          {pending && (
            <div className="experience-recovery">
              <button
                type="button"
                onClick={() => persist(pending, pendingChange.current)}
              >
                {t("Retry save", "إعادة الحفظ")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPending(null);
                  setStatus("ready");
                  requestAnimationFrame(() =>
                    editingId
                      ? editRef.current?.focus()
                      : inputRef.current?.focus(),
                  );
                }}
              >
                {t("Cancel change", "إلغاء التغيير")}
              </button>
            </div>
          )}
          {previous && !pending && !editingId && (
            <button type="button" onClick={undo}>
              {t("Undo last change", "تراجع عن آخر تغيير")}
            </button>
          )}
        </div>
        <div className="experience-week-tools">
          <p>
            {tasks.filter((task) => !task.complete).length}{" "}
            {t("open", "مفتوحة")} ·{" "}
            {tasks.filter((task) => task.complete).length}{" "}
            {t("completed", "مكتملة")}
          </p>
          <div
            className="segmented"
            aria-label={t("Planner view", "عرض المخطط")}
          >
            <button
              type="button"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              {t("List view", "عرض القائمة")}
            </button>
            <button
              type="button"
              aria-pressed={view === "week"}
              onClick={() => setView("week")}
            >
              {t("Week view", "عرض الأسبوع")}
            </button>
          </div>
        </div>
        {editingId && (
          <form className="experience-edit" onSubmit={saveEdit}>
            <label htmlFor="experience-edit-title">
              {t("Edit task title", "تعديل عنوان المهمة")}
            </label>
            <input
              id="experience-edit-title"
              ref={editRef}
              dir="auto"
              maxLength={160}
              disabled={blocked}
              value={editValue}
              aria-invalid={editError}
              aria-describedby={editError ? "experience-edit-error" : undefined}
              onChange={(event) => {
                setEditValue(event.target.value);
                setEditError(false);
              }}
            />
            {editError && (
              <p id="experience-edit-error">
                {t(
                  "Keep a title for this task. Your previous title is safe.",
                  "أبقِ عنوانًا للمهمة. العنوان السابق محفوظ.",
                )}
              </p>
            )}
            <div>
              <button type="submit" disabled={blocked}>
                {t("Save title", "حفظ العنوان")}
              </button>
              <button
                type="button"
                disabled={blocked}
                onClick={() => {
                  setEditingId(null);
                  setEditError(false);
                  inputRef.current?.focus();
                }}
              >
                {t("Cancel editing", "إلغاء التعديل")}
              </button>
            </div>
          </form>
        )}
        {tasks.length === 0 ? (
          <p className="experience-empty">
            {t(
              "An open week. Start with one meaningful task.",
              "أسبوع مفتوح. ابدأ بمهمة ذات معنى.",
            )}
          </p>
        ) : view === "list" ? (
          <ul className="experience-tasks">{tasks.map(renderTask)}</ul>
        ) : (
          <div className="experience-week-grid">
            {days.map((name, index) => (
              <section className="experience-day" key={index} aria-label={name}>
                <h5>
                  {name}{" "}
                  <span>
                    {tasks.filter((task) => task.day === index).length}
                  </span>
                </h5>
                {tasks.some((task) => task.day === index) ? (
                  <ul className="experience-day-tasks">
                    {tasks.filter((task) => task.day === index).map(renderTask)}
                  </ul>
                ) : (
                  <p>{t("Room for what matters.", "مساحة لما يهم.")}</p>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
      <div className="experience-connections">
        <span>
          {t("Capture with ease", "إضافة بتيسير")} · <SourceLink id="ease" />
        </span>
        <span>
          {t("Move with dignity", "نقل بكرامة")} · <SourceLink id="dignity" />
        </span>
        <span>
          {t("Recover with trust", "استعادة بأمانة")} ·{" "}
          <SourceLink id="trust" />
        </span>
        <span>
          {t("Report truthfully", "إبلاغ بصدق")} · <SourceLink id="truth" />
        </span>
      </div>
    </div>
  );
}
