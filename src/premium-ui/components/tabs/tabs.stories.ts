import type { Meta, StoryObj } from '@storybook/angular';
import {
  PUI_TABS_ORIENTATIONS,
  PUI_TABS_SIZES,
  PUI_TABS_VARIANTS,
  PuiTabItemComponent,
  PuiTabPanelComponent,
  PuiTabsComponent,
} from './index';
import type { PuiTabsVariant } from './tabs.types';

const TABS_IMPORTS = [PuiTabsComponent, PuiTabItemComponent, PuiTabPanelComponent];

const VARIANT_DESCRIPTIONS: Record<PuiTabsVariant, string> = {
  underline:
    'Classic baseline tabs with a primary underline on the active item. Best for page-level navigation.',
  segmented:
    'Compact toggle-group style with a sliding elevated indicator. Best for view switchers and filters.',
  'segmented-soft':
    'Softer inset track with a tinted active indicator. Best for dashboards and settings panels.',
  pill: 'Fully rounded segmented control. Best for compact toolbars and mobile-friendly layouts.',
};

const meta: Meta<PuiTabsComponent> = {
  title: 'Components/Tabs',
  component: PuiTabsComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: [...PUI_TABS_VARIANTS] },
    orientation: { control: 'select', options: [...PUI_TABS_ORIENTATIONS] },
    size: { control: 'inline-radio', options: [...PUI_TABS_SIZES] },
    ariaLabel: { control: 'text' },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'underline',
    orientation: 'horizontal',
    size: 'md',
    ariaLabel: 'Tabs example',
    defaultValue: '',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<PuiTabsComponent>;

