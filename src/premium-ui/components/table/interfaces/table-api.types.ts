import type { PuiTableExportFormat } from './table-export.types';

/** Imperative table controller exposed to toolbar templates and parent refs. */
export interface PuiTableApi<T = unknown> {
  export(format: PuiTableExportFormat): void;
  clearSelection(): void;
  selectAll(): void;
  clearFilters(): void;
  search(query: string): void;
  refresh(): void;
  getSelectedRows(): readonly T[];
  getFilteredRows(): readonly T[];
  getCurrentPageRows(): readonly T[];
}

export interface PuiTableToolbarTemplateContext<T = unknown> {
  readonly $implicit: PuiTableApi<T>;
  readonly table: PuiTableApi<T>;
}

export interface PuiTableEmptyStateTemplateContext {
  readonly title: string;
  readonly description: string;
}

export interface PuiTableLoadingTemplateContext {
  readonly loading: boolean;
}

export interface PuiTableRowActionsTemplateContext<T = unknown> {
  readonly $implicit: T;
  readonly row: T;
  readonly index: number;
}
