import type { Meta, StoryObj } from '@storybook/angular';
import { inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { PuiToggleComponent, PuiToggleGroupComponent } from './index';
import {
  PUI_TOGGLE_DENSITIES,
  PUI_TOGGLE_SHAPES,
  PUI_TOGGLE_VARIANTS,
} from './toggle.constants';
import type { PuiToggleValue } from './toggle.types';

const TOGGLE_IMPORTS = [PuiToggleComponent, PuiToggleGroupComponent, ReactiveFormsModule, JsonPipe];

const BOLD_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/></svg>`;
const ITALIC_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`;
const UNDERLINE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>`;
const GRID_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`;
const LIST_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>`;

const meta: Meta<PuiToggleComponent> = {
  title: 'Components/Toggle',
  component: PuiToggleComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: [...PUI_TOGGLE_VARIANTS] },
    shape: { control: 'select', options: [...PUI_TOGGLE_SHAPES] },
    density: { control: 'select', options: [...PUI_TOGGLE_DENSITIES] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    shape: 'rounded',
    density: 'default',
    size: 'md',
    pressed: false,
    disabled: false,
    loading: false,
    iconOnly: false,
  },
};

export default meta;

type Story = StoryObj<PuiToggleComponent>;

export const Default: Story = {
  args: { pressed: true },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    template: `<pui-toggle [pressed]="pressed" [variant]="variant" [shape]="shape" [density]="density">Bold</pui-toggle>`,
  }),
};

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { variants: PUI_TOGGLE_VARIANTS },
    template: `
      <div class="pui-toggle-showcase-stack">
        @for (variant of variants; track variant) {
          <div>
            <p class="pui-toggle-showcase-label">{{ variant }}</p>
            <div class="pui-toggle-showcase-row">
              <pui-toggle [variant]="variant" [pressed]="true">{{ variant }}</pui-toggle>
              <pui-toggle [variant]="variant">{{ variant }}</pui-toggle>
            </div>
          </div>
        }
      </div>
    `,
  }),
};

export const Shapes: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { shapes: PUI_TOGGLE_SHAPES },
    template: `
      <div class="pui-toggle-showcase-row">
        @for (shape of shapes; track shape) {
          <pui-toggle [shape]="shape" [pressed]="true">{{ shape }}</pui-toggle>
        }
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { sizes: ['sm', 'md', 'lg'] as const },
    template: `
      <div class="pui-toggle-showcase-row">
        @for (size of sizes; track size) {
          <pui-toggle [size]="size" [pressed]="true">{{ size }}</pui-toggle>
        }
      </div>
    `,
  }),
};

