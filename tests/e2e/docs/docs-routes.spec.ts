import { test, expect } from '../fixtures';
import { docsAllRoutes } from '../../shared/routes';
import { navigateToDocsPage, assertDocsHeadingStructure, SELECTORS } from '../../utils';

test.describe('Docs route audit — all prerender routes', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const route of docsAllRoutes) {
    test(`${route} loads without errors`, async ({ page, consoleCollector }) => {
      consoleCollector.reset();
      await navigateToDocsPage(page, route);
      await assertDocsHeadingStructure(page);
      await expect(page.locator(SELECTORS.mainContent)).toBeVisible();
      await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');
    });
  }
});
