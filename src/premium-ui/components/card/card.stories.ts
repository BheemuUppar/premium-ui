import type { Meta, StoryObj } from '@storybook/angular';
import { PuiButtonComponent } from '../button/button.component';
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
} from './index';
import { HERO_IMAGE, MOVIE_IMAGE, PRODUCT_IMAGE } from './card.stories.constants';

const CARD_IMPORTS = [
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
];

const meta: Meta<PuiCardComponent> = {
  title: 'Components/Card',
  component: PuiCardComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'ghost', 'glass', 'gradient'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    layout: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    hoverable: { control: 'boolean' },
    interactive: { control: 'boolean' },
    loading: { control: 'boolean' },
    highlighted: { control: 'boolean' },
    imageZoom: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    size: 'md',
    layout: 'vertical',
    hoverable: false,
    interactive: false,
    loading: false,
    highlighted: false,
    imageZoom: false,
  },
};

export default meta;

type Story = StoryObj<PuiCardComponent>;

export const Basic: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    template: `
      <div class="card-showcase-stage">
        <pui-card class="card-showcase-narrow" variant="elevated" hoverable size="lg">
          <pui-card-header split>
            <div>
              <pui-card-title>Revenue</pui-card-title>
              <pui-card-subtitle>Monthly analytics overview</pui-card-subtitle>
            </div>
            <pui-card-badge variant="success" pill>+12%</pui-card-badge>
          </pui-card-header>
          <pui-card-content>
            <div class="pui-card__metric-group">
              <span class="pui-card__metric-label">Total MRR</span>
              <p class="pui-card__metric pui-card__metric--display">$84,320</p>
              <span class="pui-card__metric-trend pui-card__metric-trend--positive">↑ 12.4% vs last month</span>
            </div>
            <div class="pui-card__chart" aria-hidden="true"></div>
          </pui-card-content>
          <pui-card-footer>
            <span class="pui-card__meta">Updated 2m ago</span>
            <pui-card-actions>
              <pui-button size="sm" variant="ghost">Details</pui-button>
            </pui-card-actions>
          </pui-card-footer>
        </pui-card>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    props: {
      variants: ['default', 'outlined', 'elevated', 'ghost', 'glass', 'gradient'] as const,
    },
    template: `
      <div class="card-showcase-grid">
        @for (variant of variants; track variant) {
          <pui-card [variant]="variant" hoverable size="lg">
            <pui-card-header>
              <pui-card-title>{{ variant }}</pui-card-title>
              <pui-card-subtitle>Layered depth · premium surfaces</pui-card-subtitle>
            </pui-card-header>
            <pui-card-content>
              Ambient shadows, inner highlights, and refined border glow on hover.
            </pui-card-content>
          </pui-card>
        }
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    template: `
      <pui-card class="card-showcase-narrow" variant="elevated" interactive hoverable>
        <pui-card-title>Interactive card</pui-card-title>
        <pui-card-content>
          Keyboard accessible with focus-visible ring, premium lift, and border glow on hover.
        </pui-card-content>
      </pui-card>
    `,
  }),
};

export const ImageCard: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    template: `
      <pui-card class="card-showcase-narrow" variant="elevated" imageZoom hoverable size="lg">
        <pui-card-image
          [src]="image"
          alt="Abstract gradient artwork"
          aspect="video"
          gradientOverlay
          zoomOnHover
        />
        <pui-card-header>
          <pui-card-title>Design systems</pui-card-title>
          <pui-card-subtitle>Cinematic media treatment</pui-card-subtitle>
        </pui-card-header>
        <pui-card-content>
          Layered image shadows, soft edge fading, and smooth zoom transitions on hover.
        </pui-card-content>
      </pui-card>
    `,
    props: { image: HERO_IMAGE },
  }),
};

export const ProductCard: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    template: `
      <pui-card class="card-showcase-product" variant="elevated" hoverable imageZoom size="lg">
        <div style="position: relative;">
          <pui-card-image [src]="image" alt="Premium watch product" zoomOnHover aspect="square" />
          <div class="card-showcase-floating-actions">
            <pui-button size="sm" variant="ghost">♡</pui-button>
          </div>
        </div>
        <pui-card-header split>
          <div>
            <pui-card-title>Minimal Watch</pui-card-title>
            <pui-card-subtitle>Stainless steel · Swiss movement</pui-card-subtitle>
          </div>
          <pui-card-badge variant="primary" pill>-20%</pui-card-badge>
        </pui-card-header>
        <pui-card-content>
          <div class="pui-card__price">
            <span class="pui-card__price-current">$249</span>
            <span class="pui-card__price-compare">$309</span>
          </div>
        </pui-card-content>
        <pui-card-footer>
          <div class="card-showcase-product-actions">
            <pui-button size="sm">Add to cart</pui-button>
            <pui-button size="sm" variant="outline">Quick view</pui-button>
          </div>
        </pui-card-footer>
      </pui-card>
    `,
    props: { image: PRODUCT_IMAGE },
  }),
};

