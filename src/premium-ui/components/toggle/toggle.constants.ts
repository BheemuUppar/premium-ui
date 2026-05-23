import type {
  PuiToggleDensity,
  PuiToggleGroupMode,
  PuiToggleShape,
  PuiToggleVariant,
} from './toggle.types';

export const PUI_TOGGLE_VARIANTS: readonly PuiToggleVariant[] = [
  'default',
  'subtle',
  'soft',
  'outline',
  'ghost',
  'elevated',
  'glass',
];

export const PUI_TOGGLE_GROUP_MODES: readonly PuiToggleGroupMode[] = [
  'default',
  'segmented',
  'toolbar',
];

export const PUI_TOGGLE_SHAPES: readonly PuiToggleShape[] = ['square', 'rounded', 'pill'];

export const PUI_TOGGLE_DENSITIES: readonly PuiToggleDensity[] = [
  'compact',
  'default',
  'comfortable',
];
