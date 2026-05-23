import type { PuiSelectionValue, PuiSize } from '../../types/common.types';

/** Premium visual surface styles for toggles. */
export type PuiToggleVariant =
  | 'default'
  | 'subtle'
  | 'soft'
  | 'outline'
  | 'ghost'
  | 'elevated'
  | 'glass';

/** Layout/interaction mode for toggle groups. */
export type PuiToggleGroupMode = 'default' | 'segmented' | 'toolbar';

/** Corner shape for toggles and groups. */
export type PuiToggleShape = 'square' | 'rounded' | 'pill';

/** Spacing density for toggles and groups. */
export type PuiToggleDensity = 'compact' | 'default' | 'comfortable';

export type PuiToggleSize = PuiSize;

export type PuiToggleValue = PuiSelectionValue;

export type PuiToggleOrientation = 'horizontal' | 'vertical';
