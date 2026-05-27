export type PuiTableSortDirection = 'asc' | 'desc' | null;

export interface PuiTableSortState {
  readonly columnKey: string;
  readonly direction: PuiTableSortDirection;
}

/** Multi-sort ready — currently single active sort, array for future extension. */
export type PuiTableSortStates = readonly PuiTableSortState[];
