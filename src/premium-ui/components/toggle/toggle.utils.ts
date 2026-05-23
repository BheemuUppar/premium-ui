import type { PuiSelectionValue } from '../../types/common.types';
import { valuesEqual } from '../../internal/selection/selection.utils';

/** Normalizes toggle pressed output for forms and events. */
export function normalizeTogglePressed(pressed: boolean): boolean {
  return !!pressed;
}

/** Compares toggle values for group selection. */
export function toggleValuesEqual(a: PuiSelectionValue, b: PuiSelectionValue): boolean {
  return valuesEqual(a, b);
}

/** Resolves aria-pressed string from boolean state. */
export function toAriaPressed(pressed: boolean): 'true' | 'false' {
  return pressed ? 'true' : 'false';
}