export const Overview: Story = {
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    template: `
      <div class="pui-tabs-showcase-panel">
        <pui-tabs
          [variant]="variant"
          [orientation]="orientation"
          [size]="size"
          [ariaLabel]="ariaLabel"
          [disabled]="disabled"
        >
          <pui-tab-item id="overview" label="Overview" panelId="panel-overview"></pui-tab-item>
          <pui-tab-item id="analytics" label="Analytics" panelId="panel-analytics"></pui-tab-item>
          <pui-tab-item id="settings" label="Settings" panelId="panel-settings"></pui-tab-item>

          <pui-tab-panel tabId="overview" id="panel-overview">
            <h3 style="margin-top:0">Overview</h3>
            <p>Organize related content into switchable panels with keyboard support.</p>
          </pui-tab-panel>
          <pui-tab-panel tabId="analytics" id="panel-analytics">
            <h3 style="margin-top:0">Analytics</h3>
            <p>Traffic, conversion, and engagement metrics.</p>
          </pui-tab-panel>
          <pui-tab-panel tabId="settings" id="panel-settings">
            <h3 style="margin-top:0">Settings</h3>
            <p>Configure preferences and integrations.</p>
          </pui-tab-panel>
        </pui-tabs>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    props: { variants: PUI_TABS_VARIANTS, descriptions: VARIANT_DESCRIPTIONS },
    template: `
      <div class="pui-tabs-showcase-stack">
        @for (variant of variants; track variant) {
          <section>
            <p class="pui-tabs-showcase-label">{{ variant }}</p>
            <p class="pui-tabs-showcase-description">{{ descriptions[variant] }}</p>
            <div class="pui-tabs-showcase-panel">
              <pui-tabs [variant]="variant" ariaLabel="{{ variant }} tabs">
                <pui-tab-item [id]="variant + '-a'" label="Overview" [panelId]="'panel-' + variant + '-a'"></pui-tab-item>
                <pui-tab-item [id]="variant + '-b'" label="Analytics" [panelId]="'panel-' + variant + '-b'"></pui-tab-item>
                <pui-tab-item [id]="variant + '-c'" label="Settings" [panelId]="'panel-' + variant + '-c'"></pui-tab-item>

                <pui-tab-panel [tabId]="variant + '-a'" [id]="'panel-' + variant + '-a'">
                  <p>{{ descriptions[variant] }}</p>
                </pui-tab-panel>
                <pui-tab-panel [tabId]="variant + '-b'" [id]="'panel-' + variant + '-b'">
                  <p>Second panel for {{ variant }}.</p>
                </pui-tab-panel>
                <pui-tab-panel [tabId]="variant + '-c'" [id]="'panel-' + variant + '-c'">
                  <p>Third panel for {{ variant }}.</p>
                </pui-tab-panel>
              </pui-tabs>
            </div>
          </section>
        }
      </div>
    `,
  }),
};

export const Underline: Story = {
  name: 'Variant / Underline',
  render: () => ({
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    template: `
      <p class="pui-tabs-showcase-description">${VARIANT_DESCRIPTIONS.underline}</p>
      <div class="pui-tabs-showcase-panel">
        <pui-tabs variant="underline" ariaLabel="Underline tabs">
          <pui-tab-item id="u-a" label="Overview" panelId="u-p-a"></pui-tab-item>
          <pui-tab-item id="u-b" label="Analytics" panelId="u-p-b"></pui-tab-item>
          <pui-tab-panel tabId="u-a" id="u-p-a"><p>Underline panel content.</p></pui-tab-panel>
          <pui-tab-panel tabId="u-b" id="u-p-b"><p>Second panel.</p></pui-tab-panel>
        </pui-tabs>
      </div>
    `,
  }),
};

export const Segmented: Story = {
  name: 'Variant / Segmented',
  render: () => ({
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    template: `
      <p class="pui-tabs-showcase-description">${VARIANT_DESCRIPTIONS.segmented}</p>
      <div class="pui-tabs-showcase-panel">
        <pui-tabs variant="segmented" ariaLabel="Segmented tabs">
          <pui-tab-item id="s-a" label="Grid" panelId="s-p-a"></pui-tab-item>
          <pui-tab-item id="s-b" label="List" panelId="s-p-b"></pui-tab-item>
          <pui-tab-panel tabId="s-a" id="s-p-a"><p>Grid view content.</p></pui-tab-panel>
          <pui-tab-panel tabId="s-b" id="s-p-b"><p>List view content.</p></pui-tab-panel>
        </pui-tabs>
      </div>
    `,
  }),
};

export const SegmentedSoft: Story = {
  name: 'Variant / Segmented Soft',
  render: () => ({
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    template: `
      <p class="pui-tabs-showcase-description">${VARIANT_DESCRIPTIONS['segmented-soft']}</p>
      <div class="pui-tabs-showcase-panel">
        <pui-tabs variant="segmented-soft" ariaLabel="Segmented soft tabs">
          <pui-tab-item id="ss-a" label="Day" panelId="ss-p-a"></pui-tab-item>
          <pui-tab-item id="ss-b" label="Week" panelId="ss-p-b"></pui-tab-item>
          <pui-tab-panel tabId="ss-a" id="ss-p-a"><p>Daily breakdown.</p></pui-tab-panel>
          <pui-tab-panel tabId="ss-b" id="ss-p-b"><p>Weekly breakdown.</p></pui-tab-panel>
        </pui-tabs>
      </div>
    `,
  }),
};

export const Pill: Story = {
  name: 'Variant / Pill',
  render: () => ({
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    template: `
      <p class="pui-tabs-showcase-description">${VARIANT_DESCRIPTIONS.pill}</p>
      <div class="pui-tabs-showcase-panel">
        <pui-tabs variant="pill" ariaLabel="Pill tabs">
          <pui-tab-item id="p-a" label="All" panelId="p-p-a"></pui-tab-item>
          <pui-tab-item id="p-b" label="Active" panelId="p-p-b"></pui-tab-item>
          <pui-tab-panel tabId="p-a" id="p-p-a"><p>All items.</p></pui-tab-panel>
          <pui-tab-panel tabId="p-b" id="p-p-b"><p>Active items only.</p></pui-tab-panel>
        </pui-tabs>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    props: { sizes: PUI_TABS_SIZES },
    template: `
      <div class="pui-tabs-showcase-stack">
        @for (size of sizes; track size) {
          <section>
            <p class="pui-tabs-showcase-label">Size {{ size }}</p>
            <div class="pui-tabs-showcase-panel">
              <pui-tabs variant="segmented" [size]="size" [ariaLabel]="'Size ' + size">
                <pui-tab-item [id]="'sz-' + size + '-1'" label="Tab A" [panelId]="'sz-p-' + size + '-1'"></pui-tab-item>
                <pui-tab-item [id]="'sz-' + size + '-2'" label="Tab B" [panelId]="'sz-p-' + size + '-2'"></pui-tab-item>
                <pui-tab-panel [tabId]="'sz-' + size + '-1'" [id]="'sz-p-' + size + '-1'"><p>Size {{ size }}</p></pui-tab-panel>
                <pui-tab-panel [tabId]="'sz-' + size + '-2'" [id]="'sz-p-' + size + '-2'"><p>Size {{ size }}</p></pui-tab-panel>
              </pui-tabs>
            </div>
          </section>
        }
      </div>
    `,
  }),
};

