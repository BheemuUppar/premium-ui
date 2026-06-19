import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
} from '@angular/core';
import type { PuiInternalECharts, PuiInternalEChartsOption } from '../adapters/echarts-internal.setup';
import { PuiChartAdapter } from '../adapters/chart.adapter';
import type { PuiChartData } from '../interfaces/chart-data.types';
import type { PuiChartThemePreset } from '../interfaces/chart-display.types';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';
import { PuiChartResizeService } from '../services/chart-resize.service';
import { PuiChartThemeService } from '../themes/chart-theme.service';
import { PuiChartTooltipDirective } from '../tooltips/chart-tooltip.directive';

@Directive()
export abstract class PuiChartBaseDirective {
  protected readonly host = inject(ElementRef<HTMLElement>);
  protected readonly adapter = inject(PuiChartAdapter);
  protected readonly themeService = inject(PuiChartThemeService);
  protected readonly resizeService = inject(PuiChartResizeService);
  protected readonly destroyRef = inject(DestroyRef);

  protected readonly tooltipTemplate = contentChild(PuiChartTooltipDirective);

  readonly data = input<PuiChartData>([]);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null);

  protected instance: PuiInternalECharts | null = null;
  private disconnectResize: (() => void) | null = null;
  private initialized = false;

  protected readonly isEmpty = computed(() => this.data().length === 0);

  protected abstract buildOption(data: PuiChartData): PuiInternalEChartsOption;
  protected abstract resolveConfigTheme(): Partial<PuiChartTheme> | PuiChartThemePreset | undefined;

  constructor() {
    afterNextRender(() => {
      this.initialize();
    });

    effect(() => {
      if (!this.initialized) {
        return;
      }

      this.renderChart();
    });

    this.destroyRef.onDestroy(() => {
      this.teardown();
    });
  }

  private initialize(): void {
    const canvas = this.host.nativeElement.querySelector('.pui-chart__canvas, .pui-sparkline__canvas');

    if (!(canvas instanceof HTMLElement)) {
      return;
    }

    const option = this.buildOption(this.data());
    this.instance = this.adapter.create(canvas, option);

    if (!this.instance) {
      return;
    }

    this.disconnectResize = this.resizeService.observe(canvas, this.instance);
    this.initialized = true;
    this.syncLoadingState();
    this.syncAria();
  }

  private renderChart(): void {
    if (!this.instance) {
      return;
    }

    const option = this.buildOption(this.data());
    this.adapter.update(this.instance, option, { notMerge: true });
    this.syncLoadingState();
    this.syncAria();
  }

  protected resolveTheme() {
    const themeOverride = this.resolveConfigTheme();

    if (typeof themeOverride === 'string') {
      this.host.nativeElement.setAttribute('data-theme', themeOverride);
      return this.themeService.resolve(undefined, this.host.nativeElement);
    }

    return this.themeService.resolve(themeOverride, this.host.nativeElement);
  }

  private syncLoadingState(): void {
    if (!this.instance) {
      return;
    }

    if (this.loading()) {
      this.adapter.showLoading(this.instance);
      this.host.nativeElement.classList.add('pui-chart--loading');
      return;
    }

    this.adapter.hideLoading(this.instance);
    this.host.nativeElement.classList.remove('pui-chart--loading');
  }

  private syncAria(): void {
    const label = this.ariaLabel() ?? 'Chart visualization';
    this.host.nativeElement.setAttribute('role', 'img');
    this.host.nativeElement.setAttribute('aria-label', label);
    this.host.nativeElement.setAttribute('aria-busy', this.loading() ? 'true' : 'false');
  }

  private teardown(): void {
    this.disconnectResize?.();
    this.disconnectResize = null;

    if (this.instance) {
      this.adapter.dispose(this.instance);
      this.instance = null;
    }
  }
}
