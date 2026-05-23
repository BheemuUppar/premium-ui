import type { PuiSelectionValue, PuiSelectionValues } from '../../types/common.types';

export type { PuiSelectionValue, PuiSelectionValues };

export interface PuiSelectionChange<TValue = PuiSelectionValue> {
  readonly value: TValue;
  readonly selected: boolean;
}
