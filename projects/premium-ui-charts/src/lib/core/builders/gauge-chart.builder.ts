import type { PuiGaugeChartConfig } from '../interfaces/chart-config.types';
import type { PuiChartData } from '../interfaces/chart-data.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { mergeGaugeChartConfig } from '../config/chart-config.defaults';
import type { PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';
import {
  buildBaseAnimation,
  buildEmptyOption,
  readNumber,
  resolveSeriesColors,
} from './chart-builder.utils';

export function buildGaugeChartOption(
  data: PuiChartData,
  config: PuiGaugeChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  const merged = mergeGaugeChartConfig(config);

  if (!data.length) {
    return buildEmptyOption(theme, merged.emptyLabel);
  }

  const colors = resolveSeriesColors(theme, merged.appearance.color, merged.appearance.colors);
  const value = readNumber(data[0], merged.valueField);
  const isSemi = merged.variant === 'semi';
  const isKpi = merged.variant === 'kpi';

  return {
    ...buildBaseAnimation(merged.animation),
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: isSemi ? 200 : 225,
        endAngle: isSemi ? -20 : -45,
        min: merged.min,
        max: merged.max,
        radius: isKpi ? '88%' : '92%',
        center: ['50%', isSemi ? '68%' : '56%'],
        progress: {
          show: true,
          width: isKpi ? 14 : 10,
          itemStyle: { color: colors[0] },
        },
        axisLine: {
          lineStyle: {
            width: isKpi ? 14 : 10,
            color: [[1, `${theme.grid}`]],
          },
        },
        axisTick: { show: false },
        splitLine: { show: !isKpi, length: 8, lineStyle: { color: theme.grid } },
        axisLabel: { show: !isKpi, color: theme.axis, distance: 14, fontSize: 10 },
        pointer: { show: merged.variant !== 'kpi', width: 4, itemStyle: { color: colors[0] } },
        anchor: { show: merged.variant !== 'kpi', size: 8, itemStyle: { color: colors[0] } },
        detail: {
          valueAnimation: true,
          formatter: merged.unit ? `{value}${merged.unit}` : '{value}',
          color: theme.textPrimary,
          fontSize: isKpi ? 28 : 22,
          fontWeight: 600,
          offsetCenter: [0, isSemi ? '28%' : '24%'],
        },
        title: isKpi
          ? {
              show: true,
              offsetCenter: [0, '58%'],
              color: theme.textSecondary,
              fontSize: 12,
            }
          : undefined,
        data: [{ value, name: isKpi ? 'KPI' : undefined }],
      },
    ],
  };
}
