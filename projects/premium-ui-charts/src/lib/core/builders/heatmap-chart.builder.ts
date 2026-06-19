import type { PuiHeatmapChartConfig } from '../interfaces/chart-config.types';
import type { PuiChartData } from '../interfaces/chart-data.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { mergeHeatmapChartConfig } from '../config/chart-config.defaults';
import type { PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';
import {
  buildBaseAnimation,
  buildEmptyOption,
  buildItemTooltip,
  readNumber,
  readString,
  resolveSeriesColors,
} from './chart-builder.utils';

export function buildHeatmapChartOption(
  data: PuiChartData,
  config: PuiHeatmapChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  const merged = mergeHeatmapChartConfig(config);

  if (!data.length) {
    return buildEmptyOption(theme, merged.emptyLabel);
  }

  const colors = resolveSeriesColors(theme, merged.appearance.color, merged.appearance.colors);
  const xCategories = [...new Set(data.map((point) => readString(point, merged.xField)))];
  const yCategories = [...new Set(data.map((point) => readString(point, merged.yField)))];
  const values = data.map((point) => [
    xCategories.indexOf(readString(point, merged.xField)),
    yCategories.indexOf(readString(point, merged.yField)),
    readNumber(point, merged.valueField),
  ]);
  const maxValue = Math.max(...data.map((point) => readNumber(point, merged.valueField)), 1);

  return {
    ...buildBaseAnimation(merged.animation),
    backgroundColor: 'transparent',
    tooltip: buildItemTooltip(theme, merged.interaction.tooltip, merged.valueFormatter),
    grid: { left: 48, right: 16, top: 16, bottom: 48, containLabel: true },
    xAxis: {
      type: 'category',
      data: xCategories,
      splitArea: { show: true },
      axisLabel: { color: theme.axis, fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: yCategories,
      splitArea: { show: true },
      axisLabel: { color: theme.axis, fontSize: 11 },
    },
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: [`${colors[0]}22`, colors[0]] },
      textStyle: { color: theme.textSecondary },
    },
    series: [
      {
        type: 'heatmap',
        data: values,
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(15,23,42,0.12)' } },
        itemStyle: { borderRadius: 4, borderColor: theme.surface, borderWidth: 1 },
      },
    ],
  };
}
