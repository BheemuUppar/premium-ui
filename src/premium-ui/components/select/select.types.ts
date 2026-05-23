import type { PuiSize } from '../../types/common.types';

export type PuiSelectSize = PuiSize;

export type PuiSelectSingleValue = string | number | null;

export type PuiSelectMultipleValue = readonly (string | number)[];

export type PuiSelectValue = PuiSelectSingleValue | PuiSelectMultipleValue;

export interface PuiSelectOption {
  readonly label: string;
  readonly value: string | number;
  readonly disabled?: boolean;
  readonly [key: string]: unknown;
}

export interface PuiSelectSelectionChange {
  readonly value: PuiSelectValue;
  readonly option: PuiSelectOption | null;
}

export interface PuiSelectChip {
  readonly value: string | number;
  readonly label: string;
  readonly option: PuiSelectOption | null;
}

export type PuiSelectFilterFn = (option: PuiSelectOption, query: string) => boolean;

export type PuiSelectTheme = 'light' | 'dark';

export interface PuiSelectOptionTemplateContext {
  readonly $implicit: PuiSelectOption;
  readonly selected: boolean;
  readonly active: boolean;
  readonly index: number;
}
