/** Stable selectors for docs E2E — prefer roles/labels over implementation details. */
export const SELECTORS = {
  appRoot: 'app-root',
  mainContent: 'main#main-content',
  sidebar: 'aside.pui-sidebar',
  toc: 'aside.pui-toc',
  docExample: 'pui-doc-example, .pui-doc-example',
  showCodeButton: 'button:has-text("Show code")',
  hideCodeButton: 'button:has-text("Hide code")',
  codeBlockTab: '.pui-doc-code-block__tab',
  codeBlockPanel: '.pui-doc-code-block__panel--active pre code',
  themeToggle: 'button:has(.pui-sr-only:text("Toggle color theme"))',
  playground: '.pui-doc-playground, .pui-playground',
  docPage: 'article.pui-doc-page, article.pui-doc-layout',
  h1: 'h1',
} as const;

/** Console messages matching these patterns are ignored (non-fatal noise). */
export const CONSOLE_IGNORE_PATTERNS: readonly RegExp[] = [
  /favicon\.ico/i,
  /Download the React DevTools/i,
  /Failed to load resource.*404/i,
];

/** Maximum allowed bounding-box shift (px) for layout stability checks. */
export const LAYOUT_SHIFT_THRESHOLD_PX = 4;

/** Regions excluded from docs axe audits (component demo surfaces — covered by Storybook a11y). */
export const AXE_DOCS_EXCLUDE_SELECTORS: readonly string[] = [
  '.pui-doc-example__preview',
  '.pui-doc-playground__preview',
  '.pui-doc-playground__controls',
  '.pui-playground',
];

/** Hydration settle timeout (ms). */
export const HYDRATION_TIMEOUT_MS = 15_000;
