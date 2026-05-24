# Visual Regression

Screenshot baselines live next to specs under `tests/e2e/visual/`.

## Run

```bash
npm run build
npm run test:visual
```

## Update baselines

After intentional UI changes:

```bash
npm run test:visual -- --update-snapshots
```

Commit the updated `*-snapshots/` directories.

## Coverage

Desktop Chromium only (tablet/mobile snapshots can be added later):

- Button overview — light & dark
- Tabs overview — light & dark
- Tabs playground — light & dark
- Select playground — light & dark

## Stability

Tests disable animations (`reducedMotion: 'reduce'`) and call `waitForStableLayout()` before capture. Max diff ratio: 2% (`playwright.config.ts`).
