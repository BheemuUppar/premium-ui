import { test as base } from '@playwright/test';
import { createConsoleCollector, type ConsoleCollector } from '../../utils/console';

type DocsFixtures = {
  consoleCollector: ConsoleCollector;
};

/** Extended Playwright test with automatic console error collection. */
export const test = base.extend<DocsFixtures>({
  consoleCollector: async ({ page }, use) => {
    const collector = createConsoleCollector();
    collector.attach(page);
    await use(collector);
    collector.assertClean();
  },
});

export { expect } from '@playwright/test';
