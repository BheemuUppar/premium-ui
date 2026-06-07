import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { PuiButtonComponent } from '../button';
import {
  PUI_TOAST_POSITIONS,
  PuiToastService,
  PuiToastViewportComponent,
  type PuiToastPosition,
  type PuiToastVariant,
} from './index';

const SHELL = [PuiButtonComponent, PuiToastViewportComponent];

@Component({
  selector: 'story-toast-icons',
  imports: SHELL,
  template: `
    <div class="story-toast-shell">
      <div class="story-toast-row">
        <pui-button variant="outline" (click)="showDefault()">Semantic icon</pui-button>
        <pui-button variant="outline" (click)="showCustom()">Custom bell</pui-button>
        <pui-button variant="ghost" (click)="showIconless()">Iconless</pui-button>
      </div>
      <pui-toast-viewport />
    </div>
  `,
  styles: [
    '.story-toast-shell { display: grid; gap: 1rem; }',
    '.story-toast-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
  ],
})
class StoryToastIconsComponent {
  protected readonly toast = inject(PuiToastService);

  protected showDefault(): void {
    this.toast.success('Changes saved');
  }

  protected showCustom(): void {
    this.toast.info('Reminder set', { iconName: 'bell' });
  }

  protected showIconless(): void {
    this.toast.success('Copied to clipboard', { icon: false });
  }
}

@Component({
  selector: 'story-toast-object-api',
  imports: SHELL,
  template: `
    <div class="story-toast-shell">
      <pui-button (click)="showObjectToast()">Object payload</pui-button>
      <pui-toast-viewport />
    </div>
  `,
  styles: ['.story-toast-shell { display: grid; gap: 1rem; }'],
})
class StoryToastObjectApiComponent {
  protected readonly toast = inject(PuiToastService);

  protected showObjectToast(): void {
    this.toast.success({
      title: 'Saved',
      description: 'Your changes were saved.',
      actionLabel: 'Undo',
      duration: 5000,
      position: 'top-right',
    });
  }
}

@Component({
  selector: 'story-toast-default',
  imports: SHELL,
  template: `
    <div class="story-toast-shell">
      <pui-button (click)="toast.show('Settings saved')">Show toast</pui-button>
      <pui-toast-viewport />
    </div>
  `,
  styles: ['.story-toast-shell { display: grid; gap: 1rem; }'],
})
class StoryToastDefaultComponent {
  protected readonly toast = inject(PuiToastService);
}

@Component({
  selector: 'story-toast-variants',
  imports: SHELL,
  template: `
    <div class="story-toast-shell">
      <div class="story-toast-row">
        @for (variant of variants; track variant) {
          <pui-button variant="outline" (click)="showVariant(variant)">{{ variant }}</pui-button>
        }
      </div>
      <pui-toast-viewport />
    </div>
  `,
  styles: [
    '.story-toast-shell { display: grid; gap: 1rem; }',
    '.story-toast-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
  ],
})
class StoryToastVariantsComponent {
  protected readonly toast = inject(PuiToastService);
  protected readonly variants: readonly PuiToastVariant[] = [
    'success',
    'error',
    'warning',
    'info',
    'loading',
  ];

  protected showVariant(variant: PuiToastVariant): void {
    this.toast.custom(`${variant} notification`, {
      variant,
      title: variant.charAt(0).toUpperCase() + variant.slice(1),
    });
  }
}

@Component({
  selector: 'story-toast-snackbar',
  imports: SHELL,
  template: `
    <div class="story-toast-shell">
      <pui-button (click)="showSnackbar()">Show snackbar</pui-button>
      <pui-toast-viewport />
    </div>
  `,
  styles: ['.story-toast-shell { display: grid; gap: 1rem; }'],
})
class StoryToastSnackbarComponent {
  protected readonly toast = inject(PuiToastService);

  protected showSnackbar(): void {
    this.toast.snackbar('File deleted', {
      action: { label: 'Undo', onClick: () => undefined },
    });
  }
}

