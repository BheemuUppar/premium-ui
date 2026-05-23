import { InjectionToken } from '@angular/core';
import type { PuiToggleGroupComponent } from '../../components/toggle/toggle-group.component';

/** DI token for grouped toggle selection coordination. */
export const PUI_TOGGLE_GROUP = new InjectionToken<PuiToggleGroupComponent>('PUI_TOGGLE_GROUP');
