/** Subsequence fuzzy match score. Returns 0 when query does not match. */
export function fuzzyMatchScore(text: string, query: string): number {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return 1;
  }

  let queryIndex = 0;
  let score = 0;
  let consecutive = 0;
  let firstMatchIndex = -1;

  for (let i = 0; i < normalizedText.length && queryIndex < normalizedQuery.length; i += 1) {
    if (normalizedText[i] === normalizedQuery[queryIndex]) {
      if (firstMatchIndex < 0) {
        firstMatchIndex = i;
      }
      score += 1 + consecutive;
      consecutive += 1;
      queryIndex += 1;
    } else {
      consecutive = 0;
    }
  }

  if (queryIndex < normalizedQuery.length) {
    return 0;
  }

  const lengthPenalty = normalizedText.length > 0 ? normalizedQuery.length / normalizedText.length : 0;
  const startBonus = firstMatchIndex === 0 ? 0.25 : 0;
  return score * lengthPenalty + startBonus;
}

export function fuzzySearchIndices(
  items: readonly { readonly searchText: string; readonly label: string }[],
  query: string,
  sourceIndices?: readonly number[],
  minScore = 0.01
): number[] {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    const indices = sourceIndices ?? items.map((_, index) => index);
    return [...indices];
  }

  const indices = sourceIndices ?? items.map((_, index) => index);
  const scored: { index: number; score: number }[] = [];

  for (const index of indices) {
    const item = items[index];
    if (!item) {
      continue;
    }

    const score = fuzzyMatchScore(item.label, normalizedQuery);
    if (score >= minScore) {
      scored.push({ index, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.index);
}
