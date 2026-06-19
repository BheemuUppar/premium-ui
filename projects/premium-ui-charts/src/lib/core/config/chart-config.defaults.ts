import type {
  PuiAreaChartConfig,
  PuiBarChartConfig,
  PuiBarChartMode,
  PuiBarChartOrientation,
  PuiBaseChartConfig,
  PuiBubbleChartConfig,
  PuiDonutChartConfig,
  PuiFunnelChartConfig,
  PuiGaugeChartConfig,
  PuiHeatmapChartConfig,
  PuiLineChartConfig,
  PuiLineChartVariant,
  PuiPieChartConfig,
  PuiPieChartVariant,
  PuiRadarChartConfig,
  PuiScatterChartConfig,
  PuiSparklineConfig,
  PuiSparklineVariant,
  PuiTreemapChartConfig,
} from '../interfaces/chart-config.types';
import type { PuiChartAppearance } from '../interfaces/chart-appearance.types';
import type { PuiChartAxisConfig } from '../interfaces/chart-axis.types';
import type {
  PuiChartAnimationConfig,
  PuiChartLegendConfig,
} from '../interfaces/chart-display.types';
import type { PuiChartInteractionConfig } from '../interfaces/chart-interaction.types';
import { PUI_DEFAULT_CHART_ANIMATION_DURATION } from '../animations/chart-animations';

export const PUI_DEFAULT_APPEARANCE: Required<
  Pick<PuiChartAppearance, 'radius' | 'gradient' | 'smooth' | 'lineWidth' | 'showMarkers' | 'opacity'>
> = {
  radius: 8,
  gradient: true,
  smooth: true,
  lineWidth: 2.5,
  showMarkers: false,
  opacity: 1,
};

export const PUI_DEFAULT_AXIS: Required<Pick<PuiChartAxisConfig, 'showGrid' | 'showLabels'>> = {
  showGrid: true,
  showLabels: true,
};

export const PUI_DEFAULT_INTERACTION: Required<
  Pick<PuiChartInteractionConfig, 'tooltip' | 'crosshair' | 'zoom' | 'seriesFocus'>
> = {
  tooltip: true,
  crosshair: true,
  zoom: false,
  seriesFocus: true,
};

export const PUI_DEFAULT_BASE_CHART_CONFIG = {
  loading: false,
  emptyLabel: 'No data available',
} as const;

export const PUI_DEFAULT_BAR_CHART_CONFIG = {
  xField: 'category',
  yField: 'value',
  orientation: 'vertical',
  mode: 'grouped',
} as const;

export const PUI_DEFAULT_LINE_CHART_CONFIG = {
  xField: 'category',
  yField: 'value',
} as const;

export const PUI_DEFAULT_AREA_CHART_CONFIG = {
  xField: 'category',
  yField: 'value',
  stacked: false,
} as const;

export const PUI_DEFAULT_DONUT_CHART_CONFIG = {
  labelField: 'label',
  valueField: 'value',
  innerRadius: '62%',
} as const;

export const PUI_DEFAULT_SPARKLINE_CONFIG = {
  yField: 'value',
  variant: 'line',
  height: 48,
} as const;

export const PUI_DEFAULT_SPARKLINE_ANIMATION_DURATION = 450;

export interface PuiMergedBaseChartConfig extends PuiBaseChartConfig {
  readonly appearance: PuiChartAppearance & typeof PUI_DEFAULT_APPEARANCE;
  readonly axis: PuiChartAxisConfig & typeof PUI_DEFAULT_AXIS;
  readonly interaction: PuiChartInteractionConfig & typeof PUI_DEFAULT_INTERACTION;
  readonly legend: Required<Pick<PuiChartLegendConfig, 'show' | 'position'>>;
  readonly animation: Required<Pick<PuiChartAnimationConfig, 'enabled' | 'duration'>>;
  readonly loading: boolean;
  readonly emptyLabel: string;
}

