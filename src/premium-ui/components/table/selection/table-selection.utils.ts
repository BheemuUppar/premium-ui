import type { PuiTableRowKey } from '../interfaces';

export function toggleRowSelection(
  selected: ReadonlySet<PuiTableRowKey>,
  key: PuiTableRowKey,
  maxSelection?: number | null
): Set<PuiTableRowKey> {
  const next = new Set(selected);

  if (next.has(key)) {
    next.delete(key);
    return next;
  }

  if (maxSelection !== null && maxSelection !== undefined && next.size >= maxSelection) {
    return next;
  }

  next.add(key);
  return next;
}

export function toggleAllSelection(
  selected: ReadonlySet<PuiTableRowKey>,
  keys: readonly PuiTableRowKey[],
  selectAll: boolean,
  maxSelection?: number | null
): Set<PuiTableRowKey> {
  const next = new Set(selected);

  if (!selectAll) {
    for (const key of keys) {
      next.delete(key);
    }
    return next;
  }

  for (const key of keys) {
    if (maxSelection !== null && maxSelection !== undefined && next.size >= maxSelection) {
      break;
    }
    next.add(key);
  }

  return next;
}

export function isAllSelected(
  selected: ReadonlySet<PuiTableRowKey>,
  keys: readonly PuiTableRowKey[]
): boolean {
  if (!keys.length) {
    return false;
  }

  return keys.every((key) => selected.has(key));
}

export function isPartiallySelected(
  selected: ReadonlySet<PuiTableRowKey>,
  keys: readonly PuiTableRowKey[]
): boolean {
  if (!keys.length) {
    return false;
  }

  const selectedCount = keys.filter((key) => selected.has(key)).length;
  return selectedCount > 0 && selectedCount < keys.length;
}
