import type { PuiCommandPaletteAnimation } from '../registry/command.types';

/** Close animation duration per variant — must match overlay SCSS. */
export const PUI_COMMAND_PALETTE_CLOSE_MS: Readonly<Record<PuiCommandPaletteAnimation, number>> = {
  macos: 130,
  minimal: 140,
  smooth: 200,
};

export function resolveCommandPalettePanelClass(animation: PuiCommandPaletteAnimation): string | null {
  switch (animation) {
    case 'minimal':
      return 'pui-command-palette-panel--minimal';
    case 'smooth':
      return 'pui-command-palette-panel--smooth';
    default:
      return null;
  }
}

export function resolveCommandPaletteBackdropClass(animation: PuiCommandPaletteAnimation): string | null {
  return animation === 'smooth' ? 'pui-command-palette-backdrop--smooth' : null;
}

export function usesCursorTransformOrigin(animation: PuiCommandPaletteAnimation): boolean {
  return animation === 'macos' || animation === 'smooth';
}
