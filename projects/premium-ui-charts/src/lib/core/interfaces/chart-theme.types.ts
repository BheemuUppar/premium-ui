/** Premium UI chart theme tokens — no hardcoded colors in components. */
export interface PuiChartTheme {
  readonly primary: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly background: string;
  readonly surface: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly grid: string;
  readonly axis: string;
  readonly tooltipBackground: string;
  readonly tooltipText: string;
  readonly tooltipBorder: string;
  readonly palette: readonly string[];
}
