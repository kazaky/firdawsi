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
  await page.locator('#guide-panel a[href="#principles"]').click();
  await expect(page.locator(".care-journey article")).toHaveCount(6);
  await expect(page.locator(".care-journey")).toContainText("Sukūn");
  await expect(page.locator(".care-journey")).toContainText("Salām");

  await expect(page.getByRole("link", { name: /View on GitHub/i })).toBeVisible();

  for (const id of [
    "overview",
    "principles",
    "geometry",
    "studio",
  ]) {
    await page.locator(`#guide-panel a[href="#${id}"]`).click();
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  await page.goto("/#geometry");
  await expect(page.locator("#geometry img")).toHaveCount(0);
  await expect(page.locator("#geometry .atlas-card")).toHaveCount(16);
  await expect(page.locator("#geometry .atlas-reference figure")).toHaveCount(3);
  await expect(page.locator("#geometry svg[data-plate='zellige']")).toBeVisible();
  await expect(page.locator("#geometry svg[data-plate='khatam-zellige']")).toBeVisible();
  await expect(page.locator("#geometry svg[data-plate='khatam-zellige'] [data-construction-role]").first()).toBeAttached();
  await expect(page.locator("#geometry")).toContainText("Zellige construction plate");
  await expect(page.locator("#geometry")).toContainText("Khatam · zellige palette");
  await expect(page.locator("#geometry")).toContainText("Curvilinear isometric tessellation");
  await expect(page.locator("#geometry")).toContainText("Khatam · eight-fold");
  await expect(page.locator("#geometry")).toContainText("Floral field");
  await page.goto("/#studio");
  await expect(page.locator("#studio .studio-canvas svg")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("legacy regions link opens the unified atlas with distinct traditions", async ({ page }) => {
  await page.goto("/#regions");
  await expect(page.locator("#geometry")).toBeVisible();
  const filters = page.getByRole("navigation", { name: "Filter by tradition" });
  await filters.getByRole("button", { name: "Moroccan", exact: true }).click();
  await expect(page.locator('.atlas-card')).toHaveCount(3);
  const moroccan = await page.locator('.atlas-feature-svg').innerHTML();
  await filters.getByRole("button", { name: "Persian", exact: true }).click();
  await expect(page.locator('.atlas-card')).toHaveCount(5);
  expect(await page.locator('.atlas-feature-svg').innerHTML()).not.toBe(moroccan);
});

test("themes and direction remain interactive", async ({ page }) => {
  await page.goto("/#principles");
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "High contrast" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");

  await page.getByRole("button", { name: "RTL", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("#principles")).toBeVisible();
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

test("mobile guide drawer reaches studio and philosophy", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "Open guide" }).click();
  await expect(page.locator("#guide-panel")).toHaveClass(/guide-panel--open/);
  await page.locator("#guide-panel").getByRole("link", { name: "Pattern Studio", exact: true }).click();
  await expect(page.locator("#studio")).toBeInViewport();
  await expect(page.locator("#guide-panel")).not.toHaveClass(/guide-panel--open/);

  await page.getByRole("button", { name: "Open guide" }).click();
  await page.locator('#guide-panel a[href="#principles"]').click();
  await page.getByRole("button", { name: "RTL", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expectNoHorizontalOverflow(page);

  await expect(page.locator("#principles")).toBeVisible();
  await expect(page.locator("#studio")).toBeHidden();

});

test("art direction coordinates colour and reveals geometric construction", async ({ page }) => {
  await page.goto("/#art-direction");
  const art = page.locator("#art-direction");
  const hero = art.locator(".geometry-artwork svg");
  const before = await hero.evaluate(node => node.outerHTML);
  await art.getByRole("radio", { name: "Violet", exact: true }).check();
  await expect.poll(() => hero.evaluate(node => node.outerHTML)).not.toBe(before);
  await art.getByRole("radio", { name: "Violet", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(art.getByRole("radio", { name: "Coral", exact: true })).toBeChecked();
  await expect(art.locator("[data-construction-role]")).toHaveCount(0);
  await art.getByRole("checkbox", { name: "Reveal the construction" }).check();
  await expect(art.locator("[data-construction-role]").first()).toBeAttached();
  await art.getByRole("checkbox", { name: "Reveal the construction" }).uncheck();
  await expect(art.locator("[data-construction-role]")).toHaveCount(0);
});


test("home shows only overview and guide navigation supports browser history", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#overview")).toBeVisible();
  await expect(page.locator("#art-direction")).toBeHidden();
  await expect(page.locator("#geometry")).toBeHidden();
  await expect(page.locator("#principles")).toBeHidden();
  await page.locator("#guide-panel").getByRole("link", {name:"Geometry & traditions", exact:true}).click();
  await expect(page.locator("#geometry")).toBeVisible();
  await expect(page.locator("#overview")).toBeHidden();
  await page.goBack();
  await expect(page.locator("#overview")).toBeVisible();
  await expect(page.locator("#geometry")).toBeHidden();
});

test("the guide contains only the five public sections and retired links open overview", async ({ page }) => {
  await page.goto("/");
  const links = page.locator("#guide-panel nav a");
  expect(await links.evaluateAll(items => items.map(item => item.getAttribute("href")).sort())).toEqual(
    ["#art-direction", "#geometry", "#overview", "#principles", "#studio"]
  );
  for (const id of ["experience", "foundations", "pattern-guidance", "contracts", "components", "courtyard", "mechanics", "tokens", "motion", "accessibility"]) {
    await page.goto("/#" + id);
    await expect(page.locator("#overview")).toBeVisible();
    await expect(page.locator("#" + id)).toHaveCount(0);
  }
});
