import type { PuiWorkerDatasetItem } from './worker.types';

/** Creates a compact fingerprint to avoid re-sending unchanged datasets. */
export function computeDatasetFingerprint(items: readonly PuiWorkerDatasetItem[]): string {
  if (items.length === 0) {
    return '0';
  }

  const first = items[0]?.searchText ?? '';
  const last = items[items.length - 1]?.searchText ?? '';
  return `${items.length}:${first}:${last}`;
}

export function createWorkerDatasetItems(
  labels: readonly string[],
  options?: {
    readonly disabled?: (index: number) => boolean;
    readonly groupKey?: (index: number) => string | undefined;
    readonly rankWeight?: (index: number) => number | undefined;
  }
): PuiWorkerDatasetItem[] {
  return labels.map((label, index) => ({
    label,
    searchText: label.trim().toLowerCase(),
    disabled: options?.disabled?.(index) ?? false,
    groupKey: options?.groupKey?.(index),
    rankWeight: options?.rankWeight?.(index),
  }));
}

export function mapIndicesToItems<T>(items: readonly T[], indices: readonly number[]): T[] {
  const mapped: T[] = [];

  for (const index of indices) {
    const item = items[index];
    if (item !== undefined) {
      mapped.push(item);
    }
  }

  return mapped;
}
