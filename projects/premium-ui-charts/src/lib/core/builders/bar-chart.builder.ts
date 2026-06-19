import type { PuiBarChartConfig } from '../interfaces/chart-config.types';
import type { PuiChartData, PuiChartDataPoint } from '../interfaces/chart-data.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { mergeBarChartConfig } from '../config/chart-config.defaults';
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

function normalizeStackedPercent(
  data: PuiChartData,
  xField: string,
  yField: string,
  seriesField: string | undefined
): PuiChartData {
  if (seriesField == null) {
    return data;
  }

  const categories = [...new Set(data.map((point) => readString(point, xField)))];
  const normalized: PuiChartDataPoint[] = [];

  for (const category of categories) {
    const points = data.filter((point) => readString(point, xField) === category);
    const total = points.reduce((sum, point) => sum + readNumber(point, yField), 0) || 1;

    for (const point of points) {
      normalized.push({
        ...point,
        [yField]: (readNumber(point, yField) / total) * 100,
      });
    }
  }

  return normalized;
}

export function buildBarChartOption(
  data: PuiChartData,
  config: PuiBarChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  const merged = mergeBarChartConfig(config);

  if (!data.length) {
    return buildEmptyOption(theme, merged.emptyLabel);
  }

  const isPercent = merged.mode === 'stacked100';
  const chartData = isPercent
    ? normalizeStackedPercent(data, merged.xField, merged.yField, merged.seriesField)
    : data;
  const horizontal = merged.orientation === 'horizontal';
  const categories = [...new Set(chartData.map((point) => readString(point, merged.xField)))];
  const colors = resolveSeriesColors(theme, merged.appearance.color, merged.appearance.colors);
  const large = isLargeDataset(chartData.length);
  const focus = buildSeriesFocusEmphasis(merged.interaction.seriesFocus);
  const radius = merged.appearance.radius;
  const threshold = buildThresholdMarkLine(merged.threshold, merged.thresholdLabel, theme);
  const stackMode = merged.mode === 'grouped' ? undefined : 'total';

  const buildBarSeries = (
    name: string | undefined,
    values: readonly (number | null)[],
    color: string,
    includeMarkLine: boolean
  ): Record<string, unknown> => ({
    name,
    type: 'bar',
    stack: stackMode,
    barMaxWidth: 42,
    itemStyle: {
      color: merged.appearance.gradient ? buildGradientColor(color, !horizontal) : color,
      borderRadius: horizontal ? [0, radius, radius, 0] : [radius, radius, 0, 0],
      opacity: merged.appearance.opacity,
    },
    label: merged.showDataLabels
      ? {
          show: true,
          position: horizontal ? 'right' : 'top',
          color: theme.textSecondary,
          fontSize: 10,
          formatter: isPercent ? '{c}%' : undefined,
        }
      : { show: false },
    emphasis: {
      focus: 'series',
      itemStyle: { opacity: 1, shadowBlur: 16, shadowColor: 'rgba(15, 23, 42, 0.14)' },
    },
    blur: focus['blur'],
    data: [...values],
    ...(includeMarkLine ? threshold : {}),
    ...buildLargeSeriesOptions(large),
  });

  const series =
    merged.seriesField != null
      ? [...groupByField(chartData, merged.seriesField)].map(([name, points], index) => {
          const color = colors[index % colors.length];
          const values = categories.map((category) => {
            const match = points.find((point) => readString(point, merged.xField) === category);
            return match ? readNumber(match, merged.yField) : null;
          });
          return buildBarSeries(name, values, color, index === 0);
        })
      : [
          buildBarSeries(
            undefined,
            chartData.map((point) => readNumber(point, merged.yField)),
            colors[0],
            true
          ),
        ];

  const categoryAxis = buildCategoryAxis(categories, theme, merged.axis.showLabels);
  const valueAxis = buildValueAxis(
    theme,
    merged.axis.showGrid,
    merged.axis.showLabels,
    isPercent ? (value) => `${Math.round(value)}%` : merged.valueFormatter
  );

  if (isPercent && typeof valueAxis === 'object' && valueAxis !== null && !Array.isArray(valueAxis)) {
    (valueAxis as { max?: number }).max = 100;
  }

  return {
    ...buildBaseAnimation(merged.animation),
    backgroundColor: 'transparent',
    color: [...colors],
    legend: buildLegendOption(theme, merged.legend),
    grid: buildGrid(merged.axis.showGrid, theme),
    tooltip: buildPremiumTooltip(theme, merged.interaction.tooltip, merged.valueFormatter),
    xAxis: horizontal ? valueAxis : categoryAxis,
    yAxis: horizontal ? categoryAxis : valueAxis,
    series,
    ...buildZoomConfig(merged.interaction.zoom),
  };
}
