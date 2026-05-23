# Angular Rules for AI Agents

- Always prefer standalone components.
- Use `ChangeDetectionStrategy.OnPush` for components.
- Use `inject()` where appropriate; avoid constructor DI unless necessary.
- Use signals and `computed()` for component-local state when helpful.
- Avoid `@HostBinding` and `@HostListener`; use `host` in decorators instead.
- Inline templates for small components; external files for larger ones.
- Follow repository token system for styling.