import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PuiOptionComponent } from './option.component';
import { PuiSelectComponent } from './select.component';
import {
  BASIC_OPTIONS,
  COUNTRY_OPTIONS,
  FRAMEWORK_OPTIONS,
  LARGE_DATASET,
  STORY_LAYOUT,
  createLargeDataset,
} from './select.stories.constants';
import type { PuiSelectOption, PuiSelectValue } from './select.types';

const meta: Meta<PuiSelectComponent> = {
  title: 'Components/Select',
  component: PuiSelectComponent,
  tags: ['autodocs'],

  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    multiple: { control: 'boolean' },
    searchable: { control: 'boolean' },
    virtualScroll: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    asyncSearch: { control: 'boolean' },
    useWorker: { control: 'boolean' },
    fuzzySearch: { control: 'boolean' },
    placeholder: { control: 'text' },
    itemHeight: { control: 'number' },
    maxPanelHeight: { control: 'number' },
  },

  args: {
    options: BASIC_OPTIONS,
    size: 'md',
    multiple: false,
    searchable: false,
    virtualScroll: false,
    clearable: true,
    disabled: false,
    loading: false,
    asyncSearch: false,
    useWorker: false,
    fuzzySearch: false,
    placeholder: 'Select a framework',
    itemHeight: 36,
    maxPanelHeight: 280,
  },

  render: (args) => ({
    props: { ...args, selected: args['value'] ?? null },
    template: `
      <pui-select
        [(value)]="selected"
        [options]="options"
        [size]="size"
        [multiple]="multiple"
        [searchable]="searchable"
        [virtualScroll]="virtualScroll"
        [clearable]="clearable"
        [disabled]="disabled"
        [loading]="loading"
        [asyncSearch]="asyncSearch"
        [useWorker]="useWorker"
        [fuzzySearch]="fuzzySearch"
        [placeholder]="placeholder"
        [itemHeight]="itemHeight"
        [maxPanelHeight]="maxPanelHeight"
      />
      <p style="margin-top: var(--pui-space-sm); color: var(--pui-muted); font-size: var(--pui-font-size-sm);">
        Selected: {{ selected | json }}
      </p>
    `,
  }),
};

export default meta;

type Story = StoryObj<PuiSelectComponent>;

export const SingleSelect: Story = {
  args: {
    clearable: true,
    options: FRAMEWORK_OPTIONS,
    placeholder: 'Choose a framework',
  },
};

@Component({
  selector: 'pui-select-declarative-demo',
  imports: [PuiSelectComponent, PuiOptionComponent],
  template: `
    <pui-select [(value)]="selected" clearable placeholder="Choose a framework">
      <pui-option value="angular">Angular</pui-option>
      <pui-option value="react">React</pui-option>
      <pui-option value="vue">Vue</pui-option>
      <pui-option value="svelte" [disabled]="true">Svelte</pui-option>
    </pui-select>
    <p style="margin-top: var(--pui-space-sm); color: var(--pui-muted); font-size: var(--pui-font-size-sm);">
      Selected: {{ selected() }}
    </p>
  `,
})
class DeclarativeSingleDemoComponent {
  protected readonly selected = signal<PuiSelectValue>('angular');
}

export const SingleSelectDeclarative: Story = {
  render: () => ({
    moduleMetadata: { imports: [DeclarativeSingleDemoComponent] },
    template: `<pui-select-declarative-demo />`,
  }),
};

export const MultiSelect: Story = {
  args: {
    multiple: true,
    clearable: true,
    options: COUNTRY_OPTIONS,
    placeholder: 'Select countries',
  },
};

@Component({
  selector: 'pui-select-multi-declarative-demo',
  imports: [PuiSelectComponent, PuiOptionComponent],
  template: `
    <pui-select [(value)]="selected" multiple clearable placeholder="Select frameworks">
      <pui-option value="angular">Angular</pui-option>
      <pui-option value="react">React</pui-option>
      <pui-option value="vue">Vue</pui-option>
      <pui-option value="solid">Solid</pui-option>
    </pui-select>
    <p style="margin-top: var(--pui-space-sm); color: var(--pui-muted); font-size: var(--pui-font-size-sm);">
      Selected: {{ selected() | json }}
    </p>
  `,
})
class DeclarativeMultiDemoComponent {
  protected readonly selected = signal<PuiSelectValue>(['angular', 'react']);
}

export const MultiSelectDeclarative: Story = {
  render: () => ({
    moduleMetadata: { imports: [DeclarativeMultiDemoComponent] },
    template: `<pui-select-multi-declarative-demo />`,
  }),
};

export const Searchable: Story = {
  args: {
    searchable: true,
    clearable: true,
    options: FRAMEWORK_OPTIONS,
    placeholder: 'Search frameworks',
  },
};

export const SearchAndMultiSelect: Story = {
  args: {
    searchable: true,
    multiple: true,
    clearable: true,
    options: COUNTRY_OPTIONS,
    placeholder: 'Search and select countries',
  },
};

export const VirtualScroll: Story = {
  args: {
    virtualScroll: true,
    clearable: true,
    options: createLargeDataset(10000),
    placeholder: 'Pick from 10,000 options',
  },
};

export const SearchAndVirtualScroll: Story = {
  args: {
    searchable: true,
    virtualScroll: true,
    clearable: true,
    options: LARGE_DATASET,
    placeholder: 'Search 10k options',
  },
};

