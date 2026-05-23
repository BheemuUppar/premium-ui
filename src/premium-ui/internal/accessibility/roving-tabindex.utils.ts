/** Computes next roving tabindex index for a collection. */
export function getNextRovingIndex(
  currentIndex: number,
  itemCount: number,
  direction: 1 | -1
): number {
  if (itemCount <= 0) {
    return -1;
  }

  let next = currentIndex + direction;

  if (next >= itemCount) {
    next = 0;
  }

  if (next < 0) {
    next = itemCount - 1;
  }

  return next;
}

/** Returns tabindex for roving focus pattern. */
export function rovingTabIndex(isActive: boolean): 0 | -1 {
  return isActive ? 0 : -1;
}
