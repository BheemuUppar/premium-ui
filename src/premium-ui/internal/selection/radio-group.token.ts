import { InjectionToken } from '@angular/core';
import type { PuiRadioGroupComponent } from '../../components/radio/radio-group.component';

/** DI token for grouped radio selection coordination. */
export const PUI_RADIO_GROUP = new InjectionToken<PuiRadioGroupComponent>('PUI_RADIO_GROUP');
