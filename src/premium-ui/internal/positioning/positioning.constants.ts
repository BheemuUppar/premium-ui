import { ConnectedPosition } from '@angular/cdk/overlay';

export const PUI_OVERLAY_OFFSET = 4;

export const PUI_DROPDOWN_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: PUI_OVERLAY_OFFSET,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -PUI_OVERLAY_OFFSET,
  },
];
