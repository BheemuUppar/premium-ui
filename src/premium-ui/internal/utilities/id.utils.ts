let nextPuiId = 0;

/** Generates stable unique IDs for aria wiring. */
export function createPuiId(prefix: string): string {
  nextPuiId += 1;
  return `${prefix}-${nextPuiId}`;
}
