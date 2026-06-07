import type { ComponentRef, EmbeddedViewRef } from '@angular/core';
import type { Observable } from 'rxjs';
import { EMPTY, Subject } from 'rxjs';
import type { PuiOverlayRef } from '../../overlay';
import type { PuiDialogSizeUpdate } from './dialog.types';
import type { PuiOverlayPosition } from '../../overlay';

/**
 * Reference to an open dialog — mirrors Angular Material MatDialogRef lifecycle.
 *
 * @typeParam TComponent — Component instance type (component dialogs).
 * @typeParam TResult — Value passed to `close()` and emitted to observers.
 */
export class PuiDialogRef<TComponent = unknown, TResult = unknown> {
  private readonly afterOpenedSubject = new Subject<void>();
  private readonly beforeClosedSubject = new Subject<TResult | undefined>();
  private readonly afterClosedSubject = new Subject<TResult | undefined>();
  private closed = false;
  private opened = false;
  private result?: TResult;
  private contentRef?: ComponentRef<TComponent> | EmbeddedViewRef<unknown>;

  constructor(
    private readonly overlayRef: PuiOverlayRef<unknown> | null,
    private readonly onClose?: (result?: TResult) => void
  ) {
    this.overlayRef?.afterClosed$.subscribe(() => this.emitAfterClosed());
  }

  /** Live component instance when opened via `open(ComponentType)`. */
  get componentInstance(): TComponent | undefined {
    const ref = this.contentRef;
    return ref && 'instance' in ref ? ref.instance : undefined;
  }

  isClosed(): boolean {
    return this.closed;
  }

  /** @internal Set by PuiDialogService after content is attached inside the container. */
  attachContent(ref: ComponentRef<TComponent> | EmbeddedViewRef<unknown>): void {
    this.contentRef = ref;
  }

  close(result?: TResult): void {
    if (this.closed) {
      return;
    }

    this.closed = true;
    this.result = result;
    this.beforeClosedSubject.next(result);
    this.beforeClosedSubject.complete();
    this.onClose?.(result);
    this.overlayRef?.close();
  }

  /** @internal Called by the service once the container and content are ready. */
  markOpened(): void {
    if (this.opened || this.closed) {
      return;
    }

    this.opened = true;
    this.afterOpenedSubject.next();
    this.afterOpenedSubject.complete();
  }

  private emitAfterClosed(): void {
    if (this.afterClosedSubject.closed) {
      return;
    }

    this.afterClosedSubject.next(this.result);
    this.afterClosedSubject.complete();
  }

  afterOpened(): Observable<void> {
    return this.afterOpenedSubject.asObservable();
  }

  beforeClosed(): Observable<TResult | undefined> {
    return this.beforeClosedSubject.asObservable();
  }

  afterClosed(): Observable<TResult | undefined> {
    return this.afterClosedSubject.asObservable();
  }

  backdropClick(): Observable<MouseEvent> {
    return this.overlayRef?.backdropClick$() ?? EMPTY;
  }

  keydownEvents(): Observable<KeyboardEvent> {
    return this.overlayRef?.keydownEvents$() ?? EMPTY;
  }

  updateSize(size: PuiDialogSizeUpdate): void {
    this.overlayRef?.updateSize(size);
  }

  updatePosition(position?: PuiOverlayPosition): void {
    this.overlayRef?.updatePosition(position);
  }
}
