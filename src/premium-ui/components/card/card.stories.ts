import type { Meta, StoryObj } from '@storybook/angular';
import { PuiCardComponent } from './card.component';

const meta: Meta<PuiCardComponent> = {
  title: 'Components/Card',
  component: PuiCardComponent,
  tags: ['autodocs'],

  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'ghost'],
    },

    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },

    hoverable: {
      control: 'boolean',
    },

    interactive: {
      control: 'boolean',
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    variant: 'default',
    size: 'md',
    hoverable: false,
    interactive: false,
    disabled: false,
  },

  render: (args) => ({
    props: args,

    template: `
      <pui-card
        [variant]="variant"
        [size]="size"
        [hoverable]="hoverable"
        [interactive]="interactive"
        [disabled]="disabled"
        style="max-width: 400px;">
        <h3 style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-text);">Card Title</h3>
        <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
          This is a card component that provides a flexible container for content.
        </p>
      </pui-card>
    `,
  }),
};

export default meta;

type Story = StoryObj<PuiCardComponent>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--pui-space-lg);
        "
      >
        <pui-card variant="default">
          <h3 style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-text);">Default</h3>
          <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
            Subtle border with soft background and minimal shadow
          </p>
        </pui-card>

        <pui-card variant="outlined">
          <h3 style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-text);">Outlined</h3>
          <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
            Stronger border, no shadow, clean flat appearance
          </p>
        </pui-card>

        <pui-card variant="elevated">
          <h3 style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-text);">Elevated</h3>
          <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
            Premium soft shadow with subtle lift effect
          </p>
        </pui-card>

        <pui-card variant="ghost">
          <h3 style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-text);">Ghost</h3>
          <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
            Transparent background with subtle hover state
          </p>
        </pui-card>
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
          flex-direction: column;
          gap: var(--pui-space-lg);
        "
      >
        <div>
          <p style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-muted); font-weight: 600;">Small</p>
          <pui-card size="sm">
            <h4 style="margin: 0 0 var(--pui-space-xs) 0; color: var(--pui-text);">Compact Card</h4>
            <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
              Reduced padding for dense layouts
            </p>
          </pui-card>
        </div>

        <div>
          <p style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-muted); font-weight: 600;">Medium</p>
          <pui-card size="md">
            <h3 style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-text);">Standard Card</h3>
            <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
              Default padding for most use cases
            </p>
          </pui-card>
        </div>

        <div>
          <p style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-muted); font-weight: 600;">Large</p>
          <pui-card size="lg">
            <h2 style="margin: 0 0 var(--pui-space-md) 0; color: var(--pui-text);">Spacious Card</h2>
            <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
              Increased padding for prominent content
            </p>
          </pui-card>
        </div>
      </div>
    `,
  }),
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
  },

  render: () => ({
    template: `
      <pui-card variant="default" size="md" hoverable="true" style="max-width: 400px;">
        <h3 style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-text);">Hoverable Card</h3>
        <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
          Hover over this card to see the elevation effect
        </p>
      </pui-card>
    `,
  }),
};

export const Interactive: Story = {
  args: {
    interactive: true,
  },

  render: () => ({
    template: `
      <pui-card variant="default" size="md" interactive="true" style="max-width: 400px; cursor: pointer;">
        <h3 style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-text);">Interactive Card</h3>
        <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
          Click or focus on this card. It supports keyboard navigation
        </p>
      </pui-card>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    interactive: true,
  },

  render: () => ({
    template: `
      <pui-card variant="default" size="md" disabled="true" interactive="true" style="max-width: 400px;">
        <h3 style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-text);">Disabled Card</h3>
        <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">
          This card is disabled and cannot be interacted with
        </p>
      </pui-card>
    `,
  }),
};

export const DashboardExample: Story = {
  render: () => ({
    template: `
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--pui-space-lg);
        "
      >
        <pui-card variant="default" hoverable="true">
          <p style="margin: 0 0 var(--pui-space-xs) 0; color: var(--pui-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">Revenue</p>
          <h2 style="margin: 0; color: var(--pui-text); font-size: 1.875rem; font-weight: 700;">$12,450</h2>
          <p style="margin: var(--pui-space-sm) 0 0 0; color: var(--pui-color-success); font-size: 0.875rem;">↑ 12% from last month</p>
        </pui-card>

        <pui-card variant="default" hoverable="true">
          <p style="margin: 0 0 var(--pui-space-xs) 0; color: var(--pui-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">Users</p>
          <h2 style="margin: 0; color: var(--pui-text); font-size: 1.875rem; font-weight: 700;">2,340</h2>
          <p style="margin: var(--pui-space-sm) 0 0 0; color: var(--pui-color-success); font-size: 0.875rem;">↑ 5% from last week</p>
        </pui-card>

        <pui-card variant="default" hoverable="true">
          <p style="margin: 0 0 var(--pui-space-xs) 0; color: var(--pui-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">Conversion</p>
          <h2 style="margin: 0; color: var(--pui-text); font-size: 1.875rem; font-weight: 700;">3.24%</h2>
          <p style="margin: var(--pui-space-sm) 0 0 0; color: var(--pui-color-warning); font-size: 0.875rem;">↓ 2% from last month</p>
        </pui-card>
      </div>
    `,
  }),
};

