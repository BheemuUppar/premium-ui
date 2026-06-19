import type { PuiChartLabelFormatter } from './chart-data.types';

export interface PuiChartAxisConfig {
  readonly showGrid?: boolean;
  readonly showLabels?: boolean;
  readonly labelFormatter?: PuiChartLabelFormatter;
}
