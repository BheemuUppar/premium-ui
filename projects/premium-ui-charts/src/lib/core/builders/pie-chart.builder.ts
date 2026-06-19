import type { PuiPieChartConfig } from '../interfaces/chart-config.types';
import type { PuiChartData } from '../interfaces/chart-data.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { mergePieChartConfig } from '../config/chart-config.defaults';
import type { PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';
import {
  buildBaseAnimation,
  buildEmptyOption,
  buildItemTooltip,
  buildLegendOption,
  readNumber,
  readString,
  resolveSeriesColors,
} from './chart-builder.utils';

/** Unified pie + donut builder — variant driven by config. */
export function buildPieChartOption(
  data: PuiChartData,
  config: PuiPieChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  const merged = mergePieChartConfig(config);
  const isDonut = merged.variant === 'donut';

  if (!data.length) {
    return buildEmptyOption(theme, merged.emptyLabel);
  }

  const colors = resolveSeriesColors(theme, merged.appearance.color, merged.appearance.colors);
  const slices = data.map((point) => ({
    name: readString(point, merged.labelField),
    value: readNumber(point, merged.valueField),
  }));

  const titleParts: NonNullable<PuiInternalEChartsOption['title']>[] = [];

  if (isDonut && (merged.centerValue || merged.centerLabel)) {
    titleParts.push({
      text: merged.centerValue ?? '',
      subtext: merged.centerLabel ?? '',
      left: 'center',
      top: merged.semiCircle ? '68%' : '42%',
      textStyle: { color: theme.textPrimary, fontSize: 22, fontWeight: 600 },
      subtextStyle: { color: theme.textSecondary, fontSize: 12 },
    });
  }

  const radius = isDonut
    ? merged.semiCircle
      ? [merged.innerRadius, '92%']
      : [merged.innerRadius, '82%']
    : merged.semiCircle
      ? ['0%', '92%']
      : '78%';

  return {
    ...buildBaseAnimation(merged.animation),
    backgroundColor: 'transparent',
    color: [...colors],
    title: titleParts.length ? titleParts : undefined,
    legend: merged.showLegend ? buildLegendOption(theme, merged.legend) : { show: false },
    tooltip: buildItemTooltip(theme, merged.interaction.tooltip, merged.valueFormatter),
    series: [
      {
        type: 'pie',
        radius,
        center: ['50%', merged.semiCircle ? '72%' : isDonut ? '50%' : '46%'],
        startAngle: merged.semiCircle ? 180 : 90,
        endAngle: merged.semiCircle ? 0 : undefined,
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: merged.appearance.radius,
          borderColor: theme.surface,
          borderWidth: 2,
        },
        label: isDonut
          ? { show: false }
          : {
              show: true,
              color: theme.textSecondary,
              formatter: '{b}: {d}%',
              fontSize: 11,
            },
        emphasis: {
          scale: true,
          scaleSize: 10,
          itemStyle: { shadowBlur: 18, shadowColor: 'rgba(15, 23, 42, 0.16)' },
        },
        blur: { itemStyle: { opacity: 0.35 } },
        data: slices,
      },
    ],
  };
}

/** @internal Donut charts use the pie builder with variant: 'donut'. */
export function buildDonutChartOption(
  data: PuiChartData,
  config: PuiPieChartConfig | undefined,
  theme: PuiChartTheme
): PuiInternalEChartsOption {
  return buildPieChartOption(data, { ...config, variant: 'donut' }, theme);
}
