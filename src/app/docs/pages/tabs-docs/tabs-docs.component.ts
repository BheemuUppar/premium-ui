import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
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
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectOption, PuiSelectValue } from '../../../../premium-ui/components/select';
import { PuiSwitchComponent } from '../../../../premium-ui/components/switch';
import type {
  PuiDocA11yItem,
  PuiDocApiRow,
  PuiDocBreadcrumb,
  PuiDocCodeTab,
  PuiDocKeyboardShortcut,
  PuiDocsTab,
  PuiDocsTocItem,
} from '../../docs.types';
import { PuiDocsTocService } from '../../services/docs-toc.service';
import {
  PuiDocA11yListComponent,
  PuiDocApiTableComponent,
  PuiDocCalloutComponent,
  PuiDocExampleComponent,
  PuiDocHeaderComponent,
  PuiDocKeyboardShortcutsComponent,
  PuiDocLayoutComponent,
  PuiDocPlaygroundComponent,
  PuiDocSectionComponent,
  PuiDocTabsNavComponent,
  buildHtmlTsTabs,
  buildPlaygroundTsExample,
} from '../../shared';

type PuiDocsTabsTab =
  | 'overview'
  | 'variants'
  | 'examples'
  | 'api'
  | 'accessibility'
  | 'theming'
  | 'keyboard'
  | 'playground';

interface PuiTabsVariantGuide {
  readonly id: PuiTabsVariant;
  readonly title: string;
  readonly description: string;
  readonly bestFor: string;
  readonly example: string;
  readonly exampleTabs: readonly PuiDocCodeTab[];
}

const TABS_IMPORTS: readonly { name: string; path: string }[] = [
  { name: 'PuiTabsComponent', path: '@premium-ui/components/tabs' },
  { name: 'PuiTabItemComponent', path: '@premium-ui/components/tabs' },
  { name: 'PuiTabPanelComponent', path: '@premium-ui/components/tabs' },
];

