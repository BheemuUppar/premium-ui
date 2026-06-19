import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { buildSparklineOption } from '../../core/builders/sparkline.builder';
import { PuiChartBaseDirective } from '../../core/base/chart-base.directive';
import type { PuiSparklineConfig } from '../../core/interfaces/chart-config.types';
import type { PuiChartData } from '../../core/interfaces/chart-data.types';
import type { PuiInternalEChartsOption } from '../../core/adapters/echarts-internal.setup';

@Component({
  selector: 'pui-sparkline',
  templateUrl: './sparkline.component.html',
  styleUrl: './sparkline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-sparkline',
    '[style.display]': "'block'",
    '[style.width]': "'100%'",
  },
})
export class PuiSparklineComponent extends PuiChartBaseDirective {
  readonly config = input<PuiSparklineConfig>();
  readonly height = computed(() => this.config()?.height ?? 48);

  protected buildOption(data: PuiChartData): PuiInternalEChartsOption {
    return buildSparklineOption(data, this.config(), this.resolveTheme());
  }

  protected resolveConfigTheme() {
    return this.config()?.theme;
  }
}
