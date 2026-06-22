import { forwardRef, type Provider, type Type } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { signal } from '@angular/core';

export class PuiDateCvaBridge<T> {
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

export function providePuiDateCva(component: Type<unknown>): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true,
  };
}
