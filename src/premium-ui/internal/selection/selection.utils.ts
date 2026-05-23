import type { PuiSelectionValue, PuiSelectionValues } from '../../types/common.types';

export function valuesEqual(a: PuiSelectionValue, b: PuiSelectionValue): boolean {
  return a === b || String(a) === String(b);
}

export function containsSelectionValue(
  values: PuiSelectionValues,
  candidate: PuiSelectionValue
): boolean {
  return values.some((entry) => valuesEqual(entry, candidate));
}

export function toggleSelectionValue(
  current: PuiSelectionValues,
  candidate: PuiSelectionValue,
  selected: boolean
): PuiSelectionValue[] {
  if (selected) {
    return containsSelectionValue(current, candidate) ? [...current] : [...current, candidate];
  }
  return current.filter((entry) => !valuesEqual(entry, candidate));
}

export function toggleSelectionValueSet(
  current: PuiSelectionValues,
  candidate: PuiSelectionValue
): PuiSelectionValue[] {
  if (containsSelectionValue(current, candidate)) {
    return current.filter((entry) => !valuesEqual(entry, candidate));
  }
  return [...current, candidate];
}

export function findNextEnabledIndex<T extends { disabled?: boolean }>(
  items: readonly T[],
  startIndex: number,
  direction: 1 | -1
): number {
  if (items.length === 0) {
    return -1;
  }

  let index = startIndex;
  let step = 0;

  while (step < items.length) {
    step += 1;
    index = direction === 1 ? index + 1 : index - 1;

    if (index >= items.length) {
      index = 0;
    }

    if (index < 0) {
      index = items.length - 1;
    }

    if (!items[index]?.disabled) {
      return index;
    }
  }

  return -1;
}
