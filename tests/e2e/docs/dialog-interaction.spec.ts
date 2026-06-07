import { expect, test } from '@playwright/test';
import { navigateToDocsPage } from '../../utils';

const DIALOG = '[role="dialog"]';
const BACKDROP = '.pui-overlay-backdrop';

/** Click dimmed area not covered by the centered dialog panel. */
async function clickBackdropOutsidePanel(page: import('@playwright/test').Page): Promise<void> {
  const backdrop = page.locator(BACKDROP).first();
  const dialog = page.locator(DIALOG).first();
  const backdropBox = await backdrop.boundingBox();
  const dialogBox = await dialog.boundingBox();

  if (!backdropBox) {
    throw new Error('Backdrop not found');
  }

  // Prefer a point along the bottom edge, left of the panel.
  const x = dialogBox ? Math.max(8, dialogBox.x - 16) : 8;
  const y = backdropBox.y + backdropBox.height - 12;

  await backdrop.click({ position: { x: x - backdropBox.x, y: y - backdropBox.y } });
}

async function openComponentDialog(page: import('@playwright/test').Page): Promise<void> {
  await navigateToDocsPage(page, '/docs/components/dialog/overview');
  await page.getByRole('button', { name: 'View user' }).click();
  await expect(page.getByRole('heading', { name: 'Alex Morgan' })).toBeVisible();
}

test.describe('Dialog — open / close', () => {
  test('component dialog opens and closes via button', async ({ page }) => {
    await openComponentDialog(page);
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Alex Morgan' })).toBeHidden();
    await expect(page.locator(DIALOG)).toHaveCount(0);
  });

  test('template dialog opens and closes via Cancel', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/dialog/examples');
    await page.getByRole('button', { name: 'Delete user' }).click();
    await expect(page.getByRole('heading', { name: 'Delete user?' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Delete user?' })).toBeHidden();
    await expect(page.locator(DIALOG)).toHaveCount(0);
  });

  test('template dialog closes via Delete action', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/dialog/examples');
    await page.getByRole('button', { name: 'Delete user' }).click();
    await expect(page.getByRole('heading', { name: 'Delete user?' })).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator(DIALOG)).toHaveCount(0);
  });
});

test.describe('Dialog — escape and backdrop', () => {
  test('escape closes component dialog', async ({ page }) => {
    await openComponentDialog(page);
    await page.keyboard.press('Escape');
    await expect(page.locator(DIALOG)).toHaveCount(0);
  });

  test('backdrop click closes when backdropClosable=true', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/dialog/examples');
    await page.getByRole('button', { name: 'With backdrop' }).click();
    await expect(page.getByRole('heading', { name: 'With backdrop' })).toBeVisible();
    await clickBackdropOutsidePanel(page);
    await expect(page.locator(DIALOG)).toHaveCount(0);
  });

  test('backdrop click does not close when backdropClosable=false', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/dialog/examples');
    await page.getByRole('button', { name: 'Delete user' }).click();
    await expect(page.getByRole('heading', { name: 'Delete user?' })).toBeVisible();
    await clickBackdropOutsidePanel(page);
    await expect(page.getByRole('heading', { name: 'Delete user?' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });
});

test.describe('Dialog — stacking and scroll lock', () => {
  test('stacked dialogs — top closes first, base remains', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/dialog/examples');
    await page.getByRole('button', { name: 'Open first layer' }).click();
    await expect(page.getByRole('heading', { name: 'First layer' })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('dialog').getByRole('button', { name: 'Open second dialog' }).click();
    await expect(page.getByRole('heading', { name: 'Second layer' })).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(DIALOG)).toHaveCount(2);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'Second layer' })).toBeHidden();
    await expect(page.getByRole('heading', { name: 'First layer' })).toBeVisible();
    await expect(page.locator(DIALOG)).toHaveCount(1);

    await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.locator(DIALOG)).toHaveCount(0);
  });

  test('body scroll locked while open and restored after close', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/dialog/examples');

    const overflowBefore = await page.evaluate(() => document.body.style.overflow);

    await page.getByRole('button', { name: 'With backdrop' }).click();
    await expect(page.locator(DIALOG)).toHaveCount(1);

    await expect
      .poll(async () => page.evaluate(() => document.body.style.overflow))
      .toBe('hidden');

    await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.locator(DIALOG)).toHaveCount(0);

    await expect
      .poll(async () => page.evaluate(() => document.body.style.overflow))
      .toBe(overflowBefore);
  });
});

test.describe('Dialog — visibility', () => {
  test('panel is visible above backdrop (opacity and z-index)', async ({ page }) => {
    await openComponentDialog(page);

    const panel = page.locator('.pui-overlay-panel--open').first();
    const backdrop = page.locator('.pui-overlay-backdrop--open').first();

    await expect(panel).toBeVisible();
    await expect(backdrop).toBeVisible();

    await expect
      .poll(async () => panel.evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBeGreaterThan(0.9);

    await expect
      .poll(async () => backdrop.evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBeGreaterThan(0);
  });
});
