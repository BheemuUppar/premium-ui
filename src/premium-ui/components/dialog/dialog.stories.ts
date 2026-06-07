import type { Meta, StoryObj } from '@storybook/angular';
import { Component, TemplateRef, ViewContainerRef, inject, signal, viewChild } from '@angular/core';
import { PuiButtonComponent } from '../button';
import {
  PuiDialogBodyComponent,
  PuiDialogComponent,
  PuiDialogFooterComponent,
  PuiDialogHeaderComponent,
  PuiDialogService,
  PuiDialogTitleComponent,
  injectPuiDialogData,
  PuiDialogRef,
  type PuiDialogVariant,
} from './index';

const SHELL = [
  PuiButtonComponent,
  PuiDialogComponent,
  PuiDialogHeaderComponent,
  PuiDialogTitleComponent,
  PuiDialogBodyComponent,
  PuiDialogFooterComponent,
];

@Component({
  selector: 'story-basic-dialog',
  imports: SHELL,
  template: `
    <pui-button (click)="open()">Open dialog</pui-button>
    <ng-template #dialogTpl let-dialogRef="dialogRef">
      <pui-dialog>
        <pui-dialog-header>
          <pui-dialog-title>Edit profile</pui-dialog-title>
        </pui-dialog-header>
        <pui-dialog-body>
          <p>Update your display name and workspace preferences.</p>
        </pui-dialog-body>
        <pui-dialog-footer>
          <pui-button variant="ghost" (click)="dialogRef.close()">Cancel</pui-button>
          <pui-button (click)="dialogRef.close()">Save</pui-button>
        </pui-dialog-footer>
      </pui-dialog>
    </ng-template>
  `,
})
class StoryBasicDialogComponent {
  private readonly dialog = inject(PuiDialogService);
  private readonly vcr = inject(ViewContainerRef);
  private readonly tpl = viewChild.required<TemplateRef<unknown>>('dialogTpl');

  protected open(): void {
    this.dialog.open(this.tpl(), {}, this.vcr);
  }
}

@Component({
  selector: 'story-user-dialog',
  imports: SHELL,
  template: `
    <pui-dialog [variant]="variant" ariaLabelledBy="user-dialog-title">
      <pui-dialog-header>
        <pui-dialog-title id="user-dialog-title">{{ user.name }}</pui-dialog-title>
      </pui-dialog-header>
      <pui-dialog-body>
        <p>{{ user.email }}</p>
        <p>{{ user.role }}</p>
      </pui-dialog-body>
      <pui-dialog-footer>
        @if (user.stackChildVariant) {
          <pui-button variant="outline" (click)="openChild()">Open second dialog</pui-button>
        }
        <pui-button variant="ghost" (click)="close()">Close</pui-button>
      </pui-dialog-footer>
    </pui-dialog>
  `,
})
class StoryUserDialogComponent {
  protected readonly user = injectPuiDialogData<{
    name: string;
    email: string;
    role: string;
    variant?: PuiDialogVariant;
    stackChildVariant?: PuiDialogVariant;
  }>();

  protected readonly variant = this.user.variant ?? 'default';
  private readonly dialog = inject(PuiDialogService);
  private readonly ref = inject(PuiDialogRef);

  protected openChild(): void {
    const childVariant = this.user.stackChildVariant ?? 'confirm';

    this.dialog.open(StoryUserDialogComponent, {
      variant: childVariant,
      data: {
        name: 'Second dialog',
        email: 'second@premium-ui.dev',
        role: `${childVariant} on top`,
        variant: childVariant,
      },
    });
  }

  protected close(): void {
    this.ref.close();
  }
}

@Component({
  selector: 'story-component-dialog',
  imports: [PuiButtonComponent, StoryUserDialogComponent],
  template: `<pui-button (click)="open()">Open user dialog</pui-button>`,
})
class StoryComponentDialogComponent {
  private readonly dialog = inject(PuiDialogService);

  protected open(): void {
    this.dialog.open(StoryUserDialogComponent, {
      data: {
        name: 'Alex Morgan',
        email: 'alex@premium-ui.dev',
        role: 'Engineering lead',
      },
    });
  }
}

@Component({
  selector: 'story-confirm-dialog',
  imports: [PuiButtonComponent],
  template: `<pui-button variant="danger" (click)="confirm()">Delete project</pui-button>`,
})
class StoryConfirmDialogComponent {
  private readonly dialog = inject(PuiDialogService);

