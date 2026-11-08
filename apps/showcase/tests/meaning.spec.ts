import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('meaning explorer connects choices to sources and translates at mobile width', async ({ page }) => {
  await page.goto('/#principles');
  await page.getByRole('button', { name: /Room to pause/ }).click();
  await expect(page.locator('#meaning-detail')).toContainText('Draft saved. Continue when');
  await expect(page.locator('#meaning-detail .source-link')).toHaveAttribute('href', 'https://quran.com/al-hijr/48');
  await page.getByRole('button', { name: /A choice that is yours/ }).click();
  await expect(page.locator('#meaning-detail')).toContainText('You can also skip this step');
  await page.locator('#principles').getByRole('button', { name: 'العربية', exact: true }).click();
  await expect(page.locator('#meaning-detail')).toContainText('حدودي محترمة');
  await page.setViewportSize({ width: 320, height: 760 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: /بداية واضحة/ }).click();
  await expect(page.locator('#meaning-detail')).toContainText('ابدأ بنية صغيرة');
});

test('meaning explorer has accessible contrast in each chapter and theme', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/#principles');
  for (const theme of ['light', 'dark', 'High contrast']) {
    await page.getByRole('button', { name: theme, exact: true }).click();
    for (const name of ['A clear beginning', 'Room to pause', 'Within reach', 'A choice that is yours']) {
      await page.getByRole('button', { name: new RegExp(name) }).click();
      const result = await new AxeBuilder({page}).include('.meaning-explorer').withTags(['wcag2aa','wcag2a']).analyze();
      expect(result.violations.map(v => ({ id:v.id, nodes:v.nodes.map(n=>n.failureSummary) }))).toEqual([]);
    }
  }
});

test('every principle keeps its Arabic passage, reference and context open', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/#principles');
  await expect(page.locator('.principle-story')).toHaveCount(12);
  await expect(page.locator('#principles details')).toHaveCount(0);
  for (const story of await page.locator('.principle-story').all()) {
    await expect(story.locator('.source-arabic')).toBeVisible();
    await expect(story.locator('.source-link')).toBeVisible();
    await expect(story.locator('.principle-context')).toBeVisible();
  }
  const audit = await new AxeBuilder({page}).include('.principle-stories').withTags(['wcag2aa','wcag2a']).analyze();
  expect(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)}))).toEqual([]);
  await page.locator('#principles').getByRole('button',{name:'العربية',exact:true}).click();
  await page.setViewportSize({width:320,height:760});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect(page.locator('#principle-welcome .principle-context')).toContainText('هذا وصف للآخرة');
});
