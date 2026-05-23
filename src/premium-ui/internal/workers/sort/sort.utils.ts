import type { PuiWorkerDatasetItem, PuiWorkerSortConfig } from '../core/worker.types';

function readSortValue(item: PuiWorkerDatasetItem, field: PuiWorkerSortConfig['field']): string | number {
  switch (field) {
    case 'label':
      return item.label;
    case 'searchText':
      return item.searchText;
    case 'rankWeight':
      return item.rankWeight ?? 0;
    default:
      return '';
  }
}

export function sortIndices(
  items: readonly PuiWorkerDatasetItem[],
  config: PuiWorkerSortConfig,
  sourceIndices?: readonly number[]
): number[] {
  const indices = [...(sourceIndices ?? items.map((_, index) => index))];
  const locale = config.locale ?? undefined;
  const direction = config.direction === 'asc' ? 1 : -1;

  indices.sort((leftIndex, rightIndex) => {
    const left = readSortValue(items[leftIndex]!, config.field);
    const right = readSortValue(items[rightIndex]!, config.field);

    if (typeof left === 'number' && typeof right === 'number') {
      return (left - right) * direction;
    }

    return String(left).localeCompare(String(right), locale, { sensitivity: 'base' }) * direction;
  });

  return indices;
}
