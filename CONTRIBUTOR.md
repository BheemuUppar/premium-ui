# Contributing to Premium UI

Thank you for helping improve Premium UI. This guide covers local setup, conventions, and the checklist we expect before opening a pull request.

For coding standards shared with AI assistants, also read [`AGENTS.md`](AGENTS.md) and [`.ai/architecture.md`](.ai/architecture.md).

---

## Development setup

1. **Clone** the repository and install dependencies:

   ```bash
   npm install
   ```

2. **Start the docs app** to verify changes in context:

   ```bash
   npm start
   ```

3. **Start Storybook** when working on component visuals or states:

   ```bash
   npm run storybook
   ```

4. **Run checks** before submitting:

   ```bash
   npm run build
   npm run lint
   npm test
   ```

---

## What belongs where

| Path | Purpose | Exported? |
|------|---------|-----------|
| `src/premium-ui/components/` | Public UI components | Yes — via `index.ts` |
| `src/premium-ui/internal/` | Shared foundations (CVA, a11y, keyboard, mixins) | No |
| `src/premium-ui/tokens/`, `themes/` | Global design tokens | Indirectly (CSS vars) |
| `src/app/docs/` | Documentation application | App-only |
| `src/app/docs/shared/` | Doc primitives (`pui-doc-*`) | App-only |
| `.storybook/` | Storybook configuration | Dev-only |

**Rule:** library code must not import from `src/app/docs`. Docs may import from `src/premium-ui`.

---

## Coding conventions

### Angular

- **Standalone components only** — do not add NgModules
- Do **not** set `standalone: true` in decorators (default in Angular 21+)
- Use `input()` / `output()` instead of `@Input` / `@Output`
- Use **signals** and `computed()` for local state; never `mutate` signals
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Put host bindings in the `host` object — no `@HostBinding` / `@HostListener`
- Use native control flow: `@if`, `@for`, `@switch`
- Prefer **Reactive Forms** over template-driven forms
- Use `inject()` instead of constructor injection for services
- No `ngClass` / `ngStyle` — use `class` and `style` bindings

### TypeScript

- Strict typing; avoid `any`, prefer `unknown` when uncertain
- Prefer type inference when obvious

### Naming

| Item | Convention | Example |
|------|------------|---------|
| Selector | `pui-` prefix, kebab-case | `pui-button` |
| Component class | `Pui` + PascalCase | `PuiButtonComponent` |
| Types | `Pui` + PascalCase | `PuiButtonVariant` |
| Files | kebab-case | `button.component.ts` |
| CSS custom properties | `--pui-*` | `--pui-color-primary` |

See [`.ai/naming-conventions.md`](.ai/naming-conventions.md).

---

## Adding a new component

Follow this order. Prompts and templates in `.ai/prompts/` and `.ai/templates/` can accelerate scaffolding.

### 1. Create the component folder

```
src/premium-ui/components/my-component/
├── my-component.component.ts
├── my-component.component.html
├── my-component.component.scss
├── my-component.tokens.scss      # component-scoped token overrides
├── my-component.types.ts
├── my-component.stories.ts
├── my-component.stories.scss     # optional story-only styles
└── index.ts                      # re-exports
```

### 2. Implement with shared foundations

- Import SCSS mixins from `src/premium-ui/internal/styles/` (focus ring, disabled, motion)
- Use semantic tokens — no hardcoded colors, spacing, or shadows
- Reuse shared types from `src/premium-ui/types/common.types.ts` (`PuiSize`, `PuiVariant`, etc.)
- Wire **ControlValueAccessor** through `providePuiCva()` + `PuiCvaBridge` for form controls
- Use `internal/accessibility/` and `internal/keyboard/` where interaction is non-trivial

### 3. Export from the library

Add the barrel export to [`src/premium-ui/index.ts`](src/premium-ui/index.ts).

### 4. Add Storybook stories

Co-locate `*.stories.ts` with the component. Include these groups when applicable:

- Overview
- Variants
- Sizes
- States
- Forms
- Accessibility
- Dark Theme
- Playground

Verify both light and dark themes via the Storybook toolbar. Confirm the a11y addon reports no violations.

See [`.ai/storybook.md`](.ai/storybook.md) and [`.ai/rules/storybook.rules.md`](.ai/rules/storybook.rules.md).

### 5. Add a documentation page

Create a lazy-loaded page under `src/app/docs/pages/my-component-docs/`:

```
my-component-docs/
├── my-component-docs.component.ts
├── my-component-docs.component.html
└── my-component-docs.component.scss   # page-specific overrides only
```

Register routes in [`src/app/app.routes.ts`](src/app/app.routes.ts) and add sidebar entry in [`src/app/docs/shell/docs-sidebar.component.html`](src/app/docs/shell/docs-sidebar.component.html).

#### Docs page structure

Each component docs page should include these tabs:

| Tab | Content |
|-----|---------|
| Overview | Intro copy, feature lists, primary examples |
| Examples | `pui-doc-example` cards (preview-first, code collapsed) |
| API Guide | `pui-doc-api-table` for inputs, outputs, types |
| Accessibility | `pui-doc-a11y-list`, `pui-doc-keyboard-shortcuts` |
| Theming | Token customization examples |
| Playground | `pui-doc-playground` with live controls |

