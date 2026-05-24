import type { Page } from '@playwright/test';
import { HYDRATION_TIMEOUT_MS, SELECTORS } from './constants';

/** Wait for Angular SSR hydration and docs shell to stabilize. */
export async function waitForHydration(page: Page): Promise<void> {
  await page.locator(SELECTORS.appRoot).waitFor({ state: 'attached', timeout: HYDRATION_TIMEOUT_MS });

  await page.waitForFunction(
    () => {
      const root = document.querySelector('app-root');
      return Boolean(root?.getAttribute('ng-version') || root?.innerHTML.trim().length);
    },
    undefined,
    { timeout: HYDRATION_TIMEOUT_MS }
  );

  await page.locator(SELECTORS.mainContent).waitFor({ state: 'visible', timeout: HYDRATION_TIMEOUT_MS });

  // Allow lazy chunks / fonts without hard sleep — network idle is best-effort
  await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => undefined);
}
