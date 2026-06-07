export type PuiOverlayScrollStrategy = 'block' | 'reposition' | 'noop';

export type PuiOverlayPositionPreset = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface PuiOverlayPositionOffset {
  readonly top?: string;
  readonly bottom?: string;
  readonly left?: string;
  readonly right?: string;
}

export type PuiOverlayPosition = PuiOverlayPositionPreset | PuiOverlayPositionOffset;

export interface PuiOverlaySizeConfig {
  readonly width?: string;
  readonly height?: string;
  readonly minWidth?: string;
  readonly minHeight?: string;
  readonly maxWidth?: string;
  readonly maxHeight?: string;
}

export interface PuiOverlayConfig {
  readonly panelClass?: string | readonly string[];
  readonly backdrop?: boolean;
  readonly backdropClass?: string | readonly string[];
  readonly backdropClosable?: boolean;
  readonly closeOnEscape?: boolean;
  readonly position?: PuiOverlayPosition;
  readonly scrollStrategy?: PuiOverlayScrollStrategy;
  readonly size?: PuiOverlaySizeConfig;
  readonly ariaLabel?: string;
  readonly ariaLabelledBy?: string;
  readonly ariaDescribedBy?: string;
  readonly role?: string;
  readonly disposeOnNavigation?: boolean;
  /** When false, uses the classic CDK overlay container (recommended for centered dialogs). */
  readonly usePopover?: boolean;
}
