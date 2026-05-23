import type { PuiWorkerDatasetItem } from '../../internal/workers';
import type { PuiSelectOption } from './select.types';

export function toSelectWorkerDataset(
  options: readonly PuiSelectOption[]
): PuiWorkerDatasetItem[] {
  return options.map((option) => ({
    label: option.label,
    searchText: option.label.trim().toLowerCase(),
    disabled: option.disabled ?? false,
  }));
}

export function mapSelectOptionsByIndices(
  options: readonly PuiSelectOption[],
  indices: readonly number[]
): PuiSelectOption[] {
  const mapped: PuiSelectOption[] = [];

  for (const index of indices) {
    const option = options[index];
    if (option) {
      mapped.push(option);
    }
  }

  return mapped;
}
