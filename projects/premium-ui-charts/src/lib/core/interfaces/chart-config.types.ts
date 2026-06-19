import type { PuiChartAppearance } from './chart-appearance.types';
import type { PuiChartAxisConfig } from './chart-axis.types';
import type { PuiChartValueFormatter } from './chart-data.types';
import type {
  PuiChartAnimationConfig,
  PuiChartGridConfig,
  PuiChartLegendConfig,
  PuiChartThemePreset,
  PuiChartTooltipConfig,
} from './chart-display.types';
import type { PuiChartInteractionConfig } from './chart-interaction.types';
import type { PuiChartTheme } from './chart-theme.types';

export interface PuiBaseChartConfig {
  readonly responsive?: boolean;
  readonly colors?: readonly string[];
  readonly legend?: PuiChartLegendConfig;
  readonly tooltip?: PuiChartTooltipConfig;
  readonly grid?: PuiChartGridConfig;
  readonly animation?: PuiChartAnimationConfig;
  readonly theme?: Partial<PuiChartTheme> | PuiChartThemePreset;
  readonly appearance?: PuiChartAppearance;
  readonly axis?: PuiChartAxisConfig;
  readonly interaction?: PuiChartInteractionConfig;
  readonly valueFormatter?: PuiChartValueFormatter;
  readonly loading?: boolean;
  readonly emptyLabel?: string;
  readonly ariaLabel?: string;
}

export type PuiLineChartVariant = 'line' | 'area';

export interface PuiLineChartConfig extends PuiBaseChartConfig {
  readonly xField?: string;
  readonly yField?: string;
  readonly seriesField?: string;
  readonly variant?: PuiLineChartVariant;
  readonly stacked?: boolean;
  readonly showDataLabels?: boolean;
  readonly threshold?: number;
  readonly thresholdLabel?: string;
}

export type PuiBarChartOrientation = 'vertical' | 'horizontal';
export type PuiBarChartMode = 'grouped' | 'stacked' | 'stacked100';

export interface PuiBarChartConfig extends PuiBaseChartConfig {
  readonly xField?: string;
  readonly yField?: string;
  readonly seriesField?: string;
  readonly orientation?: PuiBarChartOrientation;
  readonly mode?: PuiBarChartMode;
  readonly showDataLabels?: boolean;
  readonly threshold?: number;
  readonly thresholdLabel?: string;
}

export type PuiPieChartVariant = 'pie' | 'donut';

export interface PuiPieChartConfig extends PuiBaseChartConfig {
  readonly labelField?: string;
  readonly valueField?: string;
  readonly variant?: PuiPieChartVariant;
  readonly innerRadius?: number | string;
  readonly centerLabel?: string;
  readonly centerValue?: string;
  readonly semiCircle?: boolean;
  readonly showLegend?: boolean;
}

export interface PuiScatterChartConfig extends PuiBaseChartConfig {
  readonly xField?: string;
  readonly yField?: string;
  readonly seriesField?: string;
  readonly sizeField?: string;
  readonly showRegression?: boolean;
}

export interface PuiRadarChartConfig extends PuiBaseChartConfig {
  readonly labelField?: string;
  readonly valueField?: string;
  readonly seriesField?: string;
  readonly filled?: boolean;
}

export interface PuiHeatmapChartConfig extends PuiBaseChartConfig {
  readonly xField?: string;
  readonly yField?: string;
  readonly valueField?: string;
}

export interface PuiFunnelChartConfig extends PuiBaseChartConfig {
  readonly labelField?: string;
  readonly valueField?: string;
}

export interface PuiTreemapChartConfig extends PuiBaseChartConfig {
  readonly labelField?: string;
  readonly valueField?: string;
  readonly nested?: boolean;
}

export type PuiGaugeChartVariant = 'circular' | 'semi' | 'kpi' | 'multi';

export interface PuiGaugeChartConfig extends PuiBaseChartConfig {
  readonly valueField?: string;
  readonly min?: number;
  readonly max?: number;
  readonly variant?: PuiGaugeChartVariant;
  readonly unit?: string;
}

export type PuiSparklineVariant = 'line' | 'area' | 'bar';

export interface PuiSparklineConfig extends PuiBaseChartConfig {
  readonly xField?: string;
  readonly yField?: string;
  readonly variant?: PuiSparklineVariant;
  readonly height?: number;
}

/** @deprecated Use PuiLineChartConfig with variant: 'area' */
export type PuiAreaChartConfig = PuiLineChartConfig;

/** @deprecated Use PuiBarChartConfig presets */
export type PuiColumnChartConfig = PuiBarChartConfig;
export type PuiHorizontalBarChartConfig = PuiBarChartConfig;
export type PuiStackedBarChartConfig = PuiBarChartConfig;

/** @deprecated Use PuiPieChartConfig with variant: 'donut' */
export type PuiDonutChartConfig = PuiPieChartConfig;

/** @deprecated Use PuiScatterChartConfig with sizeField */
export type PuiBubbleChartConfig = PuiScatterChartConfig;
