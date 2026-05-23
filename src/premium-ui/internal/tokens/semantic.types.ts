export type { PuiSize, PuiVariant, PuiIntent, PuiTheme } from '../../types/common.types';

/** Semantic interaction tokens referenced by component styles. */
export interface PuiInteractionTokens {
  readonly duration: string;
  readonly easing: string;
}

/** Standard component token prefix convention. */
export function puiComponentTokenPrefix(component: string): string {
  return `--pui-${component}`;
}
