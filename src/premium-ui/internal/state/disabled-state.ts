import { computed, Signal } from '@angular/core';

/** Computes unified disabled state from component + form + parent sources. */
export function createDisabledState(
  disabled: Signal<boolean>,
  formDisabled: Signal<boolean>,
  parentDisabled?: Signal<boolean>
): Signal<boolean> {
  return computed(
    () => disabled() || formDisabled() || (parentDisabled?.() ?? false)
  );
}
