# Contributing to Firdawsi

Thank you for helping improve Firdawsi. This repository is a pnpm workspace with
specifications, tokens, geometry, React components, and the public showcase.

## Setup

Requires Node.js 20+ and [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/kazaky/firdawsi.git
cd firdawsi
pnpm install
pnpm dev
```

The development server prints its local URL (typically the showcase app).

## Verification

```bash
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## Deploy the showcase

The live site is hosted on Cloudflare Pages at `firdawsi.pages.dev`.

```bash
npx wrangler login
pnpm -r build
pnpm --filter @firdawsi/showcase run deploy
```

### Custom domain (`firdawsi.org`)

If the apex domain does not resolve, add DNS records in the Cloudflare zone for
`firdawsi.org`:

| Type  | Name | Content              | Proxy |
|-------|------|----------------------|-------|
| CNAME | `@`  | `firdawsi.pages.dev` | On    |
| CNAME | `www`| `firdawsi.pages.dev` | On    |

Attach the domain in **Workers & Pages → firdawsi → Custom domains** after DNS
propagates.

## Where to start

- Design decisions: [`spec/README.md`](spec/README.md)
- Tokens: [`packages/tokens/src/tokens.json`](packages/tokens/src/tokens.json)
- Geometry engine: [`packages/geometry/`](packages/geometry/)
- React components: [`packages/web/`](packages/web/)
- Showcase UI: [`apps/showcase/`](apps/showcase/)

Regenerate token CSS after editing `tokens.json`:

```bash
pnpm --filter @firdawsi/tokens build
```

## Pull requests

Keep changes focused. Match existing naming, token usage, and bilingual/RTL
conventions. Do not add raster artwork or decorative sacred text.
