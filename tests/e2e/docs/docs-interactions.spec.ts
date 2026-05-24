import { test, expect } from '../fixtures';
import { navigateToDocsPage, expandFirstCodeExample, switchCodeTab, SELECTORS } from '../../utils';

test.describe('Docs code block interactions', () => {
  test('expand example and switch code tabs', async ({ page, consoleCollector }) => {
    consoleCollector.reset();
    await navigateToDocsPage(page, '/docs/components/button/examples');
    await expandFirstCodeExample(page);

    const tabs = page.locator(SELECTORS.codeBlockTab);
    if ((await tabs.count()) > 1) {
      const secondTab = tabs.nth(1);
      const label = (await secondTab.textContent())?.trim() ?? '';
      if (label) {
        await switchCodeTab(page, label);
      }
    }

    await expect(page.locator('pui-doc-code-block pre')).toBeVisible();
  });
});