function mergeAppearance(
  config?: PuiChartAppearance
): PuiChartAppearance & typeof PUI_DEFAULT_APPEARANCE {
  return { ...PUI_DEFAULT_APPEARANCE, ...config };
}

function mergeAxis(config?: PuiChartAxisConfig): PuiChartAxisConfig & typeof PUI_DEFAULT_AXIS {
  return { ...PUI_DEFAULT_AXIS, ...config };
}

function mergeInteraction(
  config?: PuiChartInteractionConfig
): PuiChartInteractionConfig & typeof PUI_DEFAULT_INTERACTION {
  return { ...PUI_DEFAULT_INTERACTION, ...config };
}

export function mergeBaseChartConfig(config?: PuiBaseChartConfig): PuiMergedBaseChartConfig {
  const appearance = mergeAppearance({
    ...config?.appearance,
    colors: config?.colors ?? config?.appearance?.colors,
  });
  const axis = mergeAxis({
    ...config?.axis,
    showGrid: config?.grid?.show ?? config?.axis?.showGrid,
  });
  const interaction = mergeInteraction({
    ...config?.interaction,
    tooltip: config?.tooltip?.enabled ?? config?.interaction?.tooltip,
  });

  return {
    responsive: config?.responsive ?? true,
    colors: config?.colors,
    theme: config?.theme,
    valueFormatter: config?.valueFormatter,
    ariaLabel: config?.ariaLabel,
    loading: config?.loading ?? PUI_DEFAULT_BASE_CHART_CONFIG.loading,
    emptyLabel: config?.emptyLabel ?? PUI_DEFAULT_BASE_CHART_CONFIG.emptyLabel,
    appearance,
    axis,
    interaction,
    legend: {
      show: config?.legend?.show ?? true,
      position: config?.legend?.position ?? 'bottom',
    },
    animation: {
      enabled: config?.animation?.enabled ?? true,
      duration: config?.animation?.duration ?? PUI_DEFAULT_CHART_ANIMATION_DURATION,
    },
    tooltip: config?.tooltip,
    grid: config?.grid,
  };
}

export type PuiMergedBarChartConfig = PuiMergedBaseChartConfig & {
  readonly xField: string;
  readonly yField: string;
  readonly seriesField?: string;
  readonly orientation: PuiBarChartOrientation;
  readonly mode: PuiBarChartMode;
  readonly showDataLabels: boolean;
  readonly threshold?: number;
  readonly thresholdLabel?: string;
};

export function mergeBarChartConfig(config?: PuiBarChartConfig): PuiMergedBarChartConfig {
  const base = mergeBaseChartConfig(config);
  return {
    ...base,
    xField: config?.xField ?? PUI_DEFAULT_BAR_CHART_CONFIG.xField,
    yField: config?.yField ?? PUI_DEFAULT_BAR_CHART_CONFIG.yField,
    seriesField: config?.seriesField,
    orientation: config?.orientation ?? PUI_DEFAULT_BAR_CHART_CONFIG.orientation,
    mode: config?.mode ?? PUI_DEFAULT_BAR_CHART_CONFIG.mode,
    showDataLabels: config?.showDataLabels ?? false,
    threshold: config?.threshold,
    thresholdLabel: config?.thresholdLabel,
  };
}

export type PuiMergedLineChartConfig = PuiMergedBaseChartConfig & {
  readonly xField: string;
  readonly yField: string;
  readonly seriesField?: string;
  readonly variant: PuiLineChartVariant;
  readonly stacked: boolean;
  readonly showDataLabels: boolean;
  readonly threshold?: number;
  readonly thresholdLabel?: string;
};

export function mergeLineChartConfig(config?: PuiLineChartConfig): PuiMergedLineChartConfig {
  const base = mergeBaseChartConfig(config);
  return {
    ...base,
    xField: config?.xField ?? PUI_DEFAULT_LINE_CHART_CONFIG.xField,
    yField: config?.yField ?? PUI_DEFAULT_LINE_CHART_CONFIG.yField,
    seriesField: config?.seriesField,
    variant: config?.variant ?? 'line',
    stacked: config?.stacked ?? false,
    showDataLabels: config?.showDataLabels ?? false,
    threshold: config?.threshold,
    thresholdLabel: config?.thresholdLabel,
  };
}

