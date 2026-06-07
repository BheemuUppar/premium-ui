import type { ComponentRef, EmbeddedViewRef } from '@angular/core';
import type { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import type { GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import type { PuiOverlayPosition, PuiOverlaySizeConfig } from './overlay-config.types';
import { buildOverlayPositionStrategy, resolveOverlayPane } from './overlay.utils';

export interface PuiOverlayRefOptions {
  readonly position?: PuiOverlayPosition;
  readonly positionFactory?: () => GlobalPositionStrategy;
}

export type PuiOverlayAttachResult<T = unknown> =
  | ComponentRef<T>
  | EmbeddedViewRef<unknown>
  | undefined;

export type PuiOverlayPortal<T = unknown> = ComponentPortal<T> | TemplatePortal;

export class PuiOverlayRef<T = unknown> {
  private readonly closedSubject = new Subject<void>();
  private readonly detachCallbacks: Array<() => void> = [];
  private disposed = false;
  private attachResult?: PuiOverlayAttachResult<T>;
  private position?: PuiOverlayPosition;

  readonly afterClosed$ = this.closedSubject.asObservable();

  constructor(
    private readonly overlayRef: OverlayRef,
    private readonly onDispose: () => void,
    private readonly options?: PuiOverlayRefOptions
  ) {
    this.position = options?.position;
  }

  get panelElement(): HTMLElement {
    return resolveOverlayPane(this.overlayRef);
  }

  attach(portal: PuiOverlayPortal<T>): PuiOverlayAttachResult<T> {
    const result = this.overlayRef.attach(portal) as PuiOverlayAttachResult<T>;
    this.attachResult = result;
    this.markOpen();
    return result;
  }

  setAttachResult(result: PuiOverlayAttachResult<T>): void {
    this.attachResult = result;
  }

  /** Register teardown for manually attached content (dialog host pattern). */
  onDetach(callback: () => void): void {
    this.detachCallbacks.push(callback);
  }

  private markOpen(): void {
    this.panelElement?.classList.add('pui-overlay-panel--open');
    this.overlayRef.backdropElement?.classList.add('pui-overlay-backdrop--open');
  }

  componentInstance(): T | undefined {
    const result = this.attachResult;
    return result && 'instance' in result ? (result.instance as T) : undefined;
  }

  close(): void {
    if (this.disposed) {
      return;
    }

    this.panelElement?.classList.remove('pui-overlay-panel--open');
    this.overlayRef.backdropElement?.classList.remove('pui-overlay-backdrop--open');

    window.setTimeout(() => this.dispose(), 180);
  }

  updateSize(size: Partial<PuiOverlaySizeConfig>): void {
    const pane = resolveOverlayPane(this.overlayRef);

    if (size.width) pane.style.width = size.width;
    if (size.height) pane.style.height = size.height;
    if (size.minWidth) pane.style.minWidth = size.minWidth;
    if (size.minHeight) pane.style.minHeight = size.minHeight;
    if (size.maxWidth) pane.style.maxWidth = size.maxWidth;
    if (size.maxHeight) pane.style.maxHeight = size.maxHeight;
  }

  updatePosition(position?: PuiOverlayPosition): void {
    if (position) {
      this.position = position;
    }

    if (this.options?.positionFactory && this.position) {
      this.overlayRef.updatePositionStrategy(
        buildOverlayPositionStrategy(this.options.positionFactory, this.position)
      );
    }

    this.overlayRef.updatePosition();
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    for (const detach of [...this.detachCallbacks].reverse()) {
      detach();
    }

    this.detachCallbacks.length = 0;
    this.attachResult = undefined;
    this.overlayRef.dispose();
    this.onDispose();
    this.closedSubject.next();
    this.closedSubject.complete();
  }

  backdropClick$() {
    return this.overlayRef.backdropClick();
  }

  keydownEvents$() {
    return this.overlayRef.keydownEvents();
  }
}
