import type { PuiOverlaySizeConfig } from '../../overlay/overlay-config.types';
import type { PuiDialogConfig, PuiDialogVariant } from './dialog.types';

/** Inset fullscreen dimensions — viewport units with margin on all sides. */
export const PUI_DIALOG_FULLSCREEN_SIZE: PuiOverlaySizeConfig = {
  width: '96vw',
  height: '96vh',
};

const VARIANT_DEFAULTS: Readonly<Record<PuiDialogVariant, Partial<PuiDialogConfig>>> = {
  default: {
    size: { width: '32rem', maxWidth: 'calc(100vw - 2rem)' },
    panelClass: ['pui-dialog-panel'],
  },
  confirm: {
    size: { width: '28rem', maxWidth: 'calc(100vw - 2rem)' },
    panelClass: ['pui-dialog-panel', 'pui-dialog-panel--confirm'],
  },
  fullscreen: {
    position: 'center',
    size: PUI_DIALOG_FULLSCREEN_SIZE,
    panelClass: ['pui-dialog-panel', 'pui-dialog-panel--fullscreen'],
  },
  sheet: {
    position: 'bottom',
    size: {
      width: 'calc(100vw - 2rem)',
      maxWidth: 'calc(100vw - 2rem)',
      maxHeight: 'calc(90vh - 1rem)',
    },
    panelClass: ['pui-dialog-panel', 'pui-dialog-panel--sheet'],
  },
  danger: {
    size: { width: '28rem', maxWidth: 'calc(100vw - 2rem)' },
    panelClass: ['pui-dialog-panel', 'pui-dialog-panel--danger'],
  },
};

export const PUI_DIALOG_DEFAULT_CONFIG: PuiDialogConfig = {
  backdrop: true,
  backdropClosable: true,
  closeOnEscape: true,
  position: 'center',
  scrollStrategy: 'block',
  variant: 'default',
  role: 'dialog',
  panelClass: ['pui-dialog-panel'],
  backdropClass: 'pui-dialog-backdrop',
  size: {
    width: '32rem',
    maxWidth: 'calc(100vw - 2rem)',
  },
};

export function resolveDialogConfig<D>(config?: PuiDialogConfig<D>): PuiDialogConfig<D> {
  const variant = config?.variant ?? 'default';
  const variantDefaults = VARIANT_DEFAULTS[variant];

  return {
    ...PUI_DIALOG_DEFAULT_CONFIG,
    ...variantDefaults,
    ...config,
    data: config?.data,
    panelClass: config?.panelClass ?? variantDefaults.panelClass ?? PUI_DIALOG_DEFAULT_CONFIG.panelClass,
    backdropClass: config?.backdropClass ?? PUI_DIALOG_DEFAULT_CONFIG.backdropClass,
    size: resolveDialogSize(variant, config?.size, variantDefaults.size),
  } as PuiDialogConfig<D>;
}

function resolveDialogSize(
  variant: PuiDialogVariant,
  configSize?: PuiOverlaySizeConfig,
  variantSize?: PuiOverlaySizeConfig
): PuiOverlaySizeConfig {
  if (variant === 'fullscreen') {
    return {
      width: configSize?.width ?? PUI_DIALOG_FULLSCREEN_SIZE.width,
      height: configSize?.height ?? PUI_DIALOG_FULLSCREEN_SIZE.height,
    };
  }

  return {
    ...PUI_DIALOG_DEFAULT_CONFIG.size,
    ...variantSize,
    ...configSize,
  };
}
