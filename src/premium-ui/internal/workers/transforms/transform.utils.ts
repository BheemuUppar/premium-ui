import type { PuiWorkerDatasetItem, PuiWorkerTransformStep } from '../core/worker.types';

export function normalizeDatasetItems(items: readonly PuiWorkerDatasetItem[]): PuiWorkerDatasetItem[] {
  return items.map((item) => ({
    ...item,
    label: item.label.trim(),
    searchText: item.searchText.trim().toLowerCase(),
  }));
}

export function applyTransformSteps(
  items: readonly PuiWorkerDatasetItem[],
  steps: readonly PuiWorkerTransformStep[],
  sourceIndices?: readonly number[]
): number[] {
  const indices = [...(sourceIndices ?? items.map((_, index) => index))];

  for (const step of steps) {
    if (step.type === 'normalize') {
      continue;
    }

    if (step.type === 'flatten-groups') {
      indices.sort((left, right) => {
        const leftKey = items[left]?.groupKey ?? '';
        const rightKey = items[right]?.groupKey ?? '';
        return leftKey.localeCompare(rightKey);
      });
    }
  }

  return indices;
}

export function runTransformPipeline(
  items: readonly PuiWorkerDatasetItem[],
  steps: readonly PuiWorkerTransformStep[]
): PuiWorkerDatasetItem[] {
  let next = [...items];

  for (const step of steps) {
    if (step.type === 'normalize') {
      next = normalizeDatasetItems(next);
    }
  }

  return next;
}
