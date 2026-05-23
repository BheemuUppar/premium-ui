import type { PuiTabsVariant } from './tabs.types';

export function isSlidingIndicatorVariant(variant: PuiTabsVariant): boolean {
  return variant === 'segmented' || variant === 'segmented-soft' || variant === 'pill';
}
