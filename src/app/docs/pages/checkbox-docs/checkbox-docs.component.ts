import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import {
  PuiCheckboxComponent,
  PuiCheckboxDescriptionComponent,
  PuiCheckboxGroupComponent,
  PuiCheckboxLabelComponent,
} from '../../../../premium-ui/components/checkbox';
import type { PuiCheckboxVariant } from '../../../../premium-ui/components/checkbox';
import type { PuiSize } from '../../../../premium-ui/types/common.types';
import type { PuiDocsTab } from '../../docs.types';

type PuiDocsCheckboxTab =
  | 'overview'
  | 'examples'
  | 'api'
  | 'accessibility'
  | 'forms'
  | 'signal-forms'
  | 'theming'
  | 'playground';

interface PuiApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-checkbox-docs',
  imports: [
    PuiCheckboxComponent,
    PuiCheckboxGroupComponent,
    PuiCheckboxLabelComponent,
    PuiCheckboxDescriptionComponent,
    ReactiveFormsModule,
    JsonPipe,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './checkbox-docs.component.html',
  styleUrl: './checkbox-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxDocsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsCheckboxTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/checkbox/overview'] },
    { label: 'Examples', route: ['/docs/components/checkbox/examples'] },
    { label: 'API Guide', route: ['/docs/components/checkbox/api'] },
    { label: 'Accessibility', route: ['/docs/components/checkbox/accessibility'] },
    { label: 'Forms', route: ['/docs/components/checkbox/forms'] },
    { label: 'Signal Forms', route: ['/docs/components/checkbox/signal-forms'] },
    { label: 'Theming', route: ['/docs/components/checkbox/theming'] },
    { label: 'Playground', route: ['/docs/components/checkbox/playground'] },
  ];

  protected readonly variants: readonly PuiCheckboxVariant[] = [
    'default',
    'filled',
    'soft',
    'minimal',
    'card',
  ];
  protected readonly sizes: readonly PuiSize[] = ['sm', 'md', 'lg'];

  protected readonly selectedFrameworks = signal<string[]>(['angular']);
  protected readonly signalChecked = signal(false);

  protected readonly reactiveForm = this.fb.nonNullable.group({
    terms: [false, Validators.requiredTrue],
    marketing: [true],
  });

  protected readonly basicExample = `<pui-checkbox>Accept terms and conditions</pui-checkbox>`;

  protected readonly controlledExample = `selected = signal(false);

onChecked(value: boolean) {
  this.selected.set(value);
}

<pui-checkbox
  [checked]="selected()"
  (checkedChange)="onChecked($event)"
>
  Accept terms
</pui-checkbox>`;

  protected readonly groupExample = `<pui-checkbox-group [(value)]="selected">
  <pui-checkbox value="angular">Angular</pui-checkbox>
  <pui-checkbox value="react">React</pui-checkbox>
</pui-checkbox-group>`;

  protected readonly reactiveExample = `<form [formGroup]="form">
  <pui-checkbox formControlName="terms">
    Accept terms
  </pui-checkbox>
</form>`;

  protected readonly cardExample = `<pui-checkbox variant="card" value="pro">
  <pui-checkbox-label>Pro plan</pui-checkbox-label>
  <pui-checkbox-description>Advanced features</pui-checkbox-description>
</pui-checkbox>`;

  protected readonly checkboxApiRows: readonly PuiApiRow[] = [
    { name: 'checked', type: 'boolean', defaultValue: 'false', description: 'Checked state. Supports two-way binding via [(checked)].' },
    { name: 'variant', type: 'PuiCheckboxVariant', defaultValue: 'default', description: 'Visual style: default, filled, soft, minimal, card.' },
    { name: 'size', type: 'PuiSize', defaultValue: 'md', description: 'Control and label scale: sm, md, lg.' },
    { name: 'value', type: 'unknown', defaultValue: 'undefined', description: 'Value used when nested inside pui-checkbox-group.' },
    { name: 'indeterminate', type: 'boolean', defaultValue: 'false', description: 'Mixed selection state for select-all patterns.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction.' },
    { name: 'readOnly', type: 'boolean', defaultValue: 'false', description: 'Prevents toggling while keeping focusable display.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Marks the checkbox as invalid for assistive tech.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows loading spinner in the control.' },
    { name: 'helper', type: 'string | null', defaultValue: 'null', description: 'Helper text linked via aria-describedby.' },
    { name: 'error', type: 'string | null', defaultValue: 'null', description: 'Error message; also sets invalid presentation.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Accessible label when visible label is insufficient.' },
  ];

  protected readonly groupApiRows: readonly PuiApiRow[] = [
    { name: 'value', type: 'unknown[]', defaultValue: '[]', description: 'Selected values. Supports [(value)] and ControlValueAccessor.' },
    { name: 'name', type: 'string | null', defaultValue: 'null', description: 'Shared name for grouped checkbox inputs.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the entire group.' },
    { name: 'orientation', type: 'vertical | horizontal', defaultValue: 'vertical', description: 'Layout direction for grouped checkboxes.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Accessible label for the group region.' },
  ];

  protected readonly outputApiRows: readonly PuiApiRow[] = [
    { name: 'checkedChange', type: 'boolean', defaultValue: '-', description: 'Emits when checked state changes (standalone checkbox).' },
    { name: 'valueChange', type: 'unknown[]', defaultValue: '-', description: 'Emits when group selection changes.' },
  ];

  protected readonly themeCode = `:host {
  --pui-checkbox-size: 1rem;
  --pui-checkbox-border: var(--pui-color-border);
  --pui-checkbox-bg: var(--pui-color-surface);
  --pui-checkbox-radius: var(--pui-radius-sm);
}`;

  protected readonly playgroundVariant = signal<PuiCheckboxVariant>('default');
  protected readonly playgroundSize = signal<PuiSize>('md');
  protected readonly playgroundChecked = signal(false);
  protected readonly playgroundDisabled = signal(false);
  protected readonly playgroundIndeterminate = signal(false);

  protected readonly playgroundCode = computed(() => {
    const attrs = [
      this.playgroundChecked() ? ' [checked]="true"' : '',
      this.playgroundDisabled() ? ' [disabled]="true"' : '',
      this.playgroundIndeterminate() ? ' [indeterminate]="true"' : '',
      this.playgroundVariant() !== 'default' ? ` variant="${this.playgroundVariant()}"` : '',
      this.playgroundSize() !== 'md' ? ` size="${this.playgroundSize()}"` : '',
    ].join('');

    return `<pui-checkbox${attrs}>Playground checkbox</pui-checkbox>`;
  });

  protected onSignalChecked(value: boolean): void {
    this.signalChecked.set(value);
  }

  protected copyCode(code: string): void {
    void navigator.clipboard?.writeText(code);
  }

  protected updateVariant(event: Event): void {
    this.playgroundVariant.set((event.target as HTMLSelectElement).value as PuiCheckboxVariant);
  }

  protected updateSize(event: Event): void {
    this.playgroundSize.set((event.target as HTMLSelectElement).value as PuiSize);
  }

  protected updateCheckbox(event: Event, signalRef: ReturnType<typeof signal<boolean>>): void {
    signalRef.set((event.target as HTMLInputElement).checked);
  }

  private isDocsTab(tab: string): tab is PuiDocsCheckboxTab {
    return [
      'overview',
      'examples',
      'api',
      'accessibility',
      'forms',
      'signal-forms',
      'theming',
      'playground',
    ].includes(tab);
  }
}
