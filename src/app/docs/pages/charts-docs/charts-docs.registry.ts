const PKG = '@premium-ui/charts';

export type PuiChartDocKind =
  | 'line'
  | 'bar'
  | 'pie'
  | 'scatter'
  | 'radar'
  | 'heatmap'
  | 'treemap'
  | 'funnel'
  | 'gauge'
  | 'sparkline';

export interface PuiChartDocOverview {
  what: string;
  whenToUse: string;
  bestPractices: readonly string[];
  accessibility: readonly string[];
  performance: readonly string[];
}

export interface PuiChartProgressiveExample {
  id: string;
  title: string;
  whatChanged: string;
  description: string;
  html: string;
  typescript: string;
  configJson: string;
  config: Record<string, unknown>;
  dataVar: string;
}

export interface PuiChartDocPage {
  slug: string;
  title: string;
  kind: PuiChartDocKind;
  overview: PuiChartDocOverview;
  examples: readonly PuiChartProgressiveExample[];
}

function prettifyConfig(config: Record<string, unknown>): string {
  return JSON.stringify(config, null, 2);
}

function toClassName(id: string): string {
  return id
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function buildExample(
  id: string,
  title: string,
  whatChanged: string,
  description: string,
  tag: string,
  component: string,
  typeImports: string,
  dataName: string,
  configName: string,
  configType: string,
  dataCode: string,
  config: Record<string, unknown>,
  htmlExtra = '',
  configJsonOverride?: string,
  htmlOverride?: string,
): PuiChartProgressiveExample {
  const selector = `app-${id}`;
  const className = toClassName(id);
  const configCode = JSON.stringify(config, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `  ${line}`))
    .join('\n');

  return {
    id,
    title,
    whatChanged,
    description,
    html: htmlOverride ?? `<${tag}
  [data]="${dataName}"
  [config]="${configName}"${htmlExtra ? `\n  ${htmlExtra}` : ''}
/>`,
    typescript: `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ${component}, ${typeImports} } from '${PKG}';

@Component({
  selector: '${selector}',
  imports: [${component}],
  templateUrl: './${selector}.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${className}Component {
${dataCode}

  protected readonly ${configName}: ${configType} = ${configCode};
}`,
    configJson: configJsonOverride ?? prettifyConfig(config),
    config,
    dataVar: dataName,
  };
}

const REVENUE_DATA = `  protected readonly revenueData: PuiChartData = [
    { category: 'Jan', value: 18200 },
    { category: 'Feb', value: 21400 },
    { category: 'Mar', value: 19800 },
    { category: 'Apr', value: 24500 },
    { category: 'May', value: 26800 },
    { category: 'Jun', value: 29100 },
  ];`;

const MULTI_SERIES_DATA = `  protected readonly salesData: PuiChartData = [
    { category: 'Jan', value: 120, series: 'Direct' },
    { category: 'Feb', value: 132, series: 'Direct' },
    { category: 'Mar', value: 101, series: 'Direct' },
    { category: 'Jan', value: 220, series: 'Organic' },
    { category: 'Feb', value: 182, series: 'Organic' },
    { category: 'Mar', value: 191, series: 'Organic' },
  ];`;

const PIE_DATA = `  protected readonly planData: PuiChartData = [
    { label: 'Enterprise', value: 38 },
    { label: 'Pro', value: 32 },
    { label: 'Starter', value: 22 },
    { label: 'Free', value: 8 },
  ];`;

const SCATTER_DATA = `  protected readonly scatterData: PuiChartData = [
    { x: 12, y: 44, series: 'Alpha' },
    { x: 18, y: 52, series: 'Alpha' },
    { x: 24, y: 48, series: 'Alpha' },
    { x: 14, y: 38, series: 'Beta' },
    { x: 22, y: 55, series: 'Beta' },
    { x: 28, y: 49, series: 'Beta' },
  ];`;

const BUBBLE_DATA = `  protected readonly bubbleData: PuiChartData = [
    { x: 18, y: 42, size: 24, series: 'NA' },
    { x: 26, y: 58, size: 36, series: 'NA' },
    { x: 16, y: 36, size: 28, series: 'EU' },
    { x: 28, y: 62, size: 44, series: 'EU' },
  ];`;

const RADAR_DATA = `  protected readonly radarData: PuiChartData = [
    { label: 'Speed', value: 82, series: 'Team A' },
    { label: 'Quality', value: 91, series: 'Team A' },
    { label: 'Reliability', value: 76, series: 'Team A' },
    { label: 'Speed', value: 74, series: 'Team B' },
    { label: 'Quality', value: 85, series: 'Team B' },
    { label: 'Reliability', value: 92, series: 'Team B' },
  ];`;

const HEATMAP_ACTIVITY_DATA = `  protected readonly activityData: PuiChartData = [
    { x: 'Mon', y: 'Morning', value: 12 },
    { x: 'Mon', y: 'Afternoon', value: 28 },
    { x: 'Mon', y: 'Evening', value: 18 },
    { x: 'Tue', y: 'Morning', value: 16 },
    { x: 'Tue', y: 'Afternoon', value: 34 },
    { x: 'Tue', y: 'Evening', value: 22 },
  ];`;

const HEATMAP_CORRELATION_DATA = `  protected readonly correlationData: PuiChartData = [
    { x: 'Revenue', y: 'Revenue', value: 1.0 },
    { x: 'Revenue', y: 'Churn', value: -0.62 },
    { x: 'Revenue', y: 'NPS', value: 0.74 },
    { x: 'Churn', y: 'Revenue', value: -0.62 },
    { x: 'Churn', y: 'Churn', value: 1.0 },
    { x: 'Churn', y: 'NPS', value: -0.48 },
    { x: 'NPS', y: 'Revenue', value: 0.74 },
    { x: 'NPS', y: 'Churn', value: -0.48 },
    { x: 'NPS', y: 'NPS', value: 1.0 },
  ];`;

const HEATMAP_REVENUE_DATA = `  protected readonly revenueHeatmapData: PuiChartData = [
    { x: 'NA', y: 'Q1', value: 420 },
    { x: 'NA', y: 'Q2', value: 480 },
    { x: 'EU', y: 'Q1', value: 310 },
    { x: 'EU', y: 'Q2', value: 350 },
    { x: 'APAC', y: 'Q1', value: 260 },
    { x: 'APAC', y: 'Q2', value: 295 },
  ];`;

