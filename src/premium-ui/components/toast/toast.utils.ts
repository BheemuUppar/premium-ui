import type {
  PuiToastAriaLive,
  PuiToastData,
  PuiToastInput,
  PuiToastMessage,
  PuiToastOptions,
  PuiToastPosition,
  PuiToastVariant,
} from './toast.types';
import { resolveToastIconName, type PuiToastIconName } from './toast-icons';

export const PUI_TOAST_POSITIONS: readonly PuiToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

export const PUI_TOAST_DEFAULT_DURATION_MS = 4000;
export const PUI_TOAST_SNACKBAR_DURATION_MS = 5000;
export const PUI_TOAST_COMPACT_DURATION_MS = 2500;
export const PUI_TOAST_MAX_VISIBLE = 5;
export const PUI_TOAST_EXIT_MS = 280;

let toastIdCounter = 0;

export function createToastId(explicit?: string): string {
  if (explicit?.trim()) {
    return explicit.trim();
  }

  toastIdCounter += 1;
  return `pui-toast-${toastIdCounter}`;
}

export function resolveToastPosition(
  variant: PuiToastVariant,
  position?: PuiToastPosition
): PuiToastPosition {
  if (position) {
    return position;
  }

  if (variant === 'snackbar') {
    return 'bottom-center';
  }

  return 'bottom-right';
}

export function resolveToastDuration(
  variant: PuiToastVariant,
  duration?: number | null
): number | null {
  if (duration === null) {
    return null;
  }

  if (typeof duration === 'number') {
    return Math.max(0, duration);
  }

  if (variant === 'loading') {
    return null;
  }

  if (variant === 'snackbar') {
    return PUI_TOAST_SNACKBAR_DURATION_MS;
  }

  if (variant === 'compact') {
    return PUI_TOAST_COMPACT_DURATION_MS;
  }

  return PUI_TOAST_DEFAULT_DURATION_MS;
}

export function resolveToastAriaLive(
  variant: PuiToastVariant,
  ariaLive?: PuiToastAriaLive
): PuiToastAriaLive {
  if (ariaLive) {
    return ariaLive;
  }

  return variant === 'error' || variant === 'warning' ? 'assertive' : 'polite';
}

export function shouldShowToastIcon(
  variant: PuiToastVariant,
  icon?: boolean,
  iconName?: PuiToastIconName | null
): boolean {
  if (iconName === null || icon === false) {
    return false;
  }

  if (iconName || icon === true) {
    return true;
  }

  return variant !== 'snackbar' && variant !== 'compact' && variant !== 'default';
}

export function resolveToastIcon(
  variant: PuiToastVariant,
  options: Pick<PuiToastOptions, 'icon' | 'iconName'>
): PuiToastIconName | null {
  if (options.icon === false || options.iconName === null) {
    return null;
  }

  if (options.iconName) {
    return options.iconName;
  }

  if (!shouldShowToastIcon(variant, options.icon, options.iconName)) {
    return null;
  }

  return resolveToastIconName(variant, undefined);
}

export function normalizeToastInput(
  input: PuiToastMessage,
  defaultVariant?: PuiToastVariant
): { title: string; options: PuiToastOptions } {
  if (typeof input === 'string') {
    return {
      title: input.trim(),
      options: defaultVariant ? { variant: defaultVariant } : {},
    };
  }

  const {
    title,
    description,
    actionLabel,
    onAction,
    action,
    icon,
    variant,
    ...rest
  } = input;

  const resolvedAction =
    action ??
    (actionLabel
      ? {
          label: actionLabel,
          onClick: onAction,
        }
      : undefined);

  return {
    title: title.trim(),
    options: {
      ...rest,
      description,
      variant: variant ?? defaultVariant,
      action: resolvedAction,
      icon: icon === false ? false : icon ? true : undefined,
      iconName: typeof icon === 'string' ? icon : undefined,
    },
  };
}

export function isToastDismissible(variant: PuiToastVariant, dismissible?: boolean): boolean {
  if (typeof dismissible === 'boolean') {
    return dismissible;
  }

  return variant !== 'loading';
}

export function normalizeToastMessage(message: string): { title: string; description?: string } {
  const trimmed = message.trim();
  return { title: trimmed };
}

export function buildToastData(
  title: string,
  options: PuiToastOptions = {}
): PuiToastData {
  const variant = options.variant ?? 'default';
  const duration = resolveToastDuration(variant, options.duration);
  const now = Date.now();

  const iconName = resolveToastIcon(variant, options);

  return {
    id: createToastId(options.id),
    title,
    description: options.description,
    variant,
    position: resolveToastPosition(variant, options.position),
    duration,
    dismissible: isToastDismissible(variant, options.dismissible),
    showIcon: iconName !== null,
    iconName,
    action:
      options.action ??
      (options.actionLabel
        ? { label: options.actionLabel, onClick: options.onAction }
        : undefined),
    className: options.className,
    ariaLive: resolveToastAriaLive(variant, options.ariaLive),
    state: 'entering',
    createdAt: now,
    paused: false,
    remainingMs: duration ?? 0,
  };
}

export function groupToastsByPosition(
  toasts: readonly PuiToastData[]
): Readonly<Record<PuiToastPosition, readonly PuiToastData[]>> {
  const grouped = Object.fromEntries(
    PUI_TOAST_POSITIONS.map((position) => [position, [] as PuiToastData[]])
  ) as Record<PuiToastPosition, PuiToastData[]>;

  for (const toast of toasts) {
    grouped[toast.position].push(toast);
  }

  for (const position of PUI_TOAST_POSITIONS) {
    grouped[position].sort((a, b) => a.createdAt - b.createdAt);
  }

  return grouped;
}

export function trimToastsForPosition(
  toasts: readonly PuiToastData[],
  position: PuiToastPosition,
  maxVisible = PUI_TOAST_MAX_VISIBLE
): readonly string[] {
  const atPosition = toasts.filter((toast) => toast.position === position && toast.state !== 'exiting');
  if (atPosition.length <= maxVisible) {
    return [];
  }

  const overflow = atPosition.length - maxVisible;
  return atPosition.slice(0, overflow).map((toast) => toast.id);
}
