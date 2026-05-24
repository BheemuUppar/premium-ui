import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import {
  PUI_TOAST_EXIT_MS,
  buildToastData,
  groupToastsByPosition,
  isToastDismissible,
  normalizeToastInput,
  resolveToastDuration,
  resolveToastIcon,
  shouldShowToastIcon,
  trimToastsForPosition,
} from './toast.utils';
import type {
  PuiToastData,
  PuiToastMessage,
  PuiToastOptions,
  PuiToastPromiseMessages,
  PuiToastVariant,
} from './toast.types';

type TimerHandle = ReturnType<typeof setTimeout>;

@Injectable({ providedIn: 'root' })
export class PuiToastService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toasts = signal<readonly PuiToastData[]>([]);
  private readonly timers = new Map<string, TimerHandle>();
  private readonly exitTimers = new Map<string, TimerHandle>();

  readonly items = this.toasts.asReadonly();
  readonly grouped = computed(() => groupToastsByPosition(this.toasts()));

  show(message: PuiToastMessage, options?: PuiToastOptions): string {
    return this.publish(message, 'default', options);
  }

  success(message: PuiToastMessage, options?: PuiToastOptions): string {
    return this.publish(message, 'success', options);
  }

  error(message: PuiToastMessage, options?: PuiToastOptions): string {
    return this.publish(message, 'error', options);
  }

  warning(message: PuiToastMessage, options?: PuiToastOptions): string {
    return this.publish(message, 'warning', options);
  }

  info(message: PuiToastMessage, options?: PuiToastOptions): string {
    return this.publish(message, 'info', options);
  }

  loading(message: PuiToastMessage, options?: PuiToastOptions): string {
    const merged = this.mergeInput(message, 'loading', { ...options, duration: null });
    return this.create(merged.title, merged.options);
  }

  snackbar(message: PuiToastMessage, options?: PuiToastOptions): string {
    return this.publish(message, 'snackbar', options);
  }

  compact(message: PuiToastMessage, options?: PuiToastOptions): string {
    return this.publish(message, 'compact', options);
  }

  rich(message: PuiToastMessage, options?: PuiToastOptions): string {
    return this.publish(message, 'rich', options);
  }

  custom(message: PuiToastMessage, options?: PuiToastOptions): string {
    return this.show(message, options);
  }

  create(title: string, options: PuiToastOptions = {}): string {
    const id = options.id?.trim();
    if (id && this.toasts().some((toast) => toast.id === id)) {
      return this.update(id, { title, ...options });
    }

    const toast = buildToastData(title, options);
    this.toasts.update((current) => [...current, toast]);
    this.enforceMaxVisible(toast.position);
    this.scheduleEnterState(toast.id);

    if (toast.duration !== null) {
      this.startDismissTimer(toast.id, toast.duration);
    }

    return toast.id;
  }

  update(id: string, options: PuiToastOptions & { title?: string }): string {
    const existing = this.toasts().find((toast) => toast.id === id);
    if (!existing) {
      return this.create(options.title ?? '', { ...options, id });
    }

    const variant = options.variant ?? existing.variant;
    const duration = resolveToastDuration(variant, options.duration ?? existing.duration);
    const variantChanged = options.variant !== undefined && options.variant !== existing.variant;
    const iconName = resolveToastIcon(variant, {
      icon: options.icon,
      iconName:
        options.iconName !== undefined
          ? options.iconName
          : variantChanged
            ? undefined
            : existing.iconName,
    });

    this.clearDismissTimer(id);

    this.toasts.update((current) =>
      current.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              title: options.title ?? toast.title,
              description: options.description ?? toast.description,
              variant,
              position: options.position ?? toast.position,
              duration,
              dismissible: isToastDismissible(variant, options.dismissible),
              showIcon: iconName !== null,
              iconName,
              action: options.action ?? toast.action,
              className: options.className ?? toast.className,
              ariaLive: options.ariaLive ?? toast.ariaLive,
              state: 'visible',
              paused: false,
              remainingMs: duration ?? 0,
            }
          : toast
      )
    );

    if (duration !== null) {
      this.startDismissTimer(id, duration);
    }

    return id;
  }

  dismiss(id?: string): void {
    if (!id) {
      this.toasts().forEach((toast) => this.beginExit(toast.id));
      return;
    }

    this.beginExit(id);
  }

  dismissAll(): void {
    this.dismiss();
  }

  pause(id: string): void {
    const toast = this.toasts().find((entry) => entry.id === id);
    if (!toast || toast.paused || toast.duration === null) {
      return;
    }

    this.clearDismissTimer(id);
    const elapsed = Date.now() - toast.createdAt;
    const remainingMs = Math.max(0, toast.remainingMs - elapsed);

    this.toasts.update((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, paused: true, remainingMs } : entry
      )
    );
  }

  resume(id: string): void {
    const toast = this.toasts().find((entry) => entry.id === id);
    if (!toast?.paused || toast.duration === null) {
      return;
    }

    this.toasts.update((current) =>
      current.map((entry) =>
        entry.id === id
          ? { ...entry, paused: false, createdAt: Date.now(), remainingMs: toast.remainingMs }
          : entry
      )
    );

    this.startDismissTimer(id, toast.remainingMs);
  }

  async promise<T>(
    promise: Promise<T>,
    messages: PuiToastPromiseMessages<T>,
    options?: PuiToastOptions
  ): Promise<T> {
    const id = this.loading(messages.loading, { ...options, id: options?.id });

    try {
      const value = await promise;
      const successMessage =
        typeof messages.success === 'function' ? messages.success(value) : messages.success;
      this.update(id, { title: successMessage, variant: 'success', duration: options?.duration });
      return value;
    } catch (error) {
      const errorMessage =
        typeof messages.error === 'function' ? messages.error(error) : messages.error;
      this.update(id, { title: errorMessage, variant: 'error', duration: options?.duration });
      throw error;
    }
  }

  private publish(
    message: PuiToastMessage,
    defaultVariant: PuiToastVariant,
    options?: PuiToastOptions
  ): string {
    const merged = this.mergeInput(message, defaultVariant, options);
    return this.create(merged.title, merged.options);
  }

  private mergeInput(
    message: PuiToastMessage,
    defaultVariant: PuiToastVariant,
    options?: PuiToastOptions
  ): { title: string; options: PuiToastOptions } {
    const normalized = normalizeToastInput(message, defaultVariant);
    return {
      title: normalized.title,
      options: { ...normalized.options, ...options, variant: normalized.options.variant ?? defaultVariant },
    };
  }

  private enforceMaxVisible(position: PuiToastData['position']): void {
    const overflowIds = trimToastsForPosition(this.toasts(), position);
    overflowIds.forEach((id) => this.beginExit(id));
  }

  private scheduleEnterState(id: string): void {
    if (!this.isBrowser()) {
      this.markVisible(id);
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.markVisible(id));
    });
  }

  private markVisible(id: string): void {
    this.toasts.update((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, state: 'visible' } : toast))
    );
  }

  private beginExit(id: string): void {
    const toast = this.toasts().find((entry) => entry.id === id);
    if (!toast || toast.state === 'exiting') {
      return;
    }

    this.clearDismissTimer(id);
    this.toasts.update((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, state: 'exiting' } : entry))
    );

    if (!this.isBrowser()) {
      this.remove(id);
      return;
    }

    const existing = this.exitTimers.get(id);
    if (existing) {
      clearTimeout(existing);
    }

    this.exitTimers.set(
      id,
      setTimeout(() => {
        this.remove(id);
        this.exitTimers.delete(id);
      }, PUI_TOAST_EXIT_MS)
    );
  }

  private remove(id: string): void {
    this.clearDismissTimer(id);
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }

  private startDismissTimer(id: string, durationMs: number): void {
    if (!this.isBrowser() || durationMs <= 0) {
      return;
    }

    this.clearDismissTimer(id);
    this.timers.set(id, setTimeout(() => this.beginExit(id), durationMs));
  }

  private clearDismissTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}

export function injectPuiToast(): PuiToastService {
  return inject(PuiToastService);
}
