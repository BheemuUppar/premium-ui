import { test, expect } from '../fixtures';
import {
  navigateToDocsPage,
  openPlayground,
  interactWithPlayground,
  assertSidebarStable,
  expandFirstCodeExample,
  SELECTORS,
} from '../../utils';

const responsiveRoutes = [
  '/docs/components/button/playground',
  '/docs/components/tabs/playground',
  '/docs/components/select/playground',
];

test.describe('Responsive docs behavior', () => {
  for (const route of responsiveRoutes) {
    test(`playground stable on ${route}`, async ({ page, consoleCollector }) => {
      consoleCollector.reset();
      await navigateToDocsPage(page, route);
      await openPlayground(page);
      await assertSidebarStable(page, async () => {
        await interactWithPlayground(page);
      });
      await expect(page.locator(SELECTORS.mainContent)).toBeVisible();
    });
  }

  test('mobile TOC toggle works', async ({ page, consoleCollector }) => {
    test.skip(test.info().project.name !== 'mobile-chromium', 'Mobile project only');
    consoleCollector.reset();
    await navigateToDocsPage(page, '/docs/components/tabs/overview');
    const tocToggle = page.locator('.pui-toc__mobile-toggle');
    if ((await tocToggle.count()) === 0) {
      test.skip();
    }
    await tocToggle.click();
    await expect(page.locator('.pui-toc--open')).toBeVisible();
  });

  test('code example expands without horizontal overflow', async ({ page, consoleCollector }) => {
    consoleCollector.reset();
    await navigateToDocsPage(page, '/docs/components/button/examples');
    await expandFirstCodeExample(page);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});