const TREEMAP_DATA = `  protected readonly departmentData: PuiChartData = [
    { label: 'Engineering', value: 42 },
    { label: 'Design', value: 18 },
    { label: 'Product', value: 24 },
    { label: 'Marketing', value: 16 },
    { label: 'Sales', value: 20 },
  ];`;

const TREEMAP_NESTED_DATA = `  protected readonly portfolioData: PuiChartData = [
    { label: 'Cloud', value: 48, parent: 'Infrastructure' },
    { label: 'Edge', value: 22, parent: 'Infrastructure' },
    { label: 'Analytics', value: 36, parent: 'Platform' },
    { label: 'Workflows', value: 28, parent: 'Platform' },
  ];`;

const FUNNEL_DATA = `  protected readonly funnelData: PuiChartData = [
    { label: 'Visitors', value: 12000 },
    { label: 'Signups', value: 4200 },
    { label: 'Activated', value: 2100 },
    { label: 'Paid', value: 860 },
  ];`;

const GAUGE_DATA = `  protected readonly gaugeData: PuiChartData = [{ value: 72 }];`;

const SPARKLINE_DATA = `  protected readonly sparklineData: PuiChartData = [
    { value: 12 }, { value: 18 }, { value: 14 }, { value: 22 },
    { value: 19 }, { value: 26 }, { value: 24 }, { value: 31 },
  ];`;

const RANKING_DATA = `  protected readonly rankingData: PuiChartData = [
    { category: 'Stripe', value: 98 },
    { category: 'Linear', value: 86 },
    { category: 'Notion', value: 74 },
    { category: 'Vercel', value: 68 },
  ];`;

const LINE_OVERVIEW: PuiChartDocOverview = {
  what: 'A trend chart that connects data points over a continuous axis. Supports line and area variants, multi-series, thresholds, and zoom via config.',
  whenToUse: 'Use for time-series, KPI trends, and any metric that changes along a continuous dimension.',
  bestPractices: [
    'Limit series count to 4–5 for readability.',
    'Use area variant for volume or cumulative emphasis.',
    'Enable zoom only when users need to inspect dense datasets.',
    'Provide ariaLabel for screen-reader context.',
  ],
  accessibility: [
    'Set ariaLabel describing the chart purpose and metric.',
    'Ensure sufficient color contrast for lines and labels.',
    'Do not rely on color alone — use markers or patterns when comparing series.',
  ],
  performance: [
    'Prefer downsampling or aggregation for datasets above ~2 000 points.',
    'Disable animation for realtime updates to reduce repaint cost.',
    'Use OnPush change detection in parent components.',
  ],
};

const BAR_OVERVIEW: PuiChartDocOverview = {
  what: 'A comparison chart for categorical data. Orientation, grouping, stacking, and 100% stacking are config-driven — no separate column or horizontal components.',
  whenToUse: 'Use for category comparisons, rankings, stacked totals, and part-to-whole across categories.',
  bestPractices: [
    'Use horizontal orientation for long category labels.',
    'Choose stacked mode when showing composition within each category.',
    'Use stacked100 for proportional comparisons.',
    'Round bar corners sparingly for a polished look.',
  ],
  accessibility: [
    'Provide ariaLabel summarizing the comparison being shown.',
    'Ensure data labels meet contrast requirements when enabled.',
    'Keep category labels legible — rotate or switch to horizontal bars if needed.',
  ],
  performance: [
    'Avoid animating large stacked datasets on every render.',
    'Limit categories to ~30 bars per view for clarity and paint performance.',
  ],
};

const PIE_OVERVIEW: PuiChartDocOverview = {
  what: 'A part-to-whole chart for proportional breakdowns. Pie and donut variants, semi-circle, center labels, and legend position are all config-driven.',
  whenToUse: 'Use when showing composition of a whole with 2–6 segments. Prefer bar charts for precise comparisons.',
  bestPractices: [
    'Limit slices to six or fewer for readability.',
    'Use donut variant with center labels for key totals.',
    'Place legend where it does not obscure the chart.',
    'Avoid pie charts when precise value comparison is required.',
  ],
  accessibility: [
    'Provide ariaLabel describing the breakdown being shown.',
    'Ensure legend text and slice labels meet contrast requirements.',
    'Supplement with a data table for exact values when possible.',
  ],
  performance: [
    'Pie charts are lightweight — animation is the main cost.',
    'Disable hover expansion effects on low-powered devices if needed.',
  ],
};

const SCATTER_OVERVIEW: PuiChartDocOverview = {
  what: 'A relationship chart plotting x/y coordinates. Bubble mode is enabled via sizeField; regression lines via showRegression.',
  whenToUse: 'Use for correlation analysis, clustering, and distributions across two (or three with bubble size) dimensions.',
  bestPractices: [
    'Use consistent marker sizes and opacities across series.',
    'Enable regression only when a linear trend is meaningful.',
    'Label axes clearly via axis config.',
    'Use bubble size for a meaningful third dimension, not decoration.',
  ],
  accessibility: [
    'Provide ariaLabel describing the relationship being plotted.',
    'Use distinct series colors with sufficient contrast.',
    'Offer a data table alternative for precise point values.',
  ],
  performance: [
    'Scatter plots with thousands of points benefit from canvas rendering (default).',
    'Disable regression for very large datasets.',
  ],
};

const RADAR_OVERVIEW: PuiChartDocOverview = {
  what: 'A multi-axis comparison chart for evaluating entities across several dimensions. Filled area mode is config-driven.',
  whenToUse: 'Use for skill matrices, product feature parity, and multi-metric entity comparisons.',
  bestPractices: [
    'Keep axes to 5–8 for readability.',
    'Use filled mode to emphasize area coverage.',
    'Normalize values to a common scale when comparing entities.',
  ],
  accessibility: [
    'Provide ariaLabel describing the dimensions being compared.',
    'Ensure series colors are distinguishable.',
  ],
  performance: [
    'Radar charts are low-overhead — suitable for dashboard tiles.',
  ],
};

