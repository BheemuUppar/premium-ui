import {
  ApplicationRef,
  type ComponentRef,
  type EmbeddedViewRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  TemplateRef,
  ViewContainerRef,
  createEnvironmentInjector,
  inject,
  type Type,
} from '@angular/core';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Subscription, filter, firstValueFrom, map } from 'rxjs';
import { PuiOverlayService, type PuiOverlayRef } from '../../overlay';
import { createFocusTrap, focusFirstFocusable } from '../../internal/accessibility/focus-trap.utils';
import { focusElementWithoutScroll } from '../../internal/accessibility/focus.utils';
import { resolveDialogConfig } from './dialog-config.utils';
import { PuiDialogContainerComponent } from './dialog-container.component';
import { PuiDialogRef } from './dialog-ref';
import { PUI_DIALOG_DATA, PUI_DIALOG_REF, PUI_DIALOG_VARIANT } from './dialog.tokens';
import type { PuiDialogConfig, PuiDialogConfirmConfig, PuiDialogSizeUpdate } from './dialog.types';
import { PuiDialogConfirmComponent } from './confirm-dialog/confirm-dialog.component';
import type { PuiOverlayPosition } from '../../overlay';

type PuiDialogContentRef<T> = ComponentRef<T> | EmbeddedViewRef<unknown>;

@Injectable({ providedIn: 'root' })
export class PuiDialogService {
  private readonly overlayService = inject(PuiOverlayService);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly applicationRef = inject(ApplicationRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);

  private readonly openRefs: PuiDialogRef<unknown, unknown>[] = [];
  private lastTrigger: HTMLElement | null = null;

  open<TComponent = unknown, TData = unknown, TResult = unknown>(
    content: Type<TComponent> | TemplateRef<unknown>,
    config?: PuiDialogConfig<TData>,
    viewContainerRef?: ViewContainerRef
  ): PuiDialogRef<TComponent, TResult> {
    const resolved = resolveDialogConfig(config);
    const overlayRef = this.overlayService.create({
      ...resolved,
      position: resolved.position ?? 'center',
      backdropClosable: false,
      closeOnEscape: false,
      usePopover: false,
    });

    const dialogRef = new PuiDialogRef<TComponent, TResult>(overlayRef, () => {
      const index = this.openRefs.indexOf(dialogRef as PuiDialogRef<unknown, unknown>);
      if (index >= 0) {
        this.openRefs.splice(index, 1);
      }

      if (this.openRefs.length === 0 && this.lastTrigger) {
        focusElementWithoutScroll(this.lastTrigger);
        this.lastTrigger = null;
      }
    });

    if (!overlayRef) {
      return dialogRef;
    }

    if (this.openRefs.length === 0) {
      this.lastTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }

    const injector = this.createDialogInjector(dialogRef, resolved.data, resolved.variant);
    const containerRef = this.attachContainer(overlayRef, injector);

    if (!containerRef) {
      overlayRef.close();
      return dialogRef;
    }

    containerRef.changeDetectorRef.detectChanges();

    const contentRef = this.attachContent(
      containerRef.instance,
      content,
      injector,
      dialogRef,
      resolved,
      viewContainerRef
    );

    if (!contentRef) {
      containerRef.destroy();
      overlayRef.close();
      return dialogRef;
    }

    dialogRef.attachContent(contentRef as PuiDialogContentRef<TComponent>);
    this.runChangeDetection(containerRef, contentRef);
    this.applicationRef.tick();
    dialogRef.markOpened();

    const eventSubscriptions = this.wireDialogEvents(dialogRef, resolved);
    const trap = this.createFocusTrap(containerRef.location.nativeElement);

    overlayRef.onDetach(() => {
      eventSubscriptions.unsubscribe();
      trap.destroy();
      contentRef.destroy();
      containerRef.destroy();
    });

    this.openRefs.push(dialogRef as PuiDialogRef<unknown, unknown>);

    return dialogRef;
  }

  close<TResult = unknown>(result?: TResult): void {
    this.openRefs.at(-1)?.close(result);
  }

  closeAll(): void {
    [...this.openRefs].reverse().forEach((ref) => ref.close());
  }

  updateSize(size: PuiDialogSizeUpdate): void {
    this.openRefs.at(-1)?.updateSize(size);
  }

