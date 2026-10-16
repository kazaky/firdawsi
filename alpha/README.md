# Firdawsi preview kit

This is an experimental distribution candidate for Week 6 evaluation. It is not
a stable release or an assertion of completed accessibility, Arabic, historical
or religious review. The constituent packages keep their existing versions;
`manifest.json` identifies the exact source commit and each tarball's SHA-256.
No npm registry publication is implied. The generated starter pins Firdawsi
transitive dependencies to these same local tarballs using pnpm overrides.

## Get the kit

From a successful main-branch [CI run](https://github.com/kazaky/firdawsi/actions?query=branch%3Amain),
download and extract `firdawsi-alpha-preview`. A GitHub sign-in may be needed for
workflow artifacts. Artifacts expire according to the repository retention policy.
For a reproducible local copy, check out the source commit and run:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm alpha:verify
```

The generated kit is in `dist/alpha-preview`. `alpha:pack` only packages the
existing build; it does not assert that its consumer has been verified.

## Run the separate starter

Use Node.js 22.12+ and pnpm 10.15.0. The starter is outside the Firdawsi workspace
and installs the four included tarballs, not workspace links or assumed registry
packages. Keep `starter/` and `packages/` together after extraction.

```sh
# From the extracted kit directory:
shasum -a 256 -c SHA256SUMS
cd starter
pnpm install --frozen-lockfile --ignore-scripts
pnpm dev
```

Verified kits include the tested consumer lockfile. The server prints its URL. `pnpm build` checks types and builds a production app.
Installation needs network access for React, Vite and their public dependencies;
Firdawsi packages come from this kit. The starter supports independent language
and direction, light/dark, field repair and truthful result feedback. It holds
input only in memory and has no persistence, authentication or sync.

Load tokens before component CSS, use `ThemeProvider` at the application boundary,
and supply `language` separately from `direction`. The universal profile is the
default for this example. Named regional profiles remain optional explorations.
Fonts are not bundled: self-host the families named by the tokens, with licensed
files, or accept the system fallbacks while evaluating the kit.

## Evidence and limitations

`verification.json` exists only after the isolated install, starter type/build
and public-export/server-render checks succeed. CI also runs the workspace and
browser suites. These automated checks do not establish full WCAG conformance or
replace real-device, screen-reader, Arabic optical, user or scholarly review.

See `RELEASE-NOTES.md` for scope and `spec/16-validation-and-release-gates.md` in
the source repository for the review protocol. Do not put private user data into
an evaluation report. Report the source commit, environment, reproducible steps,
expected/actual result, language/direction/theme and impact on the task.

## Religious connections

[Al-Isra 17:36](https://quran.com/al-isra/36) informs verification before claims;
[Al-Ahzab 33:70](https://quran.com/al-ahzab/70) informs truthful readiness and data
feedback; [Ar-Rum 30:22](https://quran.com/ar-rum/22) informs respect for language;
[An-Nisa 4:58](https://quran.com/an-nisa/58) informs care for entrusted data.
These are design interpretations, not scriptural software requirements. Sacred
text is never a background texture or state animation.
