# Premium UI — Testing Guide

Automated quality infrastructure for the docs platform and component library.

## Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | E2E, SSR hydration, interactions, visual snapshots |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) | Accessibility audits |
| [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) | SEO, performance, best practices |
| Angular SSR | Prerendered docs served in tests via Express |

## Quick start

```bash
# 1. Build SSR app (required before tests)
npm run build

# 2. Run all Playwright tests (starts SSR server automatically)
npm run test:e2e

# 3. Run accessibility audits only
npm run test:a11y

# 4. Run Lighthouse CI
npm run test:lighthouse

# 5. Full quality gate (build + E2E + Lighthouse)
npm run test:all
```

## Architecture

```
tests/
  e2e/
    docs/           # Route audits, smoke, responsive
    visual/         # Screenshot regression foundation
    fixtures/       # Extended test + console collector
  shared/
    routes.ts       # Central route registry (from prerender-routes.txt)
  utils/            # Reusable helpers (navigation, theme, layout, axe…)
  reports/          # Generated HTML reports (gitignored)
  results/          # Playwright artifacts (gitignored)
lighthouserc.cjs    # Lighthouse CI thresholds
playwright.config.ts
```

## What gets validated

- **SSR** — prerender HTML contains doc content before hydration
- **Hydration** — no console errors, app-root ng-version present
- **Interactions** — expand code examples, switch code tabs, theme toggle
- **Layout stability** — sidebar/content bounding box shifts ≤ 4px
- **Accessibility** — axe violations fail the build (WCAG via axe rules)
- **Responsive** — mobile TOC, playground controls, no horizontal overflow
- **Visual** — screenshot baselines (light/dark) for key pages
- **Lighthouse** — SEO ≥95, A11y ≥95, Best Practices ≥95, Performance ≥85

## Updating visual snapshots

See [visual-regression.md](./visual-regression.md).

## Further reading

- [running-tests.md](./running-tests.md) — local commands and debugging
- [accessibility.md](./accessibility.md) — axe audits
- [lighthouse.md](./lighthouse.md) — SEO and performance thresholds
- [visual-regression.md](./visual-regression.md) — screenshot baselines
- [ci.md](./ci.md) — GitHub Actions workflow

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PUI_TEST_BASE_URL` | `http://localhost:4000` | Docs server URL |
| `PUI_TEST_PORT` | `4000` | SSR server port |
| `CI` | — | Enables retries, fresh server, GitHub reporter |

## Adding a new docs page

1. Add route to `prerender-routes.txt`
2. Rebuild — route is auto-included in `docsAllRoutes`
3. Optionally add to `docsPriorityRoutes` in `tests/shared/routes.ts` for smoke/axe

## Philosophy

Tests validate **real user experience** — not implementation details. Use helpers in `tests/utils/` instead of duplicating selectors or waits in specs.
