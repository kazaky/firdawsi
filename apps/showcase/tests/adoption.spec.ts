import { expect, test } from "@playwright/test";

test("pattern tiers preserve clear content and high contrast removes ornament", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#pattern-guidance");
  const root = page.locator("#pattern-guidance");
  await expect(root.locator(".pattern-specimen svg")).toHaveCount(0);
  for (const tier of ["Quiet", "Supporting", "Expressive"]) {
    await root.getByRole("radio", { name: tier, exact: true }).check();
    await expect(root.locator(".pattern-specimen__content")).toContainText("Room for your next step.");
    await expect(root.locator(".pattern-specimen .firdawsi-pattern-surface__pattern")).toHaveAttribute("aria-hidden", "true");
    await expect(root.locator(".pattern-specimen svg")).toHaveCount(1);
  }
  await page.getByRole("button", { name: "High contrast" }).click();
  await expect(root.locator(".pattern-specimen .firdawsi-pattern-surface")).toBeHidden();
  await expect(root.locator(".pattern-specimen__content")).toBeVisible();
  await root.getByRole("button", { name: "العربية", exact: true }).click();
  await expect(root).toHaveAttribute("dir", "rtl");
  await expect(root.locator(".pattern-specimen__content")).toContainText("مساحة لخطوتك التالية.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