export const Orientations: Story = {
  render: () => ({
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    template: `
      <div class="pui-tabs-showcase-stack">
        <section>
          <p class="pui-tabs-showcase-label">Horizontal</p>
          <div class="pui-tabs-showcase-panel">
            <pui-tabs variant="underline" orientation="horizontal" ariaLabel="Horizontal tabs">
              <pui-tab-item id="h-a" label="Overview" panelId="h-p-a"></pui-tab-item>
              <pui-tab-item id="h-b" label="Settings" panelId="h-p-b"></pui-tab-item>
              <pui-tab-panel tabId="h-a" id="h-p-a"><p>Horizontal content.</p></pui-tab-panel>
              <pui-tab-panel tabId="h-b" id="h-p-b"><p>Settings content.</p></pui-tab-panel>
            </pui-tabs>
          </div>
        </section>
        <section>
          <p class="pui-tabs-showcase-label">Vertical</p>
          <div class="pui-tabs-showcase-panel pui-tabs-showcase-panel--vertical">
            <pui-tabs variant="underline" orientation="vertical" ariaLabel="Vertical tabs">
              <pui-tab-item id="v-a" label="Profile" panelId="v-p-a"></pui-tab-item>
              <pui-tab-item id="v-b" label="Security" panelId="v-p-b"></pui-tab-item>
              <pui-tab-panel tabId="v-a" id="v-p-a"><p>Profile settings.</p></pui-tab-panel>
              <pui-tab-panel tabId="v-b" id="v-p-b"><p>Security settings.</p></pui-tab-panel>
            </pui-tabs>
          </div>
        </section>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    template: `
      <div class="pui-tabs-showcase-stack">
        <section>
          <p class="pui-tabs-showcase-label">With badges</p>
          <div class="pui-tabs-showcase-panel">
            <pui-tabs variant="segmented" ariaLabel="Tabs with badges">
              <pui-tab-item id="b-a" label="Overview" panelId="b-p-a"></pui-tab-item>
              <pui-tab-item id="b-b" label="Reports" [badge]="3" panelId="b-p-b"></pui-tab-item>
              <pui-tab-item id="b-c" label="Alerts" [badge]="true" panelId="b-p-c"></pui-tab-item>
              <pui-tab-panel tabId="b-a" id="b-p-a"><p>No badge.</p></pui-tab-panel>
              <pui-tab-panel tabId="b-b" id="b-p-b"><p>Numeric badge.</p></pui-tab-panel>
              <pui-tab-panel tabId="b-c" id="b-p-c"><p>Dot badge.</p></pui-tab-panel>
            </pui-tabs>
          </div>
        </section>
        <section>
          <p class="pui-tabs-showcase-label">Disabled tab</p>
          <div class="pui-tabs-showcase-panel">
            <pui-tabs variant="underline" ariaLabel="Disabled tab">
              <pui-tab-item id="d-a" label="Active" panelId="d-p-a"></pui-tab-item>
              <pui-tab-item id="d-b" label="Disabled" panelId="d-p-b" [disabled]="true"></pui-tab-item>
              <pui-tab-panel tabId="d-a" id="d-p-a"><p>Active tab content.</p></pui-tab-panel>
              <pui-tab-panel tabId="d-b" id="d-p-b"><p>Disabled tab panel.</p></pui-tab-panel>
            </pui-tabs>
          </div>
        </section>
        <section>
          <p class="pui-tabs-showcase-label">Disabled group</p>
          <div class="pui-tabs-showcase-panel">
            <pui-tabs variant="segmented" [disabled]="true" ariaLabel="Disabled tabs">
              <pui-tab-item id="g-a" label="One" panelId="g-p-a"></pui-tab-item>
              <pui-tab-item id="g-b" label="Two" panelId="g-p-b"></pui-tab-item>
              <pui-tab-panel tabId="g-a" id="g-p-a"><p>One</p></pui-tab-panel>
              <pui-tab-panel tabId="g-b" id="g-p-b"><p>Two</p></pui-tab-panel>
            </pui-tabs>
          </div>
        </section>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    template: `
      <p class="pui-tabs-showcase-description">
        Uses tablist/tab/tabpanel roles, aria-selected, aria-controls, and arrow key navigation.
      </p>
      <div class="pui-tabs-showcase-panel">
        <pui-tabs variant="segmented" ariaLabel="Accessibility demo">
          <pui-tab-item id="a-a" label="First" panelId="a-p-a"></pui-tab-item>
          <pui-tab-item id="a-b" label="Second" panelId="a-p-b"></pui-tab-item>
          <pui-tab-item id="a-c" label="Third" panelId="a-p-c"></pui-tab-item>
          <pui-tab-panel tabId="a-a" id="a-p-a"><p>Try arrow keys on the tabs above.</p></pui-tab-panel>
          <pui-tab-panel tabId="a-b" id="a-p-b"><p>Second panel.</p></pui-tab-panel>
          <pui-tab-panel tabId="a-c" id="a-p-c"><p>Third panel.</p></pui-tab-panel>
        </pui-tabs>
      </div>
    `,
  }),
};