  updatePosition(position?: PuiOverlayPosition): void {
    this.openRefs.at(-1)?.updatePosition(position);
  }

  confirm(config: PuiDialogConfirmConfig): Promise<boolean> {
    const dialogRef = this.open<PuiDialogConfirmComponent, PuiDialogConfirmConfig, boolean>(
      PuiDialogConfirmComponent,
      {
        data: config,
        variant: config.variant === 'danger' ? 'danger' : 'confirm',
        size: config.width ? { width: config.width } : undefined,
        backdropClosable: false,
      }
    );

    return firstValueFrom(dialogRef.afterClosed().pipe(map((result) => result === true)));
  }

  private attachContainer(
    overlayRef: PuiOverlayRef,
    injector: Injector
  ): ComponentRef<PuiDialogContainerComponent> | undefined {
    const portal = new ComponentPortal(PuiDialogContainerComponent, null, injector);
    return overlayRef.attach(portal) as ComponentRef<PuiDialogContainerComponent> | undefined;
  }

  private attachContent<TComponent, TData, TResult>(
    container: PuiDialogContainerComponent,
    content: Type<TComponent> | TemplateRef<unknown>,
    injector: Injector,
    dialogRef: PuiDialogRef<TComponent, TResult>,
    config: PuiDialogConfig<TData>,
    viewContainerRef?: ViewContainerRef
  ): PuiDialogContentRef<TComponent> | undefined {
    if (content instanceof TemplateRef) {
      const vcr = config.viewContainerRef ?? viewContainerRef;
      if (!vcr) {
        throw new Error(
          'PuiDialogService.open(template) requires config.viewContainerRef or the viewContainerRef argument.'
        );
      }

      const portal = new TemplatePortal(content, vcr, {
        ...config.context,
        dialogRef,
        $implicit: dialogRef,
      });

      return container.attachTemplatePortal(portal) as EmbeddedViewRef<unknown>;
    }

    const portal = new ComponentPortal(content, null, injector);
    return container.attachComponentPortal(portal);
  }

  private wireDialogEvents<TComponent, TResult>(
    dialogRef: PuiDialogRef<TComponent, TResult>,
    config: PuiDialogConfig
  ): Subscription {
    const subscriptions = new Subscription();

    if (config.backdropClosable) {
      subscriptions.add(
        dialogRef.backdropClick().subscribe(() => {
          if (this.isTopMost(dialogRef)) {
            dialogRef.close();
          }
        })
      );
    }

    if (config.closeOnEscape) {
      subscriptions.add(
        dialogRef
          .keydownEvents()
          .pipe(filter((event) => event.keyCode === ESCAPE))
          .subscribe(() => {
            if (this.isTopMost(dialogRef)) {
              dialogRef.close();
            }
          })
      );
    }

    return subscriptions;
  }

  private isTopMost<TComponent, TResult>(dialogRef: PuiDialogRef<TComponent, TResult>): boolean {
    return this.openRefs.at(-1) === dialogRef;
  }

  private createFocusTrap(element: HTMLElement) {
    const trap = createFocusTrap(this.focusTrapFactory, element, false);
    queueMicrotask(() => {
      trap.focusInitialElementWhenReady().catch(() => focusFirstFocusable(element));
    });
    return trap;
  }

  private createDialogInjector<TComponent, TResult, TData>(
    dialogRef: PuiDialogRef<TComponent, TResult>,
    data: TData | undefined,
    variant: PuiDialogConfig['variant']
  ): Injector {
    return createEnvironmentInjector(
      [
        { provide: PUI_DIALOG_REF, useValue: dialogRef },
        { provide: PuiDialogRef, useValue: dialogRef },
        { provide: PUI_DIALOG_DATA, useValue: data },
        { provide: PUI_DIALOG_VARIANT, useValue: variant ?? 'default' },
      ],
      this.environmentInjector
    );
  }

  private runChangeDetection(
    containerRef: ComponentRef<PuiDialogContainerComponent>,
    contentRef: PuiDialogContentRef<unknown>
  ): void {
    containerRef.changeDetectorRef.detectChanges();

    if ('changeDetectorRef' in contentRef) {
      contentRef.changeDetectorRef.detectChanges();
      return;
    }

    contentRef.detectChanges();
  }
}
