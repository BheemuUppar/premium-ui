import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import {
  PuiRadioComponent,
  PuiRadioDescriptionComponent,
  PuiRadioGroupComponent,
  PuiRadioLabelComponent,
} from '../../../../premium-ui/components/radio';
import type { PuiRadioOrientation, PuiRadioValue, PuiRadioVariant } from '../../../../premium-ui/components/radio';
import { PuiCheckboxComponent } from '../../../../premium-ui/components/checkbox';
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectValue } from '../../../../premium-ui/components/select';
import type { PuiDocCodeTab, PuiDocApiRow, PuiDocA11yItem, PuiDocKeyboardShortcut, PuiDocsTab } from '../../docs.types';
import type { PuiSize } from '../../../../premium-ui/types/common.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocExampleComponent,
  PuiDocKeyboardShortcutsComponent,
  buildPlaygroundTsExample,
  toSelectOptions,
} from '../../shared';
import { useDocsPageSeo } from '../../seo/use-docs-page-seo';

type PuiDocsRadioTab =
  | 'overview'
  | 'variants'
  | 'examples'
  | 'api'
  | 'accessibility'
  | 'theming'
  | 'forms'
  | 'keyboard'
  | 'playground';

interface PuiApiRow extends PuiDocApiRow {}

@Component({
  selector: 'app-radio-docs',
  imports: [
    PuiRadioComponent,
    PuiRadioGroupComponent,
    PuiRadioLabelComponent,
    PuiRadioDescriptionComponent,
    PuiSelectComponent,
    PuiCheckboxComponent,
    PuiDocApiTableComponent,
    PuiDocA11yListComponent,
    PuiDocExampleComponent,
    PuiDocKeyboardShortcutsComponent,
    ReactiveFormsModule,
    JsonPipe,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './radio-docs.component.html',
  styleUrl: './radio-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioDocsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsRadioTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/radio/overview'] },
    { label: 'Variants', route: ['/docs/components/radio/variants'] },
    { label: 'Examples', route: ['/docs/components/radio/examples'] },
    { label: 'API Guide', route: ['/docs/components/radio/api'] },
    { label: 'Accessibility', route: ['/docs/components/radio/accessibility'] },
    { label: 'Theming', route: ['/docs/components/radio/theming'] },
    { label: 'Forms', route: ['/docs/components/radio/forms'] },
    { label: 'Keyboard', route: ['/docs/components/radio/keyboard'] },
    { label: 'Playground', route: ['/docs/components/radio/playground'] },
  ];

  constructor() {
    useDocsPageSeo({ slug: 'radio', tab: this.currentTab });
  }

  protected readonly variants: readonly PuiRadioVariant[] = [
    'default',
    'filled',
    'outlined',
    'soft',
    'minimal',
    'card',
  ];
  protected readonly sizes: readonly PuiSize[] = ['sm', 'md', 'lg'];
  protected readonly orientations: readonly PuiRadioOrientation[] = ['vertical', 'horizontal'];
  protected readonly variantOptions = toSelectOptions(this.variants);
  protected readonly sizeOptions = toSelectOptions(this.sizes);
  protected readonly orientationOptions = toSelectOptions(this.orientations);

  protected readonly theme = signal<PuiRadioValue>('system');
  protected readonly payment = signal<PuiRadioValue>('card');
  protected readonly plan = signal<PuiRadioValue>('pro');
  protected readonly filter = signal<PuiRadioValue>('weekly');
  protected readonly signalPlan = signal<PuiRadioValue>('pro');

  protected readonly reactiveForm = this.fb.nonNullable.group({
    plan: ['pro' as PuiRadioValue, Validators.required],
  });

  protected readonly basicExample = `<pui-radio-group [(value)]="theme" ariaLabel="Theme">
  <pui-radio value="light">Light</pui-radio>
  <pui-radio value="dark">Dark</pui-radio>
</pui-radio-group>`;

  protected readonly cardExample = `<pui-radio-group [(value)]="plan">
  <pui-radio variant="card" value="pro">
    <pui-radio-label>Pro plan</pui-radio-label>
    <pui-radio-description>$29 / month</pui-radio-description>
  </pui-radio>
</pui-radio-group>`;

  protected readonly reactiveExample = `<form [formGroup]="form">
  <pui-radio-group formControlName="plan" ariaLabel="Plan">
    <pui-radio value="starter">Starter</pui-radio>
    <pui-radio value="pro">Pro</pui-radio>
  </pui-radio-group>
</form>`;

  protected readonly signalExample = `<pui-radio-group
  [value]="plan()"
  (valueChange)="plan.set($event)"
>
  <pui-radio value="starter">Starter</pui-radio>
  <pui-radio value="pro">Pro</pui-radio>
</pui-radio-group>`;

  protected readonly radioApiRows: readonly PuiApiRow[] = [
    { name: 'variant', type: 'PuiRadioVariant', defaultValue: 'default', description: 'Visual style variant.' },
    { name: 'size', type: 'PuiRadioSize', defaultValue: 'md', description: 'Control size.' },
    { name: 'value', type: 'PuiRadioValue', defaultValue: 'undefined', description: 'Option value when used inside a group.' },
    { name: 'checked', type: 'boolean', defaultValue: 'false', description: 'Standalone checked state (two-way bindable).' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the radio option.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Invalid state styling.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Marks option as required.' },
    { name: 'name', type: 'string | null', defaultValue: 'null', description: 'Native radio group name.' },
    { name: 'label', type: 'string | null', defaultValue: 'null', description: 'Simple text label.' },
    { name: 'description', type: 'string | null', defaultValue: 'null', description: 'Supporting description text.' },
    { name: 'helperText', type: 'string | null', defaultValue: 'null', description: 'Helper text below the label.' },
  ];

  protected readonly groupApiRows: readonly PuiApiRow[] = [
    { name: 'value', type: 'PuiRadioValue | null', defaultValue: 'null', description: 'Selected value (two-way bindable).' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the entire group.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Group-level required state.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Group-level invalid state.' },
    { name: 'orientation', type: 'vertical | horizontal', defaultValue: 'vertical', description: 'Layout direction.' },
    { name: 'name', type: 'string | null', defaultValue: 'null', description: 'Shared name for native radios.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Accessible label for radiogroup.' },
  ];

  protected readonly outputRows: readonly PuiApiRow[] = [
    { name: 'checkedChange', type: 'boolean', defaultValue: '-', description: 'Emits when standalone radio checked state changes.' },
    { name: 'valueChange', type: 'PuiRadioValue', defaultValue: '-', description: 'Emits selected value from radio or group.' },
  ];

  protected readonly themeCode = `:host {
  --pui-radio-border: var(--pui-color-border);
  --pui-radio-glow: color-mix(in srgb, var(--pui-color-primary) 30%, transparent);
}`;

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Radio group', code: 'role="radiogroup"', description: 'Group container exposes single-select semantics and optional aria-label.' },
    { title: 'Native radios', code: 'input[type=radio]', description: 'Native inputs share a name for correct grouping and AT behavior.' },
    { title: 'Roving tabindex', description: 'Only the selected option is in the tab order; arrow keys move selection and focus.' },
    { title: 'Checked state', code: 'aria-checked', description: 'Each option exposes checked, invalid, and required state to assistive tech.' },
    { title: 'Focus ring', description: 'Visible focus uses the shared premium-ui focus ring mixin.' },
  ];

  protected readonly keyboardShortcuts: readonly PuiDocKeyboardShortcut[] = [
    { keys: ['Arrow Up', 'Arrow Down'], description: 'Move selection vertically in a group.' },
    { keys: ['Arrow Left', 'Arrow Right'], description: 'Move selection horizontally in a group.' },
    { keys: ['Home', 'End'], description: 'Jump to the first or last enabled option.' },
    { keys: ['Space'], description: 'Select the focused option.' },
    { keys: ['Tab'], description: 'Enter or leave the radio group.' },
  ];

  protected readonly playgroundVariant = signal<PuiRadioVariant>('default');
  protected readonly playgroundSize = signal<PuiSize>('md');
  protected readonly playgroundOrientation = signal<PuiRadioOrientation>('vertical');
  protected readonly playgroundDisabled = signal(false);
  protected readonly playgroundInvalid = signal(false);
  protected readonly playgroundValue = signal<PuiRadioValue>('a');

  protected readonly playgroundCode = computed(() => {
    const attrs = [
      this.playgroundDisabled() ? ' [disabled]="true"' : '',
      this.playgroundInvalid() ? ' invalid' : '',
      this.playgroundOrientation() !== 'vertical' ? ` orientation="${this.playgroundOrientation()}"` : '',
    ].join('');

    return `<pui-radio-group [(value)]="selected"${attrs} ariaLabel="Playground">
  <pui-radio variant="${this.playgroundVariant()}" size="${this.playgroundSize()}" value="a">Option A</pui-radio>
  <pui-radio variant="${this.playgroundVariant()}" size="${this.playgroundSize()}" value="b">Option B</pui-radio>
</pui-radio-group>`;
  });

  protected readonly playgroundExampleTabs = computed((): readonly PuiDocCodeTab[] => [
    { id: 'html', label: 'HTML', code: this.playgroundCode(), language: 'html', filename: 'playground.component.html' },
    { id: 'ts', label: 'TypeScript', code: this.playgroundTsExample(), language: 'typescript', filename: 'playground.component.ts' },
  ]);

  protected readonly playgroundTsExample = computed(() =>
    buildPlaygroundTsExample({
      componentClass: 'RadioPlaygroundComponent',
      imports: [
        { name: 'PuiRadioGroupComponent', path: '@premium-ui/components/radio' },
        { name: 'PuiRadioComponent', path: '@premium-ui/components/radio' },
      ],
      members: [
        "protected readonly selected = signal('a');",
        `protected readonly variant = signal('${this.playgroundVariant()}' as const);`,
        `protected readonly size = signal('${this.playgroundSize()}' as const);`,
        `protected readonly orientation = signal('${this.playgroundOrientation()}' as const);`,
        `protected readonly disabled = signal(${this.playgroundDisabled()});`,
        `protected readonly invalid = signal(${this.playgroundInvalid()});`,
      ],
    })
  );

  protected setPlaygroundVariant(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundVariant.set(value as PuiRadioVariant);
    }
  }

  protected setPlaygroundSize(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundSize.set(value as PuiSize);
    }
  }

  protected setPlaygroundOrientation(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundOrientation.set(value as PuiRadioOrientation);
    }
  }

  protected onSignalPlanChange(value: PuiRadioValue | null): void {
    if (value !== null) {
      this.signalPlan.set(value);
    }
  }

  private isDocsTab(tab: string): tab is PuiDocsRadioTab {
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
