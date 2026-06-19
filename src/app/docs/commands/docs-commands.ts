import type { PuiCommand } from '../../../premium-ui/command';
import { CHARTS_SIDEBAR_ITEMS } from '../pages/charts-docs/charts-docs.nav';

export interface PuiDocsCommandEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly route: readonly string[];
  readonly group: string;
  readonly icon: string;
  readonly keywords?: readonly string[];
}

/** All documentation routes available from the global command palette. */
export const DOCS_COMMAND_ENTRIES: readonly PuiDocsCommandEntry[] = [
  { id: 'docs-colors', label: 'Colors', description: 'Color foundation tokens', route: ['/docs/foundations/colors'], group: 'Foundations', icon: 'settings', keywords: ['theme', 'tokens'] },
  { id: 'docs-typography', label: 'Typography', description: 'Type scale and font tokens', route: ['/docs/foundations/typography'], group: 'Foundations', icon: 'file-text', keywords: ['fonts', 'text'] },
  { id: 'docs-spacing', label: 'Spacing', description: 'Spacing scale tokens', route: ['/docs/foundations/spacing'], group: 'Foundations', icon: 'layout-dashboard', keywords: ['layout', 'tokens'] },

  { id: 'docs-button', label: 'Button', description: 'Button component docs', route: ['/docs/components/button/overview'], group: 'Forms', icon: 'home', keywords: ['components', 'actions'] },
  { id: 'docs-input', label: 'Input', description: 'Input component docs', route: ['/docs/components/input/overview'], group: 'Forms', icon: 'file-text', keywords: ['text field', 'forms'] },
  { id: 'docs-select', label: 'Select', description: 'Select component docs', route: ['/docs/components/select/overview'], group: 'Forms', icon: 'file-text', keywords: ['dropdown', 'forms'] },
  { id: 'docs-checkbox', label: 'Checkbox', description: 'Checkbox component docs', route: ['/docs/components/checkbox/overview'], group: 'Forms', icon: 'file-text', keywords: ['forms', 'boolean'] },
  { id: 'docs-radio', label: 'Radio', description: 'Radio component docs', route: ['/docs/components/radio/overview'], group: 'Forms', icon: 'file-text', keywords: ['forms', 'choice'] },
  { id: 'docs-switch', label: 'Switch', description: 'Switch component docs', route: ['/docs/components/switch/overview'], group: 'Forms', icon: 'settings', keywords: ['toggle', 'forms'] },
  { id: 'docs-toggle', label: 'Toggle', description: 'Toggle component docs', route: ['/docs/components/toggle/overview'], group: 'Forms', icon: 'settings', keywords: ['button group', 'forms'] },

  { id: 'docs-alert', label: 'Alert', description: 'Alert component docs', route: ['/docs/components/alert'], group: 'Feedback', icon: 'mail-plus', keywords: ['message', 'status'] },
  { id: 'docs-toast', label: 'Toast', description: 'Toast system docs', route: ['/docs/components/toast/overview'], group: 'Feedback', icon: 'mail-plus', keywords: ['notification', 'feedback'] },
  { id: 'docs-progress', label: 'Progress', description: 'Progress component docs', route: ['/docs/components/progress'], group: 'Feedback', icon: 'refresh-cw', keywords: ['loading', 'bar'] },

  { id: 'docs-tabs', label: 'Tabs', description: 'Tabs component docs', route: ['/docs/components/tabs/overview'], group: 'Navigation', icon: 'layout-dashboard', keywords: ['panels', 'sections'] },
  { id: 'docs-command', label: 'Command Palette', description: 'Command system docs', route: ['/docs/components/command/overview'], group: 'Navigation', icon: 'command', keywords: ['search', 'keyboard', 'palette'] },
  { id: 'docs-breadcrumb', label: 'Breadcrumb', description: 'Breadcrumb component docs', route: ['/docs/components/breadcrumb'], group: 'Navigation', icon: 'home', keywords: ['trail', 'path'] },

  { id: 'docs-dialog', label: 'Dialog', description: 'Dialog system docs', route: ['/docs/components/dialog/overview'], group: 'Overlays', icon: 'file-text', keywords: ['modal', 'overlay'] },
  { id: 'docs-tooltip', label: 'Tooltip', description: 'Tooltip component docs', route: ['/docs/components/tooltip'], group: 'Overlays', icon: 'file-text', keywords: ['hint', 'popover'] },

  { id: 'docs-card', label: 'Card', description: 'Card component docs', route: ['/docs/components/card/overview'], group: 'Data Display', icon: 'layout-dashboard', keywords: ['surface', 'panel'] },
  { id: 'docs-table', label: 'Table', description: 'Data grid docs', route: ['/docs/components/table/overview'], group: 'Data Display', icon: 'layout-dashboard', keywords: ['data grid', 'rows'] },
  { id: 'docs-charts', label: 'Charts', description: 'Premium charts platform documentation', route: ['/docs/components/charts/doc'], group: 'Charts', icon: 'layout-dashboard', keywords: ['analytics', 'visualization', 'dashboard'] },
  ...CHARTS_SIDEBAR_ITEMS.filter((item) => item.label !== 'Documentation').map((item) => ({
    id: `docs-charts-${item.route[0]?.split('/').pop() ?? item.label}`,
    label: item.label,
    description: `${item.label} — Premium UI Charts`,
    route: item.route,
    group: 'Charts' as const,
    icon: 'layout-dashboard' as const,
    keywords: ['chart', 'analytics', item.label.toLowerCase()] as readonly string[],
  })),
  { id: 'docs-badge', label: 'Badge', description: 'Badge component docs', route: ['/docs/components/badge'], group: 'Data Display', icon: 'file-text', keywords: ['label', 'status'] },

  { id: 'docs-container', label: 'Container', description: 'Container layout docs', route: ['/docs/components/container'], group: 'Layout', icon: 'layout-dashboard', keywords: ['width', 'wrapper'] },
  { id: 'docs-stack', label: 'Stack', description: 'Stack layout docs', route: ['/docs/components/stack'], group: 'Layout', icon: 'layout-dashboard', keywords: ['flex', 'gap'] },

  { id: 'docs-visually-hidden', label: 'Visually Hidden', description: 'Visually hidden utility docs', route: ['/docs/components/visually-hidden'], group: 'Utilities', icon: 'file-text', keywords: ['a11y', 'screen reader'] },
  { id: 'docs-portal', label: 'Portal', description: 'Portal utility docs', route: ['/docs/components/portal'], group: 'Utilities', icon: 'file-text', keywords: ['overlay', 'teleport'] },
];

export const DOCS_COMMAND_PALETTE_SHORTCUTS = ['meta+k', 'ctrl+k'] as const;

export function createDocsCommands(
  navigate: (route: readonly string[]) => void | Promise<boolean>
): readonly PuiCommand[] {
  return DOCS_COMMAND_ENTRIES.map((entry) => ({
    id: entry.id,
    label: entry.label,
    description: entry.description,
    group: entry.group,
    icon: entry.icon,
    keywords: entry.keywords,
    action: () => {
      void navigate(entry.route);
    },
  }));
}
