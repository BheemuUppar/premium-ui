import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import type { PuiChartValueFormatter } from '../interfaces/chart-data.types';
import type { PuiChartLegendConfig } from '../interfaces/chart-display.types';
import type { PuiMergedBaseChartConfig } from '../config/chart-config.defaults';
import {
  PUI_CHART_BLUR_STYLE,
  PUI_CHART_EMPHASIS_ITEM,
  PUI_CHART_EMPHASIS_STYLE,
  PUI_DEFAULT_CHART_ANIMATION_DURATION,
  resolveChartAnimation,
} from '../animations/chart-animations';
import type { PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';

export interface PuiChartBuilderContext {
  readonly theme: PuiChartTheme;
  readonly valueFormatter?: PuiChartValueFormatter;
  readonly large?: boolean;
}

export function isLargeDataset(pointCount: number): boolean {
  return pointCount >= 1000;
}

export function buildBaseAnimation(
  animation?: PuiMergedBaseChartConfig['animation']
): Pick<
  PuiInternalEChartsOption,
  'animation' | 'animationDuration' | 'animationEasing' | 'animationDurationUpdate' | 'animationEasingUpdate'
> {
  if (animation && !animation.enabled) {
    return { animation: false };
  }

  const preset = resolveChartAnimation('fade');
  const duration = animation?.duration ?? PUI_DEFAULT_CHART_ANIMATION_DURATION;
  const updateDuration =
    animation?.duration != null
      ? Math.round(animation.duration * 0.65)
      : (preset.animationDurationUpdate ?? Math.round(duration * 0.65));

  return {
    animation: true,
    animationDuration: duration,
    animationEasing: preset.animationEasing as PuiInternalEChartsOption['animationEasing'],
    animationDurationUpdate: updateDuration,
    animationEasingUpdate: preset.animationEasingUpdate as PuiInternalEChartsOption['animationEasingUpdate'],
  };
}

export function buildLegendOption(
  theme: PuiChartTheme,
  legend: PuiChartLegendConfig & { readonly show: boolean; readonly position: NonNullable<PuiChartLegendConfig['position']> }
): PuiInternalEChartsOption['legend'] {
  if (!legend.show) {
    return { show: false };
  }

  const textStyle = { color: theme.textSecondary, fontSize: 11 };
  const base = { show: true, textStyle, itemWidth: 10, itemHeight: 10, itemGap: 12 };

  switch (legend.position) {
    case 'top':
      return { ...base, top: 0, left: 'center' };
    case 'left':
      return { ...base, left: 0, top: 'middle', orient: 'vertical' };
    case 'right':
      return { ...base, right: 0, top: 'middle', orient: 'vertical' };
    default:
      return { ...base, bottom: 0, left: 'center' };
  }
}

export function buildThresholdMarkLine(
  threshold: number | undefined,
  label: string | undefined,
  theme: PuiChartTheme
): Record<string, unknown> | undefined {
  if (threshold == null) {
    return undefined;
  }

  return {
    markLine: {
      silent: true,
      symbol: 'none',
      lineStyle: { color: theme.warning ?? theme.primary, type: 'dashed', width: 1.5 },
      label: { formatter: label ?? 'Target', color: theme.textSecondary, fontSize: 11 },
      data: [{ yAxis: threshold }],
    },
  };
}

export function buildPremiumTooltip(
  theme: PuiChartTheme,
  enabled: boolean,
  formatter?: PuiChartValueFormatter
): NonNullable<PuiInternalEChartsOption['tooltip']> {
  if (!enabled) {
    return { show: false };
  }

  const preset = resolveChartAnimation('tooltipAppear');

  return {
    show: true,
    trigger: 'axis',
    confine: true,
    appendToBody: true,
    transitionDuration: preset.animationDuration,
    backgroundColor: theme.tooltipBackground,
    borderColor: theme.tooltipBorder,
    borderWidth: 1,
    padding: [10, 14],
    textStyle: {
      color: theme.tooltipText,
      fontSize: 12,
      fontFamily: 'inherit',
    },
    extraCssText:
      'border-radius:10px;box-shadow:0 12px 32px rgba(15,23,42,0.12);backdrop-filter:blur(8px);',
    axisPointer: {
      type: 'cross',
      crossStyle: { color: theme.grid, width: 1, type: 'dashed' },
      lineStyle: { color: theme.primary, width: 1, type: 'dashed', opacity: 0.65 },
      label: {
        backgroundColor: theme.surface,
        color: theme.textSecondary,
        borderColor: theme.tooltipBorder,
        borderWidth: 1,
      },
    },
    formatter: formatter
      ? (params: unknown) => formatTooltipParams(params, formatter)
      : undefined,
  };
}

export function buildItemTooltip(
  theme: PuiChartTheme,
  enabled: boolean,
  formatter?: PuiChartValueFormatter
): NonNullable<PuiInternalEChartsOption['tooltip']> {
  if (!enabled) {
    return { show: false };
  }

  const preset = resolveChartAnimation('tooltipAppear');

  return {
    show: true,
    trigger: 'item',
    confine: true,
    appendToBody: true,
    transitionDuration: preset.animationDuration,
    backgroundColor: theme.tooltipBackground,
    borderColor: theme.tooltipBorder,
    borderWidth: 1,
    padding: [10, 14],
    textStyle: { color: theme.tooltipText, fontSize: 12, fontFamily: 'inherit' },
    extraCssText:
      'border-radius:10px;box-shadow:0 12px 32px rgba(15,23,42,0.12);backdrop-filter:blur(8px);',
    formatter: formatter
      ? (params: unknown) => formatItemTooltip(params, formatter)
      : undefined,
  };
}

function formatTooltipParams(params: unknown, formatter: PuiChartValueFormatter): string {
  const items = Array.isArray(params) ? params : [params];

  return items
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return '';
      }

      const record = item as Record<string, unknown>;
      const name = String(record['name'] ?? record['axisValue'] ?? '');
      const raw = record['value'];
      const value = typeof raw === 'number' ? formatter(raw) : String(raw ?? '');
      const marker = String(record['marker'] ?? '');

      return `${marker}${name}: <strong>${value}</strong>`;
    })
    .join('<br/>');
}