const HEATMAP_OVERVIEW: PuiChartDocOverview = {
  what: 'A two-dimensional intensity grid mapping values to color across x and y categories.',
  whenToUse: 'Use for activity calendars, correlation matrices, and regional revenue grids.',
  bestPractices: [
    'Choose a sequential color scale for magnitude data.',
    'Use diverging scales for correlation (-1 to 1).',
    'Provide axis labels that describe both dimensions clearly.',
  ],
  accessibility: [
    'Provide ariaLabel describing the grid dimensions and metric.',
    'Ensure color scale has sufficient luminance contrast between extremes.',
    'Supplement with exact values via tooltips or tables.',
  ],
  performance: [
    'Heatmaps handle hundreds of cells efficiently.',
    'Avoid animating large grids on initial render.',
  ],
};

const TREEMAP_OVERVIEW: PuiChartDocOverview = {
  what: 'A hierarchical proportion chart where rectangle area encodes value. Nested mode groups child nodes under parents.',
  whenToUse: 'Use for portfolio allocation, budget breakdowns, and hierarchical resource distribution.',
  bestPractices: [
    'Limit top-level groups to 6–8 for clarity.',
    'Use nested mode when a parent-child hierarchy exists.',
    'Label only segments large enough to fit text.',
  ],
  accessibility: [
    'Provide ariaLabel describing the hierarchy and metric.',
    'Ensure adjacent segment colors are distinguishable.',
  ],
  performance: [
    'Treemaps scale well to dozens of nodes.',
    'Avoid deep nesting beyond 2–3 levels.',
  ],
};

const FUNNEL_OVERVIEW: PuiChartDocOverview = {
  what: 'A staged conversion chart showing drop-off between sequential steps.',
  whenToUse: 'Use for signup funnels, sales pipelines, and onboarding step analysis.',
  bestPractices: [
    'Order stages from widest to narrowest.',
    'Use valueFormatter for readable counts or percentages.',
    'Keep stages to 4–6 for clarity.',
  ],
  accessibility: [
    'Provide ariaLabel describing the funnel stages.',
    'Ensure stage labels and values meet contrast requirements.',
  ],
  performance: [
    'Funnel charts are lightweight with few data points.',
  ],
};

const GAUGE_OVERVIEW: PuiChartDocOverview = {
  what: 'A single-value indicator with circular, semi-circular, KPI, and multi-segment variants driven by config.',
  whenToUse: 'Use for SLA scores, utilization percentages, and dashboard KPI tiles.',
  bestPractices: [
    'Set min and max to meaningful bounds for the metric.',
    'Use KPI variant for large numeric displays.',
    'Use semi variant when space is constrained horizontally.',
  ],
  accessibility: [
    'Provide ariaLabel with the current value and metric name.',
    'Ensure the gauge arc and pointer meet contrast requirements.',
  ],
  performance: [
    'Gauges are ideal for realtime dashboards — minimal repaint cost.',
  ],
};

const SPARKLINE_OVERVIEW: PuiChartDocOverview = {
  what: 'A compact inline chart for tables, cards, and KPI rows. Supports line, area, and bar variants via config.',
  whenToUse: 'Use when a full chart is too heavy but a quick trend indicator adds context.',
  bestPractices: [
    'Keep sparklines under ~20 data points for clarity.',
    'Match sparkline color to the surrounding metric context.',
    'Choose bar variant for discrete period comparisons.',
  ],
  accessibility: [
    'Provide ariaLabel on the parent element describing the trend.',
    'Do not rely solely on sparkline shape — show the current value nearby.',
  ],
  performance: [
    'Sparklines are optimized for inline rendering in lists and tables.',
  ],
};

