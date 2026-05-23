/** Case-insensitive substring search against pre-normalized search text. */
export function textSearchIndices(
  items: readonly { readonly searchText: string }[],
  query: string,
  sourceIndices?: readonly number[]
): number[] {
  const normalizedQuery = query.trim().toLowerCase();
  const indices = sourceIndices ?? items.map((_, index) => index);

  if (!normalizedQuery) {
    return [...indices];
  }

  const matches: number[] = [];

  for (const index of indices) {
    const item = items[index];
    if (item?.searchText.includes(normalizedQuery)) {
      matches.push(index);
    }
  }

  return matches;
}

/** Keyword search — every whitespace-separated token must match. */
export function keywordSearchIndices(
  items: readonly { readonly searchText: string }[],
  query: string,
  sourceIndices?: readonly number[]
): number[] {
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const indices = sourceIndices ?? items.map((_, index) => index);

  if (tokens.length === 0) {
    return [...indices];
  }

  const matches: number[] = [];

  for (const index of indices) {
    const searchText = items[index]?.searchText ?? '';
    if (tokens.every((token) => searchText.includes(token))) {
      matches.push(index);
    }
  }

  return matches;
}