export type PuiMergedAreaChartConfig = PuiMergedLineChartConfig;

export function mergeAreaChartConfig(config?: PuiAreaChartConfig): PuiMergedAreaChartConfig {
  return mergeLineChartConfig({ ...config, variant: 'area' });
}

export type PuiMergedDonutChartConfig = PuiMergedPieChartConfig;

export function mergeDonutChartConfig(config?: PuiDonutChartConfig): PuiMergedDonutChartConfig {
  return mergePieChartConfig({ ...config, variant: 'donut' });
}

export type PuiMergedSparklineConfig = PuiMergedBaseChartConfig & {
  readonly xField?: string;
  readonly yField: string;
  readonly variant: PuiSparklineVariant;
  readonly height: number;
};

export function mergeSparklineConfig(config?: PuiSparklineConfig): PuiMergedSparklineConfig {
  const base = mergeBaseChartConfig(config);
  return {
    ...base,
    animation: {
      ...base.animation,
      duration: config?.animation?.duration ?? PUI_DEFAULT_SPARKLINE_ANIMATION_DURATION,
    },
    xField: config?.xField,
    yField: config?.yField ?? PUI_DEFAULT_SPARKLINE_CONFIG.yField,
    variant: config?.variant ?? PUI_DEFAULT_SPARKLINE_CONFIG.variant,
    height: config?.height ?? PUI_DEFAULT_SPARKLINE_CONFIG.height,
    interaction: { ...base.interaction, tooltip: config?.interaction?.tooltip ?? false },
  };
}

const PIE_DEFAULTS = { labelField: 'label', valueField: 'value', showLegend: true } as const;
const SCATTER_DEFAULTS = { xField: 'x', yField: 'y' } as const;
const BUBBLE_DEFAULTS = { ...SCATTER_DEFAULTS, sizeField: 'size' } as const;
const RADAR_DEFAULTS = { labelField: 'label', valueField: 'value' } as const;
const HEATMAP_DEFAULTS = { xField: 'x', yField: 'y', valueField: 'value' } as const;
const FUNNEL_DEFAULTS = { labelField: 'label', valueField: 'value' } as const;
const TREEMAP_DEFAULTS = { labelField: 'label', valueField: 'value' } as const;

export type PuiMergedPieChartConfig = PuiMergedBaseChartConfig & {
  readonly labelField: string;
  readonly valueField: string;
  readonly variant: PuiPieChartVariant;
  readonly innerRadius: number | string;
  readonly centerLabel?: string;
  readonly centerValue?: string;
  readonly semiCircle: boolean;
  readonly showLegend: boolean;
};

export function mergePieChartConfig(config?: PuiPieChartConfig): PuiMergedPieChartConfig {
  const base = mergeBaseChartConfig(config);
  const variant = config?.variant ?? (config?.innerRadius != null ? 'donut' : 'pie');
  return {
    ...base,
    labelField: config?.labelField ?? PIE_DEFAULTS.labelField,
    valueField: config?.valueField ?? PIE_DEFAULTS.valueField,
    variant,
    innerRadius: config?.innerRadius ?? PUI_DEFAULT_DONUT_CHART_CONFIG.innerRadius,
    centerLabel: config?.centerLabel,
    centerValue: config?.centerValue,
    semiCircle: config?.semiCircle ?? false,
    showLegend: config?.showLegend ?? config?.legend?.show ?? PIE_DEFAULTS.showLegend,
  };
}

export type PuiMergedScatterChartConfig = PuiMergedBaseChartConfig & {
  readonly xField: string;
  readonly yField: string;
  readonly seriesField?: string;
  readonly sizeField?: string;
  readonly showRegression: boolean;
};

