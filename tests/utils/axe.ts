import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';
import { AXE_DOCS_EXCLUDE_SELECTORS } from './constants';

export interface AxeOptions {
  /** CSS selector to include (defaults to main content). */
  readonly include?: string;
  /** Disable specific rules (use sparingly). */
  readonly disableRules?: readonly string[];
  /** Additional exclude selectors. */
  readonly exclude?: readonly string[];
}

/** Run axe accessibility audit on the current page. */
export async function runAxeAudit(page: Page, options: AxeOptions = {}): Promise<void> {
  const builder = new AxeBuilder({ page }).include(options.include ?? 'main#main-content');

  for (const selector of options.exclude ?? []) {
    builder.exclude(selector);
  }

  if (options.disableRules?.length) {
    builder.disableRules([...options.disableRules]);
  }

  const results = await builder.analyze();

  expect(results.violations, formatViolations(results.violations)).toEqual([]);
}

/** Run axe on docs platform chrome — excludes component preview/playground surfaces. */
export async function runDocsAxeAudit(page: Page, options: AxeOptions = {}): Promise<void> {
  await runAxeAudit(page, {
    ...options,
    exclude: [...AXE_DOCS_EXCLUDE_SELECTORS, ...(options.exclude ?? [])],
  });
}

function formatViolations(violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']): string {
  if (violations.length === 0) {
    return '';
  }
  return violations
    .map(
      (v) =>
        `[${v.id}] ${v.help}\n  ${v.nodes.map((n) => n.target.join(', ')).join('\n  ')}`
    )
    .join('\n\n');
}
