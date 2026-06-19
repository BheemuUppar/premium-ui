import type { PuiRadarChartConfig } from '../interfaces/chart-config.types';
import type { PuiChartData } from '../interfaces/chart-data.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { mergeRadarChartConfig } from '../config/chart-config.defaults';
import type { PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';
import {
  buildBaseAnimation,
  buildEmptyOption,
  buildItemTooltip,
  groupByField,
  readNumber,
  readString,
  resolveSeriesColors,
} from './chart-builder.utils';

export function buildRadarChartOption(
  data: PuiChartData,
  config: PuiRadarChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  const merged = mergeRadarChartConfig(config);

  if (!data.length) {
    return buildEmptyOption(theme, merged.emptyLabel);
  }

  const colors = resolveSeriesColors(theme, merged.appearance.color, merged.appearance.colors);
  const indicators = [...new Set(data.map((point) => readString(point, merged.labelField)))].map(
    (name) => ({ name, max: Math.max(...data.map((p) => readNumber(p, merged.valueField))) * 1.2 || 100 })
  );

  const seriesData =
    merged.seriesField != null
      ? [...groupByField(data, merged.seriesField)].map(([name, points], index) => ({
          name,
          value: indicators.map((indicator) => {
            const match = points.find((point) => readString(point, merged.labelField) === indicator.name);
            return match ? readNumber(match, merged.valueField) : 0;
          }),
          itemStyle: { color: colors[index % colors.length] },
          areaStyle: { opacity: 0.12 },
          lineStyle: { width: merged.appearance.lineWidth, color: colors[index % colors.length] },
        }))
      : [
          {
            value: data.map((point) => readNumber(point, merged.valueField)),
            itemStyle: { color: colors[0] },
            areaStyle: { opacity: 0.12 },
            lineStyle: { width: merged.appearance.lineWidth, color: colors[0] },
          },
        ];

  return {
    ...buildBaseAnimation(merged.animation),
    backgroundColor: 'transparent',
    color: [...colors],
    tooltip: buildItemTooltip(theme, merged.interaction.tooltip, merged.valueFormatter),
    radar: {
      indicator: indicators,
      splitLine: { lineStyle: { color: theme.grid } },
      axisName: { color: theme.axis, fontSize: 11 },
    },
    series: [{ type: 'radar', data: seriesData, emphasis: { focus: 'series' } }],
  };
}
