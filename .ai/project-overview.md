Premium UI is a lightweight Angular UI library and docs shell built for Angular 21.

Key structure:
- `src/premium-ui`: component library source, Storybook stories, themes, tokens, utilities, and shared styling
- `src/app`: documentation application shell, docs pages, layout, and navigation
- `.storybook`: Storybook configuration and preview setup for Angular with Webpack 5
- `package.json`: Angular 21.2, Storybook 10.4, TypeScript 5.9

Important conventions:
- Standalone components only
- Signal-based local state
- SCSS variables and CSS custom properties for theming
- Component stories live next to component source files
- Docs pages are lazy-loaded under `src/app/docs/pages`
- Avoid new NgModules in modern code
- Shared internal architecture lives under `src/premium-ui/internal/` — see `.ai/architecture.md`

AI assistants should read this file before making architecture or component-level changes.