import { expect, type Page } from '@playwright/test';
import { docsUrl } from '../shared/routes';

/** Assert SSR/prerender HTML contains meaningful content before hydration. */
export async function assertSsrContent(page: Page, route: string, expectedText: string): Promise<void> {
  const response = await page.request.get(docsUrl(route));
  expect(response.ok(), `SSR GET ${route}`).toBeTruthy();
  const html = await response.text();
  expect(html).toContain(expectedText);
  expect(html).toContain('<app-root');
}

/** Assert page has a single H1 and visible doc content after hydration. */
export async function assertDocsHeadingStructure(page: Page): Promise<void> {
  const h1Count = await page.locator('h1').count();
  expect(h1Count, 'Exactly one H1 per docs page').toBe(1);
  await expect(page.locator('main#main-content')).toBeVisible();
}
