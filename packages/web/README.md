# @firdawsi/web

An accessible React 19 component library built on `@firdawsi/tokens` and
`@firdawsi/geometry`. Components use native HTML semantics, inherit
document direction, and keep geometry restrained to optional surfaces and
frames.

## Install

```sh
pnpm add @firdawsi/web @firdawsi/tokens @firdawsi/geometry
```

Import the stylesheet once near the application root:

```tsx
import "@firdawsi/web/styles.css";
import { Button, Card, TextField } from "@firdawsi/web";

export function ProfileForm() {
  return (
    <Card title="Profile">
      <TextField label="Display name" name="name" />
      <Button type="submit">Save changes</Button>
    </Card>
  );
}
```

Set `data-theme="light"`, `data-theme="dark"`, or
`data-theme="high-contrast"` on any ancestor. Direction is inherited from the
standard `dir` attribute; no component-level direction prop is needed.

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
