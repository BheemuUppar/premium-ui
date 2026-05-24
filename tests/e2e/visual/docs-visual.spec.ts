import { test, expect } from '../fixtures';
import { navigateToDocsPage, ensureTheme, waitForStableLayout, SELECTORS } from '../../utils';

const visualRoutes = [
  { route: '/docs/components/button/overview', name: 'button-overview' },
  { route: '/docs/components/tabs/overview', name: 'tabs-overview' },
  { route: '/docs/components/tabs/playground', name: 'tabs-playground' },
  { route: '/docs/components/select/playground', name: 'select-playground' },
];

test.describe('Visual regression foundation', () => {
  test.describe.configure({ mode: 'serial' });

  for (const { route, name } of visualRoutes) {
    test(`${name} — light mode`, async ({ page, consoleCollector }) => {
      test.skip(test.info().project.name !== 'desktop-chromium', 'Desktop snapshots only');
      consoleCollector.reset();
      await navigateToDocsPage(page, route);
      await ensureTheme(page, 'light');
      await waitForStableLayout(page);
      await expect(page.locator(SELECTORS.mainContent)).toHaveScreenshot(`${name}-light.png`, {
        fullPage: true,
      });
    });

    test(`${name} — dark mode`, async ({ page, consoleCollector }) => {
      test.skip(test.info().project.name !== 'desktop-chromium', 'Desktop snapshots only');
      consoleCollector.reset();
      await navigateToDocsPage(page, route);
      await ensureTheme(page, 'dark');
      await waitForStableLayout(page);
      await expect(page.locator(SELECTORS.mainContent)).toHaveScreenshot(`${name}-dark.png`, {
        fullPage: true,
      });
    });
  }
});
