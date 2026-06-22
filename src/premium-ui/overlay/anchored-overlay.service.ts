import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';
import { filter } from 'rxjs';
import { PUI_DROPDOWN_POSITIONS } from '../internal/positioning';
import { lockBodyScroll, unlockBodyScroll } from '../internal/scroll/scroll-lock.utils';
import type { PuiAnchoredOverlayConfig } from './anchored-overlay.types';
import { PuiOverlayRef } from './overlay-ref';
import { PuiOverlayStackService } from './overlay-stack.service';
import { normalizePanelClasses, resolveOverlayPane } from './overlay.utils';

const PUI_OVERLAY_PANEL_CLASS = 'pui-overlay-panel';
const PUI_OVERLAY_BACKDROP_CLASS = 'pui-overlay-backdrop';
const PUI_ANCHORED_BACKDROP_CLASS = 'pui-overlay-backdrop--anchored';

const DEFAULT_ANCHORED_CONFIG: Required<
  Pick<PuiAnchoredOverlayConfig, 'backdrop' | 'backdropClosable' | 'closeOnEscape' | 'scrollStrategy' | 'mobileSheet'>
> = {
  backdrop: true,
  backdropClosable: true,
  closeOnEscape: true,
  scrollStrategy: 'reposition',
  mobileSheet: false,
};

@Injectable({ providedIn: 'root' })
export class PuiAnchoredOverlayService {
  private readonly overlay = inject(Overlay);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly stack = inject(PuiOverlayStackService);

  /** Opens an anchored overlay attached to a trigger element. */
  create(origin: HTMLElement, config?: PuiAnchoredOverlayConfig): PuiOverlayRef | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const merged = { ...DEFAULT_ANCHORED_CONFIG, ...config };
    const positions = [...(merged.mobileSheet
      ? [{ originX: 'center' as const, originY: 'bottom' as const, overlayX: 'center' as const, overlayY: 'bottom' as const }]
      : (config?.positions ?? PUI_DROPDOWN_POSITIONS))];

    if (merged.mobileSheet && merged.scrollStrategy === 'reposition') {
      lockBodyScroll();
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(positions)
      .withPush(true)
      .withViewportMargin(12)
      .withFlexibleDimensions(false)
      .withGrowAfterOpen(true);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: merged.backdrop,
      backdropClass: [
        PUI_OVERLAY_BACKDROP_CLASS,
        PUI_ANCHORED_BACKDROP_CLASS,
        ...(merged.mobileSheet ? [] : ['pui-overlay-backdrop--transparent']),
        ...normalizePanelClasses(merged.backdropClass),
      ],
      panelClass: [
        PUI_OVERLAY_PANEL_CLASS,
        'pui-overlay-panel--anchored',
        ...(merged.mobileSheet ? ['pui-overlay-panel--sheet'] : []),
        ...normalizePanelClasses(merged.panelClass),
      ],
      positionStrategy,
      scrollStrategy:
        merged.scrollStrategy === 'reposition'
          ? this.overlay.scrollStrategies.reposition()
          : this.overlay.scrollStrategies.noop(),
      width: merged.width,
      minWidth: merged.minWidth,
      maxWidth: merged.maxWidth,
      maxHeight: merged.maxHeight,
      disposeOnNavigation: true,
    });

    const overlayRef = this.overlay.create(overlayConfig);

    const ref = new PuiOverlayRef(overlayRef, () => {
      if (merged.mobileSheet && merged.scrollStrategy === 'reposition') {
        unlockBodyScroll();
      }
      this.stack.pop(ref);
    });

    const zIndex = this.stack.push(ref);
    overlayRef.overlayElement.style.zIndex = String(zIndex);
    if (overlayRef.backdropElement) {
      overlayRef.backdropElement.style.zIndex = String(zIndex - 1);
    }

    const pane = resolveOverlayPane(overlayRef);
    if (merged.minWidth) pane.style.minWidth = merged.minWidth;
    if (merged.maxWidth) pane.style.maxWidth = merged.maxWidth;
    if (merged.maxHeight) pane.style.maxHeight = merged.maxHeight;

    if (merged.backdropClosable) {
      ref.backdropClick$().subscribe(() => {
        if (this.stack.isTopMost(ref)) {
          ref.close();
        }
      });
    }

    if (merged.closeOnEscape) {
      ref
        .keydownEvents$()
        .pipe(filter((event) => event.keyCode === ESCAPE))
        .subscribe(() => {
          if (this.stack.isTopMost(ref)) {
            ref.close();
          }
        });
    }

    return ref;
  }
}
