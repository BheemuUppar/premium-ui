import type { PuiTableExportFormat } from './table-export.types';
import type { PuiTablePageChange } from './table-pagination.types';

export interface PuiTableSearchChange {
  readonly query: string;
}

export interface PuiTableExportClick {
  readonly format: PuiTableExportFormat;
}

export type PuiTablePageChangeEvent = PuiTablePageChange;
