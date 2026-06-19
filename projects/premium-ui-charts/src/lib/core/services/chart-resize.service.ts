import { Injectable, NgZone, inject } from '@angular/core';
import type { PuiInternalECharts } from '../adapters/echarts-internal.setup';
import { PuiChartAdapter } from '../adapters/chart.adapter';

@Injectable({ providedIn: 'root' })
export class PuiChartResizeService {
  private readonly zone = inject(NgZone);
  private readonly adapter = inject(PuiChartAdapter);

  observe(host: HTMLElement, instance: PuiInternalECharts): () => void {
    if (typeof ResizeObserver === 'undefined') {
      return () => undefined;
    }

    let frame = 0;

    const observer = new ResizeObserver(() => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      frame = requestAnimationFrame(() => {
        this.zone.runOutsideAngular(() => {
          this.adapter.resize(instance);
        });
      });
    });

    observer.observe(host);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      observer.disconnect();
    };
  }
}
