# Premium UI Internal Architecture

Premium UI is entering the **consistency > speed** phase. All components must reuse shared internal foundations under `src/premium-ui/internal/`.

> **Note:** `internal/` is for component authoring only. It is **not** exported from the public library entry (`src/premium-ui/index.ts`).

## Module Map

| Module | Purpose | Used by |
|--------|---------|---------|
| `accessibility/` | ARIA helpers, focus utilities, roving tabindex | checkbox, select, future menu/tabs/dialog |
| `animations/` | Motion token constants | components referencing CSS motion vars |
| `forms/` | `PuiCvaBridge`, `providePuiCva()`, form state types | checkbox, checkbox-group, select |
| `interactions/` | Shared interaction state types | all interactive components |
| `keyboard/` | `PUI_KEYS`, navigation/activation/typeahead helpers | select, future listbox/menu |
| `overlay/` | Overlay panel classes and config types | select, future tooltip/dialog |
| `positioning/` | CDK connected positions, offset constants | select, future popover/tooltip |
| `scroll/` | Body scroll lock for overlays | future dialog/drawer |
| `selection/` | Selection utils, checkbox group DI token | select, checkbox, checkbox-group |
| `state/` | Disabled state helpers, boolean attribute transform | form controls |
| `styles/` | SCSS mixins: focus ring, disabled, form control, motion | all component SCSS |
| `theming/` | Theme context resolution from DOM | select panel, future themed overlays |
| `tokens/` | Semantic token type conventions | component token files |
| `utilities/` | ID generation, host binding helpers | all components |
| `virtualization/` | Virtual scroll defaults | select, future data-table |

## API Consistency Rules

### Common inputs (reuse across components)

- `size`: `'sm' | 'md' | 'lg'`
- `variant`: `'default' | 'filled' | 'outlined' | 'soft' | 'ghost' | 'minimal'`
- `disabled`, `readOnly`, `loading`, `invalid`

### Common events

- `valueChange`, `checkedChange`, `openChange`, `selectedChange`

### Form integration

All form controls implementing `ControlValueAccessor` must use:

```typescript
providers: [providePuiCva(MyComponent)]
private readonly cva = new PuiCvaBridge<T>();
```

Never duplicate CVA callback boilerplate.

### Styling

- Import shared mixins from `internal/styles/`
- Use semantic tokens from `tokens/` — no hardcoded colors, spacing, or shadows
- Motion uses `--pui-duration-*` and `--pui-easing-*` tokens

### Focus

Use `@include pui-focus.pui-focus-ring` instead of inline outline styles.

## Component Checklist

When adding or refactoring a component:

1. Reuse `PuiSize`, `PuiVariant` from `types/common.types.ts`
2. Wire CVA through `internal/forms/` if form-integrated
3. Use `internal/accessibility/` for ARIA and focus patterns
4. Use `internal/keyboard/` for key handling
5. Use `internal/selection/` for multi/single selection logic
6. Use `internal/styles/` mixins in SCSS
7. Follow Storybook structure: Overview, Variants, Sizes, States, Forms, Accessibility, Dark Theme, Playground
8. Follow docs structure: Overview, Examples, API Guide, Accessibility, Theming, Playground

## Storybook & Docs Standardization

Each component story file should include these story groups (when applicable):

- Overview
- Variants
- Sizes
- States
- Forms
- Accessibility
- Dark Theme
- Playground

Each docs page should include:

- Overview
- Examples
- API Guide
- Accessibility
- Theming
- Playground

## Migration Status

| Component | CVA bridge | Selection utils | Keyboard utils | Focus mixin |
|-----------|------------|-----------------|----------------|-------------|
| button | — | — | — | yes |
| input | pending | — | — | yes |
| card | — | — | — | yes |
| select | yes | yes | yes | yes |
| checkbox | yes | yes (group token) | — | yes |
