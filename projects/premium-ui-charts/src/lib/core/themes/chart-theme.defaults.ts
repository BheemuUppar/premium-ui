import type { PuiChartTheme } from '../interfaces/chart-theme.types';

export const PUI_CHART_DEFAULT_PALETTE: readonly string[] = [
  'var(--pui-chart-color-1, #635bff)',
  'var(--pui-chart-color-2, #06b6d4)',
  'var(--pui-chart-color-3, #16a34a)',
  'var(--pui-chart-color-4, #d97706)',
  'var(--pui-chart-color-5, #dc2626)',
  'var(--pui-chart-color-6, #8b5cf6)',
  'var(--pui-chart-color-7, #ec4899)',
  'var(--pui-chart-color-8, #64748b)',
];

export const PUI_CHART_DEFAULT_THEME: PuiChartTheme = {
  primary: 'var(--pui-color-primary, #635bff)',
  success: 'var(--pui-color-success, #16a34a)',
  warning: 'var(--pui-color-warning, #d97706)',
  danger: 'var(--pui-color-danger, #dc2626)',
  background: 'var(--pui-color-bg, #f7f8fb)',
  surface: 'var(--pui-color-surface, #ffffff)',
  textPrimary: 'var(--pui-color-text, #0f172a)',
  textSecondary: 'var(--pui-color-text-muted, #526277)',
  grid: 'var(--pui-chart-grid, color-mix(in srgb, var(--pui-color-border) 65%, transparent))',
  axis: 'var(--pui-color-text-subtle, #64748b)',
  tooltipBackground: 'var(--pui-chart-tooltip-bg, var(--pui-color-surface-elevated, #fcfcfd))',
  tooltipText: 'var(--pui-color-text, #0f172a)',
  tooltipBorder: 'var(--pui-color-border-subtle, #e7edf5)',
  palette: PUI_CHART_DEFAULT_PALETTE,
};

export function resolveChartTheme(override?: Partial<PuiChartTheme>): PuiChartTheme {
  if (!override) {
    return PUI_CHART_DEFAULT_THEME;
  }

  return {
    ...PUI_CHART_DEFAULT_THEME,
    ...override,
    palette: override.palette ?? PUI_CHART_DEFAULT_THEME.palette,
  };
}

/** Resolves CSS variables to computed colors when running in the browser. */
export function resolveCssColor(value: string, host?: HTMLElement | null): string {
  if (typeof document === 'undefined') {
    return value;
  }

  if (!value.startsWith('var(')) {
    return value;
  }

  const probe = host ?? document.documentElement;
  const match = value.match(/var\((--[^,)]+)/);

  if (!match) {
    return value;
  }

  const resolved = getComputedStyle(probe).getPropertyValue(match[1]).trim();
  return resolved || value;
}

export function resolveThemeColors(theme: PuiChartTheme, host?: HTMLElement | null): PuiChartTheme {
  return {
    primary: resolveCssColor(theme.primary, host),
    success: resolveCssColor(theme.success, host),
    warning: resolveCssColor(theme.warning, host),
    danger: resolveCssColor(theme.danger, host),
    background: resolveCssColor(theme.background, host),
    surface: resolveCssColor(theme.surface, host),
    textPrimary: resolveCssColor(theme.textPrimary, host),
    textSecondary: resolveCssColor(theme.textSecondary, host),
    grid: resolveCssColor(theme.grid, host),
    axis: resolveCssColor(theme.axis, host),
    tooltipBackground: resolveCssColor(theme.tooltipBackground, host),
    tooltipText: resolveCssColor(theme.tooltipText, host),
    tooltipBorder: resolveCssColor(theme.tooltipBorder, host),
    palette: theme.palette.map((color) => resolveCssColor(color, host)),
  };
}
