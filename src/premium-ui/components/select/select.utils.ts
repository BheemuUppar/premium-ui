import type { PuiSelectFilterFn, PuiSelectOption, PuiSelectTheme, PuiSelectValue } from './select.types';

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

export function valuesEqual(a: string | number, b: string | number): boolean {
  return a === b || String(a) === String(b);
}

export function isOptionSelected(
  value: PuiSelectValue,
  optionValue: string | number,
  multiple: boolean
): boolean {
  if (multiple && isMultipleValue(value)) {
    return value.some((entry) => valuesEqual(entry, optionValue));
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
  if (current.some((entry) => valuesEqual(entry, optionValue))) {
    return current.filter((entry) => !valuesEqual(entry, optionValue));
  }
  return [...current, optionValue];
}

export function findOptionIndex(options: readonly PuiSelectOption[], value: string | number): number {
  return options.findIndex((option) => valuesEqual(option.value, value));
}

export function findNextEnabledIndex(
  options: readonly PuiSelectOption[],
  startIndex: number,
  direction: 1 | -1
): number {
  if (options.length === 0) {
    return -1;
  }

  let index = startIndex;

  for (let step = 0; step < options.length; step += 1) {
    index = direction === 1 ? index + 1 : index - 1;

    if (index >= options.length) {
      index = 0;
    }

    if (index < 0) {
      index = options.length - 1;
    }

    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

export function resolveThemeContext(element: Element | null): PuiSelectTheme {
  if (!element) {
    return 'light';
  }

  const themed = element.closest('[data-theme]');
  const theme = themed?.getAttribute('data-theme');
  return theme === 'dark' ? 'dark' : 'light';
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
