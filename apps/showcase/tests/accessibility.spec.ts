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
