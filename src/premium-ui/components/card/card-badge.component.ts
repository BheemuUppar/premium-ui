import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import type { PuiCardBadgeVariant } from './card.types';

@Component({
  selector: 'pui-card-badge',
  template: '<span class="pui-card__badge"><ng-content /></span>',
  styleUrl: './card-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-card-badge',
    '[class.pui-card-badge--primary]': "variant() === 'primary'",
    '[class.pui-card-badge--success]': "variant() === 'success'",
    '[class.pui-card-badge--warning]': "variant() === 'warning'",
    '[class.pui-card-badge--danger]': "variant() === 'danger'",
    '[class.pui-card-badge--pill]': 'pill()',
  },
})
export class PuiCardBadgeComponent {
  readonly variant = input<PuiCardBadgeVariant>('default');
  readonly pill = input(false, { transform: booleanAttribute });
}
