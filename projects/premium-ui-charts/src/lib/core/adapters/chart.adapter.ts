import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
  ensureEchartsRegistered,
  type PuiInternalECharts,
  type PuiInternalEChartsOption,
} from './echarts-internal.setup';

export interface PuiChartAdapterUpdateOptions {
  readonly notMerge?: boolean;
  readonly lazyUpdate?: boolean;
  readonly silent?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PuiChartAdapter {
  private readonly platformId = inject(PLATFORM_ID);

  create(host: HTMLElement, option: PuiInternalEChartsOption): PuiInternalECharts | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const echarts = ensureEchartsRegistered();
    const instance = echarts.init(host, undefined, { renderer: 'canvas' });
    instance.setOption(option, { notMerge: true, lazyUpdate: false, silent: true });
    return instance;
  }

  update(
    instance: PuiInternalECharts,
    option: PuiInternalEChartsOption,
    options: PuiChartAdapterUpdateOptions = {}
  ): void {
    instance.setOption(option, {
      notMerge: options.notMerge ?? false,
      lazyUpdate: options.lazyUpdate ?? false,
      silent: options.silent ?? false,
    });
  }

  resize(instance: PuiInternalECharts): void {
    instance.resize({ animation: { duration: 180, easing: 'cubicOut' } });
  }

  showLoading(instance: PuiInternalECharts): void {
    instance.showLoading('default', {
      text: '',
      color: 'var(--pui-color-primary, #635bff)',
      maskColor: 'rgba(255,255,255,0.45)',
      zlevel: 0,
    });
  }

  hideLoading(instance: PuiInternalECharts): void {
    instance.hideLoading();
  }

  dispose(instance: PuiInternalECharts): void {
    instance.dispose();
  }
}
