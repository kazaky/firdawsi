import { type PatternPresetId } from "@firdawsi/geometry";
import { GeometryAtlas } from "./geometry-atlas";
import { TYPE_ROLES, themes, tokenVar, type ThemeName } from "@firdawsi/tokens";
import {
  Text,
  ThemeProvider,
  type Direction,
} from "@firdawsi/web";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { ComponentAnatomy, ComponentMatrix, MechanicsSection, TokensSection } from "./component-gallery";
import { ArtDirection } from "./art-direction";
import { PatternGuidance } from "./adoption-guide";
import { ComponentContracts } from "./component-contracts";
import { PhilosophySection } from "./philosophy-section";
import { CourtyardSection } from "./courtyard-section";
import {
  GITHUB_URL,
  GuideMenuButton,
  GuidePanel,
  GuideScrim,
  guideNavGroups,
} from "./guide-panel";
import { GardenWorld, GardenAtmosphere, GardenInvitation } from "./garden-world";
import { KhatamMark } from "./khatam-mark";
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

function TokensSwatches() {
  return (
    <>
      <div className="type-specimen" data-type-specimen>
        <p className="type-specimen__note">
          El Messiri gives Arabic and Latin display a shared character. Qandus remains a licensed Fez reference we do not ship.
        </p>
        <div className="type-specimen__pair">
          <Text role="display-sm">Gardens of light</Text>
          <Text role="display-sm" lang="ar">حدائق النور</Text>
        </div>
        <div className="type-specimen__pair">
          <Text role="body-md">Body in Noto Sans, optically paired.</Text>
          <Text role="body-md" lang="ar">النص بالعربية في نوتو سنس عربي.</Text>
        </div>
      </div>
      <table className="docs-table">
        <caption>Semantic color roles</caption>
        <thead><tr><th>Role</th><th>Swatch</th><th>Variable</th></tr></thead>
        <tbody>
          {["primary", "secondary", "tertiary", "surface-tier-1", "surface-tier-2", "error", "success"].map((role) => (
            <tr key={role}>
              <td>{role}</td>
              <td><span className="docs-swatch" style={{ background: tokenVar(`color.${role}`) }} /></td>
              <td><code>{tokenVar(`color.${role}`)}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Type roles</h3>
      <ul className="docs-typelist">
        {TYPE_ROLES.map((role) => (
          <li key={role}><Text role={role}>{role} · Gardens of light</Text></li>
        ))}
      </ul>
    </>
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

          <div hidden={active !== "principles" && active !== "experience"}><PhilosophySection view={active} /></div>

          <section hidden={active !== "foundations"} id="foundations" className="section section--ink">
            <SectionHeading number="02" eyebrow="Foundations" title="A calibrated material palette">
              Semantic tokens keep every surface coherent across themes, directions, and products.
            </SectionHeading>
            <div className="foundation-layout">
              <div className="swatch-stack">
                {[
                  ["Primary / Cobalt", themes[theme]["color.primary"]],
                  ["Accent / Amber", themes[theme]["color.accent"]],
                  ["Surface", themes[theme]["color.surface"]],
                  ["Text", themes[theme]["color.text"]],
                ].map(([label, value], index) => (
                  <div className="swatch" key={label} style={{ "--swatch": value } as CSSProperties}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{label}</strong>
                    <code>{value}</code>
                  </div>
                ))}
              </div>
              <div className="type-specimen">
                <p className="eyebrow">Multiscript typography</p>
                <div className="type-line type-line--display">
                  <span>Measured clarity</span>
                  <span lang="ar" dir="rtl">وضوحٌ متوازن</span>
                </div>
                <div className="type-line">
                  <p>Plan the next step with calm, legible hierarchy.</p>
                  <p lang="ar" dir="rtl">خطّط للخطوة التالية بتسلسل واضح وهادئ.</p>
                </div>
                <div className="measure-grid">
                  {[4, 8, 16, 24, 40, 64].map((size) => (
                    <div key={size}><span style={{ width: size }} />{size}</div>
                  ))}
                </div>
                <code className="token-callout">{tokenVar("font.family.sans")}</code>
              </div>
            </div>
          </section>

          <div hidden={active !== "pattern-guidance"}><PatternGuidance /></div>

          <section hidden={active !== "geometry"} id="geometry" className="section">
            <GeometryAtlas onOpenStudio={(id) => { setStudioPreset(id); setStudioRequest(value => value + 1); window.location.hash = "studio"; }} />
          </section>

          <section hidden={active !== "mechanics"} id="mechanics" className="section">
            <SectionHeading number="05" eyebrow="Signature mechanics" title="Six non-decorative identities">
              Ornament is optional. These six mechanics fire in every component, so the system
              stays recognizably Firdawsi with decoration turned off.
            </SectionHeading>
            <MechanicsSection />
          </section>

          <section hidden={active !== "tokens"} id="tokens" className="section section--ink">
            <SectionHeading number="06" eyebrow="Tokens" title="Sebka scale, carved planes, Alberca springs">
              Type roles, surface tiers, springs, and regional overlays are authorable — not hardcoded CSS.
            </SectionHeading>
            <TokensSection swatches={<TokensSwatches />} />
          </section>

          <section hidden={active !== "components" && active !== "contracts"} id="components" className="section">
            <SectionHeading number="07" eyebrow="Component gallery" title="Components">
              Accessible React primitives carry the grammar — arch corners, carved tiers, strapwork
              focus — without changing expected behavior.
            </SectionHeading>
            <div hidden={active !== "contracts"}><ComponentContracts /></div>
            <div hidden={active !== "components"}><ComponentAnatomy />
            <ComponentMatrix /></div>
          </section>

          <section hidden={active !== "courtyard"} id="courtyard" className="section section--courtyard">
            <SectionHeading number="08" eyebrow="Use" title="Courtyard day desk">
              A real local-first workflow: prayer context, quick capture, persistent intentions,
              reversible removal, and peaceful completion—without an account.
            </SectionHeading>
            <CourtyardSection />
          </section>

          <section hidden={active !== "motion"} id="motion" className="section section--motion">
            <SectionHeading number="09" eyebrow="Interaction" title="From rest to peaceful completion">
              One causal cycle serves touch, pointer, keyboard, and voice. Motion can disappear;
              response, continuity, and a stable result cannot.
            </SectionHeading>
            <div className="motion-grid">
              {[
                ["0", "Sukūn", "Rest · stable default"],
                ["120", "Dunūw", "Nearness · availability clarifies"],
                ["120", "Istijābah", "Response · input acknowledged"],
                ["220", "Jarāyān", "Flow · place is preserved"],
                ["360", "Istiqrār", "Settling · state stabilizes"],
                ["220", "Salām", "Peace · result remains visible"],
              ].map(([duration, title, copy], index) => (
                <div className="motion-card" key={title} data-stage={title.toLowerCase()}>
                  <div className={`motion-orbit motion-orbit--${index + 1}`}><KhatamMark size={24} /></div>
                  <strong>{duration}<small>ms</small></strong>
                  <h3>{title}</h3><p>{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section hidden={active !== "accessibility"} id="accessibility" className="section">
            <SectionHeading number="10" eyebrow="Accessibility" title="Access is part of the form">
              Contrast, focus, direction, language, and motion preferences are design inputs—not post-production checks.
            </SectionHeading>
            <div className="access-layout">
              <div className="access-score">
                <div>
                  <span>AA</span>
                  <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" /><circle className="score-ring" cx="60" cy="60" r="52" /></svg>
                </div>
                <p>Target: WCAG 2.2 AA. Automated audits support verification; manual accessibility review remains pending.</p>
              </div>
              <div className="access-list">
                {[
                  ["Direction aware", "Logical properties and mirrored reading order."],
                  ["Keyboard complete", "Visible strapwork focus and predictable tab sequence."],
                  ["Motion considerate", "No essential information depends on animation."],
                  ["Geometry described", "Decorative SVG stays silent; meaningful SVG is named."],
                ].map(([title, copy], index) => (
                  <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div><b aria-hidden="true">✓</b></article>
                ))}
              </div>
            </div>
            <div className="language-pair">
              <article dir="ltr"><span>English / LTR</span><h3>Your week, in balance.</h3><p>Review priorities and make room for what matters next.</p></article>
              <article dir="rtl" lang="ar"><span>العربية / من اليمين</span><h3>أسبوعك، بتوازن.</h3><p>راجع أولوياتك واترك مساحة لما هو مهم تالياً.</p></article>
            </div>
          </section>

          <section hidden={active !== "studio"} id="studio" className="section section--studio">
            <SectionHeading number="11" eyebrow="Preset-first workshop" title="Pattern Studio">
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