@Component({
  selector: 'story-toast-compact',
  imports: SHELL,
  template: `
    <div class="story-toast-shell">
      <pui-button (click)="toast.compact('Copied to clipboard')">Compact toast</pui-button>
      <pui-toast-viewport />
    </div>
  `,
  styles: ['.story-toast-shell { display: grid; gap: 1rem; }'],
})
class StoryToastCompactComponent {
  protected readonly toast = inject(PuiToastService);
}

@Component({
  selector: 'story-toast-rich',
  imports: SHELL,
  template: `
    <div class="story-toast-shell">
      <pui-button (click)="showRich()">Rich toast</pui-button>
      <pui-toast-viewport />
    </div>
  `,
  styles: ['.story-toast-shell { display: grid; gap: 1rem; }'],
})
class StoryToastRichComponent {
  protected readonly toast = inject(PuiToastService);

  protected showRich(): void {
    this.toast.rich('Deployment complete', {
      description: 'Your app is now live on production.',
      action: { label: 'View deployment', onClick: () => undefined },
    });
  }
}

@Component({
  selector: 'story-toast-promise',
  imports: SHELL,
  template: `
    <div class="story-toast-shell">
      <pui-button (click)="runPromise()">Run promise toast</pui-button>
      <pui-toast-viewport />
    </div>
  `,
  styles: ['.story-toast-shell { display: grid; gap: 1rem; }'],
})
class StoryToastPromiseComponent {
  protected readonly toast = inject(PuiToastService);

  protected runPromise(): void {
    void this.toast.promise(
      new Promise<string>((resolve) => window.setTimeout(() => resolve('done'), 1800)),
      {
        loading: 'Uploading file…',
        success: 'Upload complete',
        error: 'Upload failed',
      }
    );
  }
}

@Component({
  selector: 'story-toast-positions',
  imports: SHELL,
  template: `
    <div class="story-toast-shell">
      <div class="story-toast-grid">
        @for (position of positions; track position) {
          <pui-button variant="outline" size="sm" (click)="showPosition(position)">
            {{ position }}
          </pui-button>
        }
      </div>
      <pui-toast-viewport />
    </div>
  `,
  styles: [
    '.story-toast-shell { display: grid; gap: 1rem; }',
    '.story-toast-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: 0.75rem; }',
  ],
})
class StoryToastPositionsComponent {
  protected readonly toast = inject(PuiToastService);
  protected readonly positions = PUI_TOAST_POSITIONS;

  protected showPosition(position: PuiToastPosition): void {
    this.toast.info(position, { position, title: position });
  }
}

@Component({
  selector: 'story-toast-stacked',
  imports: SHELL,
  template: `
    <div class="story-toast-shell">
      <pui-button (click)="stackToasts()">Stack toasts</pui-button>
      <pui-toast-viewport />
    </div>
  `,
  styles: ['.story-toast-shell { display: grid; gap: 1rem; }'],
})
class StoryToastStackedComponent {
  protected readonly toast = inject(PuiToastService);

  protected stackToasts(): void {
    this.toast.success('First notification');
    this.toast.info('Second notification');
    this.toast.warning('Third notification');
  }
}

const meta: Meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

export const Icons: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastIconsComponent] },
    template: '<story-toast-icons />',
  }),
};

export const ObjectApi: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastObjectApiComponent] },
    template: '<story-toast-object-api />',
  }),
};

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastDefaultComponent] },
    template: '<story-toast-default />',
  }),
};

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastVariantsComponent] },
    template: '<story-toast-variants />',
  }),
};

export const Snackbar: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastSnackbarComponent] },
    template: '<story-toast-snackbar />',
  }),
};

export const Compact: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastCompactComponent] },
    template: '<story-toast-compact />',
  }),
};

export const Rich: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastRichComponent] },
    template: '<story-toast-rich />',
  }),
};

export const PromiseToast: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastPromiseComponent] },
    template: '<story-toast-promise />',
  }),
};

export const Positions: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastPositionsComponent] },
    template: '<story-toast-positions />',
  }),
};

export const Stacked: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastStackedComponent] },
    template: '<story-toast-stacked />',
  }),
};

export const Playground: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryToastDefaultComponent] },
    template: '<story-toast-default />',
  }),
};
