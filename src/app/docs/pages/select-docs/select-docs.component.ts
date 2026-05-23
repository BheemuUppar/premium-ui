import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiOptionComponent, PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectOption, PuiSelectValue } from '../../../../premium-ui/components/select';
import type { PuiSize } from '../../../../premium-ui/types/common.types';
import type { PuiDocsTab } from '../../docs.types';

type PuiDocsSelectTab =
  | 'overview'
  | 'examples'
  | 'api'
  | 'accessibility'
  | 'theming'
  | 'performance'
  | 'playground';

interface PuiSelectExample {
  readonly title: string;
  readonly description: string;
  readonly code: string;
  readonly searchable?: boolean;
  readonly multiple?: boolean;
  readonly virtualScroll?: boolean;
  readonly clearable?: boolean;
  readonly loading?: boolean;
}

interface PuiApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

const FRAMEWORK_OPTIONS: readonly PuiSelectOption[] = [
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte', disabled: true },
  { label: 'Solid', value: 'solid' },
];

const COUNTRY_OPTIONS: readonly PuiSelectOption[] = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'ca' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
];

function createLargeOptions(count: number): PuiSelectOption[] {
  return Array.from({ length: count }, (_, index) => ({
    label: `Option ${index + 1}`,
    value: index + 1,
  }));
}

