import type { PuiWorkerSearchMode } from '../core/worker.types';
import { fuzzyMatchScore } from '../search/fuzzy-search.utils';
import { keywordSearchIndices, textSearchIndices } from '../search/search.utils';

export function rankIndices(
  items: readonly { readonly searchText: string; readonly label: string; readonly rankWeight?: number }[],
  query: string,
  mode: PuiWorkerSearchMode,
  sourceIndices?: readonly number[]
): number[] {
  const indices = sourceIndices ?? items.map((_, index) => index);
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [...indices];
  }

  if (mode === 'text') {
    return textSearchIndices(items, normalizedQuery, indices);
  }

  if (mode === 'keyword') {
    return keywordSearchIndices(items, normalizedQuery, indices);
  }

  const scored = indices
    .map((index) => {
      const item = items[index];
      if (!item) {
        return { index, score: 0 };
      }

      const fuzzyScore = fuzzyMatchScore(item.label, normalizedQuery);
      const weight = item.rankWeight ?? 0;
      return { index, score: fuzzyScore + weight * 0.01 };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  return scored.map((entry) => entry.index);
}
