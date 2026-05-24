import { test } from '../fixtures';
import { docsPriorityRoutes } from '../../shared/routes';
import { navigateToDocsPage, runDocsAxeAudit, switchTheme } from '../../utils';

test.describe('Accessibility — axe audits', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const route of docsPriorityRoutes) {
    test(`axe: ${route}`, async ({ page, consoleCollector }) => {
      consoleCollector.reset();
      await navigateToDocsPage(page, route);
      await runDocsAxeAudit(page);
    });
  }

  test('axe: button docs in dark mode', async ({ page, consoleCollector }) => {
    consoleCollector.reset();
    await navigateToDocsPage(page, '/docs/components/button/overview');
    await switchTheme(page, 'dark');
    await runDocsAxeAudit(page);
  });
});
