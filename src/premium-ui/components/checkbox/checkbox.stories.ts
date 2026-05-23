import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {
  PuiCheckboxComponent,
  PuiCheckboxDescriptionComponent,
  PuiCheckboxGroupComponent,
  PuiCheckboxLabelComponent,
} from './index';

const CHECKBOX_IMPORTS = [
  PuiCheckboxComponent,
  PuiCheckboxGroupComponent,
  PuiCheckboxLabelComponent,
  PuiCheckboxDescriptionComponent,
  ReactiveFormsModule,
  JsonPipe,
];

const meta: Meta<PuiCheckboxComponent> = {
  title: 'Components/Checkbox',
  component: PuiCheckboxComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'soft', 'minimal', 'card'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    size: 'md',
    checked: false,
    indeterminate: false,
    disabled: false,
    readOnly: false,
    invalid: false,
    loading: false,
  },
};

export default meta;

type Story = StoryObj<PuiCheckboxComponent>;

export const Basic: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    template: `
      <div class="checkbox-showcase-stack">
        <pui-checkbox>Accept terms and conditions</pui-checkbox>
        <pui-checkbox [checked]="true">Email me product updates</pui-checkbox>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    template: `
      <div class="checkbox-showcase-stack">
        <pui-checkbox [checked]="true">Default selection</pui-checkbox>
        <pui-checkbox>Unchecked</pui-checkbox>
        <pui-checkbox [indeterminate]="true">Indeterminate</pui-checkbox>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    props: { sizes: ['sm', 'md', 'lg'] as const },
    template: `
      <div class="checkbox-showcase-stack">
        @for (size of sizes; track size) {
          <pui-checkbox [size]="size" [checked]="true">Size {{ size }}</pui-checkbox>
        }
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    template: `
      <div class="checkbox-showcase-stack">
        <pui-checkbox>Unchecked</pui-checkbox>
        <pui-checkbox [checked]="true">Checked</pui-checkbox>
        <pui-checkbox [indeterminate]="true">Indeterminate</pui-checkbox>
        <pui-checkbox [invalid]="true" error="Required field">Invalid</pui-checkbox>
        <pui-checkbox [loading]="true">Loading</pui-checkbox>
      </div>
    `,
  }),
};

@Component({
  selector: 'pui-checkbox-indeterminate-demo',
  imports: [PuiCheckboxComponent, PuiCheckboxGroupComponent, JsonPipe],
  template: `
    <div class="checkbox-showcase-stack">
      <pui-checkbox
        [checked]="selected().length === frameworks.length"
        [indeterminate]="selected().length > 0 && selected().length < frameworks.length"
        (checkedChange)="toggleAll($event)"
      >
        Select all frameworks
      </pui-checkbox>
      <pui-checkbox-group [(value)]="selected">
        @for (item of frameworks; track item) {
          <pui-checkbox [value]="item">{{ item }}</pui-checkbox>
        }
      </pui-checkbox-group>
      <p class="checkbox-showcase-meta">Selected: {{ selected() | json }}</p>
    </div>
  `,
  styles: [
    `
      .checkbox-showcase-stack {
        display: flex;
        flex-direction: column;
        gap: var(--pui-space-md);
        max-width: 24rem;
      }
      .checkbox-showcase-meta {
        margin-top: var(--pui-space-sm);
        color: var(--pui-muted);
        font-size: var(--pui-font-size-sm);
      }
    `,
  ],
})
class IndeterminateDemoComponent {
  protected readonly frameworks = ['angular', 'react', 'vue'];
  protected readonly selected = signal<string[]>(['angular']);

  protected toggleAll(checked: boolean): void {
    this.selected.set(checked ? [...this.frameworks] : []);
  }
}

export const Indeterminate: Story = {
  render: () => ({
    moduleMetadata: { imports: [IndeterminateDemoComponent] },
    template: `<pui-checkbox-indeterminate-demo />`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    template: `
      <div class="checkbox-showcase-stack">
        <pui-checkbox [disabled]="true">Disabled unchecked</pui-checkbox>
        <pui-checkbox [disabled]="true" [checked]="true">Disabled checked</pui-checkbox>
        <pui-checkbox [readOnly]="true" [checked]="true">Read only</pui-checkbox>
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    template: `
      <pui-checkbox
        [invalid]="true"
        error="You must accept the terms to continue"
      >
        Accept terms and conditions
      </pui-checkbox>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    template: `<pui-checkbox [loading]="true">Syncing preferences…</pui-checkbox>`,
  }),
};

export const CheckboxGroups: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    props: { selected: signal<string[]>(['angular', 'react']) },
    template: `
      <pui-checkbox-group [(value)]="selected" ariaLabel="Framework preferences">
        <pui-checkbox value="angular">Angular</pui-checkbox>
        <pui-checkbox value="react">React</pui-checkbox>
        <pui-checkbox value="vue">Vue</pui-checkbox>
        <pui-checkbox value="svelte">Svelte</pui-checkbox>
      </pui-checkbox-group>
      <p class="checkbox-showcase-meta">Selected: {{ selected() | json }}</p>
    `,
  }),
};

export const CardCheckboxes: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    props: { plan: signal<string[]>(['pro']) },
    template: `
      <pui-checkbox-group [(value)]="plan" class="checkbox-showcase-cards">
        <pui-checkbox variant="card" value="starter">
          <pui-checkbox-label>Starter</pui-checkbox-label>
          <pui-checkbox-description>For individuals getting started</pui-checkbox-description>
        </pui-checkbox>
        <pui-checkbox variant="card" value="pro">
          <pui-checkbox-label>Pro</pui-checkbox-label>
          <pui-checkbox-description>Advanced features for growing teams</pui-checkbox-description>
        </pui-checkbox>
        <pui-checkbox variant="card" value="enterprise">
          <pui-checkbox-label>Enterprise</pui-checkbox-label>
          <pui-checkbox-description>Dedicated infrastructure and support</pui-checkbox-description>
        </pui-checkbox>
      </pui-checkbox-group>
      <p class="checkbox-showcase-meta">Selected plan: {{ plan() | json }}</p>
    `,
  }),
};

@Component({
  selector: 'pui-checkbox-reactive-demo',
  imports: [PuiCheckboxComponent, ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form">
      <pui-checkbox formControlName="terms">
        Accept terms and conditions
      </pui-checkbox>
      <pui-checkbox formControlName="marketing">
        Send me marketing emails
      </pui-checkbox>
    </form>
    <p class="checkbox-showcase-meta">Form value: {{ form.value | json }}</p>
    <p class="checkbox-showcase-meta">Terms valid: {{ form.controls.terms.valid }}</p>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: var(--pui-space-md);
        max-width: 24rem;
      }
      .checkbox-showcase-meta {
        margin-top: var(--pui-space-sm);
        color: var(--pui-muted);
        font-size: var(--pui-font-size-sm);
      }
    `,
  ],
})
class ReactiveFormsDemoComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    terms: [false, Validators.requiredTrue],
    marketing: [true],
  });
}

