# Premium UI

A premium Angular 21 component library and interactive documentation site. Premium UI pairs a token-driven design system with standalone, accessible components and a calm, structured docs experience inspired by modern product UI (Linear, Vercel, Stripe).

---

## Highlights

- **Angular 21** — standalone components, signals, native control flow, OnPush change detection
- **Token-first theming** — semantic colors, typography, spacing, shadows, and motion via CSS custom properties
- **Light & dark mode** — theme applied on `app-root` via `[data-theme]`; Storybook theme toolbar included
- **Accessible by default** — WCAG AA targets, keyboard navigation, focus management, AXE-friendly patterns
- **Composable architecture** — shared internal foundations under `src/premium-ui/internal/`
- **Preview-first docs** — live examples with collapsed code-on-demand via `pui-doc-example`
- **Storybook 10** — co-located stories with a11y addon and Compodoc integration

---

## Components

| Component | Selector prefix | Status |
|-----------|-----------------|--------|
| Button | `pui-button` | Ready |
| Input | `pui-input` | Ready |
| Card | `pui-card`, `pui-card-*` | Ready |
| Select | `pui-select` | Ready |
| Checkbox | `pui-checkbox`, `pui-checkbox-group` | Ready |
| Radio | `pui-radio`, `pui-radio-group` | Ready |
| Switch | `pui-switch` | Ready |
| Toggle | `pui-toggle`, `pui-toggle-group` | Ready |
| Tabs | `pui-tabs`, `pui-tab-item`, `pui-tab-panel` | Ready |

Public exports live in [`src/premium-ui/index.ts`](src/premium-ui/index.ts).

---

## Quick start

### Prerequisites

- **Node.js** 20+
- **npm** 11+ (see `packageManager` in `package.json`)

### Install

```bash
npm install
```

### Development server (docs app)

