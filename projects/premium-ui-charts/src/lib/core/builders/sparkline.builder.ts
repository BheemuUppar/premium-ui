import type { PuiSparklineConfig } from '../interfaces/chart-config.types';
import type { PuiChartData } from '../interfaces/chart-data.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { mergeSparklineConfig } from '../config/chart-config.defaults';
import type { PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';
import {
  buildBaseAnimation,
  buildGradientColor,
  readNumber,
  resolveSeriesColors,
} from './chart-builder.utils';

export function buildSparklineOption(
  data: PuiChartData,
  config: PuiSparklineConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  const merged = mergeSparklineConfig(config);
  const colors = resolveSeriesColors(theme, merged.appearance.color, merged.appearance.colors);
  const color = colors[0];
  const values = data.map((point) => readNumber(point, merged.yField));
  const isArea = merged.variant === 'area';
  const isBar = merged.variant === 'bar';

  if (isBar) {
    return {
      ...buildBaseAnimation(merged.animation),
      backgroundColor: 'transparent',
      grid: { left: 0, right: 0, top: 2, bottom: 2 },
      xAxis: { type: 'category', show: false },
      yAxis: { type: 'value', show: false },
      tooltip: { show: false },
      series: [
        {
          type: 'bar',
          barWidth: '70%',
          itemStyle: {
            color,
            borderRadius: [2, 2, 0, 0],
            opacity: merged.appearance.opacity,
          },
          data: values,
        },
      ],
    };
  }

  return {
    ...buildBaseAnimation(merged.animation),
    backgroundColor: 'transparent',
    grid: { left: 0, right: 0, top: 2, bottom: 2 },
    xAxis: { type: 'category', show: false, boundaryGap: false },
    yAxis: { type: 'value', show: false, scale: true },
    tooltip: { show: false },
    series: [
      {
        type: 'line',
        smooth: merged.appearance.smooth,
        symbol: 'none',
        lineStyle: { width: 2, color, cap: 'round' },
        itemStyle: { color },
        areaStyle: isArea
          ? {
              color: merged.appearance.gradient ? buildGradientColor(color) : `${color}33`,
              opacity: 0.85,
            }
          : undefined,
        data: values,
      },
    ],
  };
}
