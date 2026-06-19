import type { PuiChartData } from '@premium-ui/charts';
import {
  DEMO_BUBBLE_DATA,
  DEMO_FUNNEL_DATA,
  DEMO_GAUGE_DATA,
  DEMO_HEATMAP_DATA,
  DEMO_MULTI_SERIES_DATA,
  DEMO_PIE_DATA,
  DEMO_RADAR_DATA,
  DEMO_RANKING_DATA,
  DEMO_REVENUE_DATA,
  DEMO_SCATTER_DATA,
  DEMO_SPARKLINE_DATA,
  DEMO_TREEMAP_DATA,
} from '@premium-ui/charts';

export const CHART_DOC_ACTIVITY_DATA: PuiChartData = [
  { x: 'Mon', y: 'Morning', value: 12 },
  { x: 'Mon', y: 'Afternoon', value: 28 },
  { x: 'Mon', y: 'Evening', value: 18 },
  { x: 'Tue', y: 'Morning', value: 16 },
  { x: 'Tue', y: 'Afternoon', value: 34 },
  { x: 'Tue', y: 'Evening', value: 22 },
];

export const CHART_DOC_CORRELATION_DATA: PuiChartData = [
  { x: 'Revenue', y: 'Revenue', value: 1.0 },
  { x: 'Revenue', y: 'Churn', value: -0.62 },
  { x: 'Revenue', y: 'NPS', value: 0.74 },
  { x: 'Churn', y: 'Revenue', value: -0.62 },
  { x: 'Churn', y: 'Churn', value: 1.0 },
  { x: 'Churn', y: 'NPS', value: -0.48 },
  { x: 'NPS', y: 'Revenue', value: 0.74 },
  { x: 'NPS', y: 'Churn', value: -0.48 },
  { x: 'NPS', y: 'NPS', value: 1.0 },
];

export const CHART_DOC_REVENUE_HEATMAP_DATA: PuiChartData = [
  { x: 'NA', y: 'Q1', value: 420 },
  { x: 'NA', y: 'Q2', value: 480 },
  { x: 'EU', y: 'Q1', value: 310 },
  { x: 'EU', y: 'Q2', value: 350 },
  { x: 'APAC', y: 'Q1', value: 260 },
  { x: 'APAC', y: 'Q2', value: 295 },
];

export const CHART_DOC_PORTFOLIO_DATA: PuiChartData = [
  { label: 'Cloud', value: 48, parent: 'Infrastructure' },
  { label: 'Edge', value: 22, parent: 'Infrastructure' },
  { label: 'Analytics', value: 36, parent: 'Platform' },
  { label: 'Workflows', value: 28, parent: 'Platform' },
];

/** Maps example data variable names to live demo datasets. */
export const CHART_DOC_DATASETS: Readonly<Record<string, PuiChartData>> = {
  revenueData: DEMO_REVENUE_DATA,
  salesData: DEMO_MULTI_SERIES_DATA,
  planData: DEMO_PIE_DATA,
  scatterData: DEMO_SCATTER_DATA,
  bubbleData: DEMO_BUBBLE_DATA,
  radarData: DEMO_RADAR_DATA,
  activityData: CHART_DOC_ACTIVITY_DATA,
  correlationData: CHART_DOC_CORRELATION_DATA,
  revenueHeatmapData: CHART_DOC_REVENUE_HEATMAP_DATA,
  departmentData: DEMO_TREEMAP_DATA,
  portfolioData: CHART_DOC_PORTFOLIO_DATA,
  funnelData: DEMO_FUNNEL_DATA,
  gaugeData: DEMO_GAUGE_DATA,
  sparklineData: DEMO_SPARKLINE_DATA,
  rankingData: DEMO_RANKING_DATA,
  heatmapData: DEMO_HEATMAP_DATA,
};
