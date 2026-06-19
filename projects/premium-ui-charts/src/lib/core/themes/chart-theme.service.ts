import { Injectable, inject, signal } from '@angular/core';
import {
  PUI_CHART_DEFAULT_THEME,
  resolveChartTheme,
  resolveThemeColors,
} from './chart-theme.defaults';
import type { PuiChartTheme } from '../interfaces/chart-theme.types';

@Injectable({ providedIn: 'root' })
export class PuiChartThemeService {
  private readonly globalTheme = signal<PuiChartTheme>(PUI_CHART_DEFAULT_THEME);

  setGlobalTheme(theme: Partial<PuiChartTheme>): void {
    this.globalTheme.set(resolveChartTheme(theme));
  }

  resolve(override?: Partial<PuiChartTheme>, host?: HTMLElement | null): PuiChartTheme {
    const merged = resolveChartTheme({
      ...this.globalTheme(),
      ...override,
      palette: override?.palette ?? this.globalTheme().palette,
    });

    return resolveThemeColors(merged, host);
  }
}
