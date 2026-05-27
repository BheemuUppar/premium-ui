export type PuiTableFilterOperator =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte';

export type PuiTableFilterType = 'text' | 'select' | 'number' | 'date';

export interface PuiTableColumnFilter {
  readonly columnKey: string;
  readonly type: PuiTableFilterType;
  readonly operator: PuiTableFilterOperator;
  readonly value: string;
}

export interface PuiTableFilterOption {
  readonly label: string;
  readonly value: string;
}