function formatItemTooltip(params: unknown, formatter: PuiChartValueFormatter): string {
  if (!params || typeof params !== 'object') {
    return '';
  }

  const record = params as Record<string, unknown>;
  const name = String(record['name'] ?? '');
  const raw = record['value'];
  const value = typeof raw === 'number' ? formatter(raw) : String(raw ?? '');
  const marker = String(record['marker'] ?? '');

  return `${marker}${name}: <strong>${value}</strong>`;
}

export function buildGrid(showGrid: boolean, theme: PuiChartTheme): NonNullable<PuiInternalEChartsOption['grid']> {
  return {
    left: 12,
    right: 16,
    top: 24,
    bottom: 8,
    containLabel: true,
    show: showGrid,
    borderColor: theme.grid,
  };
}

export function buildCategoryAxis(
  categories: readonly string[],
  theme: PuiChartTheme,
  showLabels: boolean
): NonNullable<PuiInternalEChartsOption['xAxis']> {
  return {
    type: 'category',
    data: [...categories],
    boundaryGap: true,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      show: showLabels,
      color: theme.axis,
      fontSize: 11,
      margin: 12,
    },
    splitLine: { show: false },
  };
}

export function buildValueAxis(
  theme: PuiChartTheme,
  showGrid: boolean,
  showLabels: boolean,
  formatter?: PuiChartValueFormatter
): NonNullable<PuiInternalEChartsOption['yAxis']> {
  return {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      show: showLabels,
      color: theme.axis,
      fontSize: 11,
      formatter: formatter ? (value: number) => formatter(value) : undefined,
    },
    splitLine: {
      show: showGrid,
      lineStyle: { color: theme.grid, type: 'dashed', opacity: 0.85 },
    },
  };
}

export function buildSeriesFocusEmphasis(enabled: boolean): Record<string, unknown> {
  if (!enabled) {
    return {};
  }

  return {
    emphasis: {
      ...PUI_CHART_EMPHASIS_STYLE,
      itemStyle: PUI_CHART_EMPHASIS_ITEM.itemStyle,
      lineStyle: PUI_CHART_EMPHASIS_ITEM.lineStyle,
    },
    blur: PUI_CHART_BLUR_STYLE,
  };
}

export function buildLargeSeriesOptions(large: boolean): Record<string, unknown> {
  if (!large) {
    return { progressive: 400, progressiveThreshold: 3000 };
  }

  return {
    large: true,
    largeThreshold: 800,
    progressive: 500,
    progressiveThreshold: 1000,
    sampling: 'lttb',
  };
}

export function resolveSeriesColors(
  theme: PuiChartTheme,
  appearanceColor?: string,
  appearanceColors?: readonly string[]
): readonly string[] {
  if (appearanceColors?.length) {
    return appearanceColors;
  }

  if (appearanceColor) {
    return [appearanceColor, ...theme.palette.slice(1)];
  }

  return theme.palette;
}

export function readField(point: Readonly<Record<string, unknown>>, field: string): unknown {
  return point[field];
}

export function readNumber(point: Readonly<Record<string, unknown>>, field: string): number {
  const value = readField(point, field);
  return typeof value === 'number' ? value : Number(value) || 0;
}

export function readString(point: Readonly<Record<string, unknown>>, field: string): string {
  const value = readField(point, field);
  return value == null ? '' : String(value);
}

export function groupByField(
  data: readonly Readonly<Record<string, unknown>>[],
  field: string
): Map<string, readonly Readonly<Record<string, unknown>>[]> {
  const groups = new Map<string, readonly Readonly<Record<string, unknown>>[]>();

  for (const point of data) {
    const key = readString(point, field) || 'Series';
    const existing = groups.get(key) ?? [];
    groups.set(key, [...existing, point]);
  }

  return groups;
}

export function buildGradientColor(color: string, vertical = true): object {
  return {
    type: 'linear',
    x: 0,
    y: vertical ? 0 : 0,
    x2: 0,
    y2: vertical ? 1 : 0,
    colorStops: [
      { offset: 0, color: `${color}cc` },
      { offset: 1, color: `${color}22` },
    ],
  };
}

export function buildZoomConfig(enabled: boolean): Partial<PuiInternalEChartsOption> {
  if (!enabled) {
    return {};
  }

  return {
    dataZoom: [
      { type: 'inside', throttle: 50 },
      { type: 'slider', height: 18, bottom: 4, borderColor: 'transparent' },
    ],
  };
}

export function buildEmptyOption(theme: PuiChartTheme, label: string): PuiInternalEChartsOption {
  return {
    ...buildBaseAnimation(),
    backgroundColor: 'transparent',
    title: {
      text: label,
      left: 'center',
      top: 'middle',
      textStyle: { color: theme.textSecondary, fontSize: 13, fontWeight: 400 },
    },
  };
}
