# `@firdawsi/tokens`

Platform-neutral design tokens with a DTCG-style canonical source.

## Use

Load the generated CSS once:

```ts
import "@firdawsi/tokens/css";
```

Select a semantic theme on an application root:

```html
<html data-theme="dark" dir="rtl">
```

Use CSS custom properties:

```css
.card {
  color: var(--firdawsi-color-text);
  background: var(--firdawsi-color-surface);
  padding-inline: var(--firdawsi-space-4);
  border-radius: var(--firdawsi-radius-lg);
}
```

Use resolved values or typed helpers in TypeScript:

```ts
import { themes, tokens, tokenVar } from "@firdawsi/tokens";

const gap = tokens["space.4"];
const darkText = themes.dark["color.text"];
const surface = tokenVar("color.surface");
```

The canonical DTCG-style data is exported as `@firdawsi/tokens/tokens.json`.
Flattened, alias-resolved data is exported as `@firdawsi/tokens/resolved.json`.

## Authoring

Edit only `src/tokens.json`, then run `pnpm build`. The generator checks aliases
and updates `generated/tokens.css`, `generated/tokens.json`, and
`src/generated.ts`. Prefer CSS logical properties (`padding-inline`,
`border-inline-start`, `inset-block`) so components work in both LTR and RTL.
Only directional icons should use the generated directional transform token.
