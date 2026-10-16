import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, TextField, ThemeProvider } from "@firdawsi/web";

export function App() {
  const input = useRef<HTMLInputElement>(null);
  const [arabic, setArabic] = useState(false);
  const [dark, setDark] = useState(false);
  const [title, setTitle] = useState("");
  const [result, setResult] = useState<"idle" | "empty" | "checked">("idle");
  const text = arabic
    ? {
        title: "مساحة لخطوتك التالية",
        label: "ما الذي يحتاج إلى اهتمامك؟",
        intro: "مثال تجريبي مستقل. لا تُحفَظ بيانات ولا تُرسَل إلى خادم.",
        check: "التحقق من المثال",
        empty: "اكتب عنوانًا أولًا.",
        checked: "المثال صالح. لم تُحفَظ أي بيانات.",
        theme: "تبديل المظهر",
      }
    : {
        title: "Room for your next step",
        label: "What needs your attention?",
        intro:
          "An independent preview example. No data is saved or sent to a server.",
        check: "Check example",
        empty: "Enter a title first.",
        checked: "Example checked. No data was saved.",
        theme: "Switch theme",
      };
  useEffect(() => {
    if (result === "empty") input.current?.focus();
  }, [result]);
  function check(event: FormEvent) {
    event.preventDefault();
    setResult(title.trim() ? "checked" : "empty");
  }
  return (
    <ThemeProvider
      region="universal"
      language={arabic ? "ar" : "en"}
      direction={arabic ? "rtl" : "ltr"}
      theme={dark ? "dark" : "light"}
    >
      <main className="starter">
        <nav aria-label={arabic ? "تفضيلات العرض" : "Display preferences"}>
          <Button variant="secondary" onClick={() => setArabic(!arabic)}>
            <span lang={arabic ? "en" : "ar"} dir={arabic ? "ltr" : "rtl"}>
              {arabic ? "English" : "العربية"}
            </span>
          </Button>
          <Button
            variant="quiet"
            aria-pressed={dark}
            onClick={() => setDark(!dark)}
          >
            {text.theme}
          </Button>
        </nav>
        <p lang="en" dir="ltr">
          Firdawsi · Preview
        </p>
        <h1>{text.title}</h1>
        <p>{text.intro}</p>
        <form onSubmit={check}>
          <TextField
            ref={input}
            label={text.label}
            dir="auto"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setResult("idle");
            }}
            error={result === "empty" ? text.empty : undefined}
          />
          <Button type="submit">{text.check}</Button>
        </form>
        <p role="status">{result === "checked" ? text.checked : ""}</p>
      </main>
    </ThemeProvider>
  );
}
