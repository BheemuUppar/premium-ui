import type { PuiLineChartConfig } from '../interfaces/chart-config.types';
import type { PuiChartData } from '../interfaces/chart-data.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { mergeLineChartConfig } from '../config/chart-config.defaults';
import type { PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';
import {
  buildBaseAnimation,
  buildCategoryAxis,
  buildEmptyOption,
  buildGradientColor,
  buildGrid,
  buildLargeSeriesOptions,
  buildLegendOption,
  buildPremiumTooltip,
  buildSeriesFocusEmphasis,
  buildThresholdMarkLine,
  buildValueAxis,
  buildZoomConfig,
  groupByField,
  isLargeDataset,
  readNumber,
  readString,
  resolveSeriesColors,
} from './chart-builder.utils';

/** Unified line + area builder — variant driven by config. */
export function buildLineChartOption(
  data: PuiChartData,
  config: PuiLineChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  const merged = mergeLineChartConfig(config);
  const isArea = merged.variant === 'area';

  if (!data.length) {
    return buildEmptyOption(theme, merged.emptyLabel);
  }

  const categories = [...new Set(data.map((point) => readString(point, merged.xField)))];
  const colors = resolveSeriesColors(theme, merged.appearance.color, merged.appearance.colors);
  const large = isLargeDataset(data.length);
  const focus = buildSeriesFocusEmphasis(merged.interaction.seriesFocus);
  const threshold = buildThresholdMarkLine(merged.threshold, merged.thresholdLabel, theme);

  const buildSeriesItem = (
    name: string | undefined,
    values: readonly (number | null)[],
    color: string,
    includeMarkLine: boolean
  ): Record<string, unknown> => ({
    name,
    type: 'line' as const,
    smooth: merged.appearance.smooth,
    symbol: merged.appearance.showMarkers || merged.showDataLabels ? 'circle' : 'none',
    symbolSize: 6,
    connectNulls: true,
    stack: isArea && merged.stacked ? 'total' : undefined,
    lineStyle: { width: merged.appearance.lineWidth, color, cap: 'round' },
    itemStyle: { color, opacity: merged.appearance.opacity },
    label: merged.showDataLabels
      ? { show: true, position: 'top', color: theme.textSecondary, fontSize: 10 }
      : { show: false },
    ...(isArea
      ? {
          areaStyle: {
            color: merged.appearance.gradient ? buildGradientColor(color) : `${color}33`,
            opacity: merged.appearance.opacity,
          },
        }
      : {}),
    data: [...values],
    ...(includeMarkLine ? threshold : {}),
    ...focus,
    ...buildLargeSeriesOptions(large),
  });

  const series =
    merged.seriesField != null
      ? [...groupByField(data, merged.seriesField)].map(([name, points], index) => {
          const color = colors[index % colors.length];
          const values = categories.map((category) => {
            const match = points.find((point) => readString(point, merged.xField) === category);
            return match ? readNumber(match, merged.yField) : null;
          });
          return buildSeriesItem(name, values, color, index === 0);
        })
      : [buildSeriesItem(undefined, data.map((point) => readNumber(point, merged.yField)), colors[0], true)];

  return {
    ...buildBaseAnimation(merged.animation),
    backgroundColor: 'transparent',
    color: [...colors],
    legend: buildLegendOption(theme, merged.legend),
    grid: buildGrid(merged.axis.showGrid, theme),
    tooltip: buildPremiumTooltip(theme, merged.interaction.tooltip, merged.valueFormatter),
    xAxis: buildCategoryAxis(categories, theme, merged.axis.showLabels),
    yAxis: buildValueAxis(theme, merged.axis.showGrid, merged.axis.showLabels, merged.valueFormatter),
    series,
    ...buildZoomConfig(merged.interaction.zoom),
  };
}

/** @internal Area charts use the line builder with variant: 'area'. */
export function buildAreaChartOption(
  data: PuiChartData,
  config: PuiLineChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  return buildLineChartOption(data, { ...config, variant: 'area' }, theme);
}
