export type PuiChartLegendPosition = 'top' | 'bottom' | 'left' | 'right';

export interface PuiChartLegendConfig {
  readonly show?: boolean;
  readonly position?: PuiChartLegendPosition;
}

export interface PuiChartGridConfig {
  readonly show?: boolean;
}

export interface PuiChartTooltipConfig {
  readonly enabled?: boolean;
}

export interface PuiChartAnimationConfig {
  readonly enabled?: boolean;
  readonly duration?: number;
}

export type PuiChartThemePreset = 'light' | 'dark';