export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: { imports: [ReactiveFormsDemoComponent] },
    template: `<pui-checkbox-reactive-demo />`,
  }),
};

@Component({
  selector: 'pui-checkbox-signal-demo',
  imports: [PuiCheckboxComponent],
  template: `
    <pui-checkbox
      [checked]="selected()"
      (checkedChange)="onChecked($event)"
    >
      Accept terms
    </pui-checkbox>
    <p class="checkbox-showcase-meta">Signal value: {{ selected() }}</p>
  `,
  styles: [
    `
      .checkbox-showcase-meta {
        margin-top: var(--pui-space-sm);
        color: var(--pui-muted);
        font-size: var(--pui-font-size-sm);
      }
    `,
  ],
})
class SignalFormsDemoComponent {
  protected readonly selected = signal(false);

  protected onChecked(value: boolean): void {
    this.selected.set(value);
  }
}

export const SignalForms: Story = {
  render: () => ({
    moduleMetadata: { imports: [SignalFormsDemoComponent] },
    template: `<pui-checkbox-signal-demo />`,
  }),
};

@Component({
  selector: 'pui-checkbox-event-demo',
  imports: [PuiCheckboxComponent],
  template: `
    <pui-checkbox [checked]="selected()" (checkedChange)="onChecked($event)">
      Accept terms
    </pui-checkbox>
    <p class="checkbox-showcase-meta">checkedChange: {{ lastEvent() }}</p>
  `,
  styles: [
    `
      .checkbox-showcase-meta {
        margin-top: var(--pui-space-sm);
        color: var(--pui-muted);
        font-size: var(--pui-font-size-sm);
      }
    `,
  ],
})
class EventEmissionDemoComponent {
  protected readonly selected = signal(false);
  protected readonly lastEvent = signal('—');

  protected onChecked(value: boolean): void {
    this.selected.set(value);
    this.lastEvent.set(String(value));
  }
}

export const EventEmission: Story = {
  render: () => ({
    moduleMetadata: { imports: [EventEmissionDemoComponent] },
    template: `<pui-checkbox-event-demo />`,
  }),
};

export const DarkTheme: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    template: `
      <div class="checkbox-showcase-stack">
        <pui-checkbox [checked]="true">Checked</pui-checkbox>
        <pui-checkbox>Unchecked</pui-checkbox>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    template: `
      <div class="checkbox-showcase-stack">
        <pui-checkbox ariaLabel="Enable notifications">
          <pui-checkbox-label>Notifications</pui-checkbox-label>
          <pui-checkbox-description>Receive alerts about account activity</pui-checkbox-description>
        </pui-checkbox>
        <pui-checkbox
          helper="We'll never share your email with third parties."
        >
          Subscribe to newsletter
        </pui-checkbox>
      </div>
    `,
  }),
};

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    checked: false,
    disabled: false,
    indeterminate: false,
    invalid: false,
    loading: false,
  },
  render: (args) => ({
    moduleMetadata: { imports: CHECKBOX_IMPORTS },
    styles: ['./checkbox.stories.scss'],
    props: args,
    template: `
      <pui-checkbox
        [variant]="variant"
        [size]="size"
        [checked]="checked"
        [disabled]="disabled"
        [indeterminate]="indeterminate"
        [invalid]="invalid"
        [loading]="loading"
      >
        Playground checkbox
      </pui-checkbox>
    `,
  }),
};
