import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { PuiChartThemeService } from '../themes/chart-theme.service';

/** Optional bootstrap helper for chart theme defaults. */
export function providePuiCharts(): EnvironmentProviders {
  return makeEnvironmentProviders([PuiChartThemeService]);
}
