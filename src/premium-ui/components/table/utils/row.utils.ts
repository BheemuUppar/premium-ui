import type { PuiTableColumn } from '../interfaces';

export function resolveRowKey<T>(
  row: T,
  index: number,
  rowKeyFn?: (row: T, index: number) => string | number
): string | number {
  if (rowKeyFn) {
    return rowKeyFn(row, index);
  }

  const record = row as Record<string, unknown>;
  const id = record['id'];

  if (typeof id === 'string' || typeof id === 'number') {
    return id;
  }

  return index;
}

export function resolveCellValue<T>(row: T, column: PuiTableColumn<T>): unknown {
  if (column.valueGetter) {
    return column.valueGetter(row);
  }

  if (column.type === 'selection' || column.type === 'actions' || column.type === 'custom') {
    return undefined;
  }

  return (row as Record<string, unknown>)[column.key];
}

export function formatCellValue<T>(value: unknown, row: T, column: PuiTableColumn<T>): string {
  if (column.formatter) {
    return column.formatter(value, row);
  }

  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (column.type === 'currency' && typeof value === 'number') {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
  }

  if (column.type === 'number' && typeof value === 'number') {
    return new Intl.NumberFormat().format(value);
  }

  return String(value);
}

export function buildRowSearchText<T>(
  row: T,
  columns: readonly PuiTableColumn<T>[]
): string {
  const parts: string[] = [];

  for (const column of columns) {
    if (!column.searchable) {
      continue;
    }

    const value = resolveCellValue(row, column);
    if (value !== null && value !== undefined) {
      parts.push(String(value).toLowerCase());
    }
  }

  return parts.join(' ');
}