```bash
npm start
# or: ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app redirects to the Button docs overview by default.

### Storybook

```bash
npm run storybook
```

Browse isolated component stories with light/dark theme switching and accessibility checks.

### Build

```bash
npm run build              # docs application → dist/premium-ui
npm run build-storybook    # static Storybook build
```

### Test & lint

```bash
npm test                   # Vitest via Angular CLI
npm run lint               # ESLint (angular-eslint)
```

---

## Project structure

```
premium-ui/
├── src/
│   ├── premium-ui/              # Component library source
│   │   ├── components/          # Public UI components + co-located stories
│   │   ├── internal/            # Shared foundations (not publicly exported)
│   │   ├── tokens/              # Global design tokens (colors, type, spacing, …)
│   │   ├── themes/              # Light/dark theme definitions
│   │   ├── styles/              # Global base styles
│   │   └── index.ts             # Library public API
│   │
│   └── app/
│       ├── docs/                # Documentation shell
│       │   ├── pages/           # Lazy-loaded component docs pages
│       │   ├── shared/          # Doc primitives (pui-doc-*)
│       │   ├── shell/           # Sidebar, layout chrome
│       │   └── tokens/          # Docs-specific tokens & rhythm
│       └── app.routes.ts        # Docs routing
│
├── .storybook/                  # Storybook config & preview
├── .ai/                         # Shared AI / architecture context
└── AGENTS.md                    # Agent & contributor coding standards
```

---

## Architecture

Premium UI separates **library code** from the **docs application**:

- **`src/premium-ui`** — tree-shakable components consumers would import. Internal helpers under `internal/` stay private.
- **`src/app/docs`** — documentation shell only; uses `pui-doc-*` primitives, not ad-hoc markup for tables, code blocks, or examples.

Key internal modules (see [`.ai/architecture.md`](.ai/architecture.md)):

| Module | Purpose |
|--------|---------|
| `accessibility/` | ARIA helpers, focus utilities, roving tabindex |
| `forms/` | `PuiCvaBridge`, `providePuiCva()` for ControlValueAccessor |
| `keyboard/` | Key constants and navigation helpers |
| `styles/` | SCSS mixins — focus ring, disabled, motion |
| `selection/` | Single/multi selection utilities |
| `overlay/`, `positioning/` | Overlay panel patterns (select, future popovers) |

Form controls integrate with Angular Reactive Forms through the shared CVA bridge — never duplicate CVA boilerplate per component.

---

## Theming

Themes are applied on the root host:

```html
<app-root data-theme="light"><!-- or dark --></app-root>
```

Global tokens are defined in `src/premium-ui/tokens/` and composed in `src/premium-ui/themes/`. Components consume **semantic tokens** only:

```scss
.my-component {
  color: var(--pui-color-text);
  background: var(--pui-elevation-1);
  border: 1px solid var(--pui-color-border);
  border-radius: var(--pui-radius-md);
  box-shadow: var(--pui-shadow-sm);
}
```

Do not hardcode colors, spacing, or shadows in component styles. See [`.ai/tokens.md`](.ai/tokens.md) and [`.ai/rules/tokens.rules.md`](.ai/rules/tokens.rules.md).

---

## Documentation site

Docs live at `/docs/components/:component/:tab`. Each component page typically includes:

| Tab | Content |
|-----|---------|
| Overview | Introduction, variants, common patterns |
| Examples | Live previews via `pui-doc-example` |
| API Guide | Inputs, outputs, types via `pui-doc-api-table` |
| Accessibility | Keyboard shortcuts & a11y notes |
| Theming | Token overrides and customization |
| Playground | Interactive controls via `pui-doc-playground` |

### Doc primitives

Shared building blocks in `src/app/docs/shared/`:

| Component | Purpose |
|-----------|---------|
| `pui-doc-example` | Preview-first example card; code expands on demand |
| `pui-doc-code-block` | IDE-style syntax-highlighted snippets |
| `pui-doc-api-table` | API reference with typed badges |
| `pui-doc-section` | Section with anchor, title, description |
| `pui-doc-playground` | Live control + preview layout |
| `pui-doc-a11y-list` | Accessibility requirement tables |
| `pui-doc-keyboard-shortcuts` | Keyboard interaction reference |

Docs use centralized **vertical rhythm tokens** (`--pui-doc-section-gap`, `--pui-doc-prose-line-height`, etc.) defined in `src/app/docs/tokens/docs.tokens.scss`. Doc surface tokens must stay on the theme host (`app-root`), not `:root`, so dark mode elevation colors inherit correctly.

---

## Design tokens

| Category | Location |
|----------|----------|
| Colors & surfaces | `src/premium-ui/tokens/colors.scss` |
| Typography | `src/premium-ui/tokens/typography.scss` |
| Spacing | `src/premium-ui/tokens/spacing.scss` |
| Shadows | `src/premium-ui/tokens/shadows.scss` |
| Motion | `src/premium-ui/internal/styles/_motion.scss` |
| Scrollbars | `src/premium-ui/tokens/scrollbars.scss` |
| Doc rhythm | `src/app/docs/tokens/docs.tokens.scss` |

Typography defaults target a calm reading experience: body line-height ~1.65–1.7, headings with tight tracking, and doc prose capped at ~70ch.

---

## Accessibility

Every component must:

- Pass AXE checks in Storybook (a11y addon enabled)
- Meet WCAG AA contrast and focus visibility requirements
- Support keyboard interaction where applicable
- Expose correct ARIA roles, states, and labels

See [`.ai/accessibility.md`](.ai/accessibility.md) and [`.ai/rules/accessibility.rules.md`](.ai/rules/accessibility.rules.md).

---

## Storybook

Stories are co-located with components (`*.stories.ts`). Standard story groups:

- Overview
- Variants
- Sizes
- States
- Forms (when applicable)
- Accessibility
- Dark Theme
- Playground

Storybook preview applies `[data-theme]` from the toolbar global, matching the docs app behavior.

---

## Contributing

See **[CONTRIBUTOR.md](CONTRIBUTOR.md)** for development workflow, component checklist, docs migration patterns, and pull request guidelines.

Also read:

- [`AGENTS.md`](AGENTS.md) — Angular & TypeScript conventions
- [`.ai/architecture.md`](.ai/architecture.md) — internal module map
- [`.ai/project-overview.md`](.ai/project-overview.md) — high-level orientation

---

## Tech stack

| Tool | Version |
|------|---------|
| Angular | 21.2 |
| TypeScript | 5.9 |
| Storybook | 10.4 |
| Vitest | 4.x |
| ESLint | 10.x (angular-eslint) |
| Sass | Dart Sass (via Angular build) |

---

## Scripts reference

| Command | Description |
|---------|-------------|
| `npm start` | Dev server for docs app |
| `npm run build` | Production build |
| `npm run watch` | Development build with watch |
| `npm run storybook` | Storybook dev server |
| `npm run build-storybook` | Static Storybook export |
| `npm test` | Unit tests |
| `npm run lint` | ESLint |
