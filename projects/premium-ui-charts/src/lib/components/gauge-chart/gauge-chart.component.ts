import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { buildGaugeChartOption } from '../../core/builders/gauge-chart.builder';
import { PuiChartBaseDirective } from '../../core/base/chart-base.directive';
import type { PuiGaugeChartConfig } from '../../core/interfaces/chart-config.types';
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
  selector: 'pui-gauge-chart',
  template: CHART_SHELL,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-gauge-chart', '[style.display]': "'block'", '[style.width]': "'100%'" },
})
export class PuiGaugeChartComponent extends PuiChartBaseDirective {
  readonly config = input<PuiGaugeChartConfig>();
  readonly height = input(320);

  protected buildOption(data: PuiChartData): PuiInternalEChartsOption {
    return buildGaugeChartOption(data, this.config(), this.resolveTheme());
  }

  protected resolveConfigTheme() {
    return this.config()?.theme;
  }
}
