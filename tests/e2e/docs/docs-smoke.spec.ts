import { test, expect } from '../fixtures';
import { docsPriorityRoutes } from '../../shared/routes';
import {
  navigateToDocsPage,
  expandFirstCodeExample,
  switchTheme,
  assertSidebarStable,
  assertSsrContent,
  assertDocsHeadingStructure,
  SELECTORS,
} from '../../utils';

test.describe('Docs smoke — priority routes', () => {
  for (const route of docsPriorityRoutes) {
    test(`loads and hydrates ${route}`, async ({ page, consoleCollector }) => {
      consoleCollector.reset();
      await navigateToDocsPage(page, route);
      await assertDocsHeadingStructure(page);
      await expect(page.locator(SELECTORS.docPage)).toBeVisible();
    });
  }
});

test.describe('Docs SSR content', () => {
  test('button overview prerender contains H1 text', async ({ page }) => {
    await assertSsrContent(page, '/docs/components/button/overview', 'Angular Button Component');
  });

  test('tabs overview prerender contains tab content', async ({ page }) => {
    await assertSsrContent(page, '/docs/components/tabs/overview', 'Tabs');
  });
});

test.describe('Docs interaction flow', () => {
  test('button examples — expand code, switch tabs, theme toggle', async ({ page, consoleCollector }) => {
    await navigateToDocsPage(page, '/docs/components/button/examples');

    await assertSidebarStable(page, async () => {
      await expandFirstCodeExample(page);
    });

    await expect(page.locator('pui-doc-code-block')).toBeVisible();

    await assertSidebarStable(page, async () => {
      await switchTheme(page);
    });
    await expect(page.locator(SELECTORS.appRoot)).toHaveAttribute('data-theme', 'dark');
  });
});
