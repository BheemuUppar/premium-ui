import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import {
  PUI_DATE_OVERLAY,
  type PuiDateOverlayHandle,
  type PuiDateOverlayOpenConfig,
  type PuiDateOverlayPort,
} from '@premium-ui/date';
import { PuiAnchoredOverlayService } from '../../overlay/anchored-overlay.service';

@Injectable({ providedIn: 'root' })
export class PuiDateOverlayBridgeService implements PuiDateOverlayPort {
  private readonly anchoredOverlay = inject(PuiAnchoredOverlayService);

  open(
    origin: HTMLElement,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    config: PuiDateOverlayOpenConfig = {}
  ): PuiDateOverlayHandle {
    const ref = this.anchoredOverlay.create(origin, {
      backdrop: config.backdrop,
      backdropClosable: config.backdropClosable,
      closeOnEscape: config.closeOnEscape,
      mobileSheet: config.mobileSheet,
      panelClass: ['pui-date-overlay-panel', ...(Array.isArray(config.panelClass) ? config.panelClass : config.panelClass ? [config.panelClass] : [])],
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      maxHeight: config.maxHeight,
    });

    if (!ref) {
      throw new Error('PuiDateOverlayBridgeService requires a browser environment.');
    }

    ref.attach(new TemplatePortal(template, viewContainerRef));

    return {
      close: () => ref.close(),
      afterClosed$: ref.afterClosed$,
      panelElement: ref.panelElement,
    };
  }
}

export function providePremiumUiDateOverlay() {
  return { provide: PUI_DATE_OVERLAY, useExisting: PuiDateOverlayBridgeService };
}
