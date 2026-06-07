import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { PuiSwitchComponent } from './switch.component';

const SWITCH_IMPORTS = [PuiSwitchComponent, ReactiveFormsModule, JsonPipe];

const meta: Meta<PuiSwitchComponent> = {
  title: 'Components/Switch',
  component: PuiSwitchComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined', 'soft', 'minimal', 'ios', 'success', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    size: 'md',
    checked: false,
    disabled: false,
    loading: false,
    invalid: false,
  },
};

export default meta;

type Story = StoryObj<PuiSwitchComponent>;

export const Default: Story = {
  args: { checked: true },
};

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: SWITCH_IMPORTS },
    styles: ['./switch.stories.scss'],
    template: `
      <div class="pui-switch-showcase-stack">
        @for (variant of ['default', 'filled', 'outlined', 'soft', 'minimal', 'ios', 'success', 'danger']; track variant) {
          <pui-switch [variant]="$any(variant)" [checked]="true" [label]="variant" />
        }
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: SWITCH_IMPORTS },
    styles: ['./switch.stories.scss'],
    props: { sizes: ['sm', 'md', 'lg'] as const },
    template: `
      <div class="pui-switch-showcase-stack">
        @for (size of sizes; track size) {
          <pui-switch [size]="size" [checked]="true" [label]="'Size ' + size" />
        }
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: { checked: true, disabled: true, label: 'Disabled switch' },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    error: 'This setting is required',
    label: 'Enable security alerts',
  },
};

export const Loading: Story = {
  args: { loading: true, checked: true, label: 'Syncing preferences…' },
};

export const WithLabels: Story = {
  args: {
    checked: true,
    label: 'Enable notifications',
    helperText: 'You can change this anytime in settings.',
  },
};

export const WithDescriptions: Story = {
  args: {
    checked: false,
    label: 'Dark mode',
    description: 'Use dark theme across the application.',
  },
};

export const IosVariant: Story = {
  args: {
    variant: 'ios',
    checked: true,
    label: 'Airplane mode',
    description: 'iOS-inspired premium motion and glow.',
  },
};

export const SettingsPanel: Story = {
  render: () => ({
    moduleMetadata: { imports: SWITCH_IMPORTS },
    styles: ['./switch.stories.scss'],
    props: {
      notifications: signal(true),
      darkMode: signal(false),
      analytics: signal(true),
    },
    template: `
      <div class="pui-switch-settings-panel">
        <pui-switch [(checked)]="notifications" label="Push notifications" description="Receive alerts on this device" />
        <pui-switch [(checked)]="darkMode" variant="ios" label="Dark mode" description="Switch to dark theme" />
        <pui-switch [(checked)]="analytics" variant="soft" label="Analytics" description="Help improve the product" />
      </div>
    `,
  }),
};

export const PreferencesForm: Story = {
  render: () => ({
    moduleMetadata: { imports: SWITCH_IMPORTS },
    styles: ['./switch.stories.scss'],
    props: {
      email: signal(true),
      sms: signal(false),
      marketing: signal(false),
    },
    template: `
      <div class="pui-switch-showcase-stack">
        <pui-switch [(checked)]="email" label="Email updates" />
        <pui-switch [(checked)]="sms" label="SMS alerts" />
        <pui-switch [(checked)]="marketing" label="Marketing emails" />
      </div>
    `,
  }),
};

@Component({
  selector: 'pui-switch-reactive-demo',
  imports: [PuiSwitchComponent, ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" class="pui-switch-showcase-stack">
      <pui-switch formControlName="notifications" label="Notifications" />
      <pui-switch formControlName="autoUpdates" label="Auto updates" />
    </form>
    <p class="pui-switch-showcase-meta">Form value: {{ form.value | json }}</p>
  `,
  styles: [
    `
      .pui-switch-showcase-stack { display: flex; flex-direction: column; gap: var(--pui-space-md); }
      .pui-switch-showcase-meta { margin-top: var(--pui-space-sm); color: var(--pui-muted); font-size: var(--pui-font-size-sm); }
    `,
  ],
})
class ReactiveFormsDemoComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly form = this.fb.nonNullable.group({
    notifications: [true],
    autoUpdates: [false],
  });
}

export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: { imports: [ReactiveFormsDemoComponent] },
    template: `<pui-switch-reactive-demo />`,
  }),
};

@Component({
  selector: 'pui-switch-signal-demo',
  imports: [PuiSwitchComponent],
  template: `
    <pui-switch
      [checked]="enabled()"
      (change)="enabled.set($event)"
      label="Enable feature"
    />
    <p class="pui-switch-showcase-meta">Signal value: {{ enabled() }}</p>
  `,
  styles: [
    `
      .pui-switch-showcase-meta { margin-top: var(--pui-space-sm); color: var(--pui-muted); font-size: var(--pui-font-size-sm); }
    `,
  ],
})
class SignalFormsDemoComponent {
  protected readonly enabled = signal(true);
}

export const SignalForms: Story = {
  render: () => ({
    moduleMetadata: { imports: [SignalFormsDemoComponent] },
    template: `<pui-switch-signal-demo />`,
  }),
};

export const DarkTheme: Story = {
  render: () => ({
    moduleMetadata: { imports: SWITCH_IMPORTS },
    styles: ['./switch.stories.scss'],
    template: `
      <div class="pui-switch-dark-panel" data-theme="dark">
        <div class="pui-switch-showcase-stack">
          <pui-switch [checked]="true" label="Notifications" />
          <pui-switch variant="ios" [checked]="true" label="Dark mode" />
        </div>
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
    loading: false,
    invalid: false,
    label: 'Playground switch',
  },
};
