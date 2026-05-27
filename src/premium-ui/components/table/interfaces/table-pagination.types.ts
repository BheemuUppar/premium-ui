export interface PuiTablePaginationState {
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly totalRows: number;
}

export interface PuiTablePageChange {
  readonly pageIndex: number;
  readonly pageSize: number;
}