#### Use doc primitives — do not reinvent

| Need | Use |
|------|-----|
| Live example + optional code | `pui-doc-example` |
| Syntax-highlighted snippet | `pui-doc-code-block` (inside collapsed example) |
| API reference table | `pui-doc-api-table` |
| Section with anchor ID | `pui-doc-section` or `.pui-doc-section` |
| Page shell (header + tabs) | `pui-doc-layout`, `pui-doc-header`, `pui-doc-tabs-nav` |
| Interactive demo | `pui-doc-playground` |

**Do not** place bare `pui-doc-code-block` in page HTML for examples — wrap previews in `pui-doc-example` so code is on-demand.

Example pattern:

```html
<pui-doc-example
  exampleId="button-primary"
  title="Primary button"
  description="Default call-to-action style."
  [htmlCode]="primaryHtml"
  [hideTs]="true"
>
  <pui-button variant="primary">Save changes</pui-button>
</pui-doc-example>
```

Stack examples in `.pui-doc-examples` for consistent vertical rhythm.

See [`.ai/prompts/create-docs.prompt.md`](.ai/prompts/create-docs.prompt.md).

### 6. Verify theming

- Component works in **light** and **dark** mode
- Doc surfaces inherit correctly (doc tokens on `app-root`, not `:root`)
- Focus rings are visible in both themes

---

## Styling rules

### Components

```scss
@use '../../internal/styles/focus' as pui-focus;

:host {
  @include pui-focus.pui-focus-ring;
}

.my-element {
  color: var(--pui-color-text);
  background: var(--pui-elevation-1);
  padding: var(--pui-space-md);
  border-radius: var(--pui-radius-md);
  transition: background-color var(--pui-duration-fast) var(--pui-easing-standard);
}
```

### Docs pages

- Prefer global doc rhythm from `docs.tokens.scss` and `docs.scss`
- Avoid page-level margin/padding patches — fix spacing at the token or primitive level
- Keep prose within `--pui-doc-reading-max` (~70ch)
- Use `--pui-doc-prose-line-height` (1.7) for body copy

### Anti-patterns

- Hardcoded hex/rgb colors in component SCSS
- Inline `outline` styles instead of the focus mixin
- Duplicated CVA callback wiring
- `ngClass` / `ngStyle` in templates
- Doc tokens defined on `:root`

---

## Accessibility checklist

Before marking a component ready:

- [ ] Keyboard operable (Tab, Enter/Space, arrows where expected)
- [ ] Visible focus indicator on all interactive elements
- [ ] Correct ARIA roles, labels, and states (`aria-*`, `role`)
- [ ] Color contrast meets WCAG AA
- [ ] Storybook a11y addon passes
- [ ] Docs Accessibility tab documents keyboard behavior

See [`.ai/accessibility.md`](.ai/accessibility.md).

---

## API consistency

Reuse shared input names across components where applicable:

| Input | Values |
|-------|--------|
| `size` | `'sm' \| 'md' \| 'lg'` |
| `variant` | `'default' \| 'filled' \| 'outlined' \| 'soft' \| 'ghost' \| 'minimal'` (+ component-specific) |
| `disabled`, `readOnly`, `loading`, `invalid` | `boolean` |

Common outputs: `valueChange`, `checkedChange`, `openChange`, `selectedChange`.

---

## Pull request checklist

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `npm test` passes (or explain why tests are not applicable)
- [ ] Storybook stories added/updated for component changes
- [ ] Docs page updated when public API or behavior changes
- [ ] Light and dark themes verified
- [ ] Accessibility checked (keyboard + a11y addon)
- [ ] No hardcoded design values introduced
- [ ] Public exports updated in `src/premium-ui/index.ts` if adding components
- [ ] Routes and sidebar updated for new docs pages

### Commit messages

Follow existing style — short imperative subject with scope:

```
feat(button): add loading state with spinner
fix(docs): correct section spacing in layout grid
refactor(select): migrate keyboard handling to internal utils
```

---

## AI-assisted development

This repo includes shared context for AI coding assistants:

| File | Audience |
|------|----------|
| `AGENTS.md` | All agents — primary coding rules |
| `.ai/project-overview.md` | Architecture orientation |
| `.ai/architecture.md` | Internal module map & checklist |
| `.ai/prompts/create-component.prompt.md` | Component scaffolding |
| `.ai/prompts/create-docs.prompt.md` | Docs page scaffolding |
| `.ai/prompts/create-story.prompt.md` | Storybook scaffolding |
| `.github/copilot-instructions.md` | GitHub Copilot |
| `.gemini/GEMINI.md` | Gemini |
| `.windsurf/rules/` | Windsurf |

When updating conventions, keep these files consistent — avoid conflicting guidance across agent instruction files.

---

## Getting help

- Browse existing components (`button`, `select`, `tabs`) as reference implementations
- Read [`.ai/patterns/`](.ai/patterns/) for established component patterns
- Check Storybook for visual/state coverage before docs work

Questions or larger design decisions? Open an issue or discuss in your PR description before large refactors.
