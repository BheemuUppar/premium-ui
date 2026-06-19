/**
 * Internal ECharts bootstrap — not part of the public API.
 */
import * as echarts from 'echarts/core';
import {
  BarChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  TreemapChart,
} from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

let registered = false;

export function ensureEchartsRegistered(): typeof echarts {
  if (!registered) {
    echarts.use([
      LineChart,
      BarChart,
      PieChart,
      ScatterChart,
      RadarChart,
      HeatmapChart,
      FunnelChart,
      TreemapChart,
      GaugeChart,
      GridComponent,
      TooltipComponent,
      LegendComponent,
      TitleComponent,
      DataZoomComponent,
      MarkLineComponent,
      VisualMapComponent,
      CanvasRenderer,
    ]);
    registered = true;
  }

  return echarts;
}

export type PuiInternalECharts = ReturnType<typeof echarts.init>;
export type PuiInternalEChartsOption = echarts.EChartsCoreOption;
