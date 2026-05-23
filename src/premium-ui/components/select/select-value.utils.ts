import { isSignal } from '@angular/core';
import type { PuiSelectChip, PuiSelectOption, PuiSelectValue } from './select.types';
import { getOptionLabel, isMultipleValue, valuesEqual } from './select.utils';

export interface PuiSelectTriggerDisplay {
  readonly kind: 'single' | 'multiple' | 'empty';
  readonly label: string;
  readonly chips: readonly PuiSelectChip[];
  readonly summary: string;
}

/** Unwraps signal references accidentally bound via [(value)]="mySignal". */
export function unwrapBoundValue(value: unknown): unknown {
  let current = value;

  for (let depth = 0; depth < 3; depth += 1) {
    if (isSignal(current)) {
      current = current();
      continue;
    }
    break;
  }

  return current;
}

export function toDisplayString(value: unknown): string {
  const unwrapped = unwrapBoundValue(value);

  if (unwrapped === null || unwrapped === undefined) {
    return '';
  }

  if (typeof unwrapped === 'string') {
    return unwrapped.trim();
  }

  if (typeof unwrapped === 'number' || typeof unwrapped === 'boolean') {
    return String(unwrapped);
  }

  if (typeof unwrapped === 'function') {
    return '';
  }

  if (Array.isArray(unwrapped)) {
    return unwrapped.map((entry) => toDisplayString(entry)).filter(Boolean).join(', ');
  }

  if (typeof unwrapped === 'object') {
    const record = unwrapped as Record<string, unknown>;

    if (typeof record['label'] === 'string') {
      return record['label'].trim();
    }

    if (typeof record['value'] === 'string' || typeof record['value'] === 'number') {
      return String(record['value']);
    }

    return '';
  }

  return '';
}

export function coerceSelectValue(value: unknown, multiple: boolean): PuiSelectValue {
  const unwrapped = unwrapBoundValue(value);

  if (multiple) {
    if (Array.isArray(unwrapped)) {
      return Object.freeze(
        unwrapped
          .map((entry) => coerceScalarValue(entry))
          .filter((entry): entry is string | number => entry !== null)
      );
    }

    if (unwrapped === null || unwrapped === undefined) {
      return [];
    }

    const scalar = coerceScalarValue(unwrapped);
    return scalar === null ? [] : Object.freeze([scalar]);
  }

  if (Array.isArray(unwrapped)) {
    const first = unwrapped[0];
    return first === undefined ? null : coerceScalarValue(first);
  }

  return coerceScalarValue(unwrapped);
}

function coerceScalarValue(value: unknown): string | number | null {
  const unwrapped = unwrapBoundValue(value);

  if (unwrapped === null || unwrapped === undefined || unwrapped === '') {
    return null;
  }

  if (typeof unwrapped === 'string' || typeof unwrapped === 'number') {
    return unwrapped;
  }

  if (typeof unwrapped === 'boolean') {
    return unwrapped ? 'true' : 'false';
  }

  if (typeof unwrapped === 'function') {
    return null;
  }

  if (typeof unwrapped === 'object') {
    const record = unwrapped as Record<string, unknown>;

    if (typeof record['value'] === 'string' || typeof record['value'] === 'number') {
      return record['value'];
    }
  }

  return null;
}

export function hasSelectValue(value: PuiSelectValue, multiple: boolean): boolean {
  if (multiple) {
    return isMultipleValue(value) && value.length > 0;
  }

  return !isMultipleValue(value) && value !== null;
}

export function findSelectedOption(
  value: PuiSelectValue,
  options: readonly PuiSelectOption[],
  multiple: boolean
): PuiSelectOption | null {
  if (multiple || isMultipleValue(value) || value === null) {
    return null;
  }

  return options.find((option) => valuesEqual(option.value, value)) ?? null;
}

export function buildSelectedChips(
  value: readonly (string | number)[],
  options: readonly PuiSelectOption[],
  labelKey = 'label'
): readonly PuiSelectChip[] {
  return value.map((entry) => {
    const option = options.find((candidate) => valuesEqual(candidate.value, entry)) ?? null;
    const label = option ? toDisplayString(getOptionLabel(option, labelKey)) : toDisplayString(entry);

    return {
      value: entry,
      label,
      option,
    };
  });
}

export function resolveSingleTriggerLabel(
  value: PuiSelectValue,
  options: readonly PuiSelectOption[],
  labelKey = 'label'
): string {
  const selected = findSelectedOption(value, options, false);

  if (selected) {
    return toDisplayString(getOptionLabel(selected, labelKey));
  }

  if (!isMultipleValue(value) && value !== null) {
    return toDisplayString(value);
  }

  return '';
}

export function resolveTriggerDisplay(
  value: PuiSelectValue,
  options: readonly PuiSelectOption[],
  multiple: boolean,
  labelKey = 'label',
  multiDisplay: 'chips' | 'text' = 'chips'
): PuiSelectTriggerDisplay {
  if (multiple && isMultipleValue(value) && value.length > 0) {
    const chips = buildSelectedChips(value, options, labelKey);
    const summary = chips
      .map((chip) => chip.label)
      .filter(Boolean)
      .join(', ');

    return {
      kind: multiDisplay === 'text' ? 'multiple' : 'multiple',
      label: summary,
      chips,
      summary,
    };
  }

  const label = resolveSingleTriggerLabel(value, options, labelKey);

  if (label) {
    return {
      kind: 'single',
      label,
      chips: [],
      summary: label,
    };
  }

  return {
    kind: 'empty',
    label: '',
    chips: [],
    summary: '',
  };
}
