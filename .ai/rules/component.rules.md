# Component Rules

- Small, focused components with single responsibility.
- Use content projection for flexible slotting.
- Use `input()`/`output()` functions instead of decorators for inputs/outputs.
- Keep DOM lightweight and avoid unnecessary wrappers.
- Prefer inline templates for very small components.

## Native First API Rule

If a native browser event already exists, prefer the native event name for `output()`:

| Native event | Use |
|---|---|
| click | `(click)` |
| input | `(input)` |
| change | `(change)` |
| focus | `(focus)` |
| blur | `(blur)` |
| keydown | `(keydown)` |
| keyup | `(keyup)` |

Do **not** invent custom names unless behavior is meaningfully different.

**Bad:** `(pressed)`, `(valueChanged)`, `(textInput)`, `(focused)`, `(blurred)`

**Good:** `(click)`, `(input)`, `(change)`, `(focus)`, `(blur)`

**Custom names are allowed** for component-specific behavior:

- `(selectionChange)` — select, tabs, radio-group, toggle-group
- `(afterClosed)` — dialog ref lifecycle
- `(sortChange)`, `(pageChange)`, `(searchChange)` — table domain events
- `(openChange)` — overlay/panel open state

### Angular `model()` exception

Two-way binding requires `propertyChange` outputs (`[(value)]` ↔ `(valueChange)`).
That suffix is framework convention — not a custom alias. Prefer `selectionChange`
for **read-only** selection listeners when a component also exposes `model()`.