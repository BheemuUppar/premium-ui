import { expect, test } from '@playwright/test';
import { navigateToDocsPage } from '../../utils';

const CHART_CANVAS = '.pui-chart__canvas canvas';
const LINE_CHART = 'pui-line-chart';

test.describe('Charts — rendering', () => {
  test('documentation renders line chart canvas', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/charts/doc');
    await expect(page.locator(LINE_CHART)).toBeVisible();
    await expect(page.locator(CHART_CANVAS).first()).toBeVisible();
  });

  test('pie chart page renders progressive examples', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/charts/pie-chart');
    await expect(page.locator('pui-pie-chart').first()).toBeVisible();
    await expect(page.locator(CHART_CANVAS).first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Pie chart' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Examples' })).toBeVisible();
  });

  test('line chart page renders progressive examples', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/charts/line-chart');
    await expect(page.locator('pui-line-chart').first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Line chart' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Basic' })).toBeVisible();
  });

  test('configuration playground renders live chart', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/charts/configuration-playground');
    await expect(page.getByRole('heading', { level: 1, name: 'Configuration Playground' })).toBeVisible();
    await expect(page.locator(LINE_CHART)).toBeVisible();
  });
});

test.describe('Charts — sidebar navigation', () => {
  test('sidebar charts tree links to chart pages', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/charts/doc');
    await page.locator('.pui-sidebar').getByRole('link', { name: 'Gauge chart', exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/components\/charts\/gauge-chart$/);
    await expect(page.locator('pui-gauge-chart').first()).toBeVisible();
  });
});

test.describe('Charts — interaction', () => {
  test('hover across line chart keeps canvas interactive', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/charts/doc');
    const canvas = page.locator(CHART_CANVAS).first();
    await canvas.waitFor({ state: 'visible' });
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    if (!box) return;

    for (const ratio of [0.25, 0.5, 0.75]) {
      await page.mouse.move(box.x + box.width * ratio, box.y + box.height * 0.5);
    }

    await expect(canvas).toBeVisible();
  });
});

test.describe('Charts — responsiveness', () => {
  test('chart canvas remains visible after viewport resize', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/charts/line-chart');
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator(CHART_CANVAS).first()).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator(CHART_CANVAS).first()).toBeVisible();
  });
});

test.describe('Charts — accessibility', () => {
  test('documentation line chart exposes aria label', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/charts/doc');
    await expect(page.locator(`${LINE_CHART}[aria-label="Monthly revenue line chart"]`)).toBeVisible();
  });
});
