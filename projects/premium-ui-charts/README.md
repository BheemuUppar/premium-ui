# @premium-ui/charts

Premium UI Charts is an **independent** Angular charting platform. It does not require `@premium-ui/components`.

## Install

```bash
npm install @premium-ui/charts echarts
```

## Quick start

```typescript
import { Component } from '@angular/core';
import { PuiLineChartComponent, type PuiChartData } from '@premium-ui/charts';

@Component({
  imports: [PuiLineChartComponent],
  template: `<pui-line-chart [data]="revenue" />`,
})
export class DashboardComponent {
  protected readonly revenue: PuiChartData = [
    { category: 'Jan', value: 18200 },
    { category: 'Feb', value: 21400 },
  ];
}
```

Import chart styles once in your global stylesheet:

```scss
@use '@premium-ui/charts/styles/chart.tokens';
```

## Bootstrap (optional)

```typescript
import { providePuiCharts } from '@premium-ui/charts';

export const appConfig = {
  providers: [providePuiCharts()],
};
```
