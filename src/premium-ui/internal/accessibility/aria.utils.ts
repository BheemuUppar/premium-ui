export type PuiAriaChecked = boolean | 'mixed';

export function toAriaChecked(checked: boolean, indeterminate = false): PuiAriaChecked {
  if (indeterminate && !checked) {
    return 'mixed';
  }
  return checked;
}

export function toAriaBoolean(value: boolean): 'true' | 'false' {
  return value ? 'true' : 'false';
}

export function joinDescribedBy(ids: readonly (string | null | undefined)[]): string | null {
  const filtered = ids.filter((id): id is string => !!id);
  return filtered.length > 0 ? filtered.join(' ') : null;
}