const LINE_EXAMPLES: readonly PuiChartProgressiveExample[] = [
  buildExample(
    'line-basic',
    'Basic',
    'Starting point — minimal line chart with default styling.',
    'A simple line chart mapping category to value with premium defaults.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'revenueData',
    'lineConfig',
    'PuiLineChartConfig',
    REVENUE_DATA,
    { xField: 'category', yField: 'value' },
    '[height]="320"',
  ),
  buildExample(
    'line-smooth',
    'Smooth',
    'Added appearance.smooth for curved interpolation.',
    'Smooth curves soften jagged data and improve visual flow.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'revenueData',
    'lineConfig',
    'PuiLineChartConfig',
    REVENUE_DATA,
    { xField: 'category', yField: 'value', appearance: { smooth: true } },
    '[height]="320"',
  ),
  buildExample(
    'line-multi-series',
    'Multi Series',
    'Added seriesField to plot multiple lines from one dataset.',
    'Compare Direct vs Organic channels on the same axis.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'salesData',
    'lineConfig',
    'PuiLineChartConfig',
    MULTI_SERIES_DATA,
    {
      xField: 'category',
      yField: 'value',
      seriesField: 'series',
      appearance: { smooth: true },
      interaction: { tooltip: true, seriesFocus: true },
    },
    '[height]="320"',
  ),
  buildExample(
    'line-area',
    'Area',
    'Switched variant to area to fill the region under the line.',
    'Area charts emphasize volume beneath the trend line.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'revenueData',
    'lineConfig',
    'PuiLineChartConfig',
    REVENUE_DATA,
    { xField: 'category', yField: 'value', variant: 'area' },
    '[height]="300"',
  ),
  buildExample(
    'line-gradient-area',
    'Gradient Area',
    'Combined variant area with appearance.gradient for a filled gradient.',
    'Gradient fills add depth to area charts without extra series.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'revenueData',
    'lineConfig',
    'PuiLineChartConfig',
    REVENUE_DATA,
    {
      xField: 'category',
      yField: 'value',
      variant: 'area',
      appearance: { gradient: true, color: '#635bff' },
    },
    '[height]="300"',
  ),
  buildExample(
    'line-data-labels',
    'Data Labels',
    'Enabled showDataLabels to display values on each point.',
    'Data labels help users read exact values without hovering.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'revenueData',
    'lineConfig',
    'PuiLineChartConfig',
    REVENUE_DATA,
    { xField: 'category', yField: 'value', showDataLabels: true, appearance: { smooth: true } },
    '[height]="320"',
  ),
  buildExample(
    'line-interactive-tooltip',
    'Interactive Tooltip',
    'Enabled tooltip, crosshair, and seriesFocus for rich hover feedback.',
    'Interactive tooltips and crosshairs improve data exploration.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'salesData',
    'lineConfig',
    'PuiLineChartConfig',
    MULTI_SERIES_DATA,
    {
      xField: 'category',
      yField: 'value',
      seriesField: 'series',
      appearance: { smooth: true },
      interaction: { tooltip: true, crosshair: true, seriesFocus: true },
    },
    '[height]="320"',
  ),
  buildExample(
    'line-zoomable',
    'Zoomable',
    'Enabled interaction.zoom for drag-to-zoom on dense datasets.',
    'Zoom lets users inspect detailed regions of long time-series.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'revenueData',
    'lineConfig',
    'PuiLineChartConfig',
    REVENUE_DATA,
    {
      xField: 'category',
      yField: 'value',
      appearance: { smooth: true },
      interaction: { tooltip: true, zoom: true },
    },
    '[height]="320"',
  ),
  buildExample(
    'line-threshold',
    'Threshold',
    'Added threshold and thresholdLabel to mark a target line.',
    'Threshold lines highlight goals, limits, or alert boundaries.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'revenueData',
    'lineConfig',
    'PuiLineChartConfig',
    REVENUE_DATA,
    {
      xField: 'category',
      yField: 'value',
      threshold: 25000,
      thresholdLabel: 'Target',
      appearance: { smooth: true },
    },
    '[height]="320"',
  ),
  buildExample(
    'line-realtime',
    'Realtime',
    'Simulated realtime updates by pushing new data on an interval.',
    'Push updated data arrays to refresh the chart. Animation is disabled for smoother updates.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'revenueData',
    'lineConfig',
    'PuiLineChartConfig',
    `  protected revenueData: PuiChartData = [{ category: '00:00', value: 18200 }];

  // Simulated realtime — push new points on an interval
  constructor() {
    setInterval(() => {
      const last = this.revenueData.at(-1);
      const nextValue = (last?.['value'] as number ?? 18000) + Math.round(Math.random() * 800 - 200);
      this.revenueData = [
        ...this.revenueData.slice(-11),
        { category: new Date().toLocaleTimeString(), value: nextValue },
      ];
    }, 2000);
  }`,
    {
      xField: 'category',
      yField: 'value',
      appearance: { smooth: true },
      animation: { enabled: false },
    },
    '[height]="320"',
  ),
  buildExample(
    'line-custom-colors',
    'Custom Colors',
    'Set colors array to override the default palette per series.',
    'Custom colors align charts with brand guidelines.',
    'pui-line-chart',
    'PuiLineChartComponent',
    'type PuiChartData, type PuiLineChartConfig',
    'salesData',
    'lineConfig',
    'PuiLineChartConfig',
    MULTI_SERIES_DATA,
    {
      xField: 'category',
      yField: 'value',
      seriesField: 'series',
      colors: ['#635bff', '#00d4aa'],
      appearance: { smooth: true },
    },
    '[height]="320"',
  ),
];

const BAR_EXAMPLES: readonly PuiChartProgressiveExample[] = [
  buildExample(
    'bar-basic-column',
    'Basic Column',
    'Starting point — vertical grouped bars with default orientation.',
    'Column bars compare values across categories.',
    'pui-bar-chart',
    'PuiBarChartComponent',
    'type PuiChartData, type PuiBarChartConfig',
    'revenueData',
    'barConfig',
    'PuiBarChartConfig',
    REVENUE_DATA,
    { xField: 'category', yField: 'value', orientation: 'vertical' },
    '[height]="300"',
  ),
  buildExample(
    'bar-horizontal',
    'Horizontal',
    'Switched orientation to horizontal for ranking layouts.',
    'Horizontal bars work well for leaderboards and long labels.',
    'pui-bar-chart',
    'PuiBarChartComponent',
    'type PuiChartData, type PuiBarChartConfig',
    'rankingData',
    'barConfig',
    'PuiBarChartConfig',
    RANKING_DATA,
    { xField: 'category', yField: 'value', orientation: 'horizontal' },
    '[height]="300"',
  ),
  buildExample(
    'bar-grouped',
    'Grouped',
    'Added seriesField with mode grouped for side-by-side comparison.',
    'Grouped bars compare multiple series per category.',
    'pui-bar-chart',
    'PuiBarChartComponent',
    'type PuiChartData, type PuiBarChartConfig',
    'salesData',
    'barConfig',
    'PuiBarChartConfig',
    MULTI_SERIES_DATA,
    {
      xField: 'category',
      yField: 'value',
      seriesField: 'series',
      mode: 'grouped',
      interaction: { tooltip: true, seriesFocus: true },
    },
    '[height]="320"',
  ),
  buildExample(
    'bar-stacked',
    'Stacked',
    'Changed mode to stacked for cumulative totals per category.',
    'Stacked bars show composition within each category.',
    'pui-bar-chart',
    'PuiBarChartComponent',
    'type PuiChartData, type PuiBarChartConfig',
    'salesData',
    'barConfig',
    'PuiBarChartConfig',
    MULTI_SERIES_DATA,
    {
      xField: 'category',
      yField: 'value',
      seriesField: 'series',
      mode: 'stacked',
      appearance: { radius: 6 },
    },
    '[height]="300"',
  ),
  buildExample(
    'bar-stacked-100',
    '100% Stacked',
    'Changed mode to stacked100 for proportional breakdowns.',
    '100% stacked bars compare relative share, not absolute totals.',
    'pui-bar-chart',
    'PuiBarChartComponent',
    'type PuiChartData, type PuiBarChartConfig',
    'salesData',
    'barConfig',
    'PuiBarChartConfig',
    MULTI_SERIES_DATA,
    {
      xField: 'category',
      yField: 'value',
      seriesField: 'series',
      mode: 'stacked100',
    },
    '[height]="300"',
  ),
  buildExample(
    'bar-rounded',
    'Rounded',
    'Added appearance.radius for rounded bar corners.',
    'Rounded corners give bars a polished, modern look.',
    'pui-bar-chart',
    'PuiBarChartComponent',
    'type PuiChartData, type PuiBarChartConfig',
    'revenueData',
    'barConfig',
    'PuiBarChartConfig',
    REVENUE_DATA,
    { xField: 'category', yField: 'value', appearance: { radius: 12, color: '#635bff' } },
    '[height]="300"',
  ),
  buildExample(
    'bar-gradient',
    'Gradient',
    'Enabled appearance.gradient for gradient-filled bars.',
    'Gradient fills add visual depth to single-series bars.',
    'pui-bar-chart',
    'PuiBarChartComponent',
    'type PuiChartData, type PuiBarChartConfig',
    'revenueData',
    'barConfig',
    'PuiBarChartConfig',
    REVENUE_DATA,
    {
      xField: 'category',
      yField: 'value',
      appearance: { gradient: true, color: '#635bff' },
    },
    '[height]="300"',
  ),
  buildExample(
    'bar-data-labels',
    'Data Labels',
    'Enabled showDataLabels to display values on each bar.',
    'Data labels let users read values without hovering.',
    'pui-bar-chart',
    'PuiBarChartComponent',
    'type PuiChartData, type PuiBarChartConfig',
    'revenueData',
    'barConfig',
    'PuiBarChartConfig',
    REVENUE_DATA,
    { xField: 'category', yField: 'value', showDataLabels: true },
    '[height]="300"',
  ),
  buildExample(
    'bar-threshold',
    'Threshold',
    'Added threshold and thresholdLabel to mark a target line.',
    'Threshold lines highlight goals or alert boundaries on bar charts.',
    'pui-bar-chart',
    'PuiBarChartComponent',
    'type PuiChartData, type PuiBarChartConfig',
    'revenueData',
    'barConfig',
    'PuiBarChartConfig',
    REVENUE_DATA,
    { xField: 'category', yField: 'value', threshold: 25000, thresholdLabel: 'Target' },
    '[height]="300"',
  ),
  buildExample(
    'bar-custom-colors',
    'Custom Colors',
    'Set colors array to override the default palette.',
    'Custom colors align bar charts with brand guidelines.',
    'pui-bar-chart',
    'PuiBarChartComponent',
    'type PuiChartData, type PuiBarChartConfig',
    'salesData',
    'barConfig',
    'PuiBarChartConfig',
    MULTI_SERIES_DATA,
    {
      xField: 'category',
      yField: 'value',
      seriesField: 'series',
      mode: 'grouped',
      colors: ['#635bff', '#00d4aa', '#ff6b6b'],
    },
    '[height]="320"',
  ),
];

