import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PuiDocA11yItem } from '../../../docs.types';

@Component({
  selector: 'pui-doc-a11y-list',
  templateUrl: './doc-a11y-list.component.html',
  styleUrl: './doc-a11y-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocA11yListComponent {
  readonly items = input.required<readonly PuiDocA11yItem[]>();
}
