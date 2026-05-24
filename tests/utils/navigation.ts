import type { Page } from '@playwright/test';
import { docsUrl } from '../shared/routes';
import { SELECTORS } from './constants';
import { waitForHydration } from './hydration';

/** Navigate to a docs route and wait for hydration. */
export async function navigateToDocsPage(page: Page, route: string): Promise<void> {
  const url = docsUrl(route);
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  if (!response?.ok()) {
    throw new Error(`Failed to load ${url}: HTTP ${response?.status() ?? 'unknown'}`);
  }
  await waitForHydration(page);
  await page.locator(SELECTORS.mainContent).waitFor({ state: 'visible' });
}