const PIE_EXAMPLES: readonly PuiChartProgressiveExample[] = [
  buildExample(
    'pie-basic',
    'Pie',
    'Starting point — classic pie chart with legend.',
    'A standard pie chart for proportional breakdowns.',
    'pui-pie-chart',
    'PuiPieChartComponent',
    'type PuiChartData, type PuiPieChartConfig',
    'planData',
    'pieConfig',
    'PuiPieChartConfig',
    PIE_DATA,
    { labelField: 'label', valueField: 'value', variant: 'pie', showLegend: true },
    '[height]="300"',
  ),
  buildExample(
    'pie-donut',
    'Donut',
    'Switched variant to donut with innerRadius.',
    'Donut charts leave room for center labels and feel less heavy.',
    'pui-pie-chart',
    'PuiPieChartComponent',
    'type PuiChartData, type PuiPieChartConfig',
    'planData',
    'pieConfig',
    'PuiPieChartConfig',
    PIE_DATA,
    { labelField: 'label', valueField: 'value', variant: 'donut', innerRadius: '55%' },
    '[height]="300"',
  ),
  buildExample(
    'pie-donut-center-label',
    'Donut Center Label',
    'Added centerLabel and centerValue for a summary in the donut hole.',
    'Center labels highlight the key total or metric name.',
    'pui-pie-chart',
    'PuiPieChartComponent',
    'type PuiChartData, type PuiPieChartConfig',
    'planData',
    'pieConfig',
    'PuiPieChartConfig',
    PIE_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      variant: 'donut',
      innerRadius: '55%',
      centerLabel: 'Total Plans',
      centerValue: '1,240',
    },
    '[height]="300"',
  ),
  buildExample(
    'pie-semi-circle',
    'Semi Circle',
    'Enabled semiCircle for a half-donut gauge-style layout.',
    'Semi-circle pies save vertical space in dashboard tiles.',
    'pui-pie-chart',
    'PuiPieChartComponent',
    'type PuiChartData, type PuiPieChartConfig',
    'planData',
    'pieConfig',
    'PuiPieChartConfig',
    PIE_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      variant: 'donut',
      semiCircle: true,
      innerRadius: '60%',
    },
    '[height]="240"',
  ),
  buildExample(
    'pie-multi-ring',
    'Multi Ring',
    'Configured concentric rings — note: multi-ring rendering is planned; use separate charts until fully supported.',
    'Multi-ring donuts compare two related breakdowns concentrically. Check release notes for full support.',
    'pui-pie-chart',
    'PuiPieChartComponent',
    'type PuiChartData, type PuiPieChartConfig',
    'planData',
    'pieConfig',
    'PuiPieChartConfig',
    PIE_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      variant: 'donut',
      innerRadius: '40%',
    },
    '[height]="300"',
    `{
  "labelField": "label",
  "valueField": "value",
  "variant": "donut",
  "innerRadius": "40%"
  // "multiRing": [{ "innerRadius": "55%", "data": "outerRingData" }] — planned API
}`,
  ),
  buildExample(
    'pie-interactive-hover',
    'Interactive Hover',
    'Enabled interaction tooltip and seriesFocus for hover emphasis.',
    'Hover effects help users focus on individual slices.',
    'pui-pie-chart',
    'PuiPieChartComponent',
    'type PuiChartData, type PuiPieChartConfig',
    'planData',
    'pieConfig',
    'PuiPieChartConfig',
    PIE_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      variant: 'donut',
      interaction: { tooltip: true, seriesFocus: true },
    },
    '[height]="300"',
  ),
  buildExample(
    'pie-legend-position',
    'Custom Legend Position',
    'Set legend.position to control legend placement.',
    'Position the legend where it best fits the layout.',
    'pui-pie-chart',
    'PuiPieChartComponent',
    'type PuiChartData, type PuiPieChartConfig',
    'planData',
    'pieConfig',
    'PuiPieChartConfig',
    PIE_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      showLegend: true,
      legend: { show: true, position: 'right' },
    },
    '[height]="300"',
  ),
  buildExample(
    'pie-custom-colors',
    'Custom Colors',
    'Set colors array to override slice colors.',
    'Custom colors align pie charts with brand guidelines.',
    'pui-pie-chart',
    'PuiPieChartComponent',
    'type PuiChartData, type PuiPieChartConfig',
    'planData',
    'pieConfig',
    'PuiPieChartConfig',
    PIE_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      colors: ['#635bff', '#00d4aa', '#ff6b6b', '#ffd166'],
    },
    '[height]="300"',
  ),
];

