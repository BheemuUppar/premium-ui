import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';
import { filter } from 'rxjs';
import { lockBodyScroll, unlockBodyScroll } from '../internal/scroll/scroll-lock.utils';
import type { PuiOverlayConfig } from './overlay-config.types';
import { PuiOverlayRef } from './overlay-ref';
import { PuiOverlayStackService } from './overlay-stack.service';
import {
  buildOverlayPositionStrategy,
  normalizePanelClasses,
  overlayPanelStyles,
  resolveOverlayPane,
} from './overlay.utils';

const PUI_OVERLAY_PANEL_CLASS = 'pui-overlay-panel';
const PUI_OVERLAY_BACKDROP_CLASS = 'pui-overlay-backdrop';

const DEFAULT_OVERLAY_CONFIG: PuiOverlayConfig = {
  backdrop: true,
  backdropClosable: true,
  closeOnEscape: true,
  position: 'center',
  scrollStrategy: 'block',
  role: 'dialog',
  disposeOnNavigation: true,
};

@Injectable({ providedIn: 'root' })
export class PuiOverlayService {
  private readonly overlay = inject(Overlay);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly stack = inject(PuiOverlayStackService);

  create(config?: PuiOverlayConfig): PuiOverlayRef | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const merged = { ...DEFAULT_OVERLAY_CONFIG, ...config };

    if (merged.scrollStrategy === 'block') {
      lockBodyScroll();
    }

    const overlayConfig = new OverlayConfig({
      hasBackdrop: merged.backdrop ?? true,
      backdropClass: [
        PUI_OVERLAY_BACKDROP_CLASS,
        ...normalizePanelClasses(merged.backdropClass),
      ],
      panelClass: [PUI_OVERLAY_PANEL_CLASS, ...normalizePanelClasses(merged.panelClass)],
      positionStrategy: buildOverlayPositionStrategy(
        () => this.overlay.position().global(),
        merged.position
      ),
      scrollStrategy: this.resolveScrollStrategy(merged.scrollStrategy),
      width: merged.size?.width,
      height: merged.size?.height,
      minWidth: merged.size?.minWidth,
      minHeight: merged.size?.minHeight,
      maxWidth: merged.size?.maxWidth,
      maxHeight: merged.size?.maxHeight,
      disposeOnNavigation: merged.disposeOnNavigation ?? true,
      usePopover: merged.usePopover,
    });

    const overlayRef = this.overlay.create(overlayConfig);

    const ref = new PuiOverlayRef(
      overlayRef,
      () => {
        if (merged.scrollStrategy === 'block') {
          unlockBodyScroll();
        }
        this.stack.pop(ref);
      },
      {
        position: merged.position,
        positionFactory: () => this.overlay.position().global(),
      }
    );

    const zIndex = this.stack.push(ref);
    overlayRef.overlayElement.style.zIndex = String(zIndex);

    Object.assign(resolveOverlayPane(overlayRef).style, overlayPanelStyles(merged.size));

    if (overlayRef.backdropElement) {
      overlayRef.backdropElement.style.zIndex = String(zIndex - 1);
    }

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

  private resolveScrollStrategy(strategy: PuiOverlayConfig['scrollStrategy']) {
    switch (strategy) {
      case 'reposition':
        return this.overlay.scrollStrategies.reposition();
      case 'noop':
        return this.overlay.scrollStrategies.noop();
      case 'block':
        // Body scroll is locked in create()/dispose via lockBodyScroll().
        return this.overlay.scrollStrategies.noop();
      default:
        return this.overlay.scrollStrategies.noop();
    }
  }
}
