import type { PuiDocsComponentSeo, PuiDocsSeoTabMeta } from './docs-seo.types';
import { CHART_DOC_PAGES } from '../pages/charts-docs/charts-docs.registry';

function tabs(
  overview: string,
  examples: string,
  api: string,
  accessibility: string,
  theming: string,
  playground: string,
  prefix: string
): Readonly<Record<string, PuiDocsSeoTabMeta>> {
  return {
    overview: { title: `${prefix} — Overview`, description: overview },
    examples: { title: `${prefix} — Examples`, description: examples },
    api: { title: `${prefix} — API Reference`, description: api },
    accessibility: { title: `${prefix} — Accessibility`, description: accessibility },
    theming: { title: `${prefix} — Theming`, description: theming },
    playground: { title: `${prefix} — Playground`, description: playground },
  };
}

export const DOCS_COMPONENT_SEO: Readonly<Record<string, PuiDocsComponentSeo>> = {
  button: {
    slug: 'button',
    name: 'Button',
    titlePrefix: 'Angular Button Component',
    keywords: 'angular button, angular button component, accessible button angular, premium ui button',
    tabs: tabs(
      'Build accessible Angular buttons with primary, secondary, outline, ghost, and danger variants. Includes loading states, icon slots, keyboard support, and token-based theming.',
      'Angular button examples — variants, sizes, loading, disabled, and icon patterns for SaaS dashboards and forms.',
      'Complete API reference for pui-button inputs, outputs, types, and host bindings.',
      'WCAG AA button guidance — focus rings, aria-busy for loading, disabled semantics, and keyboard activation.',
      'Customize buttons with CSS variables and Premium UI design tokens.',
      'Interactive Angular button playground — tune variant, size, loading, and disabled states.',
      'Angular Button Component'
    ),
    relatedLinks: [
      { label: 'Input', route: ['/docs/components/input/overview'] },
      { label: 'Checkbox', route: ['/docs/components/checkbox/overview'] },
      { label: 'Tabs', route: ['/docs/components/tabs/overview'] },
    ],
  },
  input: {
    slug: 'input',
    name: 'Input',
    titlePrefix: 'Angular Input Component',
    keywords: 'angular input, angular text field, accessible input angular, premium ui input',
    tabs: tabs(
      'Accessible Angular text inputs with labels, hints, validation states, and Reactive Forms integration.',
      'Angular input examples — default, filled, error, disabled, and prefix/suffix patterns.',
      'API reference for pui-input — inputs, outputs, and ControlValueAccessor integration.',
      'Input accessibility — label association, aria-invalid, and keyboard focus order.',
      'Theme inputs with semantic Premium UI tokens and CSS variables.',
      'Live input playground for size, variant, invalid, and disabled combinations.',
      'Angular Input Component'
    ),
    relatedLinks: [
      { label: 'Button', route: ['/docs/components/button/overview'] },
      { label: 'Select', route: ['/docs/components/select/overview'] },
    ],
  },
  card: {
    slug: 'card',
    name: 'Card',
    titlePrefix: 'Angular Card Component',
    keywords: 'angular card, composable card angular, dashboard card ui, premium ui card',
    tabs: tabs(
      'Composable Angular card primitives for dashboards, SaaS metrics, ecommerce, and media layouts.',
      'Card examples — revenue cards, media cards, stat grids, and stacked compositions.',
      'API for pui-card and card primitives — inputs, projection slots, and composition.',
      'Card accessibility — semantic structure and heading hierarchy guidance.',
      'Card theming — elevation, borders, radius, and surface colors.',
      'Card playground for density, variants, and slot combinations.',
      'Angular Card Component'
    ),
    relatedLinks: [
      { label: 'Button', route: ['/docs/components/button/overview'] },
      { label: 'Tabs', route: ['/docs/components/tabs/overview'] },
    ],
  },
  select: {
    slug: 'select',
    name: 'Select',
    titlePrefix: 'Angular Select Component',
    keywords: 'angular select, accessible select angular, angular dropdown, virtual scroll select',
    tabs: tabs(
      'Angular select with single/multi selection, search, virtual scroll, async options, and optional Web Worker filtering.',
      'Select examples — single, multi, searchable, grouped, and reactive form integration.',
      'Select API — options model, value types, overlay config, and worker inputs.',
      'Accessible select — listbox roles, typeahead, and keyboard navigation.',
      'Theme select panels and triggers with Premium UI tokens.',
      'Interactive select playground with search and multi-select.',
      'Angular Select Component'
    ),
    relatedLinks: [
      { label: 'Input', route: ['/docs/components/input/overview'] },
      { label: 'Checkbox', route: ['/docs/components/checkbox/overview'] },
    ],
  },
  checkbox: {
    slug: 'checkbox',
    name: 'Checkbox',
    titlePrefix: 'Angular Checkbox Component',
    keywords: 'angular checkbox, accessible checkbox angular, indeterminate checkbox',
    tabs: tabs(
      'Angular checkbox and checkbox group with indeterminate state, sizes, variants, and forms integration.',
      'Checkbox examples — single, group, indeterminate parent, and validation states.',
      'Checkbox API — checkedChange, group selection, and CVA wiring.',
      'Checkbox a11y — aria-checked indeterminate and group labelling.',
      'Customize checkbox tokens — radius, colors, and focus ring.',
      'Checkbox playground for size, variant, and indeterminate toggles.',
      'Angular Checkbox Component'
    ),
    relatedLinks: [
      { label: 'Radio', route: ['/docs/components/radio/overview'] },
      { label: 'Switch', route: ['/docs/components/switch/overview'] },
    ],
  },
  radio: {
    slug: 'radio',
    name: 'Radio',
    titlePrefix: 'Angular Radio Component',
    keywords: 'angular radio, angular radio group, accessible radio button angular',
    tabs: tabs(
      'Angular radio groups for exclusive single-choice selection with roving tabindex and form integration.',
      'Radio examples — horizontal, vertical, disabled options, and reactive forms.',
      'Radio API — group value, option templates, and event outputs.',
      'Radio accessibility — radiogroup role and arrow key navigation.',
      'Radio theming via Premium UI design tokens.',
      'Radio playground for orientation, size, and disabled combinations.',
      'Angular Radio Component'
    ),
    relatedLinks: [
      { label: 'Checkbox', route: ['/docs/components/checkbox/overview'] },
      { label: 'Toggle', route: ['/docs/components/toggle/overview'] },
    ],
  },
  switch: {
    slug: 'switch',
    name: 'Switch',
    titlePrefix: 'Angular Switch Component',
    keywords: 'angular switch, ios switch angular, accessible switch component',
    tabs: tabs(
      'Angular switch with track/thumb animation, iOS variant, loading state, and forms support.',
      'Switch examples — default, success, danger, iOS style, and loading patterns.',
      'Switch API — change event, variants, sizes, and CVA integration.',
      'Switch a11y — switch role, aria-checked, and keyboard activation.',
      'Switch theming — track, thumb, and focus ring tokens.',
      'Switch playground for variant, size, loading, and disabled states.',
      'Angular Switch Component'
    ),
    relatedLinks: [
      { label: 'Checkbox', route: ['/docs/components/checkbox/overview'] },
      { label: 'Toggle', route: ['/docs/components/toggle/overview'] },
    ],
  },
  toggle: {
    slug: 'toggle',
    name: 'Toggle',
    titlePrefix: 'Angular Toggle Component',
    keywords: 'angular toggle, segmented control angular, toggle group angular',
    tabs: tabs(
      'Angular toggle and toggle group with segmented sliding indicators and multi-select toolbars.',
      'Toggle examples — single toggle, segmented groups, icons, and density options.',
      'Toggle API — selection modes, group value, and keyboard roving tabindex.',
      'Toggle accessibility — pressed state, group labels, and arrow keys.',
      'Toggle theming — indicator, segment, and focus tokens.',
      'Toggle playground for variant, shape, and multi-select behavior.',
      'Angular Toggle Component'
    ),
    relatedLinks: [
      { label: 'Tabs', route: ['/docs/components/tabs/overview'] },
      { label: 'Button', route: ['/docs/components/button/overview'] },
    ],
  },
  tabs: {
    slug: 'tabs',
    name: 'Tabs',
    titlePrefix: 'Angular Tabs Component',
    keywords: 'angular tabs, accessible tabs, underline tabs angular, segmented tabs',
    tabs: {
      overview: {
        title: 'Angular Tabs Component — Overview',
        description:
          'Organize Angular content with accessible tabs — underline, segmented, and pill variants with keyboard navigation.',
      },
      variants: {
        title: 'Angular Tabs Component — Variants',
        description: 'Compare tab variants — underline, segmented, and pill for different UI contexts.',
      },
      examples: {
        title: 'Angular Tabs Component — Examples',
        description: 'Angular tab examples with controlled selection, vertical orientation, and full-width layouts.',
      },
      api: {
        title: 'Angular Tabs Component — API Reference',
        description: 'API for pui-tabs, pui-tab-item, and pui-tab-panel.',
      },
      accessibility: {
        title: 'Angular Tabs Component — Accessibility',
        description: 'WAI-ARIA tabs pattern — tablist, tab, tabpanel roles, and roving tabindex.',
      },
      theming: {
        title: 'Angular Tabs Component — Theming',
        description: 'Tab indicator, label, and panel theming with design tokens.',
      },
      keyboard: {
        title: 'Angular Tabs Component — Keyboard',
        description: 'Keyboard interaction reference for horizontal and vertical tab lists.',
      },
      playground: {
        title: 'Angular Tabs Component — Playground',
        description: 'Live tabs playground — variant, orientation, size, and disabled controls.',
      },
    },
    relatedLinks: [
      { label: 'Toggle', route: ['/docs/components/toggle/overview'] },
      { label: 'Button', route: ['/docs/components/button/overview'] },
    ],
  },
  toast: {
    slug: 'toast',
    name: 'Toast',
    titlePrefix: 'Angular Toast System',
    keywords: 'angular toast, sonner angular, snackbar angular, toast service angular, premium ui toast',
    tabs: tabs(
      'Enterprise Angular toast infrastructure — stacked viewports, semantic variants, snackbar mode, and promise helpers.',
      'Toast examples — success, error, snackbar, rich content, promise transitions, and viewport positions.',
      'PuiToastService API — show, dismiss, update, promise, and configuration options.',
      'Toast accessibility — live regions, keyboard dismiss, pause on hover, and reduced motion.',
      'Toast theming — surfaces, shadows, semantic accents, and CSS variables.',
      'Interactive toast playground — variant, position, snackbar, rich mode, and loading transitions.',
      'Angular Toast System'
    ),
    relatedLinks: [
      { label: 'Button', route: ['/docs/components/button/overview'] },
      { label: 'Tabs', route: ['/docs/components/tabs/overview'] },
    ],
  },
  dialog: {
    slug: 'dialog',
    name: 'Dialog',
    titlePrefix: 'Angular Dialog System',
    keywords: 'angular dialog, modal angular, overlay angular, dialog service, premium ui dialog',
    tabs: tabs(
      'Enterprise Angular dialog infrastructure — overlay foundation, template and component dialogs, stacking, and focus management.',
      'Dialog examples — template dialogs, component dialogs, confirm helper, variants, fullscreen, sheet, and stacking.',
      'PuiDialogService API — open, close, confirm, sizing, positioning, and PuiDialogRef lifecycle.',
      'Dialog accessibility — focus trap, escape key, aria-modal, and focus restoration.',
      'Dialog theming — surface, border, radius, and shadow tokens.',
      'Interactive dialog playground — width, backdrop, position, variant, and scroll strategy.',
      'Angular Dialog System'
    ),
    relatedLinks: [
      { label: 'Toast', route: ['/docs/components/toast/overview'] },
      { label: 'Button', route: ['/docs/components/button/overview'] },
      { label: 'Table', route: ['/docs/components/table/overview'] },
    ],
  },
  command: {
    slug: 'command',
    name: 'Command Palette',
    titlePrefix: 'Angular Command System',
    keywords: 'angular command palette, spotlight angular, raycast angular, keyboard shortcuts angular, premium ui command',
    tabs: tabs(
      'Reusable command infrastructure — registry, search, execution, and a keyboard-first palette inspired by Spotlight and Linear.',
      'Command palette examples — grouped commands, route navigation, actions, custom templates, and recent commands.',
      'Command system API — PuiCommandRegistry, PuiCommandService, PuiCommandPaletteService, and PuiCommand model.',
      'Command palette accessibility — dialog semantics, listbox options, combobox search, and focus restoration.',
      'Command palette theming — elevated surfaces, blur backdrop, and motion tokens.',
      'Interactive command palette playground — groups, icons, shortcuts, and search.',
      'Angular Command System'
    ),
    relatedLinks: [
      { label: 'Dialog', route: ['/docs/components/dialog/overview'] },
      { label: 'Select', route: ['/docs/components/select/overview'] },
      { label: 'Tabs', route: ['/docs/components/tabs/overview'] },
    ],
  },
  date: {
    slug: 'date',
    name: 'Date',
    titlePrefix: 'Premium Date System',
    keywords: 'angular datepicker, date range picker, calendar angular, datetime picker, premium ui date',
    tabs: {
      overview: { title: 'Premium Date System — Overview', description: 'Locale-aware date, time, and calendar components with shared DateEngine.' },
      examples: { title: 'Date Examples', description: 'Date picker, range picker, calendar, datetime, month, year, and quarter examples.' },
      api: { title: 'Date API', description: 'PuiDateConfig, picker components, and DateEngine service reference.' },
      accessibility: { title: 'Date Accessibility', description: 'Keyboard navigation, ARIA, and focus management for date components.' },
      playground: { title: 'Date Playground', description: 'Live locale and format playground for date pickers.' },
    },
    relatedLinks: [
      { label: 'Select', route: ['/docs/components/select/overview'] },
      { label: 'Input', route: ['/docs/components/input/overview'] },
      { label: 'Charts', route: ['/docs/components/charts/doc'] },
    ],
  },
  charts: {
    slug: 'charts',
    name: 'Charts',
    titlePrefix: 'Premium Charts Platform',
    keywords: 'angular charts, echarts angular wrapper, dashboard charts, premium ui charts, line chart angular, bar chart angular',
    tabs: {
      ...tabs(
        'Premium chart platform with config-driven APIs, token theming, and enterprise defaults — built on ECharts internally without exposing raw options.',
        'Chart examples — progressive line, bar, pie, scatter, radar, heatmap, treemap, funnel, gauge, and sparkline demos driven by config.',
        'Charts API — PuiChartData, Pui*ChartConfig, PuiChartTheme, PuiChartAdapter, and shared inputs.',
        'Chart accessibility — aria labels, loading states, reduced motion, and token-based contrast.',
        'Chart theming — CSS variables for palette, grid, tooltip, and surface tokens.',
        'Interactive charts playground — tune appearance, axis, and interaction config live.',
        'Premium Charts Platform'
      ),
      doc: {
        title: 'Premium Charts Platform — Documentation',
        description:
          'Install @premium-ui/charts, bootstrap providers, and use config-driven chart components with premium defaults.',
      },
      'configuration-playground': {
        title: 'Configuration Playground | Premium UI Charts',
        description:
          'Live chart configuration playground — tune legend, colors, tooltip, animation, grid, dark mode, smooth curves, area fill, and data labels.',
      },
      ...Object.fromEntries(
        CHART_DOC_PAGES.map((page) => [
          page.slug,
          {
            title: `${page.title} | Premium UI Charts`,
            description: page.overview.what,
          } satisfies PuiDocsSeoTabMeta,
        ])
      ),
    },
    relatedLinks: [
      { label: 'Table', route: ['/docs/components/table/overview'] },
      { label: 'Card', route: ['/docs/components/card/overview'] },
      { label: 'Command Palette', route: ['/docs/components/command/overview'] },
    ],
  },
  table: {
    slug: 'table',
    name: 'Table',
    titlePrefix: 'Angular Data Grid',
    keywords: 'angular data grid, angular table, virtual scroll table, tanstack table alternative, premium ui table',
    tabs: tabs(
      'Enterprise Angular data grid with simple string columns, advanced column config, virtualization, worker search, export, and selection.',
      'Table examples — simple columns, badges, currency, custom action templates, worker mode, and virtual scroll.',
      'pui-table API — data, columns, sorting, filtering, pagination, selection, export, and worker inputs.',
      'Data grid accessibility — grid semantics, aria-sort, keyboard sorting, and accessible selection.',
      'Table theming — row height, header, borders, and sticky column shadows via CSS variables.',
      'Interactive data grid playground — virtualization, worker mode, selection, and export controls.',
      'Angular Data Grid'
    ),
    relatedLinks: [
      { label: 'Select', route: ['/docs/components/select/overview'] },
      { label: 'Checkbox', route: ['/docs/components/checkbox/overview'] },
      { label: 'Card', route: ['/docs/components/card/overview'] },
    ],
  },
};

