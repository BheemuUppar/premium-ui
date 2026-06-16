import { expect, test } from '@playwright/test';
import { navigateToDocsPage } from '../../utils';

const PALETTE = '[role="dialog"][aria-label="Command palette"], .pui-command-palette';
const PALETTE_INPUT = '.pui-command-palette__input';
const PALETTE_OPTION = '[role="option"]';

async function openCommandPaletteFromTopNav(page: import('@playwright/test').Page): Promise<void> {
  await page.locator('button.pui-search').click();
  await expect(page.locator(PALETTE)).toBeVisible();
}

async function openCommandPaletteFromDemo(page: import('@playwright/test').Page): Promise<void> {
  await page.locator('.pui-doc-page').getByRole('button', { name: 'Open command palette' }).click();
  await expect(page.locator(PALETTE)).toBeVisible();
}

test.describe('Command Palette — global docs shell', () => {
  test('opens from top nav on any docs page', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/button/overview');
    await openCommandPaletteFromTopNav(page);
    await page.keyboard.press('Escape');
  });

  test('opens with Ctrl+K / Meta+K on any docs page', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/button/overview');
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+KeyK`);
    await expect(page.locator(PALETTE)).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('navigates to component docs from global palette', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/button/overview');
    await openCommandPaletteFromTopNav(page);
    await page.locator(PALETTE_INPUT).fill('Table');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/docs\/components\/table\/overview/);
  });
});

test.describe('Command Palette — open / close', () => {
  test('opens via button and closes via Escape', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/command/overview');
    await openCommandPaletteFromDemo(page);
    await page.keyboard.press('Escape');
    await expect(page.locator(PALETTE)).toHaveCount(0);
  });

  test('closes via backdrop click', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/command/overview');
    await openCommandPaletteFromDemo(page);
    await page.locator('.pui-command-palette-backdrop, .pui-overlay-backdrop').first().click({ position: { x: 8, y: 8 } });
    await expect(page.locator(PALETTE)).toHaveCount(0);
  });
});

test.describe('Command Palette — keyboard', () => {
  test('opens with Ctrl+K / Meta+K shortcut on command docs page', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/command/overview');
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+KeyK`);
    await expect(page.locator(PALETTE)).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('arrow keys move active option', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/command/overview');
    await openCommandPaletteFromDemo(page);
    const first = page.locator(PALETTE_OPTION).first();
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowDown');
    await expect(first).toHaveAttribute('aria-selected', 'false');
    await expect(page.locator(PALETTE_OPTION).nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('Enter executes command and closes palette', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/command/overview');
    await openCommandPaletteFromDemo(page);
    await page.locator(PALETTE_INPUT).fill('Table');
    await page.keyboard.press('Enter');
    await expect(page.locator(PALETTE)).toHaveCount(0);
    await expect(page).toHaveURL(/\/docs\/components\/table\/overview/);
  });
});

test.describe('Command Palette — search and grouping', () => {
  test('filters commands by query', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/command/overview');
    await openCommandPaletteFromDemo(page);
    await page.locator(PALETTE_INPUT).fill('table');
    await expect(page.getByRole('option', { name: /Table/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /Button/i })).toHaveCount(0);
  });

  test('shows group headers', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/command/overview');
    await openCommandPaletteFromDemo(page);
    const palette = page.locator(PALETTE);
    await expect(palette.locator('.pui-command-palette__group-label', { hasText: 'Forms' })).toBeVisible();
    await expect(palette.locator('.pui-command-palette__group-label', { hasText: 'Foundations' })).toBeVisible();
  });

  test('shows empty state for unknown query', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/command/overview');
    await openCommandPaletteFromDemo(page);
    await page.locator(PALETTE_INPUT).fill('zzzz-not-a-command');
    await expect(page.getByText('No commands found')).toBeVisible();
  });
});

test.describe('Command Palette — accessibility and theme', () => {
  test('dialog and combobox roles are present', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/command/overview');
    await openCommandPaletteFromDemo(page);
    const palette = page.locator(PALETTE);
    await expect(palette).toBeVisible();
    await expect(palette.locator('[role="combobox"]')).toBeVisible();
    await expect(palette.locator('[role="listbox"]')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('renders in dark theme docs shell', async ({ page }) => {
    await navigateToDocsPage(page, '/docs/components/command/overview');
    await page.locator('[data-theme="dark"]').first().evaluate((el) => {
      (el as HTMLElement).setAttribute('data-theme', 'dark');
    }).catch(() => undefined);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await openCommandPaletteFromDemo(page);
    await expect(page.locator(PALETTE)).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
