# Lighthouse Audits

Lighthouse CI runs against **prerendered static HTML** in `dist/premium-ui/browser` (no Express server required).

## Run

```bash
npm run build
npm run test:lighthouse
```

Reports are written to `tests/reports/lighthouse/`.

## Audited routes

Configured in `lighthouserc.cjs` and mirrored in `lighthouseRoutes` (`tests/shared/routes.ts`):

- Button overview & playground
- Tabs overview & playground
- Select overview & playground

## Thresholds

| Category | Minimum |
|----------|---------|
| SEO | 95 |
| Accessibility | 95 |
| Best Practices | 95 |
| Performance | 85 (warn) |

Performance is a **warning** initially; SEO, accessibility, and best practices **fail** CI.

## Updating routes

1. Add URL to `lighthouserc.cjs` → `ci.collect.url`
2. Add path to `lighthouseRoutes` in `tests/shared/routes.ts`
3. Rebuild and run `npm run test:lighthouse`
