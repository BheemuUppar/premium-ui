import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import {
  PUI_TOGGLE_DENSITIES,
  PUI_TOGGLE_SHAPES,
  PUI_TOGGLE_VARIANTS,
  PuiToggleComponent,
  PuiToggleGroupComponent,
} from '../../../../premium-ui/components/toggle';
import type {
  PuiToggleDensity,
  PuiToggleGroupMode,
  PuiToggleShape,
  PuiToggleVariant,
} from '../../../../premium-ui/components/toggle';
import type { PuiSelectionValue, PuiSize } from '../../../../premium-ui/types/common.types';
import { PuiCheckboxComponent } from '../../../../premium-ui/components/checkbox';
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectValue } from '../../../../premium-ui/components/select';
import type { PuiDocCodeTab, PuiDocApiRow, PuiDocA11yItem, PuiDocKeyboardShortcut, PuiDocsTab } from '../../docs.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocCodeBlockComponent,
  PuiDocKeyboardShortcutsComponent,
  buildPlaygroundTsExample,
  toSelectOptions,
} from '../../shared';

type PuiDocsToggleTab =
  | 'overview'
  | 'variants'
  | 'examples'
  | 'api'
  | 'accessibility'
  | 'theming'
  | 'forms'
  | 'keyboard'
  | 'playground';

