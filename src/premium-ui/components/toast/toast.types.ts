import type { PuiToastIconName } from './toast-icons';

export type { PuiToastIconName } from './toast-icons';

export type PuiToastVariant =
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'loading'
  | 'snackbar'
  | 'compact'
  | 'rich';

export type PuiToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type PuiToastAriaLive = 'polite' | 'assertive';

export type PuiToastState = 'entering' | 'visible' | 'exiting';

export interface PuiToastAction {
  readonly label: string;
  readonly onClick?: () => void;
  readonly ariaLabel?: string;
}

/** Ergonomic object input for toast methods. */
export interface PuiToastInput {
  readonly title: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly action?: PuiToastAction;
  readonly icon?: PuiToastIconName | false;
  readonly duration?: number | null;
  readonly position?: PuiToastPosition;
  readonly dismissible?: boolean;
  readonly className?: string;
  readonly ariaLive?: PuiToastAriaLive;
  readonly id?: string;
  readonly variant?: PuiToastVariant;
}

export interface PuiToastData {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly variant: PuiToastVariant;
  readonly position: PuiToastPosition;
  readonly duration: number | null;
  readonly dismissible: boolean;
  readonly showIcon: boolean;
  readonly iconName: PuiToastIconName | null;
  readonly action?: PuiToastAction;
  readonly className?: string;
  readonly ariaLive: PuiToastAriaLive;
  readonly state: PuiToastState;
  readonly createdAt: number;
  readonly paused: boolean;
  readonly remainingMs: number;
}

export interface PuiToastOptions {
  readonly id?: string;
  readonly title?: string;
  readonly description?: string;
  readonly variant?: PuiToastVariant;
  readonly position?: PuiToastPosition;
  readonly duration?: number | null;
  readonly dismissible?: boolean;
  readonly icon?: boolean;
  readonly iconName?: PuiToastIconName | null;
  readonly action?: PuiToastAction;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly className?: string;
  readonly ariaLive?: PuiToastAriaLive;
}

export interface PuiToastPromiseMessages<T = unknown> {
  readonly loading: string;
  readonly success: string | ((value: T) => string);
  readonly error: string | ((error: unknown) => string);
}

export type PuiToastMessage = string | PuiToastInput;
