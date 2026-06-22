import type { ConnectedPosition } from '@angular/cdk/overlay';
import type { PuiOverlayScrollStrategy } from './overlay-config.types';

export interface PuiAnchoredOverlayConfig {
  readonly positions?: readonly ConnectedPosition[];
  readonly backdrop?: boolean;
  readonly backdropClosable?: boolean;
  readonly closeOnEscape?: boolean;
  readonly scrollStrategy?: PuiOverlayScrollStrategy;
  readonly panelClass?: string | readonly string[];
  readonly backdropClass?: string | readonly string[];
  readonly mobileSheet?: boolean;
  readonly width?: string;
  readonly minWidth?: string;
  readonly maxWidth?: string;
  readonly maxHeight?: string;
}
