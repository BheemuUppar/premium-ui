import { Injectable, inject } from '@angular/core';
import { PuiChartAdapter } from '../adapters/chart.adapter';
import type { PuiInternalECharts } from '../adapters/echarts-internal.setup';

/** Future-ready export surface — PNG/SVG/CSV hooks without exposing ECharts. */
@Injectable({ providedIn: 'root' })
export class PuiChartExportService {
  private readonly adapter = inject(PuiChartAdapter);

  exportPng(instance: PuiInternalECharts, pixelRatio = 2): string {
    return instance.getDataURL({
      type: 'png',
      pixelRatio,
      backgroundColor: 'transparent',
    });
  }

  exportSvg(instance: PuiInternalECharts): string {
    return instance.getDataURL({ type: 'svg', backgroundColor: 'transparent' });
  }
}