@Component({
  selector: 'app-select-docs',
  imports: [PuiSelectComponent, PuiOptionComponent, ReactiveFormsModule, FormsModule, JsonPipe, RouterLink, RouterLinkActive],
  templateUrl: './select-docs.component.html',
  styleUrl: './select-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDocsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsSelectTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly currentCodeTab = signal<'html' | 'ts'>('html');

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/select/overview'] },
    { label: 'Examples', route: ['/docs/components/select/examples'] },
    { label: 'API Guide', route: ['/docs/components/select/api'] },
    { label: 'Accessibility', route: ['/docs/components/select/accessibility'] },
    { label: 'Theming', route: ['/docs/components/select/theming'] },
    { label: 'Performance', route: ['/docs/components/select/performance'] },
    { label: 'Playground', route: ['/docs/components/select/playground'] },
  ];

  protected readonly sizes: readonly PuiSize[] = ['sm', 'md', 'lg'];
  protected readonly frameworkOptions = FRAMEWORK_OPTIONS;
  protected readonly countryOptions = COUNTRY_OPTIONS;
  protected readonly largeOptions = createLargeOptions(10000);

  protected readonly selectedFramework = signal<PuiSelectValue>('angular');
  protected readonly selectedFrameworks = signal<PuiSelectValue>(['angular', 'react']);
  protected readonly ngModelFramework: PuiSelectValue = 'react';

  private readonly fb = inject(FormBuilder);
  protected readonly reactiveForm = this.fb.group({
    framework: this.fb.control<PuiSelectValue>('angular', Validators.required),
  });

  protected readonly htmlExample = `<pui-select
  [value]="selectedFramework()"
  (valueChange)="selectedFramework.set($event)"
  [options]="frameworks"
  placeholder="Select a framework"
/>`;

  protected readonly tsExample = `import { Component, signal } from '@angular/core';
import { PuiSelectComponent } from '@premium-ui/components';

@Component({
  selector: 'app-example',
  imports: [PuiSelectComponent],
  template: \`
    <pui-select
      [value]="selectedFramework()"
      (valueChange)="selectedFramework.set($event)"
      [options]="frameworks"
      placeholder="Select a framework"
    />
  \`
})
export class ExampleComponent {
  readonly selectedFramework = signal<string | null>('angular');
  readonly frameworks = [
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Vue', value: 'vue' }
  ];
}`;

  protected readonly declarativeExample = `<pui-select
  [value]="selectedFramework()"
  (valueChange)="selectedFramework.set($event)"
  placeholder="Choose a framework">
  <pui-option value="angular">Angular</pui-option>
  <pui-option value="react">React</pui-option>
  <pui-option value="vue">Vue</pui-option>
</pui-select>`;

  protected readonly signalExample = `selectedFramework = signal('angular');

<pui-select
  [value]="selectedFramework()"
  (valueChange)="selectedFramework.set($event)"
  placeholder="Signal-driven select"
>
  <pui-option value="angular">Angular</pui-option>
  <pui-option value="react">React</pui-option>
</pui-select>`;

  protected readonly ngModelExample = `<pui-select
  [(ngModel)]="framework"
  [options]="frameworks"
  placeholder="ngModel select"
/>`;

  protected readonly reactiveFormExample = `<form [formGroup]="form">
  <pui-select
    formControlName="framework"
    [options]="frameworks"
    placeholder="Reactive form select"
  />
</form>`;

  protected readonly multiExample = `<pui-select
  [value]="selectedFrameworks()"
  (valueChange)="selectedFrameworks.set($event)"
  multiple
  clearable
  placeholder="Select frameworks"
>
  <pui-option value="angular">Angular</pui-option>
  <pui-option value="react">React</pui-option>
  <pui-option value="vue">Vue</pui-option>
</pui-select>`;

  protected readonly examples: readonly PuiSelectExample[] = [
    {
      title: 'Basic select',
      description: 'Single selection with a declarative options array.',
      code: `<pui-select
  [(value)]="selectedFramework"
  [options]="frameworks"
  placeholder="Select a framework"
/>`,
    },
    {
      title: 'Searchable',
      description: 'Enable local filtering with the searchable input.',
      searchable: true,
      clearable: true,
      code: `<pui-select
  [options]="frameworks"
  searchable
  clearable
  placeholder="Search frameworks"
/>`,
    },
    {
      title: 'Multiple selection',
      description: 'Select multiple values with chip display.',
      multiple: true,
      clearable: true,
      code: `<pui-select
  [options]="countries"
  multiple
  clearable
  placeholder="Select countries"
/>`,
    },
    {
      title: 'Virtual scroll',
      description: 'Render large datasets efficiently with CDK virtualization.',
      virtualScroll: true,
      code: `<pui-select
  [options]="largeDataset"
  virtualScroll
  placeholder="Pick from 10k options"
/>`,
    },
    {
      title: 'Search + virtual scroll',
      description: 'Combine search and virtualization for scalable dropdowns.',
      searchable: true,
      virtualScroll: true,
      clearable: true,
      code: `<pui-select
  [options]="largeDataset"
  searchable
  virtualScroll
  clearable
  placeholder="Search 10k options"
/>`,
    },
    {
      title: 'Loading state',
      description: 'Show a loading indicator while async options resolve.',
      loading: true,
      searchable: true,
      code: `<pui-select
  [options]="options"
  searchable
  asyncSearch
  [loading]="isLoading"
  (searchChange)="loadOptions($event)"
/>`,
    },
  ];

  protected readonly inputRows: readonly PuiApiRow[] = [
    { name: 'options', type: 'PuiSelectOption[]', defaultValue: '[]', description: 'Array of selectable options with label, value, and optional disabled flag.' },
    { name: 'labelKey', type: 'string', defaultValue: 'label', description: 'Property name used for option labels when options are objects.' },
    { name: 'valueKey', type: 'string', defaultValue: 'value', description: 'Property name used for option values when options are objects.' },
    { name: 'value', type: 'PuiSelectValue', defaultValue: 'null', description: 'Two-way bindable selected value. Use [(value)] for signal-friendly updates.' },
    { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Enables multi-select with chip display.' },
    { name: 'searchable', type: 'boolean', defaultValue: 'false', description: 'Shows a search field and enables filtering.' },
    { name: 'virtualScroll', type: 'boolean', defaultValue: 'false', description: 'Virtualizes the option list for large datasets.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows a clear button when a value is selected.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the select trigger.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows loading state in trigger and panel.' },
    { name: 'placeholder', type: 'string | null', defaultValue: 'null', description: 'Placeholder text when no value is selected.' },
    { name: 'itemHeight', type: 'number', defaultValue: '36', description: 'Fixed row height used by virtual scroll.' },
    { name: 'maxPanelHeight', type: 'number', defaultValue: '280', description: 'Maximum dropdown panel height in pixels.' },
    { name: 'size', type: 'PuiSize', defaultValue: 'md', description: 'Controls trigger height and typography.' },
    { name: 'asyncSearch', type: 'boolean', defaultValue: 'false', description: 'Defers filtering to the parent via searchChange events.' },
    { name: 'filterFn', type: 'PuiSelectFilterFn | null', defaultValue: 'null', description: 'Custom local filter function for searchable mode.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Accessible label for the combobox trigger.' },
    { name: 'emptyMessage', type: 'string', defaultValue: 'No results found', description: 'Message shown when no options match.' },
  ];

  protected readonly outputRows: readonly PuiApiRow[] = [
    { name: 'valueChange', type: 'PuiSelectValue', defaultValue: '-', description: 'Emits when the selected value changes.' },
    { name: 'selectionChange', type: 'PuiSelectSelectionChange', defaultValue: '-', description: 'Emits value and the selected option metadata.' },
    { name: 'openChange', type: 'boolean', defaultValue: '-', description: 'Emits when the panel opens or closes.' },
    { name: 'searchChange', type: 'string', defaultValue: '-', description: 'Emits search query changes for local or async filtering.' },
  ];

  protected readonly themeCode = `:root {
  --pui-select-bg: var(--pui-color-surface);
  --pui-select-border: var(--pui-color-border);
  --pui-select-radius: var(--pui-radius-md);
  --pui-select-option-hover: color-mix(in srgb, var(--pui-color-primary) 8%, transparent);
  --pui-select-option-selected: color-mix(in srgb, var(--pui-color-primary) 12%, transparent);
}`;

  protected readonly customThemeCode = `:host {
  --pui-select-height: 3rem;
  --pui-select-option-active: color-mix(in srgb, var(--pui-color-primary) 20%, transparent);
}`;

  protected readonly playgroundSize = signal<PuiSize>('md');
  protected readonly playgroundSearchable = signal(false);
  protected readonly playgroundMultiple = signal(false);
  protected readonly playgroundVirtualScroll = signal(false);
  protected readonly playgroundClearable = signal(true);
  protected readonly playgroundDisabled = signal(false);

  protected readonly playgroundValue = signal<PuiSelectValue>('angular');

  protected readonly playgroundCode = computed(() => {
    const attrs = [
      this.playgroundSearchable() ? ' searchable' : '',
      this.playgroundMultiple() ? ' multiple' : '',
      this.playgroundVirtualScroll() ? ' virtualScroll' : '',
      this.playgroundClearable() ? ' clearable' : '',
      this.playgroundDisabled() ? ' [disabled]="true"' : '',
      this.playgroundSize() !== 'md' ? ` size="${this.playgroundSize()}"` : '',
    ].join('');

    return `<pui-select
  [(value)]="selected"
  [options]="options"${attrs}
  placeholder="Select an option"
/>`;
  });

  protected copyCode(code: string): void {
    void navigator.clipboard?.writeText(code);
  }

  protected updateSize(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as PuiSize;
    this.playgroundSize.set(value);
  }

  protected updateCheckbox(
    signalRef: ReturnType<typeof signal<boolean>>,
    event: Event
  ): void {
    signalRef.set((event.target as HTMLInputElement).checked);
  }

  private isDocsTab(tab: string): tab is PuiDocsSelectTab {
    return [
      'overview',
      'examples',
      'api',
      'accessibility',
      'theming',
      'performance',
      'playground',
    ].includes(tab);
  }
}
