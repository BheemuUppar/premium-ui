import { InjectionToken } from '@angular/core';
import type { PuiTabsComponent } from '../../components/tabs/tabs.component';

/** DI token for tab list coordination between pui-tabs, pui-tab-item, and pui-tab-panel. */
export const PUI_TABS = new InjectionToken<PuiTabsComponent>('PUI_TABS');