const SCATTER_EXAMPLES: readonly PuiChartProgressiveExample[] = [
  buildExample(
    'scatter-basic',
    'Basic',
    'Starting point — single-series scatter plot.',
    'Plot x/y coordinates to reveal distribution patterns.',
    'pui-scatter-chart',
    'PuiScatterChartComponent',
    'type PuiChartData, type PuiScatterChartConfig',
    'scatterData',
    'scatterConfig',
    'PuiScatterChartConfig',
    SCATTER_DATA,
    { xField: 'x', yField: 'y' },
    '[height]="300"',
  ),
  buildExample(
    'scatter-multi-series',
    'Multi Series',
    'Added seriesField to color-code multiple groups.',
    'Compare multiple groups on the same scatter plot.',
    'pui-scatter-chart',
    'PuiScatterChartComponent',
    'type PuiChartData, type PuiScatterChartConfig',
    'scatterData',
    'scatterConfig',
    'PuiScatterChartConfig',
    SCATTER_DATA,
    {
      xField: 'x',
      yField: 'y',
      seriesField: 'series',
      interaction: { tooltip: true, seriesFocus: true },
    },
    '[height]="300"',
  ),
  buildExample(
    'scatter-bubble',
    'Bubble',
    'Added sizeField to encode a third dimension as bubble size.',
    'Bubble charts add magnitude via marker size — no separate bubble component needed.',
    'pui-scatter-chart',
    'PuiScatterChartComponent',
    'type PuiChartData, type PuiScatterChartConfig',
    'bubbleData',
    'scatterConfig',
    'PuiScatterChartConfig',
    BUBBLE_DATA,
    { xField: 'x', yField: 'y', sizeField: 'size', seriesField: 'series' },
    '[height]="300"',
  ),
  buildExample(
    'scatter-regression',
    'Regression',
    'Enabled showRegression to overlay a linear trend line.',
    'Regression lines highlight correlation direction and strength.',
    'pui-scatter-chart',
    'PuiScatterChartComponent',
    'type PuiChartData, type PuiScatterChartConfig',
    'scatterData',
    'scatterConfig',
    'PuiScatterChartConfig',
    SCATTER_DATA,
    { xField: 'x', yField: 'y', seriesField: 'series', showRegression: true },
    '[height]="300"',
  ),
  buildExample(
    'scatter-custom-tooltip',
    'Custom Tooltip',
    'Use puiChartTooltip content projection for custom HTML tooltips.',
    'Project a template with puiChartTooltip for rich HTML tooltip content.',
    'pui-scatter-chart',
    'PuiScatterChartComponent',
    'type PuiChartData, type PuiScatterChartConfig',
    'scatterData',
    'scatterConfig',
    'PuiScatterChartConfig',
    SCATTER_DATA,
    { xField: 'x', yField: 'y', seriesField: 'series', interaction: { tooltip: true } },
    '[height]="300"',
    undefined,
    `<pui-scatter-chart
  [data]="scatterData"
  [config]="scatterConfig"
  [height]="300"
>
  <ng-template puiChartTooltip let-point>
  <strong>{{ point.series }}</strong>: ({{ point.x }}, {{ point.y }})
  </ng-template>
</pui-scatter-chart>`,
  ),
];

const RADAR_EXAMPLES: readonly PuiChartProgressiveExample[] = [
  buildExample(
    'radar-basic',
    'Basic',
    'Starting point — single-series radar chart.',
    'Compare one entity across multiple dimensions.',
    'pui-radar-chart',
    'PuiRadarChartComponent',
    'type PuiChartData, type PuiRadarChartConfig',
    'radarData',
    'radarConfig',
    'PuiRadarChartConfig',
    `  protected readonly radarData: PuiChartData = [
    { label: 'Speed', value: 82 },
    { label: 'Quality', value: 91 },
    { label: 'Reliability', value: 76 },
    { label: 'Support', value: 88 },
    { label: 'Adoption', value: 70 },
  ];`,
    { labelField: 'label', valueField: 'value' },
    '[height]="320"',
  ),
  buildExample(
    'radar-multi-series',
    'Multi Series',
    'Added seriesField to overlay multiple entities.',
    'Compare Team A vs Team B across the same axes.',
    'pui-radar-chart',
    'PuiRadarChartComponent',
    'type PuiChartData, type PuiRadarChartConfig',
    'radarData',
    'radarConfig',
    'PuiRadarChartConfig',
    RADAR_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      seriesField: 'series',
      interaction: { tooltip: true, seriesFocus: true },
    },
    '[height]="320"',
  ),
  buildExample(
    'radar-area',
    'Radar Area',
    'Enabled filled for area-filled radar polygons.',
    'Filled radar charts emphasize coverage across dimensions.',
    'pui-radar-chart',
    'PuiRadarChartComponent',
    'type PuiChartData, type PuiRadarChartConfig',
    'radarData',
    'radarConfig',
    'PuiRadarChartConfig',
    RADAR_DATA,
    { labelField: 'label', valueField: 'value', seriesField: 'series', filled: true },
    '[height]="320"',
  ),
  buildExample(
    'radar-custom-colors',
    'Custom Colors',
    'Set colors array to distinguish series.',
    'Custom colors align radar charts with brand guidelines.',
    'pui-radar-chart',
    'PuiRadarChartComponent',
    'type PuiChartData, type PuiRadarChartConfig',
    'radarData',
    'radarConfig',
    'PuiRadarChartConfig',
    RADAR_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      seriesField: 'series',
      filled: true,
      colors: ['#635bff', '#00d4aa'],
    },
    '[height]="320"',
  ),
];

