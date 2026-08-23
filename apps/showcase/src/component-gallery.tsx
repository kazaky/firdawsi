import { archCornerPath, archForState } from "@firdawsi/shape";
import {
  Accordion,
  AlertDialog,
  AppHeader,
  Atmosphere,
  Badge,
  Banner,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  Frame,
  Heading,
  IconButton,
  IslamicCorner,
  Menu,
  Navigation,
  PatternSurface,
  PrayerPlaque,
  Progress,
  Radio,
  SearchField,
  Select,
  Sheet,
  Skeleton,
  Slider,
  Stack,
  Stepper,
  Surface,
  Switch,
  Tabs,
  Text,
  TextField,
  Textarea,
  Tooltip,
} from "@firdawsi/web";
import { useMemo, useState, type ReactNode } from "react";

import { granadaPrayerSchedule } from "./granada-prayer";
import { KhatamMark } from "./khatam-mark";

function Code({ children }: { children: string }) {
  return <pre className="docs-code"><code>{children}</code></pre>;
}

function NavGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 7h16M4 12h10M4 17h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const snippet = `import { Button, Card, ThemeProvider } from "@firdawsi/web";

<ThemeProvider>
  <Button>Continue</Button>
  <Card title="Courtyard">Quiet plane</Card>
</ThemeProvider>`;

export function ComponentAnatomy() {
  const [open, setOpen] = useState(false);
  const [slider, setSlider] = useState(40);

  return (
    <div className="component-anatomy docs-page">
      <Breadcrumbs items={[{ href: "#overview", label: "Overview" }, { label: "Components" }]} />
      <Text>No ornament props. Identity is the grammar: proportion, corners, tiers, focus, motion, type.</Text>

      <section className="docs-section" id="button">
        <Heading level={2} role="title-lg">Button</Heading>
        <Text role="body-sm">States: enabled, hover, pressed, focus, disabled, loading. Anatomy: container, label, status.</Text>
        <Stack direction="row" gap="3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
        </Stack>
        <Code>{snippet}</Code>
        <details>
          <summary>Accessibility</summary>
          <Text role="body-sm">Native button. Loading sets aria-busy and disabled. Focus uses the strapwork indicator, which remains visible in forced-colors.</Text>
        </details>
      </section>

      <section className="docs-section" id="field">
        <Heading level={2} role="title-lg">Field</Heading>
        <Stack gap="4">
          <TextField label="Name" hint="As written on the door" />
          <Textarea label="Note" rows={3} />
          <Checkbox label="Remember this courtyard" />
          <Slider label="Density" value={slider} onValueChange={setSlider} />
        </Stack>
      </section>

      <section className="docs-section" id="surface">
        <Heading level={2} role="title-lg">Surface and card</Heading>
        <div className="docs-grid">
          <Surface tier={1}>Tier 1</Surface>
          <Surface tier={2}>Tier 2</Surface>
          <Card title="Card" footer={<Badge>quiet</Badge>}>Carved plane, not a drop shadow.</Card>
        </div>
        <Stack direction="row" gap="2">
          <Chip selected>Selected</Chip>
          <Chip>Chip</Chip>
          <Skeleton />
        </Stack>
      </section>

      <section className="docs-section" id="overlay">
        <Heading level={2} role="title-lg">Alert dialog</Heading>
        <Button variant="secondary" onClick={() => setOpen(true)}>Open alert</Button>
        <AlertDialog open={open} onOpenChange={setOpen} title="Leave the courtyard?">
          Focus returns to the trigger on close.
        </AlertDialog>
        <Accordion items={[
          { id: "a", title: "When may ornament appear?", content: "Only in spec-approved ornament zones — never inside buttons, fields, or tables." },
          { id: "b", title: "What is the default region?", content: "andalusi-maghrebi. Other profiles are deviations, not peers." },
        ]} />
      </section>
    </div>
  );
}

