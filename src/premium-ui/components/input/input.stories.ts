import type { Meta, StoryObj } from '@storybook/angular';
import { PuiInputComponent } from './input.component';

const meta: Meta<PuiInputComponent> = {
  title: 'Components/Input',
  component: PuiInputComponent,
  tags: ['autodocs'],

  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
    },

    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },

    disabled: {
      control: 'boolean',
    },

    readOnly: {
      control: 'boolean',
    },

    placeholder: {
      control: 'text',
    },

    value: {
      control: 'text',
    },

    ariaLabel: {
      control: 'text',
    },
  },

  args: {
    type: 'text',
    size: 'md',
    disabled: false,
    readOnly: false,
    placeholder: 'Enter text',
    value: '',
    ariaLabel: null,
  },

  render: (args) => ({
    props: args,

    template: `
      <pui-input
        [type]="type"
        [size]="size"
        [disabled]="disabled"
        [readOnly]="readOnly"
        [placeholder]="placeholder"
        [value]="value"
        [ariaLabel]="ariaLabel">
      </pui-input>
    `,
  }),
};

export default meta;

type Story = StoryObj<PuiInputComponent>;

export const Primary: Story = {
  args: {
    size: 'sm',
  },
};

export const States: Story = {
  args: {
    disabled: true,
  },

  render: () => ({
    template: `
      <div
        style="
          display: flex;
          flex-direction: column;
          gap: var(--pui-space-sm);
          width: min(28rem, 100%);
        "
      >
        <pui-input placeholder="Default"></pui-input>

        <pui-input
          placeholder="Disabled"
          [disabled]="true">
        </pui-input>

        <pui-input
          placeholder="Read only"
          [readOnly]="true"
          value="Read only">
        </pui-input>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div
        style="
          display: flex;
          flex-wrap: wrap;
          gap: var(--pui-space-sm);
          align-items: center;
        "
      >
        <pui-input
          size="sm"
          placeholder="Small">
        </pui-input>

        <pui-input
          size="md"
          placeholder="Medium">
        </pui-input>

        <pui-input
          size="lg"
          placeholder="Large">
        </pui-input>
      </div>
    `,
  }),
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};
