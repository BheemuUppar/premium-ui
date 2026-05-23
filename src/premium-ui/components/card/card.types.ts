import type { PuiSize } from '../../types/common.types';

export type PuiCardVariant =
  | 'default'
  | 'outlined'
  | 'elevated'
  | 'ghost'
  | 'glass'
  | 'gradient';

export type PuiCardSize = PuiSize;

export type PuiCardLayout = 'vertical' | 'horizontal';

export type PuiCardImageAspect = 'auto' | 'square' | 'video' | 'wide' | 'portrait';

export type PuiCardImagePosition = 'top' | 'left' | 'right';

export type PuiCardBadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