export const DarkTheme: Story = {
  render: () => ({
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    template: `
      <div class="pui-tabs-dark-shell" data-theme="dark">
        <pui-tabs variant="segmented-soft" ariaLabel="Dark theme tabs">
          <pui-tab-item id="dk-a" label="Overview" panelId="dk-p-a"></pui-tab-item>
          <pui-tab-item id="dk-b" label="Analytics" panelId="dk-p-b"></pui-tab-item>
          <pui-tab-panel tabId="dk-a" id="dk-p-a"><p>Dark theme panel content.</p></pui-tab-panel>
          <pui-tab-panel tabId="dk-b" id="dk-p-b"><p>Uses semantic tokens only.</p></pui-tab-panel>
        </pui-tabs>
      </div>
    `,
  }),
};

export const Playground: Story = {
  render: (args) => ({
    props: { ...args, selected: 'play-overview' },
    moduleMetadata: { imports: TABS_IMPORTS },
    styles: ['./tabs.stories.scss'],
    template: `
      <div class="pui-tabs-showcase-panel">
        <pui-tabs
          [variant]="variant"
          [orientation]="orientation"
          [size]="size"
          [ariaLabel]="ariaLabel"
          [disabled]="disabled"
          [value]="selected"
          (valueChange)="selected = $event"
        >
          <pui-tab-item id="play-overview" label="Overview" panelId="play-panel-overview"></pui-tab-item>
          <pui-tab-item id="play-analytics" label="Analytics" [badge]="3" panelId="play-panel-analytics"></pui-tab-item>
          <pui-tab-item id="play-settings" label="Settings" panelId="play-panel-settings"></pui-tab-item>

          <pui-tab-panel tabId="play-overview" id="play-panel-overview">
            <p>Selected tab: {{ selected }}</p>
          </pui-tab-panel>
          <pui-tab-panel tabId="play-analytics" id="play-panel-analytics">
            <p>Analytics panel with badge.</p>
          </pui-tab-panel>
          <pui-tab-panel tabId="play-settings" id="play-panel-settings">
            <p>Settings panel content.</p>
          </pui-tab-panel>
        </pui-tabs>
      </div>
    `,
  }),
  args: {
    variant: 'segmented',
    orientation: 'horizontal',
    size: 'md',
    ariaLabel: 'Playground tabs',
    disabled: false,
  },
};
