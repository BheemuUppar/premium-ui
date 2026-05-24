import { expect, type Locator, type Page } from '@playwright/test';
import { LAYOUT_SHIFT_THRESHOLD_PX, SELECTORS } from './constants';

export interface BoundingSnapshot {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

async function snapshot(locator: Locator): Promise<BoundingSnapshot | null> {
  const box = await locator.boundingBox();
  if (!box) {
    return null;
  }
  return { x: box.x, y: box.y, width: box.width, height: box.height };
}

/** Wait until layout stops shifting (two stable frames). */
export async function waitForStableLayout(page: Page, maxAttempts = 8): Promise<void> {
  const target = page.locator(SELECTORS.mainContent);
  let previous = await snapshot(target);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await page.waitForTimeout(100);
    const current = await snapshot(target);
    if (!previous || !current) {
      previous = current;
      continue;
    }
    const delta =
      Math.abs(previous.y - current.y) +
      Math.abs(previous.x - current.x) +
      Math.abs(previous.width - current.width);
    if (delta <= LAYOUT_SHIFT_THRESHOLD_PX) {
      return;
    }
    previous = current;
  }
}

/** Assert a locator's bounding box does not shift beyond threshold after an action. */
export async function assertNoLayoutShift(
  page: Page,
  locator: Locator,
  action: () => Promise<void>,
  thresholdPx = LAYOUT_SHIFT_THRESHOLD_PX
): Promise<void> {
  await locator.waitFor({ state: 'visible' });
  const before = await snapshot(locator);
  expect(before, 'Element must be visible for layout assertion').not.toBeNull();

  await action();
  await waitForStableLayout(page);

  const after = await snapshot(locator);
  expect(after, 'Element must remain visible after action').not.toBeNull();

  expect(Math.abs(before!.x - after!.x), 'horizontal shift').toBeLessThanOrEqual(thresholdPx);
  expect(Math.abs(before!.y - after!.y), 'vertical shift').toBeLessThanOrEqual(thresholdPx);
}

/** Assert sidebar position remains stable (no horizontal jump). */
export async function assertSidebarStable(page: Page, action: () => Promise<void>): Promise<void> {
  const sidebar = page.locator(SELECTORS.sidebar);
  if ((await sidebar.count()) === 0) {
    await action();
    return;
  }
  await assertNoLayoutShift(page, sidebar, action);
}