interface PuiApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-toggle-docs',
  imports: [
    PuiToggleComponent,
    PuiToggleGroupComponent,
    PuiSelectComponent,
    PuiCheckboxComponent,
    PuiDocApiTableComponent,
    PuiDocA11yListComponent,
    PuiDocCodeBlockComponent,
    PuiDocKeyboardShortcutsComponent,
    ReactiveFormsModule,
    JsonPipe,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './toggle-docs.component.html',
  styleUrl: './toggle-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleDocsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsToggleTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/toggle/overview'] },
    { label: 'Variants', route: ['/docs/components/toggle/variants'] },
    { label: 'Examples', route: ['/docs/components/toggle/examples'] },
    { label: 'API Guide', route: ['/docs/components/toggle/api'] },
    { label: 'Accessibility', route: ['/docs/components/toggle/accessibility'] },
    { label: 'Theming', route: ['/docs/components/toggle/theming'] },
    { label: 'Forms', route: ['/docs/components/toggle/forms'] },
    { label: 'Keyboard', route: ['/docs/components/toggle/keyboard'] },
    { label: 'Playground', route: ['/docs/components/toggle/playground'] },
  ];

  protected readonly variants = PUI_TOGGLE_VARIANTS;
  protected readonly shapes = PUI_TOGGLE_SHAPES;
  protected readonly densities = PUI_TOGGLE_DENSITIES;
  protected readonly modes: readonly PuiToggleGroupMode[] = ['default', 'segmented', 'toolbar'];
  protected readonly sizes: readonly PuiSize[] = ['sm', 'md', 'lg'];
  protected readonly modeOptions = toSelectOptions(this.modes);
  protected readonly variantOptions = toSelectOptions(this.variants);
  protected readonly shapeOptions = toSelectOptions(this.shapes);
  protected readonly densityOptions = toSelectOptions(this.densities);
  protected readonly sizeOptions = toSelectOptions(this.sizes);
  protected readonly orientationOptions = toSelectOptions(['horizontal', 'vertical'] as const);

  protected readonly bold = signal(false);
  protected readonly view = signal<PuiSelectionValue>('grid');
  protected readonly filters = signal<PuiSelectionValue[]>(['bold']);
  protected readonly teamFilters = signal<PuiSelectionValue[]>(['design', 'product']);
  protected readonly signalBold = signal(true);
  protected readonly playgroundView = signal<PuiSelectionValue>('grid');

  protected readonly reactiveForm = this.fb.nonNullable.group({
    bold: [false],
    view: ['grid' as PuiSelectionValue],
    filters: [['design'] as PuiSelectionValue[]],
  });

  protected readonly basicExample = `<pui-toggle [(pressed)]="bold">Bold</pui-toggle>`;

  protected readonly segmentedExample = `<pui-toggle-group mode="segmented" shape="pill" [(value)]="view" ariaLabel="View mode">
  <pui-toggle value="grid">Grid</pui-toggle>
  <pui-toggle value="list">List</pui-toggle>
</pui-toggle-group>`;

  protected readonly toolbarExample = `<pui-toggle-group mode="toolbar" multiple [(value)]="formatting" ariaLabel="Formatting">
  <pui-toggle iconOnly value="bold" ariaLabel="Bold">B</pui-toggle>
  <pui-toggle iconOnly value="italic" ariaLabel="Italic">I</pui-toggle>
</pui-toggle-group>`;

  protected readonly reactiveExample = `<form [formGroup]="form">
  <pui-toggle formControlName="bold">Bold</pui-toggle>
  <pui-toggle-group mode="segmented" formControlName="view" ariaLabel="View">
    <pui-toggle value="grid">Grid</pui-toggle>
    <pui-toggle value="list">List</pui-toggle>
  </pui-toggle-group>
</form>`;

  protected readonly signalExample = `<pui-toggle
  [pressed]="bold()"
  (pressedChange)="bold.set($event)"
>Bold</pui-toggle>`;

  protected readonly toggleApiRows: readonly PuiApiRow[] = [
    { name: 'variant', type: 'PuiToggleVariant', defaultValue: 'default', description: 'Visual surface: default, subtle, soft, outline, ghost, elevated, glass.' },
    { name: 'shape', type: 'PuiToggleShape', defaultValue: 'rounded', description: 'Corner shape: square, rounded, pill.' },
    { name: 'density', type: 'PuiToggleDensity', defaultValue: 'default', description: 'Spacing density: compact, default, comfortable.' },
    { name: 'size', type: 'PuiToggleSize', defaultValue: 'md', description: 'Control sizing.' },
    { name: 'pressed', type: 'boolean', defaultValue: 'false', description: 'Two-way bindable pressed state for standalone toggles.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows loading spinner and disables interaction.' },
    { name: 'iconOnly', type: 'boolean', defaultValue: 'false', description: 'Square icon-only layout for toolbars.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Accessible label when content is icon-only.' },
    { name: 'value', type: 'PuiToggleValue', defaultValue: 'undefined', description: 'Item value when used inside pui-toggle-group.' },
  ];

  protected readonly toggleOutputRows: readonly PuiApiRow[] = [
    { name: 'pressedChange', type: 'boolean', defaultValue: '-', description: 'Emits when standalone pressed state changes.' },
    { name: 'valueChange', type: 'PuiToggleValue | boolean', defaultValue: '-', description: 'Emits value or boolean on toggle.' },
  ];

  protected readonly groupApiRows: readonly PuiApiRow[] = [
    { name: 'mode', type: 'PuiToggleGroupMode', defaultValue: 'default', description: 'Layout mode: default, segmented (sliding indicator), toolbar.' },
    { name: 'variant', type: 'PuiToggleVariant', defaultValue: 'default', description: 'Visual surface inherited by child toggles.' },
    { name: 'shape', type: 'PuiToggleShape', defaultValue: 'rounded', description: 'Corner shape for group and items.' },
    { name: 'density', type: 'PuiToggleDensity', defaultValue: 'default', description: 'Spacing density (toolbar defaults to compact).' },
    { name: 'value', type: 'PuiToggleGroupSelection', defaultValue: 'null', description: 'Selected value(s) — single value or array when multiple.' },
    { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allow multiple pressed toggles (toolbar/filters).' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the entire group.' },
    { name: 'orientation', type: 'horizontal | vertical', defaultValue: 'horizontal', description: 'Layout and arrow-key direction.' },
    { name: 'size', type: 'PuiToggleSize', defaultValue: 'md', description: 'Default size for child toggles.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Accessible name for the group or toolbar.' },
  ];

  protected readonly groupOutputRows: readonly PuiApiRow[] = [
    { name: 'valueChange', type: 'PuiToggleGroupSelection', defaultValue: '-', description: 'Emits when selection changes.' },
    { name: 'selectionChange', type: 'PuiToggleGroupSelection', defaultValue: '-', description: 'Emits current selection after each change.' },
  ];

  protected readonly themeCode = `:host {
  --pui-toggle-bg-pressed: color-mix(in srgb, var(--pui-color-primary) 14%, var(--pui-color-surface));
  --pui-toggle-indicator-shadow: var(--pui-shadow-md);
  --pui-toggle-group-bg: color-mix(in srgb, var(--pui-color-text) 4%, var(--pui-color-surface));
}`;

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Toggle button', code: 'role="button"', description: 'Each toggle exposes aria-pressed for its on/off state.' },
    { title: 'Group roles', code: 'role="toolbar"', description: 'Toolbar groups use role="toolbar"; other groups use role="group".' },
    { title: 'Roving tabindex', description: 'One tab stop per group; arrow keys move focus between toggles.' },
    { title: 'Focus ring', description: 'Visible focus uses the shared premium-ui focus ring mixin (WCAG AA contrast).' },
    { title: 'Icon-only label', code: 'aria-label', description: 'Required when a toggle has no visible text label.' },
    { title: 'Orientation', code: 'aria-orientation', description: 'Reflects horizontal or vertical group layout for assistive tech.' },
    { title: 'Reduced motion', code: 'prefers-reduced-motion', description: 'Indicator and hover motion are disabled when the user prefers reduced motion.' },
  ];

  protected readonly a11yBestPractices: readonly PuiDocA11yItem[] = [
    { title: 'Segmented mode', description: 'Use for mutually exclusive options such as view mode or time period.' },
    { title: 'Toolbar mode', description: 'Use with multiple for independent formatting actions.' },
    { title: 'Group labelling', code: 'ariaLabel', description: 'Provide an accessible name on every group and icon-only toggle.' },
    { title: 'Switch vs toggle', description: 'Do not use toggles for persistent settings — use Switch instead.' },
  ];

  protected readonly keyboardShortcuts: readonly PuiDocKeyboardShortcut[] = [
    { keys: ['Space'], description: 'Toggle pressed state when focused.' },
    { keys: ['Enter'], description: 'Toggle pressed state when focused.' },
    { keys: ['Arrow keys'], description: 'Move focus within a group; segmented mode selects on navigate.' },
    { keys: ['Home', 'End'], description: 'Jump to the first or last enabled toggle.' },
    { keys: ['Tab'], description: 'Enter or leave the group roving tab stop.' },
    { keys: ['Shift', 'Tab'], description: 'Move focus to the previous control outside the group.' },
  ];

  protected readonly playgroundVariant = signal<PuiToggleVariant>('default');
  protected readonly playgroundShape = signal<PuiToggleShape>('pill');
  protected readonly playgroundDensity = signal<PuiToggleDensity>('default');
  protected readonly playgroundMode = signal<PuiToggleGroupMode>('segmented');
  protected readonly playgroundSize = signal<PuiSize>('md');
  protected readonly playgroundDisabled = signal(false);
  protected readonly playgroundMultiple = signal(false);
  protected readonly playgroundOrientation = signal<'horizontal' | 'vertical'>('horizontal');

  protected readonly playgroundCode = computed(() => {
    const groupAttrs = [
      `mode="${this.playgroundMode()}"`,
      this.playgroundVariant() !== 'default' ? ` variant="${this.playgroundVariant()}"` : '',
      this.playgroundShape() !== 'rounded' ? ` shape="${this.playgroundShape()}"` : '',
      this.playgroundDensity() !== 'default' ? ` density="${this.playgroundDensity()}"` : '',
      this.playgroundMultiple() ? ' multiple' : '',
      this.playgroundOrientation() !== 'horizontal' ? ` orientation="${this.playgroundOrientation()}"` : '',
      this.playgroundDisabled() ? ' [disabled]="true"' : '',
      ' [(value)]="view"',
      ' ariaLabel="Playground"',
    ].join('');

    return `<pui-toggle-group ${groupAttrs}>
  <pui-toggle value="grid">Grid</pui-toggle>
  <pui-toggle value="list">List</pui-toggle>
  <pui-toggle value="compact">Compact</pui-toggle>
</pui-toggle-group>`;
  });

  protected readonly playgroundExampleTabs = computed((): readonly PuiDocCodeTab[] => [
    { id: 'html', label: 'HTML', code: this.playgroundCode(), language: 'html', filename: 'playground.component.html' },
    { id: 'ts', label: 'TypeScript', code: this.playgroundTsExample(), language: 'typescript', filename: 'playground.component.ts' },
  ]);

  protected readonly playgroundTsExample = computed(() =>
    buildPlaygroundTsExample({
      componentClass: 'TogglePlaygroundComponent',
      imports: [
        { name: 'PuiToggleGroupComponent', path: '@premium-ui/components/toggle' },
        { name: 'PuiToggleComponent', path: '@premium-ui/components/toggle' },
      ],
      members: [
        "protected readonly view = signal('grid');",
        `protected readonly mode = signal('${this.playgroundMode()}' as const);`,
        `protected readonly variant = signal('${this.playgroundVariant()}' as const);`,
        `protected readonly shape = signal('${this.playgroundShape()}' as const);`,
        `protected readonly density = signal('${this.playgroundDensity()}' as const);`,
        `protected readonly disabled = signal(${this.playgroundDisabled()});`,
        `protected readonly multiple = signal(${this.playgroundMultiple()});`,
      ],
    })
  );

  protected setPlaygroundVariant(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundVariant.set(value as PuiToggleVariant);
    }
  }

  protected setPlaygroundShape(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundShape.set(value as PuiToggleShape);
    }
  }

  protected setPlaygroundDensity(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundDensity.set(value as PuiToggleDensity);
    }
  }

  protected setPlaygroundMode(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundMode.set(value as PuiToggleGroupMode);
    }
  }

  protected setPlaygroundSize(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundSize.set(value as PuiSize);
    }
  }

  protected setPlaygroundOrientation(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundOrientation.set(value as 'horizontal' | 'vertical');
    }
  }

  private isDocsTab(tab: string): tab is PuiDocsToggleTab {
    return [
      'overview',
      'variants',
      'examples',
      'api',
      'accessibility',
      'theming',
      'forms',
      'keyboard',
      'playground',
    ].includes(tab);
  }
}
