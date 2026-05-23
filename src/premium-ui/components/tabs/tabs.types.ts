import type { PuiSize } from '../../types/common.types';

export type PuiTabsVariant = 'underline' | 'segmented' | 'segmented-soft' | 'pill';
export type PuiTabsOrientation = 'horizontal' | 'vertical';
export type PuiTabsSize = PuiSize;

/** @deprecated Use PuiTabsVariant */
export type TabsVariant = PuiTabsVariant;
/** @deprecated Use PuiTabsOrientation */
export type TabsOrientation = PuiTabsOrientation;
/** @deprecated Use PuiTabsSize */
export type TabsSize = PuiTabsSize;