@Component({
  selector: 'pui-select-signal-demo',
  imports: [PuiSelectComponent, PuiOptionComponent],
  template: `
    <pui-select
      [value]="selected()"
      (valueChange)="selected.set($event)"
      clearable
      placeholder="Signal-driven select"
    >
      <pui-option value="angular">Angular</pui-option>
      <pui-option value="react">React</pui-option>
      <pui-option value="vue">Vue</pui-option>
    </pui-select>
    <p style="margin-top: var(--pui-space-sm); color: var(--pui-muted); font-size: var(--pui-font-size-sm);">
      Signal value: {{ selected() }}
    </p>
  `,
})
class SignalStateDemoComponent {
  protected readonly selected = signal<PuiSelectValue>('angular');
}

export const SignalStateExample: Story = {
  render: () => ({
    moduleMetadata: { imports: [SignalStateDemoComponent] },
    template: `<pui-select-signal-demo />`,
  }),
};

@Component({
  selector: 'pui-select-reactive-form-demo',
  imports: [PuiSelectComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" style="${STORY_LAYOUT}">
      <pui-select
        formControlName="framework"
        [options]="options"
        clearable
        placeholder="Reactive form select"
      />
      <p style="color: var(--pui-muted); font-size: var(--pui-font-size-sm);">
        Value: {{ form.controls.framework.value | json }}
      </p>
      <p style="color: var(--pui-muted); font-size: var(--pui-font-size-sm);">
        Valid: {{ form.controls.framework.valid }}
      </p>
    </form>
  `,
})
class ReactiveFormDemoComponent {
  private readonly fb = new FormBuilder();
  protected readonly options = FRAMEWORK_OPTIONS;
  protected readonly form = this.fb.group({
    framework: this.fb.control<string | null>('angular', Validators.required),
  });
}

export const ReactiveFormExample: Story = {
  render: () => ({
    moduleMetadata: { imports: [ReactiveFormDemoComponent] },
    template: `<pui-select-reactive-form-demo />`,
  }),
};

@Component({
  selector: 'pui-select-ngmodel-demo',
  imports: [PuiSelectComponent, FormsModule],
  template: `
    <pui-select
      [(ngModel)]="framework"
      [options]="options"
      clearable
      placeholder="ngModel select"
    />
    <p style="margin-top: var(--pui-space-sm); color: var(--pui-muted); font-size: var(--pui-font-size-sm);">
      ngModel value: {{ framework | json }}
    </p>
  `,
})
class NgModelDemoComponent {
  protected readonly options = FRAMEWORK_OPTIONS;
  protected framework: PuiSelectValue = 'react';
}

export const NgModelExample: Story = {
  render: () => ({
    moduleMetadata: { imports: [NgModelDemoComponent] },
    template: `<pui-select-ngmodel-demo />`,
  }),
};

@Component({
  selector: 'pui-select-async-demo',
  imports: [PuiSelectComponent],
  template: `
    <pui-select
      [(value)]="selected"
      [options]="options()"
      [loading]="loading()"
      searchable
      asyncSearch
      clearable
      placeholder="Search countries (async)"
      (input)="onSearch($event)"
    />
    <p style="margin-top: var(--pui-space-sm); color: var(--pui-muted); font-size: var(--pui-font-size-sm);">
      Selected: {{ selected | json }}
    </p>
  `,
})
class AsyncSelectDemoComponent {
  private readonly allOptions = COUNTRY_OPTIONS;
  protected readonly options = signal<readonly PuiSelectOption[]>(this.allOptions);
  protected readonly loading = signal(false);
  protected selected: PuiSelectValue = 'us';

  protected onSearch(query: string): void {
    this.loading.set(true);

    window.setTimeout(() => {
      const normalized = query.trim().toLowerCase();
      const next = normalized
        ? this.allOptions.filter((option) => option.label.toLowerCase().includes(normalized))
        : this.allOptions;
      this.options.set(next);
      this.loading.set(false);
    }, 400);
  }
}

export const AsyncSearch: Story = {
  render: () => ({
    moduleMetadata: { imports: [AsyncSelectDemoComponent] },
    template: `<pui-select-async-demo />`,
  }),
};

export const LargeDataset: Story = {
  args: {
    virtualScroll: true,
    searchable: true,
    clearable: true,
    options: createLargeDataset(5000),
    placeholder: '5,000 searchable options',
    maxPanelHeight: 320,
  },
};

export const MainThreadSearch: Story = {
  args: {
    searchable: true,
    virtualScroll: true,
    clearable: true,
    useWorker: false,
    options: createLargeDataset(10000),
    placeholder: 'Main-thread search (10k options)',
  },
};

export const WorkerMode: Story = {
  args: {
    searchable: true,
    virtualScroll: true,
    clearable: true,
    useWorker: true,
    options: createLargeDataset(50000),
    placeholder: 'Worker search over 50k options',
    maxPanelHeight: 320,
  },
};

export const WorkerFuzzySearch: Story = {
  args: {
    searchable: true,
    virtualScroll: true,
    clearable: true,
    useWorker: true,
    fuzzySearch: true,
    options: createLargeDataset(10000),
    placeholder: 'Fuzzy worker search (10k options)',
  },
};

export const DisabledOptions: Story = {
  args: {
    clearable: true,
    options: FRAMEWORK_OPTIONS,
    placeholder: 'Some options disabled',
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="${STORY_LAYOUT}">
        <pui-select size="sm" [(value)]="selected" [options]="options" placeholder="Small"></pui-select>
        <pui-select size="md" [(value)]="selected" [options]="options" placeholder="Medium"></pui-select>
        <pui-select size="lg" [(value)]="selected" [options]="options" placeholder="Large"></pui-select>
      </div>
    `,
    props: { options: BASIC_OPTIONS, selected: 'angular' },
  }),
};

export const Playground: Story = {
  args: {
    searchable: true,
    clearable: true,
    options: FRAMEWORK_OPTIONS,
    placeholder: 'Playground select',
  },
};
