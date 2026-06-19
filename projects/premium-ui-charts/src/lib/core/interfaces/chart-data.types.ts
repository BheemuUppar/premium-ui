/** Generic chart row — field names are resolved via config `xField` / `yField`. */
export type PuiChartDataPoint = Readonly<Record<string, unknown>>;

export type PuiChartData = readonly PuiChartDataPoint[];

export type PuiChartValueFormatter = (value: number) => string;

export type PuiChartLabelFormatter = (value: string | number) => string;
