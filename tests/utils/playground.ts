import { expect, type Page } from '@playwright/test';
import { SELECTORS } from './constants';
import { waitForStableLayout } from './layout';

/** Scroll to and verify playground section is visible. */
export async function openPlayground(page: Page): Promise<void> {
  const playground = page.locator(SELECTORS.playground).first();
  if ((await playground.count()) === 0) {
    return;
  }
  await playground.scrollIntoViewIfNeeded();
  await expect(playground).toBeVisible();
  await waitForStableLayout(page);
}

/** Interact with the first select/checkbox inside a playground controls panel. */
export async function interactWithPlayground(page: Page): Promise<void> {
  const playground = page.locator(SELECTORS.playground).first();
  if ((await playground.count()) === 0) {
    return;
  }

  const control = playground.locator('pui-select, pui-checkbox, pui-switch, input, button').first();
  if ((await control.count()) === 0) {
    return;
  }

  await control.scrollIntoViewIfNeeded();
  const tag = await control.evaluate((el) => el.tagName.toLowerCase());

  if (tag === 'button') {
    await control.click();
  } else if (tag === 'input') {
    await control.fill('test');
  } else {
    await control.click();
  }

  await waitForStableLayout(page);
}
