import { expect, type Page } from '@playwright/test';
import { CONSOLE_IGNORE_PATTERNS } from './constants';

export interface ConsoleCollector {
  readonly errors: string[];
  attach(page: Page): void;
  assertClean(): void;
  reset(): void;
}

/** Create a console error collector for a test. */
export function createConsoleCollector(): ConsoleCollector {
  const errors: string[] = [];

  return {
    errors,
    attach(page: Page): void {
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      page.on('pageerror', (error) => {
        errors.push(error.message);
      });
    },
    reset(): void {
      errors.length = 0;
    },
    assertClean(): void {
      const critical = errors.filter(
        (message) => !CONSOLE_IGNORE_PATTERNS.some((pattern) => pattern.test(message))
      );
      expect(critical, `Console errors:\n${critical.join('\n')}`).toEqual([]);
    },
  };
}

/** Assert no console errors accumulated on the page during the test. */
export function assertNoConsoleErrors(collector: ConsoleCollector): void {
  collector.assertClean();
}
