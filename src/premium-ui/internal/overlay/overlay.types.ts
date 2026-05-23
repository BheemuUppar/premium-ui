export type PuiOverlayPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface PuiOverlayConfig {
  readonly panelClass?: string | string[];
  readonly hasBackdrop?: boolean;
  readonly closeOnEscape?: boolean;
  readonly closeOnOutsideClick?: boolean;
}
