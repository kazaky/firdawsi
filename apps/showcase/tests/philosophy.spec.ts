import { expect, test } from "@playwright/test";

test("philosophy explains religious sources and independently switches language", async ({ page }) => {
  await page.goto("/#principles");
  await expect(page.locator(".philosophy-principle")).toHaveCount(7);
  await expect(page.locator(".interaction-cycle article")).toHaveCount(6);
  await expect(page.locator("#principle-nearness .source-link")).toHaveAttribute("href", "https://quran.com/al-insan/14");
  await page.locator("#principle-nearness summary").click();
  await expect(page.locator("#principle-nearness details")).toContainText("design analogy");
  await page.locator("#principles").getByRole("button", { name: "العربية", exact: true }).click();
  await expect(page.locator("#principles")).toHaveAttribute("lang", "ar");
  await expect(page.locator("#principles")).toHaveAttribute("dir", "rtl");
  await page.locator("#guide-panel").getByRole("link", { name: "Experience lab", exact: true }).click();
  await expect(page.getByRole("heading", { name: "معنى يتجسّد." })).toBeVisible();
  await page.getByLabel("ما الذي يحتاج إلى اهتمامك؟").fill("قراءة مع داوود");
  await page.getByRole("button", { name: "إضافة مهمة" }).click();
  await expect(page.locator(".experience-tasks")).toContainText("قراءة مع داوود");
  await expect(page.locator("#experience-feedback")).toContainText("حُفظت في هذا المتصفح.");
});

test("capture, keyboard move, reload, and undo preserve task state", async ({ page }) => {
  await page.goto("/#experience");
  await page.getByLabel("What needs your attention?").fill("Read with Daoud");
  await page.getByRole("button", { name: "Add task", exact: false }).click();
  await expect(page.locator("#experience-feedback")).toContainText("Saved in this browser.");
  const move = page.getByRole("combobox", { name: "Move Read with Daoud" });
  await move.focus(); await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter");
  await expect(move).toHaveValue("1");
  await page.getByRole("button", { name: "Undo last change" }).click();
  await expect(move).toHaveValue("0");
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Move Read with Daoud" })).toHaveValue("0");
});

test("failed save retains draft, retry commits once, and cancel preserves existing data", async ({ page }) => {
  await page.goto("/#experience");
  await page.getByLabel("What needs your attention?").fill("A meaningful task");
  await page.getByLabel("Simulate next save failure").check();
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(page.locator("#experience-feedback")).toContainText("Not saved.");
  await expect(page.getByLabel("What needs your attention?")).toHaveValue("A meaningful task");
  await expect(page.locator(".experience-tasks li")).toHaveCount(0);
  await page.getByRole("button", { name: "Retry save" }).click();
  await expect(page.locator(".experience-tasks li")).toHaveCount(1);
  await page.getByLabel("Simulate next save failure").check();
  await page.getByRole("combobox", { name: "Move A meaningful task" }).selectOption("2");
  await page.getByRole("button", { name: "Cancel change" }).click();
  await expect(page.getByRole("combobox", { name: "Move A meaningful task" })).toHaveValue("0");
  await page.reload();
  await expect(page.locator(".experience-tasks li")).toHaveCount(1);
});

test("real storage failure does not report success or lose the draft", async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException("Unavailable", "QuotaExceededError"); }; });
  await page.goto("/#experience");
  await page.getByLabel("What needs your attention?").fill("Keep this draft");
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(page.locator("#experience-feedback")).toContainText("Not saved.");
  await page.getByRole("button", { name: "Retry save" }).click();
  await expect(page.getByLabel("What needs your attention?")).toHaveValue("Keep this draft");
  await expect(page.locator(".experience-tasks li")).toHaveCount(0);
});

test("corrupt saved data is protected from overwrite", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("firdawsi-experience-tasks-v1", "invalid-json"));
  await page.goto("/#experience");
  await expect(page.locator("#experience [role='alert']")).toContainText("Nothing has been overwritten.");
  await expect(page.getByRole("button", { name: "Add task" })).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem("firdawsi-experience-tasks-v1"))).toBe("invalid-json");
});

test("visual directions keep identical content and work on a narrow RTL screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#experience");
  await page.getByLabel("What needs your attention?").fill("One task");
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByLabel("Rhythm & proportion", { exact: true }).check();
  await page.getByLabel("Show decorative geometry").check();
  await expect(page.locator(".experience-workspace")).toHaveAttribute("data-ornament", "true");
  await page.getByLabel("Continuity & gathering", { exact: true }).check();
  await page.locator("#principles").getByRole("button", { name: "العربية", exact: true }).click();
  await page.getByRole("button", { name: "RTL", exact: true }).click();
  await page.getByRole("button", { name: "High contrast" }).click();
  await expect(page.locator(".experience-tasks")).toContainText("One task");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
