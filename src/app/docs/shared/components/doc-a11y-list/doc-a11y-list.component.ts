import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { PuiDocA11yItem } from '../../../docs.types';

const CATEGORY_LABELS: Record<NonNullable<PuiDocA11yItem['category']>, string> = {
  keyboard: 'Keyboard support',
  aria: 'ARIA roles',
  'screen-reader': 'Screen reader notes',
  focus: 'Focus management',
  general: 'General',
};

@Component({
  selector: 'pui-doc-a11y-list',
  templateUrl: './doc-a11y-list.component.html',
  styleUrl: './doc-a11y-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocA11yListComponent {
  readonly title = input<string>('');
  readonly items = input.required<readonly PuiDocA11yItem[]>();
  readonly layout = input<'table' | 'cards'>('cards');

  protected readonly groupedItems = computed(() => {
    const groups = new Map<string, PuiDocA11yItem[]>();

    for (const item of this.items()) {
      const key = item.category ?? 'general';
      const label = CATEGORY_LABELS[key];
      const bucket = groups.get(label) ?? [];
      bucket.push(item);
      groups.set(label, bucket);
    }

    return [...groups.entries()].map(([label, entries]) => ({ label, entries }));
  });
}
