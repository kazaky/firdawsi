import { expect, test } from "@playwright/test";

test("philosophy explains religious sources and independently switches language", async ({ page }) => {
  await page.goto("/#principles");
  await expect(page.locator(".philosophy-principle")).toHaveCount(12);
  await expect(page.locator(".care-journey article")).toHaveCount(6);
  await expect(page.locator("#principle-nearness .source-link")).toHaveAttribute("href", "https://quran.com/al-insan/14");
  await expect(page.locator("#principle-nearness .source-arabic")).toBeVisible();
  await expect(page.locator("#principle-nearness .principle-context")).toContainText("design analogy");
  await expect(page.locator("#principles details")).toHaveCount(0);
  await page.locator("#principles").getByRole("button", { name: "العربية", exact: true }).click();
  await expect(page.locator("#principles")).toHaveAttribute("lang", "ar");
  await expect(page.locator("#principles")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: "حين نعود" })).toBeVisible();
});