  protected async confirm(): Promise<void> {
    await this.dialog.confirm({
      title: 'Delete project?',
      message: 'This action cannot be undone. All environments will be removed.',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
  }
}

@Component({
  selector: 'story-dialog-variants',
  imports: [PuiButtonComponent],
  template: `
    <div class="story-dialog-row">
      @for (variant of variants; track variant) {
        <pui-button variant="outline" (click)="open(variant)">{{ variant }}</pui-button>
      }
    </div>
  `,
  styles: ['.story-dialog-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }'],
})
class StoryDialogVariantsComponent {
  private readonly dialog = inject(PuiDialogService);

  protected readonly variants: readonly PuiDialogVariant[] = [
    'default',
    'confirm',
    'fullscreen',
    'sheet',
    'danger',
  ];

  protected open(variant: PuiDialogVariant): void {
    this.dialog.open(StoryUserDialogComponent, {
      variant,
      data: { name: `${variant} dialog`, email: 'demo@premium-ui.dev', role: 'Preview' },
      backdropClosable: true,
    });
  }
}

@Component({
  selector: 'story-multiple-dialogs',
  imports: [PuiButtonComponent],
  template: `
    <div class="story-dialog-row">
      <pui-button (click)="openFirst()">Open first layer</pui-button>
      <pui-button variant="ghost" (click)="closeAll()">Close all</pui-button>
    </div>
  `,
  styles: ['.story-dialog-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }'],
})
class StoryMultipleDialogsComponent {
  private readonly dialog = inject(PuiDialogService);

  protected openFirst(): void {
    this.dialog.open(StoryUserDialogComponent, {
      data: {
        name: 'First dialog',
        email: 'first@premium-ui.dev',
        role: 'Open the second dialog from here',
        stackChildVariant: 'confirm',
      },
    });
  }

  protected closeAll(): void {
    this.dialog.closeAll();
  }
}

@Component({
  selector: 'story-dialog-playground',
  imports: [PuiButtonComponent],
  template: `
    <div class="story-playground">
      <label>
        Width
        <input type="text" [value]="width()" (input)="setWidth($event)" />
      </label>
      <label>
        Variant
        <select [value]="variant()" (change)="setVariant($event)">
          @for (v of variants; track v) {
            <option [value]="v">{{ v }}</option>
          }
        </select>
      </label>
      <label>
        <input type="checkbox" [checked]="backdrop()" (change)="toggleBackdrop($event)" />
        Backdrop
      </label>
      <label>
        <input type="checkbox" [checked]="backdropClosable()" (change)="toggleBackdropClosable($event)" />
        Backdrop close
      </label>
      <pui-button (click)="open()">Open playground dialog</pui-button>
    </div>
  `,
  styles: [
    '.story-playground { display: grid; gap: 0.75rem; max-width: 20rem; }',
    '.story-playground label { display: grid; gap: 0.25rem; font-size: 0.875rem; }',
  ],
})
class StoryDialogPlaygroundComponent {
  private readonly dialog = inject(PuiDialogService);

  protected readonly variants = ['default', 'confirm', 'fullscreen', 'sheet', 'danger'] as const;
  protected readonly width = signal('32rem');
  protected readonly variant = signal<PuiDialogVariant>('default');
  protected readonly backdrop = signal(true);
  protected readonly backdropClosable = signal(true);

  protected setWidth(event: Event): void {
    this.width.set((event.target as HTMLInputElement).value);
  }

  protected setVariant(event: Event): void {
    this.variant.set((event.target as HTMLSelectElement).value as PuiDialogVariant);
  }

  protected toggleBackdrop(event: Event): void {
    this.backdrop.set((event.target as HTMLInputElement).checked);
  }

  protected toggleBackdropClosable(event: Event): void {
    this.backdropClosable.set((event.target as HTMLInputElement).checked);
  }

  protected open(): void {
    this.dialog.open(StoryUserDialogComponent, {
      variant: this.variant(),
      backdrop: this.backdrop(),
      backdropClosable: this.backdropClosable(),
      size: { width: this.width(), maxWidth: 'calc(100vw - 2rem)' },
      data: { name: 'Playground', email: 'playground@premium-ui.dev', role: 'Preview' },
    });
  }
}

const meta: Meta = {
  title: 'Overlays/Dialog',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const BasicDialog: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryBasicDialogComponent] },
    template: '<story-basic-dialog />',
  }),
};

export const TemplateDialog: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryBasicDialogComponent] },
    template: '<story-basic-dialog />',
  }),
};

export const ComponentDialog: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryComponentDialogComponent, StoryUserDialogComponent] },
    template: '<story-component-dialog />',
  }),
};

export const ConfirmDialog: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryConfirmDialogComponent] },
    template: '<story-confirm-dialog />',
  }),
};

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryDialogVariantsComponent, StoryUserDialogComponent] },
    template: '<story-dialog-variants />',
  }),
};

export const MultipleDialogs: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryMultipleDialogsComponent, StoryUserDialogComponent] },
    template: '<story-multiple-dialogs />',
  }),
};

export const Playground: Story = {
  render: () => ({
    moduleMetadata: { imports: [StoryDialogPlaygroundComponent, StoryUserDialogComponent] },
    template: '<story-dialog-playground />',
  }),
};
