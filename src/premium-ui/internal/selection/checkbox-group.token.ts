import { InjectionToken } from '@angular/core';
import type { PuiCheckboxGroupComponent } from '../../components/checkbox/checkbox-group.component';

/** DI token for grouped checkbox selection coordination. */
export const PUI_CHECKBOX_GROUP = new InjectionToken<PuiCheckboxGroupComponent>('PUI_CHECKBOX_GROUP');
