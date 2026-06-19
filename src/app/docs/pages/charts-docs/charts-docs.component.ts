import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import {
  PuiBarChartComponent,
  PuiFunnelChartComponent,
  PuiGaugeChartComponent,
  PuiHeatmapChartComponent,
  PuiLineChartComponent,
  PuiPieChartComponent,
  PuiRadarChartComponent,
  PuiScatterChartComponent,
  PuiSparklineComponent,
  PuiTreemapChartComponent,
  DEMO_MULTI_SERIES_DATA,
  DEMO_REVENUE_DATA,
  type PuiBarChartConfig,
  type PuiChartData,
  type PuiFunnelChartConfig,
  type PuiGaugeChartConfig,
  type PuiHeatmapChartConfig,
  type PuiLineChartConfig,
  type PuiPieChartConfig,
  type PuiRadarChartConfig,
  type PuiScatterChartConfig,
  type PuiSparklineConfig,
  type PuiTreemapChartConfig,
} from '@premium-ui/charts';
import { PuiCheckboxComponent } from '../../../../premium-ui/components/checkbox';
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectValue } from '../../../../premium-ui/components/select/select.types';
import type { PuiDocApiRow, PuiDocA11yItem, PuiDocCodeTab, PuiDocsTab } from '../../docs.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocExampleComponent,
  PuiDocInstallationComponent,
  PuiDocRelatedLinksComponent,
  buildHtmlTsTabs,
  buildThemeTabs,
  toSelectOptions,
} from '../../shared';
import { useDocsPageSeo } from '../../seo/use-docs-page-seo';
import { getRelatedLinks } from '../../seo/docs-seo.service';
import { CHART_DOC_DATASETS } from './charts-docs.data';
import {
  CHARTS_DOC_TABS,
  CHARTS_SIDEBAR_ITEMS,
  isChartTypeSlug,
  resolveChartsDocTab,
} from './charts-docs.nav';
import {
  findChartDocPage,
  type PuiChartDocKind,
  type PuiChartProgressiveExample,
} from './charts-docs.registry';

type PuiDocsChartsDocTab = 'overview' | 'api' | 'accessibility' | 'theming' | 'playground';

const LINE_CHART = { name: 'PuiLineChartComponent', path: '@premium-ui/charts' } as const;
const BAR_CHART = { name: 'PuiBarChartComponent', path: '@premium-ui/charts' } as const;

