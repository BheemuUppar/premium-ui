import type { PuiChartData } from '../core/interfaces/chart-data.types';

export const DEMO_REVENUE_DATA: PuiChartData = [
  { category: 'Jan', value: 18200 },
  { category: 'Feb', value: 21400 },
  { category: 'Mar', value: 19800 },
  { category: 'Apr', value: 24500 },
  { category: 'May', value: 26800 },
  { category: 'Jun', value: 29100 },
  { category: 'Jul', value: 27600 },
  { category: 'Aug', value: 31200 },
  { category: 'Sep', value: 33400 },
  { category: 'Oct', value: 35800 },
  { category: 'Nov', value: 37200 },
  { category: 'Dec', value: 40100 },
];

export const DEMO_MULTI_SERIES_DATA: PuiChartData = [
  { category: 'Jan', value: 120, series: 'Direct' },
  { category: 'Feb', value: 132, series: 'Direct' },
  { category: 'Mar', value: 101, series: 'Direct' },
  { category: 'Apr', value: 134, series: 'Direct' },
  { category: 'May', value: 190, series: 'Direct' },
  { category: 'Jun', value: 230, series: 'Direct' },
  { category: 'Jan', value: 220, series: 'Organic' },
  { category: 'Feb', value: 182, series: 'Organic' },
  { category: 'Mar', value: 191, series: 'Organic' },
  { category: 'Apr', value: 234, series: 'Organic' },
  { category: 'May', value: 290, series: 'Organic' },
  { category: 'Jun', value: 330, series: 'Organic' },
];

export const DEMO_DONUT_DATA: PuiChartData = [
  { label: 'Subscriptions', value: 44 },
  { label: 'Services', value: 28 },
  { label: 'Marketplace', value: 18 },
  { label: 'Other', value: 10 },
];

export const DEMO_SPARKLINE_DATA: PuiChartData = [
  { value: 12 },
  { value: 18 },
  { value: 14 },
  { value: 22 },
  { value: 19 },
  { value: 26 },
  { value: 24 },
  { value: 31 },
  { value: 28 },
  { value: 35 },
];

export const DEMO_PIE_DATA: PuiChartData = [
  { label: 'Enterprise', value: 38 },
  { label: 'Pro', value: 32 },
  { label: 'Starter', value: 22 },
  { label: 'Free', value: 8 },
];

export const DEMO_SCATTER_DATA: PuiChartData = [
  { x: 12, y: 44, series: 'Alpha' },
  { x: 18, y: 52, series: 'Alpha' },
  { x: 24, y: 48, series: 'Alpha' },
  { x: 30, y: 61, series: 'Alpha' },
  { x: 14, y: 38, series: 'Beta' },
  { x: 22, y: 55, series: 'Beta' },
  { x: 28, y: 49, series: 'Beta' },
  { x: 36, y: 67, series: 'Beta' },
];

export const DEMO_BUBBLE_DATA: PuiChartData = [
  { x: 18, y: 42, size: 24, series: 'NA' },
  { x: 26, y: 58, size: 36, series: 'NA' },
  { x: 34, y: 51, size: 18, series: 'NA' },
  { x: 16, y: 36, size: 28, series: 'EU' },
  { x: 28, y: 62, size: 44, series: 'EU' },
  { x: 38, y: 48, size: 22, series: 'EU' },
];

export const DEMO_RADAR_DATA: PuiChartData = [
  { label: 'Speed', value: 82, series: 'Team A' },
  { label: 'Quality', value: 91, series: 'Team A' },
  { label: 'Reliability', value: 76, series: 'Team A' },
  { label: 'Support', value: 88, series: 'Team A' },
  { label: 'Adoption', value: 70, series: 'Team A' },
  { label: 'Speed', value: 74, series: 'Team B' },
  { label: 'Quality', value: 85, series: 'Team B' },
  { label: 'Reliability', value: 92, series: 'Team B' },
  { label: 'Support', value: 79, series: 'Team B' },
  { label: 'Adoption', value: 83, series: 'Team B' },
];

export const DEMO_HEATMAP_DATA: PuiChartData = [
  { x: 'Mon', y: 'Morning', value: 12 },
  { x: 'Mon', y: 'Afternoon', value: 28 },
  { x: 'Mon', y: 'Evening', value: 18 },
  { x: 'Tue', y: 'Morning', value: 16 },
  { x: 'Tue', y: 'Afternoon', value: 34 },
  { x: 'Tue', y: 'Evening', value: 22 },
  { x: 'Wed', y: 'Morning', value: 20 },
  { x: 'Wed', y: 'Afternoon', value: 38 },
  { x: 'Wed', y: 'Evening', value: 26 },
  { x: 'Thu', y: 'Morning', value: 18 },
  { x: 'Thu', y: 'Afternoon', value: 32 },
  { x: 'Thu', y: 'Evening', value: 24 },
];

export const DEMO_FUNNEL_DATA: PuiChartData = [
  { label: 'Visitors', value: 12000 },
  { label: 'Signups', value: 4200 },
  { label: 'Activated', value: 2100 },
  { label: 'Paid', value: 860 },
];

export const DEMO_TREEMAP_DATA: PuiChartData = [
  { label: 'Engineering', value: 42 },
  { label: 'Design', value: 18 },
  { label: 'Product', value: 24 },
  { label: 'Marketing', value: 16 },
  { label: 'Sales', value: 20 },
  { label: 'Support', value: 14 },
];

export const DEMO_RANKING_DATA: PuiChartData = [
  { category: 'Stripe', value: 98 },
  { category: 'Linear', value: 86 },
  { category: 'Notion', value: 74 },
  { category: 'Vercel', value: 68 },
  { category: 'Datadog', value: 61 },
];

export const DEMO_GAUGE_DATA: PuiChartData = [{ value: 72 }];

export const DEMO_MULTI_METRIC_DATA: PuiChartData = [
  { category: 'Jan', value: 120, series: 'Revenue' },
  { category: 'Feb', value: 132, series: 'Revenue' },
  { category: 'Mar', value: 101, series: 'Revenue' },
  { category: 'Apr', value: 134, series: 'Revenue' },
  { category: 'Jan', value: 80, series: 'Profit' },
  { category: 'Feb', value: 90, series: 'Profit' },
  { category: 'Mar', value: 70, series: 'Profit' },
  { category: 'Apr', value: 95, series: 'Profit' },
  { category: 'Jan', value: 40, series: 'Expenses' },
  { category: 'Feb', value: 42, series: 'Expenses' },
  { category: 'Mar', value: 31, series: 'Expenses' },
  { category: 'Apr', value: 39, series: 'Expenses' },
];

export function createLargeDataset(count = 10000): PuiChartData {
  return Array.from({ length: count }, (_, index) => ({
    category: String(index),
    value: Math.round(40 + Math.sin(index / 12) * 24 + Math.random() * 16),
  }));
}
