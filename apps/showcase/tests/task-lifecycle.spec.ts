import { expect, test } from "@playwright/test";

test("task lifecycle preserves changes, completion, removal, and undo", async ({ page }) => {
  await page.goto("/#experience");
  const root = page.locator("#experience");
  await root.getByLabel("What needs your attention?").fill("Read a chapter");
  await root.getByRole("button", { name: "Add task" }).click();
  await root.getByRole("button", { name: "Edit Read a chapter", exact: true }).click();
  const title = root.getByRole("textbox", { name: "Edit task title" });
  await expect(title).toBeFocused();
  await title.fill("Read with family");
  await root.getByRole("button", { name: "Save title" }).click();
  await root.getByRole("checkbox", { name: "Complete Read with family" }).check();
  await expect(root.locator(".experience-week-tools")).toContainText("1 completed");
  await page.reload();
  await expect(root.getByRole("checkbox", { name: "Complete Read with family" })).toBeChecked();
  await root.getByRole("button", { name: "Remove Read with family" }).click();
  await expect(root.locator(".experience-tasks li")).toHaveCount(0);
  await root.getByRole("button", { name: "Undo last change" }).click();
  await expect(root.getByRole("checkbox", { name: "Complete Read with family" })).toBeChecked();
});

test("failed editing retains both titles and recovery finishes only once", async ({ page }) => {
  await page.goto("/#experience");
  const root = page.locator("#experience");
  await root.getByLabel("What needs your attention?").fill("Original task");
  await root.getByRole("button", { name: "Add task" }).click();
  await root.getByRole("button", { name: "Edit Original task", exact: true }).click();
  const title = root.getByRole("textbox", { name: "Edit task title" });
  await title.fill("");
  await root.getByRole("button", { name: "Save title" }).click();
  await expect(title).toHaveAttribute("aria-invalid", "true");
  await title.fill("Revised task");
  await root.getByLabel("Simulate next save failure").check();
  await root.getByRole("button", { name: "Save title" }).click();
  await expect(root.locator("#experience-feedback")).toContainText("Not saved.");
  await expect(title).toHaveValue("Revised task");
  await expect(root.locator(".experience-tasks")).toContainText("Original task");
  await root.getByRole("button", { name: "Retry save" }).click();
  await expect(root.locator(".experience-tasks li")).toHaveCount(1);
  await expect(root.locator(".experience-tasks")).toContainText("Revised task");
  await expect(title).toHaveCount(0);
});

test("week view groups tasks and supports Arabic controls without losing data", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#experience");
  const root = page.locator("#experience");
  await root.getByLabel("What needs your attention?").fill("A quiet task");
  await root.getByRole("button", { name: "Add task" }).click();
  await root.getByRole("button", { name: "Week view", exact: true }).click();
  await expect(root.getByRole("region", { name: "Monday", exact: true })).toContainText("A quiet task");
  await root.getByRole("combobox", { name: "Move A quiet task" }).selectOption("4");
  await expect(root.getByRole("region", { name: "Friday", exact: true })).toContainText("A quiet task");
  await page.locator("#principles").getByRole("button", { name: "العربية", exact: true }).click();
  await expect(root.getByRole("region", { name: "الجمعة", exact: true })).toContainText("A quiet task");
  await root.getByRole("checkbox", { name: "إكمال A quiet task" }).check();
  await expect(root.locator(".experience-week-tools")).toContainText("1 مكتملة");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("legacy tasks migrate without overwrite, and failed undo remains retryable", async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("firdawsi-experience-tasks-v1")) localStorage.setItem("firdawsi-experience-tasks-v1", JSON.stringify([{ id: "legacy", title: "Existing task", day: 2 }]));
  });
  await page.goto("/#experience");
  const root = page.locator("#experience");
  await expect(root.getByRole("checkbox", { name: "Complete Existing task" })).not.toBeChecked();
  await root.getByRole("button", { name: "Remove Existing task" }).click();
  await root.getByLabel("Simulate next save failure").check();
  await root.getByRole("button", { name: "Undo last change" }).click();
  await expect(root.locator("#experience-feedback")).toContainText("Not saved.");
  await expect(root.locator(".experience-tasks li")).toHaveCount(0);
  await root.getByRole("button", { name: "Retry save" }).click();
  await expect(root.locator("#experience-feedback")).toContainText("Previous change undone and saved.");
  await expect(root.getByRole("checkbox", { name: "Complete Existing task" })).not.toBeChecked();
  await expect(root.getByRole("button", { name: "Undo last change" })).toHaveCount(0);
});
