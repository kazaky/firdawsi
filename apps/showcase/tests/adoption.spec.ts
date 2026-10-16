import { expect, test } from "@playwright/test";

test("getting started provides source setup and an honest local example", async ({ page }) => {
  await page.goto("/#getting-started");
  const root = page.locator("#getting-started");
  await expect(root.getByRole("heading", { name: "Your first meaningful flow." })).toBeVisible();
  await expect(root.locator("pre").first()).toContainText("pnpm install --frozen-lockfile");
  await expect(root).toContainText("do not install an assumed published package");
  await root.getByRole("button", { name: "Check example", exact: true }).click();
  const input = root.getByRole("textbox", { name: "Task title", exact: true });
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await input.fill("Plan with intention");
  await root.getByRole("button", { name: "Check example", exact: true }).click();
  await expect(root.locator(".adoption-starter [role='status']")).toHaveText("Example checked. No data was saved.");
  await expect(input).toHaveValue("Plan with intention");
  await root.getByRole("button", { name: "العربية", exact: true }).click();
  await expect(root).toHaveAttribute("dir", "rtl");
  await expect(root.getByRole("textbox", { name: "عنوان المهمة" })).toHaveValue("Plan with intention");
  await expect(root.locator("pre").last()).toContainText('direction="rtl"');
  await expect(root.locator("pre").last()).toContainText('lang="ar"');
});

test("copy failure leaves selectable source available without claiming success", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Clipboard unavailable"); } } }));
  await page.goto("/#getting-started");
  const code = page.locator("#getting-started .adoption-code").first();
  await code.getByRole("button", { name: "Copy code" }).click();
  await expect(code.getByRole("status")).toContainText("copy it manually");
  await expect(code.locator("pre")).toBeVisible();
  await expect(code.locator("pre")).toHaveAttribute("tabindex", "0");
});

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
