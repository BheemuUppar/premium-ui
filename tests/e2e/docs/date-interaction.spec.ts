import { expect, test } from '@playwright/test';
import { navigateToDocsPage } from '../../utils';

test.describe('Date System — rendering', () => {
  test('date docs render date picker', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/date/overview');
    await expect(page.locator('pui-date-picker')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: /Premium Date System/i })).toBeVisible();
  });

  test('calendar inline example renders grid', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/date/examples');
    await expect(page.locator('pui-calendar')).toBeVisible();
    await expect(page.locator('.pui-calendar__grid')).toBeVisible();
  });
});

test.describe('Date System — keyboard', () => {
  test('date picker opens with Enter key', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/date/examples');
    const input = page.locator('pui-date-picker input').first();
    await input.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.pui-calendar__grid')).toBeVisible();
  });
});
