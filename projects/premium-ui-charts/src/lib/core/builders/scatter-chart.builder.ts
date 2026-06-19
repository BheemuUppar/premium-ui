import type { PuiScatterChartConfig } from '../interfaces/chart-config.types';
import type { PuiChartData } from '../interfaces/chart-data.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { mergeScatterChartConfig } from '../config/chart-config.defaults';
import type { PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';
import {
  buildBaseAnimation,
  buildEmptyOption,
  buildGrid,
  buildItemTooltip,
  buildLegendOption,
  buildSeriesFocusEmphasis,
  buildValueAxis,
  groupByField,
  readNumber,
  resolveSeriesColors,
} from './chart-builder.utils';

/** Unified scatter + bubble builder — bubble when sizeField is set. */
export function buildScatterChartOption(
  data: PuiChartData,
  config: PuiScatterChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  const merged = mergeScatterChartConfig(config);
  const isBubble = merged.sizeField != null;

  if (!data.length) {
    return buildEmptyOption(theme, merged.emptyLabel);
  }

  const colors = resolveSeriesColors(theme, merged.appearance.color, merged.appearance.colors);
  const focus = buildSeriesFocusEmphasis(merged.interaction.seriesFocus);
  const sizeField = merged.sizeField;

  const mapPoint = (point: Readonly<Record<string, unknown>>): number[] => {
    const coords = [readNumber(point, merged.xField), readNumber(point, merged.yField)];
    return isBubble && sizeField ? [...coords, readNumber(point, sizeField)] : coords;
  };

  const buildPointSeries = (
    name: string | undefined,
    points: readonly Readonly<Record<string, unknown>>[],
    color: string
  ): Record<string, unknown> => ({
    name,
    type: 'scatter' as const,
    symbolSize: isBubble
      ? (value: number[]) => Math.max(8, Math.sqrt(value[2] ?? 1) * 3)
      : 10,
    itemStyle: { color, opacity: merged.appearance.opacity },
    data: points.map(mapPoint),
    ...focus,
  });

  const series =
    merged.seriesField != null
      ? [...groupByField(data, merged.seriesField)].map(([name, points], index) =>
          buildPointSeries(name, points, colors[index % colors.length])
        )
      : [buildPointSeries(undefined, data, colors[0])];

  if (merged.showRegression && data.length >= 2) {
    const xs = data.map((point) => readNumber(point, merged.xField));
    const ys = data.map((point) => readNumber(point, merged.yField));
    const n = xs.length;
    const sumX = xs.reduce((a, b) => a + b, 0);
    const sumY = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((acc, x, i) => acc + x * (ys[i] ?? 0), 0);
    const sumXX = xs.reduce((acc, x) => acc + x * x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
    const intercept = (sumY - slope * sumX) / n;
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    series.push({
      name: 'Trend',
      type: 'line',
      symbol: 'none',
      lineStyle: { type: 'dashed', color: theme.textSecondary, width: 1.5 },
      data: [
        [minX, slope * minX + intercept],
        [maxX, slope * maxX + intercept],
      ],
      tooltip: { show: false },
    });
  }

  return {
    ...buildBaseAnimation(merged.animation),
    backgroundColor: 'transparent',
    color: [...colors],
    legend: buildLegendOption(theme, merged.legend),
    grid: buildGrid(merged.axis.showGrid, theme),
    tooltip: buildItemTooltip(theme, merged.interaction.tooltip, merged.valueFormatter),
    xAxis: buildValueAxis(theme, merged.axis.showGrid, merged.axis.showLabels, merged.valueFormatter),
    yAxis: buildValueAxis(theme, merged.axis.showGrid, merged.axis.showLabels, merged.valueFormatter),
    series,
  };
}

/** @internal Bubble charts use scatter builder with sizeField. */
export function buildBubbleChartOption(
  data: PuiChartData,
  config: PuiScatterChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  return buildScatterChartOption(data, config, theme);
}
