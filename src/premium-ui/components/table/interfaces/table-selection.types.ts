export type PuiTableRowKey = string | number;

export interface PuiTableSelectionChange<T = unknown> {
  readonly selectedKeys: readonly PuiTableRowKey[];
  readonly selectedRows: readonly T[];
  readonly count: number;
}
