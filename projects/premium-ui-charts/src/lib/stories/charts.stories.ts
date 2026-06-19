import type { Meta, StoryObj } from '@storybook/angular';
import { Component, input } from '@angular/core';
import {
  PuiBarChartComponent,
  PuiGaugeChartComponent,
  PuiLineChartComponent,
  PuiPieChartComponent,
  PuiSparklineComponent,
  type PuiBarChartConfig,
  type PuiGaugeChartConfig,
  type PuiLineChartConfig,
  type PuiPieChartConfig,
} from '../index';
import {
  DEMO_GAUGE_DATA,
  DEMO_MULTI_SERIES_DATA,
  DEMO_PIE_DATA,
  DEMO_REVENUE_DATA,
  DEMO_SPARKLINE_DATA,
  createLargeDataset,
} from '../demo/chart.demo-data';

@Component({
  selector: 'pui-charts-story-host',
  imports: [
    PuiLineChartComponent,
    PuiBarChartComponent,
    PuiPieChartComponent,
    PuiGaugeChartComponent,
    PuiSparklineComponent,
  ],
  template: `
    <div style="display:grid;gap:1.5rem;max-width:960px;width:min(960px,100%)">
      <div style="display:flex;align-items:center;gap:1rem">
        <span style="font-weight:600">Revenue</span>
        <pui-sparkline [data]="sparklineData" [config]="{ yField: 'value', appearance: { color: '#635bff' } }" />
      </div>

      <pui-line-chart [data]="lineData" [config]="lineConfig()" [height]="320" />
      <pui-line-chart [data]="lineData" [config]="areaConfig()" [height]="320" />
      <pui-bar-chart [data]="barData" [config]="barConfig()" [height]="320" />
      <pui-pie-chart [data]="pieData" [config]="donutConfig()" [height]="320" />
      <pui-gauge-chart [data]="gaugeData" [config]="gaugeConfig()" [height]="280" />
    </div>
  `,
})
class ChartsStoryHostComponent {
  readonly lineConfig = input<PuiLineChartConfig>();
  readonly areaConfig = input<PuiLineChartConfig>();
  readonly barConfig = input<PuiBarChartConfig>();
  readonly donutConfig = input<PuiPieChartConfig>();
  readonly gaugeConfig = input<PuiGaugeChartConfig>();

  protected readonly lineData = DEMO_REVENUE_DATA;
  protected readonly barData = DEMO_MULTI_SERIES_DATA;
  protected readonly pieData = DEMO_PIE_DATA;
  protected readonly gaugeData = DEMO_GAUGE_DATA;
  protected readonly sparklineData = DEMO_SPARKLINE_DATA;
}

const meta: Meta = {
  title: 'Charts/Platform',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    moduleMetadata: { imports: [ChartsStoryHostComponent] },
    template: `<pui-charts-story-host />`,
  }),
};

export const DarkTheme: Story = {
  name: 'Dark Theme',
  globals: { theme: 'dark' },
  render: () => ({
    moduleMetadata: { imports: [ChartsStoryHostComponent] },
    template: `<pui-charts-story-host />`,
  }),
};

export const ConfigDrivenVariants: Story = {
  name: 'Config-Driven Variants',
  render: () => ({
    moduleMetadata: { imports: [ChartsStoryHostComponent] },
    template: `<pui-charts-story-host
      [lineConfig]="{ xField: 'category', yField: 'value', appearance: { smooth: true } }"
      [areaConfig]="{ xField: 'category', yField: 'value', variant: 'area', appearance: { gradient: true } }"
      [barConfig]="{ xField: 'category', yField: 'value', seriesField: 'series', mode: 'stacked' }"
      [donutConfig]="{ labelField: 'label', valueField: 'value', variant: 'donut', centerLabel: 'Total', centerValue: '$2.4M' }"
      [gaugeConfig]="{ valueField: 'value', variant: 'circular' }"
    />`,
  }),
};

export const LargeDataset: Story = {
  name: 'Large Dataset',
  render: () => ({
    moduleMetadata: { imports: [PuiLineChartComponent] },
    props: { data: createLargeDataset(5000) },
    template: `<pui-line-chart [data]="data" [config]="{ xField: 'category', yField: 'value', animation: { enabled: false } }" [height]="320" />`,
  }),
};
