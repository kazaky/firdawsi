import {
  PRESETS,
  applyRegionalProfile,
  generatePreset,
  preferredPresetForProfile,
  type PatternOptions,
  type PatternPresetId,
} from "@firdawsi/geometry";
import { TYPE_ROLES, themes, tokenVar, type ThemeName } from "@firdawsi/tokens";
import {
  Text,
  ThemeProvider,
  type Direction,
} from "@firdawsi/web";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import { ComponentAnatomy, ComponentMatrix, MechanicsSection, TokensSection } from "./component-gallery";
import { CourtyardSection } from "./courtyard-section";
import {
  GITHUB_URL,
  GuideMenuButton,
  GuidePanel,
  GuideScrim,
  guideNavGroups,
} from "./guide-panel";
import { KhatamMark } from "./khatam-mark";
import { PatternStudio } from "./pattern-studio";
import {
  CurvilinearIsometricPlate,
  KhatamZelligeReference,
  ZelligeConstructionPlate,
} from "./reference-examples";
import { galleryPresets, palettes, profileCopy, profiles } from "./showcase-data";

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

function PresetPreview({
  presetId,
  options,
  className = "",
}: {
  presetId: PatternPresetId;
  options?: PatternOptions;
  className?: string;
}) {
  const svg = useMemo(
    () =>
      generatePreset(presetId, {
        width: 720,
        height: 500,
        maxNodes: 1400,
        accessibility: { decorative: true },
        ...options,
      }).svg,
    [options, presetId],
  );
  return (
    <div
      className={`pattern-preview ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
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
          El Messiri is the open Maghrebi display. Qandus is the licensed Fez reference we do not ship.
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
  if (hash === "home" || hash === "") return "overview";
  return sectionIds.includes(hash as (typeof sectionIds)[number]) ? hash : "overview";
}

export function App() {
  const [theme, setTheme] = useState<ThemeName>("light");
  const [direction, setDirection] = useState<Direction>("ltr");
  const [active, setActive] = useState(hashSection);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setActive(hashSection());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -66%", threshold: [0, 0.2, 0.5] },
    );
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

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
              <KhatamMark />
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

        <main id="main">
          <section id="overview" className="hero">
            <div className="hero-grid" aria-hidden="true">
              <KhatamMark size={420} className="hero-khatam" />
            </div>
            <div className="hero-content">
              <p className="issue-label">Qur’an-guided experience · al-tasmīm al-firdawsī</p>
              <h1>
                Gardens of
                <span>light.</span>
              </h1>
              <div className="hero-statement">
                <p>
                  A design system for peaceful, secure, effortless interaction. Qur’anic qualities
                  associated with Jannah guide the experience; Islamic garden architecture gives it
                  spatial language; tokens and components make it usable.
                </p>
                <p lang="ar" dir="rtl">
                  نظام واجهات معاصر يستمد من التصميم الفردوسي: الإحاطة والماء والهندسة والزخرفة المقيسة،
                  فيخدم البنية لا الزينة.
                </p>
              </div>
              <p className="hero-guardrail">
                Firdawsi does not depict, reconstruct, or simulate Jannah. It documents design
                inferences and keeps sacred text out of decoration and interface feedback.
              </p>
              <div className="hero-actions">
                <a className="text-link" href="#studio">Open Pattern Studio <Arrow /></a>
                <a className="text-link text-link--quiet" href="#principles">Read the manifesto ↓</a>
                <a className="text-link text-link--github" href={GITHUB_URL} rel="noreferrer" target="_blank">
                  Star on GitHub <Arrow />
                </a>
              </div>
            </div>
            <div className="hero-meta">
              <span>9 laws</span><span>6 stages</span><span>3 themes</span><span>2 directions</span>
            </div>
          </section>

          <section id="principles" className="section">
            <SectionHeading number="01" eyebrow="Manifesto" title="Principles before pixels">
              Peace, security, ease, nearness, flow, ordered abundance, service, companionship,
              and quiet completion become testable interface laws—not a decorative mood board.
            </SectionHeading>
            <div className="principle-list">
              {[
                ["01", "Peace over pressure", "Urgency is factual, never manufactured; feedback is humane, concise, and free from shame."],
                ["02", "Security over precarity", "Consequences are named before commitment, and actions are reversible whenever possible."],
                ["03", "Nearness over pursuit", "The likely next action and relevant context come near without making people hunt."],
                ["04", "Beauty in service", "Geometry frames hierarchy and flow. It never competes with content, language, or access."],
              ].map(([number, title, copy]) => (
                <article key={number}>
                  <span>{number}</span><h3>{title}</h3><p>{copy}</p>
                </article>
              ))}
            </div>
            <div className="interaction-cycle" aria-label="Firdawsi interaction cycle">
              {[
                ["Sukūn", "Rest", "Stable and readable"],
                ["Dunūw", "Nearness", "Action becomes clear"],
                ["Istijābah", "Response", "Input is acknowledged"],
                ["Jarāyān", "Flow", "Change preserves place"],
                ["Istiqrār", "Settling", "New state stabilizes"],
                ["Salām", "Peace", "Completion stays visible"],
              ].map(([name, meaning, behavior], index) => (
                <article key={name} data-stage={name.toLowerCase()}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{name}</h3>
                  <strong>{meaning}</strong>
                  <p>{behavior}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="foundations" className="section section--ink">
            <SectionHeading number="02" eyebrow="Foundations" title="A calibrated material palette">
              Semantic tokens keep every surface coherent across themes, directions, and products.
            </SectionHeading>
            <div className="foundation-layout">
              <div className="swatch-stack">
                {[
                  ["Primary / Jade", themes[theme]["color.primary"]],
                  ["Accent / Saffron", themes[theme]["color.accent"]],
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

          <section id="geometry" className="section">
            <SectionHeading number="03" eyebrow="Construction atlas" title="Exact geometry at working scale">
              Nine curated studies move from compass divisions and repeat cells to architectural
              lattices and botanical-geometric fields — plus reference plates from the Firdawsi tradition.
            </SectionHeading>
            <div className="geometry-grid">
              {galleryPresets.map((study, index) => (
                <article className={study.wide ? "geometry-card geometry-card--wide" : "geometry-card"} key={study.id}>
                  <PresetPreview
                    presetId={study.id}
                    options={{
                      seed: `atlas-${study.id}`,
                      unitSize: study.wide ? 104 : 78,
                      density: 0.66,
                      stroke: 1.15,
                      strandWidth: 2,
                      weaveGap: 1.35,
                      petalDepth: 0.2,
                      botanicalFill: true,
                      constructionOverlay: study.overlay ?? "none",
                      simplificationTier: "expanded",
                      crop: PRESETS[study.id].topology.mode === "focal" ? "circle" : "square",
                      palette: palettes[index % 2 === 0 ? "courtyard" : "lapis"],
                    }}
                  />
                  <div className="geometry-card__caption">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><h3>{study.label}</h3><p>{study.note}</p></div>
                    <code>{study.id}</code>
                  </div>
                </article>
              ))}
            </div>

            <div className="reference-studies">
              <header className="reference-studies__intro">
                <p className="eyebrow">Reference examples</p>
                <h3>From garden tile to construction plate</h3>
                <p>
                  Traditional sources show how color, interlace, and isometric scaffolds turn abstract
                  geometry into paradisiacal atmosphere — the same grammar Firdawsi encodes as recipes.
                </p>
              </header>
              <div className="reference-grid">
                <article className="reference-card">
                  <div className="reference-preview reference-preview--plate">
                    <ZelligeConstructionPlate />
                  </div>
                  <div className="geometry-card__caption">
                    <span>Ref</span>
                    <div>
                      <h3>Zellige construction plate</h3>
                      <p>
                        Hexagonal grid and curved strapwork above a courtyard tile field —
                        the drawn sequence before color is laid.
                      </p>
                    </div>
                    <code>zellige · plate</code>
                  </div>
                </article>
                <article className="reference-card">
                  <div className="reference-preview reference-preview--plate">
                    <KhatamZelligeReference />
                  </div>
                  <div className="geometry-card__caption">
                    <span>Ref</span>
                    <div>
                      <h3>Khatam · zellige palette</h3>
                      <p>
                        Eight-fold star and cross with interlaced straps — the Alhambra courtyard motif
                        rendered as a multi-role color study.
                      </p>
                    </div>
                    <code>khatam-8 · zellige</code>
                  </div>
                </article>
                <article className="reference-card reference-card--wide">
                  <div className="reference-preview reference-preview--plate">
                    <CurvilinearIsometricPlate />
                  </div>
                  <div className="geometry-card__caption">
                    <span>Ref</span>
                    <div>
                      <h3>Curvilinear isometric tessellation</h3>
                      <p>
                        From a single figure on a triangular grid to a tessellated field embellished with
                        stars and hexagons — a classic construction sequence.
                      </p>
                    </div>
                    <code>isometric · girih</code>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section id="regions" className="section section--sand">
            <SectionHeading number="04" eyebrow="Regional profiles" title="One engine, many cadences">
              Profiles adjust proportion and rhythm while preserving the same API and performance budget.
            </SectionHeading>
            <div className="profile-strip">
              {profiles.map((profile, index) => {
                const presetId = preferredPresetForProfile(profile);
                const options = applyRegionalProfile({
                  regionalProfile: profile,
                  seed: `profile-${profile}`,
                  stroke: 1.2,
                  width: 720,
                  height: 500,
                  maxNodes: 1400,
                  simplificationTier: "expanded",
                  accessibility: { decorative: true },
                  palette: ["currentColor", "#dda83a", "transparent", "#2f6f6d"],
                });
                return (
                  <article key={profile} data-region={profile} data-preset={presetId}>
                    <PresetPreview presetId={presetId} options={options} />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{profile.replace("-", " ")}</h3>
                    <small>{profileCopy[profile].place}</small>
                    <p>{profileCopy[profile].note}</p>
                    <code data-preset={presetId}>{presetId}</code>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="mechanics" className="section">
            <SectionHeading number="05" eyebrow="Signature mechanics" title="Six non-decorative identities">
              Ornament is optional. These six mechanics fire in every component, so the system
              stays recognizably Firdawsi with decoration turned off.
            </SectionHeading>
            <MechanicsSection />
          </section>

          <section id="tokens" className="section section--ink">
            <SectionHeading number="06" eyebrow="Tokens" title="Sebka scale, carved planes, Alberca springs">
              Type roles, surface tiers, springs, and regional overlays are authorable — not hardcoded CSS.
            </SectionHeading>
            <TokensSection swatches={<TokensSwatches />} />
          </section>

          <section id="components" className="section">
            <SectionHeading number="07" eyebrow="Component gallery" title="Components">
              Accessible React primitives carry the grammar — arch corners, carved tiers, strapwork
              focus — without changing expected behavior.
            </SectionHeading>
            <ComponentAnatomy />
            <ComponentMatrix />
          </section>

          <section id="courtyard" className="section section--courtyard">
            <SectionHeading number="08" eyebrow="Use" title="Courtyard day desk">
              A real local-first workflow: prayer context, quick capture, persistent intentions,
              reversible removal, and peaceful completion—without an account.
            </SectionHeading>
            <CourtyardSection />
          </section>

          <section id="motion" className="section section--motion">
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

          <section id="accessibility" className="section">
            <SectionHeading number="10" eyebrow="Accessibility" title="Access is part of the form">
              Contrast, focus, direction, language, and motion preferences are design inputs—not post-production checks.
            </SectionHeading>
            <div className="access-layout">
              <div className="access-score">
                <div>
                  <span>AA</span>
                  <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" /><circle className="score-ring" cx="60" cy="60" r="52" /></svg>
                </div>
                <p>Core semantic pairs maintain WCAG AA contrast across all three themes.</p>
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

          <section id="studio" className="section section--studio">
            <SectionHeading number="11" eyebrow="Preset-first workshop" title="Pattern Studio">
              Begin with a compass rosette — real construction, not a decorative star — then tune
              only the controls its family supports, compare responsive tiers, and export its recipe.
            </SectionHeading>
            <PatternStudio />
          </section>

          <footer className="footer">
            <div><KhatamMark size={42} /><strong>Firdawsi</strong></div>
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
