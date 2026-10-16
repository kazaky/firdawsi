import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist/alpha-preview");
const pnpmPath = process.env.npm_execpath;
assert(pnpmPath, "Run through pnpm alpha:pack or pnpm alpha:verify.");
const verify = process.argv.includes("--verify");
function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${command} ${args.join(" ")} failed\n${result.stdout}\n${result.stderr}`,
    );
  return result.stdout.trim();
}
const pnpm = (args, cwd) => run(process.execPath, [pnpmPath, ...args], cwd);

// Output is always a generated, ignored directory; never remove a user path.
rmSync(output, { recursive: true, force: true });
mkdirSync(join(output, "packages"), { recursive: true });
cpSync(join(root, "alpha/starter"), join(output, "starter"), {
  recursive: true,
});
cpSync(join(root, "alpha/README.md"), join(output, "README.md"));
cpSync(join(root, "alpha/RELEASE-NOTES.md"), join(output, "RELEASE-NOTES.md"));
const consumerPath = join(output, "starter/package.json");
const consumer = JSON.parse(readFileSync(consumerPath, "utf8"));
const packages = [];
for (const folder of ["tokens", "geometry", "shape", "web"]) {
  const source = join(root, "packages", folder);
  const pkg = JSON.parse(readFileSync(join(source, "package.json"), "utf8"));
  assert(
    pkg.exports && pkg.files,
    `${pkg.name} must define its public package surface`,
  );
  const filename = `${pkg.name.replace("@", "").replace("/", "-")}-${pkg.version}.tgz`;
  const path = join(output, "packages", filename);
  pnpm(["pack", "--out", path], source);
  const packed = JSON.parse(run("tar", ["-xOf", path, "package/package.json"]));
  for (const [name, version] of Object.entries(packed.dependencies ?? {})) {
    assert(
      !version.startsWith("workspace:"),
      `${pkg.name}: unresolved workspace dependency ${name}`,
    );
  }
  packages.push({
    name: pkg.name,
    version: pkg.version,
    file: `packages/${filename}`,
    sha256: createHash("sha256").update(readFileSync(path)).digest("hex"),
  });
  consumer.dependencies[pkg.name] = `file:../packages/${filename}`;
  console.log(`Packed ${pkg.name}@${pkg.version}`);
}
consumer.pnpm = {
  overrides: Object.fromEntries(
    packages.map((pkg) => [pkg.name, consumer.dependencies[pkg.name]]),
  ),
};
writeFileSync(consumerPath, `${JSON.stringify(consumer, null, 2)}\n`);
const manifest = {
  channel: "preview",
  sourceCommit: run("git", ["rev-parse", "HEAD"]),
  sourceDirty: Boolean(run("git", ["status", "--porcelain"])),
  packages,
  manualReviews: "pending",
  registryPublication: false,
};
writeFileSync(
  join(output, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
writeFileSync(
  join(output, "SHA256SUMS"),
  packages.map((pkg) => `${pkg.sha256}  ${pkg.file}`).join("\n") + "\n",
);

if (verify) {
  const temporary = mkdtempSync(join(tmpdir(), "firdawsi-consumer-"));
  try {
    cpSync(output, temporary, { recursive: true });
    const app = join(temporary, "starter");
    pnpm(["install", "--ignore-scripts", "--no-frozen-lockfile"], app);
    const consumerLock = readFileSync(join(app, "pnpm-lock.yaml"), "utf8");
    assert(
      !consumerLock.includes(temporary),
      "Consumer lockfile must be relocatable",
    );
    cpSync(join(app, "pnpm-lock.yaml"), join(output, "starter/pnpm-lock.yaml"));
    pnpm(["install", "--frozen-lockfile", "--ignore-scripts"], app);
    pnpm(["build"], app);
    writeFileSync(
      join(app, "smoke.mjs"),
      `
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, ThemeProvider } from "@firdawsi/web";
import { themes, tokenVar } from "@firdawsi/tokens";
import { generatePattern } from "@firdawsi/geometry";
import * as construction from "@firdawsi/geometry/construction";
import { archCornerPath, archForState } from "@firdawsi/shape";
assert(themes.dark["color.surface"]);
assert.equal(tokenVar("space.4"), "var(--firdawsi-space-4)");
assert(generatePattern("rosette", { seed: "alpha", width: 120, height: 120 }).svg.includes("<svg"));
assert(Object.keys(construction).length > 0);
assert(archCornerPath(archForState(120, 48)).length > 0);
const html = renderToStaticMarkup(createElement(ThemeProvider, { language: "ar", direction: "rtl", applyToDocument: false }, createElement(Button, null, "ابدأ")));
assert(html.includes('lang="ar"') && html.includes('dir="rtl"') && html.includes("<button"));
for (const specifier of ["@firdawsi/tokens/css", "@firdawsi/web/styles.css"]) {
  assert(readFileSync(new URL(import.meta.resolve(specifier)), "utf8").includes("--firdawsi-"));
}
console.log("Packed runtime exports, CSS, geometry and Arabic React rendering passed.");
`,
    );
    console.log(run(process.execPath, [join(app, "smoke.mjs")], app));
    writeFileSync(
      join(output, "verification.json"),
      JSON.stringify(
        {
          sourceCommit: manifest.sourceCommit,
          sourceDirty: manifest.sourceDirty,
          checks: [
            "isolated-tarball-install",
            "starter-typecheck-and-production-build",
            "public-exports-and-server-render",
          ],
          result: "passed",
          node: process.version,
        },
        null,
        2,
      ) + "\n",
    );
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}
console.log(
  `Preview kit: ${output}${verify ? " (consumer verified)" : " (not consumer verified)"}`,
);
