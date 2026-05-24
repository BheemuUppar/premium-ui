import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiSwitchComponent } from '../../../../premium-ui/components/switch';
import type { PuiSwitchVariant } from '../../../../premium-ui/components/switch';
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

type PuiDocsSwitchTab =
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
  selector: 'app-switch-docs',
  imports: [PuiSwitchComponent, PuiSelectComponent, PuiCheckboxComponent, PuiDocApiTableComponent, PuiDocA11yListComponent, PuiDocExampleComponent, PuiDocKeyboardShortcutsComponent, ReactiveFormsModule, JsonPipe, RouterLink, RouterLinkActive],
  templateUrl: './switch-docs.component.html',
  styleUrl: './switch-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchDocsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsSwitchTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/switch/overview'] },
    { label: 'Variants', route: ['/docs/components/switch/variants'] },
    { label: 'Examples', route: ['/docs/components/switch/examples'] },
    { label: 'API Guide', route: ['/docs/components/switch/api'] },
    { label: 'Accessibility', route: ['/docs/components/switch/accessibility'] },
    { label: 'Theming', route: ['/docs/components/switch/theming'] },
    { label: 'Forms', route: ['/docs/components/switch/forms'] },
    { label: 'Keyboard', route: ['/docs/components/switch/keyboard'] },
    { label: 'Playground', route: ['/docs/components/switch/playground'] },
  ];

  protected readonly variants: readonly PuiSwitchVariant[] = [
    'default',
    'filled',
    'outlined',
    'soft',
    'minimal',
    'ios',
    'success',
    'danger',
  ];
  protected readonly sizes: readonly PuiSize[] = ['sm', 'md', 'lg'];
  protected readonly variantOptions = toSelectOptions(this.variants);
  protected readonly sizeOptions = toSelectOptions(this.sizes);

  protected readonly notifications = signal(true);
  protected readonly darkMode = signal(false);
  protected readonly analytics = signal(false);
  protected readonly signalEnabled = signal(true);

  protected readonly reactiveForm = this.fb.nonNullable.group({
    notifications: [true],
    autoUpdates: [false],
  });

  protected readonly basicExample = `<pui-switch
  [(checked)]="enabled"
  label="Enable notifications"
  description="Receive updates and alerts"
/>`;

  protected readonly reactiveExample = `<form [formGroup]="form">
  <pui-switch formControlName="notifications" label="Notifications" />
</form>`;

  protected readonly signalExample = `<pui-switch
  [checked]="enabled()"
  (checkedChange)="enabled.set($event)"
  label="Enable feature"
/>`;

  protected readonly apiRows: readonly PuiApiRow[] = [
    { name: 'variant', type: 'PuiSwitchVariant', defaultValue: 'default', description: 'Visual style including ios, success, and danger.' },
    { name: 'size', type: 'PuiSwitchSize', defaultValue: 'md', description: 'Track and thumb sizing.' },
    { name: 'checked', type: 'boolean', defaultValue: 'false', description: 'Two-way bindable on/off state.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows loading spinner and disables interaction.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Invalid state styling.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Required for forms.' },
    { name: 'label', type: 'string | null', defaultValue: 'null', description: 'Primary label text.' },
    { name: 'description', type: 'string | null', defaultValue: 'null', description: 'Supporting description.' },
    { name: 'helperText', type: 'string | null', defaultValue: 'null', description: 'Helper text below label.' },
    { name: 'error', type: 'string | null', defaultValue: 'null', description: 'Error message for invalid state.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Accessible label when visual label is omitted.' },
  ];

  protected readonly outputRows: readonly PuiApiRow[] = [
    { name: 'checkedChange', type: 'boolean', defaultValue: '-', description: 'Emits when checked state changes.' },
    { name: 'valueChange', type: 'boolean', defaultValue: '-', description: 'Emits boolean value on toggle.' },
  ];

  protected readonly themeCode = `:host {
  --pui-switch-track-bg-checked: var(--pui-color-primary);
  --pui-switch-focus-glow: color-mix(in srgb, var(--pui-color-primary) 30%, transparent);
}`;

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Switch role', code: 'role="switch"', description: 'Control button exposes switch semantics for on/off settings.' },
    { title: 'Checked state', code: 'aria-checked', description: 'Reflects on/off state along with disabled and invalid attributes.' },
    { title: 'Focus ring', description: 'Visible focus uses the shared premium-ui focus ring mixin.' },
    { title: 'Labelling', code: 'aria-describedby', description: 'Label, helper, and error text are associated with the control.' },
  ];

  protected readonly keyboardShortcuts: readonly PuiDocKeyboardShortcut[] = [
    { keys: ['Space'], description: 'Toggle the switch when focused.' },
    { keys: ['Enter'], description: 'Toggle the switch when focused.' },
    { keys: ['Tab'], description: 'Move focus to the next control.' },
    { keys: ['Shift', 'Tab'], description: 'Move focus to the previous control.' },
  ];

  protected readonly playgroundVariant = signal<PuiSwitchVariant>('default');
  protected readonly playgroundSize = signal<PuiSize>('md');
  protected readonly playgroundChecked = signal(false);
  protected readonly playgroundDisabled = signal(false);
  protected readonly playgroundLoading = signal(false);
  protected readonly playgroundInvalid = signal(false);

  protected readonly playgroundCode = computed(() => {
    const attrs = [
      this.playgroundChecked() ? ' [(checked)]="enabled"' : '',
      this.playgroundDisabled() ? ' [disabled]="true"' : '',
      this.playgroundLoading() ? ' [loading]="true"' : '',
      this.playgroundInvalid() ? ' invalid' : '',
      this.playgroundVariant() !== 'default' ? ` variant="${this.playgroundVariant()}"` : '',
      this.playgroundSize() !== 'md' ? ` size="${this.playgroundSize()}"` : '',
    ].join('');

    return `<pui-switch${attrs}
  label="Enable notifications"
/>`;
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
      componentClass: 'SwitchPlaygroundComponent',
      imports: [{ name: 'PuiSwitchComponent', path: '@premium-ui/components/switch' }],
      members: [
        'protected readonly enabled = signal(false);',
        `protected readonly variant = signal('${this.playgroundVariant()}' as const);`,
        `protected readonly size = signal('${this.playgroundSize()}' as const);`,
        `protected readonly disabled = signal(${this.playgroundDisabled()});`,
        `protected readonly loading = signal(${this.playgroundLoading()});`,
        `protected readonly invalid = signal(${this.playgroundInvalid()});`,
      ],
    })
  );

  protected setPlaygroundVariant(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundVariant.set(value as PuiSwitchVariant);
    }
  }

  protected setPlaygroundSize(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundSize.set(value as PuiSize);
    }
  }

  private isDocsTab(tab: string): tab is PuiDocsSwitchTab {
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