@Component({
  selector: 'app-charts-docs',
  imports: [
    PuiLineChartComponent,
    PuiBarChartComponent,
    PuiPieChartComponent,
    PuiScatterChartComponent,
    PuiRadarChartComponent,
    PuiHeatmapChartComponent,
    PuiTreemapChartComponent,
    PuiFunnelChartComponent,
    PuiGaugeChartComponent,
    PuiSparklineComponent,
    PuiCheckboxComponent,
    PuiSelectComponent,
    PuiDocApiTableComponent,
    PuiDocA11yListComponent,
    PuiDocExampleComponent,
    PuiDocInstallationComponent,
    PuiDocRelatedLinksComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './charts-docs.component.html',
  styleUrl: './charts-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsDocsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly routeSlug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? 'doc')),
    { initialValue: 'doc' }
  );

  protected readonly slug = this.routeSlug;

  protected readonly activePage = computed(() => {
    const slug = this.routeSlug();
    return isChartTypeSlug(slug) ? findChartDocPage(slug) ?? null : null;
  });

  protected readonly isChartPage = computed(() => this.activePage() != null);

  protected readonly isConfigPlayground = computed(
    () => this.routeSlug() === 'configuration-playground'
  );

  protected readonly isDocPage = computed(
    () => !this.isChartPage() && !this.isConfigPlayground()
  );

  protected readonly currentDocTab = computed<PuiDocsChartsDocTab>(() => {
    const tab = resolveChartsDocTab(this.routeSlug());
    return this.isDocsDocTab(tab) ? tab : 'overview';
  });

  protected readonly seoTab = computed(() => {
    const slug = this.routeSlug();
    if (isChartTypeSlug(slug)) {
      return slug;
    }
    if (slug === 'configuration-playground') {
      return 'configuration-playground';
    }
    if (slug === 'doc' || slug === 'overview') {
      return 'doc';
    }
    return resolveChartsDocTab(slug);
  });

  protected readonly docTabs: readonly PuiDocsTab[] = CHARTS_DOC_TABS.map((tab) => ({
    label: tab.label,
    route: [`/docs/components/charts/${tab.slug}`],
  }));

  protected readonly chartNavItems = CHARTS_SIDEBAR_ITEMS.filter(
    (item) => item.label !== 'Documentation' && item.label !== 'Configuration Playground'
  );

  protected readonly relatedLinks = getRelatedLinks('charts');

  protected readonly revenueData = DEMO_REVENUE_DATA;
  protected readonly multiSeriesData = DEMO_MULTI_SERIES_DATA;

  protected readonly realtimeData = signal<PuiChartData>([
    { category: '00:00', value: 18200 },
  ]);

  protected readonly playgroundLegendPosition = signal<'top' | 'bottom' | 'left' | 'right'>('top');
  protected readonly playgroundTooltip = signal(true);
  protected readonly playgroundAnimation = signal(true);
  protected readonly playgroundGrid = signal(true);
  protected readonly playgroundDarkMode = signal(false);
  protected readonly playgroundSmooth = signal(true);
  protected readonly playgroundArea = signal(false);
  protected readonly playgroundDataLabels = signal(false);

  protected readonly legendPositionOptions = toSelectOptions([
    'top',
    'bottom',
    'left',
    'right',
  ] as const);

  protected readonly playgroundConfig = computed(
    (): PuiLineChartConfig => ({
      xField: 'category',
      yField: 'value',
      variant: this.playgroundArea() ? 'area' : 'line',
      showDataLabels: this.playgroundDataLabels(),
      theme: this.playgroundDarkMode() ? 'dark' : 'light',
      colors: ['#635bff', '#22c55e', '#f59e0b'],
      legend: { show: true, position: this.playgroundLegendPosition() },
      tooltip: { enabled: this.playgroundTooltip() },
      grid: { show: this.playgroundGrid() },
      animation: { enabled: this.playgroundAnimation(), duration: 900 },
      appearance: {
        smooth: this.playgroundSmooth(),
        gradient: this.playgroundArea(),
      },
    })
  );

  protected readonly chartApiRows: readonly PuiDocApiRow[] = [
    { name: 'data', type: 'PuiChartData', defaultValue: '[]', description: 'Chart dataset rows.' },
    {
      name: 'config',
      type: 'Pui*ChartConfig',
      defaultValue: 'premium defaults',
      description: 'Appearance, axis, interaction, theme, and formatters.',
    },
    { name: 'height', type: 'number', defaultValue: '320', description: 'Minimum chart height in pixels.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows loading shimmer overlay.' },
    {
      name: 'ariaLabel',
      type: 'string | null',
      defaultValue: 'null',
      description: 'Accessible name for the visualization.',
    },
  ];

  protected readonly componentApiRows: readonly PuiDocApiRow[] = [
    { name: 'pui-line-chart', type: 'component', defaultValue: '—', description: 'Line and area trends — smooth, gradient, zoom, threshold via config.' },
    { name: 'pui-bar-chart', type: 'component', defaultValue: '—', description: 'Column, horizontal, grouped, stacked, and 100% stacked via config.' },
    { name: 'pui-pie-chart', type: 'component', defaultValue: '—', description: 'Pie and donut variants, semi-circle, center labels via config.' },
    { name: 'pui-scatter-chart', type: 'component', defaultValue: '—', description: 'Scatter and bubble charts with optional regression line.' },
    { name: 'pui-radar-chart', type: 'component', defaultValue: '—', description: 'Multi-axis comparison with optional filled area.' },
    { name: 'pui-heatmap-chart', type: 'component', defaultValue: '—', description: 'Two-dimensional intensity grid.' },
    { name: 'pui-treemap-chart', type: 'component', defaultValue: '—', description: 'Hierarchical proportion blocks, nested mode via config.' },
    { name: 'pui-funnel-chart', type: 'component', defaultValue: '—', description: 'Conversion funnel stages.' },
    { name: 'pui-gauge-chart', type: 'component', defaultValue: '—', description: 'Circular, semi, KPI, and multi-segment gauges.' },
    { name: 'pui-sparkline', type: 'component', defaultValue: '—', description: 'Inline line, area, or bar sparkline.' },
  ];

  protected readonly configApiRows: readonly PuiDocApiRow[] = [
    { name: 'responsive', type: 'boolean', defaultValue: 'true', description: 'Resize chart with container.' },
    { name: 'colors', type: 'string[]', defaultValue: 'theme palette', description: 'Series color palette override.' },
    { name: 'legend.show', type: 'boolean', defaultValue: 'true', description: 'Legend visibility.' },
    { name: 'legend.position', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'top'", description: 'Legend placement.' },
    { name: 'tooltip.enabled', type: 'boolean', defaultValue: 'true', description: 'Interactive tooltip.' },
    { name: 'grid.show', type: 'boolean', defaultValue: 'true', description: 'Cartesian grid lines.' },
    { name: 'animation.enabled', type: 'boolean', defaultValue: 'true', description: 'Entry and update animations.' },
    { name: 'animation.duration', type: 'number', defaultValue: '900', description: 'Entry animation duration in ms. Data updates animate at ~65% of this value.' },
    { name: 'theme', type: "'light' | 'dark'", defaultValue: "'light'", description: 'Chart theme preset.' },
    { name: 'appearance.smooth', type: 'boolean', defaultValue: 'true', description: 'Spline interpolation for line charts.' },
    { name: 'variant', type: "'line' | 'area'", defaultValue: "'line'", description: 'Line chart fill mode.' },
    { name: 'mode', type: "'grouped' | 'stacked' | 'stacked100'", defaultValue: "'grouped'", description: 'Bar chart stacking mode.' },
  ];

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Role and label', description: 'Charts expose role="img" with aria-label and aria-busy during loading.' },
    { title: 'Keyboard navigation', description: 'Tooltip and legend interactions inherit ECharts keyboard support; prefer complementary data tables for critical workflows.' },
    { title: 'Reduced motion', description: 'Respects prefers-reduced-motion for shimmer and transitions.' },
    { title: 'Color contrast', description: 'All colors resolve from Premium UI tokens — no hardcoded chart colors in components.' },
  ];

  protected readonly installTabs: readonly PuiDocCodeTab[] = [
    {
      id: 'bash',
      label: 'Install',
      language: 'bash',
      filename: 'terminal',
      code: 'npm install @premium-ui/charts echarts',
    },
    {
      id: 'ts',
      label: 'Bootstrap',
      language: 'typescript',
      filename: 'app.config.ts',
      code: `import { ApplicationConfig } from '@angular/core';
import { providePuiCharts } from '@premium-ui/charts';

export const appConfig: ApplicationConfig = {
  providers: [providePuiCharts()],
};`,
    },
    {
      id: 'scss',
      label: 'Styles',
      language: 'scss',
      filename: 'styles.scss',
      code: `@use '@premium-ui/charts/styles/chart.tokens';`,
    },
  ];

  protected readonly basicExampleTabs: readonly PuiDocCodeTab[] = buildHtmlTsTabs(
    `<pui-line-chart [data]="revenueData" [height]="320" ariaLabel="Monthly revenue line chart" />`,
    {
      selector: 'app-revenue-chart',
      componentClass: 'RevenueChartComponent',
      imports: [LINE_CHART],
      members: [
        "protected readonly revenueData = [{ category: 'Jan', value: 18200 }, { category: 'Feb', value: 21400 }];",
      ],
    }
  );

  protected readonly configExampleTabs: readonly PuiDocCodeTab[] = buildHtmlTsTabs(
    `<pui-bar-chart [data]="sales" [config]="chartConfig" [height]="320" />`,
    {
      selector: 'app-sales-chart',
      componentClass: 'SalesChartComponent',
      imports: [BAR_CHART],
      members: [
        `protected readonly chartConfig: PuiBarChartConfig = {
  xField: 'category',
  yField: 'value',
  colors: ['#635bff', '#22c55e'],
  legend: { show: true, position: 'top' },
  tooltip: { enabled: true },
  grid: { show: true },
  animation: { enabled: true, duration: 900 },
  theme: 'light',
};`,
      ],
    }
  );

  protected readonly themeTabs = buildThemeTabs(`:root {
  --pui-chart-color-1: var(--pui-color-primary);
  --pui-chart-grid: color-mix(in srgb, var(--pui-color-border) 65%, transparent);
  --pui-chart-tooltip-bg: var(--pui-color-surface-elevated);
  --pui-chart-radius: var(--pui-radius-md);
}`);

  constructor() {
    useDocsPageSeo({ slug: 'charts', tab: this.seoTab });

    effect((onCleanup) => {
      if (this.activePage()?.slug !== 'line-chart') {
        return;
      }

      const timer = setInterval(() => {
        this.realtimeData.update((current) => {
          const last = current.at(-1);
          const nextValue =
            ((last?.['value'] as number | undefined) ?? 18000) +
            Math.round(Math.random() * 800 - 200);
          return [
            ...current.slice(-11),
            { category: new Date().toLocaleTimeString(), value: nextValue },
          ];
        });
      }, 2000);

      onCleanup(() => clearInterval(timer));
    });
  }

  protected exampleTabs(example: PuiChartProgressiveExample): readonly PuiDocCodeTab[] {
    return [
      {
        id: 'html',
        label: 'HTML',
        code: example.html.trim(),
        language: 'html',
        filename: `${example.id}.component.html`,
      },
      {
        id: 'ts',
        label: 'TypeScript',
        code: example.typescript.trim(),
        language: 'typescript',
        filename: `${example.id}.component.ts`,
      },
      {
        id: 'config',
        label: 'Config',
        code: example.configJson.trim(),
        language: 'json',
        filename: `${example.id}.config.json`,
      },
    ];
  }

  protected exampleData(example: PuiChartProgressiveExample): PuiChartData {
    if (example.id === 'line-realtime') {
      return this.realtimeData();
    }
    return CHART_DOC_DATASETS[example.dataVar] ?? DEMO_REVENUE_DATA;
  }

  protected exampleConfig<T>(example: PuiChartProgressiveExample): T {
    return example.config as T;
  }

  protected exampleHeight(kind: PuiChartDocKind): number {
    return kind === 'sparkline' ? 48 : 320;
  }

  protected setPlaygroundLegendPosition(value: PuiSelectValue): void {
    if (value === 'top' || value === 'bottom' || value === 'left' || value === 'right') {
      this.playgroundLegendPosition.set(value);
    }
  }

  private isDocsDocTab(tab: string): tab is PuiDocsChartsDocTab {
    return tab === 'overview' || tab === 'api' || tab === 'accessibility' || tab === 'theming' || tab === 'playground';
  }
}
