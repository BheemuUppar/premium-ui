import { isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  PLATFORM_ID,
  TemplateRef,
  createEnvironmentInjector,
  inject,
  signal,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';
import { PuiOverlayService } from '../../overlay';
import type { PuiOverlayRef } from '../../overlay';
import { createFocusTrap, focusFirstFocusable } from '../../internal/accessibility/focus-trap.utils';
import { focusElementWithoutScroll } from '../../internal/accessibility/focus.utils';
import {
  PUI_COMMAND_DEFAULT_PALETTE_CONFIG,
  type PuiCommand,
  type PuiCommandPaletteConfig,
} from '../registry/command.types';
import { PuiCommandPaletteComponent } from '../palette/command-palette.component';
import { PUI_COMMAND_PALETTE_CONFIG, PUI_COMMAND_PALETTE_ITEM_TEMPLATE } from '../palette/command-palette.tokens';
import { PuiCommandShortcutService } from './command-shortcut.service';
import {
  resolveCommandPaletteBackdropClass,
  resolveCommandPalettePanelClass,
  PUI_COMMAND_PALETTE_CLOSE_MS,
  usesCursorTransformOrigin,
} from '../utils/command-palette-animation.utils';
import {
  resolvePalettePositionAtPointer,
  resolvePalettePositionCentered,
  type PuiCommandPaletteResolvedPosition,
} from '../utils/command-palette-position.utils';

export interface PuiCommandPaletteOpenConfig extends PuiCommandPaletteConfig {
  readonly itemTemplate?: TemplateRef<{ $implicit: PuiCommand }>;
}

const PALETTE_WIDTH_PX = 640;
const PALETTE_MAX_HEIGHT_PX = 420;

@Injectable({ providedIn: 'root' })
export class PuiCommandPaletteService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly overlayService = inject(PuiOverlayService);
  private readonly shortcutService = inject(PuiCommandShortcutService);
  private readonly applicationRef = inject(ApplicationRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly environmentInjector = inject(EnvironmentInjector);

  private overlayRef: PuiOverlayRef | null = null;
  private focusTrap: ReturnType<typeof createFocusTrap> | null = null;
  private detachSubscription: Subscription | null = null;
  private lastTrigger: HTMLElement | null = null;
  private shortcutsRegistered = false;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  readonly isOpen = signal(false);
  readonly config = signal<Required<PuiCommandPaletteConfig>>(PUI_COMMAND_DEFAULT_PALETTE_CONFIG);

  registerShortcuts(shortcuts: readonly string[] = ['meta+k', 'ctrl+k']): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.shortcutService.configure(shortcuts);
    this.shortcutService.trackPointer();

    if (this.shortcutsRegistered) {
      return;
    }

    this.shortcutsRegistered = true;
    this.shortcutService.listen(() => this.toggle());
  }

  open(config?: PuiCommandPaletteOpenConfig): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.isOpen()) {
      return;
    }

    const merged: Required<PuiCommandPaletteConfig> = {
      ...PUI_COMMAND_DEFAULT_PALETTE_CONFIG,
      ...config,
    };

    this.config.set(merged);
    this.lastTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const resolvedPosition = this.resolveOpenPosition(merged);
    const panelClasses = ['pui-command-palette-panel'];
    const panelModifier = resolveCommandPalettePanelClass(merged.animation);

    if (panelModifier) {
      panelClasses.push(panelModifier);
    }

    const backdropClasses = ['pui-command-palette-backdrop'];
    const backdropModifier = resolveCommandPaletteBackdropClass(merged.animation);

    if (backdropModifier) {
      backdropClasses.push(backdropModifier);
    }

    const overlayRef = this.overlayService.create({
      position: {
        top: `${resolvedPosition.top}px`,
        left: `${resolvedPosition.left}px`,
      },
      backdrop: true,
      backdropClosable: true,
      closeOnEscape: false,
      scrollStrategy: 'block',
      panelClass: panelClasses,
      backdropClass: backdropClasses,
      size: {
        width: `${PALETTE_WIDTH_PX}px`,
        maxWidth: `${PALETTE_WIDTH_PX}px`,
      },
    });

    if (!overlayRef) {
      return;
    }

    this.overlayRef = overlayRef;

    const injector = this.createPaletteInjector(merged, config?.itemTemplate);
    const portal = new ComponentPortal(PuiCommandPaletteComponent, null, injector);
    overlayRef.attach(portal);

    this.applyAnimationOrigin(overlayRef, resolvedPosition, merged.animation);
    this.playOpenAnimation(overlayRef);

    this.applicationRef.tick();
    this.isOpen.set(true);

    const element = overlayRef.panelElement.querySelector('.pui-command-palette') as HTMLElement | null;

    if (element) {
      this.focusTrap = createFocusTrap(this.focusTrapFactory, element, true);
      queueMicrotask(() => {
        this.focusTrap?.focusInitialElementWhenReady().catch(() => focusFirstFocusable(element));
      });
    }

    this.detachSubscription = new Subscription();

    this.detachSubscription.add(
      overlayRef.backdropClick$().subscribe(() => {
        this.close();
      })
    );

    overlayRef.onDetach(() => {
      this.teardown();
    });
  }

  close(): void {
    if (!this.isOpen() || !this.overlayRef) {
      return;
    }

    const ref = this.overlayRef;
    const pane = ref.panelElement;
    const backdrop = this.resolveBackdrop();

    pane.classList.remove('pui-overlay-panel--open');
    pane.classList.add('pui-command-palette-panel--closing');
    backdrop?.classList.remove('pui-overlay-backdrop--open');
    backdrop?.classList.add('pui-command-palette-backdrop--closing');

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }

    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      ref.dispose();
    }, PUI_COMMAND_PALETTE_CLOSE_MS[this.config().animation]);
  }

  toggle(config?: PuiCommandPaletteOpenConfig): void {
    if (this.isOpen()) {
      this.close();
      return;
    }

    this.open(config);
  }

  private resolveOpenPosition(config: Required<PuiCommandPaletteConfig>): PuiCommandPaletteResolvedPosition {
    const layout = { width: PALETTE_WIDTH_PX, maxHeight: PALETTE_MAX_HEIGHT_PX };

    if (!config.positionAtCursor) {
      return resolvePalettePositionCentered(layout);
    }

    return resolvePalettePositionAtPointer(this.shortcutService.getLastPointer(), layout);
  }

  private applyAnimationOrigin(
    overlayRef: PuiOverlayRef,
    position: PuiCommandPaletteResolvedPosition,
    animation: Required<PuiCommandPaletteConfig>['animation']
  ): void {
    const pane = overlayRef.panelElement;

    if (usesCursorTransformOrigin(animation)) {
      pane.style.setProperty('--pui-command-palette-origin-x', `${position.originX}px`);
      pane.style.setProperty('--pui-command-palette-origin-y', `${position.originY}px`);
      pane.style.transformOrigin = `${position.originX}px ${position.originY}px`;
    }
  }

  private playOpenAnimation(overlayRef: PuiOverlayRef): void {
    const pane = overlayRef.panelElement;
    const backdrop = this.resolveBackdrop();

    pane.classList.remove('pui-overlay-panel--open', 'pui-command-palette-panel--closing');
    backdrop?.classList.remove('pui-overlay-backdrop--open', 'pui-command-palette-backdrop--closing');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pane.classList.add('pui-overlay-panel--open');
        backdrop?.classList.add('pui-overlay-backdrop--open');
      });
    });
  }

  private resolveBackdrop(): HTMLElement | null {
    return document.querySelector('.pui-command-palette-backdrop');
  }

  private teardown(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    this.focusTrap?.destroy();
    this.focusTrap = null;
    this.detachSubscription?.unsubscribe();
    this.detachSubscription = null;
    this.overlayRef = null;
    this.isOpen.set(false);

    if (this.lastTrigger) {
      focusElementWithoutScroll(this.lastTrigger);
      this.lastTrigger = null;
    }
  }

  private createPaletteInjector(
    config: Required<PuiCommandPaletteConfig>,
    itemTemplate?: TemplateRef<{ $implicit: PuiCommand }>
  ): Injector {
    return createEnvironmentInjector(
      [
        { provide: PUI_COMMAND_PALETTE_CONFIG, useValue: config },
        ...(itemTemplate ? [{ provide: PUI_COMMAND_PALETTE_ITEM_TEMPLATE, useValue: itemTemplate }] : []),
      ],
      this.environmentInjector
    );
  }
}