export function ComponentMatrix() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="component-stage">
      <div className="component-panel component-panel--wide">
        <div className="panel-label"><span>01</span>App chrome</div>
        <AppHeader
          brand={<KhatamMark size={28} />}
          title="Firdawsi"
          actions={
            <>
              <Button variant="secondary" size="sm">Share</Button>
              <IconButton label="More actions" variant="quiet" size="sm">⋯</IconButton>
            </>
          }
          framed
        >
          <Navigation
            label="Product sections"
            items={[
              { label: "Overview", href: "#overview", current: true, icon: <NavGlyph /> },
              { label: "Library", href: "#geometry", badge: 3, icon: <NavGlyph /> },
              { label: "Studio", href: "#studio", icon: <NavGlyph /> },
            ]}
          />
        </AppHeader>
      </div>

      <div className="component-panel">
        <div className="panel-label"><span>02</span>Buttons</div>
        <div className="button-row">
          {(["primary", "secondary", "quiet", "danger"] as const).map((variant) => (
            <Button key={variant} variant={variant}>{variant}</Button>
          ))}
        </div>
        <div className="button-row">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Button key={size} size={size} variant="secondary">{size}</Button>
          ))}
          <IconButton label="Bookmark" variant="secondary">★</IconButton>
        </div>
        <div className="button-row">
          <Button variant="secondary">Arch rest</Button>
          <Button variant="secondary" loading>Arch busy</Button>
          <Button variant="secondary" disabled>Arch disabled</Button>
        </div>
      </div>

      <div className="component-panel">
        <div className="panel-label"><span>03</span>Inputs & choices</div>
        <div className="field-row">
          <TextField label="Title" placeholder="Thursday review" />
          <SearchField label="Search the collection" placeholder="Type a keyword…" />
          <Select label="View" options={[{ label: "All items", value: "all" }, { label: "Recent", value: "recent" }]} />
        </div>
        <div className="choice-row">
          <Checkbox label="Include archived" />
          <Switch label="Live updates" defaultChecked />
          <Radio label="Weekly digest" name="frequency" defaultChecked />
          <Radio label="Monthly digest" name="frequency" />
        </div>
        <Menu
          label="Actions"
          items={[
            { label: "Duplicate", onSelect: () => undefined },
            { label: "Archive", onSelect: () => undefined },
            { label: "Delete", onSelect: () => undefined, disabled: true },
          ]}
        />
      </div>

      <div className="component-panel component-panel--wide">
        <div className="panel-label"><span>04</span>Cards · carved tiers</div>
        <div className="card-matrix">
          <Card title="Tier 1 · quiet" tier={1}>Baseline carved plane without ornament.</Card>
          <Card title="Tier 2 · recessed" tier={2}>A deeper field for grouped content.</Card>
          <Card title="Tier 3 · inset" tier={3}>Stronger cut for emphasis, still shadowless.</Card>
          <Card title="Tier 4 · deepest" tier={4}>The lowest plane before an overlay leaves the page.</Card>
        </div>
      </div>

      <div className="component-panel component-panel--wide">
        <div className="panel-label"><span>05</span>Atmosphere</div>
        <div className="atmosphere-matrix">
          <Atmosphere tone="courtyard-wash" pattern>
            <p className="eyebrow">courtyard-wash</p>
            <h3>Warm courtyard field</h3>
          </Atmosphere>
          <Atmosphere tone="lapis-veil">
            <p className="eyebrow">lapis-veil</p>
            <h3>Cool veil gradient</h3>
          </Atmosphere>
          <Atmosphere tone="jade-depth" pattern presetId="jali-8-screen">
            <p className="eyebrow">jade-depth</p>
            <h3>Deep jade with lattice</h3>
          </Atmosphere>
        </div>
      </div>

      <div className="component-panel component-panel--pattern">
        <div className="panel-label"><span>06</span>Frame & corner</div>
        <PatternSurface kind="screen" intensity="quiet" options={{ symmetry: 8 }}>
          <Frame options={{ symmetry: 8, density: 0.25 }}>
            <p className="eyebrow">Bilingual card</p>
            <h3>Thursday review</h3>
            <p>Five tasks are ready for a final pass.</p>
            <div className="bilingual-line">
              <span>Open workspace</span>
              <span lang="ar" dir="rtl">فتح مساحة العمل</span>
            </div>
          </Frame>
        </PatternSurface>
        <IslamicCorner options={{ density: 0.2 }}>
          <p className="eyebrow">IslamicCorner</p>
          <p>Mirrored quarter fragments for inset moments.</p>
        </IslamicCorner>
      </div>

      <div className="component-panel component-panel--wide">
        <div className="panel-label"><span>07</span>Overlays & progress</div>
        <div className="button-row">
          <Button type="button" onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Button type="button" variant="secondary" onClick={() => setSheetOpen(true)}>Open sheet</Button>
          <Tooltip content="Measured clarity"><Button variant="quiet">Hover tip</Button></Tooltip>
        </div>
        <Tabs
          label="Project details"
          items={[
            { id: "overview", label: "Overview", content: <Banner title="Everything is in rhythm">The workspace is up to date and ready to share.</Banner> },
            { id: "progress", label: "Progress", content: <Progress label="Editorial review" value={72} showValue /> },
            { id: "steps", label: "Steps", content: <Stepper current={1} steps={[{ label: "Draft" }, { label: "Review" }, { label: "Publish" }]} /> },
          ]}
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Confirm publish" description="This will make the collection public." footer={<Button onClick={() => setDialogOpen(false)}>Done</Button>}>
          Review provenance tags before publishing.
        </Dialog>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="Filters" footer={<Button variant="secondary" onClick={() => setSheetOpen(false)}>Close</Button>}>
          Narrow the gallery by symmetry, region, or medium.
        </Sheet>
      </div>

      <CourtyardPrayerDemo />
    </div>
  );
}

