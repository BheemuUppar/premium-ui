/** Lucide-aligned semantic icon names for toast feedback. */
export type PuiToastIconName =
  | 'circle-check'
  | 'circle-alert'
  | 'triangle-alert'
  | 'info'
  | 'loader-circle'
  | 'bell';

export const PUI_TOAST_SEMANTIC_ICONS: Readonly<
  Record<'success' | 'error' | 'warning' | 'info' | 'loading' | 'default', PuiToastIconName>
> = {
  success: 'circle-check',
  error: 'circle-alert',
  warning: 'triangle-alert',
  info: 'info',
  loading: 'loader-circle',
  default: 'info',
};

export function resolveToastIconName(
  variant: string,
  explicit?: PuiToastIconName | null
): PuiToastIconName | null {
  if (explicit === null) {
    return null;
  }

  if (explicit) {
    return explicit;
  }

  if (variant === 'success' || variant === 'error' || variant === 'warning' || variant === 'info' || variant === 'loading') {
    return PUI_TOAST_SEMANTIC_ICONS[variant];
  }

  if (variant === 'rich') {
    return PUI_TOAST_SEMANTIC_ICONS.info;
  }

  return null;
}

/** Lucide-style stroke paths (24×24, 2px stroke). */
export const PUI_TOAST_ICON_PATHS: Readonly<Record<PuiToastIconName, readonly string[]>> = {
  'circle-check': [
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'm9 12 2 2 4-4',
  ],
  'circle-alert': [
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'M12 8v4',
    'M12 16h.01',
  ],
  'triangle-alert': [
    'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
    'M12 9v4',
    'M12 17h.01',
  ],
  info: ['M12 16v-4', 'M12 8h.01', 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'],
  'loader-circle': ['M12 2v4', 'M12 18v4', 'M4.93 4.93l2.83 2.83', 'M16.24 16.24l2.83 2.83', 'M2 12h4', 'M18 12h4', 'M4.93 19.07l2.83-2.83', 'M16.24 7.76l2.83-2.83'],
  bell: ['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'M10.3 21a1.94 1.94 0 0 0 3.4 0'],
};