export const SettingsExample: Story = {
  render: () => ({
    template: `
      <pui-card variant="outlined" size="md" style="max-width: 500px;">
        <h3 style="margin: 0 0 var(--pui-space-md) 0; color: var(--pui-text);">Notification Settings</h3>
        <div style="display: flex; flex-direction: column; gap: var(--pui-space-md);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <p style="margin: 0 0 var(--pui-space-xs) 0; color: var(--pui-text); font-weight: 500;">Email Notifications</p>
              <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">Receive updates via email</p>
            </div>
            <input type="checkbox" checked />
          </div>
          <div style="height: 1px; background: var(--pui-border);"></div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <p style="margin: 0 0 var(--pui-space-xs) 0; color: var(--pui-text); font-weight: 500;">Push Notifications</p>
              <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem;">Get browser notifications</p>
            </div>
            <input type="checkbox" />
          </div>
        </div>
      </pui-card>
    `,
  }),
};

export const FeatureCardExample: Story = {
  render: () => ({
    template: `
      <pui-card variant="elevated" size="md" style="max-width: 400px; text-align: center;">
        <div style="
          width: 56px;
          height: 56px;
          border-radius: var(--pui-radius-lg);
          background: color-mix(in srgb, var(--pui-color-primary) 15%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--pui-space-md) auto;
          font-size: 1.75rem;">
          ✨
        </div>
        <h3 style="margin: 0 0 var(--pui-space-sm) 0; color: var(--pui-text);">Premium Features</h3>
        <p style="margin: 0; color: var(--pui-muted); font-size: 0.875rem; line-height: 1.6;">
          Unlock powerful capabilities with our premium tier. Get priority support and advanced features.
        </p>
        <button
          style="
            margin-top: var(--pui-space-md);
            padding: var(--pui-space-sm) var(--pui-space-md);
            background: var(--pui-color-primary);
            color: white;
            border: none;
            border-radius: var(--pui-radius-md);
            cursor: pointer;
            font-weight: 500;
            transition: background-color var(--pui-duration-normal) var(--pui-easing-standard);">
          Learn More
        </button>
      </pui-card>
    `,
  }),
};

export const ContentProjectionExample: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--pui-space-lg);">
        <pui-card variant="default">
          <img
            src="https://images.unsplash.com/photo-1633356713697-4be7b67941d6?w=400&h=200&fit=crop"
            alt="Product"
            style="
              width: 100%;
              height: 200px;
              object-fit: cover;
              border-radius: var(--pui-radius-sm);
              margin: calc(var(--pui-card-padding) * -1) calc(var(--pui-card-padding) * -1) var(--pui-space-md) calc(var(--pui-card-padding) * -1);
            " />
          <h3 style="margin: 0 0 var(--pui-space-xs) 0; color: var(--pui-text);">Premium Product</h3>
          <p style="margin: 0 0 var(--pui-space-md) 0; color: var(--pui-muted); font-size: 0.875rem;">
            High-quality product with excellent features
          </p>
          <div style="display: flex; gap: var(--pui-space-sm);">
            <button
              style="
                flex: 1;
                padding: var(--pui-space-sm) var(--pui-space-md);
                background: var(--pui-color-primary);
                color: white;
                border: none;
                border-radius: var(--pui-radius-md);
                cursor: pointer;
                font-weight: 500;
                font-size: 0.875rem;">
              Add to Cart
            </button>
            <button
              style="
                flex: 1;
                padding: var(--pui-space-sm) var(--pui-space-md);
                background: transparent;
                color: var(--pui-color-primary);
                border: 1px solid var(--pui-color-border);
                border-radius: var(--pui-radius-md);
                cursor: pointer;
                font-weight: 500;
                font-size: 0.875rem;">
              View Details
            </button>
          </div>
        </pui-card>
      </div>
    `,
  }),
};
