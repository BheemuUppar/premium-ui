/** Precomputed lookup index for fast repeated search operations. */
export interface PuiSearchIndex {
  readonly tokens: ReadonlyMap<string, readonly number[]>;
}

export function buildSearchIndex(
  items: readonly { readonly searchText: string }[]
): PuiSearchIndex {
  const tokens = new Map<string, number[]>();

  items.forEach((item, index) => {
    const words = item.searchText.split(/\s+/).filter(Boolean);

    for (const word of words) {
      const bucket = tokens.get(word);
      if (bucket) {
        bucket.push(index);
      } else {
        tokens.set(word, [index]);
      }
    }
  });

  return { tokens };
}

export function lookupIndex(index: PuiSearchIndex, token: string): readonly number[] {
  return index.tokens.get(token.toLowerCase()) ?? [];
}
