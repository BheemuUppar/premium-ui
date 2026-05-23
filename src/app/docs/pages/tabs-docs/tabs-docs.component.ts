import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import {
  PUI_TABS_ORIENTATIONS,
  PUI_TABS_SIZES,
  PUI_TABS_VARIANTS,
  PuiTabItemComponent,
  PuiTabPanelComponent,
  PuiTabsComponent,
} from '../../../../premium-ui/components/tabs';
import type { PuiTabsOrientation, PuiTabsSize, PuiTabsVariant } from '../../../../premium-ui/components/tabs';
import type { PuiDocsTab } from '../../docs.types';

type PuiDocsTabsTab =
  | 'overview'
  | 'variants'
  | 'examples'
  | 'api'
  | 'accessibility'
  | 'theming'
  | 'keyboard'
  | 'playground';

interface PuiApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

interface PuiTabsVariantGuide {
  readonly id: PuiTabsVariant;
  readonly title: string;
  readonly description: string;
  readonly bestFor: string;
  readonly example: string;
}

@Component({
  selector: 'app-tabs-docs',
  imports: [PuiTabsComponent, PuiTabItemComponent, PuiTabPanelComponent, RouterLink, RouterLinkActive],
  templateUrl: './tabs-docs.component.html',
  styleUrl: './tabs-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsDocsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsTabsTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/tabs/overview'] },
    { label: 'Variants', route: ['/docs/components/tabs/variants'] },
    { label: 'Examples', route: ['/docs/components/tabs/examples'] },
    { label: 'API Guide', route: ['/docs/components/tabs/api'] },
    { label: 'Accessibility', route: ['/docs/components/tabs/accessibility'] },
    { label: 'Theming', route: ['/docs/components/tabs/theming'] },
    { label: 'Keyboard', route: ['/docs/components/tabs/keyboard'] },
    { label: 'Playground', route: ['/docs/components/tabs/playground'] },
  ];

  protected readonly variants = PUI_TABS_VARIANTS;
  protected readonly orientations = PUI_TABS_ORIENTATIONS;
  protected readonly sizes = PUI_TABS_SIZES;

  protected readonly selectedTab = signal('pg-one');

  protected readonly variantGuides: readonly PuiTabsVariantGuide[] = [
    {
      id: 'underline',
      title: 'Underline',
      description:
        'Minimal baseline navigation with a primary underline on the active tab. Inactive tabs use muted text.',
      bestFor: 'Page sections, settings areas, and content-heavy layouts.',
      example: `<pui-tabs variant="underline" ariaLabel="Project sections">...</pui-tabs>`,
    },
    {
      id: 'segmented',
      title: 'Segmented',
      description:
        'Toggle-group style control with an elevated sliding indicator. Active tab text sits above the indicator.',
      bestFor: 'View switchers, chart ranges, and compact filters.',
      example: `<pui-tabs variant="segmented" ariaLabel="View mode">...</pui-tabs>`,
    },
    {
      id: 'segmented-soft',
      title: 'Segmented Soft',
      description:
        'Inset track with a softer shadow and a tinted active indicator using primary color mixing.',
      bestFor: 'Dashboards, analytics toolbars, and nested panels.',
      example: `<pui-tabs variant="segmented-soft" ariaLabel="Time range">...</pui-tabs>`,
    },
    {
      id: 'pill',
      title: 'Pill',
      description:
        'Fully rounded segmented control with a sliding pill indicator. Same interaction model as segmented.',
      bestFor: 'Mobile-friendly toolbars, tags, and compact filters.',
      example: `<pui-tabs variant="pill" ariaLabel="Filter">...</pui-tabs>`,
    },
  ];

  protected readonly basicExample = `<pui-tabs variant="underline" ariaLabel="Project sections">
  <pui-tab-item id="overview" label="Overview" panelId="panel-overview"></pui-tab-item>
  <pui-tab-item id="analytics" label="Analytics" panelId="panel-analytics"></pui-tab-item>
  <pui-tab-item id="settings" label="Settings" panelId="panel-settings"></pui-tab-item>

  <pui-tab-panel tabId="overview" id="panel-overview">
    <p>Overview content</p>
  </pui-tab-panel>
  <pui-tab-panel tabId="analytics" id="panel-analytics">
    <p>Analytics content</p>
  </pui-tab-panel>
  <pui-tab-panel tabId="settings" id="panel-settings">
    <p>Settings content</p>
  </pui-tab-panel>
</pui-tabs>`;

  protected readonly valueExample = `<pui-tabs variant="segmented" [(value)]="activeTab" ariaLabel="Sections">
  ...
</pui-tabs>`;

  protected readonly tabsApiRows: readonly PuiApiRow[] = [
    { name: 'variant', type: 'PuiTabsVariant', defaultValue: 'underline', description: 'Visual style: underline, segmented, segmented-soft, pill.' },
    { name: 'orientation', type: 'PuiTabsOrientation', defaultValue: 'horizontal', description: 'Layout direction for tab list and panels.' },
    { name: 'size', type: 'PuiTabsSize', defaultValue: 'md', description: 'Tab sizing: sm, md, lg.' },
    { name: 'value', type: 'string', defaultValue: "''", description: 'Two-way bindable selected tab id.' },
    { name: 'defaultValue', type: 'string', defaultValue: "''", description: 'Initial tab id before first render completes.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the entire tab group.' },
    { name: 'ariaLabel', type: 'string', defaultValue: 'Tabs', description: 'Accessible name for the tab list.' },
  ];

  protected readonly tabsOutputRows: readonly PuiApiRow[] = [
    { name: 'valueChange', type: 'string', defaultValue: '-', description: 'Emits the selected tab id when selection changes.' },
  ];

  protected readonly tabItemApiRows: readonly PuiApiRow[] = [
    { name: 'id', type: 'string', defaultValue: '-', description: 'Unique tab identifier (required).' },
    { name: 'label', type: 'string', defaultValue: '-', description: 'Visible tab label (required).' },
    { name: 'panelId', type: 'string', defaultValue: "''", description: 'ID of the associated panel for aria-controls.' },
    { name: 'badge', type: 'number | boolean | null', defaultValue: 'null', description: 'Optional badge count or dot indicator.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the tab.' },
  ];

  protected readonly tabPanelApiRows: readonly PuiApiRow[] = [
    { name: 'tabId', type: 'string', defaultValue: '-', description: 'Matches the id of the associated pui-tab-item (required).' },
  ];

  protected readonly themeCode = `:host {
  --pui-tabs-list-bg: color-mix(in srgb, var(--pui-color-primary) 8%, var(--pui-color-surface));
  --pui-tabs-indicator-bg: var(--pui-color-surface);
  --pui-tabs-indicator-shadow: var(--pui-shadow-md);
  --pui-tabs-underline-active: var(--pui-color-primary);
  --pui-tabs-tab-color: color-mix(in srgb, var(--pui-color-text) 70%, transparent);
}`;

  protected readonly playgroundVariant = signal<PuiTabsVariant>('underline');
  protected readonly playgroundOrientation = signal<PuiTabsOrientation>('horizontal');
  protected readonly playgroundSize = signal<PuiTabsSize>('md');
  protected readonly playgroundDisabled = signal(false);

  protected readonly playgroundCode = computed(() => {
    const attrs = [
      `variant="${this.playgroundVariant()}"`,
      this.playgroundOrientation() !== 'horizontal' ? ` orientation="${this.playgroundOrientation()}"` : '',
      this.playgroundSize() !== 'md' ? ` size="${this.playgroundSize()}"` : '',
      this.playgroundDisabled() ? ' [disabled]="true"' : '',
      ' [(value)]="activeTab"',
      ' ariaLabel="Playground tabs"',
    ].join('');

    return `<pui-tabs ${attrs}>
  <pui-tab-item id="one" label="One" panelId="pg-one"></pui-tab-item>
  <pui-tab-item id="two" label="Two" panelId="pg-two"></pui-tab-item>
  <pui-tab-panel tabId="one" id="pg-one">Panel one</pui-tab-panel>
  <pui-tab-panel tabId="two" id="pg-two">Panel two</pui-tab-panel>
</pui-tabs>`;
  });

  protected copyCode(code: string): void {
    void navigator.clipboard?.writeText(code);
  }

  protected updateVariant(event: Event): void {
    this.playgroundVariant.set((event.target as HTMLSelectElement).value as PuiTabsVariant);
  }

  protected updateOrientation(event: Event): void {
    this.playgroundOrientation.set((event.target as HTMLSelectElement).value as PuiTabsOrientation);
  }

  protected updateSize(event: Event): void {
    this.playgroundSize.set((event.target as HTMLSelectElement).value as PuiTabsSize);
  }

  protected updateCheckbox(
    signalRef: ReturnType<typeof signal<boolean>>,
    event: Event
  ): void {
    signalRef.set((event.target as HTMLInputElement).checked);
  }

  protected onTabChange(id: string): void {
    this.selectedTab.set(id);
  }

  protected guideFor(variant: PuiTabsVariant): PuiTabsVariantGuide {
    return this.variantGuides.find((guide) => guide.id === variant) ?? this.variantGuides[0];
  }

  private isDocsTab(tab: string): tab is PuiDocsTabsTab {
    return [
      'overview',
      'variants',
      'examples',
      'api',
      'accessibility',
      'theming',
      'keyboard',
      'playground',
    ].includes(tab);
  }
}
