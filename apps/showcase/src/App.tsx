import { type PatternPresetId } from "@firdawsi/geometry";
import { GeometryAtlas } from "./geometry-atlas";
import { type ThemeName } from "@firdawsi/tokens";
import {
  ThemeProvider,
  type Direction,
} from "@firdawsi/web";
import { useEffect, useState, type ReactNode } from "react";

import { ArtDirection } from "./art-direction";
import { PhilosophySection } from "./philosophy-section";
import {
  GITHUB_URL,
  GuideMenuButton,
  GuidePanel,
  GuideScrim,
  guideNavGroups,
} from "./guide-panel";
import { GardenWorld, GardenAtmosphere, GardenInvitation } from "./garden-world";
import { FirdawsiLogo } from "./firdawsi-logo";
import { PatternStudio } from "./pattern-studio";
import { type PaletteName } from "./showcase-data";

const sectionIds = guideNavGroups.flatMap((group) => group.items.map((item) => item.id));

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function SectionHeading({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="section-heading">
      <div className="section-index" aria-hidden="true">{number}</div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {children && <p className="section-intro">{children}</p>}
      </div>
    </header>
  );
}

function ThemeControls({
  theme,
  setTheme,
  direction,
  setDirection,
}: {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  direction: Direction;
  setDirection: (direction: Direction) => void;
}) {
  return (
    <div className="display-controls" aria-label="Display preferences">
      <div className="segmented" aria-label="Color theme">
        {(["light", "dark", "highContrast"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-label={option === "highContrast" ? "High contrast" : option}
            aria-pressed={theme === option}
            onClick={() => setTheme(option)}
          >
            <span className={`theme-dot theme-dot--${option}`} />
            <span className="control-label">{option === "highContrast" ? "Contrast" : option}</span>
          </button>
        ))}
      </div>
      <div className="segmented" aria-label="Text direction">
        {(["ltr", "rtl"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={direction === option}
            onClick={() => setDirection(option)}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

function hashSection(): string {
  const hash = window.location.hash.replace("#", "");
  if (hash === "regions") return "geometry";
  if (hash === "home" || hash === "") return "overview";
  return sectionIds.includes(hash as (typeof sectionIds)[number]) ? hash : "overview";
}

export function App() {
  const [artPalette, setArtPalette] = useState<PaletteName>("garden");
  const [theme, setTheme] = useState<ThemeName>("light");
  const [direction, setDirection] = useState<Direction>("ltr");
  const [active, setActive] = useState(hashSection);
  const [guideOpen, setGuideOpen] = useState(false);
  const [studioRequest, setStudioRequest] = useState(0);
  const [studioPreset, setStudioPreset] = useState<PatternPresetId>("rosette-12-almond");

  useEffect(() => {
    const onHash = () => setActive(hashSection());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [active]);

  useEffect(() => {
    if (!guideOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGuideOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guideOpen]);

  return (
    <ThemeProvider
      theme={theme}
      direction={direction}
      region="andalusi-maghrebi"
      onThemeChange={setTheme}
      onDirectionChange={setDirection}
    >
      <div className={`app${guideOpen ? " app--guide-open" : ""}`}>
        <header className="topbar">
          <div className="topbar__start">
            <GuideMenuButton open={guideOpen} onClick={() => setGuideOpen((value) => !value)} />
            <a className="brand" href="#overview" aria-label="Firdawsi home">
              <FirdawsiLogo />
              <span>Firdawsi <i>/</i> <span lang="ar" dir="rtl">فردوسي</span></span>
            </a>
          </div>
          <div className="topbar__end">
            <a className="topbar__github" href={GITHUB_URL} rel="noreferrer" target="_blank">
              GitHub <Arrow />
            </a>
            <ThemeControls
              theme={theme}
              setTheme={setTheme}
              direction={direction}
              setDirection={setDirection}
            />
          </div>
        </header>

        <GuideScrim open={guideOpen} onClose={() => setGuideOpen(false)} />
        <GuidePanel
          active={active}
          mobileOpen={guideOpen}
          onNavigate={() => setGuideOpen(false)}
        />

        <GardenAtmosphere />
        <main id="main" data-page={active}>
          <section hidden={active !== "overview"} id="overview" className="hero">
            <div className="hero-content">
              <p className="issue-label">Firdawsi / فردوسي</p>
              <p className="hero-edition">A Qur’an-guided design language</p>
              <h1>
                Gardens of
                <span>light.</span>
              </h1>
              <div className="hero-statement">
                <p>
                  A design system for peaceful, secure, effortless interaction. Qur’anic qualities
                  associated with Jannah guide the experience; intention, dignity, and gentleness
                  shape its behaviour. Beauty gives those principles a visible rhythm.
                </p>
                <p lang="ar" dir="rtl">
                  نظام واجهات يستلهم السلام والقرب والتيسير من أوصاف الجنة، وتوجّه النية والكرامة
                  والرفق سلوكه. معنى يظهر في التجربة، لا في الزخرفة وحدها.
                </p>
              </div>
              <p className="hero-guardrail">
                Firdawsi does not depict, reconstruct, or simulate Jannah. It documents design
                inferences and keeps sacred text out of decoration and interface feedback.
              </p>
              <div className="hero-actions">
                <a className="text-link" href="#principles">Explore the philosophy <Arrow /></a>
                <a className="text-link text-link--quiet" href="/foundations/">The visual foundations book →</a>
                <a className="text-link text-link--github" href={GITHUB_URL} rel="noreferrer" target="_blank">
                  Star on GitHub <Arrow />
                </a>
              </div>
            </div>
            <figure className="hero-art">
              <GardenWorld />
              <figcaption><span>A garden of light & quiet</span><span lang="ar" dir="rtl">حديقة من نور وسكينة</span></figcaption>
            </figure>
            <div className="hero-meta">
              <span>12 principles</span><span>6 stages</span><span>3 themes</span><span>2 directions</span>
            </div>
          </section>

          <div hidden={active !== "overview"}><GardenInvitation /></div>

          <div hidden={active !== "art-direction"}><ArtDirection palette={artPalette} onPaletteChange={setArtPalette} /></div>

          <div hidden={active !== "principles"}><PhilosophySection /></div>

          <section hidden={active !== "geometry"} id="geometry" className="section">
            <GeometryAtlas onOpenStudio={(id) => { setStudioPreset(id); setStudioRequest(value => value + 1); window.location.hash = "studio"; }} />
          </section>

          <section hidden={active !== "studio"} id="studio" className="section section--studio">
            <SectionHeading number="04" eyebrow="Preset-first workshop" title="Pattern Studio">
              Begin with a compass rosette — real construction, not a decorative star — then tune
              only the controls its family supports, compare responsive tiers, and export its recipe.
            </SectionHeading>
            <PatternStudio key={studioRequest} initialPreset={studioPreset} />
          </section>

          <footer hidden={active === "overview"} className="footer">
            <div><FirdawsiLogo size={42} /><strong>Firdawsi</strong></div>
            <p>Qur’an-guided experiential principles for interfaces that feel peaceful, secure, effortless, and grounded.</p>
            <a href="https://firdawsi.org" rel="noreferrer">firdawsi.org</a>
            <a href={GITHUB_URL} rel="noreferrer" target="_blank">GitHub</a>
            <a href="#overview">Return to top ↑</a>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
}
