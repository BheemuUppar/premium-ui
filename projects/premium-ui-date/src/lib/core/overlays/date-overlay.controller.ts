import { Injectable, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import {
  PUI_DATE_OVERLAY,
  PuiDateOverlayFallbackService,
  type PuiDateOverlayHandle,
  type PuiDateOverlayOpenConfig,
} from '../overlays/date-overlay.adapter';

@Injectable({ providedIn: 'root' })
export class PuiDateOverlayController {
  private readonly port = inject(PUI_DATE_OVERLAY, { optional: true }) ?? inject(PuiDateOverlayFallbackService);
  private handle: PuiDateOverlayHandle | null = null;

  open(
    origin: HTMLElement,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    config?: PuiDateOverlayOpenConfig
  ): PuiDateOverlayHandle {
    this.close();
    this.handle = this.port.open(origin, template, viewContainerRef, config);
    return this.handle;
  }

  close(): void {
    this.handle?.close();
    this.handle = null;
  }

  isOpen(): boolean {
    return this.handle != null;
  }
}