export const DOCS_FOUNDATION_SEO: Readonly<Record<string, PuiDocsSeoTabMeta>> = {
  colors: {
    title: 'Color Tokens — Premium UI Foundations',
    description: 'Premium UI color system — semantic surfaces, palette, borders, and elevation for light and dark themes.',
  },
  typography: {
    title: 'Typography Tokens — Premium UI Foundations',
    description: 'Type scale, font families, line heights, and letter spacing tokens for Premium UI.',
  },
  spacing: {
    title: 'Spacing Tokens — Premium UI Foundations',
    description: 'Spacing scale for layout rhythm, component padding, and documentation vertical spacing.',
  },
};

export function resolveComponentSeo(slug: string): PuiDocsComponentSeo | undefined {
  return DOCS_COMPONENT_SEO[slug];
}

export function resolveFoundationSeo(section: string): PuiDocsSeoTabMeta | undefined {
  return DOCS_FOUNDATION_SEO[section];
}

export const DOCS_INDEXABLE_ROUTES: readonly string[] = [
  ...Object.values(DOCS_COMPONENT_SEO).flatMap((component) =>
    Object.keys(component.tabs).map((tab) => `/docs/components/${component.slug}/${tab}`)
  ),
  ...Object.keys(DOCS_FOUNDATION_SEO).map((section) => `/docs/foundations/${section}`),
];
