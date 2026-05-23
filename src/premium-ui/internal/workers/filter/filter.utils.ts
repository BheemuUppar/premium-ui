import type { PuiWorkerDatasetItem, PuiWorkerFilterCondition } from '../core/worker.types';

function readField(item: PuiWorkerDatasetItem, field: PuiWorkerFilterCondition['field']): string {
  switch (field) {
    case 'label':
      return item.label;
    case 'searchText':
      return item.searchText;
    case 'groupKey':
      return item.groupKey ?? '';
    default:
      return '';
  }
}

function matchesCondition(item: PuiWorkerDatasetItem, condition: PuiWorkerFilterCondition): boolean {
  const value = readField(item, condition.field).toLowerCase();
  const target = condition.value.toLowerCase();

  switch (condition.operator) {
    case 'equals':
      return value === target;
    case 'contains':
      return value.includes(target);
    case 'startsWith':
      return value.startsWith(target);
    default:
      return false;
  }
}

/** Predicate-based multi-condition filtering. All conditions must match. */
export function filterIndices(
  items: readonly PuiWorkerDatasetItem[],
  conditions: readonly PuiWorkerFilterCondition[],
  sourceIndices?: readonly number[]
): number[] {
  const indices = sourceIndices ?? items.map((_, index) => index);

  if (conditions.length === 0) {
    return [...indices];
  }

  const matches: number[] = [];

  for (const index of indices) {
    const item = items[index];
    if (!item) {
      continue;
    }

    if (conditions.every((condition) => matchesCondition(item, condition))) {
      matches.push(index);
    }
  }

  return matches;
}
