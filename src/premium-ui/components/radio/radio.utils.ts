import type { PuiRadioValue } from './radio.types';

export function radioValuesEqual(a: PuiRadioValue, b: PuiRadioValue): boolean {
  return a === b || String(a) === String(b);
}
