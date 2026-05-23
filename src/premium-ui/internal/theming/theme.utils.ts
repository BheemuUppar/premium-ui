import type { PuiTheme } from '../../types/common.types';

export function resolveThemeContext(element: Element | null): PuiTheme {
  if (!element) {
    return 'light';
  }

  const themed = element.closest('[data-theme]');
  const theme = themed?.getAttribute('data-theme');
  return theme === 'dark' ? 'dark' : 'light';
}

export function resolveThemeFromAttribute(value: string | null | undefined): PuiTheme {
  return value === 'dark' ? 'dark' : 'light';
}
