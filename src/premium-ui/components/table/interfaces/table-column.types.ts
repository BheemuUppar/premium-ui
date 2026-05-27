import type { TemplateRef } from '@angular/core';

export type PuiTableColumnType =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'badge'
  | 'switch'
  | 'button'
  | 'actions'
  | 'selection'
  | 'custom';

export type PuiTableColumnAlign = 'start' | 'center' | 'end';
export type PuiTableStickyPosition = 'left' | 'right';

export interface PuiTableCellContext<T> {
  readonly $implicit: T;
  readonly row: T;
  readonly value: unknown;
  readonly index: number;
  readonly columnKey: string;
}

export interface PuiTableHeaderContext<T> {
  readonly column: PuiTableColumn<T>;
}

/** Normalized column configuration — every column resolves to this shape. */
export interface PuiTableColumn<T = unknown> {
  readonly key: string;
  readonly label: string;
  readonly type: PuiTableColumnType;
  readonly width?: string;
  readonly minWidth?: string;
  readonly maxWidth?: string;
  readonly sortable: boolean;
  readonly filterable: boolean;
  readonly searchable: boolean;
  readonly exportable: boolean;
  readonly hidden: boolean;
  readonly sticky?: PuiTableStickyPosition;
  readonly resizable: boolean;
  readonly align: PuiTableColumnAlign;
  readonly formatter?: (value: unknown, row: T) => string;
  readonly valueGetter?: (row: T) => unknown;
  readonly cellTemplate?: TemplateRef<PuiTableCellContext<T>>;
  readonly headerTemplate?: TemplateRef<PuiTableHeaderContext<T>>;
  readonly footerTemplate?: TemplateRef<unknown>;
  readonly workerSearchKey?: string;
  readonly virtualizationHint?: 'fixed' | 'dynamic';
  readonly badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

/** Developer-facing column input — string shorthand or full config. */
export type PuiTableColumnInput<T = unknown> = string | PuiTableColumnDef<T>;

export interface PuiTableColumnDef<T = unknown> {
  readonly key: string;
  readonly label?: string;
  readonly type?: PuiTableColumnType;
  readonly width?: string;
  readonly minWidth?: string;
  readonly maxWidth?: string;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  readonly searchable?: boolean;
  readonly exportable?: boolean;
  readonly hidden?: boolean;
  readonly sticky?: PuiTableStickyPosition;
  readonly resizable?: boolean;
  readonly align?: PuiTableColumnAlign;
  readonly formatter?: (value: unknown, row: T) => string;
  readonly valueGetter?: (row: T) => unknown;
  readonly cellTemplate?: TemplateRef<PuiTableCellContext<T>>;
  readonly headerTemplate?: TemplateRef<PuiTableHeaderContext<T>>;
  readonly footerTemplate?: TemplateRef<unknown>;
  readonly workerSearchKey?: string;
  readonly virtualizationHint?: 'fixed' | 'dynamic';
  readonly badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}
