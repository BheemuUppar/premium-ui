# Debugging Skill

- Steps to diagnose template parse errors:
  1. Run `ng build` and capture errors.
  2. Open the reported template file and inspect `@switch/@for` blocks.
  3. Move raw code snippets with braces into component TS strings.
  4. Fix unclosed tags and invalid ICU messages.
- Storybook troubleshooting:
  - Run `npm run storybook` and fix any `Unexpected token` in story files.