import { InjectionToken, TemplateRef } from '@angular/core';
import type { PuiChartDataPoint } from '../interfaces/chart-data.types';

export interface PuiChartTooltipContext {
  readonly $implicit: PuiChartDataPoint & {
    readonly name?: string;
    readonly value?: number | string;
    readonly seriesName?: string;
    readonly color?: string;
  };
}

export const PUI_CHART_TOOLTIP_TEMPLATE = new InjectionToken<
  TemplateRef<PuiChartTooltipContext>
>('PUI_CHART_TOOLTIP_TEMPLATE');
