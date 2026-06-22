export type PuiDateIconName =
  | 'calendar'
  | 'clock'
  | 'chevron-left'
  | 'chevron-right'
  | 'clear'
  | 'close'
  | 'today';

export const PUI_DATE_ICON_PATHS: Readonly<Record<PuiDateIconName, readonly string[]>> = {
  calendar: [
    'M8 2v4',
    'M16 2v4',
    'M3 10h18',
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  ],
  clock: ['M12 12l4 2', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'],
  'chevron-left': ['M15 18l-6-6 6-6'],
  'chevron-right': ['M9 18l6-6-6-6'],
  clear: ['M18 6L6 18', 'M6 6l12 12'],
  close: ['M18 6L6 18', 'M6 6l12 12'],
  today: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M12 14v4', 'M10 16h4'],
};

export function resolveDateIconPaths(name: PuiDateIconName): readonly string[] {
  return PUI_DATE_ICON_PATHS[name] ?? [];
}
