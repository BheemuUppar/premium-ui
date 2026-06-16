import type { Meta, StoryObj } from '@storybook/angular';
import { Component, TemplateRef, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { PuiButtonComponent } from '../../components/button';
import {
  PuiCommandItemTemplateDirective,
  PuiCommandPaletteShortcutDirective,
  PuiCommandPaletteService,
  PuiCommandRegistry,
  PuiCommandService,
  type PuiCommand,
} from '../index';
import {
  DEMO_ACTION_COMMANDS,
  DEMO_COMMANDS,
  DEMO_NAVIGATION_COMMANDS,
  createRouteCommands,
} from './command-palette.stories.constants';

@Component({
  selector: 'pui-command-palette-story-host',
  imports: [PuiButtonComponent, PuiCommandPaletteShortcutDirective],
  template: `
    <div [puiCommandPaletteShortcut]="shortcuts">
      <p style="margin: 0 0 1rem; color: var(--pui-muted); font-size: var(--pui-font-size-sm);">
        Press ⌘K / Ctrl+K or click Open palette.
      </p>
      <pui-button (click)="open()">Open palette</pui-button>
    </div>
  `,
})
class CommandPaletteStoryHostComponent {
  protected readonly shortcuts = ['meta+k', 'ctrl+k'] as const;
  private readonly palette = inject(PuiCommandPaletteService);
  private readonly registry = inject(PuiCommandRegistry);

  constructor() {
    this.registry.clear();
    this.registry.registerMany(DEMO_COMMANDS);
  }

  protected open(): void {
    this.palette.open();
  }
}

@Component({
  selector: 'pui-command-palette-custom-template-host',
  imports: [
    PuiButtonComponent,
    PuiCommandItemTemplateDirective,
    PuiCommandPaletteShortcutDirective,
  ],
  template: `
    <div [puiCommandPaletteShortcut]="shortcuts">
      <ng-template puiCommandItem let-command>
        <span style="font-weight: 600;">{{ command.label }}</span>
        @if (command.description) {
          <span style="margin-left: 0.5rem; color: var(--pui-muted); font-size: 0.75rem;">
            — {{ command.description }}
          </span>
        }
      </ng-template>
      <pui-button (click)="open()">Open custom template palette</pui-button>
    </div>
  `,
})
class CommandPaletteCustomTemplateHostComponent {
  protected readonly shortcuts = ['meta+k', 'ctrl+k'] as const;
  private readonly palette = inject(PuiCommandPaletteService);
  private readonly registry = inject(PuiCommandRegistry);
  readonly itemTemplate = viewChild(PuiCommandItemTemplateDirective);

  constructor() {
    this.registry.clear();
    this.registry.registerMany(DEMO_COMMANDS);
  }

  protected open(): void {
    const template = this.itemTemplate()?.templateRef;
    this.palette.open({ itemTemplate: template });
  }
}

@Component({
  selector: 'pui-command-palette-smooth-animation-host',
  imports: [PuiButtonComponent, PuiCommandPaletteShortcutDirective],
  template: `
    <div [puiCommandPaletteShortcut]="shortcuts">
      <p style="margin: 0 0 1rem; color: var(--pui-muted); font-size: var(--pui-font-size-sm);">
        Smooth variant — fluid fade, slide, and soft blur (260ms).
      </p>
      <pui-button (click)="open()">Open smooth palette</pui-button>
    </div>
  `,
})
class CommandPaletteSmoothAnimationHostComponent {
  protected readonly shortcuts = ['meta+k', 'ctrl+k'] as const;
  private readonly palette = inject(PuiCommandPaletteService);
  private readonly registry = inject(PuiCommandRegistry);

  constructor() {
    this.registry.clear();
    this.registry.registerMany(DEMO_COMMANDS);
  }

  protected open(): void {
    this.palette.open({ animation: 'smooth', positionAtCursor: true });
  }
}

const meta: Meta = {
  title: 'Components/Command Palette',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [CommandPaletteStoryHostComponent],
    },
    template: `<pui-command-palette-story-host />`,
  }),
};

export const GroupedCommands: Story = {
  name: 'Grouped Commands',
  render: () => ({
    moduleMetadata: {
      imports: [CommandPaletteStoryHostComponent],
    },
    template: `<pui-command-palette-story-host />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Commands are grouped by the `group` field — Navigation and Actions.',
      },
    },
  },
};

export const Icons: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [CommandPaletteStoryHostComponent],
    },
    template: `<pui-command-palette-story-host />`,
  }),
};

export const RecentCommands: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [CommandPaletteStoryHostComponent],
    },
    template: `<pui-command-palette-story-host />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Execute a command, reopen the palette with an empty query, and recently used commands appear first.',
      },
    },
  },
};

export const RouteCommands: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [CommandPaletteStoryHostComponent],
      providers: [
        provideRouter([
          { path: 'dashboard', component: CommandPaletteStoryHostComponent },
          { path: 'users', component: CommandPaletteStoryHostComponent },
          { path: 'billing', component: CommandPaletteStoryHostComponent },
          { path: '**', redirectTo: 'dashboard' },
        ]),
      ],
    },
    applicationConfig: {
      providers: [
        provideRouter([
          { path: 'dashboard', component: CommandPaletteStoryHostComponent },
          { path: 'users', component: CommandPaletteStoryHostComponent },
          { path: 'billing', component: CommandPaletteStoryHostComponent },
          { path: '**', redirectTo: 'dashboard' },
        ]),
      ],
    },
    template: `<pui-command-palette-story-host />`,
  }),
};

export const ActionCommands: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [CommandPaletteStoryHostComponent],
    },
    template: `<pui-command-palette-story-host />`,
  }),
};

export const CustomTemplates: Story = {
  name: 'Custom Templates',
  render: () => ({
    moduleMetadata: {
      imports: [CommandPaletteCustomTemplateHostComponent],
    },
    template: `<pui-command-palette-custom-template-host />`,
  }),
};

export const SmoothAnimation: Story = {
  name: 'Smooth Animation',
  render: () => ({
    moduleMetadata: {
      imports: [CommandPaletteSmoothAnimationHostComponent],
    },
    template: `<pui-command-palette-smooth-animation-host />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Fluid fade + slide + soft blur with a longer 260ms easing curve. Pass `{ animation: "smooth" }` to `open()`.',
      },
    },
  },
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  globals: { theme: 'dark' },
  render: () => ({
    moduleMetadata: {
      imports: [CommandPaletteStoryHostComponent],
    },
    template: `<pui-command-palette-story-host />`,
  }),
};

export const Playground: Story = {
  argTypes: {
    fuzzy: { control: 'boolean' },
    showRecent: { control: 'boolean' },
    maxResults: { control: { type: 'number', min: 5, max: 100 } },
  },
  args: {
    fuzzy: true,
    showRecent: true,
    maxResults: 50,
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [CommandPaletteStoryHostComponent],
    },
    template: `<pui-command-palette-story-host />`,
  }),
};

/** Registers route-aware commands for Storybook demos. */
export function registerStoryRouteCommands(router: Router, registry: PuiCommandRegistry): void {
  registry.registerMany(createRouteCommands((path) => void router.navigateByUrl(path)));
}

/** Utility for stories that need a one-off command set. */
export function registerStoryCommands(registry: PuiCommandRegistry, commands: readonly PuiCommand[]): void {
  registry.clear();
  registry.registerMany(commands);
}

export const STORY_COMMAND_GROUPS = {
  navigation: DEMO_NAVIGATION_COMMANDS,
  actions: DEMO_ACTION_COMMANDS,
};
