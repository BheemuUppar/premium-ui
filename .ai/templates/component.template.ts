import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pui-__name__',
  templateUrl: './__name__.component.html',
  styleUrl: './__name__.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // add host classes
  }
})
export class Pui__Name__Component {
  readonly variant = input<'default' | 'outlined'>('default');
}
