import type { PuiSelectFilterFn, PuiSelectOption, PuiSelectValue } from './select.types';
import {
  containsSelectionValue,
  findNextEnabledIndex,
  toggleSelectionValueSet,
  valuesEqual,
} from '../../internal/selection';
import { resolveThemeContext } from '../../internal/theming';

export { findNextEnabledIndex, resolveThemeContext, valuesEqual };

export function getOptionLabel(option: PuiSelectOption, labelKey: string): string {
  const label = option[labelKey];

  if (typeof label === 'string') {
    return label;
  }

  if (typeof option.label === 'string') {
    return option.label;
  }

  return '';
}

export function getOptionValue(option: PuiSelectOption, valueKey: string): string | number {
  const value = option[valueKey];
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  return option.value;
}

export function createDefaultFilterFn(labelKey: string): PuiSelectFilterFn {
  return (option: PuiSelectOption, query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return true;
    }
    return getOptionLabel(option, labelKey).toLowerCase().includes(normalizedQuery);
  };
}

export function normalizeOptions(
  options: readonly PuiSelectOption[],
  labelKey: string,
  valueKey: string
): PuiSelectOption[] {
  return options.map((option) => ({
    ...option,
    label: getOptionLabel(option, labelKey),
    value: getOptionValue(option, valueKey),
  }));
}

export function isMultipleValue(value: PuiSelectValue): value is readonly (string | number)[] {
  return Array.isArray(value);
}

export function isOptionSelected(
  value: PuiSelectValue,
  optionValue: string | number,
  multiple: boolean
): boolean {
  if (multiple && isMultipleValue(value)) {
    return containsSelectionValue(value, optionValue);
  }
  if (!multiple && !isMultipleValue(value)) {
    return value !== null && valuesEqual(value, optionValue);
  }
  return false;
}

export function toggleMultipleValue(
  current: readonly (string | number)[],
  optionValue: string | number
): readonly (string | number)[] {
  return toggleSelectionValueSet(current, optionValue);
}

export function findOptionIndex(options: readonly PuiSelectOption[], value: string | number): number {
  return options.findIndex((option) => valuesEqual(option.value, value));
}

export function findTypeaheadIndex(
  options: readonly PuiSelectOption[],
  query: string,
  startIndex: number
): number {
  const normalizedQuery = query.toLowerCase();
  if (!normalizedQuery) {
    return -1;
  }

  for (let offset = 1; offset <= options.length; offset += 1) {
    const index = (startIndex + offset) % options.length;
    const option = options[index];
    if (option && !option.disabled && getOptionLabel(option, 'label').toLowerCase().startsWith(normalizedQuery)) {
      return index;
    }
  }

  return -1;
}
