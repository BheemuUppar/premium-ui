import type { TemplateRef, ViewContainerRef } from '@angular/core';
import type { Observable } from 'rxjs';
import type {
  PuiOverlayConfig,
  PuiOverlayPosition,
  PuiOverlayScrollStrategy,
  PuiOverlaySizeConfig,
} from '../../overlay';

export type PuiDialogVariant = 'default' | 'confirm' | 'fullscreen' | 'sheet' | 'danger';

export interface PuiDialogConfig<D = unknown> extends PuiOverlayConfig {
  readonly data?: D;
  readonly variant?: PuiDialogVariant;
  readonly ariaLabel?: string;
  readonly context?: Record<string, unknown>;
  /** Required for template dialogs — same as MatDialogConfig.viewContainerRef. */
  readonly viewContainerRef?: ViewContainerRef;
}

export interface PuiDialogConfirmConfig {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly variant?: 'default' | 'danger';
  readonly width?: string;
}

export interface PuiDialogSizeUpdate extends Partial<PuiOverlaySizeConfig> {}

export type PuiDialogContent<T = unknown> = TemplateRef<T> | (new (...args: unknown[]) => T);

export { type PuiOverlayPosition, type PuiOverlayScrollStrategy, type PuiOverlaySizeConfig };
