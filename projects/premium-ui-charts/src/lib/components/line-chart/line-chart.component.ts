import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { buildLineChartOption } from '../../core/builders/line-chart.builder';
import { PuiChartBaseDirective } from '../../core/base/chart-base.directive';
import type { PuiLineChartConfig } from '../../core/interfaces/chart-config.types';
import type { PuiChartData } from '../../core/interfaces/chart-data.types';
import type { PuiInternalEChartsOption } from '../../core/adapters/echarts-internal.setup';

@Component({
  selector: 'pui-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-line-chart',
    '[style.display]': "'block'",
    '[style.width]': "'100%'",
  },
})
export class PuiLineChartComponent extends PuiChartBaseDirective {
  readonly config = input<PuiLineChartConfig>();
  readonly height = input(320);

  protected buildOption(data: PuiChartData): PuiInternalEChartsOption {
    return buildLineChartOption(data, this.config(), this.resolveTheme());
  }

  protected resolveConfigTheme() {
    return this.config()?.theme;
  }
}
