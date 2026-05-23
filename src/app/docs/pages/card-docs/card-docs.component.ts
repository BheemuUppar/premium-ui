import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiCardComponent } from '../../../../premium-ui/components/card';
import type { PuiCardSize, PuiCardVariant } from '../../../../premium-ui/components/card';
import type { PuiDocsTab } from '../../docs.types';

type PuiDocsCardTab = 'overview' | 'examples' | 'api' | 'accessibility' | 'theming';

interface PuiCardExample {
  readonly title: string;
  readonly description: string;
  readonly code: string;
  readonly variant?: PuiCardVariant;
  readonly size?: PuiCardSize;
  readonly hoverable?: boolean;
  readonly interactive?: boolean;
  readonly disabled?: boolean;
}

interface PuiApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-card-docs',
  imports: [PuiCardComponent, RouterLink, RouterLinkActive],
  templateUrl: './card-docs.component.html',
  styleUrl: './card-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDocsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsCardTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly currentCodeTab = signal<'html' | 'ts'>('html');

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/card/overview'] },
    { label: 'Examples', route: ['/docs/components/card/examples'] },
    { label: 'API Guide', route: ['/docs/components/card/api'] },
    { label: 'Accessibility', route: ['/docs/components/card/accessibility'] },
    { label: 'Theming', route: ['/docs/components/card/theming'] }
  ];

  protected readonly variants: readonly PuiCardVariant[] = ['default', 'outlined', 'elevated', 'ghost'];
  protected readonly sizes: readonly PuiCardSize[] = ['sm', 'md', 'lg'];

  // Fixed TS2339: Added missing structural descriptions used by the @for loops in HTML
  protected readonly variantDescriptions: Record<PuiCardVariant, string> = {
    default: 'The standard card with a subtle border and soft background.',
    outlined: 'A clean card variant with a distinct border outline and no background shadow.',
    elevated: 'A premium-feeling card styled with a prominent shadow to provide surface depth.',
    ghost: 'An ultra-subtle transparent container designed to blend cleanly into any background.'
  };

  protected readonly sizeDescriptions: Record<PuiCardSize, string> = {
    sm: 'Compact layout padding optimized for dense lists, dashboard widgets, and minor data feeds.',
    md: 'Standard layout padding optimized for general content management and average readability.',
    lg: 'Generous layout padding optimized for complex hero blocks, modal structures, and feature callouts.'
  };

  protected readonly htmlExample = `<pui-card>
  <h3>Card Title</h3>
  <p>Your content here</p>
</pui-card>`;

  protected readonly tsExample = `import { Component } from '@angular/core';
import { PuiCardComponent } from '@premium-ui/components';

@Component({
  selector: 'app-example',
  imports: [PuiCardComponent],
  template: \`
    <pui-card>
      <h3>Card Title</h3>
      <p>Your content here</p>
    </pui-card>
  \`
})
export class ExampleComponent {}`;

  protected readonly examples: readonly PuiCardExample[] = [
    {
      title: 'Default card',
      description: 'The standard card with subtle border and soft background.',
      code: `<pui-card>
  <h3>Card Title</h3>
  <p>This is a default card with soft styling</p>
</pui-card>`
    },
    {
      title: 'Outlined card',
      description: 'A clean card with a stronger border and no shadow.',
      variant: 'outlined',
      code: `<pui-card variant="outlined">
  <h3>Card Title</h3>
  <p>This is an outlined card</p>
</pui-card>`
    },
    {
      title: 'Elevated card',
      description: 'A premium card with a strong shadow for prominent content.',
      variant: 'elevated',
      code: `<pui-card variant="elevated">
  <h3>Card Title</h3>
  <p>This is an elevated card with depth</p>
</pui-card>`
    },
    {
      title: 'Ghost card',
      description: 'A subtle card with transparent background.',
      variant: 'ghost',
      code: `<pui-card variant="ghost">
  <h3>Card Title</h3>
  <p>This is a ghost card</p>
</pui-card>`
    },
    {
      title: 'Hoverable card',
      description: 'A card that responds to hover with elevation effect.',
      hoverable: true,
      code: `<pui-card [hoverable]="true">
  <h3>Card Title</h3>
  <p>Hover over this card</p>
</pui-card>`
    },
    {
      title: 'Interactive card',
      description: 'A clickable card with keyboard support and hover state.',
      interactive: true,
      code: `<pui-card [interactive]="true">
  <h3>Card Title</h3>
  <p>Click this card for interaction</p>
</pui-card>`
    }
  ];

  protected readonly apiRows: readonly PuiApiRow[] = [
    { name: 'variant', type: 'PuiCardVariant', defaultValue: 'default', description: 'Controls the visual treatment: default, outlined, elevated, or ghost.' },
    { name: 'size', type: 'PuiCardSize', defaultValue: 'md', description: 'Controls padding and gap: sm, md, or lg.' },
    { name: 'hoverable', type: 'boolean', defaultValue: 'false', description: 'Enables subtle hover elevation effect.' },
    { name: 'interactive', type: 'boolean', defaultValue: 'false', description: 'Makes the card clickable with keyboard support and lift effect.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction for interactive cards.' }
  ];

  protected readonly ariaCode = `<pui-card
  interactive="true"
  [disabled]="isDisabled"
  role="button"
  tabindex="0"
  aria-disabled="false">
  Content
</pui-card>`;

  protected readonly themeCode = `:root {
  --pui-card-bg: var(--pui-color-surface);
  --pui-card-border: var(--pui-color-border);
  --pui-card-shadow: var(--pui-shadow-sm);
  --pui-card-padding: var(--pui-space-md);
  --pui-card-radius: var(--pui-radius-md);
}`;

  protected readonly customThemeCode = `:host {
  --pui-card-padding: var(--pui-space-lg);
  --pui-card-shadow: var(--pui-shadow-md);
}`;

  protected readonly playgroundVariant = signal<PuiCardVariant>('default');
  protected readonly playgroundSize = signal<PuiCardSize>('md');
  protected readonly playgroundHoverable = signal(false);
  protected readonly playgroundInteractive = signal(false);
  protected readonly playgroundDisabled = signal(false);

  protected readonly playgroundCode = computed(() => {
    const variant = this.playgroundVariant() !== 'default' ? ` variant="${this.playgroundVariant()}"` : '';
    const size = this.playgroundSize() !== 'md' ? ` size="${this.playgroundSize()}"` : '';
    const hoverable = this.playgroundHoverable() ? ' [hoverable]="true"' : '';
    const interactive = this.playgroundInteractive() ? ' [interactive]="true"' : '';
    const disabled = this.playgroundDisabled() && this.playgroundInteractive() ? ' [disabled]="true"' : '';
    return `<pui-card${variant}${size}${hoverable}${interactive}${disabled}>
  <h3>Card Title</h3>
  <p>Preview content</p>
</pui-card>`;
  });

  protected copyCode(code: string): void {
    void navigator.clipboard?.writeText(code);
  }

  protected updateVariant(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (this.isCardVariant(value)) {
      this.playgroundVariant.set(value);
    }
  }

  protected updateSize(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (this.isCardSize(value)) {
      this.playgroundSize.set(value);
    }
  }

  protected updateHoverable(event: Event): void {
    this.playgroundHoverable.set((event.target as HTMLInputElement).checked);
  }

  protected updateInteractive(event: Event): void {
    this.playgroundInteractive.set((event.target as HTMLInputElement).checked);
  }

  protected updateDisabled(event: Event): void {
    this.playgroundDisabled.set((event.target as HTMLInputElement).checked);
  }

  private isDocsTab(tab: unknown): tab is PuiDocsCardTab {
    return typeof tab === 'string' && ['overview', 'examples', 'api', 'accessibility', 'theming'].includes(tab);
  }

  private isCardVariant(value: unknown): value is PuiCardVariant {
    return typeof value === 'string' && ['default', 'outlined', 'elevated', 'ghost'].includes(value);
  }

  private isCardSize(value: unknown): value is PuiCardSize {
    return typeof value === 'string' && ['sm', 'md', 'lg'].includes(value);
  }
}