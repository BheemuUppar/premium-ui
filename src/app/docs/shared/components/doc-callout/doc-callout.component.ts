import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PuiDocCalloutVariant } from '../../../docs.types';

@Component({
  selector: 'pui-doc-callout',
  templateUrl: './doc-callout.component.html',
  styleUrl: './doc-callout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-doc-callout',
    '[class.pui-doc-callout--info]': "variant() === 'info'",
    '[class.pui-doc-callout--warning]': "variant() === 'warning'",
    '[class.pui-doc-callout--success]': "variant() === 'success'",
  },
})
export class PuiDocCalloutComponent {
  readonly title = input<string>('');
  readonly variant = input<PuiDocCalloutVariant>('info');
}
