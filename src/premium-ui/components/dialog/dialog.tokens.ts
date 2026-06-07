import { InjectionToken, inject } from '@angular/core';
import type { PuiDialogRef } from './dialog-ref';
import type { PuiDialogVariant } from './dialog.types';

export const PUI_DIALOG_DATA = new InjectionToken<unknown>('PUI_DIALOG_DATA');

export const PUI_DIALOG_REF = new InjectionToken<PuiDialogRef<unknown, unknown>>('PUI_DIALOG_REF');

/** Variant from `PuiDialogService.open()` config — applied when `pui-dialog` has no variant input. */
export const PUI_DIALOG_VARIANT = new InjectionToken<PuiDialogVariant>('PUI_DIALOG_VARIANT');

/** Typed helper for dialog data injection inside component dialogs. */
export function injectPuiDialogData<TData>(): TData {
  return inject(PUI_DIALOG_DATA) as TData;
}

/** Typed helper for dialog ref injection inside component dialogs. */
export function injectPuiDialogRef<TComponent = unknown, TResult = unknown>(): PuiDialogRef<
  TComponent,
  TResult
> {
  return inject(PUI_DIALOG_REF) as PuiDialogRef<TComponent, TResult>;
}
