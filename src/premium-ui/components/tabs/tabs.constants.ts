import type { PuiTabsOrientation, PuiTabsSize, PuiTabsVariant } from './tabs.types';

export const PUI_TABS_VARIANTS = [
  'underline',
  'segmented',
  'segmented-soft',
  'pill',
] as const satisfies readonly PuiTabsVariant[];

export const PUI_TABS_ORIENTATIONS = ['horizontal', 'vertical'] as const satisfies readonly PuiTabsOrientation[];

export const PUI_TABS_SIZES = ['sm', 'md', 'lg'] as const satisfies readonly PuiTabsSize[];
