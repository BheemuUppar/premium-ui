import { expect, type Locator, type Page } from '@playwright/test';
import { SELECTORS } from './constants';
import { waitForStableLayout } from './layout';

/** Expand the first collapsed code example on the page. */
export async function expandFirstCodeExample(page: Page): Promise<Locator> {
  const showButton = page.getByRole('button', { name: /^Show code$/i }).first();
  if ((await showButton.count()) === 0) {
    return page.locator(SELECTORS.docExample).first();
  }

  const panelId = await showButton.getAttribute('aria-controls');
  await showButton.scrollIntoViewIfNeeded();
  await showButton.click();

  if (panelId) {
    await expect(page.locator(`#${panelId} pui-doc-code-block`)).toBeAttached({ timeout: 8_000 });
  } else {
    await expect(page.getByRole('button', { name: /^Hide code$/i }).first()).toBeVisible({ timeout: 8_000 });
  }

  await waitForStableLayout(page);
  return page.locator(SELECTORS.docExample).first();
}

/** Expand code on a specific example card by title. */
export async function expandCodeExample(page: Page, title?: string): Promise<void> {
  const example = title
    ? page.locator(SELECTORS.docExample).filter({ hasText: title }).first()
    : page.locator(SELECTORS.docExample).first();

  const button = example.locator(SELECTORS.showCodeButton);
  if ((await button.count()) === 0) {
    return;
  }
  await button.click();
  await waitForStableLayout(page);
}

/** Switch between HTML / TS / SCSS tabs inside an expanded code block. */
export async function switchCodeTab(page: Page, label: string): Promise<void> {
  const tab = page.locator(SELECTORS.codeBlockTab).filter({ hasText: label }).first();
  await tab.waitFor({ state: 'visible' });
  await tab.click();
  await waitForStableLayout(page);
  await expect(tab).toHaveAttribute('aria-selected', 'true');
}
