import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

test("showcase presents every foundation section", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Firdawsi/i);
  await expect(page.getByRole("heading", { name: /Gardens of/i })).toBeVisible();
  await expect(page.locator("#overview")).toContainText("A design system for peaceful, secure, effortless interaction");
  await expect(page.locator("#overview")).toContainText("does not depict, reconstruct, or simulate Jannah");
  await expect(page.locator(".interaction-cycle article")).toHaveCount(6);
  await expect(page.locator(".interaction-cycle")).toContainText("Sukūn");
  await expect(page.locator(".interaction-cycle")).toContainText("Salām");

  await expect(page.getByRole("link", { name: /View on GitHub/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Star on GitHub/i })).toBeVisible();

  for (const id of [
    "overview",
    "principles",
    "foundations",
    "geometry",
    "regions",
    "mechanics",
    "tokens",
    "components",
    "courtyard",
    "motion",
    "accessibility",
    "studio",
  ]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  await expect(page.locator("#geometry img")).toHaveCount(0);
  await expect(page.locator("#geometry .geometry-card")).toHaveCount(9);
  await expect(page.locator("#geometry .reference-card")).toHaveCount(3);
  await expect(page.locator("#geometry svg[data-plate='zellige']")).toBeVisible();
  await expect(page.locator("#geometry svg[data-plate='khatam-zellige']")).toBeVisible();
  await expect(page.locator("#geometry svg[data-plate='khatam-zellige'] [data-construction-role]").first()).toBeAttached();
  await expect(page.locator("#geometry")).toContainText("Zellige construction plate");
  await expect(page.locator("#geometry")).toContainText("Khatam · zellige palette");
  await expect(page.locator("#geometry")).toContainText("Curvilinear isometric tessellation");
  await expect(page.locator("#geometry")).toContainText("Khatam · 8");
  await expect(page.locator("#geometry")).toContainText("Floral-geometric field");
  await expect(page.locator("#studio .studio-canvas svg")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("documentation site exposes mechanics, tokens, and components", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("navigation", { name: "Showcase sections" }).getByRole("link", { name: "Mechanics" }).click();
  await expect(page.getByRole("heading", { name: /signature mechanics/i })).toBeVisible();
  await expect(page.locator("#mechanics")).toContainText("Sebka");
  await expect(page.locator("#mechanics")).toContainText("Alberca");

  await page.getByRole("navigation", { name: "Showcase sections" }).getByRole("link", { name: "Tokens" }).click();
  await expect(page.getByRole("heading", { name: /Token reference/i })).toBeVisible();
  await expect(page.locator("#tokens")).toContainText("surface-tier-1");
  await expect(page.locator("#tokens [data-type-specimen]")).toContainText("El Messiri");
  await expect(page.locator("#tokens [data-type-specimen]")).toContainText("حدائق النور");

  await page.getByRole("navigation", { name: "Showcase sections" }).getByRole("link", { name: "Components" }).click();
  const primary = page.locator("#button").getByRole("button", { name: "Primary", exact: true });
  await expect(primary).toBeVisible();
  await expect(primary).toHaveAttribute("data-shape", "arch");
  await expect(page.locator(".firdawsi-card").first()).toBeVisible();
  await expect(page.locator("#components")).toContainText("Open courtyard timetable");
});

test("regional profiles render visibly distinct presets", async ({ page }) => {
  await page.goto("/#regions");
  const maghrebi = page.locator('#regions article[data-region="maghrebi"]');
  const ottoman = page.locator('#regions article[data-region="ottoman"]');
  await expect(maghrebi).toHaveAttribute("data-preset", "zellige-star-cross");
  await expect(ottoman).toHaveAttribute("data-preset", "rumi-medallion-6");
  const maghrebiSvg = await maghrebi.locator("svg").evaluate((node) => node.outerHTML);
  const ottomanSvg = await ottoman.locator("svg").evaluate((node) => node.outerHTML);
  expect(maghrebiSvg).not.toBe(ottomanSvg);
});

test("component gallery exposes product chrome primitives", async ({ page }) => {
  await page.goto("/#components");
  await expect(page.locator("#components .firdawsi-app-header")).toBeVisible();
  await expect(page.locator("#components .firdawsi-navigation")).toBeVisible();
  await expect(page.locator("#components .firdawsi-menu")).toBeVisible();
  await expect(page.locator("#components .firdawsi-atmosphere").first()).toBeVisible();
  await expect(page.locator("#components [data-atmosphere='courtyard-wash']")).toBeVisible();
});

test("themes and direction remain interactive", async ({ page }) => {
  await page.goto("/#components");
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "High contrast" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");

  await page.getByRole("button", { name: "RTL", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("#components")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("studio shows construction and preset-valid controls", async ({ page }) => {
  await page.goto("/#studio");
  await expect(page.locator("#studio")).toContainText("compass rosette");
  await expect(page.locator("#studio .studio-canvas svg")).toBeVisible();

  const studioSvg = page.locator("#studio .studio-canvas svg");
  const before = await studioSvg.evaluate((node) => node.outerHTML);
  await page.locator('[data-preset-id="floral-geometric-field"]').click();
  await expect(page.getByRole("slider", { name: "Petal depth" })).toBeVisible();
  await expect(page.getByRole("switch", { name: "Botanical fill" })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Weave gap" })).toHaveCount(0);
  const after = await studioSvg.evaluate((node) => node.outerHTML);
  expect(after).not.toBe(before);

  await page.locator('[data-preset-id="khatam-8-star-cross"]').click();
  await expect(page.getByRole("slider", { name: "Weave gap" })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Petal depth" })).toHaveCount(0);

  await page.getByRole("radio", { name: "full", exact: true }).check();
  await expect(studioSvg.locator("[data-construction-role]").first()).toBeAttached();

  const straps = page.getByRole("checkbox", { name: /Straps/ });
  await straps.uncheck();
  await expect(page.locator("#studio .studio-canvas")).toHaveClass(/studio-layer--hide-straps/);

  await expect(page.locator(".tier-grid article")).toHaveCount(3);
  await expect(page.locator(".tier-grid")).toContainText("compact");
  await expect(page.locator(".tier-grid")).toContainText("regular");
  await expect(page.locator(".tier-grid")).toContainText("expanded");
});

test("recipe v2 metadata and exports are available", async ({ page }) => {
  await page.goto("/#studio");
  await page.locator('[data-preset-id="khatam-8-star-cross"]').click();

  await expect(page.locator(".recipe-inspector")).toContainText("Recipe v2");
  await expect(page.locator(".recipe-inspector")).toContainText("khatam-8-v2");
  await expect(page.locator(".recipe-inspector")).toContainText("Repeat cell");
  await expect(page.locator(".recipe-inspector")).toContainText("Source IDs");
  await expect(page.locator(".recipe-inspector")).toContainText("Topology");
  await expect(page.locator(".recipe-inspector details")).toContainText("Review limitations");

  await expect(page.getByRole("button", { name: /Copy SVG/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "CSS", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "JSON", exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("courtyard timetable composes a local product desk", async ({ page }) => {
  await page.goto("/#courtyard");
  const courtyard = page.locator("#courtyard");
  await expect(courtyard).toBeVisible();
  await expect(courtyard).toContainText("A schedule, not scripture");
  await expect(page.locator("#prayer-plaque")).toContainText("الفجر");
  await expect(page.locator("#prayer-plaque")).toContainText("Granada");
  await expect(page.locator(".firdawsi-prayer-plaque")).toBeVisible();

  await courtyard.getByLabel("City").selectOption("fez");
  await expect(page.locator("#prayer-plaque")).toContainText("فاس");
  await expect(page.locator("#prayer-plaque")).toContainText("Fez");

  await courtyard.getByRole("tab", { name: "Week" }).click();
  await expect(courtyard.locator(".firdawsi-table")).toContainText("This week in Fez");
  await expect(courtyard.locator(".firdawsi-table")).toContainText("الفجر");
  await courtyard.getByRole("tab", { name: "Today" }).click();
  await expect(page.locator("#prayer-plaque")).toBeVisible();

  await courtyard.getByRole("textbox", { name: "Quick capture" }).fill("Review the roadmap");
  await courtyard.getByRole("button", { name: "Add intention" }).click();
  const task = courtyard.getByRole("checkbox", { name: "Review the roadmap" });
  await expect(task).toBeVisible();
  await task.check();
  await expect(courtyard.getByRole("status")).toContainText("Task settled");
  await page.reload();
  await expect(courtyard.getByRole("checkbox", { name: "Review the roadmap" })).toBeChecked();

  await courtyard.getByRole("button", { name: "Remove Review the roadmap" }).click();
  await expect(courtyard.getByRole("checkbox", { name: "Review the roadmap" })).toHaveCount(0);
  await courtyard.getByRole("button", { name: "Undo" }).click();
  await expect(courtyard.getByRole("checkbox", { name: "Review the roadmap" })).toBeChecked();

  await courtyard.getByRole("button", { name: "RTL courtyard" }).click();
  await expect(courtyard.locator(".firdawsi-theme")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).not.toHaveAttribute("dir", "rtl");
  await expectNoHorizontalOverflow(page);
});

test("mobile guide drawer reaches studio and components", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "Open guide" }).click();
  await expect(page.locator("#guide-panel")).toHaveClass(/guide-panel--open/);
  await page.locator("#guide-panel").getByRole("link", { name: "Pattern Studio", exact: true }).click();
  await expect(page.locator("#studio")).toBeInViewport();
  await expect(page.locator("#guide-panel")).not.toHaveClass(/guide-panel--open/);

  await page.getByRole("button", { name: "Open guide" }).click();
  await page.locator("#guide-panel").getByRole("link", { name: "Courtyard", exact: true }).click();
  await expect(page.locator("#courtyard")).toBeInViewport();
  await expect(page.locator("#prayer-plaque")).toContainText("الفجر");
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "Open guide" }).click();
  await page.locator("#guide-panel").getByRole("link", { name: "Components", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();

  await page.getByRole("button", { name: "RTL", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expectNoHorizontalOverflow(page);

  await expect(page.locator("#components")).toBeVisible();
  await expect(page.locator("#studio .studio-canvas svg")).toBeVisible();
  await expect(page.locator(".tier-grid article")).toHaveCount(3);
});
