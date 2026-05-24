import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiOptionComponent, PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectOption, PuiSelectValue } from '../../../../premium-ui/components/select';
import { PuiCheckboxComponent } from '../../../../premium-ui/components/checkbox';
import type { PuiDocCodeTab, PuiDocApiRow, PuiDocA11yItem, PuiDocKeyboardShortcut, PuiDocsTab } from '../../docs.types';
import type { PuiSize } from '../../../../premium-ui/types/common.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocExampleComponent,
  PuiDocKeyboardShortcutsComponent,
  buildHtmlTsTabs,
  buildPlaygroundTsExample,
  buildThemeTabs,
  toSelectOptions,
} from '../../shared';
import { useDocsPageSeo } from '../../seo/use-docs-page-seo';
import type { PuiDocImportSpec } from '../../shared/utils/doc-example.utils';

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
  readonly tabs: readonly PuiDocCodeTab[];
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

const SELECT_IMPORT: PuiDocImportSpec = { name: 'PuiSelectComponent', path: '@premium-ui/components/select' };
const OPTION_IMPORT: PuiDocImportSpec = { name: 'PuiOptionComponent', path: '@premium-ui/components/select' };

const FRAMEWORK_MEMBERS: readonly string[] = [
  'protected readonly frameworks = [',
  "  { label: 'React', value: 'react' },",
  "  { label: 'Angular', value: 'angular' },",
  "  { label: 'Vue', value: 'vue' },",
  '];',
];

const COUNTRY_MEMBERS: readonly string[] = [
  'protected readonly countries = [',
  "  { label: 'United States', value: 'us' },",
  "  { label: 'United Kingdom', value: 'uk' },",
  "  { label: 'Canada', value: 'ca' },",
  '];',
];

const LARGE_DATASET_MEMBERS: readonly string[] = [
  'protected readonly largeDataset = Array.from({ length: 10000 }, (_, index) => ({',
  '  label: `Option ${index + 1}`,',
  '  value: `Option ${index + 1}`,',
  '}));',
];

function buildSelectExampleTabs(
  html: string,
  slug: string,
  config?: {
    readonly imports?: readonly PuiDocImportSpec[];
    readonly usesSignal?: boolean;
    readonly members?: readonly string[];
    readonly injects?: readonly PuiDocImportSpec[];
  }
): readonly PuiDocCodeTab[] {
  const pascalSlug = slug.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase()).replace(/^./, (c) => c.toUpperCase());

  return buildHtmlTsTabs(html, {
    selector: `app-select-${slug}`,
    componentClass: `Select${pascalSlug}ExampleComponent`,
    imports: config?.imports ?? [SELECT_IMPORT],
    templateUrl: `./select-${slug}.component.html`,
    usesSignal: config?.usesSignal,
    members: config?.members,
    injects: config?.injects,
  });
}
function createLargeOptions(count: number): PuiSelectOption[] {
  return Array.from({ length: count }, (_, index) => ({
    label: `Option ${index + 1}`,
    value: `Option ${index + 1}`,
  }));
}