const HEATMAP_EXAMPLES: readonly PuiChartProgressiveExample[] = [
  buildExample(
    'heatmap-activity',
    'Activity',
    'Starting point — day × time-of-day activity grid.',
    'Visualize usage intensity across days and time slots.',
    'pui-heatmap-chart',
    'PuiHeatmapChartComponent',
    'type PuiChartData, type PuiHeatmapChartConfig',
    'activityData',
    'heatmapConfig',
    'PuiHeatmapChartConfig',
    HEATMAP_ACTIVITY_DATA,
    { xField: 'x', yField: 'y', valueField: 'value' },
    '[height]="320"',
  ),
  buildExample(
    'heatmap-correlation',
    'Correlation',
    'Correlation matrix with diverging values from -1 to 1.',
    'Heatmaps reveal relationships between metrics.',
    'pui-heatmap-chart',
    'PuiHeatmapChartComponent',
    'type PuiChartData, type PuiHeatmapChartConfig',
    'correlationData',
    'heatmapConfig',
    'PuiHeatmapChartConfig',
    HEATMAP_CORRELATION_DATA,
    { xField: 'x', yField: 'y', valueField: 'value' },
    '[height]="360"',
  ),
  buildExample(
    'heatmap-revenue',
    'Revenue',
    'Regional revenue grid by region and quarter.',
    'Compare revenue intensity across regions and periods.',
    'pui-heatmap-chart',
    'PuiHeatmapChartComponent',
    'type PuiChartData, type PuiHeatmapChartConfig',
    'revenueHeatmapData',
    'heatmapConfig',
    'PuiHeatmapChartConfig',
    HEATMAP_REVENUE_DATA,
    {
      xField: 'x',
      yField: 'y',
      valueField: 'value',
      valueFormatter: (value: number) => `$${value}k`,
    },
    '[height]="320"',
    `{
  "xField": "x",
  "yField": "y",
  "valueField": "value",
  "valueFormatter": "(value) => \`$\\\${value}k\`"
}`,
  ),
];

const TREEMAP_EXAMPLES: readonly PuiChartProgressiveExample[] = [
  buildExample(
    'treemap-basic',
    'Basic',
    'Starting point — flat treemap by department spend.',
    'Rectangle area encodes relative proportion.',
    'pui-treemap-chart',
    'PuiTreemapChartComponent',
    'type PuiChartData, type PuiTreemapChartConfig',
    'departmentData',
    'treemapConfig',
    'PuiTreemapChartConfig',
    TREEMAP_DATA,
    { labelField: 'label', valueField: 'value', appearance: { radius: 6 } },
    '[height]="300"',
  ),
  buildExample(
    'treemap-nested',
    'Nested',
    'Enabled nested to group child nodes under parent categories.',
    'Nested treemaps show hierarchy with parent groupings.',
    'pui-treemap-chart',
    'PuiTreemapChartComponent',
    'type PuiChartData, type PuiTreemapChartConfig',
    'portfolioData',
    'treemapConfig',
    'PuiTreemapChartConfig',
    TREEMAP_NESTED_DATA,
    { labelField: 'label', valueField: 'value', nested: true },
    '[height]="300"',
  ),
  buildExample(
    'treemap-revenue',
    'Revenue Breakdown',
    'Revenue treemap with custom colors and value formatting.',
    'Treemaps communicate portfolio or revenue allocation at a glance.',
    'pui-treemap-chart',
    'PuiTreemapChartComponent',
    'type PuiChartData, type PuiTreemapChartConfig',
    'departmentData',
    'treemapConfig',
    'PuiTreemapChartConfig',
    TREEMAP_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      colors: ['#635bff', '#00d4aa', '#ff6b6b', '#ffd166', '#4ecdc4'],
      valueFormatter: (value: number) => `$${value}M`,
    },
    '[height]="300"',
    `{
  "labelField": "label",
  "valueField": "value",
  "colors": ["#635bff", "#00d4aa", "#ff6b6b", "#ffd166", "#4ecdc4"],
  "valueFormatter": "(value) => \`$\\\${value}M\`"
}`,
  ),
];

const FUNNEL_EXAMPLES: readonly PuiChartProgressiveExample[] = [
  buildExample(
    'funnel-basic',
    'Basic',
    'Starting point — conversion funnel with default styling.',
    'Track drop-off across sequential pipeline stages.',
    'pui-funnel-chart',
    'PuiFunnelChartComponent',
    'type PuiChartData, type PuiFunnelChartConfig',
    'funnelData',
    'funnelConfig',
    'PuiFunnelChartConfig',
    FUNNEL_DATA,
    { labelField: 'label', valueField: 'value' },
    '[height]="320"',
  ),
  buildExample(
    'funnel-conversion',
    'Conversion',
    'Added valueFormatter and rounded appearance for polished labels.',
    'Format stage values for readability in conversion reports.',
    'pui-funnel-chart',
    'PuiFunnelChartComponent',
    'type PuiChartData, type PuiFunnelChartConfig',
    'funnelData',
    'funnelConfig',
    'PuiFunnelChartConfig',
    FUNNEL_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      appearance: { radius: 6 },
      valueFormatter: (value: number) => value.toLocaleString(),
    },
    '[height]="320"',
    `{
  "labelField": "label",
  "valueField": "value",
  "appearance": { "radius": 6 },
  "valueFormatter": "(value) => value.toLocaleString()"
}`,
  ),
  buildExample(
    'funnel-custom-colors',
    'Custom Colors',
    'Set colors array to style each funnel stage.',
    'Custom colors highlight stage progression.',
    'pui-funnel-chart',
    'PuiFunnelChartComponent',
    'type PuiChartData, type PuiFunnelChartConfig',
    'funnelData',
    'funnelConfig',
    'PuiFunnelChartConfig',
    FUNNEL_DATA,
    {
      labelField: 'label',
      valueField: 'value',
      colors: ['#635bff', '#7c75ff', '#958fff', '#aea9ff'],
    },
    '[height]="320"',
  ),
];

