# CI Quality Pipeline

Workflow: `.github/workflows/quality.yml`

## Jobs

### 1. Build SSR

- `npm ci --legacy-peer-deps`
- `npm run lint`
- `npm run build` (prerender 70+ routes)
- Uploads `dist/` artifact

### 2. Playwright E2E

- Downloads `dist/` artifact
- Installs Chromium
- `npm run test:e2e` with `CI=true`
- Uploads HTML report artifact

### 3. Lighthouse CI

- Downloads `dist/` artifact
- Starts SSR server via `lhci autorun`
- Asserts score thresholds from `lighthouserc.cjs`
- Uploads Lighthouse report artifact

## Thresholds

| Category | Minimum | Level |
|----------|---------|-------|
| SEO | 95 | error (fail build) |
| Accessibility | 95 | error |
| Best Practices | 95 | error |
| Performance | 85 | warn |

## Fixing failures

| Failure | Action |
|---------|--------|
| Console error | Fix runtime bug; check browser-only APIs in SSR |
| Axe violation | Fix ARIA/contrast/semantics in component or docs |
| Layout shift | Stabilize CSS; check code tab / sidebar transitions |
| Lighthouse SEO | Update meta tags, headings, prerender content |
| Visual diff | Review screenshot; update snapshots if intentional |

## Manual CI trigger

Push to `master`/`main` or open a pull request targeting those branches.
