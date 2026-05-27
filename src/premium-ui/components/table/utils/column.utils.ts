import type {
  PuiTableColumn,
  PuiTableColumnDef,
  PuiTableColumnInput,
  PuiTableColumnType,
} from '../interfaces';
import {
  PUI_TABLE_MIN_COLUMN_WIDTH,
  PUI_TABLE_SELECTION_COLUMN_KEY,
} from '../table.constants';

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function inferColumnType(key: string, sampleValue: unknown): PuiTableColumnType {
  if (key === '__selection') {
    return 'selection';
  }

  if (typeof sampleValue === 'number') {
    return 'number';
  }

  if (typeof sampleValue === 'boolean') {
    return 'switch';
  }

  if (sampleValue instanceof Date) {
    return 'date';
  }

  return 'text';
}

export function buildGridTemplateColumns<T>(columns: readonly PuiTableColumn<T>[]): string {
  return columns.map((column) => resolveGridTrack(column)).join(' ');
}

function resolveGridTrack<T>(column: PuiTableColumn<T>): string {
  if (column.type === 'selection') {
    return column.width ?? '3rem';
  }

  const min = column.minWidth ?? `${PUI_TABLE_MIN_COLUMN_WIDTH}px`;

  if (column.width) {
    return column.maxWidth ? `minmax(${min}, ${column.width})` : column.width;
  }

  if (column.maxWidth) {
    return `minmax(${min}, ${column.maxWidth})`;
  }

  return `minmax(${min}, 1fr)`;
}

function defaultMinWidthForType(type: PuiTableColumnType): string {
  if (type === 'selection') {
    return '3rem';
  }

  if (type === 'currency' || type === 'number') {
    return '6.5rem';
  }

  if (type === 'date') {
    return '7rem';
  }

  if (type === 'badge') {
    return '5.5rem';
  }

  return `${PUI_TABLE_MIN_COLUMN_WIDTH}px`;
}

/** Applies table-level sticky options without overriding explicit column.sticky. */
export function applyTableStickyOptions<T>(
  columns: readonly PuiTableColumn<T>[],
  options: {
    readonly stickyFirstColumn: boolean;
    readonly stickyLastColumn: boolean;
  }
): readonly PuiTableColumn<T>[] {
  if (!options.stickyFirstColumn && !options.stickyLastColumn) {
    return columns;
  }

  const lastIndex = columns.length - 1;

  return columns.map((column, index) => {
    if (column.sticky) {
      return column;
    }

    if (options.stickyFirstColumn && index === 0) {
      return { ...column, sticky: 'left' as const };
    }

    if (options.stickyLastColumn && index === lastIndex) {
      return { ...column, sticky: 'right' as const };
    }

    return column;
  });
}

export function normalizeTableColumn<T>(
  input: PuiTableColumnInput<T>,
  sampleRow?: T
): PuiTableColumn<T> {
  if (typeof input === 'string') {
    const sampleValue = sampleRow ? (sampleRow as Record<string, unknown>)[input] : undefined;
    const type = inferColumnType(input, sampleValue);

    return {
      key: input,
      label: humanizeKey(input),
      type,
      width: type === 'selection' ? '3rem' : undefined,
      minWidth: defaultMinWidthForType(type),
      sortable: false,
      filterable: type === 'text' || type === 'number' || type === 'badge',
      searchable: type !== 'selection' && type !== 'actions',
      exportable: type !== 'selection' && type !== 'actions',
      hidden: false,
      resizable: type !== 'selection',
      align: type === 'number' || type === 'currency' ? 'end' : 'start',
    };
  }

  const def = input as PuiTableColumnDef<T>;
  const sampleValue = def.valueGetter
    ? sampleRow
      ? def.valueGetter(sampleRow)
      : undefined
    : sampleRow
      ? (sampleRow as Record<string, unknown>)[def.key]
      : undefined;

  const type = def.type ?? inferColumnType(def.key, sampleValue);

  return {
    key: def.key,
    label: def.label ?? humanizeKey(def.key),
    type,
    width: def.width ?? (type === 'selection' ? '3rem' : undefined),
    minWidth: def.minWidth ?? defaultMinWidthForType(type),
    maxWidth: def.maxWidth,
    sortable: def.sortable ?? false,
    filterable: def.filterable ?? false,
    searchable: def.searchable ?? (type !== 'selection' && type !== 'actions'),
    exportable: def.exportable ?? type !== 'selection',
    hidden: def.hidden ?? false,
    sticky: def.sticky,
    resizable: def.resizable ?? type !== 'selection',
    align: def.align ?? (type === 'number' || type === 'currency' ? 'end' : 'start'),
    formatter: def.formatter,
    valueGetter: def.valueGetter,
    cellTemplate: def.cellTemplate,
    headerTemplate: def.headerTemplate,
    footerTemplate: def.footerTemplate,
    workerSearchKey: def.workerSearchKey,
    virtualizationHint: def.virtualizationHint ?? 'fixed',
    badgeVariant: def.badgeVariant,
  };
}

export function normalizeTableColumns<T>(
  inputs: readonly PuiTableColumnInput<T>[],
  sampleRow?: T
): readonly PuiTableColumn<T>[] {
  return inputs.map((input) => normalizeTableColumn(input, sampleRow));
}

export function getVisibleColumns<T>(columns: readonly PuiTableColumn<T>[]): readonly PuiTableColumn<T>[] {
  return columns.filter((column) => !column.hidden);
}

export function isSelectionColumn<T>(column: PuiTableColumn<T>): boolean {
  return column.type === 'selection' || column.key === PUI_TABLE_SELECTION_COLUMN_KEY;
}

/** Filters or injects selection column based on selectable state. */
export function resolveDisplayColumns<T>(
  columns: readonly PuiTableColumn<T>[],
  options: { readonly selectable: boolean }
): readonly PuiTableColumn<T>[] {
  let visible = getVisibleColumns(columns);

  if (!options.selectable) {
    return visible.filter((column) => !isSelectionColumn(column));
  }

  if (!visible.some(isSelectionColumn)) {
    return [
      normalizeTableColumn({ key: PUI_TABLE_SELECTION_COLUMN_KEY, type: 'selection' }),
      ...visible,
    ];
  }

  return visible;
}

export function findColumnByKey<T>(
  columns: readonly PuiTableColumn<T>[],
  key: string
): PuiTableColumn<T> | undefined {
  return columns.find((column) => column.key === key);
}
