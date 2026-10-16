import { REGION_IDS, themeAttribute, themes } from "@firdawsi/tokens";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

async function audit(
  page: Page,
  info: TestInfo,
  name: string,
  selectors?: string[],
) {
  let scan = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
  ]);
  for (const selector of selectors ?? []) scan = scan.include(selector);
  const results = await scan.analyze();
  await info.attach(`${name}-axe.json`, {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });
  expect(
    results.violations.map((item) => ({
      id: item.id,
      impact: item.impact,
      help: item.help,
      nodes: item.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
}

for (const theme of ["light", "dark"] as const) {
  test(`whole showcase automated accessibility audit (${theme})`, async ({
    page,
  }, info) => {
    test.setTimeout(90_000);
    await page.goto("/");
    await page.getByRole("button", { name: theme, exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    await audit(page, info, `showcase-${theme}`);
  });
}

test("Arabic high-contrast working states retain accessible semantics", async ({
  page,
}, info) => {
  test.setTimeout(90_000);
  await page.goto("/#experience");
  await page
    .locator("#principles")
    .getByRole("button", { name: "العربية", exact: true })
    .click();
  await page.getByRole("button", { name: "High contrast" }).click();
  const root = page.locator("#experience");
  await root
    .getByRole("textbox", { name: "ما الذي يحتاج إلى اهتمامك؟" })
    .fill("مراجعة أسبوعية");
  await root.getByRole("button", { name: "إضافة مهمة" }).click();
  await root
    .getByRole("button", { name: "تعديل مراجعة أسبوعية", exact: true })
    .click();
  await root.getByRole("textbox", { name: "تعديل عنوان المهمة" }).fill("");
  await root.getByRole("button", { name: "حفظ العنوان" }).click();
  await audit(page, info, "arabic-edit-error", ["#principles"]);
});

test("open dialog is named and has no automatic accessibility violations", async ({
  page,
}, info) => {
  test.setTimeout(90_000);
  await page.goto("/#contracts");
  const root = page.locator("#contracts");
  await root.getByLabel("Choose component").selectOption("overlay");
  await root
    .getByRole("button", { name: "Archive sample project", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Archive the sample project?" }),
  ).toBeVisible();
  await audit(page, info, "archive-dialog");
});

test("320px reflow keeps the reference workflow usable in Arabic", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/#experience");
  await page
    .locator("#principles")
    .getByRole("button", { name: "العربية", exact: true })
    .click();
  const root = page.locator("#experience");
  await root
    .getByRole("textbox", { name: "ما الذي يحتاج إلى اهتمامك؟" })
    .fill("A long mixed-script task — مراجعة تفاصيل الأسبوع بهدوء");
  await root.getByRole("button", { name: "إضافة مهمة" }).click();
  await root.getByRole("button", { name: "عرض الأسبوع", exact: true }).click();
  await expect(
    root.getByRole("button", { name: /تعديل A long/ }),
  ).toBeVisible();
  const reflow = await page.evaluate(() => ({
    overflow:
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
    elements: [...document.querySelectorAll("body *")].flatMap((node) => {
      const rect = node.getBoundingClientRect();
      return rect.right > document.documentElement.clientWidth + 1 &&
        rect.width > 0
        ? [
            {
              tag: node.tagName,
              class: node.getAttribute("class"),
              width: rect.width,
              right: rect.right,
            },
          ]
        : [];
    }),
  }));
  await info.attach("reflow.json", {
    body: JSON.stringify(reflow, null, 2),
    contentType: "application/json",
  });
  expect(reflow.overflow, JSON.stringify(reflow.elements)).toBeLessThanOrEqual(
    1,
  );
});

test("reduced motion removes animation without removing state feedback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#experience");
  const root = page.locator("#experience");
  await root
    .getByRole("textbox", { name: "What needs your attention?" })
    .fill("Complete calmly");
  await root.getByRole("button", { name: "Add task" }).click();
  await root
    .getByRole("checkbox", { name: "Complete Complete calmly" })
    .check();
  await expect(root.locator("#experience-feedback")).toContainText(
    "Saved in this browser.",
  );
  const transitions = await root
    .getByRole("button", { name: "Add task" })
    .evaluate((node) =>
      getComputedStyle(node)
        .transitionDuration.split(",")
        .map((value) => parseFloat(value)),
    );
  expect(transitions.every((value) => value === 0)).toBe(true);
  expect(
    await page
      .locator(".motion-orbit .khatam-mark")
      .first()
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe("none");
});

test("dark and high-contrast semantic colours survive every regional provider", async ({
  page,
}) => {
  await page.goto("/");
  for (const theme of ["dark", "highContrast"] as const) {
    for (const region of REGION_IDS) {
      const actual = await page.evaluate(
        ({ theme, region }) => {
          const provider = document.createElement("div");
          provider.dataset.theme = theme;
          provider.dataset.region = region;
          document.body.append(provider);
          const style = getComputedStyle(provider);
          const values = Object.fromEntries(
            ["surface", "text", "primary", "error"].map((role) => [
              role,
              style.getPropertyValue(`--firdawsi-color-${role}`).trim(),
            ]),
          );
          provider.remove();
          return values;
        },
        { theme: themeAttribute[theme], region },
      );
      for (const role of ["surface", "text", "primary", "error"] as const) {
        expect(actual[role], `${theme}/${region}/${role}`).toBe(
          themes[theme][`color.${role}`],
        );
      }
    }
  }
});
