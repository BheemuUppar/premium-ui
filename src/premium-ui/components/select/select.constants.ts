import { ConnectedPosition } from '@angular/cdk/overlay';

export const PUI_SELECT_DEFAULT_ITEM_HEIGHT = 36;
export const PUI_SELECT_DEFAULT_MAX_PANEL_HEIGHT = 280;
export const PUI_SELECT_SEARCH_DEBOUNCE_MS = 200;
export const PUI_SELECT_TYPEAHEAD_RESET_MS = 500;

export const PUI_SELECT_OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 4,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -4,
  },
];
