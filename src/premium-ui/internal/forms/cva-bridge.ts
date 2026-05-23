import { signal } from '@angular/core';

/**
 * Shared ControlValueAccessor callback bridge.
 * Eliminates duplicated CVA boilerplate across form components.
 */
export class PuiCvaBridge<T> {
  readonly formDisabled = signal(false);

  private onChange: (value: T) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  emitChange(value: T): void {
    this.onChange(value);
  }

  markTouched(): void {
    this.onTouched();
  }

  commit(value: T): void {
    this.emitChange(value);
    this.markTouched();
  }
}
