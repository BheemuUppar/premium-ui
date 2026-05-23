import type { PuiWorkerDatasetItem, PuiWorkerGroupConfig } from '../core/worker.types';

function readGroupValue(item: PuiWorkerDatasetItem, field: PuiWorkerGroupConfig['field']): string {
  if (field === 'groupKey') {
    return item.groupKey ?? 'Other';
  }
  return item.label.charAt(0).toUpperCase() || 'Other';
}

export function groupIndices(
  items: readonly PuiWorkerDatasetItem[],
  config: PuiWorkerGroupConfig,
  sourceIndices?: readonly number[]
): Record<string, number[]> {
  const indices = sourceIndices ?? items.map((_, index) => index);
  const groups: Record<string, number[]> = {};

  for (const index of indices) {
    const item = items[index];
    if (!item) {
      continue;
    }

    const key = readGroupValue(item, config.field);
    groups[key] ??= [];
    groups[key]!.push(index);
  }

  return groups;
}
