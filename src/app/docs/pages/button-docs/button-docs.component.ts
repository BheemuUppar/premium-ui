import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiButtonComponent } from '../../../../premium-ui/components/button';
import type { PuiButtonSize, PuiButtonVariant } from '../../../../premium-ui/components/button';
import type { PuiDocsTab } from '../../docs.types';

type PuiDocsButtonTab = 'overview' | 'examples' | 'api' | 'accessibility' | 'theming' | 'playground';

interface PuiButtonExample {
  readonly title: string;
  readonly description: string;
  readonly code: string;
  readonly variant?: PuiButtonVariant;
  readonly size?: PuiButtonSize;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly icon?: boolean;
}

interface PuiApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-button-docs',
  imports: [PuiButtonComponent, RouterLink, RouterLinkActive],
  templateUrl: './button-docs.component.html',
  styleUrl: './button-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonDocsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsButtonTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly currentCodeTab = signal<'html' | 'ts'>('html');

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/button/overview'] },
    { label: 'Examples', route: ['/docs/components/button/examples'] },
    { label: 'API Guide', route: ['/docs/components/button/api'] },
    { label: 'Accessibility', route: ['/docs/components/button/accessibility'] },
    { label: 'Theming', route: ['/docs/components/button/theming'] },
    { label: 'Playground', route: ['/docs/components/button/playground'] }
  ];

  protected readonly variants: readonly PuiButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'danger'];
  protected readonly sizes: readonly PuiButtonSize[] = ['sm', 'md', 'lg'];

  protected readonly htmlExample = '<pui-button>Save changes</pui-button>';

  protected readonly tsExample = `import { Component } from '@angular/core';
import { PuiButtonComponent } from '@premium-ui/components';

@Component({
  selector: 'app-example',
  imports: [PuiButtonComponent],
  template: '<pui-button>Save changes</pui-button>'
})
export class ExampleComponent {}`;

  protected readonly examples: readonly PuiButtonExample[] = [
    {
      title: 'Basic usage',
      description: 'Use the default primary button for the most important action on a surface.',
      code: '<pui-button>Save changes</pui-button>'
    },
    {
      title: 'Outline with icon',
      description: 'Project an icon into the icon slot while keeping the label accessible.',
      variant: 'outline',
      icon: true,
      code: `<pui-button variant="outline">
  <span puiButtonIcon aria-hidden="true">+</span>
  New item
</pui-button>`
    },
    {
      title: 'Loading state',
      description: 'Loading disables pointer actions and exposes aria-busy.',
      loading: true,
      code: '<pui-button [loading]="true">Saving</pui-button>'
    },
    {
      title: 'Disabled state',
      description: 'Disabled buttons remain visible but do not emit pressed events.',
      disabled: true,
      code: '<pui-button [disabled]="true">Unavailable</pui-button>'
    }
  ];

  protected readonly apiRows: readonly PuiApiRow[] = [
    { name: 'variant', type: 'PuiButtonVariant', defaultValue: 'primary', description: 'Controls the visual treatment and semantic intent.' },
    { name: 'size', type: 'PuiButtonSize', defaultValue: 'md', description: 'Controls height, padding, and label size.' },
    { name: 'type', type: 'button | submit | reset', defaultValue: 'button', description: 'Passes the native button type to the internal control.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction and applies disabled styling.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows a spinner, sets aria-busy, and disables interaction.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Supplies an accessible label for icon-only buttons.' }
  ];

  protected readonly outputRows: readonly PuiApiRow[] = [
    { name: 'pressed', type: 'MouseEvent', defaultValue: '-', description: 'Emits when the button is clicked while enabled.' }
  ];

  protected readonly themeCode = `:root {
  --pui-color-primary: #4f46e5;
  --pui-color-primary-hover: #4338ca;
  --pui-radius-md: 0.5rem;
}`;

  protected readonly playgroundVariant = signal<PuiButtonVariant>('primary');
  protected readonly playgroundSize = signal<PuiButtonSize>('md');
  protected readonly playgroundDisabled = signal(false);
  protected readonly playgroundLoading = signal(false);

  protected readonly playgroundCode = computed(() => {
    const disabled = this.playgroundDisabled() ? ' [disabled]="true"' : '';
    const loading = this.playgroundLoading() ? ' [loading]="true"' : '';
    return `<pui-button variant="${this.playgroundVariant()}" size="${this.playgroundSize()}"${disabled}${loading}>
  Preview action
</pui-button>`;
  });

  protected copyCode(code: string): void {
    void navigator.clipboard?.writeText(code);
  }

  protected updateVariant(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (this.isButtonVariant(value)) {
      this.playgroundVariant.set(value);
    }
  }

  protected updateSize(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (this.isButtonSize(value)) {
      this.playgroundSize.set(value);
    }
  }

  protected updateDisabled(event: Event): void {
    this.playgroundDisabled.set((event.target as HTMLInputElement).checked);
  }

  protected updateLoading(event: Event): void {
    this.playgroundLoading.set((event.target as HTMLInputElement).checked);
  }

  private isDocsTab(tab: string): tab is PuiDocsButtonTab {
    return ['overview', 'examples', 'api', 'accessibility', 'theming', 'playground'].includes(tab);
  }

  private isButtonVariant(value: string): value is PuiButtonVariant {
    return this.variants.includes(value as PuiButtonVariant);
  }

  private isButtonSize(value: string): value is PuiButtonSize {
    return this.sizes.includes(value as PuiButtonSize);
  }
}
