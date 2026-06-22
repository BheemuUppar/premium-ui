import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { providePuiDate } from '@premium-ui/date';
import { providePremiumUiDateOverlay } from '../premium-ui/components/date/date-overlay-bridge.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    providePuiDate(),
    providePremiumUiDateOverlay(),
  ],
};