@Component({
  selector: 'app-tabs-docs',
  imports: [
    PuiDocLayoutComponent,
    PuiDocHeaderComponent,
    PuiDocTabsNavComponent,
    PuiDocSectionComponent,
    PuiDocExampleComponent,
    PuiDocApiTableComponent,
    PuiDocCalloutComponent,
    PuiDocPlaygroundComponent,
    PuiDocKeyboardShortcutsComponent,
    PuiDocA11yListComponent,
    PuiTabsComponent,
    PuiTabItemComponent,
    PuiTabPanelComponent,
    PuiSelectComponent,
    PuiSwitchComponent,
  ],
  templateUrl: './tabs-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsDocsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly tocService = inject(PuiDocsTocService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsTabsTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly breadcrumbs: readonly PuiDocBreadcrumb[] = [
    { label: 'Home', route: ['/docs/components/button/overview'] },
    { label: 'Components', route: ['/docs/components/tabs/overview'] },
    { label: 'Tabs' },
  ];

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

  protected readonly variantOptions: readonly PuiSelectOption[] = PUI_TABS_VARIANTS.map((variant) => ({
    label: variant,
    value: variant,
  }));

  protected readonly orientationOptions: readonly PuiSelectOption[] = PUI_TABS_ORIENTATIONS.map(
    (orientation) => ({ label: orientation, value: orientation })
  );

  protected readonly sizeOptions: readonly PuiSelectOption[] = PUI_TABS_SIZES.map((size) => ({
    label: size,
    value: size,
  }));

  protected readonly selectedTab = signal('pg-one');
  protected readonly playgroundVariant = signal<PuiTabsVariant>('underline');
  protected readonly playgroundOrientation = signal<PuiTabsOrientation>('horizontal');
  protected readonly playgroundSize = signal<PuiTabsSize>('md');
  protected readonly playgroundDisabled = signal(false);

  protected readonly variantGuides: readonly PuiTabsVariantGuide[] = [
    {
      id: 'underline',
      title: 'Underline',
      description:
        'Minimal baseline navigation with a primary underline on the active tab. Inactive tabs use muted text.',
      bestFor: 'Page sections, settings areas, and content-heavy layouts.',
      example: `<pui-tabs variant="underline" ariaLabel="Project sections">...</pui-tabs>`,
      exampleTabs: buildHtmlTsTabs(`<pui-tabs variant="underline" ariaLabel="Project sections">...</pui-tabs>`, {
        selector: 'app-underline-tabs',
        componentClass: 'UnderlineTabsComponent',
        imports: TABS_IMPORTS,
        templateUrl: './underline-tabs.component.html',
      }),
    },
    {
      id: 'segmented',
      title: 'Segmented',
      description:
        'Toggle-group style control with an elevated sliding indicator. Active tab text sits above the indicator.',
      bestFor: 'View switchers, chart ranges, and compact filters.',
      example: `<pui-tabs variant="segmented" ariaLabel="View mode">...</pui-tabs>`,
      exampleTabs: buildHtmlTsTabs(`<pui-tabs variant="segmented" ariaLabel="View mode">...</pui-tabs>`, {
        selector: 'app-segmented-tabs',
        componentClass: 'SegmentedTabsComponent',
        imports: TABS_IMPORTS,
        templateUrl: './segmented-tabs.component.html',
      }),
    },
    {
      id: 'segmented-soft',
      title: 'Segmented Soft',
      description:
        'Inset track with a softer shadow and a tinted active indicator using primary color mixing.',
      bestFor: 'Dashboards, analytics toolbars, and nested panels.',
      example: `<pui-tabs variant="segmented-soft" ariaLabel="Time range">...</pui-tabs>`,
      exampleTabs: buildHtmlTsTabs(`<pui-tabs variant="segmented-soft" ariaLabel="Time range">...</pui-tabs>`, {
        selector: 'app-segmented-soft-tabs',
        componentClass: 'SegmentedSoftTabsComponent',
        imports: TABS_IMPORTS,
        templateUrl: './segmented-soft-tabs.component.html',
      }),
    },
    {
      id: 'pill',
      title: 'Pill',
      description:
        'Fully rounded segmented control with a sliding pill indicator. Same interaction model as segmented.',
      bestFor: 'Mobile-friendly toolbars, tags, and compact filters.',
      example: `<pui-tabs variant="pill" ariaLabel="Filter">...</pui-tabs>`,
      exampleTabs: buildHtmlTsTabs(`<pui-tabs variant="pill" ariaLabel="Filter">...</pui-tabs>`, {
        selector: 'app-pill-tabs',
        componentClass: 'PillTabsComponent',
        imports: TABS_IMPORTS,
        templateUrl: './pill-tabs.component.html',
      }),
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

  protected readonly basicExampleTabs = buildHtmlTsTabs(this.basicExample, {
    selector: 'app-tabs-example',
    componentClass: 'TabsExampleComponent',
    imports: TABS_IMPORTS,
    templateUrl: './tabs-example.component.html',
  });

  protected readonly valueExample = `<pui-tabs variant="segmented" [(value)]="activeTab" ariaLabel="Sections">
  ...
</pui-tabs>`;

  protected readonly valueExampleTabs = buildHtmlTsTabs(this.valueExample, {
    selector: 'app-controlled-tabs',
    componentClass: 'ControlledTabsComponent',
    imports: TABS_IMPORTS,
    templateUrl: './controlled-tabs.component.html',
    usesSignal: true,
    members: ["protected readonly activeTab = signal('overview');"],
  });

  protected readonly tabsApiRows: readonly PuiDocApiRow[] = [
    { name: 'variant', type: 'PuiTabsVariant', defaultValue: 'underline', description: 'Visual style: underline, segmented, segmented-soft, pill.' },
    { name: 'orientation', type: 'PuiTabsOrientation', defaultValue: 'horizontal', description: 'Layout direction for tab list and panels.' },
    { name: 'size', type: 'PuiTabsSize', defaultValue: 'md', description: 'Tab sizing: sm, md, lg.' },
    { name: 'value', type: 'string', defaultValue: "''", description: 'Two-way bindable selected tab id.' },
    { name: 'defaultValue', type: 'string', defaultValue: "''", description: 'Initial tab id before first render completes.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the entire tab group.' },
    { name: 'ariaLabel', type: 'string', defaultValue: 'Tabs', description: 'Accessible name for the tab list.' },
  ];

  protected readonly tabsOutputRows: readonly PuiDocApiRow[] = [
    { name: 'valueChange', type: 'string', defaultValue: '-', description: 'Emits the selected tab id when selection changes.' },
  ];

  protected readonly tabItemApiRows: readonly PuiDocApiRow[] = [
    { name: 'id', type: 'string', defaultValue: '-', description: 'Unique tab identifier (required).' },
    { name: 'label', type: 'string', defaultValue: '-', description: 'Visible tab label (required).' },
    { name: 'panelId', type: 'string', defaultValue: "''", description: 'ID of the associated panel for aria-controls.' },
    { name: 'badge', type: 'number | boolean | null', defaultValue: 'null', description: 'Optional badge count or dot indicator.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the tab.' },
  ];

  protected readonly tabPanelApiRows: readonly PuiDocApiRow[] = [
    { name: 'tabId', type: 'string', defaultValue: '-', description: 'Matches the id of the associated pui-tab-item (required).' },
  ];

  protected readonly themeCode = `:host {
  --pui-tabs-list-bg: color-mix(in srgb, var(--pui-color-primary) 8%, var(--pui-color-surface));
  --pui-tabs-indicator-bg: var(--pui-color-surface);
  --pui-tabs-indicator-shadow: var(--pui-shadow-md);
  --pui-tabs-underline-active: var(--pui-color-primary);
  --pui-tabs-tab-color: color-mix(in srgb, var(--pui-color-text) 70%, transparent);
}`;

  protected readonly keyboardShortcuts: readonly PuiDocKeyboardShortcut[] = [
    { keys: ['Arrow Right', 'Arrow Left'], description: 'Move between tabs when orientation is horizontal.' },
    { keys: ['Arrow Down', 'Arrow Up'], description: 'Move between tabs when orientation is vertical.' },
    { keys: ['Home'], description: 'Jump to the first enabled tab.' },
    { keys: ['End'], description: 'Jump to the last enabled tab.' },
    { keys: ['Tab'], description: 'Move focus into the active panel content.' },
  ];

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Tab list', code: 'role="tablist"', description: 'Root list exposes an accessible name through aria-label and orientation through aria-orientation.' },
    { title: 'Tab', code: 'role="tab"', description: 'Each tab exposes aria-selected, aria-controls, and roving tabindex for keyboard focus.' },
    { title: 'Tab panel', code: 'role="tabpanel"', description: 'Active panel is labelled through aria-labelledby and only one panel is visible at a time.' },
    { title: 'Focus ring', description: 'Visible focus uses the shared premium-ui focus ring mixin for WCAG-compliant contrast.' },
  ];

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

  protected readonly playgroundExampleTabs = computed((): readonly PuiDocCodeTab[] => [
    {
      id: 'html',
      label: 'HTML',
      code: this.playgroundCode(),
      language: 'html',
      filename: 'playground.component.html',
    },
    {
      id: 'ts',
      label: 'TypeScript',
      code: this.playgroundTsExample(),
      language: 'typescript',
      filename: 'playground.component.ts',
    },
  ]);

  protected readonly playgroundTsExample = computed(() =>
    buildPlaygroundTsExample({
      componentClass: 'TabsPlaygroundComponent',
      imports: TABS_IMPORTS,
      members: [
        "protected readonly activeTab = signal('pg-one');",
        `protected readonly variant = signal('${this.playgroundVariant()}' as const);`,
        `protected readonly orientation = signal('${this.playgroundOrientation()}' as const);`,
        `protected readonly size = signal('${this.playgroundSize()}' as const);`,
        `protected readonly disabled = signal(${this.playgroundDisabled()});`,
      ],
    })
  );

  protected readonly playgroundMeta = computed(() => `Selected: ${this.selectedTab()}`);

  private readonly tocByTab = computed<Record<PuiDocsTabsTab, readonly PuiDocsTocItem[]>>(() => ({
    overview: [
      { id: 'tabs-intro', label: 'Introduction' },
      { id: 'tabs-basic', label: 'Basic usage' },
      { id: 'tabs-controlled', label: 'Controlled selection' },
    ],
    variants: this.variantGuides.flatMap((guide) => [
      { id: `tabs-variant-${guide.id}`, label: guide.title },
    ]).concat([
      { id: 'tabs-sizes', label: 'Sizes' },
      { id: 'tabs-orientations', label: 'Orientations' },
    ]),
    examples: [
      { id: 'tabs-example-dashboard', label: 'Dashboard navigation' },
      { id: 'tabs-example-view', label: 'View switcher' },
      { id: 'tabs-example-range', label: 'Time range filter' },
      { id: 'tabs-example-status', label: 'Status filter' },
    ],
    api: [
      { id: 'tabs-api-root', label: 'pui-tabs' },
      { id: 'tabs-api-item', label: 'pui-tab-item' },
      { id: 'tabs-api-panel', label: 'pui-tab-panel' },
    ],
    accessibility: [
      { id: 'tabs-a11y-semantic', label: 'Semantic roles' },
      { id: 'tabs-a11y-keyboard', label: 'Keyboard support' },
    ],
    theming: [{ id: 'tabs-theming-tokens', label: 'Design tokens' }],
    keyboard: [{ id: 'tabs-keyboard-demo', label: 'Interactive demo' }],
    playground: [{ id: 'tabs-playground', label: 'Live playground' }],
  }));

  constructor() {
    effect(() => {
      this.tocService.setItems(this.tocByTab()[this.currentTab()]);
    });

    this.destroyRef.onDestroy(() => this.tocService.clear());
  }

  protected isCompactVariant(variant: PuiTabsVariant): boolean {
    return variant === 'segmented' || variant === 'pill';
  }

  protected setPlaygroundVariant(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundVariant.set(value as PuiTabsVariant);
    }
  }

  protected setPlaygroundOrientation(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundOrientation.set(value as PuiTabsOrientation);
    }
  }

  protected setPlaygroundSize(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundSize.set(value as PuiTabsSize);
    }
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
