import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { PuiDateEngineService } from './date-engine.service';

export function providePuiDate(): EnvironmentProviders {
  return makeEnvironmentProviders([PuiDateEngineService]);
}
