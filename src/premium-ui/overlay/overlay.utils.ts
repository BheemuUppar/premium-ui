import type { OverlayRef } from '@angular/cdk/overlay';
import { GlobalPositionStrategy, PositionStrategy } from '@angular/cdk/overlay';
import type {
  PuiOverlayConfig,
  PuiOverlayPosition,
  PuiOverlayPositionOffset,
  PuiOverlayPositionPreset,
  PuiOverlaySizeConfig,
} from './overlay-config.types';

const PRESET_POSITIONS: Readonly<Record<PuiOverlayPositionPreset, (strategy: GlobalPositionStrategy) => GlobalPositionStrategy>> = {
  center: (strategy) => strategy.centerHorizontally().centerVertically(),
  top: (strategy) => strategy.top('24px').centerHorizontally(),
  bottom: (strategy) => strategy.bottom('24px').centerHorizontally(),
  left: (strategy) => strategy.left('24px').centerVertically(),
  right: (strategy) => strategy.right('24px').centerVertically(),
};

function isPresetPosition(position: PuiOverlayPosition): position is PuiOverlayPositionPreset {
  return typeof position === 'string';
}

export function buildOverlayPositionStrategy(
  positionFactory: () => GlobalPositionStrategy,
  position: PuiOverlayPosition = 'center'
): PositionStrategy {
  const strategy = positionFactory();

  if (isPresetPosition(position)) {
    return PRESET_POSITIONS[position](strategy);
  }

  return applyOffsetPosition(strategy, position);
}

function applyOffsetPosition(
  strategy: GlobalPositionStrategy,
  offset: PuiOverlayPositionOffset
): GlobalPositionStrategy {
  if (offset.top) {
    strategy.top(offset.top);
  }
  if (offset.bottom) {
    strategy.bottom(offset.bottom);
  }
  if (offset.left) {
    strategy.left(offset.left);
  }
  if (offset.right) {
    strategy.right(offset.right);
  }

  return strategy;
}

export function overlayPanelStyles(size?: PuiOverlaySizeConfig): Record<string, string> {
  if (!size) {
    return {};
  }

  const styles: Record<string, string> = {};

  if (size.width) styles['width'] = size.width;
  if (size.height) styles['height'] = size.height;
  if (size.minWidth) styles['min-width'] = size.minWidth;
  if (size.minHeight) styles['min-height'] = size.minHeight;
  if (size.maxWidth) styles['max-width'] = size.maxWidth;
  if (size.maxHeight) styles['max-height'] = size.maxHeight;

  return styles;
}

/** CDK `overlayElement` is the pane itself; querySelector only matches descendants. */
export function resolveOverlayPane(overlayRef: OverlayRef): HTMLElement {
  const element = overlayRef.overlayElement;

  if (element.classList.contains('cdk-overlay-pane')) {
    return element;
  }

  return (element.querySelector('.cdk-overlay-pane') as HTMLElement | null) ?? element;
}

export function normalizePanelClasses(panelClass?: string | readonly string[]): string[] {
  if (!panelClass) {
    return [];
  }

  if (typeof panelClass === 'string') {
    return panelClass.trim().split(/\s+/).filter(Boolean);
  }

  return [...panelClass];
}

export function mergeOverlayConfig(
  defaults: PuiOverlayConfig,
  overrides?: PuiOverlayConfig
): PuiOverlayConfig {
  if (!overrides) {
    return defaults;
  }

  return {
    ...defaults,
    ...overrides,
    panelClass: overrides.panelClass ?? defaults.panelClass,
    backdropClass: overrides.backdropClass ?? defaults.backdropClass,
    size: { ...defaults.size, ...overrides.size },
  };
}
