import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Injectable,
  InjectionToken,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { filter, Subject, type Observable } from 'rxjs';
import { PUI_DATE_OVERLAY_POSITIONS, PUI_DATE_MOBILE_SHEET_POSITIONS } from './date-overlay.constants';

export interface PuiDateOverlayOpenConfig {
  readonly backdrop?: boolean;
  readonly backdropClosable?: boolean;
  readonly closeOnEscape?: boolean;
  readonly mobileSheet?: boolean;
  readonly panelClass?: string | readonly string[];
  readonly minWidth?: string;
  readonly maxWidth?: string;
  readonly maxHeight?: string;
}

export interface PuiDateOverlayHandle {
  close(): void;
  readonly afterClosed$: Observable<void>;
  readonly panelElement: HTMLElement;
}

export interface PuiDateOverlayPort {
  open(
    origin: HTMLElement,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    config?: PuiDateOverlayOpenConfig
  ): PuiDateOverlayHandle;
}

export const PUI_DATE_OVERLAY = new InjectionToken<PuiDateOverlayPort>('PUI_DATE_OVERLAY');

const PANEL_CLASS = 'pui-overlay-panel';
const BACKDROP_CLASS = 'pui-overlay-backdrop';
const ANCHORED_BACKDROP = 'pui-overlay-backdrop--anchored';
const TRANSPARENT_BACKDROP = 'pui-overlay-backdrop--transparent';

function normalizeClasses(value?: string | readonly string[]): string[] {
  if (value == null) {
    return [];
  }
  if (typeof value === 'string') {
    return [value];
  }
  return [...value];
}

@Injectable({ providedIn: 'root' })
export class PuiDateOverlayFallbackService implements PuiDateOverlayPort {
  private readonly overlay = inject(Overlay);
  private zIndex = 1300;

  open(
    origin: HTMLElement,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    config: PuiDateOverlayOpenConfig = {}
  ): PuiDateOverlayHandle {
    const merged = {
      backdrop: true,
      backdropClosable: true,
      closeOnEscape: true,
      mobileSheet: false,
      ...config,
    };

    const positions = merged.mobileSheet ? [...PUI_DATE_MOBILE_SHEET_POSITIONS] : [...PUI_DATE_OVERLAY_POSITIONS];

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(positions)
      .withPush(true)
      .withViewportMargin(12)
      .withFlexibleDimensions(false)
      .withGrowAfterOpen(true);

    const overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: merged.backdrop,
        backdropClass: [
          BACKDROP_CLASS,
          ANCHORED_BACKDROP,
          ...(merged.mobileSheet ? [] : [TRANSPARENT_BACKDROP]),
        ],
        panelClass: [
          PANEL_CLASS,
          'pui-overlay-panel--anchored',
          'pui-date-overlay-panel',
          ...(merged.mobileSheet ? ['pui-overlay-panel--sheet'] : []),
          ...normalizeClasses(merged.panelClass),
        ],
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        minWidth: merged.minWidth,
        maxWidth: merged.maxWidth,
        maxHeight: merged.maxHeight,
        disposeOnNavigation: true,
      })
    );

    this.zIndex += 20;
    overlayRef.overlayElement.style.zIndex = String(this.zIndex);
    if (overlayRef.backdropElement) {
      overlayRef.backdropElement.style.zIndex = String(this.zIndex - 1);
    }

    const portal = new TemplatePortal(template, viewContainerRef);
    overlayRef.attach(portal);

    const pane = overlayRef.overlayElement.querySelector('.cdk-overlay-pane') as HTMLElement | null;
    const panelElement = pane ?? overlayRef.overlayElement;
    panelElement.classList.add('pui-overlay-panel--open');
    overlayRef.backdropElement?.classList.add('pui-overlay-backdrop--open');

    let disposed = false;
    const closedSubject = new Subject<void>();

    const close = (): void => {
      if (disposed) {
        return;
      }
      panelElement.classList.remove('pui-overlay-panel--open');
      overlayRef.backdropElement?.classList.remove('pui-overlay-backdrop--open');
      window.setTimeout(() => {
        if (!disposed) {
          disposed = true;
          overlayRef.dispose();
          closedSubject.next();
          closedSubject.complete();
        }
      }, 180);
    };

    if (merged.backdropClosable) {
      overlayRef.backdropClick().subscribe(() => close());
    }

    if (merged.closeOnEscape) {
      overlayRef
        .keydownEvents()
        .pipe(filter((event) => event.keyCode === ESCAPE))
        .subscribe(() => close());
    }

    return {
      close,
      afterClosed$: closedSubject.asObservable(),
      panelElement,
    };
  }
}
