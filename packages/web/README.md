# @firdawsi/web

An accessible React 19 component library built on `@firdawsi/tokens` and
`@firdawsi/geometry`. Components use native HTML semantics, inherit
document direction, and keep geometry restrained to optional surfaces and
frames.

## Start from the workspace

The verified setup path is the source repository. Do not assume the workspace
package names below have been published to a public registry.

```sh
git clone https://github.com/kazaky/firdawsi.git
cd firdawsi
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

Use Node.js 20+ and pnpm 10.15.0. Within a configured workspace app, import both
stylesheets near the application root:

```tsx
import "@firdawsi/tokens/css";
import "@firdawsi/web/styles.css";
import { Button, TextField, ThemeProvider } from "@firdawsi/web";

export function FirstFlow() {
  return (
    <ThemeProvider region="universal" direction="ltr" applyToDocument={false}>
      <section lang="en">
        <TextField label="Task title" name="title" />
        <Button type="button">Continue</Button>
      </section>
    </ThemeProvider>
  );
}
```

This is a component composition example, without a persistence implementation.
The showcase getting-started guide includes a complete local-validation example
and authored Arabic copy. To use packages in a separate application, configure
its workspace dependencies, load suitable Arabic and Latin fonts, and verify
its bundler integration before release.

Use `theme="light"`, `theme="dark"`, or `theme="highContrast"` on the provider.
`applyToDocument={false}` keeps theme and direction local. Language belongs on
content through `lang`; use explicit content direction for mixed scripts.

## Components

- Actions: `Button`, `IconButton`, `Menu`
- Fields: `TextField`, `SearchField`, `Select`, `Checkbox`, `Radio`, `Switch`
- Containers: `Surface`, `Card`, `PatternSurface`, `IslamicCorner`, `Frame`, `PrayerPlaque`
- Navigation: `Tabs`, `Navigation`, `Stepper`
- Overlays: `Dialog`, `Sheet`, `Tooltip`, `Popover`, `Toast`
- Feedback: `Banner`, `Progress`, `EmptyState`
- Content: `List`, `Table`, `OrnamentalDivider`

Related controls share public types, but remain individually importable and
tree-shakeable.

## Pattern-use guidance

Start without ornament. Quiet accents, supporting section bands, and expressive
cover moments are editorial usage tiers, not extra API values. Keep long reading,
fields, and tables on a separate clear plane. Sacred text is never texture. The
showcase pattern-guidance specimen demonstrates each tier and removes ornament
in high contrast.

## Curated pattern surfaces

`PatternSurface` defaults to the restrained `jali-8-screen` preset at quiet
density. Select another curated geometry preset with `presetId`:

```tsx
import { Card, PatternSurface } from "@firdawsi/web";

export function WelcomePanel() {
  return (
    <PatternSurface
      presetId="floral-geometric-field"
      intensity="quiet"
      options={{ symmetry: 12 }}
    >
      <Card title="Welcome">Your content stays above the decorative geometry.</Card>
    </PatternSurface>
  );
}
```

The existing `kind` and `options` props remain supported. When both `presetId`
and `kind` are provided, `presetId` selects the geometry while `options`
continues to control its dimensions, palette, density, and other settings.
Pattern geometry is always decorative and hidden from assistive technology.

## Accessibility notes

- Icon-only controls require a text `label`.
- `TextField` and `Select` wire labels and descriptions automatically.
- `Menu` and `Tabs` implement arrow-key navigation and Escape/Home/End where
  applicable.
- `Dialog` and `Sheet` accept `closeLabel` for a localised close action (default `Close`).
- `Dialog` and `Sheet` use the native modal dialog, including its focus trap
  and focus restoration.
- Decorative geometry is generated with `accessibility.decorative: true` and
  its host is hidden from assistive technology.
- Motion follows the token package's reduced-motion values; CSS adds an
  explicit reduced-motion fallback.
- `Table` keeps native table markup and puts horizontal overflow on a focusable
  wrapper.

The generated motifs are design-system geometry, not historical
reconstructions. The package includes no external fonts, raster assets, sacred
text, or copied historical motifs.

## Development

```sh
pnpm build
pnpm typecheck
pnpm test
```