export const Density: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { densities: PUI_TOGGLE_DENSITIES },
    template: `
      <div class="pui-toggle-showcase-stack">
        @for (density of densities; track density) {
          <pui-toggle [density]="density" [pressed]="true">{{ density }}</pui-toggle>
        }
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: { pressed: true, disabled: true },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    template: `<pui-toggle [pressed]="pressed" [disabled]="disabled">Disabled</pui-toggle>`,
  }),
};

export const Pressed: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { pressed: signal(true) },
    template: `
      <pui-toggle [(pressed)]="pressed">Toggle me</pui-toggle>
      <p class="pui-toggle-showcase-meta">Pressed: {{ pressed() }}</p>
    `,
  }),
};

export const IconToggles: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { bold: signal(true), italic: signal(false) },
    template: `
      <div class="pui-toggle-showcase-row">
        <pui-toggle iconOnly ariaLabel="Bold" [(pressed)]="bold">
          <span class="pui-toggle-icon">${BOLD_ICON}</span>
        </pui-toggle>
        <pui-toggle iconOnly ariaLabel="Italic" [(pressed)]="italic">
          <span class="pui-toggle-icon">${ITALIC_ICON}</span>
        </pui-toggle>
        <pui-toggle variant="outline">
          <span class="pui-toggle-icon">${GRID_ICON}</span>
          Grid
        </pui-toggle>
      </div>
    `,
  }),
};

export const SegmentedControls: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { view: signal<PuiToggleValue>('grid') },
    template: `
      <pui-toggle-group mode="segmented" shape="pill" [(value)]="view" ariaLabel="View mode" class="pui-toggle-segmented-demo">
        <pui-toggle value="grid">
          <span class="pui-toggle-icon">${GRID_ICON}</span>
          Grid
        </pui-toggle>
        <pui-toggle value="list">
          <span class="pui-toggle-icon">${LIST_ICON}</span>
          List
        </pui-toggle>
        <pui-toggle value="compact">Compact</pui-toggle>
      </pui-toggle-group>
      <p class="pui-toggle-showcase-meta">Selected: {{ view() }}</p>
    `,
  }),
};

export const ToolbarControls: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { formatting: signal<PuiToggleValue[]>(['bold']) },
    template: `
      <pui-toggle-group mode="toolbar" multiple [(value)]="formatting" ariaLabel="Text formatting">
        <pui-toggle iconOnly value="bold" ariaLabel="Bold">
          <span class="pui-toggle-icon">${BOLD_ICON}</span>
        </pui-toggle>
        <pui-toggle iconOnly value="italic" ariaLabel="Italic">
          <span class="pui-toggle-icon">${ITALIC_ICON}</span>
        </pui-toggle>
        <pui-toggle iconOnly value="underline" ariaLabel="Underline">
          <span class="pui-toggle-icon">${UNDERLINE_ICON}</span>
        </pui-toggle>
      </pui-toggle-group>
      <p class="pui-toggle-showcase-meta">Active: {{ formatting() | json }}</p>
    `,
  }),
};

export const SingleSelection: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { theme: signal<PuiToggleValue>('system') },
    template: `
      <pui-toggle-group mode="segmented" shape="pill" variant="soft" [(value)]="theme" ariaLabel="Theme">
        <pui-toggle value="light">Light</pui-toggle>
        <pui-toggle value="dark">Dark</pui-toggle>
        <pui-toggle value="system">System</pui-toggle>
      </pui-toggle-group>
    `,
  }),
};

export const MultiSelection: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { filters: signal<PuiToggleValue[]>(['design', 'product']) },
    template: `
      <pui-toggle-group multiple [(value)]="filters" ariaLabel="Filters">
        <pui-toggle variant="outline" value="design">Design</pui-toggle>
        <pui-toggle variant="outline" value="product">Product</pui-toggle>
        <pui-toggle variant="outline" value="engineering">Engineering</pui-toggle>
        <pui-toggle variant="outline" value="marketing">Marketing</pui-toggle>
      </pui-toggle-group>
      <p class="pui-toggle-showcase-meta">{{ filters() | json }}</p>
    `,
  }),
};

export const ReactiveForms: Story = {
  render: () => {
    const fb = inject(FormBuilder);
    const form = fb.nonNullable.group({
      bold: [false],
      view: ['grid' as PuiToggleValue],
      filters: [['design'] as PuiToggleValue[]],
    });

    return {
      moduleMetadata: { imports: TOGGLE_IMPORTS },
      styles: ['./toggle.stories.scss'],
      props: { form },
      template: `
      <form [formGroup]="form" class="pui-toggle-showcase-stack">
        <pui-toggle formControlName="bold">Bold</pui-toggle>
        <pui-toggle-group mode="segmented" formControlName="view" ariaLabel="View">
          <pui-toggle value="grid">Grid</pui-toggle>
          <pui-toggle value="list">List</pui-toggle>
        </pui-toggle-group>
        <pui-toggle-group multiple formControlName="filters" ariaLabel="Filters">
          <pui-toggle value="design">Design</pui-toggle>
          <pui-toggle value="product">Product</pui-toggle>
        </pui-toggle-group>
      </form>
      <p class="pui-toggle-showcase-meta">{{ form.value | json }}</p>
    `,
    };
  },
};

export const SignalForms: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: {
      bold: signal(false),
      view: signal<PuiToggleValue>('grid'),
    },
    template: `
      <div class="pui-toggle-showcase-stack">
        <pui-toggle [pressed]="bold()" (change)="bold.set($event)">Bold</pui-toggle>
        <pui-toggle-group mode="segmented" [value]="view()" (selectionChange)="view.set($any($event))" ariaLabel="View">
          <pui-toggle value="grid">Grid</pui-toggle>
          <pui-toggle value="list">List</pui-toggle>
        </pui-toggle-group>
      </div>
      <p class="pui-toggle-showcase-meta">Bold: {{ bold() }} · View: {{ view() }}</p>
    `,
  }),
};

export const DarkMode: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { view: signal<PuiToggleValue>('grid'), period: signal<PuiToggleValue>('month') },
    template: `
      <div class="pui-toggle-dark-panel" data-theme="dark">
        <div class="pui-toggle-showcase-stack">
          <pui-toggle-group mode="segmented" variant="elevated" shape="pill" [(value)]="view" ariaLabel="View mode">
            <pui-toggle value="grid">Grid</pui-toggle>
            <pui-toggle value="list">List</pui-toggle>
            <pui-toggle value="compact">Compact</pui-toggle>
          </pui-toggle-group>
          <pui-toggle-group mode="segmented" variant="subtle" [(value)]="period" ariaLabel="Period">
            <pui-toggle value="week">Week</pui-toggle>
            <pui-toggle value="month">Month</pui-toggle>
            <pui-toggle value="year">Year</pui-toggle>
          </pui-toggle-group>
        </div>
      </div>
    `,
  }),
};

export const GlassVariant: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { view: signal<PuiToggleValue>('grid') },
    template: `
      <div class="pui-toggle-glass-panel">
        <pui-toggle-group mode="segmented" variant="glass" shape="pill" [(value)]="view" ariaLabel="Glass segmented">
          <pui-toggle value="grid">Grid</pui-toggle>
          <pui-toggle value="list">List</pui-toggle>
          <pui-toggle value="compact">Compact</pui-toggle>
        </pui-toggle-group>
      </div>
    `,
  }),
};

export const AnimatedSegmented: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { period: signal<PuiToggleValue>('week') },
    template: `
      <pui-toggle-group mode="segmented" variant="elevated" shape="pill" [(value)]="period" ariaLabel="Animated period">
        <pui-toggle value="week">Week</pui-toggle>
        <pui-toggle value="month">Month</pui-toggle>
        <pui-toggle value="year">Year</pui-toggle>
        <pui-toggle value="custom">Custom</pui-toggle>
      </pui-toggle-group>
      <p class="pui-toggle-showcase-meta">Watch the indicator slide — {{ period() }}</p>
    `,
  }),
};

export const TextEditorToolbar: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { active: signal<PuiToggleValue[]>(['bold']) },
    template: `
      <div class="pui-toggle-editor-demo">
        <pui-toggle-group mode="toolbar" multiple [(value)]="active" ariaLabel="Editor formatting">
          <pui-toggle iconOnly value="bold" ariaLabel="Bold">
            <span class="pui-toggle-icon">${BOLD_ICON}</span>
          </pui-toggle>
          <pui-toggle iconOnly value="italic" ariaLabel="Italic">
            <span class="pui-toggle-icon">${ITALIC_ICON}</span>
          </pui-toggle>
          <pui-toggle iconOnly value="underline" ariaLabel="Underline">
            <span class="pui-toggle-icon">${UNDERLINE_ICON}</span>
          </pui-toggle>
        </pui-toggle-group>
        <div class="pui-toggle-editor-content">
          Figma-inspired formatting toolbar with compact density and inset press states.
        </div>
      </div>
    `,
  }),
};

export const ViewSwitcher: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { view: signal<PuiToggleValue>('grid') },
    template: `
      <pui-toggle-group mode="segmented" variant="outline" shape="rounded" [(value)]="view" ariaLabel="View switcher">
        <pui-toggle value="grid">
          <span class="pui-toggle-icon">${GRID_ICON}</span>
          Grid
        </pui-toggle>
        <pui-toggle value="list">
          <span class="pui-toggle-icon">${LIST_ICON}</span>
          List
        </pui-toggle>
        <pui-toggle value="compact">Compact</pui-toggle>
      </pui-toggle-group>
    `,
  }),
};

export const ThemeSwitcher: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { theme: signal<PuiToggleValue>('system') },
    template: `
      <pui-toggle-group mode="segmented" shape="pill" density="comfortable" [(value)]="theme" ariaLabel="Theme">
        <pui-toggle value="light">Light</pui-toggle>
        <pui-toggle value="dark">Dark</pui-toggle>
        <pui-toggle value="system">System</pui-toggle>
      </pui-toggle-group>
    `,
  }),
};

export const FilterToggles: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { filters: signal<PuiToggleValue[]>(['active']) },
    template: `
      <pui-toggle-group multiple density="compact" [(value)]="filters" ariaLabel="Status filters">
        <pui-toggle variant="subtle" value="active">Active</pui-toggle>
        <pui-toggle variant="subtle" value="draft">Draft</pui-toggle>
        <pui-toggle variant="subtle" value="archived">Archived</pui-toggle>
      </pui-toggle-group>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: { view: signal<PuiToggleValue>('grid') },
    template: `
      <pui-toggle-group mode="segmented" [(value)]="view" ariaLabel="Accessible view switcher">
        <pui-toggle value="grid">Grid view</pui-toggle>
        <pui-toggle value="list">List view</pui-toggle>
      </pui-toggle-group>
      <p class="pui-toggle-showcase-meta">Use arrow keys, Tab, Space, and Enter.</p>
    `,
  }),
};

export const Playground: Story = {
  render: () => ({
    moduleMetadata: { imports: TOGGLE_IMPORTS },
    styles: ['./toggle.stories.scss'],
    props: {
      variant: signal('default'),
      shape: signal('rounded'),
      density: signal('default'),
      mode: signal('segmented'),
      pressed: signal(false),
      view: signal<PuiToggleValue>('grid'),
      variants: PUI_TOGGLE_VARIANTS,
      shapes: PUI_TOGGLE_SHAPES,
      densities: PUI_TOGGLE_DENSITIES,
    },
    template: `
      <div class="pui-toggle-playground-panel">
        <pui-toggle-group
          [mode]="$any(mode())"
          [variant]="$any(variant())"
          [shape]="$any(shape())"
          [density]="$any(density())"
          [(value)]="view"
          ariaLabel="Playground"
        >
          <pui-toggle value="grid">Grid</pui-toggle>
          <pui-toggle value="list">List</pui-toggle>
          <pui-toggle value="compact">Compact</pui-toggle>
        </pui-toggle-group>
        <p class="pui-toggle-showcase-meta">Selected: {{ view() }}</p>
      </div>
    `,
  }),
};