export const PricingCard: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    template: `
      <div class="card-showcase-stage">
        <div class="card-showcase-pricing">
          <pui-card class="card-showcase-pricing-side" variant="outlined" hoverable size="lg">
            <pui-card-header>
              <pui-card-title>Starter</pui-card-title>
              <pui-card-subtitle>For individuals</pui-card-subtitle>
            </pui-card-header>
            <pui-card-content>
              <div class="pui-card__price-block">
                <div class="pui-card__price">
                  <p class="pui-card__price-amount">$19</p>
                  <span class="pui-card__price-period">/ month</span>
                </div>
              </div>
              <ul class="pui-card__feature-list">
                <li>5 projects</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
            </pui-card-content>
            <pui-card-footer>
              <div class="card-showcase-cta-footer">
                <pui-button variant="outline">Choose plan</pui-button>
              </div>
            </pui-card-footer>
          </pui-card>

          <pui-card class="card-showcase-pricing-featured" variant="gradient" highlighted hoverable size="lg">
            <pui-card-header split>
              <div>
                <pui-card-title>Pro</pui-card-title>
                <pui-card-subtitle>For growing teams</pui-card-subtitle>
              </div>
              <pui-card-badge variant="primary" pill>Popular</pui-card-badge>
            </pui-card-header>
            <pui-card-content>
              <div class="pui-card__price-block">
                <div class="pui-card__price">
                  <p class="pui-card__price-amount">$49</p>
                  <span class="pui-card__price-period">/ month</span>
                </div>
              </div>
              <ul class="pui-card__feature-list">
                <li>Unlimited projects</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
                <li>Custom integrations</li>
              </ul>
            </pui-card-content>
            <pui-card-footer>
              <div class="card-showcase-cta-footer">
                <pui-button>Choose plan</pui-button>
              </div>
            </pui-card-footer>
          </pui-card>

          <pui-card class="card-showcase-pricing-side" variant="elevated" hoverable size="lg">
            <pui-card-header>
              <pui-card-title>Enterprise</pui-card-title>
              <pui-card-subtitle>For large organizations</pui-card-subtitle>
            </pui-card-header>
            <pui-card-content>
              <div class="pui-card__price-block">
                <p class="pui-card__price-amount">Custom</p>
              </div>
              <ul class="pui-card__feature-list">
                <li>Dedicated infrastructure</li>
                <li>SSO &amp; audit logs</li>
                <li>24/7 support</li>
              </ul>
            </pui-card-content>
            <pui-card-footer>
              <div class="card-showcase-cta-footer">
                <pui-button variant="outline">Contact sales</pui-button>
              </div>
            </pui-card-footer>
          </pui-card>
        </div>
      </div>
    `,
  }),
};

export const DashboardAnalytics: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    template: `
      <div class="card-showcase-stage">
        <div class="card-showcase-dashboard">
          @for (metric of metrics; track metric.label; let i = $index) {
            <pui-card variant="elevated" hoverable size="lg">
              <pui-card-header split>
                <span class="pui-card__metric-label">{{ metric.label }}</span>
                <pui-card-badge [variant]="metric.trend > 0 ? 'success' : 'warning'" pill>
                  {{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
                </pui-card-badge>
              </pui-card-header>
              <pui-card-content>
                <div class="pui-card__metric-group">
                  <p
                    class="pui-card__metric"
                    [class.pui-card__metric--display]="i === 0"
                  >{{ metric.value }}</p>
                  <span
                    class="pui-card__metric-trend"
                    [class.pui-card__metric-trend--positive]="metric.trend > 0"
                    [class.pui-card__metric-trend--negative]="metric.trend <= 0"
                  >
                    {{ metric.trend > 0 ? '↑' : '↓' }} {{ metric.caption }}
                  </span>
                </div>
                <div class="pui-card__chart" aria-hidden="true"></div>
              </pui-card-content>
            </pui-card>
          }
        </div>
      </div>
    `,
    props: {
      metrics: [
        { label: 'MRR', value: '$84,320', trend: 12, caption: 'vs last month' },
        { label: 'Active users', value: '12,480', trend: 8, caption: 'weekly active' },
        { label: 'Churn', value: '2.1%', trend: -3, caption: 'improved retention' },
      ],
    },
  }),
};

