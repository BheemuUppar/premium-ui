import type { PuiWorkerDatasetItem } from '../../../internal/workers';
import type { PuiTableColumn } from '../interfaces';
import { buildRowSearchText, resolveRowKey } from '../utils/row.utils';

export function buildTableWorkerDataset<T>(
  rows: readonly T[],
  columns: readonly PuiTableColumn<T>[],
  rowKeyFn?: (row: T, index: number) => string | number
): PuiWorkerDatasetItem[] {
  return rows.map((row, index) => {
    const key = resolveRowKey(row, index, rowKeyFn);
    return {
      label: String(key),
      searchText: buildRowSearchText(row, columns),
      rankWeight: index,
    };
  });
}

export function createTableDatasetId(tableId: string): string {
  return `pui-table-${tableId}`;
}
