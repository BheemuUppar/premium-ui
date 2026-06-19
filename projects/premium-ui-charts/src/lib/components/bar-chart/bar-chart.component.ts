import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { buildBarChartOption } from '../../core/builders/bar-chart.builder';
import { PuiChartBaseDirective } from '../../core/base/chart-base.directive';
import type { PuiBarChartConfig } from '../../core/interfaces/chart-config.types';
import type { PuiChartData } from '../../core/interfaces/chart-data.types';
import type { PuiInternalEChartsOption } from '../../core/adapters/echarts-internal.setup';

@Component({
  selector: 'pui-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-bar-chart',
    '[style.display]': "'block'",
    '[style.width]': "'100%'",
  },
})
export class PuiBarChartComponent extends PuiChartBaseDirective {
  readonly config = input<PuiBarChartConfig>();
  readonly height = input(320);

  protected buildOption(data: PuiChartData): PuiInternalEChartsOption {
    return buildBarChartOption(data, this.config(), this.resolveTheme());
  }

  protected resolveConfigTheme() {
    return this.config()?.theme;
  }
}
