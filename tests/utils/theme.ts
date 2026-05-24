import { expect, type Page } from '@playwright/test';
import { SELECTORS } from './constants';
import { waitForStableLayout } from './layout';

/** Toggle light/dark theme via the top nav control. */
export async function switchTheme(page: Page): Promise<'light' | 'dark'> {
  const toggle = page.getByRole('button', { name: /toggle color theme/i });
  await toggle.waitFor({ state: 'visible' });
  await toggle.click();
  await waitForStableLayout(page);
  return getTheme(page);
}

/** Read current theme from app-root data attribute. */
export async function getTheme(page: Page): Promise<'light' | 'dark'> {
  const theme = await page.locator(SELECTORS.appRoot).getAttribute('data-theme');
  expect(theme).toMatch(/^(light|dark)$/);
  return theme as 'light' | 'dark';
}

/** Set theme to a known state. */
export async function ensureTheme(page: Page, target: 'light' | 'dark'): Promise<void> {
  const current = await getTheme(page);
  if (current !== target) {
    await switchTheme(page);
  }
}
