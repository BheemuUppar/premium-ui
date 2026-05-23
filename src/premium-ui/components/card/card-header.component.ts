import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'pui-card-header',
  template: '<div class="pui-card__header-inner"><ng-content /></div>',
  styleUrl: './card-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-card-header',
    '[class.pui-card-header--split]': 'split()',
  },
})
export class PuiCardHeaderComponent {
  readonly split = input(false, { transform: booleanAttribute });
}
