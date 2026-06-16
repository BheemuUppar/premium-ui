import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Base URL for E2E / Lighthouse (override with PUI_TEST_BASE_URL). */
export const BASE_URL = process.env['PUI_TEST_BASE_URL'] ?? 'http://localhost:4000';

const prerenderFile = join(process.cwd(), 'prerender-routes.txt');

/** All prerendered doc routes from the build manifest. */
export const docsAllRoutes: readonly string[] = readFileSync(prerenderFile, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

/** High-priority smoke routes — run on every CI pass. */
export const docsPriorityRoutes: readonly string[] = [
  '/docs/components/button/overview',
  '/docs/components/button/examples',
  '/docs/components/button/playground',
  '/docs/components/tabs/overview',
  '/docs/components/tabs/playground',
  '/docs/components/select/overview',
  '/docs/components/select/playground',
  '/docs/components/input/overview',
  '/docs/components/checkbox/overview',
  '/docs/components/card/overview',
  '/docs/components/dialog/overview',
  '/docs/components/dialog/examples',
  '/docs/components/command/overview',
  '/docs/components/command/examples',
  '/docs/foundations/colors',
];

/** Routes audited by Lighthouse CI. */
export const lighthouseRoutes: readonly string[] = [
  '/docs/components/button/overview',
  '/docs/components/button/playground',
  '/docs/components/tabs/overview',
  '/docs/components/tabs/playground',
  '/docs/components/select/overview',
  '/docs/components/select/playground',
];

export const docsComponentSlugs: readonly string[] = [
  'button',
  'input',
  'card',
  'select',
  'checkbox',
  'radio',
  'switch',
  'toggle',
  'tabs',
];

/** Resolve a full URL for a doc route path. */
export function docsUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalized}`;
}

/** Lighthouse collect URLs (absolute). */
export function lighthouseUrls(): string[] {
  return lighthouseRoutes.map(docsUrl);
}
