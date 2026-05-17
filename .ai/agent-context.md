Use this file as shared context for any AI assistant working in Premium UI.

Project architecture:
- Angular 21 standalone components
- `src/premium-ui/components/*`: public UI components and Storybook stories
- `src/premium-ui/styles`, `src/premium-ui/tokens`, `src/premium-ui/themes`: global styling and token-based theming
- `src/app/docs`: docs shell, layout, pages, and top-level navigation
- `.storybook`: Storybook configuration for Angular with Webpack 5
- `src/premium-ui/index.ts`: library public exports

Context rules:
- Follow root `AGENTS.md` rules first
- Prefer `.github/copilot-instructions.md` for Copilot
- Prefer `.gemini/GEMINI.md` for Gemini clients
- Prefer `.windsurf/rules/*` for Windsurf-specific workflows
- Use `.ai/project-overview.md` and `.ai/agent-context.md` for generic AI context

If you update AI agent documentation, keep all instruction files consistent and avoid conflicting guidance.