import type { PuiTreemapChartConfig } from '../interfaces/chart-config.types';
import type { PuiChartData } from '../interfaces/chart-data.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { mergeTreemapChartConfig } from '../config/chart-config.defaults';
import type { PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';
import {
  buildBaseAnimation,
  buildEmptyOption,
  buildItemTooltip,
  readNumber,
  readString,
  resolveSeriesColors,
} from './chart-builder.utils';

export function buildTreemapChartOption(
  data: PuiChartData,
  config: PuiTreemapChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  const merged = mergeTreemapChartConfig(config);

  if (!data.length) {
    return buildEmptyOption(theme, merged.emptyLabel);
  }

  const colors = resolveSeriesColors(theme, merged.appearance.color, merged.appearance.colors);
  const nodes = data.map((point, index) => ({
    name: readString(point, merged.labelField),
    value: readNumber(point, merged.valueField),
    itemStyle: { color: colors[index % colors.length], borderRadius: merged.appearance.radius },
  }));

  return {
    ...buildBaseAnimation(merged.animation),
    backgroundColor: 'transparent',
    tooltip: buildItemTooltip(theme, merged.interaction.tooltip, merged.valueFormatter),
    series: [
      {
        type: 'treemap',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: { show: true, color: theme.textPrimary, fontSize: 11 },
        upperLabel: { show: false },
        itemStyle: { borderColor: theme.surface, borderWidth: 2, gapWidth: 2 },
        emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(15,23,42,0.14)' } },
        data: nodes,
      },
    ],
  };
}
