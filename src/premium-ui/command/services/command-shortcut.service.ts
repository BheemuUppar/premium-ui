import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core';
import type { PuiCommandPointer } from '../utils/command-palette-position.utils';
import {
  matchesCommandShortcut,
  parseCommandShortcut,
  type PuiCommandShortcutBinding,
} from '../utils/command-shortcut.utils';

const DEFAULT_SHORTCUTS = ['meta+k', 'ctrl+k'];

@Injectable({ providedIn: 'root' })
export class PuiCommandShortcutService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private bindings: readonly PuiCommandShortcutBinding[] = DEFAULT_SHORTCUTS
    .map(parseCommandShortcut)
    .filter((binding): binding is PuiCommandShortcutBinding => binding !== null);

  private handler: ((event: KeyboardEvent) => void) | null = null;
  private pointerHandler: ((event: PointerEvent) => void) | null = null;
  private listenerCount = 0;
  private pointerListenerCount = 0;

  private lastPointer: PuiCommandPointer = { x: 0, y: 0 };
  private pointerInitialized = false;

  configure(shortcuts: readonly string[]): void {
    this.bindings = shortcuts
      .map(parseCommandShortcut)
      .filter((binding): binding is PuiCommandShortcutBinding => binding !== null);
  }

  getLastPointer(): PuiCommandPointer {
    if (!this.pointerInitialized && isPlatformBrowser(this.platformId)) {
      this.lastPointer = {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.22,
      };
    }

    return this.lastPointer;
  }

  /** Registers a document-level listener. Reference-counted for SSR safety. */
  listen(onTrigger: () => void): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.listenerCount += 1;
    this.ensurePointerTracking();

    if (this.handler) {
      return;
    }

    this.handler = (event: KeyboardEvent) => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        const hasModifier = event.metaKey || event.ctrlKey;
        if (!hasModifier) {
          return;
        }
      }

      for (const binding of this.bindings) {
        if (matchesCommandShortcut(event, binding)) {
          event.preventDefault();
          event.stopPropagation();
          onTrigger();
          return;
        }
      }
    };

    document.addEventListener('keydown', this.handler, { capture: true });

    this.destroyRef.onDestroy(() => this.teardownIfIdle());
  }

  /** Tracks pointer for cursor-anchored palette positioning. */
  trackPointer(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.pointerListenerCount += 1;
    this.ensurePointerTracking();
  }

  untrackPointer(): void {
    this.pointerListenerCount = Math.max(0, this.pointerListenerCount - 1);
    this.teardownPointerIfIdle();
  }

  release(): void {
    this.listenerCount = Math.max(0, this.listenerCount - 1);
    this.teardownIfIdle();
  }

  private ensurePointerTracking(): void {
    if (!isPlatformBrowser(this.platformId) || this.pointerHandler) {
      return;
    }

    this.pointerHandler = (event: PointerEvent) => {
      this.lastPointer = { x: event.clientX, y: event.clientY };
      this.pointerInitialized = true;
    };

    document.addEventListener('pointermove', this.pointerHandler, { passive: true });
    document.addEventListener('pointerdown', this.pointerHandler, { passive: true });
  }

  private teardownIfIdle(): void {
    if (this.listenerCount > 0 || !this.handler || !isPlatformBrowser(this.platformId)) {
      return;
    }

    document.removeEventListener('keydown', this.handler, { capture: true });
    this.handler = null;
    this.teardownPointerIfIdle();
  }

  private teardownPointerIfIdle(): void {
    if (this.pointerListenerCount > 0 || this.listenerCount > 0 || !this.pointerHandler) {
      return;
    }

    document.removeEventListener('pointermove', this.pointerHandler);
    document.removeEventListener('pointerdown', this.pointerHandler);
    this.pointerHandler = null;
  }
}
