import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiButtonComponent } from '../../../../premium-ui/components/button';
import {
  PuiCardActionsComponent,
  PuiCardBadgeComponent,
  PuiCardComponent,
  PuiCardContentComponent,
  PuiCardFooterComponent,
  PuiCardHeaderComponent,
  PuiCardImageComponent,
  PuiCardSubtitleComponent,
  PuiCardTitleComponent,
} from '../../../../premium-ui/components/card';
import type { PuiCardSize, PuiCardVariant } from '../../../../premium-ui/components/card';
import { PuiCheckboxComponent } from '../../../../premium-ui/components/checkbox';
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectValue } from '../../../../premium-ui/components/select';
import type { PuiDocCodeTab, PuiDocsTab } from '../../docs.types';
import {
  PuiDocCodeBlockComponent,
  buildPlaygroundTsExample,
  toSelectOptions,
} from '../../shared';

type PuiDocsCardTab =
  | 'overview'
  | 'examples'
  | 'layouts'
  | 'api'
  | 'accessibility'
  | 'theming'
  | 'playground';

interface PuiApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

const PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop';

@Component({
  selector: 'app-card-docs',
  imports: [
    PuiCardComponent,
    PuiCardHeaderComponent,
    PuiCardTitleComponent,
    PuiCardSubtitleComponent,
    PuiCardContentComponent,
    PuiCardFooterComponent,
    PuiCardActionsComponent,
    PuiCardImageComponent,
    PuiCardBadgeComponent,
    PuiButtonComponent,
    PuiSelectComponent,
    PuiCheckboxComponent,
    PuiDocCodeBlockComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './card-docs.component.html',
  styleUrl: './card-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/card/overview'] },
    { label: 'Examples', route: ['/docs/components/card/examples'] },
    { label: 'Layouts', route: ['/docs/components/card/layouts'] },
    { label: 'API Guide', route: ['/docs/components/card/api'] },
    { label: 'Accessibility', route: ['/docs/components/card/accessibility'] },
    { label: 'Theming', route: ['/docs/components/card/theming'] },
    { label: 'Playground', route: ['/docs/components/card/playground'] },
  ];

  protected readonly variants: readonly PuiCardVariant[] = [
    'default',
    'outlined',
    'elevated',
    'ghost',
    'glass',
    'gradient',
  ];

  protected readonly variantDescriptions: Record<PuiCardVariant, string> = {
    default: 'Soft gradient surface with layered ambient shadows and inner highlight.',
    outlined: 'Semi-transparent surface with subtle border and restrained depth.',
    elevated: 'High elevation with deeper ambient shadow stack on hover.',
    ghost: 'Borderless transparent surface for nested or minimal layouts.',
    glass: 'Frosted glass with blur, layered highlights, and soft ambient depth.',
    gradient: 'Primary-tinted gradient with spotlight overlay for featured content.',
  };

  protected readonly sizes: readonly PuiCardSize[] = ['sm', 'md', 'lg'];
  protected readonly variantOptions = toSelectOptions(this.variants);
  protected readonly sizeOptions = toSelectOptions(this.sizes);
  protected readonly productImage = PRODUCT_IMAGE;

  protected readonly htmlExample = `<pui-card hoverable>
  <pui-card-header>
    <pui-card-title>Revenue</pui-card-title>
    <pui-card-subtitle>Monthly analytics</pui-card-subtitle>
  </pui-card-header>
  <pui-card-content>Your content here</pui-card-content>
  <pui-card-footer>
    <pui-card-actions>
      <pui-button size="sm" variant="ghost">View</pui-button>
    </pui-card-actions>
  </pui-card-footer>
</pui-card>`;

  protected readonly pricingExample = `<pui-card variant="gradient" highlighted hoverable>
  <pui-card-header split>
    <pui-card-title>Pro</pui-card-title>
    <pui-card-badge variant="primary" pill>Popular</pui-card-badge>
  </pui-card-header>
  <pui-card-content>$49 / month</pui-card-content>
  <pui-card-footer>
    <pui-button>Choose plan</pui-button>
  </pui-card-footer>
</pui-card>`;

  protected readonly productExample = `<pui-card hoverable imageZoom>
  <pui-card-image src="..." alt="Product" zoomOnHover aspect="square" />
  <pui-card-title>Product name</pui-card-title>
  <pui-card-footer>
    <pui-button size="sm">Add to cart</pui-button>
  </pui-card-footer>
</pui-card>`;

  protected readonly cardApiRows: readonly PuiApiRow[] = [
    { name: 'variant', type: 'PuiCardVariant', defaultValue: 'default', description: 'Visual style: default, outlined, elevated, ghost, glass, gradient.' },
    { name: 'size', type: 'PuiCardSize', defaultValue: 'md', description: 'Padding scale: sm, md, lg.' },
    { name: 'layout', type: 'vertical | horizontal', defaultValue: 'vertical', description: 'Stack content vertically or place media beside content.' },
    { name: 'hoverable', type: 'boolean', defaultValue: 'false', description: 'Enables subtle lift and shadow on hover.' },
    { name: 'interactive', type: 'boolean', defaultValue: 'false', description: 'Makes the card clickable with keyboard support.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows skeleton placeholder state.' },
    { name: 'highlighted', type: 'boolean', defaultValue: 'false', description: 'Premium emphasis ring for pricing or featured content.' },
    { name: 'imageZoom', type: 'boolean', defaultValue: 'false', description: 'Enables image zoom on hover for nested pui-card-image.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction for interactive cards.' },
  ];

  protected readonly primitiveApiRows: readonly PuiApiRow[] = [
    { name: 'pui-card-header', type: 'component', defaultValue: '-', description: 'Header region with optional split layout for title + actions.' },
    { name: 'pui-card-title', type: 'component', defaultValue: '-', description: 'Semantic card heading.' },
    { name: 'pui-card-subtitle', type: 'component', defaultValue: '-', description: 'Supporting header text.' },
    { name: 'pui-card-content', type: 'component', defaultValue: '-', description: 'Main body content area.' },
    { name: 'pui-card-footer', type: 'component', defaultValue: '-', description: 'Footer actions and metadata.' },
    { name: 'pui-card-actions', type: 'component', defaultValue: '-', description: 'Inline action cluster, typically in header/footer.' },
    { name: 'pui-card-image', type: 'component', defaultValue: '-', description: 'Media with aspect ratio, overlay, gradient, and zoom.' },
    { name: 'pui-card-badge', type: 'component', defaultValue: '-', description: 'Status badge with semantic variants.' },
  ];

  protected readonly themeCode = `:host {
  --pui-card-bg: var(--pui-color-surface);
  --pui-card-border: var(--pui-color-border);
  --pui-card-shadow: var(--pui-shadow-lg);
  --pui-card-hover-shadow: var(--pui-shadow-xl);
  --pui-card-radius: var(--pui-radius-xl);
  --pui-card-padding: var(--pui-space-lg);
}`;

  protected readonly playgroundVariant = signal<PuiCardVariant>('elevated');
  protected readonly playgroundSize = signal<PuiCardSize>('md');
  protected readonly playgroundHoverable = signal(true);
  protected readonly playgroundHighlighted = signal(false);
  protected readonly playgroundLoading = signal(false);

  protected readonly playgroundCode = computed(() => {
    const attrs = [
      this.playgroundHoverable() ? ' hoverable' : '',
      this.playgroundHighlighted() ? ' highlighted' : '',
      this.playgroundLoading() ? ' loading' : '',
      this.playgroundVariant() !== 'default' ? ` variant="${this.playgroundVariant()}"` : '',
      this.playgroundSize() !== 'md' ? ` size="${this.playgroundSize()}"` : '',
    ].join('');

    return `<pui-card${attrs}>
  <pui-card-title>Preview</pui-card-title>
  <pui-card-content>Composable premium card</pui-card-content>
</pui-card>`;
  });

  protected readonly playgroundExampleTabs = computed((): readonly PuiDocCodeTab[] => [
    { id: 'html', label: 'HTML', code: this.playgroundCode(), language: 'html', filename: 'playground.component.html' },
    { id: 'ts', label: 'TypeScript', code: this.playgroundTsExample(), language: 'typescript', filename: 'playground.component.ts' },
  ]);

  protected readonly playgroundTsExample = computed(() =>
    buildPlaygroundTsExample({
      componentClass: 'CardPlaygroundComponent',
      imports: [
        { name: 'PuiCardComponent', path: '@premium-ui/components/card' },
        { name: 'PuiCardTitleComponent', path: '@premium-ui/components/card' },
        { name: 'PuiCardContentComponent', path: '@premium-ui/components/card' },
      ],
      members: [
        `protected readonly variant = signal('${this.playgroundVariant()}' as const);`,
        `protected readonly size = signal('${this.playgroundSize()}' as const);`,
        `protected readonly hoverable = signal(${this.playgroundHoverable()});`,
        `protected readonly highlighted = signal(${this.playgroundHighlighted()});`,
        `protected readonly loading = signal(${this.playgroundLoading()});`,
      ],
    })
  );

  protected setPlaygroundVariant(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundVariant.set(value as PuiCardVariant);
    }
  }

  protected setPlaygroundSize(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundSize.set(value as PuiCardSize);
    }
  }

  private isDocsTab(tab: string): tab is PuiDocsCardTab {
    return ['overview', 'examples', 'layouts', 'api', 'accessibility', 'theming', 'playground'].includes(tab);
  }
}