export function mergeScatterChartConfig(config?: PuiScatterChartConfig): PuiMergedScatterChartConfig {
  const base = mergeBaseChartConfig(config);
  return {
    ...base,
    xField: config?.xField ?? SCATTER_DEFAULTS.xField,
    yField: config?.yField ?? SCATTER_DEFAULTS.yField,
    seriesField: config?.seriesField,
    sizeField: config?.sizeField,
    showRegression: config?.showRegression ?? false,
  };
}

export type PuiMergedBubbleChartConfig = PuiMergedScatterChartConfig;

export function mergeBubbleChartConfig(config?: PuiBubbleChartConfig): PuiMergedBubbleChartConfig {
  return mergeScatterChartConfig({ ...config, sizeField: config?.sizeField ?? BUBBLE_DEFAULTS.sizeField });
}

export type PuiMergedRadarChartConfig = PuiMergedBaseChartConfig & {
  readonly labelField: string;
  readonly valueField: string;
  readonly seriesField?: string;
  readonly filled: boolean;
};

export function mergeRadarChartConfig(config?: PuiRadarChartConfig): PuiMergedRadarChartConfig {
  const base = mergeBaseChartConfig(config);
  return {
    ...base,
    labelField: config?.labelField ?? RADAR_DEFAULTS.labelField,
    valueField: config?.valueField ?? RADAR_DEFAULTS.valueField,
    seriesField: config?.seriesField,
    filled: config?.filled ?? true,
  };
}

export type PuiMergedHeatmapChartConfig = PuiMergedBaseChartConfig & {
  readonly xField: string;
  readonly yField: string;
  readonly valueField: string;
};

export function mergeHeatmapChartConfig(config?: PuiHeatmapChartConfig): PuiMergedHeatmapChartConfig {
  const base = mergeBaseChartConfig(config);
  return {
    ...base,
    xField: config?.xField ?? HEATMAP_DEFAULTS.xField,
    yField: config?.yField ?? HEATMAP_DEFAULTS.yField,
    valueField: config?.valueField ?? HEATMAP_DEFAULTS.valueField,
  };
}

export type PuiMergedFunnelChartConfig = PuiMergedBaseChartConfig & {
  readonly labelField: string;
  readonly valueField: string;
};

export function mergeFunnelChartConfig(config?: PuiFunnelChartConfig): PuiMergedFunnelChartConfig {
  const base = mergeBaseChartConfig(config);
  return {
    ...base,
    labelField: config?.labelField ?? FUNNEL_DEFAULTS.labelField,
    valueField: config?.valueField ?? FUNNEL_DEFAULTS.valueField,
  };
}

export type PuiMergedTreemapChartConfig = PuiMergedBaseChartConfig & {
  readonly labelField: string;
  readonly valueField: string;
};

export function mergeTreemapChartConfig(config?: PuiTreemapChartConfig): PuiMergedTreemapChartConfig {
  const base = mergeBaseChartConfig(config);
  return {
    ...base,
    labelField: config?.labelField ?? TREEMAP_DEFAULTS.labelField,
    valueField: config?.valueField ?? TREEMAP_DEFAULTS.valueField,
  };
}

const GAUGE_DEFAULTS = { valueField: 'value', min: 0, max: 100, variant: 'circular' as const };

export type PuiMergedGaugeChartConfig = PuiMergedBaseChartConfig & {
  readonly valueField: string;
  readonly min: number;
  readonly max: number;
  readonly variant: NonNullable<PuiGaugeChartConfig['variant']>;
  readonly unit?: string;
};

export function mergeGaugeChartConfig(config?: PuiGaugeChartConfig): PuiMergedGaugeChartConfig {
  const base = mergeBaseChartConfig(config);
  return {
    ...base,
    valueField: config?.valueField ?? GAUGE_DEFAULTS.valueField,
    min: config?.min ?? GAUGE_DEFAULTS.min,
    max: config?.max ?? GAUGE_DEFAULTS.max,
    variant: config?.variant ?? GAUGE_DEFAULTS.variant,
    unit: config?.unit,
  };
}