export const FeatureCard: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    template: `
      <pui-card class="card-showcase-narrow" variant="glass" hoverable size="lg">
        <div class="pui-card__icon" aria-hidden="true">✦</div>
        <pui-card-title>Enterprise security</pui-card-title>
        <pui-card-content>
          SOC2-ready infrastructure with subtle glass surfaces, layered highlights, and premium depth.
        </pui-card-content>
        <pui-card-footer>
          <pui-button variant="ghost" size="sm">Learn more →</pui-button>
        </pui-card-footer>
      </pui-card>
    `,
  }),
};

export const MediaCard: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    template: `
      <pui-card class="card-showcase-media" variant="elevated" hoverable imageZoom interactive size="lg">
        <pui-card-image
          [src]="image"
          alt="Cinematic movie poster"
          aspect="portrait"
          overlay
          gradientOverlay
          cinema
          zoomOnHover
        >
          <div class="card-showcase-chip-row">
            <span class="card-showcase-chip">4K</span>
            <span class="card-showcase-chip">HDR</span>
          </div>
        </pui-card-image>
        <pui-card-header>
          <pui-card-title>Neon Horizon</pui-card-title>
          <pui-card-subtitle>Sci-fi · 2h 14m · ★ 8.7</pui-card-subtitle>
        </pui-card-header>
        <pui-card-content>
          Dark cinematic overlays with gradient fade and immersive poster presentation.
        </pui-card-content>
      </pui-card>
    `,
    props: { image: MOVIE_IMAGE },
  }),
};

export const HorizontalLayout: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    template: `
      <pui-card class="card-showcase-wide" layout="horizontal" variant="elevated" hoverable size="lg">
        <pui-card-image [src]="image" alt="Workspace" aspect="square" position="left" zoomOnHover />
        <div>
          <pui-card-header>
            <pui-card-title>Horizontal card</pui-card-title>
            <pui-card-subtitle>Editorial layout with cinematic media</pui-card-subtitle>
          </pui-card-header>
          <pui-card-content>
            Ideal for list views, product rows, and premium admin panels with asymmetric spacing.
          </pui-card-content>
          <pui-card-footer>
            <pui-button size="sm" variant="ghost">Read more →</pui-button>
          </pui-card-footer>
        </div>
      </pui-card>
    `,
    props: { image: HERO_IMAGE },
  }),
};

export const LoadingSkeleton: Story = {
  args: { loading: true, variant: 'elevated' },
  render: (args) => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    props: args,
    template: `<pui-card class="card-showcase-narrow" [loading]="loading" [variant]="variant"></pui-card>`,
  }),
};

export const GlassPremium: Story = {
  render: () => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    template: `
      <div class="card-showcase-glass-stage">
        <pui-card class="card-showcase-narrow" variant="glass" hoverable size="lg">
          <pui-card-header split>
            <div>
              <pui-card-title>Glass surface</pui-card-title>
              <pui-card-subtitle>Subtle blur · layered highlights</pui-card-subtitle>
            </div>
            <pui-card-badge variant="primary" pill>New</pui-card-badge>
          </pui-card-header>
          <pui-card-content>
            Elegant glassmorphism with premium depth, semi-transparent borders, and soft ambient shadows.
          </pui-card-content>
          <pui-card-footer>
            <pui-button size="sm">Get started</pui-button>
          </pui-card-footer>
        </pui-card>
      </div>
    `,
  }),
};

export const Playground: Story = {
  args: { variant: 'elevated', hoverable: true, imageZoom: true, size: 'lg' },
  render: (args) => ({
    moduleMetadata: { imports: CARD_IMPORTS },
    styles: ['./card.stories.scss'],
    props: args,
    template: `
      <pui-card
        class="card-showcase-narrow"
        [variant]="variant"
        [size]="size"
        [layout]="layout"
        [hoverable]="hoverable"
        [interactive]="interactive"
        [loading]="loading"
        [highlighted]="highlighted"
        [imageZoom]="imageZoom"
      >
        <pui-card-header>
          <pui-card-title>Playground</pui-card-title>
          <pui-card-subtitle>Adjust controls in Storybook</pui-card-subtitle>
        </pui-card-header>
        <pui-card-content>Premium composable card primitives for production SaaS UIs.</pui-card-content>
      </pui-card>
    `,
  }),
};
