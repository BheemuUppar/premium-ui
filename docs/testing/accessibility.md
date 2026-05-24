# Accessibility Testing

Premium UI uses [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) for automated WCAG-oriented checks.

## Run

```bash
npm run build
npm run test:a11y
```

## Coverage

- All routes in `docsPriorityRoutes` (`tests/shared/routes.ts`)
- Button docs in dark mode (contrast + theme tokens)

## What fails the build

Any axe **violations** on docs platform chrome (navigation, tabs, prose, code blocks). Component demo surfaces inside `.pui-doc-example__preview` and `.pui-playground` are excluded — those are validated via Storybook `@storybook/addon-a11y`.

## Adding coverage

Add the route to `docsPriorityRoutes` in `tests/shared/routes.ts` after the page is prerendered.

## Keyboard checks

Responsive specs validate mobile TOC and playground interactions. For manual keyboard QA, tab through:

1. Sidebar navigation
2. Doc tabs
3. Code example expand / tab switch
4. Theme toggle
5. Playground controls
