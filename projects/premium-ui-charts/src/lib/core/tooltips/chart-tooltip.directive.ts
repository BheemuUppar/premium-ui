import { Directive, TemplateRef, inject } from '@angular/core';
import type { PuiChartTooltipContext } from '../tokens/chart.tokens';

/**
 * Marks an `ng-template` as a custom chart tooltip renderer.
 *
 * @example
 * ```html
 * <ng-template puiChartTooltip let-point>
 *   {{ point.name }}: {{ point.value }}
 * </ng-template>
 *
 * <pui-line-chart [data]="data" [config]="{ interaction: { tooltip: true } }" />
 * ```
 */
@Directive({
  selector: '[puiChartTooltip]',
})
export class PuiChartTooltipDirective {
  readonly templateRef = inject(TemplateRef<PuiChartTooltipContext>);
}
