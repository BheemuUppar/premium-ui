# Running Tests Locally

## Prerequisites

- Node.js 20+
- Chromium (installed via `npx playwright install chromium`)

## SSR server

E2E tests target the **production SSR build**, not `ng serve`.

```bash
npm run build
npm run serve:ssr:test   # http://localhost:4000
```

Playwright starts this automatically unless a server is already running (local dev).

## Commands

```bash
npm run test:e2e              # All Playwright projects (desktop, tablet, mobile)
npm run test:e2e:smoke        # Priority routes only
npm run test:e2e:routes       # All prerender routes
npm run test:a11y             # Axe accessibility
npm run test:visual           # Screenshot regression
npm run test:lighthouse       # Lighthouse CI
npm run test:all              # build + e2e + lighthouse
```

## Interactive debugging

```bash
npx playwright test --ui
npx playwright test tests/e2e/docs/docs-smoke.spec.ts --debug
```

## View reports

After a run:

```bash
npx playwright show-report tests/reports/playwright
```

Lighthouse HTML reports: `tests/reports/lighthouse/`
