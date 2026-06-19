import type { PuiFunnelChartConfig } from '../interfaces/chart-config.types';
import type { PuiChartData } from '../interfaces/chart-data.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { mergeFunnelChartConfig } from '../config/chart-config.defaults';
import type { PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';
import {
  buildBaseAnimation,
  buildEmptyOption,
  buildItemTooltip,
  readNumber,
  readString,
  resolveSeriesColors,
} from './chart-builder.utils';

export function buildFunnelChartOption(
  data: PuiChartData,
  config: PuiFunnelChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  const merged = mergeFunnelChartConfig(config);

  if (!data.length) {
    return buildEmptyOption(theme, merged.emptyLabel);
  }

  const colors = resolveSeriesColors(theme, merged.appearance.color, merged.appearance.colors);
  const steps = data.map((point) => ({
    name: readString(point, merged.labelField),
    value: readNumber(point, merged.valueField),
  }));

  return {
    ...buildBaseAnimation(merged.animation),
    backgroundColor: 'transparent',
    color: [...colors],
    tooltip: buildItemTooltip(theme, merged.interaction.tooltip, merged.valueFormatter),
    series: [
      {
        type: 'funnel',
        left: '10%',
        top: 24,
        bottom: 24,
        width: '80%',
        min: 0,
        max: Math.max(...steps.map((step) => step.value), 1),
        sort: 'descending',
        gap: 4,
        label: { show: true, color: theme.textPrimary, fontSize: 11 },
        itemStyle: { borderRadius: merged.appearance.radius, borderColor: theme.surface, borderWidth: 2 },
        emphasis: { label: { fontSize: 12 } },
        data: steps,
      },
    ],
  };
}
