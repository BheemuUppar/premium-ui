# Premium UI Architecture Review Rules

IMPORTANT

Before implementing ANY component, feature, service, utility, API, directive, overlay, data source, table feature, form feature, documentation feature, or infrastructure change:

STOP.

Review the current architecture first.

Do NOT immediately implement code.

You must first determine whether the proposed implementation is scalable and maintainable long-term.

---

# PRIMARY OBJECTIVE

Premium UI is not a demo project.

Premium UI is intended to become:

- reusable
- scalable
- maintainable
- enterprise-grade
- Angular-native
- SSR-compatible

Every implementation must be evaluated against:

- Angular Material
- Angular CDK
- PrimeNG
- AG Grid
- TanStack Table
- Radix UI

Do not compare against small demo libraries.

---

# REVIEW PROCESS

Before implementing any feature:

Create an Architecture Review section.

Review:

1. Current implementation
2. Scalability
3. Maintainability
4. API quality
5. Extensibility
6. Accessibility
7. SSR compatibility
8. Performance
9. Developer experience
10. Future growth

Only after review:
propose implementation.

---

# QUESTIONS TO ASK

For every feature ask:

### Is this scalable?

Will this still work if:

- 10 developers use it?
- 100 screens use it?
- 500 components depend on it?

If not:
redesign.

---

### Is this extensible?

Can developers customize:

- UI
- templates
- actions
- content
- behavior

without modifying library code?

If not:
redesign.

---

### Is this creating prop hell?

Bad:

```ts
[exportIcon]
[exportLabel]
[exportVariant]
[exportPosition]
[exportSize]
```

Good:

```html
<ng-template puiTableToolbar>
```

Prefer composition over excessive inputs.

---

### Is this content-driven?

Bad:

```ts
dialog.confirm(...)
```

Good:

```ts
dialog.open(Component)
```

Prefer primitives over specialized APIs.

---

### Is this Angular-native?

Prefer:

- directives
- content projection
- templates
- signals
- inject()

Avoid:
React-style patterns that feel unnatural in Angular.

---

### Is this reusable?

Can the implementation be reused by:

- Dialog
- Drawer
- Tooltip
- Popover
- Context Menu
- Command Palette

If yes:
extract infrastructure.

If no:
avoid premature abstraction.

---

### Is this SSR-safe?

Verify:

- no window usage
- no document usage
- browser guards exist
- hydration safe

---

### Is this testable?

Can it be tested through:

- Playwright
- unit tests
- integration tests

without hacks?

If not:
redesign.

---

# API DESIGN RULES

---

## Support Progressive Complexity

Simple usage should stay simple.

Example:

```html
<pui-table [data]="users" />
```

Advanced usage should remain possible.

Example:

```html
<pui-table>
  <ng-template puiTableToolbar>
  </ng-template>
</pui-table>
```

Support both.

---

## Never Force Enterprise Configuration

Bad:

```ts
columns = [
  {
    key:'name',
    sortable:true
  }
]
```

for every simple table.

Prefer:

```ts
columns = ['name']
```

and normalize internally.

---

## Prefer Composition

Bad:

```ts
dialog.confirm()
dialog.warning()
dialog.success()
```

Good:

```ts
dialog.open(Component)
```

Let developers compose.

---

## Return References

Services should return references.

Example:

```ts
const dialogRef = dialog.open(...)
```

Not:

```ts
dialog.open(...)
```

without control.

Developers must be able to:

- subscribe
- update
- close
- interact

after opening.

---

# OVERLAY RULES

Any overlay-based component:

- Dialog
- Drawer
- Tooltip
- Popover
- Select
- Command Palette

must reuse shared overlay infrastructure.

Do not duplicate overlay logic.

Prefer Angular CDK Overlay.

---

# TABLE RULES

Tables must:

- support string columns
- support config columns
- support templates
- support custom columns
- support worker delegation

Do not hardcode:

- actions columns
- export buttons
- toolbar layouts

Use composition.

---

# DOCUMENTATION RULES

Every example must be runnable.

If HTML references:

```ts
users
columns
filters
```

then TS examples must define them.

Never show incomplete snippets.

---

# PERFORMANCE RULES

Before adding new logic:

Ask:

Can this run in a Worker?

Examples:

- filtering
- searching
- sorting
- grouping
- ranking

Prefer worker delegation.

---

# COMPONENT COMPLETION CHECKLIST

Before marking component complete:

Verify:

✅ API reviewed
✅ Architecture reviewed
✅ SSR reviewed
✅ Accessibility reviewed
✅ Storybook updated
✅ Docs updated
✅ Playground updated
✅ Playwright tests added
✅ Responsive verified
✅ Dark theme verified
✅ Light theme verified

Only then:
consider component complete.

---

# FINAL RULE

Do not optimize for:

"fastest implementation"

Optimize for:

"best architecture after 2 years of growth"

Every implementation should answer:

Would Angular Material, PrimeNG, AG Grid, or Radix architects approve this design?

If not:
reconsider before coding.