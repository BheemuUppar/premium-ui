import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { PuiDocsNavGroup } from '../docs.types';

@Component({
  selector: 'app-docs-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './docs-sidebar.component.html',
  styleUrl: './docs-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsSidebarComponent {
  protected readonly query = signal('');
  protected readonly collapsedGroups = signal<readonly string[]>([
    'foundations',
    'feedback',
    'navigation',
    'overlays',
    'layout',
    'utilities'
  ]);

  private readonly groups: readonly PuiDocsNavGroup[] = [
    {
      id: 'foundations',
      label: 'Foundations',
      items: [
        { label: 'Colors', route: ['/docs/foundations/colors'] },
        { label: 'Typography', route: ['/docs/foundations/typography'] },
        { label: 'Spacing', route: ['/docs/foundations/spacing'] }
      ]
    },
    {
      id: 'forms',
      label: 'Forms',
      items: [
        { label: 'Button', route: ['/docs/components/button/overview'], badge: 'Ready' },
        { label: 'Input', route: ['/docs/components/input/overview'], badge: 'Ready' },
        { label: 'Select', route: ['/docs/components/select/overview'], badge: 'Ready' },
        { label: 'Checkbox', route: ['/docs/components/checkbox/overview'], badge: 'Ready' },
        { label: 'Radio', route: ['/docs/components/radio/overview'], badge: 'Ready' },
        { label: 'Switch', route: ['/docs/components/switch/overview'], badge: 'Ready' },
        { label: 'Toggle', route: ['/docs/components/toggle/overview'], badge: 'Ready' }
      ]
    },
    {
      id: 'feedback',
      label: 'Feedback',
      items: [
        { label: 'Alert', route: ['/docs/components/alert'] },
        { label: 'Toast', route: ['/docs/components/toast'] },
        { label: 'Progress', route: ['/docs/components/progress'] }
      ]
    },
    {
      id: 'navigation',
      label: 'Navigation',
      items: [
        { label: 'Tabs', route: ['/docs/components/tabs'] },
        { label: 'Breadcrumb', route: ['/docs/components/breadcrumb'] }
      ]
    },
    {
      id: 'overlays',
      label: 'Overlays',
      items: [
        { label: 'Modal', route: ['/docs/components/modal'] },
        { label: 'Tooltip', route: ['/docs/components/tooltip'] }
      ]
    },
    {
      id: 'data-display',
      label: 'Data Display',
      items: [
        { label: 'Card', route: ['/docs/components/card/overview'], badge: 'Ready' },
        { label: 'Badge', route: ['/docs/components/badge'] },
        { label: 'Table', route: ['/docs/components/table'] }
      ]
    },
    {
      id: 'layout',
      label: 'Layout',
      items: [
        { label: 'Container', route: ['/docs/components/container'] },
        { label: 'Stack', route: ['/docs/components/stack'] }
      ]
    },
    {
      id: 'utilities',
      label: 'Utilities',
      items: [
        { label: 'Visually Hidden', route: ['/docs/components/visually-hidden'] },
        { label: 'Portal', route: ['/docs/components/portal'] }
      ]
    }
  ];

  protected readonly filteredGroups = computed(() => {
    const query = this.query().trim().toLowerCase();

    if (!query) {
      return this.groups;
    }

    return this.groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(query))
      }))
      .filter((group) => group.items.length > 0);
  });

  protected updateQuery(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }

  protected isCollapsed(groupId: string): boolean {
    return this.collapsedGroups().includes(groupId);
  }

  protected toggleGroup(groupId: string): void {
    this.collapsedGroups.update((groups) =>
      groups.includes(groupId) ? groups.filter((id) => id !== groupId) : [...groups, groupId]
    );
  }
}
