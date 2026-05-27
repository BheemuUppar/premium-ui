import type { PuiTableColumn, PuiTableColumnFilter, PuiTableSortState } from '../interfaces';
import { formatCellValue, resolveCellValue } from './row.utils';

function compareValues(left: unknown, right: unknown, locale?: string): number {
  if (left === right) {
    return 0;
  }

  if (left === null || left === undefined) {
    return -1;
  }

  if (right === null || right === undefined) {
    return 1;
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime();
  }

  return String(left).localeCompare(String(right), locale, { sensitivity: 'base', numeric: true });
}

/** Stable sort — preserves original order for equal elements. */
export function stableSortIndices<T>(
  rows: readonly T[],
  indices: readonly number[],
  sort: PuiTableSortState | null,
  column: PuiTableColumn<T> | undefined,
  locale?: string
): number[] {
  if (!sort?.direction || !column) {
    return [...indices];
  }

  const direction = sort.direction === 'asc' ? 1 : -1;
  const decorated = indices.map((index, order) => ({ index, order }));

  decorated.sort((left, right) => {
    const leftValue = resolveCellValue(rows[left.index]!, column);
    const rightValue = resolveCellValue(rows[right.index]!, column);
    const compared = compareValues(leftValue, rightValue, locale);

    if (compared !== 0) {
      return compared * direction;
    }

    return left.order - right.order;
  });

  return decorated.map((entry) => entry.index);
}

export function applyGlobalSearch<T>(
  rows: readonly T[],
  indices: readonly number[],
  query: string,
  columns: readonly PuiTableColumn<T>[]
): number[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...indices];
  }

  return indices.filter((index) => {
    const row = rows[index]!;

    for (const column of columns) {
      if (!column.searchable) {
        continue;
      }

      const value = resolveCellValue(row, column);
      const text = formatCellValue(value, row, column).toLowerCase();
      if (text.includes(normalized)) {
        return true;
      }
    }

    return false;
  });
}

export function applyColumnFilters<T>(
  rows: readonly T[],
  indices: readonly number[],
  filters: readonly PuiTableColumnFilter[],
  columns: readonly PuiTableColumn<T>[]
): number[] {
  if (!filters.length) {
    return [...indices];
  }

  const columnMap = new Map(columns.map((column) => [column.key, column]));

  return indices.filter((index) => {
    const row = rows[index]!;

    return filters.every((filter) => {
      const column = columnMap.get(filter.columnKey);
      if (!column) {
        return true;
      }

      const raw = resolveCellValue(row, column);
      const value = formatCellValue(raw, row, column).toLowerCase();
      const filterValue = filter.value.trim().toLowerCase();

      if (!filterValue) {
        return true;
      }

      switch (filter.operator) {
        case 'equals':
          return value === filterValue;
        case 'startsWith':
          return value.startsWith(filterValue);
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte': {
          const numeric = Number(raw);
          const target = Number(filter.value);
          if (Number.isNaN(numeric) || Number.isNaN(target)) {
            return true;
          }
          if (filter.operator === 'gt') return numeric > target;
          if (filter.operator === 'gte') return numeric >= target;
          if (filter.operator === 'lt') return numeric < target;
          return numeric <= target;
        }
        default:
          return value.includes(filterValue);
      }
    });
  });
}

export function paginateIndices(indices: readonly number[], pageIndex: number, pageSize: number): number[] {
  const start = pageIndex * pageSize;
  return indices.slice(start, start + pageSize);
}
