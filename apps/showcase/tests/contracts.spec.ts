import { expect, test } from "@playwright/test";

test("button states and field repair use real component semantics", async ({
  page,
}) => {
  await page.goto("/#contracts");
  const root = page.locator("#contracts");
  await root.getByRole("button", { name: "Activate example" }).click();
  await expect(root.getByRole("status")).toContainText("Activations: 1");
  await root.getByLabel("Preview state").selectOption("busy");
  await expect(root.getByRole("button", { name: "Working…" })).toBeDisabled();
  await expect(root.getByRole("button", { name: "Working…" })).toHaveAttribute(
    "aria-busy",
    "true",
  );
  await root.getByLabel("Choose component").selectOption("field");
  const input = root.getByRole("textbox", { name: "Project name" });
  await input.fill("ab");
  await root.getByRole("button", { name: "Validate example" }).click();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveValue("ab");
  await expect(input).toBeFocused();
  await input.fill("Firdawsi");
  await root.getByRole("button", { name: "Validate example" }).click();
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
  await expect(root.getByRole("status")).toContainText("No data was submitted");
});

test("dialog cancels with Escape, restores focus, and supports undo", async ({
  page,
}) => {
  await page.goto("/#contracts");
  const root = page.locator("#contracts");
  await root.getByLabel("Choose component").selectOption("overlay");
  const trigger = root.getByRole("button", {
    name: "Archive sample project",
    exact: true,
  });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "Archive the sample project?" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(root.getByRole("status")).toContainText(
    "Sample project is active",
  );
  await trigger.click();
  await page
    .getByRole("button", { name: "Archive sample", exact: true })
    .click();
  await expect(root.getByRole("status")).toContainText("archived");
  await expect(trigger).toBeFocused();
  await root.getByRole("button", { name: "Undo archive" }).click();
  await expect(root.getByRole("status")).toContainText(
    "Sample project is active",
  );
});

test("Arabic navigation follows local RTL and choices remain operable", async ({
  page,
}) => {
  await page.goto("/#contracts");
  const root = page.locator("#contracts");
  await root.getByRole("button", { name: "العربية", exact: true }).click();
  await expect(root).toHaveAttribute("dir", "rtl");
  await root.getByLabel("اختر المكوّن").selectOption("navigation");
  await root.getByRole("tab", { name: "اليوم", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    root.getByRole("tab", { name: "الأسبوع", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(root.getByRole("tabpanel")).toContainText("عرض آخر للعمل نفسه");
  await root.getByLabel("اختر المكوّن").selectOption("choice");
  await root.getByText("تضمين المهام المكتملة", { exact: true }).click();
  await expect(root.getByRole("checkbox", { name: "تضمين المهام المكتملة" })).toBeChecked();
  await root.getByRole("switch", { name: "معاينة التذكيرات" }).focus();
  await page.keyboard.press("Space");
  await expect(root.getByRole("switch", { name: "معاينة التذكيرات" })).toBeChecked();
  await expect(root.getByRole("status")).toContainText("مفعّلة");
  await root.getByLabel("اختر المكوّن").selectOption("overlay");
  await root.getByRole("button", { name: "أرشفة المشروع التجريبي" }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("button", { name: "إغلاق", exact: true }),
  ).toBeVisible();
});

test("feedback never treats pending or retry as completed, including narrow layouts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#contracts");
  const root = page.locator("#contracts");
  await root.getByLabel("Choose component").selectOption("feedback");
  await root.getByRole("button", { name: "Failed", exact: true }).click();
  await expect(root.getByRole("status")).toContainText("Not completed");
  await root.getByRole("button", { name: "Retry example" }).click();
  await expect(root.getByRole("status")).toContainText(
    "Waiting for confirmation",
  );
  await expect(
    root.getByRole("button", { name: "Pending", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await root.getByRole("button", { name: "Completed", exact: true }).click();
  await expect(root.getByRole("status")).toContainText("not a real save");
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
});
