import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { buildFunnelChartOption } from '../../core/builders/funnel-chart.builder';
import { PuiChartBaseDirective } from '../../core/base/chart-base.directive';
import type { PuiFunnelChartConfig } from '../../core/interfaces/chart-config.types';
import type { PuiChartData } from '../../core/interfaces/chart-data.types';
import type { PuiInternalEChartsOption } from '../../core/adapters/echarts-internal.setup';

const CHART_SHELL = `
<div class="pui-chart" [style.min-height.px]="height()">
  <div class="pui-chart__canvas" [style.min-height.px]="height()"></div>
  @if (isEmpty() && !loading()) {
    <span class="pui-chart__sr-summary">{{ config()?.emptyLabel ?? 'No data available' }}</span>
  }
</div>`;

@Component({
  selector: 'pui-funnel-chart',
  template: CHART_SHELL,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-funnel-chart', '[style.display]': "'block'", '[style.width]': "'100%'" },
})
export class PuiFunnelChartComponent extends PuiChartBaseDirective {
  readonly config = input<PuiFunnelChartConfig>();
  readonly height = input(320);

  protected buildOption(data: PuiChartData): PuiInternalEChartsOption {
    return buildFunnelChartOption(data, this.config(), this.resolveTheme());
  }

  protected resolveConfigTheme() {
    return this.config()?.theme;
  }
}