@Component({
  selector: 'app-select-docs',
  imports: [PuiSelectComponent, PuiOptionComponent, PuiCheckboxComponent, PuiDocApiTableComponent, PuiDocA11yListComponent, PuiDocExampleComponent, PuiDocKeyboardShortcutsComponent, ReactiveFormsModule, FormsModule, JsonPipe, RouterLink, RouterLinkActive],
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

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/select/overview'] },
    { label: 'Examples', route: ['/docs/components/select/examples'] },
    { label: 'API Guide', route: ['/docs/components/select/api'] },
    { label: 'Accessibility', route: ['/docs/components/select/accessibility'] },
    { label: 'Theming', route: ['/docs/components/select/theming'] },
    { label: 'Performance', route: ['/docs/components/select/performance'] },
    { label: 'Playground', route: ['/docs/components/select/playground'] },
  ];

  constructor() {
    useDocsPageSeo({ slug: 'select', tab: this.currentTab });
  }

  protected readonly sizes: readonly PuiSize[] = ['sm', 'md', 'lg'];
  protected readonly sizeOptions = toSelectOptions(this.sizes);
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

  protected readonly sizesExampleCode = `<pui-select size="sm" [options]="frameworks" placeholder="sm select" />
<pui-select size="md" [options]="frameworks" placeholder="md select" />
<pui-select size="lg" [options]="frameworks" placeholder="lg select" />`;

  protected readonly sizesExampleTabs = buildSelectExampleTabs(this.sizesExampleCode, 'sizes', {
    members: FRAMEWORK_MEMBERS,
  });

  protected readonly htmlExample = `<pui-select
  [value]="selectedFramework()"
  (valueChange)="selectedFramework.set($event)"
  [options]="frameworks"
  placeholder="Select a framework"
/>`;

  protected readonly basicExampleTabs = buildHtmlTsTabs(this.htmlExample, {
    selector: 'app-select-example',
    componentClass: 'SelectExampleComponent',
    imports: [{ name: 'PuiSelectComponent', path: '@premium-ui/components/select' }],
    templateUrl: './select-example.component.html',
    usesSignal: true,
    members: [
      "protected readonly selectedFramework = signal<string | null>('angular');",
      'protected readonly frameworks = [',
      "  { label: 'React', value: 'react' },",
      "  { label: 'Angular', value: 'angular' },",
      "  { label: 'Vue', value: 'vue' },",
      '];',
    ],
  });

  protected readonly declarativeExample = `<pui-select
  [value]="selectedFramework()"
  (valueChange)="selectedFramework.set($event)"
  placeholder="Choose a framework">
  <pui-option value="angular">Angular</pui-option>
  <pui-option value="react">React</pui-option>
  <pui-option value="vue">Vue</pui-option>
</pui-select>`;

  protected readonly declarativeExampleTabs = buildSelectExampleTabs(this.declarativeExample, 'declarative', {
    imports: [SELECT_IMPORT, OPTION_IMPORT],
    usesSignal: true,
    members: ["protected readonly selectedFramework = signal('angular');"],
  });

  protected readonly signalExampleHtml = `<pui-select
  [value]="selectedFramework()"
  (valueChange)="selectedFramework.set($event)"
  placeholder="Signal-driven select"
>
  <pui-option value="angular">Angular</pui-option>
  <pui-option value="react">React</pui-option>
</pui-select>`;

  protected readonly signalExampleTabs = buildSelectExampleTabs(this.signalExampleHtml, 'signal', {
    imports: [SELECT_IMPORT, OPTION_IMPORT],
    usesSignal: true,
    members: ["protected readonly selectedFramework = signal('angular');"],
  });

  protected readonly ngModelExample = `<pui-select
  [(ngModel)]="framework"
  [options]="frameworks"
  placeholder="ngModel select"
/>`;

  protected readonly ngModelExampleTabs = buildSelectExampleTabs(this.ngModelExample, 'ngmodel', {
    imports: [
      SELECT_IMPORT,
      { name: 'FormsModule', path: '@angular/forms' },
    ],
    members: ["protected framework = 'react';", ...FRAMEWORK_MEMBERS],
  });

  protected readonly reactiveFormExample = `<form [formGroup]="form">
  <pui-select
    formControlName="framework"
    [options]="frameworks"
    placeholder="Reactive form select"
  />
</form>`;

  protected readonly reactiveFormExampleTabs = buildSelectExampleTabs(this.reactiveFormExample, 'reactive-form', {
    imports: [
      SELECT_IMPORT,
      { name: 'ReactiveFormsModule', path: '@angular/forms' },
    ],
    injects: [{ name: 'FormBuilder', path: '@angular/forms' }],
    members: [
      'private readonly fb = inject(FormBuilder);',
      "protected readonly form = this.fb.group({ framework: ['angular'] });",
      ...FRAMEWORK_MEMBERS,
    ],
  });

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

  protected readonly multiExampleTabs = buildSelectExampleTabs(this.multiExample, 'multiselect', {
    imports: [SELECT_IMPORT, OPTION_IMPORT],
    usesSignal: true,
    members: ["protected readonly selectedFrameworks = signal<string[]>(['angular']);"],
  });

  protected readonly examples: readonly PuiSelectExample[] = [
    {
      title: 'Basic select',
      description: 'Single selection with a declarative options array.',
      code: `<pui-select
  [(value)]="selectedFramework"
  [options]="frameworks"
  placeholder="Select a framework"
/>`,
      tabs: buildSelectExampleTabs(
        `<pui-select
  [(value)]="selectedFramework"
  [options]="frameworks"
  placeholder="Select a framework"
/>`,
        'basic',
        {
          usesSignal: true,
          members: ["protected readonly selectedFramework = signal('angular');", ...FRAMEWORK_MEMBERS],
        }
      ),
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
      tabs: buildSelectExampleTabs(
        `<pui-select
  [options]="frameworks"
  searchable
  clearable
  placeholder="Search frameworks"
/>`,
        'searchable',
        { members: FRAMEWORK_MEMBERS }
      ),
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
      tabs: buildSelectExampleTabs(
        `<pui-select
  [options]="countries"
  multiple
  clearable
  placeholder="Select countries"
/>`,
        'multiple',
        { members: COUNTRY_MEMBERS }
      ),
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
      tabs: buildSelectExampleTabs(
        `<pui-select
  [options]="largeDataset"
  virtualScroll
  placeholder="Pick from 10k options"
/>`,
        'virtual-scroll',
        { members: LARGE_DATASET_MEMBERS }
      ),
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
      tabs: buildSelectExampleTabs(
        `<pui-select
  [options]="largeDataset"
  searchable
  virtualScroll
  clearable
  placeholder="Search 10k options"
/>`,
        'search-virtual',
        { members: LARGE_DATASET_MEMBERS }
      ),
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
      tabs: buildSelectExampleTabs(
        `<pui-select
  [options]="options"
  searchable
  asyncSearch
  [loading]="isLoading"
  (searchChange)="loadOptions($event)"
/>`,
        'loading',
        {
          members: [
            'protected options: PuiSelectOption[] = [];',
            'protected isLoading = false;',
            'protected loadOptions(query: string): void {',
            '  this.isLoading = true;',
            '  // fetch options for query...',
            '}',
          ],
        }
      ),
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
    { name: 'useWorker', type: 'boolean', defaultValue: 'false', description: 'Opt-in worker delegation for search/filter on large datasets. Falls back to main thread when unavailable.' },
    { name: 'fuzzySearch', type: 'boolean', defaultValue: 'false', description: 'Enables fuzzy ranking when useWorker and searchable are active.' },
    { name: 'filterFn', type: 'PuiSelectFilterFn | null', defaultValue: 'null', description: 'Custom local filter function for searchable mode (main thread only).' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Accessible label for the combobox trigger.' },
    { name: 'emptyMessage', type: 'string', defaultValue: 'No results found', description: 'Message shown when no options match.' },
  ];

  protected readonly outputRows: readonly PuiApiRow[] = [
    { name: 'valueChange', type: 'PuiSelectValue', defaultValue: '-', description: 'Emits when the selected value changes.' },
    { name: 'selectionChange', type: 'PuiSelectSelectionChange', defaultValue: '-', description: 'Emits value and the selected option metadata.' },
    { name: 'openChange', type: 'boolean', defaultValue: '-', description: 'Emits when the panel opens or closes.' },
    { name: 'searchChange', type: 'string', defaultValue: '-', description: 'Emits search query changes for local or async filtering.' },
  ];

  protected readonly themeTabs = buildThemeTabs(`:root {
  --pui-select-bg: var(--pui-color-surface);
  --pui-select-border: var(--pui-color-border);
  --pui-select-radius: var(--pui-radius-md);
  --pui-select-option-hover: color-mix(in srgb, var(--pui-color-primary) 8%, transparent);
  --pui-select-option-selected: color-mix(in srgb, var(--pui-color-primary) 12%, transparent);
}`);

  protected readonly performanceExample = `<pui-select
  [options]="largeDataset"
  searchable
  virtualScroll
  [useWorker]="true"
  placeholder="50k options"
/>`;

  protected readonly performanceExampleTabs = buildSelectExampleTabs(this.performanceExample, 'performance', {
    members: LARGE_DATASET_MEMBERS,
  });

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Combobox pattern', code: 'role="combobox"', description: 'Trigger exposes combobox semantics with listbox popup and active descendant.' },
    { title: 'Active descendant', code: 'aria-activedescendant', description: 'Highlights the keyboard-focused option while the trigger retains focus.' },
    { title: 'Labelling', code: 'ariaLabel', description: 'Provide ariaLabel when the trigger has no visible label element.' },
    { title: 'Focus ring', code: '--pui-color-focus-ring', description: 'Focus-visible styles meet WCAG AA contrast in light and dark themes.' },
  ];

  protected readonly keyboardShortcuts: readonly PuiDocKeyboardShortcut[] = [
    { keys: ['ArrowDown', 'ArrowUp'], description: 'Navigate options in the open listbox.' },
    { keys: ['Enter', 'Space'], description: 'Open the panel or select the active option.' },
    { keys: ['Escape'], description: 'Close the panel and return focus to the trigger.' },
    { keys: ['Tab'], description: 'Close the panel and move focus to the next control.' },
    { keys: ['Home', 'End'], description: 'Jump to the first or last enabled option.' },
    { keys: ['Typeahead'], description: 'Jump to a matching option by typing its label.' },
  ];

  protected readonly customThemeTabs = buildThemeTabs(`:host {
  --pui-select-height: 3rem;
  --pui-select-option-active: color-mix(in srgb, var(--pui-color-primary) 20%, transparent);
}`);

  protected readonly playgroundSize = signal<PuiSize>('md');
  protected readonly playgroundSearchable = signal(false);
  protected readonly playgroundMultiple = signal(false);
  protected readonly playgroundVirtualScroll = signal(false);
  protected readonly playgroundUseWorker = signal(false);
  protected readonly playgroundFuzzySearch = signal(false);
  protected readonly playgroundClearable = signal(true);
  protected readonly playgroundDisabled = signal(false);

  protected readonly playgroundValue = signal<PuiSelectValue>('');

  protected readonly playgroundOptions = computed(() =>
    this.playgroundVirtualScroll() || this.playgroundUseWorker()
      ? this.largeOptions
      : this.frameworkOptions
  );

  protected readonly playgroundCode = computed(() => {
    const attrs = [
      this.playgroundSearchable() ? ' searchable' : '',
      this.playgroundMultiple() ? ' multiple' : '',
      this.playgroundVirtualScroll() ? ' virtualScroll' : '',
      this.playgroundUseWorker() ? ' useWorker' : '',
      this.playgroundFuzzySearch() ? ' fuzzySearch' : '',
      this.playgroundClearable() ? ' clearable' : '',
      this.playgroundDisabled() ? ' [disabled]="true"' : '',
      this.playgroundSize() !== 'md' ? ` size="${this.playgroundSize()}"` : '',
    ].join('');

    const optionsBinding =
      this.playgroundVirtualScroll() || this.playgroundUseWorker()
        ? 'largeOptions'
        : 'options';

    return `<pui-select
  [(value)]="selected"
  [options]="${optionsBinding}"${attrs}
  placeholder="Select an option"
/>`;
  });

  protected readonly playgroundExampleTabs = computed((): readonly PuiDocCodeTab[] => [
    { id: 'html', label: 'HTML', code: this.playgroundCode(), language: 'html', filename: 'playground.component.html' },
    { id: 'ts', label: 'TypeScript', code: this.playgroundTsExample(), language: 'typescript', filename: 'playground.component.ts' },
  ]);

  protected readonly playgroundTsExample = computed(() =>
    buildPlaygroundTsExample({
      componentClass: 'SelectPlaygroundComponent',
      imports: [{ name: 'PuiSelectComponent', path: '@premium-ui/components/select' }],
      members: [
        "protected readonly selected = signal('angular');",
        'protected readonly options = signal([...]);',
        `protected readonly size = signal('${this.playgroundSize()}' as const);`,
        `protected readonly searchable = signal(${this.playgroundSearchable()});`,
        `protected readonly multiple = signal(${this.playgroundMultiple()});`,
        `protected readonly virtualScroll = signal(${this.playgroundVirtualScroll()});`,
        `protected readonly useWorker = signal(${this.playgroundUseWorker()});`,
        `protected readonly clearable = signal(${this.playgroundClearable()});`,
        `protected readonly disabled = signal(${this.playgroundDisabled()});`,
      ],
    })
  );

  protected setPlaygroundSize(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundSize.set(value as PuiSize);
    }
  }

  protected setPlaygroundUseWorker(checked: boolean): void {
    this.playgroundUseWorker.set(checked);

    if (checked && !this.playgroundSearchable()) {
      this.playgroundSearchable.set(true);
    }

    if (!checked) {
      this.playgroundFuzzySearch.set(false);
    }
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
