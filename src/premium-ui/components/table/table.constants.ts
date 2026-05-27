export const PUI_TABLE_DEFAULT_PAGE_SIZE = 10;
export const PUI_TABLE_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const PUI_TABLE_DEFAULT_ROW_HEIGHT = 48;
export const PUI_TABLE_COMPACT_ROW_HEIGHT = 40;
export const PUI_TABLE_SPACIOUS_ROW_HEIGHT = 56;
export const PUI_TABLE_HEADER_HEIGHT = 44;
export const PUI_TABLE_VIRTUAL_THRESHOLD = 100;
export const PUI_TABLE_SEARCH_DEBOUNCE_MS = 200;
export const PUI_TABLE_MIN_COLUMN_WIDTH = 80;
export const PUI_TABLE_DEFAULT_COLUMN_WIDTH = '160px';
export const PUI_TABLE_SELECTION_COLUMN_KEY = '__selection';
export const PUI_TABLE_ROW_ACTIONS_COLUMN_KEY = '__rowActions';
export const PUI_TABLE_DATASET_PREFIX = 'pui-table';

export const PUI_TABLE_DEFAULT_HEIGHT = 420;
export const PUI_TABLE_TOOLBAR_HEIGHT = 56;
export const PUI_TABLE_PAGINATION_HEIGHT = 52;

export type PuiTableDensity = 'compact' | 'comfortable' | 'spacious';

export const PUI_TABLE_DENSITY_ROW_HEIGHT: Readonly<Record<PuiTableDensity, number>> = {
  compact: PUI_TABLE_COMPACT_ROW_HEIGHT,
  comfortable: PUI_TABLE_DEFAULT_ROW_HEIGHT,
  spacious: PUI_TABLE_SPACIOUS_ROW_HEIGHT,
};
