export const PUI_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

export type PuiKey = (typeof PUI_KEYS)[keyof typeof PUI_KEYS];

export function isNavigationKey(key: string): boolean {
  return (
    key === PUI_KEYS.ARROW_UP ||
    key === PUI_KEYS.ARROW_DOWN ||
    key === PUI_KEYS.ARROW_LEFT ||
    key === PUI_KEYS.ARROW_RIGHT ||
    key === PUI_KEYS.HOME ||
    key === PUI_KEYS.END
  );
}

export function isActivationKey(key: string): boolean {
  return key === PUI_KEYS.ENTER || key === PUI_KEYS.SPACE;
}

export function isTypeaheadKey(key: string): boolean {
  return key.length === 1 && !/\s/.test(key);
}
