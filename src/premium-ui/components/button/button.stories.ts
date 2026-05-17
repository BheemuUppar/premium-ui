import type { Meta, StoryObj } from '@storybook/angular';
import { PuiButtonComponent } from './button.component';

const meta: Meta<PuiButtonComponent> = {
  title: 'Components/Button',
  component: PuiButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger']
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    },
    type: {
      control: 'inline-radio',
      options: ['button', 'submit', 'reset']
    },
    disabled: {
      control: 'boolean'
    },
    loading: {
      control: 'boolean'
    },
    ariaLabel: {
      control: 'text'
    }
  },
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    ariaLabel: null
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [PuiButtonComponent]
    },
    template: `<pui-button [variant]="variant" [size]="size" [type]="type" [disabled]="disabled" [loading]="loading" [ariaLabel]="ariaLabel">Button</pui-button>`
  })
};

export default meta;

type Story = StoryObj<PuiButtonComponent>;

export const Primary: Story = {};

export const Variants: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [PuiButtonComponent]
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: var(--pui-space-sm); align-items: center;">
        <pui-button variant="primary">Primary</pui-button>
        <pui-button variant="secondary">Secondary</pui-button>
        <pui-button variant="outline">Outline</pui-button>
        <pui-button variant="ghost">Ghost</pui-button>
        <pui-button variant="danger">Danger</pui-button>
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [PuiButtonComponent]
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: var(--pui-space-sm); align-items: center;">
        <pui-button size="sm">Small</pui-button>
        <pui-button size="md">Medium</pui-button>
        <pui-button size="lg">Large</pui-button>
      </div>
    `
  })
};

export const Loading: Story = {
  args: {
    loading: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const WithIcon: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [PuiButtonComponent]
    },
    template: `
      <pui-button>
        <span puiButtonIcon aria-hidden="true">+</span>
        Create item
      </pui-button>
    `
  })
};