function CourtyardPrayerDemo() {
  const schedule = useMemo(() => granadaPrayerSchedule(), []);

  return (
    <div className="component-panel component-panel--wide" id="prayer-plaque">
      <div className="panel-label"><span>08</span>Courtyard timetable</div>
      <p className="courtyard-plaque__note">
        A schedule, not scripture: next prayer for Granada, framed by quiet geometry.
      </p>
      <PatternSurface
        className="courtyard-plaque"
        presetId="zellige-star-cross"
        intensity="quiet"
        options={{ density: 0.22, simplificationTier: "compact" }}
      >
        <PrayerPlaque {...schedule} />
      </PatternSurface>
    </div>
  );
}

export function MechanicsSection() {
  const rest = archForState(220, 72, "balanced", "rest");
  const pressed = archForState(220, 72, "balanced", "pressed");
  return (
    <div className="docs-page">
      <p className="docs-kicker">v0.2 grammar</p>
      <Heading level={2} role="headline-lg">Six signature mechanics</Heading>
      <Text>Each mechanic is functional. Disable ornament and the system is still recognizably Firdawsi.</Text>
      <div className="docs-grid">
        <Card title="1 · Sebka scale">Type, radii, and control heights derive from 2^(n/4) around a 16px anchor. Adjacent micro-steps are the fourth root of two; every second step is √2.</Card>
        <Card title="2 · Arch corners" tier={2}>
          Construction ratios, not a horseshoe. Rest vs pressed:
          <svg className="docs-arch" viewBox="0 0 220 72" aria-hidden="true">
            <path d={archCornerPath(rest)} fill="none" stroke="currentColor" />
            <path d={archCornerPath(pressed)} fill="none" stroke="currentColor" opacity="0.45" />
          </svg>
        </Card>
        <Card title="3 · Tiered surface" tier={3}>Surfaces read as carved planes. Shadows stay on overlays that leave the page.</Card>
        <Card title="4 · Strapwork focus">Tab through any control. The indicator is a two-stroke strap: gap plus core.</Card>
        <Card title="5 · Alberca motion">A courtyard pool settling: fast rise, long low-amplitude settle. Distinct from Material springs.</Card>
        <Card title="6 · Dual-optical type">
          <Text role="body-md">Latin body at 16px / 1.6</Text>
          <Text role="body-md" lang="ar">عربي بنفس الدور البصري لكن بحجم وارتفاع سطر مستقلين</Text>
        </Card>
      </div>
    </div>
  );
}

export function TokensSection({ swatches }: { swatches: ReactNode }) {
  return (
    <div className="docs-page">
      <p className="docs-kicker">Authorable source</p>
      <Heading level={2} role="headline-lg">Token reference</Heading>
      <Text>Canonical source is <code>packages/tokens/src/tokens.json</code>. Roles below are live CSS variables.</Text>
      {swatches}
    </div>
  );
}
