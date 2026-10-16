import { useRef, useState, type FormEvent } from "react";
import type { Language } from "./philosophy-data";
import { SourceLink } from "./source-link";

type Task = { id: string; title: string; day: number };
const STORAGE_KEY = "firdawsi-experience-tasks-v1";
function readTasks(): { tasks: Task[]; failed: boolean } {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(raw) || !raw.every(task => task && typeof task.id === "string" && typeof task.title === "string" && Number.isInteger(task.day) && task.day >= 0 && task.day <= 6)) return { tasks: [], failed: true };
    return { tasks: raw, failed: false };
  } catch { return { tasks: [], failed: true }; }
}
export function ExperienceLab({ language }: { language: Language }) {
  const t = (en: string, ar: string) => language === "en" ? en : ar;
  const [initial] = useState(readTasks);
  const [tasks, setTasks] = useState<Task[]>(initial.tasks);
  const [draft, setDraft] = useState("");
  const [day, setDay] = useState(0);
  const [treatment, setTreatment] = useState("light");
  const [ornament, setOrnament] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const [status, setStatus] = useState<"ready" | "saved" | "failed" | "invalid" | "undone">("ready");
  const [pending, setPending] = useState<Task[] | null>(null);
  const [previous, setPrevious] = useState<Task[] | null>(null);
  const [readFailed, setReadFailed] = useState(initial.failed);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCapture = useRef(false);
  const days = language === "en" ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] : ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"];
  function persist(next: Task[], capture = false) {
    try {
      if (failNext) { setFailNext(false); throw new Error("Demo failure"); }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setPrevious(tasks); setTasks(next); setPending(null); setStatus("saved"); setReadFailed(false);
      if (capture) { setDraft(""); inputRef.current?.focus(); }
      pendingCapture.current = false;
    } catch {
      setPending(next); setStatus("failed"); pendingCapture.current = capture;
    }
  }
  function capture(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) { setStatus("invalid"); inputRef.current?.focus(); return; }
    persist([...tasks, { id: crypto.randomUUID(), title: draft.trim(), day }], true);
  }
  function undo() {
    if (!previous) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(previous)); setTasks(previous); setPrevious(null); setStatus("undone"); }
    catch { setPending(previous); pendingCapture.current = false; setStatus("failed"); }
  }
  const blocked = pending !== null || readFailed;
  return <div className="experience-lab" id="experience">
    <header className="philosophy-subheading"><p className="eyebrow">{t("Experience lab / working prototype", "مختبر التجربة / نموذج تفاعلي")}</p><h3>{t("Feel the principles at work.", "جرّب المبادئ عمليًا.")}</h3><p>{t("Capture a task, move it within the week, and recover from a failed save. Your tasks stay in this browser.", "أضف مهمة، وانقلها خلال الأسبوع، واستعد من فشل الحفظ. تبقى مهامك في هذا المتصفح.")}</p></header>
    <fieldset className="experience-treatments"><legend>{t("Explore a visual direction", "استكشف اتجاهًا بصريًا")}</legend>
      {[["light", "Light & depth", "الضوء والعمق"], ["rhythm", "Rhythm & proportion", "الإيقاع والتناسب"], ["gathering", "Continuity & gathering", "الترابط والتجميع"]].map(([value, en, ar]) => <label key={value}><input type="radio" name="experience-treatment" value={value} checked={treatment === value} onChange={() => setTreatment(value)}/>{t(en, ar)}</label>)}
    </fieldset>
    <div className="experience-options"><label><input type="checkbox" checked={ornament} onChange={event => setOrnament(event.target.checked)}/>{t("Show decorative geometry", "إظهار الزخرفة الهندسية")}</label><label><input type="checkbox" checked={failNext} onChange={event => setFailNext(event.target.checked)}/>{t("Simulate next save failure", "محاكاة فشل الحفظ التالي")}</label></div>
    <div className={`experience-workspace experience-workspace--${treatment}`} data-ornament={ornament}>
      <div className="experience-workspace__heading"><div><span className="eyebrow">{t("A little room for what matters", "مساحة صغيرة لما يهم")}</span><h4>{t("Your week, gathered.", "أسبوعك، في مكان واحد.")}</h4></div><span aria-hidden="true" className="experience-emblem">◇</span></div>
      {readFailed && <div role="alert" className="experience-error"><p>{t("Saved tasks could not be read. Nothing has been overwritten. Retry reading before making changes.", "تعذّرت قراءة المهام المحفوظة. لم تُستبدل أي بيانات. أعد محاولة القراءة قبل إجراء تغييرات.")}</p><button type="button" onClick={() => { const result = readTasks(); if (!result.failed) { setTasks(result.tasks); setReadFailed(false); } }}>{t("Retry reading", "إعادة القراءة")}</button></div>}
      <form onSubmit={capture} className="experience-capture">
        <div><label htmlFor="experience-task">{t("What needs your attention?", "ما الذي يحتاج إلى اهتمامك؟")}</label><input ref={inputRef} id="experience-task" value={draft} maxLength={160} disabled={blocked} aria-invalid={status === "invalid"} aria-describedby="experience-feedback" onChange={event => { setDraft(event.target.value); if (status === "invalid") setStatus("ready"); }}/></div>
        <div><label htmlFor="experience-day">{t("Day", "اليوم")}</label><select id="experience-day" value={day} disabled={blocked} onChange={event => setDay(Number(event.target.value))}>{days.map((name, index) => <option value={index} key={index}>{name}</option>)}</select></div>
        <button type="submit" disabled={blocked}>{t("Add task", "إضافة مهمة")} <span aria-hidden="true">+</span></button>
      </form>
      <div id="experience-feedback" role="status" aria-live="polite" aria-atomic="true" className={`experience-feedback ${pending ? "experience-error" : ""}`}>
        <p>{status === "invalid" ? t("Enter a task first. Your day selection is kept.", "اكتب المهمة أولًا. احتفظنا باليوم المحدد.") : status === "failed" ? t("Not saved. Your previous tasks and draft are safe. Retry or cancel this change.", "لم تُحفَظ. المهام السابقة والمسودة محفوظة. أعد المحاولة أو ألغِ التغيير.") : status === "saved" ? t("Saved in this browser.", "حُفظت في هذا المتصفح.") : status === "undone" ? t("Previous change undone and saved.", "أُلغي التغيير السابق وحُفظت النتيجة.") : t("Ready when you are.", "جاهز حين تكون مستعدًا.")}</p>
        {pending && <div className="experience-recovery"><button type="button" onClick={() => persist(pending, pendingCapture.current)}>{t("Retry save", "إعادة الحفظ")}</button><button type="button" onClick={() => { setPending(null); setStatus("ready"); inputRef.current?.focus(); }}>{t("Cancel change", "إلغاء التغيير")}</button></div>}
        {previous && !pending && <button type="button" onClick={undo}>{t("Undo last change", "تراجع عن آخر تغيير")}</button>}
      </div>
      {tasks.length === 0 ? <p className="experience-empty">{t("An open week. Start with one meaningful task.", "أسبوع مفتوح. ابدأ بمهمة ذات معنى.")}</p> : <ul className="experience-tasks">{tasks.map(task => <li key={task.id}><span>{task.title}</span><label><span className="sr-only">{t("Move", "نقل")} {task.title}</span><select aria-label={`${t("Move", "نقل")} ${task.title}`} disabled={blocked} value={task.day} onChange={event => persist(tasks.map(item => item.id === task.id ? { ...item, day: Number(event.target.value) } : item))}>{days.map((name, index) => <option value={index} key={index}>{name}</option>)}</select></label></li>)}</ul>}
    </div>
    <div className="experience-connections"><span>{t("Capture with ease", "إضافة بتيسير")} · <SourceLink id="ease"/></span><span>{t("Move with dignity", "نقل بكرامة")} · <SourceLink id="dignity"/></span><span>{t("Recover with trust", "استعادة بأمانة")} · <SourceLink id="trust"/></span><span>{t("Report truthfully", "إبلاغ بصدق")} · <SourceLink id="truth"/></span></div>
  </div>;
}
