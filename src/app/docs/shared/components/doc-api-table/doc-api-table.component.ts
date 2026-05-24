import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PuiDocApiRow } from '../../../docs.types';

@Component({
  selector: 'pui-doc-api-table',
  templateUrl: './doc-api-table.component.html',
  styleUrl: './doc-api-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocApiTableComponent {
  readonly title = input<string>('');
  readonly rows = input.required<readonly PuiDocApiRow[]>();
  readonly mode = input<'properties' | 'events'>('properties');

  protected isBoolean(value: string): boolean {
    return value === 'true' || value === 'false';
  }

  protected isDefaultBadge(value: string): boolean {
    return value !== '-' && value.length <= 24;
  }
}
