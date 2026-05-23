import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {
  PuiRadioComponent,
  PuiRadioDescriptionComponent,
  PuiRadioGroupComponent,
  PuiRadioLabelComponent,
} from './index';
import type { PuiRadioValue } from './radio.types';

const RADIO_IMPORTS = [
  PuiRadioComponent,
  PuiRadioGroupComponent,
  PuiRadioLabelComponent,
  PuiRadioDescriptionComponent,
  ReactiveFormsModule,
  JsonPipe,
];

const meta: Meta<PuiRadioComponent> = {
  title: 'Components/Radio',
  component: PuiRadioComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined', 'soft', 'minimal', 'card'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    size: 'md',
    disabled: false,
    invalid: false,
    required: false,
  },
};

export default meta;

type Story = StoryObj<PuiRadioComponent>;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    props: { selected: signal<PuiRadioValue>('system') },
    template: `
      <pui-radio-group [(value)]="selected" name="theme-default" ariaLabel="Theme">
        <pui-radio value="light">Light</pui-radio>
        <pui-radio value="dark">Dark</pui-radio>
        <pui-radio value="system">System</pui-radio>
      </pui-radio-group>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    template: `
      <div class="pui-radio-showcase-stack">
        @for (variant of ['default', 'filled', 'outlined', 'soft', 'minimal']; track variant) {
          <pui-radio-group [value]="'a'" ariaLabel="Variant preview">
            <pui-radio [variant]="$any(variant)" value="a">{{ variant }} — selected</pui-radio>
            <pui-radio [variant]="$any(variant)" value="b">{{ variant }} — unselected</pui-radio>
          </pui-radio-group>
        }
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    props: { sizes: ['sm', 'md', 'lg'] as const },
    template: `
      <div class="pui-radio-showcase-stack">
        @for (size of sizes; track size) {
          <pui-radio-group value="a" ariaLabel="Size preview">
            <pui-radio [size]="size" value="a">Size {{ size }}</pui-radio>
          </pui-radio-group>
        }
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    template: `
      <pui-radio-group value="pro" disabled ariaLabel="Disabled plan">
        <pui-radio value="starter">Starter</pui-radio>
        <pui-radio value="pro">Pro</pui-radio>
      </pui-radio-group>
    `,
  }),
};

export const Invalid: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    template: `
      <pui-radio-group invalid ariaLabel="Required plan">
        <pui-radio value="starter">Starter</pui-radio>
        <pui-radio value="pro" invalid helperText="Selection required">Pro</pui-radio>
      </pui-radio-group>
    `,
  }),
};

export const HorizontalGroup: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    props: { filter: signal('weekly') },
    template: `
      <pui-radio-group [(value)]="filter" orientation="horizontal" ariaLabel="Dashboard filter">
        <pui-radio value="daily">Daily</pui-radio>
        <pui-radio value="weekly">Weekly</pui-radio>
        <pui-radio value="monthly">Monthly</pui-radio>
      </pui-radio-group>
      <p class="pui-radio-showcase-meta">Selected: {{ filter() }}</p>
    `,
  }),
};

export const VerticalGroup: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    props: { notifications: signal('all') },
    template: `
      <pui-radio-group [(value)]="notifications" ariaLabel="Notifications">
        <pui-radio value="all">All notifications</pui-radio>
        <pui-radio value="mentions">Mentions only</pui-radio>
        <pui-radio value="none">None</pui-radio>
      </pui-radio-group>
    `,
  }),
};

export const CardRadios: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    props: { plan: signal('pro') },
    template: `
      <pui-radio-group [(value)]="plan" class="pui-radio-card-grid">
        <pui-radio variant="card" value="starter">
          <pui-radio-label>Starter</pui-radio-label>
          <pui-radio-description>For individuals</pui-radio-description>
        </pui-radio>
        <pui-radio variant="card" value="pro">
          <pui-radio-label>Pro</pui-radio-label>
          <pui-radio-description>For growing teams</pui-radio-description>
        </pui-radio>
        <pui-radio variant="card" value="enterprise">
          <pui-radio-label>Enterprise</pui-radio-label>
          <pui-radio-description>Dedicated support</pui-radio-description>
        </pui-radio>
      </pui-radio-group>
    `,
  }),
};

export const PaymentSelection: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    props: { payment: signal('card') },
    template: `
      <pui-radio-group [(value)]="payment" class="pui-radio-payment-grid" ariaLabel="Payment method">
        <pui-radio variant="card" value="card">
          <pui-radio-label>Visa •••• 4242</pui-radio-label>
          <pui-radio-description>Credit card</pui-radio-description>
        </pui-radio>
        <pui-radio variant="card" value="paypal">
          <pui-radio-label>PayPal</pui-radio-label>
          <pui-radio-description>Fast checkout</pui-radio-description>
        </pui-radio>
        <pui-radio variant="card" value="upi">
          <pui-radio-label>UPI</pui-radio-label>
          <pui-radio-description>Instant transfer</pui-radio-description>
        </pui-radio>
        <pui-radio variant="card" value="apple">
          <pui-radio-label>Apple Pay</pui-radio-label>
          <pui-radio-description>One-tap payment</pui-radio-description>
        </pui-radio>
      </pui-radio-group>
    `,
  }),
};

export const PricingSelection: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    props: { tier: signal('pro') },
    template: `
      <pui-radio-group [(value)]="tier" class="pui-radio-pricing-grid" ariaLabel="Pricing plan">
        <pui-radio variant="card" value="free">
          <pui-radio-label>Free</pui-radio-label>
          <pui-radio-description>$0 / month</pui-radio-description>
        </pui-radio>
        <pui-radio variant="card" value="pro">
          <pui-radio-label>Pro</pui-radio-label>
          <pui-radio-description>$29 / month</pui-radio-description>
        </pui-radio>
        <pui-radio variant="card" value="enterprise">
          <pui-radio-label>Enterprise</pui-radio-label>
          <pui-radio-description>Custom pricing</pui-radio-description>
        </pui-radio>
      </pui-radio-group>
    `,
  }),
};

@Component({
  selector: 'pui-radio-reactive-demo',
  imports: [PuiRadioGroupComponent, PuiRadioComponent, ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form">
      <pui-radio-group formControlName="plan" ariaLabel="Subscription plan">
        <pui-radio value="starter">Starter</pui-radio>
        <pui-radio value="pro">Pro</pui-radio>
        <pui-radio value="enterprise">Enterprise</pui-radio>
      </pui-radio-group>
    </form>
    <p class="pui-radio-showcase-meta">Value: {{ form.value | json }}</p>
    <p class="pui-radio-showcase-meta">Valid: {{ form.controls.plan.valid }}</p>
  `,
  styles: [
    `
      :host { display: block; }
      .pui-radio-showcase-meta {
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
    plan: ['pro' as PuiRadioValue, Validators.required],
  });
}

export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: { imports: [ReactiveFormsDemoComponent] },
    template: `<pui-radio-reactive-demo />`,
  }),
};

@Component({
  selector: 'pui-radio-signal-demo',
  imports: [PuiRadioGroupComponent, PuiRadioComponent],
  template: `
    <pui-radio-group
      [value]="selected()"
      (valueChange)="selected.set($event)"
      ariaLabel="Theme preference"
    >
      <pui-radio value="light">Light</pui-radio>
      <pui-radio value="dark">Dark</pui-radio>
    </pui-radio-group>
    <p class="pui-radio-showcase-meta">Signal value: {{ selected() }}</p>
  `,
  styles: [
    `
      .pui-radio-showcase-meta {
        margin-top: var(--pui-space-sm);
        color: var(--pui-muted);
        font-size: var(--pui-font-size-sm);
      }
    `,
  ],
})
class SignalFormsDemoComponent {
  protected readonly selected = signal<PuiRadioValue>('light');
}

export const SignalForms: Story = {
  render: () => ({
    moduleMetadata: { imports: [SignalFormsDemoComponent] },
    template: `<pui-radio-signal-demo />`,
  }),
};

export const KeyboardNavigation: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    props: { value: signal<PuiRadioValue>('b') },
    template: `
      <p aria-live="polite" class="pui-radio-showcase-meta">
        Focus a radio and use Arrow keys, Home, End, or Space.
      </p>
      <pui-radio-group [(value)]="value" ariaLabel="Keyboard demo">
        <pui-radio value="a">Option A</pui-radio>
        <pui-radio value="b">Option B</pui-radio>
        <pui-radio value="c">Option C</pui-radio>
        <pui-radio value="d" disabled>Option D (disabled)</pui-radio>
      </pui-radio-group>
      <p class="pui-radio-showcase-meta">Selected: {{ value() }}</p>
    `,
  }),
};

export const DarkTheme: Story = {
  render: () => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    template: `
      <div class="pui-radio-dark-panel" data-theme="dark">
        <pui-radio-group value="pro" ariaLabel="Dark theme radios">
          <pui-radio value="starter">Starter</pui-radio>
          <pui-radio value="pro">Pro</pui-radio>
        </pui-radio-group>
      </div>
    `,
  }),
};

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    disabled: false,
    invalid: false,
  },
  render: (args) => ({
    moduleMetadata: { imports: RADIO_IMPORTS },
    styles: ['./radio.stories.scss'],
    props: { ...args, selected: signal<PuiRadioValue>('a') },
    template: `
      <pui-radio-group [(value)]="selected" ariaLabel="Playground">
        <pui-radio
          [variant]="variant"
          [size]="size"
          [disabled]="disabled"
          [invalid]="invalid"
          value="a"
        >
          Option A
        </pui-radio>
        <pui-radio
          [variant]="variant"
          [size]="size"
          [disabled]="disabled"
          value="b"
        >
          Option B
        </pui-radio>
      </pui-radio-group>
    `,
  }),
};