const GAUGE_EXAMPLES: readonly PuiChartProgressiveExample[] = [
  buildExample(
    'gauge-circular',
    'Circular',
    'Starting point — full circular gauge with default variant.',
    'Display a single percentage or score on a circular dial.',
    'pui-gauge-chart',
    'PuiGaugeChartComponent',
    'type PuiChartData, type PuiGaugeChartConfig',
    'gaugeData',
    'gaugeConfig',
    'PuiGaugeChartConfig',
    GAUGE_DATA,
    { valueField: 'value', min: 0, max: 100, variant: 'circular' },
    '[height]="280"',
  ),
  buildExample(
    'gauge-semi',
    'Semi',
    'Switched variant to semi for a half-circle gauge.',
    'Semi gauges fit compact dashboard tiles.',
    'pui-gauge-chart',
    'PuiGaugeChartComponent',
    'type PuiChartData, type PuiGaugeChartConfig',
    'gaugeData',
    'gaugeConfig',
    'PuiGaugeChartConfig',
    GAUGE_DATA,
    { valueField: 'value', min: 0, max: 100, variant: 'semi', unit: '%' },
    '[height]="220"',
  ),
  buildExample(
    'gauge-kpi',
    'KPI',
    'Switched variant to kpi for a large numeric readout.',
    'KPI gauges emphasize the current value over the dial.',
    'pui-gauge-chart',
    'PuiGaugeChartComponent',
    'type PuiChartData, type PuiGaugeChartConfig',
    'gaugeData',
    'gaugeConfig',
    'PuiGaugeChartConfig',
    GAUGE_DATA,
    {
      valueField: 'value',
      min: 0,
      max: 100,
      variant: 'kpi',
      unit: '%',
      appearance: { color: '#635bff' },
    },
    '[height]="240"',
  ),
  buildExample(
    'gauge-multi',
    'Multi Segment',
    'Configured variant multi for segmented range indicators.',
    'Multi-segment gauges show performance bands (e.g. poor / fair / good).',
    'pui-gauge-chart',
    'PuiGaugeChartComponent',
    'type PuiChartData, type PuiGaugeChartConfig',
    'gaugeData',
    'gaugeConfig',
    'PuiGaugeChartConfig',
    GAUGE_DATA,
    {
      valueField: 'value',
      min: 0,
      max: 100,
      variant: 'multi',
      colors: ['#ff6b6b', '#ffd166', '#00d4aa'],
    },
    '[height]="280"',
  ),
];

const SPARKLINE_EXAMPLES: readonly PuiChartProgressiveExample[] = [
  buildExample(
    'sparkline-line',
    'Line',
    'Starting point — compact inline line sparkline.',
    'Embed a minimal trend line in tables or KPI cards.',
    'pui-sparkline',
    'PuiSparklineComponent',
    'type PuiChartData, type PuiSparklineConfig',
    'sparklineData',
    'sparklineConfig',
    'PuiSparklineConfig',
    SPARKLINE_DATA,
    { yField: 'value', variant: 'line', appearance: { color: '#635bff' } },
  ),
  buildExample(
    'sparkline-area',
    'Area',
    'Switched variant to area for a filled inline trend.',
    'Area sparklines emphasize volume in compact spaces.',
    'pui-sparkline',
    'PuiSparklineComponent',
    'type PuiChartData, type PuiSparklineConfig',
    'sparklineData',
    'sparklineConfig',
    'PuiSparklineConfig',
    SPARKLINE_DATA,
    { yField: 'value', variant: 'area', appearance: { color: '#635bff', gradient: true } },
  ),
  buildExample(
    'sparkline-bar',
    'Bar',
    'Switched variant to bar for discrete period comparisons.',
    'Bar sparklines compare individual periods inline.',
    'pui-sparkline',
    'PuiSparklineComponent',
    'type PuiChartData, type PuiSparklineConfig',
    'sparklineData',
    'sparklineConfig',
    'PuiSparklineConfig',
    SPARKLINE_DATA,
    { yField: 'value', variant: 'bar', appearance: { color: '#635bff', radius: 2 } },
  ),
];

export const CHART_DOC_PAGES: readonly PuiChartDocPage[] = [
  {
    slug: 'line-chart',
    title: 'Line chart',
    kind: 'line',
    overview: LINE_OVERVIEW,
    examples: LINE_EXAMPLES,
  },
  {
    slug: 'bar-chart',
    title: 'Bar chart',
    kind: 'bar',
    overview: BAR_OVERVIEW,
    examples: BAR_EXAMPLES,
  },
  {
    slug: 'pie-chart',
    title: 'Pie chart',
    kind: 'pie',
    overview: PIE_OVERVIEW,
    examples: PIE_EXAMPLES,
  },
  {
    slug: 'scatter-chart',
    title: 'Scatter chart',
    kind: 'scatter',
    overview: SCATTER_OVERVIEW,
    examples: SCATTER_EXAMPLES,
  },
  {
    slug: 'radar-chart',
    title: 'Radar chart',
    kind: 'radar',
    overview: RADAR_OVERVIEW,
    examples: RADAR_EXAMPLES,
  },
  {
    slug: 'heatmap-chart',
    title: 'Heatmap chart',
    kind: 'heatmap',
    overview: HEATMAP_OVERVIEW,
    examples: HEATMAP_EXAMPLES,
  },
  {
    slug: 'treemap-chart',
    title: 'Treemap chart',
    kind: 'treemap',
    overview: TREEMAP_OVERVIEW,
    examples: TREEMAP_EXAMPLES,
  },
  {
    slug: 'funnel-chart',
    title: 'Funnel chart',
    kind: 'funnel',
    overview: FUNNEL_OVERVIEW,
    examples: FUNNEL_EXAMPLES,
  },
  {
    slug: 'gauge-chart',
    title: 'Gauge chart',
    kind: 'gauge',
    overview: GAUGE_OVERVIEW,
    examples: GAUGE_EXAMPLES,
  },
  {
    slug: 'sparkline',
    title: 'Sparkline',
    kind: 'sparkline',
    overview: SPARKLINE_OVERVIEW,
    examples: SPARKLINE_EXAMPLES,
  },
];

export function findChartDocPage(slug: string): PuiChartDocPage | undefined {
  return CHART_DOC_PAGES.find((page) => page.slug === slug);
}
