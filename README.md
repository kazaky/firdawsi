# Firdawsi

**Qur’an-guided experience** · *al-tasmīm al-firdawsī* · a modern Islamic design system

Firdawsi translates Qur’anic qualities associated with Jannah—peace, security, ease,
nearness, abundance, beauty, and harmonious companionship—through the spatial grammar
of Islamic garden architecture into contemporary digital interfaces. It does not claim
to depict, reconstruct, or simulate Jannah. Geometry is structure, rhythm, and proportion,
not decorative wallpaper.

The project contains a portable specification and token model, a deterministic
code-only geometry engine, an accessible React reference library, and an
interactive web showcase. It ships no photographs or raster artwork.

**Live site:** [firdawsi.org](https://firdawsi.org) · **GitHub:** [github.com/kazaky/firdawsi](https://github.com/kazaky/firdawsi)

## Principles

- Modern first: clear hierarchy, restrained ornament, responsive simplification.
- Platform neutral: canonical decisions live in specifications, tokens, and
  serializable recipes; React is only the reference implementation.
- Culturally bounded: a universal core and named regional profiles are kept
  distinct and require expert review before claims of historical fidelity.
- Bidirectional by default: Arabic and Latin typography, RTL/LTR behavior, and
  logical layout properties are part of every component contract.
- Respectful: Qur'anic text, the names of God, devotional formulas, and sacred
  calligraphy are never used as decoration or generated texture.
- Code only: patterns are deterministic SVG/CSS/JSON outputs generated from
  mathematical recipes.

## Workspace

```text
spec/                 Design philosophy, safeguards, profiles, and contracts
packages/tokens/      DTCG-style source tokens and generated CSS/JSON
packages/geometry/    Deterministic SVG/CSS/JSON pattern engine
packages/web/         Accessible React reference components
apps/showcase/        Bilingual gallery and interactive Pattern Studio
```

## Run the showcase

Requires Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

The development server prints its local URL. Production verification:

```bash
pnpm test
pnpm build
pnpm typecheck
pnpm test:e2e
```

## Packages

### Tokens

```ts
import "@firdawsi/tokens/css";
import { tokenVar } from "@firdawsi/tokens";
```

Canonical tokens live in `packages/tokens/src/tokens.json`. Generated CSS
supports light, dark, high-contrast, RTL/LTR, and reduced-motion contexts.

### Geometry

```ts
import { generatePattern, toCssPattern } from "@firdawsi/geometry";

const result = generatePattern("rosette", {
  seed: "courtyard-27",
  symmetry: 8,
  density: 0.55,
  regionalProfile: "universal",
  accessibility: { title: "Eight-fold rosette" },
});

const css = toCssPattern(result, ".pattern");
```

The engine supports construction grids, stars, rosettes, girih-inspired
strapwork, zellige-style arrangements, screen patterns, arches, corners,
frames, and controlled vegetal paths. “Inspired” generators are contemporary
systems, not claims of historical reconstruction.

### Web components

```tsx
import "@firdawsi/tokens/css";
import "@firdawsi/web/styles.css";
import { Button, Card, PatternSurface } from "@firdawsi/web";
```

Components inherit `dir`, use logical CSS properties, respect reduced motion,
and rely on native semantics wherever possible.

## Specification and provenance

Start with [`spec/README.md`](spec/README.md). Historical references and their
limits are recorded in [`spec/10-sources-and-provenance.md`](spec/10-sources-and-provenance.md).
The system draws on museum and scholarly material about symmetry, repetition,
infinite extension, polygon grids, girih, material traditions, and regional
variation. Pinterest boards supplied as visual direction are inspiration, not
sources for copying individual works.

This foundation is a starting point. Production regional profiles should be
reviewed by historians, craftspeople, Arabic-language specialists, and relevant
communities.

## Deploy and DNS

The showcase deploys to Cloudflare Pages:

```bash
npx wrangler login
pnpm -r build
pnpm --filter @firdawsi/showcase run deploy
```

**Custom domain:** attach `firdawsi.org` in Pages → Custom domains. If the apex
does not resolve, add proxied CNAME records in Cloudflare DNS for `@` and `www`
pointing to `firdawsi.pages.dev`.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full contributor workflow.
