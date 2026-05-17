Setup the foundation architecture for an Angular UI library called Premium UI.

Tech stack:
- Angular latest
- Standalone Components
- SCSS
- Storybook
- TypeScript

Project goals:
- lightweight architecture
- premium modern aesthetics
- excellent developer experience
- easy customization
- easy theming
- accessibility-first
- AI-friendly structure
- scalable component system
- tree-shakable components

==================================================
GLOBAL RULES
==================================================

Naming conventions:
- component selector prefix: pui
- CSS variable prefix: --pui-
- utility class prefix: pui-
- TypeScript type prefix: Pui

Folder naming:
- kebab-case

Component naming:
- PascalCase

Avoid:
- hardcoded colors
- random spacing values
- deep nesting
- unnecessary abstractions
- any type

Use:
- semantic naming
- design tokens
- modular architecture
- clean scalable structure

==================================================
CREATE PROJECT STRUCTURE
==================================================

Generate the following scalable folder structure:

src/
│
├── premium-ui/
│   ├── components/
│   │   └── button/
│   │       ├── button.component.ts
│   │       ├── button.component.html
│   │       ├── button.component.scss
│   │       ├── button.types.ts
│   │       ├── button.tokens.scss
│   │       ├── button.stories.ts
│   │       └── index.ts
│   │
│   ├── core/
│   │   ├── animations/
│   │   ├── constants/
│   │   ├── utilities/
│   │   └── services/
│   │
│   ├── tokens/
│   │   ├── colors.scss
│   │   ├── spacing.scss
│   │   ├── typography.scss
│   │   ├── radius.scss
│   │   ├── shadows.scss
│   │   ├── motion.scss
│   │   ├── z-index.scss
│   │   └── index.scss
│   │
│   ├── themes/
│   │   ├── light.scss
│   │   ├── dark.scss
│   │   └── index.scss
│   │
│   ├── styles/
│   │   ├── reset.scss
│   │   ├── utilities.scss
│   │   ├── globals.scss
│   │   └── index.scss
│   │
│   ├── types/
│   │   └── common.types.ts
│   │
│   └── index.ts
│
├── stories/
│   ├── foundations/
│   │   ├── colors.stories.mdx
│   │   ├── typography.stories.mdx
│   │   ├── spacing.stories.mdx
│   │   └── shadows.stories.mdx
│   │
│   └── introduction.mdx
│
└── styles.scss

==================================================
SETUP DESIGN TOKENS
==================================================

Generate scalable CSS variable token system.

Use semantic token naming.

==================================================
COLOR TOKENS
==================================================

Generate:
- primary
- primary-hover
- secondary
- success
- warning
- danger
- background
- surface
- border
- text
- muted
- focus-ring

Use modern premium SaaS style colors.

Style inspiration:
- Linear
- Vercel
- Stripe

Support:
- light theme
- dark theme

==================================================
SPACING TOKENS
==================================================

Use 8px-based spacing scale.

Generate:
- xxs
- xs
- sm
- md
- lg
- xl
- 2xl
- 3xl

Example naming:
--pui-space-md

==================================================
RADIUS TOKENS
==================================================

Generate:
- sm
- md
- lg
- xl
- full

Use modern soft premium radius values.

==================================================
SHADOW TOKENS
==================================================

Generate subtle premium shadows.

Include:
- sm
- md
- lg
- xl

Shadows should be:
- soft
- modern
- not overly dark

==================================================
MOTION TOKENS
==================================================

Generate:
- duration-fast
- duration-normal
- duration-slow
- easing-standard

Use smooth premium transitions.

==================================================
TYPOGRAPHY SYSTEM
==================================================

Create a scalable typography system.

Font family:
- Inter

Generate typography tokens for:
- font family
- font sizes
- font weights
- line heights
- letter spacing

==================================================
FONT SIZE SCALE
==================================================

Generate:
- xs
- sm
- md
- lg
- xl
- 2xl
- 3xl
- 4xl

==================================================
FONT WEIGHTS
==================================================

Generate:
- regular
- medium
- semibold
- bold

==================================================
LINE HEIGHTS
==================================================

Generate:
- tight
- normal
- relaxed

==================================================
SETUP STORYBOOK
==================================================

Configure Storybook properly for component library usage.

Requirements:
- dark mode support
- global styles import
- token preview support
- foundations documentation
- component categories
- accessibility addon support

Recommended categories:
- Foundations
- Components
- Forms
- Feedback
- Navigation
- Overlays

==================================================
BUTTON COMPONENT SETUP
==================================================

Generate a proper Premium UI button component.

Selector:
pui-button

Requirements:
- standalone component
- OnPush strategy
- strongly typed
- accessible
- token-based styling
- minimal DOM structure
- tree-shakable

Variants:
- primary
- secondary
- outline
- ghost
- danger

Sizes:
- sm
- md
- lg

States:
- hover
- active
- disabled
- loading
- focus-visible

Support:
- icon slot
- loading spinner
- keyboard accessibility

Generate:
- TS
- HTML
- SCSS
- Storybook stories
- types file

==================================================
IMPORTANT
==================================================

Focus on:
- clean architecture
- maintainability
- consistency
- lightweight implementation
- premium feel
- scalable design system

Avoid:
- overengineering
- large abstractions
- unnecessary dependencies
- overly complex theming systems