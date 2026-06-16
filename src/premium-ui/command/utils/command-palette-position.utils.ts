export interface PuiCommandPointer {
  readonly x: number;
  readonly y: number;
}

export interface PuiCommandPaletteLayout {
  readonly width: number;
  readonly maxHeight: number;
}

export interface PuiCommandPaletteResolvedPosition {
  readonly top: number;
  readonly left: number;
  readonly originX: number;
  readonly originY: number;
}

const VIEWPORT_PADDING = 16;
const CURSOR_OFFSET_Y = 12;
const DEFAULT_PANEL_WIDTH = 640;
const DEFAULT_PANEL_MAX_HEIGHT = 420;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Positions the palette near the pointer, clamped to the viewport (macOS-style). */
export function resolvePalettePositionAtPointer(
  pointer: PuiCommandPointer,
  layout: Partial<PuiCommandPaletteLayout> = {},
  viewport?: { readonly width: number; readonly height: number }
): PuiCommandPaletteResolvedPosition {
  const width = layout.width ?? DEFAULT_PANEL_WIDTH;
  const maxHeight = layout.maxHeight ?? DEFAULT_PANEL_MAX_HEIGHT;
  const viewWidth = viewport?.width ?? window.innerWidth;
  const viewHeight = viewport?.height ?? window.innerHeight;

  const panelWidth = Math.min(width, viewWidth - VIEWPORT_PADDING * 2);

  let left = pointer.x - panelWidth / 2;
  let top = pointer.y - CURSOR_OFFSET_Y;

  left = clamp(left, VIEWPORT_PADDING, viewWidth - panelWidth - VIEWPORT_PADDING);
  top = clamp(top, VIEWPORT_PADDING, viewHeight - maxHeight - VIEWPORT_PADDING);

  const originX = clamp(pointer.x - left, 0, panelWidth);
  const originY = clamp(pointer.y - top, 0, maxHeight);

  return { top, left, originX, originY };
}

/** Fallback when no pointer is available (keyboard-only open). */
export function resolvePalettePositionCentered(
  layout: Partial<PuiCommandPaletteLayout> = {},
  viewport?: { readonly width: number; readonly height: number }
): PuiCommandPaletteResolvedPosition {
  const width = layout.width ?? DEFAULT_PANEL_WIDTH;
  const viewWidth = viewport?.width ?? window.innerWidth;
  const viewHeight = viewport?.height ?? window.innerHeight;
  const panelWidth = Math.min(width, viewWidth - VIEWPORT_PADDING * 2);
  const left = (viewWidth - panelWidth) / 2;
  const top = viewHeight * 0.18;

  return {
    top,
    left,
    originX: panelWidth / 2,
    originY: 0,
  };
}
